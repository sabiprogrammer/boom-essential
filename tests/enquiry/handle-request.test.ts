import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { enquiryRequestMaxBytes } from "@/lib/enquiry/api-contract";
import type { DatabaseSubmitResult } from "@/lib/enquiry/server/database-result";
import { handleEnquiryRequest } from "@/lib/enquiry/server/handle-request";
import type { ParsedEnquiry } from "@/lib/enquiry/server/parse";

const ID = "a3bb189e-8bf9-4888-9912-ace4e6543002";
const NOW = new Date("2026-11-13T10:00:00Z");

const validBody = () => ({
  submissionId: ID,
  customer: { fullName: "Ada Obi", phone: "08031234567", email: null, organisation: null, location: null },
  target: { category: "general", interests: [] },
  message: "A perfectly ordinary test message.",
  type: "enquiry",
  appointment: null,
  source: { page: "/contact", prefilled: false },
  honeypot: "",
});

function request(body: unknown, headers: Record<string, string> = {}, raw?: string) {
  return new Request("https://boom.example/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://boom.example", "x-forwarded-host": "boom.example", "x-real-ip": "203.0.113.7", ...headers },
    body: raw ?? JSON.stringify(body),
  });
}

function harness(result: DatabaseSubmitResult | (() => Promise<DatabaseSubmitResult>) = { kind: "saved", reference: "BOOM-2026-00042", appointmentRequested: false, duplicate: false }) {
  const calls: { parsed: ParsedEnquiry; clientKey: string }[] = [];
  return {
    calls,
    deps: {
      now: () => NOW,
      submit: async (parsed: ParsedEnquiry, clientKey: string) => {
        calls.push({ parsed, clientKey });
        return typeof result === "function" ? result() : result;
      },
    },
  };
}

