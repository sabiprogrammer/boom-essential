import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeActivity } from "@/lib/admin/enquiries/activity-text";
import { maxNoteLength, parseNote, parseStatusChange } from "@/lib/admin/enquiries/action-validation";
import { buildCustomerContactLinks } from "@/lib/admin/enquiries/contact-links";
import { describeRequest, requestedLabels } from "@/lib/admin/enquiries/labels";
import { compact, toActivityRecord, toAppointmentRecord, toEnquiryRecord, toNoteRecord } from "@/lib/admin/enquiries/mappers";
import { pageWindow } from "@/lib/admin/enquiries/page-window";
import { enquiriesHref, enquiryPageSize, parseEnquiriesUrl } from "@/lib/admin/enquiries/query-params";
import { orFilterForTerm, searchTerms } from "@/lib/admin/enquiries/search-filter";
import type { EnquiryRecord } from "@/lib/admin/enquiries/types";

const ID = "2dda376d-2f8d-4da9-b7c1-f7aebceb11e8";

const row = (over: Record<string, unknown> = {}) => ({
  id: ID,
  reference: "BOOM-2026-00011",
  full_name: "ZZ TEST Person",
  phone: "0800 000 0101",
  phone_e164: "+2348000000101",
  email: "zz@example.invalid",
  organisation: "ZZ TEST Company",
  location: "ZZ TEST Town",
  division: "energy",
  requested_item: null,
  requested_service: ["solar-installation", "battery-storage"],
  message: "A test message that is long enough.",
  status: "new",
  source: "website",
  created_at: "2026-11-13T10:31:00.581002+00:00",
  updated_at: "2026-11-13T10:31:00.581002+00:00",
  ...over,
});
const record = (over: Record<string, unknown> = {}) => toEnquiryRecord(row(over)) as EnquiryRecord;

describe("the enquiries address (URL) is untrusted input", () => {
  it("defaults to the plain list", () => {
    assert.deepEqual(parseEnquiriesUrl({}), { search: "", status: "all", division: "all", page: 1, enquiryId: null });
  });

  it("accepts valid values and ignores unknown ones", () => {
    const parsed = parseEnquiriesUrl({ q: "  ada  akure ", status: "contacted", division: "general", page: "3", enquiry: ID.toUpperCase() });
    assert.deepEqual(parsed, { search: "ada akure", status: "contacted", division: "general", page: 3, enquiryId: ID });
    const bad = parseEnquiriesUrl({ status: "deleted", division: "plumbing", page: "-4", enquiry: "not-a-uuid" });
    assert.deepEqual(bad, { search: "", status: "all", division: "all", page: 1, enquiryId: null });
    assert.equal(parseEnquiriesUrl({ page: "abc" }).page, 1);
    assert.equal(parseEnquiriesUrl({ page: "1e9" }).page, 1);
    assert.equal(parseEnquiriesUrl({ page: "99999999999" }).page, 100_000);
  });

  it("takes the first of repeated values and limits the search length", () => {
    assert.equal(parseEnquiriesUrl({ status: ["new", "resolved"] }).status, "new");
    assert.equal(parseEnquiriesUrl({ q: "x".repeat(500) }).search.length, 80);
  });

  it("builds addresses that leave out defaults and round-trip", () => {
    assert.equal(enquiriesHref({}), "/admin");
    assert.equal(enquiriesHref({ search: "", status: "all", division: "all", page: 1 }), "/admin");
    const href = enquiriesHref({ search: "ada & co", status: "new", division: "energy", page: 2, enquiryId: ID });
    const params = new URL(href, "https://x.example").searchParams;
    assert.deepEqual(parseEnquiriesUrl(Object.fromEntries(params)), { search: "ada & co", status: "new", division: "energy", page: 2, enquiryId: ID });
  });

  it("pages are ten enquiries", () => assert.equal(enquiryPageSize, 10));
});

