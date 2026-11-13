import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  composeCancellationNote,
  maxNoteLength,
  maxReasonLength,
  maxVenueLength,
  parseCancel,
  parseComplete,
  parseConfirm,
  parseReschedule,
} from "@/lib/admin/appointments/action-validation";
import { formatSlotLong, formatSlotShort } from "@/lib/admin/appointments/format-slot";
import { toAppointmentWithEnquiry, toStatusHistoryRecord } from "@/lib/admin/appointments/mappers";
import { appointmentsHref, parseAppointmentsUrl } from "@/lib/admin/appointments/query-params";
import { addDaysTo, lagosToday, validateSlot } from "@/lib/admin/appointments/slot";
import { availableActions, displayStatus, isOpen, replacementOf } from "@/lib/admin/appointments/transitions";

const ID = "f0fd5ef0-8f28-4ace-b308-3383c1e3bed0";
const ENQ = "85a1c5b9-cd84-4cea-8ed9-cf6b15e73fa1";
const TODAY = "2026-11-13";

describe("what an administrator may do to an appointment (the database's rules)", () => {
  it("a requested appointment can be confirmed, rescheduled or cancelled", () => {
    assert.deepEqual(availableActions("requested"), ["confirm", "reschedule", "cancel"]);
  });
  it("a confirmed appointment can be completed, rescheduled or cancelled", () => {
    assert.deepEqual(availableActions("confirmed"), ["complete", "reschedule", "cancel"]);
  });
  it("completed and cancelled appointments are final: no action", () => {
    assert.deepEqual(availableActions("completed"), []);
    assert.deepEqual(availableActions("cancelled"), []);
  });
  it("only requested and confirmed appointments are open", () => {
    assert.deepEqual((["requested", "confirmed", "completed", "cancelled"] as const).filter(isOpen), ["requested", "confirmed"]);
  });
  it("a cancelled appointment with a replacement is shown as rescheduled; nothing else is", () => {
    assert.equal(displayStatus({ status: "cancelled" }, "x"), "rescheduled");
    assert.equal(displayStatus({ status: "cancelled" }, null), "cancelled");
    for (const status of ["requested", "confirmed", "completed"] as const) assert.equal(displayStatus({ status }, "x"), status);
  });
  it("finds the replacement within a chain", () => {
    const chain = [{ id: "c", rescheduledFromId: "b" }, { id: "b", rescheduledFromId: "a" }, { id: "a", rescheduledFromId: null }];
    assert.equal(replacementOf("a", chain), "b");
    assert.equal(replacementOf("b", chain), "c");
    assert.equal(replacementOf("c", chain), null);
  });
});

describe("appointment dates and times (Africa/Lagos)", () => {
  it("accepts today, a later day and the last day of the window, with a 24-hour time", () => {
    assert.deepEqual(validateSlot("2026-11-13", "09:30", TODAY), { ok: true, date: "2026-11-13", time: "09:30" });
    assert.equal(validateSlot("2026-12-25", "00:00", TODAY).ok, true);
    assert.equal(validateSlot(addDaysTo(TODAY, 366), "23:59", TODAY).ok, true);
  });
  it("refuses the past, beyond a year, impossible dates and malformed values", () => {
    for (const date of ["2026-11-12", addDaysTo(TODAY, 367), "2026-02-30", "13/11/2026", "", undefined, null, 20261120]) {
      const result = validateSlot(date, "09:30", TODAY);
      assert.equal(result.ok, false, String(date));
      assert.ok(!result.ok && result.errors.date, String(date));
    }
    for (const time of ["24:00", "9:30", "09:60", "", undefined, "ab:cd"]) {
      const result = validateSlot("2026-11-20", time, TODAY);
      assert.ok(!result.ok && result.errors.time, String(time));
    }
  });
  it("reports both problems at once", () => {
    const result = validateSlot("", "", TODAY);
    assert.ok(!result.ok && result.errors.date && result.errors.time);
  });
  it("'today' is the Lagos calendar day, not the server's or the viewer's", () => {
    assert.equal(lagosToday(new Date("2026-11-13T23:30:00Z")), "2026-11-14"); // 00:30 on the 14th in Lagos (UTC+1)
    assert.equal(lagosToday(new Date("2026-11-13T22:59:00Z")), "2026-11-13");
    assert.equal(lagosToday(new Date("2026-12-31T23:30:00Z")), "2027-01-01");
  });
  it("formats slots without converting any time zone", () => {
    assert.equal(formatSlotLong("2026-11-20", "10:30"), "Friday, 20 November 2026, 10:30 am");
    assert.equal(formatSlotShort("2026-11-20", "14:05"), "20 Nov 2026, 2:05 pm");
    assert.equal(formatSlotShort("2026-11-20", "00:00"), "20 Nov 2026, 12:00 am");
  });
});

