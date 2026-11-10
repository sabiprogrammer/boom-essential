import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appointmentRecords, groupByDate, isUpcoming, pastAppointments, selectableStatuses, upcomingAppointments } from "@/lib/dashboard-preview/appointments";
import { addDays, daysBetween, describeRelativeDay, formatReceivedDateTime, receivedDate } from "@/lib/dashboard-preview/dates";
import { createDemoActivity } from "@/lib/dashboard-preview/demo-activity";
import { createDemoEnquiries } from "@/lib/dashboard-preview/demo-enquiries";
import { createInitialDemoState, demoReducer } from "@/lib/dashboard-preview/demo-reducer";
import { createDemoReference, type DemoReference } from "@/lib/dashboard-preview/reference";
import { divisionBreakdown, overviewStats } from "@/lib/dashboard-preview/stats";

/** Lagos wall-clock moments chosen to include midnight, month, year and leap-day boundaries. */
const days = ["2026-11-06", "2026-11-30", "2026-12-31", "2027-03-01", "2028-02-29"];
const times = ["00:00", "00:05", "00:30", "03:00", "09:00", "12:00", "17:45", "23:59"];
const moments: DemoReference[] = days.flatMap((day) => times.map((time) => createDemoReference(new Date(`${day}T${time}:00+01:00`))));

function eachMoment(check: (reference: DemoReference, label: string) => void) {
  for (const reference of moments) check(reference, `${reference.today} @ ${new Date(reference.nowMs).toISOString()}`);
}

describe("demo enquiries are dated relative to the reference", () => {
  it("builds the same 24 records on every call for the same reference (server and client agree)", () => {
    eachMoment((reference) => {
      const first = createDemoEnquiries(reference);
      assert.equal(first.length, 24);
      assert.deepEqual(first, createDemoEnquiries(reference));
    });
  });

  it("lists newest first and numbers references in order", () => {
    eachMoment((reference, label) => {
      const refs = createDemoEnquiries(reference).map((e) => e.reference);
      assert.deepEqual(refs, Array.from({ length: 24 }, (_, i) => `BMG-2026-0${124 - i}`), label);
    });
  });

  it("orders received times consistently with the references and never puts one in the future", () => {
    eachMoment((reference, label) => {
      const oldestFirst = [...createDemoEnquiries(reference)].reverse();
      let previous = -Infinity;
      for (const enquiry of oldestFirst) {
        const at = Date.parse(enquiry.receivedAt);
        assert.ok(at > previous, `${label}: ${enquiry.reference} is not later than the one before`);
        assert.ok(at <= reference.nowMs, `${label}: ${enquiry.reference} is in the future`);
        previous = at;
      }
      const newest = oldestFirst[oldestFirst.length - 1];
      assert.ok(reference.nowMs - Date.parse(newest.receivedAt) <= 3 * 3_600_000, `${label}: the newest enquiry should be recent`);
      assert.ok(daysBetween(receivedDate(oldestFirst[0].receivedAt), reference.today) >= 28, `${label}: the oldest should be about a month old`);
    });
  });

  it("dates notes after their enquiry and before now, with labels that match", () => {
    eachMoment((reference, label) => {
      for (const enquiry of createDemoEnquiries(reference)) {
        for (const note of enquiry.notes) {
          assert.ok(note.createdAt, `${label}: ${note.id} has no timestamp`);
          assert.ok(Date.parse(note.createdAt) >= Date.parse(enquiry.receivedAt), `${label}: ${note.id} is older than its enquiry`);
          assert.ok(Date.parse(note.createdAt) <= reference.nowMs, `${label}: ${note.id} is in the future`);
          assert.equal(note.at, formatReceivedDateTime(note.createdAt));
        }
      }
    });
  });

  it("keeps every offset when the reference day moves, so the data always looks equally fresh", () => {
    const base = createDemoReference(new Date("2026-11-06T10:00:00+01:00"));
    const later = createDemoReference(new Date("2026-11-20T10:00:00+01:00"));
    assert.equal(later.today, addDays(base.today, 14));
    const a = createDemoEnquiries(base);
    const b = createDemoEnquiries(later);
    a.forEach((enquiry, i) => {
      assert.equal(daysBetween(base.today, receivedDate(enquiry.receivedAt)), daysBetween(later.today, receivedDate(b[i].receivedAt)), enquiry.reference);
      if (enquiry.appointment && b[i].appointment) {
        assert.equal(daysBetween(base.today, enquiry.appointment.preferredDate), daysBetween(later.today, b[i].appointment.preferredDate), enquiry.reference);
      }
    });
  });
});

