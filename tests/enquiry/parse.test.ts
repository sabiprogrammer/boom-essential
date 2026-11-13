import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { enquiryCategories } from "@/content/enquiry-options";
import { parseEnquiryRequest, type ParsedEnquiry } from "@/lib/enquiry/server/parse";

const TODAY = "2026-11-13";
const ID = "a3bb189e-8bf9-4888-9912-ace4e6543002";

function body(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: ID,
    customer: { fullName: "Ada Obi", phone: "0803 123 4567", email: "ada@example.com", organisation: "Obi Stores", location: "Akure" },
    target: { category: "energy", interests: ["solar-installation", "battery-storage"] },
    message: "We would like a solar quotation for our shop.",
    appointment: null,
    honeypot: "",
    ...overrides,
  };
}

function ok(input: unknown): ParsedEnquiry {
  const result = parseEnquiryRequest(input, TODAY);
  assert.equal(result.ok, true, JSON.stringify(result));
  return (result as { ok: true; value: ParsedEnquiry }).value;
}

function errors(input: unknown) {
  const result = parseEnquiryRequest(input, TODAY);
  assert.equal(result.ok, false);
  return (result as { ok: false; fieldErrors: Record<string, string> }).fieldErrors;
}

describe("server-side parsing of an enquiry", () => {
  it("accepts a complete valid request and maps it to the database fields", () => {
    const value = ok(body());
    assert.equal(value.fullName, "Ada Obi");
    assert.equal(value.phone, "0803 123 4567");
    assert.equal(value.phoneE164, "+2348031234567");
    assert.equal(value.email, "ada@example.com");
    assert.equal(value.division, "energy");
    assert.deepEqual(value.requestedService, ["solar-installation", "battery-storage"]);
    assert.equal(value.requestedItem, null, "energy uses services, never products");
    assert.equal(value.appointment, null);
  });

  it("accepts a request with only the required fields and turns blank optionals into null", () => {
    const value = ok(body({ customer: { fullName: "Ada Obi", phone: "08031234567", email: "  ", organisation: "", location: undefined } }));
    assert.equal(value.email, null);
    assert.equal(value.organisation, null);
    assert.equal(value.location, null);
  });

  it("puts products in requestedItem for foods and industrial equipment, services in requestedService for security", () => {
    assert.deepEqual(ok(body({ target: { category: "foods", interests: ["ofada-rice"] } })).requestedItem, ["ofada-rice"]);
    assert.equal(ok(body({ target: { category: "foods", interests: ["ofada-rice"] } })).requestedService, null);
    assert.deepEqual(ok(body({ target: { category: "industrial-equipment", interests: ["pounding-machine"] } })).requestedItem, ["pounding-machine"]);
    assert.deepEqual(ok(body({ target: { category: "security", interests: ["cctv-installation"] } })).requestedService, ["cctv-installation"]);
  });

  it("a general enquiry has no interests; an empty or missing list is fine", () => {
    const general = ok(body({ target: { category: "general", interests: [] } }));
    assert.equal(general.requestedService, null);
    assert.equal(general.requestedItem, null);
    assert.equal(ok(body({ target: { category: "energy" } })).requestedService, null);
    assert.ok(errors(body({ target: { category: "general", interests: ["garri"] } })).category);
  });

  it("de-duplicates interests", () => {
    assert.deepEqual(ok(body({ target: { category: "energy", interests: ["solar-installation", "solar-installation"] } })).requestedService, ["solar-installation"]);
  });

  it("every category and interest the form offers is accepted", () => {
    for (const category of enquiryCategories) {
      for (const interest of category.interests) {
        ok(body({ target: { category: category.id, interests: [interest.slug] } }));
      }
    }
  });

  it("refuses an unknown category, an unknown interest and an interest from another category", () => {
    assert.ok(errors(body({ target: { category: "plumbing", interests: [] } })).category);
    assert.ok(errors(body({ target: { category: "energy", interests: ["not-a-service"] } })).category);
    assert.ok(errors(body({ target: { category: "energy", interests: ["garri"] } })).category);
    assert.ok(errors(body({ target: { category: "energy", interests: "solar-installation" } })).category);
    assert.ok(errors(body({ target: { category: "energy", interests: [1] } })).category);
    assert.ok(errors(body({ target: {} })).category);
  });

  it("ignores everything it does not know: id, reference, status, source, timestamps and administrative fields", () => {
    const value = ok(
      body({
        id: "11111111-1111-4111-8111-111111111111",
        reference: "BOOM-2026-00001",
        status: "resolved",
        source: "admin",
        created_at: "2020-01-01T00:00:00Z",
        confirmed_by: "someone",
        appointment_status: "confirmed",
        is_admin: true,
      }),
    );
    assert.deepEqual(Object.keys(value).sort(), [
      "appointment", "division", "email", "fullName", "location", "message", "organisation", "phone", "phoneE164",
      "requestedItem", "requestedService", "submissionId",
    ]);
  });

  it("enforces the form's length limits", () => {
    assert.ok(errors(body({ customer: { fullName: "A", phone: "08031234567" } })).fullName);
    assert.ok(errors(body({ customer: { fullName: "A".repeat(101), phone: "08031234567" } })).fullName);
    ok(body({ customer: { fullName: "A".repeat(100), phone: "08031234567" } }));
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "08031234567", organisation: "O".repeat(121) } })).organisation);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "08031234567", location: "L".repeat(121) } })).location);
    assert.ok(errors(body({ message: "too short" })).message);
    assert.ok(errors(body({ message: "m".repeat(2001) })).message);
    ok(body({ message: "m".repeat(2000) }));
  });

  it("validates the phone number, including the stored (typed) length", () => {
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "" } })).phone);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "call me" } })).phone);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "0803" + "-".repeat(40) + "1234567" } })).phone, "longer than 40 typed characters");
    for (const phone of ["08031234567", "+234 803 123 4567", "2348031234567", "+44 20 7946 0958"]) {
      ok(body({ customer: { fullName: "Ada Obi", phone } }));
    }
  });

  it("validates the email address", () => {
    for (const email of ["nope", "a@b", "a b@c.com", "@x.com"]) assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "08031234567", email } })).email, email);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "08031234567", email: "a".repeat(250) + "@x.com" } })).email);
  });

  it("rejects values of the wrong type instead of coercing them", () => {
    assert.ok(errors(body({ customer: { fullName: 42, phone: "08031234567" } })).fullName);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: 8031234567 } })).phone);
    assert.ok(errors(body({ customer: { fullName: "Ada Obi", phone: "08031234567", email: 5 } })).email);
    assert.ok(errors(body({ message: ["a long enough message here"] })).message);
    assert.ok(errors(body({ message: { toString: "x" } })).message);
  });

  it("cleans text: control and invisible characters, odd whitespace and Unicode form", () => {
    const value = ok(
      body({
        customer: { fullName: "  Ada\u0000 ‮Obi​  ", phone: "0803\t123\n4567", location: "Akúre" },
        message: "Line one\r\n\r\n\r\n\r\nLine two\u0007   \n  ",
      }),
    );
    assert.equal(value.fullName, "Ada Obi");
    assert.equal(value.phone, "0803 123 4567");
    assert.equal(value.location, "Akúre", "NFC");
    assert.equal(value.message, "Line one\n\nLine two");
  });

  it("measures length after cleaning, so padding cannot be used to dodge a limit or to fake length", () => {
    assert.ok(errors(body({ message: "ab" + " ".repeat(50) })).message, "whitespace padding does not count as a message");
    assert.ok(errors(body({ customer: { fullName: "​​​", phone: "08031234567" } })).fullName);
  });

  it("limits web links in the message (a spam signal), but allows a couple", () => {
    ok(body({ message: "Please see www.example.com and https://example.com/photo for the site layout." }));
    assert.ok(errors(body({ message: "Visit http://a.example http://b.example http://c.example now" })).message);
  });

  it("validates the appointment request", () => {
    const value = ok(body({ appointment: { preferredDate: "2026-11-20", preferredTime: "09:30" } }));
    assert.deepEqual(value.appointment, { preferredDate: "2026-11-20", preferredTime: "09:30" });
    ok(body({ appointment: { preferredDate: TODAY, preferredTime: "00:00" } }));
    assert.ok(errors(body({ appointment: { preferredDate: "2026-11-12", preferredTime: "09:30" } })).preferredDate, "the past");
    assert.ok(errors(body({ appointment: { preferredDate: "2027-11-15", preferredTime: "09:30" } })).preferredDate, "beyond a year");
    ok(body({ appointment: { preferredDate: "2027-11-14", preferredTime: "09:30" } }));
    assert.ok(errors(body({ appointment: { preferredDate: "2026-02-30", preferredTime: "09:30" } })).preferredDate, "not a real date");
    assert.ok(errors(body({ appointment: { preferredDate: "13/11/2026", preferredTime: "09:30" } })).preferredDate);
    assert.ok(errors(body({ appointment: { preferredDate: "", preferredTime: "09:30" } })).preferredDate);
    assert.ok(errors(body({ appointment: { preferredDate: "2026-11-20", preferredTime: "25:00" } })).preferredTime);
    assert.ok(errors(body({ appointment: { preferredDate: "2026-11-20", preferredTime: "" } })).preferredTime);
    assert.ok(errors(body({ appointment: "tomorrow" })).preferredDate);
  });

  it("requires a well-formed random submission id", () => {
    assert.equal(ok(body({ submissionId: ID.toUpperCase() })).submissionId, ID, "normalised to lower case");
    for (const submissionId of [undefined, "", "not-a-uuid", "11111111-1111-1111-1111-111111111111", 7, null]) {
      const result = parseEnquiryRequest(body({ submissionId }), TODAY);
      assert.equal(result.ok, false, String(submissionId));
    }
  });

  it("refuses a body that is not an object", () => {
    for (const input of [null, undefined, "text", 5, [], [body()]]) assert.equal(parseEnquiryRequest(input, TODAY).ok, false);
  });
});