describe("confirming an appointment", () => {
  const ok = { appointmentId: ID, date: "2026-11-20", time: "10:30" };
  it("accepts a valid slot, trims and cleans the optional venue and note", () => {
    assert.deepEqual(parseConfirm({ ...ok, venue: "  Customer   site\u0000 ", note: "Bring the survey form.\r\n\r\n\r\nThanks" }, TODAY), {
      ok: true, id: ID, date: "2026-11-20", time: "10:30", venue: "Customer site", note: "Bring the survey form.\n\nThanks",
    });
    const bare = parseConfirm(ok, TODAY);
    assert.ok(bare.ok && bare.venue === null && bare.note === null);
    const blank = parseConfirm({ ...ok, venue: "  ", note: "" }, TODAY);
    assert.ok(blank.ok && blank.venue === null && blank.note === null);
  });
  it("refuses a bad id, a bad slot (with field messages) and over-long text", () => {
    assert.equal(parseConfirm({ ...ok, appointmentId: "nope" }, TODAY).ok, false);
    const past = parseConfirm({ ...ok, date: "2026-11-01" }, TODAY);
    assert.ok(!past.ok && past.fieldErrors?.date);
    assert.equal(parseConfirm({ ...ok, venue: "v".repeat(maxVenueLength + 1) }, TODAY).ok, false);
    assert.equal(parseConfirm({ ...ok, note: "n".repeat(maxNoteLength + 1) }, TODAY).ok, false);
    assert.equal(parseConfirm({ ...ok, venue: 5 }, TODAY).ok, false);
    assert.equal(parseConfirm({ ...ok, note: ["x"] }, TODAY).ok, false);
  });
  it("only ever targets a requested appointment (the status guard is fixed in the action, not taken from the browser)", () => {
    const result = parseConfirm({ ...ok, expectedStatus: "completed" } as never, TODAY);
    assert.ok(result.ok);
    assert.equal(Object.prototype.hasOwnProperty.call(result, "expected"), false);
  });
});

describe("rescheduling an appointment", () => {
  const ok = { appointmentId: ID, expectedStatus: "requested", date: "2026-11-20", time: "10:30" };
  it("accepts a requested or confirmed appointment and a valid new slot", () => {
    assert.deepEqual(parseReschedule(ok, TODAY), { ok: true, id: ID, expected: "requested", date: "2026-11-20", time: "10:30", confirm: false, note: null });
    const confirmed = parseReschedule({ ...ok, expectedStatus: "confirmed", confirm: true, note: " Customer asked. " }, TODAY);
    assert.ok(confirmed.ok && confirmed.confirm === true && confirmed.note === "Customer asked.");
  });
  it("treats anything but the boolean true as 'do not confirm'", () => {
    for (const confirm of ["true", 1, "on", null, undefined]) {
      const result = parseReschedule({ ...ok, confirm }, TODAY);
      assert.ok(result.ok && result.confirm === false, String(confirm));
    }
  });
  it("refuses final or unknown statuses, bad slots and bad ids", () => {
    for (const expectedStatus of ["completed", "cancelled", "rescheduled", "", undefined, 3]) assert.equal(parseReschedule({ ...ok, expectedStatus }, TODAY).ok, false, String(expectedStatus));
    assert.equal(parseReschedule({ ...ok, date: "2026-11-12" }, TODAY).ok, false);
    assert.equal(parseReschedule({ ...ok, time: "" }, TODAY).ok, false);
    assert.equal(parseReschedule({ ...ok, appointmentId: "x" }, TODAY).ok, false);
    assert.equal(parseReschedule({ ...ok, note: "n".repeat(maxNoteLength + 1) }, TODAY).ok, false);
  });
});

describe("cancelling and completing", () => {
  it("cancels a requested or confirmed appointment, with an optional cleaned reason", () => {
    assert.deepEqual(parseCancel({ appointmentId: ID, expectedStatus: "confirmed", reason: "  Customer\u0000 travelling  " }), { ok: true, id: ID, expected: "confirmed", reason: "Customer travelling" });
    const none = parseCancel({ appointmentId: ID, expectedStatus: "requested" });
    assert.ok(none.ok && none.reason === null);
  });
  it("refuses cancelling a final appointment, a bad id or an over-long reason", () => {
    for (const expectedStatus of ["completed", "cancelled", "x", undefined]) assert.equal(parseCancel({ appointmentId: ID, expectedStatus }).ok, false, String(expectedStatus));
    assert.equal(parseCancel({ appointmentId: "x", expectedStatus: "requested" }).ok, false);
    assert.equal(parseCancel({ appointmentId: ID, expectedStatus: "requested", reason: "r".repeat(maxReasonLength + 1) }).ok, false);
  });
  it("completes only a confirmed appointment", () => {
    assert.deepEqual(parseComplete({ appointmentId: ID, expectedStatus: "confirmed" }), { ok: true, id: ID });
    for (const expectedStatus of ["requested", "completed", "cancelled", undefined]) assert.equal(parseComplete({ appointmentId: ID, expectedStatus }).ok, false, String(expectedStatus));
    assert.equal(parseComplete({ appointmentId: "x", expectedStatus: "confirmed" }).ok, false);
  });
  it("keeps the cancellation reason with the existing note and never exceeds the database's limit", () => {
    assert.equal(composeCancellationNote("Visit the shop.", null), null);
    assert.equal(composeCancellationNote(null, "Customer travelling"), "Cancelled: Customer travelling");
    assert.equal(composeCancellationNote("Visit the shop.", "Customer travelling"), "Visit the shop.\nCancelled: Customer travelling");
    const long = composeCancellationNote("x".repeat(maxNoteLength), "Customer travelling") as string;
    assert.ok(long.length <= maxNoteLength);
    assert.ok(long.endsWith("Cancelled: Customer travelling"), "the reason is kept whole; the old note is shortened");
  });
});