async function json(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

describe("POST /api/enquiries pipeline", () => {
  it("returns 201 with the database's reference once the database confirms", async () => {
    const { deps, calls } = harness();
    const response = await handleEnquiryRequest(request(validBody()), deps);
    assert.equal(response.status, 201);
    assert.deepEqual(await json(response), { ok: true, reference: "BOOM-2026-00042", appointmentRequested: false });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].clientKey, "203.0.113.7");
  });

  it("the response is private and not indexable", async () => {
    const response = await handleEnquiryRequest(request(validBody()), harness().deps);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
  });

  it("returns 200 (not 201) when an earlier identical submission is being confirmed again", async () => {
    const { deps } = harness({ kind: "saved", reference: "BOOM-2026-00042", appointmentRequested: false, duplicate: true });
    const response = await handleEnquiryRequest(request(validBody()), deps);
    assert.equal(response.status, 200);
    assert.equal((await json(response)).ok, true);
  });

  it("passes only validated values to the database, never a client-supplied status, id, reference or timestamp", async () => {
    const { deps, calls } = harness();
    const body = { ...validBody(), id: "x", reference: "BOOM-1999-00001", status: "resolved", source: "admin", created_at: "2000-01-01" };
    await handleEnquiryRequest(request(body), deps);
    const keys = Object.keys(calls[0].parsed);
    for (const forbidden of ["id", "reference", "status", "source", "created_at"]) assert.ok(!keys.includes(forbidden), forbidden);
  });

  it("reports an appointment request from the database's answer, and the preferred slot reaches the database", async () => {
    const { deps, calls } = harness({ kind: "saved", reference: "BOOM-2026-00043", appointmentRequested: true, duplicate: false });
    const body = { ...validBody(), type: "appointment_request", appointment: { preferredDate: "2026-11-20", preferredTime: "09:30" } };
    const response = await handleEnquiryRequest(request(body), deps);
    assert.equal((await json(response)).appointmentRequested, true);
    assert.deepEqual(calls[0].parsed.appointment, { preferredDate: "2026-11-20", preferredTime: "09:30" });
  });

  it("the client's 'type' cannot create an appointment: without an appointment object there is none", async () => {
    const { deps, calls } = harness();
    await handleEnquiryRequest(request({ ...validBody(), type: "appointment_request" }), deps);
    assert.equal(calls[0].parsed.appointment, null);
  });

  it("uses the Lagos calendar day for 'today': a date that is already past in Lagos is refused", async () => {
    const lateInLagos = { now: () => new Date("2026-11-13T23:30:00Z"), submit: harness().deps.submit }; // already 00:30 on the 14th in Lagos
    const body = { ...validBody(), appointment: { preferredDate: "2026-11-13", preferredTime: "09:30" } };
    const response = await handleEnquiryRequest(request(body), lateInLagos);
    assert.equal(response.status, 400);
    assert.ok(((await json(response)).fieldErrors as Record<string, string>).preferredDate);
  });

  it("refuses a request from another origin or with no origin, without calling the database", async () => {
    const { deps, calls } = harness();
    assert.equal((await handleEnquiryRequest(request(validBody(), { origin: "https://evil.example" }), deps)).status, 400);
    const noOrigin = new Request("https://boom.example/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validBody()) });
    assert.equal((await handleEnquiryRequest(noOrigin, deps)).status, 400);
    assert.equal(calls.length, 0);
  });

  it("refuses a body that is not JSON (415), too large (413) or unparsable (400)", async () => {
    const { deps, calls } = harness();
    assert.equal((await handleEnquiryRequest(request(null, { "content-type": "text/plain" }, "hello"), deps)).status, 415);
    assert.equal((await handleEnquiryRequest(request(null, {}, "x".repeat(enquiryRequestMaxBytes + 1)), deps)).status, 413);
    const bad = await handleEnquiryRequest(request(null, {}, "{not json"), deps);
    assert.equal(bad.status, 400);
    assert.equal((await json(bad)).code, "invalid");
    assert.equal(calls.length, 0);
  });

  it("stops an oversized body even when it declares no length", async () => {
    const chunk = new TextEncoder().encode("x".repeat(4096));
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (sent > enquiryRequestMaxBytes * 4) return controller.close();
        sent += chunk.byteLength;
        controller.enqueue(chunk);
      },
    });
    const streamed = new Request("https://boom.example/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://boom.example", "x-forwarded-host": "boom.example" },
      body: stream,
      duplex: "half",
    } as RequestInit);
    const response = await handleEnquiryRequest(streamed, harness().deps);
    assert.equal(response.status, 413);
    assert.ok(sent < enquiryRequestMaxBytes * 4, "reading stopped early");
  });

  it("rejects a filled honeypot as spam, before validation and without calling the database", async () => {
    const { deps, calls } = harness();
    const response = await handleEnquiryRequest(request({ ...validBody(), honeypot: "http://spam.example" }), deps);
    assert.equal(response.status, 400);
    const body = await json(response);
    assert.equal(body.code, "rejected");
    assert.equal(body.fieldErrors, undefined, "a bot learns nothing about which fields were wrong");
    assert.equal(calls.length, 0);
  });

  it("returns field errors for invalid data and never calls the database", async () => {
    const { deps, calls } = harness();
    const response = await handleEnquiryRequest(request({ ...validBody(), customer: { fullName: "", phone: "x" }, message: "no" }), deps);
    assert.equal(response.status, 400);
    const body = await json(response);
    assert.equal(body.code, "invalid");
    assert.deepEqual(Object.keys(body.fieldErrors as object).sort(), ["fullName", "message", "phone"]);
    assert.equal(calls.length, 0);
  });

  it("maps a rate limit to 429 with Retry-After", async () => {
    const response = await handleEnquiryRequest(request(validBody()), harness({ kind: "rate_limited" }).deps);
    assert.equal(response.status, 429);
    assert.ok(response.headers.get("retry-after"));
    assert.equal((await json(response)).code, "rate_limited");
  });

  it("never reports success when the database did not confirm: unavailable, rejected, or a thrown error", async () => {
    for (const result of [{ kind: "unavailable" } as const, { kind: "rejected" } as const]) {
      const response = await handleEnquiryRequest(request(validBody()), harness(result).deps);
      assert.equal((await json(response)).ok, false);
      assert.ok(response.status >= 400);
    }
    const thrown = await handleEnquiryRequest(
      request(validBody()),
      harness(async () => {
        throw new Error("connection refused: password=hunter2 host=db.internal");
      }).deps,
    );
    assert.equal(thrown.status, 503);
    const text = JSON.stringify(await json(thrown));
    assert.doesNotMatch(text, /hunter2|db\.internal|connection refused/, "no internal detail leaks to the visitor");
  });

  it("answers an unavailable service with 503 and a fixed message", async () => {
    const response = await handleEnquiryRequest(request(validBody()), harness({ kind: "unavailable" }).deps);
    assert.equal(response.status, 503);
    assert.equal((await json(response)).code, "unavailable");
  });
});