describe("appointments are genuinely upcoming or past", () => {
  it("has 14 appointments, and each is either upcoming or past, never both", () => {
    eachMoment((reference, label) => {
      const records = appointmentRecords(createDemoEnquiries(reference));
      assert.equal(records.length, 14, label);
      const upcoming = upcomingAppointments(records, reference.today);
      const past = pastAppointments(records, reference.today);
      assert.equal(upcoming.length + past.length, records.length, label);
      assert.ok(upcoming.length > 0 && past.length > 0, label);
      for (const record of upcoming) assert.ok(record.appointment.preferredDate >= reference.today, `${label}: ${record.enquiry.reference}`);
      for (const record of past) assert.ok(record.appointment.preferredDate < reference.today, `${label}: ${record.enquiry.reference}`);
    });
  });

  it("only requests or confirms future visits, and only completes or cancels past ones", () => {
    eachMoment((reference, label) => {
      for (const record of appointmentRecords(createDemoEnquiries(reference))) {
        const status = record.appointment.status;
        if (isUpcoming(record, reference.today)) assert.ok(status === "requested" || status === "confirmed", `${label}: ${record.enquiry.reference} is ${status}`);
        else assert.ok(status === "completed" || status === "cancelled", `${label}: ${record.enquiry.reference} is ${status}`);
        assert.ok(record.appointment.preferredDate >= receivedDate(record.enquiry.receivedAt), `${label}: ${record.enquiry.reference} is before its enquiry`);
      }
    });
  });

  it("shows Today, Tomorrow, In 2 days and Yesterday, all accurate", () => {
    eachMoment((reference, label) => {
      const records = appointmentRecords(createDemoEnquiries(reference));
      const labels = new Set(records.map((r) => describeRelativeDay(r.appointment.preferredDate, reference.today)));
      for (const expected of ["Today", "Tomorrow", "In 2 days", "Yesterday"]) assert.ok(labels.has(expected), `${label}: missing ${expected}`);
      for (const record of records) {
        const expected = daysBetween(reference.today, record.appointment.preferredDate);
        const text = describeRelativeDay(record.appointment.preferredDate, reference.today);
        if (expected === 0) assert.equal(text, "Today");
        if (expected === 1) assert.equal(text, "Tomorrow");
        if (expected === -1) assert.equal(text, "Yesterday");
      }
    });
  });

  it("sorts upcoming soonest first and past most recent first", () => {
    eachMoment((reference, label) => {
      const records = appointmentRecords(createDemoEnquiries(reference));
      const key = (r: (typeof records)[number]) => `${r.appointment.preferredDate} ${r.appointment.preferredTime}`;
      const upcoming = upcomingAppointments(records, reference.today).map(key);
      const past = pastAppointments(records, reference.today).map(key);
      assert.deepEqual(upcoming, [...upcoming].sort(), label);
      assert.deepEqual(past, [...past].sort().reverse(), label);
    });
  });

  it("groups by calendar day without losing, duplicating or reordering any appointment", () => {
    eachMoment((reference, label) => {
      const records = appointmentRecords(createDemoEnquiries(reference));
      for (const [list, ascending] of [
        [upcomingAppointments(records, reference.today), true],
        [pastAppointments(records, reference.today), false],
      ] as const) {
        const groups = groupByDate(list);
        assert.deepEqual(groups.flatMap((g) => g.records.map((r) => r.enquiry.id)), list.map((r) => r.enquiry.id), label);
        const dates = groups.map((g) => g.date);
        assert.equal(new Set(dates).size, dates.length, `${label}: a day appears twice`);
        assert.deepEqual(dates, [...dates].sort(ascending ? undefined : (a, b) => b.localeCompare(a)), label);
        for (const group of groups) for (const record of group.records) assert.equal(record.appointment.preferredDate, group.date);
      }
    });
  });

  it("offers the right status choices for future and past appointments", () => {
    eachMoment((reference, label) => {
      for (const record of appointmentRecords(createDemoEnquiries(reference))) {
        const options = selectableStatuses(record, reference.today);
        assert.ok(options.includes(record.appointment.status), label);
        const future = isUpcoming(record, reference.today);
        assert.equal(options.includes("requested"), future || record.appointment.status === "requested", label);
        assert.equal(options.includes("completed"), !future || record.appointment.status === "completed", label);
      }
    });
  });
});