describe("the appointments address (URL) is untrusted input", () => {
  it("defaults to the plain list and accepts valid values", () => {
    assert.deepEqual(parseAppointmentsUrl({}), { search: "", status: "all", page: 1, appointmentId: null });
    assert.deepEqual(parseAppointmentsUrl({ q: " ada  obi ", status: "confirmed", page: "2", appointment: ID.toUpperCase() }), { search: "ada obi", status: "confirmed", page: 2, appointmentId: ID });
  });
  it("ignores unknown values", () => {
    assert.deepEqual(parseAppointmentsUrl({ status: "rescheduled", page: "-1", appointment: "nope" }), { search: "", status: "all", page: 1, appointmentId: null });
    assert.equal(parseAppointmentsUrl({ status: ["cancelled", "x"] }).status, "cancelled");
  });
  it("builds addresses that leave out defaults and round-trip", () => {
    assert.equal(appointmentsHref({}), "/admin/appointments");
    const href = appointmentsHref({ search: "ada", status: "requested", page: 3, appointmentId: ID });
    const params = new URL(href, "https://x.example").searchParams;
    assert.deepEqual(parseAppointmentsUrl(Object.fromEntries(params)), { search: "ada", status: "requested", page: 3, appointmentId: ID });
  });
});

describe("appointment rows with their enquiry", () => {
  const enquiry = {
    id: ENQ, reference: "BOOM-2026-00012", full_name: "ZZ TEST Beta", phone: "+234 800 000 0202", phone_e164: "+2348000000202", email: null,
    organisation: null, location: null, division: "foods", requested_item: ["ofada-rice"], requested_service: null, message: "A test message that is long enough.",
    status: "new", source: "website", created_at: "2026-11-13T10:31:00Z", updated_at: "2026-11-13T10:31:00Z",
  };
  const row = (over: Record<string, unknown> = {}) => ({
    id: ID, enquiry_id: ENQ, rescheduled_from_id: null, status: "requested", preferred_date: "2026-11-16", preferred_time: "10:30:00", timezone: "Africa/Lagos",
    confirmed_date: null, confirmed_time: null, confirmed_at: null, venue: null, scheduling_note: null, created_at: "2026-11-13T10:31:01Z", enquiries: enquiry, ...over,
  });

  it("joins an appointment to its customer's enquiry", () => {
    const item = toAppointmentWithEnquiry(row(), null);
    assert.equal(item?.appointment.preferredTime, "10:30");
    assert.equal(item?.enquiry.reference, "BOOM-2026-00012");
    assert.equal(item?.replacedById, null);
    assert.equal(toAppointmentWithEnquiry(row(), "next")?.replacedById, "next");
  });
  it("accepts the embedded enquiry as a one-element array too", () => {
    assert.equal(toAppointmentWithEnquiry(row({ enquiries: [enquiry] }), null)?.enquiry.id, ENQ);
  });
  it("drops rows whose enquiry is missing, malformed or belongs to a different enquiry", () => {
    assert.equal(toAppointmentWithEnquiry(row({ enquiries: null }), null), null);
    assert.equal(toAppointmentWithEnquiry(row({ enquiries: { ...enquiry, status: "archived" } }), null), null);
    assert.equal(toAppointmentWithEnquiry(row({ enquiry_id: "11111111-1111-4111-8111-111111111111" }), null), null);
    assert.equal(toAppointmentWithEnquiry(null, null), null);
    assert.equal(toAppointmentWithEnquiry(row({ status: "maybe" }), null), null);
  });
  it("names who changed an appointment's status without naming anyone", () => {
    const base = { id: ID, previous_status: "requested", new_status: "confirmed", changed_at: "2026-11-13T12:00:00Z" };
    assert.equal(toStatusHistoryRecord({ ...base, changed_by: "u1" }, "u1")?.by, "you");
    assert.equal(toStatusHistoryRecord({ ...base, changed_by: "u2" }, "u1")?.by, "administrator");
    assert.equal(toStatusHistoryRecord({ ...base, changed_by: null }, "u1")?.by, "system");
    assert.equal(toStatusHistoryRecord({ ...base, previous_status: null, changed_by: null }, "u1")?.previousStatus, null);
    assert.equal(toStatusHistoryRecord({ id: ID, new_status: 5, changed_at: "x" }, "u1"), null);
    assert.equal(toStatusHistoryRecord({ ...base, changed_at: undefined, created_at: "2026-11-13T12:00:00Z" }, "u1"), null, "the timestamp column is changed_at");
    assert.equal(toStatusHistoryRecord({ ...base, changed_by: null }, "u1")?.createdAt, "2026-11-13T12:00:00Z");
  });
});
