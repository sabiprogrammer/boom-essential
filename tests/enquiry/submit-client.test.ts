import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { submitEnquiry } from "@/lib/enquiry/submit";
import type { EnquirySubmission } from "@/lib/enquiry/types";

const submission: EnquirySubmission = {
  customer: { fullName: "Ada Obi", phone: "08031234567", email: null, organisation: null, location: null },
  target: { category: "general", interests: [] },
  message: "A perfectly ordinary test message.",
  type: "enquiry",
  appointment: null,
  source: { page: "/contact", prefilled: false },
  honeypot: "",
};
const ID = "a3bb189e-8bf9-4888-9912-ace4e6543002";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const calls: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return handler(String(url), init ?? {});
  }) as typeof fetch;
  return calls;
}

describe("the browser's submit call", () => {
  it("posts the validated form plus the submission id to /api/enquiries and nothing else", async () => {
    const calls = stubFetch(() => Response.json({ ok: true, reference: "BOOM-2026-00042", appointmentRequested: false }, { status: 201 }));
    const result = await submitEnquiry(submission, ID);
    assert.deepEqual(result, { ok: true, reference: "BOOM-2026-00042", appointmentRequested: false });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "/api/enquiries");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.cache, "no-store");
    const sent = JSON.parse(String(calls[0].init.body));
    assert.equal(sent.submissionId, ID);
    assert.equal(sent.customer.fullName, "Ada Obi");
    for (const forbidden of ["id", "reference", "status", "created_at"]) assert.ok(!(forbidden in sent), forbidden);
  });

  it("reports success only for a 2xx answer that says ok and carries a valid reference", async () => {
    stubFetch(() => Response.json({ ok: true }, { status: 201 }));
    assert.equal((await submitEnquiry(submission, ID)).ok, false, "no reference");
    stubFetch(() => Response.json({ ok: true, reference: "not-a-reference" }, { status: 201 }));
    assert.equal((await submitEnquiry(submission, ID)).ok, false, "malformed reference");
    stubFetch(() => Response.json({ ok: true, reference: "BOOM-2026-00042" }, { status: 500 }));
    assert.equal((await submitEnquiry(submission, ID)).ok, false, "an error status is never success");
    stubFetch(() => new Response("<html>Bad gateway</html>", { status: 200 }));
    assert.equal((await submitEnquiry(submission, ID)).ok, false, "a non-JSON 200 (for example a proxy page) is not a confirmation");
  });

  it("a network failure is reported as unconfirmed, with a message that says retrying is safe", async () => {
    stubFetch(() => {
      throw new TypeError("fetch failed");
    });
    const result = await submitEnquiry(submission, ID);
    assert.equal(result.ok, false);
    assert.equal((result as { reason: string }).reason, "network");
    assert.match((result as { message: string }).message, /try again/i);
  });

  it("passes the server's field errors through for display", async () => {
    stubFetch(() => Response.json({ ok: false, code: "invalid", message: "Some details need attention.", fieldErrors: { phone: "Enter a valid phone number." } }, { status: 400 }));
    const result = await submitEnquiry(submission, ID);
    assert.deepEqual(result, { ok: false, reason: "invalid", message: "Some details need attention.", fieldErrors: { phone: "Enter a valid phone number." } });
  });

  it("maps rate limiting and an unavailable service", async () => {
    stubFetch(() => Response.json({ ok: false, code: "rate_limited", message: "Try again later." }, { status: 429 }));
    assert.equal(((await submitEnquiry(submission, ID)) as { reason: string }).reason, "rate-limited");
    stubFetch(() => Response.json({ ok: false, code: "unavailable", message: "We could not save your enquiry just now." }, { status: 503 }));
    const unavailable = await submitEnquiry(submission, ID);
    assert.equal((unavailable as { reason: string }).reason, "unavailable");
    stubFetch(() => new Response("gateway timeout", { status: 504 }));
    assert.equal(((await submitEnquiry(submission, ID)) as { reason: string }).reason, "unavailable");
  });

  it("re-sends the same submission id on a retry (so the server can recognise a repeat)", async () => {
    const calls = stubFetch(() => {
      if (calls.length === 1) throw new TypeError("offline");
      return Response.json({ ok: true, reference: "BOOM-2026-00042", appointmentRequested: false }, { status: 200 });
    });
    await submitEnquiry(submission, ID);
    const second = await submitEnquiry(submission, ID);
    assert.equal(second.ok, true);
    assert.equal(JSON.parse(String(calls[0].init.body)).submissionId, JSON.parse(String(calls[1].init.body)).submissionId);
  });
});