describe("statistics agree with the records", () => {
  it("derives every figure from the same list", () => {
    eachMoment((reference, label) => {
      const enquiries = createDemoEnquiries(reference);
      const records = appointmentRecords(enquiries);
      const stats = overviewStats(enquiries, reference.today);
      assert.equal(stats.total, 24, label);
      assert.equal(stats.newCount, 6, label);
      assert.equal(stats.inProgress, 7, label);
      assert.equal(stats.appointmentRequests, records.length, label);
      assert.equal(stats.awaitingConfirmation, records.filter((r) => r.appointment.status === "requested").length, label);
      assert.equal(
        stats.upcomingAppointments,
        upcomingAppointments(records, reference.today).filter((r) => r.appointment.status !== "cancelled").length,
        label,
      );
      const recent = enquiries.filter((e) => daysBetween(receivedDate(e.receivedAt), reference.today) < 7).length;
      assert.equal(stats.receivedLastSevenDays, recent, label);
      assert.ok(recent > 0 && recent < 24, label);
    });
  });

  it("splits the enquiries across the four offerings", () => {
    const enquiries = createDemoEnquiries(moments[0]);
    const breakdown = divisionBreakdown(enquiries);
    assert.equal(breakdown.reduce((sum, d) => sum + d.count, 0), 24);
    assert.deepEqual(Object.fromEntries(breakdown.map((d) => [d.id, d.count])), { energy: 8, security: 7, foods: 5, "industrial-equipment": 4 });
  });
});

describe("the activity feed", () => {
  it("is built from the enquiries and labelled relative to the reference", () => {
    eachMoment((reference, label) => {
      const enquiries = createDemoEnquiries(reference);
      const activity = createDemoActivity(enquiries, reference);
      assert.equal(activity.length, 6, label);
      for (const event of activity) {
        assert.match(event.at, /^(Today|Yesterday|[A-Z][a-z]+day|\d{1,2} [A-Z][a-z]{2}), \d\d:\d\d$/, `${label}: ${event.at}`);
        const mentioned = event.text.match(/BMG-2026-0\d{3}/)?.[0];
        assert.ok(mentioned && enquiries.some((e) => e.reference === mentioned), `${label}: ${event.text}`);
      }
    });
  });
});

describe("demo state", () => {
  const reference = createDemoReference(new Date("2026-11-06T10:00:00+01:00"));

  it("is empty until the browser has chosen a reference date, then complete", () => {
    const pending = createInitialDemoState(null);
    assert.equal(pending.reference, null);
    assert.equal(pending.enquiries.length, 0);
    const ready = demoReducer(pending, { type: "adopt-reference", reference });
    assert.equal(ready.reference?.today, "2026-11-06");
    assert.equal(ready.enquiries.length, 24);
    assert.equal(ready.activity.length, 6);
  });

  it("restores exactly the same sample data on reset", () => {
    let state = createInitialDemoState(reference);
    const initial = state;
    state = demoReducer(state, { type: "set-enquiry-status", id: "bmg-2026-0124", status: "resolved" });
    state = demoReducer(state, { type: "set-appointment-status", id: "bmg-2026-0124", status: "confirmed" });
    state = demoReducer(state, { type: "add-note", id: "bmg-2026-0124", text: "A demo note." });
    assert.notDeepEqual(state.enquiries, initial.enquiries);
    assert.deepEqual(demoReducer(state, { type: "reset" }), initial);
  });

  it("does not change any date when a status or note changes", () => {
    const initial = createInitialDemoState(reference);
    const changed = demoReducer(initial, { type: "set-enquiry-status", id: "bmg-2026-0110", status: "resolved" });
    changed.enquiries.forEach((enquiry, i) => {
      assert.equal(enquiry.receivedAt, initial.enquiries[i].receivedAt);
      assert.deepEqual(enquiry.appointment?.preferredDate, initial.enquiries[i].appointment?.preferredDate);
    });
  });
});