describe("search text becomes a safe filter", () => {
  it("keeps ordinary words, emails and phone numbers", () => {
    assert.deepEqual(searchTerms("Ada Obi"), ["Ada", "Obi"]);
    assert.deepEqual(searchTerms("ada@example.com"), ["ada@example.com"]);
    assert.deepEqual(searchTerms("+234 803-123 4567"), ["+234", "803-123", "4567"]);
    assert.deepEqual(searchTerms("O'Brien"), ["O'Brien"]);
    assert.deepEqual(searchTerms("BOOM-2026-00011"), ["BOOM-2026-00011"]);
  });

  it("strips every character that has a meaning in the filter syntax or in a LIKE pattern", () => {
    for (const hostile of ['a,b', "a(b)c", 'a"b', "a*b", "a%b", "a_b", "a\\b", "a:b", "a;b", "a=b", "a&b", "a|b", "a/b", "a<b>c", "a`b"]) {
      for (const term of searchTerms(hostile)) assert.match(term, /^[\p{L}\p{N}@.+'-]+$/u, hostile);
    }
    // Whatever is typed, every generated filter is exactly "<one of our columns>.ilike.\"*<safe term>*\"" joined by commas:
    // no typed text can add a filter, close the bracket, or inject a wildcard of its own.
    const part = /^(full_name|organisation|email|phone|phone_e164|reference|location|message)\.ilike\."\*[\p{L}\p{N}@.+'-]+\*"$/u;
    for (const hostile of ["x),status.eq.resolved,(y", "a%,id.neq.0", "1' or '1'='1", "*,full_name.ilike.*", 'a"),or(b', "a\\\"b"]) {
      for (const term of searchTerms(hostile)) {
        const parts = orFilterForTerm(term).split(",");
        assert.equal(parts.length, 8, hostile);
        for (const p of parts) assert.match(p, part, `${hostile} -> ${p}`);
      }
    }
  });

  it("drops punctuation-only terms, caps the number and length of terms, and handles empty input", () => {
    assert.deepEqual(searchTerms(""), []);
    assert.deepEqual(searchTerms(" ,,, ;; "), []);
    assert.deepEqual(searchTerms("..."), []);
    assert.equal(searchTerms("a b c d e f g h").length, 5);
    assert.equal(searchTerms("x".repeat(200))[0].length, 40);
  });

  it("a term may match any of the intended columns, and nothing else", () => {
    const filter = orFilterForTerm("ada");
    assert.deepEqual(
      filter.split(",").map((part) => part.split(".")[0]),
      ["full_name", "organisation", "email", "phone", "phone_e164", "reference", "location", "message"],
    );
    for (const part of filter.split(",")) assert.match(part, /^\w+\.ilike\."\*ada\*"$/);
  });
});

describe("database rows become screen records, defensively", () => {
  it("maps a valid enquiry", () => {
    const e = record();
    assert.equal(e.fullName, "ZZ TEST Person");
    assert.equal(e.phoneE164, "+2348000000101");
    assert.deepEqual(e.requestedService, ["solar-installation", "battery-storage"]);
    assert.deepEqual(e.requestedItem, []);
    assert.equal(e.status, "new");
  });

  it("treats blank optional fields as missing and keeps general enquiries valid", () => {
    const e = record({ email: "", organisation: null, location: "", phone_e164: null, division: "general", requested_service: null });
    assert.equal(e.email, null);
    assert.equal(e.organisation, null);
    assert.equal(e.phoneE164, null);
    assert.equal(e.division, "general");
  });

  it("drops rows that are not what the schema promises instead of crashing", () => {
    for (const bad of [null, undefined, "text", 5, [], row({ status: "archived" }), row({ division: "plumbing" }), row({ id: 7 }), row({ full_name: null }), row({ created_at: undefined })]) {
      assert.equal(toEnquiryRecord(bad), null);
    }
    assert.deepEqual(compact([record(), null, record({ reference: "BOOM-2026-00012" })]).map((r) => r.reference), ["BOOM-2026-00011", "BOOM-2026-00012"]);
  });

  it("maps appointments (time as HH:MM), notes (author as 'mine') and activity", () => {
    const appointment = toAppointmentRecord({
      id: ID, enquiry_id: ID, rescheduled_from_id: null, status: "requested", preferred_date: "2026-11-16", preferred_time: "10:30:00", timezone: "Africa/Lagos",
      confirmed_date: null, confirmed_time: null, confirmed_at: null, venue: null, scheduling_note: "", created_at: "2026-11-13T10:31:01Z",
    });
    assert.equal(appointment?.preferredTime, "10:30");
    assert.equal(appointment?.enquiryId, ID);
    assert.equal(appointment?.rescheduledFromId, null);
    assert.equal(appointment?.confirmedAt, null);
    const replacement = toAppointmentRecord({ id: ID, enquiry_id: ID, rescheduled_from_id: "9c201f8e-2910-49b8-b325-e5d5b1b76c77", status: "confirmed", preferred_date: "2026-11-20", preferred_time: "11:00:00", confirmed_date: "2026-11-20", confirmed_time: "11:00:00", confirmed_at: "2026-11-13T12:00:00Z", created_at: "2026-11-13T12:00:00Z" });
    assert.equal(replacement?.rescheduledFromId, "9c201f8e-2910-49b8-b325-e5d5b1b76c77");
    assert.equal(replacement?.confirmedAt, "2026-11-13T12:00:00Z");
    assert.equal(toAppointmentRecord({ id: ID, status: "requested", preferred_date: "2026-11-16", preferred_time: "10:30:00", created_at: "x" }), null, "an appointment without its enquiry is dropped");
    assert.equal(appointment?.confirmedDate, null);
    assert.equal(appointment?.schedulingNote, null);
    assert.equal(toAppointmentRecord({ id: ID, status: "maybe", preferred_date: "2026-11-16", preferred_time: "10:30:00", created_at: "x" }), null);

    const mine = toNoteRecord({ id: ID, content: "hello", admin_user_id: "u1", created_at: "2026-11-13T10:00:00Z" }, "u1");
    const theirs = toNoteRecord({ id: ID, content: "hello", admin_user_id: "u2", created_at: "2026-11-13T10:00:00Z" }, "u1");
    assert.equal(mine?.mine, true);
    assert.equal(theirs?.mine, false);
    assert.equal(toNoteRecord({ id: ID, content: 5, created_at: "x" }, "u1"), null);

    const activity = toActivityRecord({ id: ID, action: "enquiry_status_changed", actor_type: "admin", metadata: { from_status: "new", to_status: "contacted" }, created_at: "2026-11-13T10:00:00Z" });
    assert.equal(activity?.fromStatus, "new");
    assert.equal(activity?.toStatus, "contacted");
    assert.equal(toActivityRecord({ id: ID, action: "something_else", created_at: "x" }), null);
  });
});

describe("what was requested", () => {
  it("uses the labels the Contact form showed", () => {
    assert.deepEqual(requestedLabels(record()), ["Solar installation", "Battery storage"]);
    assert.equal(describeRequest(record()), "Solar installation, Battery storage");
  });

  it("reads products for foods and industrial equipment, services for energy and security", () => {
    const foods = record({ division: "foods", requested_service: null, requested_item: ["ofada-rice"] });
    assert.deepEqual(requestedLabels(foods), ["Ofada Rice"]);
    const wrongColumn = record({ division: "foods", requested_service: ["solar-installation"], requested_item: null });
    assert.deepEqual(requestedLabels(wrongColumn), []);
  });

  it("summarises long selections and names general enquiries", () => {
    const many = record({ requested_service: ["solar-installation", "battery-storage", "solar-maintenance", "inverter-solutions"] });
    assert.match(describeRequest(many), /and 2 more$/);
    assert.equal(describeRequest(record({ division: "general", requested_service: null })), "General enquiry");
    assert.equal(describeRequest(record({ division: "energy", requested_service: null })), "BOOM ENERGY");
  });

  it("shows an unknown slug readably rather than hiding it", () => {
    assert.deepEqual(requestedLabels(record({ requested_service: ["retired-service"] })), ["Retired service"]);
  });
});

describe("customer contact links", () => {
  it("builds tel: and wa.me links from the stored number, with a follow-up message the administrator sends themselves", () => {
    const links = buildCustomerContactLinks(record());
    assert.equal(links.call, "tel:+2348000000101");
    assert.match(links.whatsapp ?? "", /^https:\/\/wa\.me\/2348000000101\?text=/);
    assert.match(decodeURIComponent((links.whatsapp ?? "").split("?text=")[1]), /BOOM-2026-00011/);
    assert.match(links.message, /^Hello ZZ TEST Person, this is BOOM MULTI GLOBAL COMPANY LIMITED\./);
  });

  it("works for an international number when the server stored its E.164 form", () => {
    const links = buildCustomerContactLinks(record({ phone: "+44 20 7946 0958", phone_e164: "+442079460958" }));
    assert.equal(links.call, "tel:+442079460958");
    assert.match(links.whatsapp ?? "", /wa\.me\/442079460958/);
  });

  it("falls back to the number as typed (Nigerian mobile) when no normalised form exists", () => {
    assert.equal(buildCustomerContactLinks(record({ phone: "0803 123 4567", phone_e164: null })).call, "tel:+2348031234567");
  });

  it("offers NO link for a number it cannot use, never a dead or wrong one", () => {
    for (const phone of ["not a number", "12345", "0123456789"]) {
      const links = buildCustomerContactLinks(record({ phone, phone_e164: null }));
      assert.equal(links.call, null, phone);
      assert.equal(links.whatsapp, null, phone);
    }
    assert.equal(buildCustomerContactLinks(record({ phone_e164: "+0123", phone: "abc" })).call, null, "a malformed stored number is not dialled");
  });
});

describe("activity wording", () => {
  const base = { id: ID, createdAt: "x", fromStatus: null, toStatus: null };
  it("describes a status change with the previous and new status", () => {
    const { text, kind } = describeActivity({ ...base, action: "enquiry_status_changed", actorType: "admin", fromStatus: "new", toStatus: "in_progress" });
    assert.equal(text, "An administrator changed the status from New to In Progress.");
    assert.equal(kind, "status");
  });
  it("describes the other events", () => {
    assert.match(describeActivity({ ...base, action: "enquiry_received", actorType: "system" }).text, /received/i);
    assert.match(describeActivity({ ...base, action: "appointment_requested", actorType: "system" }).text, /requested/i);
    assert.equal(describeActivity({ ...base, action: "note_added", actorType: "admin" }).kind, "note");
    assert.equal(describeActivity({ ...base, action: "appointment_confirmed", actorType: "admin" }).kind, "appointment");
  });
});

describe("what an administrator may submit", () => {
  it("accepts a real status change and refuses the rest", () => {
    assert.deepEqual(parseStatusChange({ enquiryId: ID, expectedStatus: "new", nextStatus: "contacted" }), { ok: true, id: ID, expected: "new", next: "contacted" });
    for (const input of [
      { enquiryId: "nope", expectedStatus: "new", nextStatus: "contacted" },
      { enquiryId: ID, expectedStatus: "new", nextStatus: "deleted" },
      { enquiryId: ID, expectedStatus: "gone", nextStatus: "contacted" },
      { enquiryId: ID, expectedStatus: "new", nextStatus: "new" },
      { enquiryId: ID, expectedStatus: "new", nextStatus: undefined },
      { enquiryId: undefined, expectedStatus: "new", nextStatus: "resolved" },
    ]) {
      assert.equal(parseStatusChange(input).ok, false, JSON.stringify(input));
    }
  });

  it("cleans and limits a note", () => {
    const ok = parseNote({ enquiryId: ID, content: "  Called the customer.\r\n\r\n\r\n\r\nWill visit.\u0000  " });
    assert.deepEqual(ok, { ok: true, enquiryId: ID, content: "Called the customer.\n\nWill visit." });
    assert.equal(parseNote({ enquiryId: ID, content: "   " }).ok, false);
    assert.equal(parseNote({ enquiryId: ID, content: "​\u0000" }).ok, false);
    assert.equal(parseNote({ enquiryId: ID, content: 5 }).ok, false);
    assert.equal(parseNote({ enquiryId: ID, content: null }).ok, false);
    assert.equal(parseNote({ enquiryId: "x", content: "a note" }).ok, false);
    assert.equal(parseNote({ enquiryId: ID, content: "n".repeat(maxNoteLength) }).ok, true);
    assert.equal(parseNote({ enquiryId: ID, content: "n".repeat(maxNoteLength + 1) }).ok, false);
  });
});

describe("pagination window", () => {
  it("shows first, last and the neighbours with gaps marked", () => {
    assert.deepEqual(pageWindow(1, 1), [1]);
    assert.deepEqual(pageWindow(1, 3), [1, 2, 3]);
    assert.deepEqual(pageWindow(5, 10), [1, "gap", 4, 5, 6, "gap", 10]);
    assert.deepEqual(pageWindow(2, 10), [1, 2, 3, "gap", 10]);
    assert.deepEqual(pageWindow(10, 10), [1, "gap", 9, 10]);
  });
});
