import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { followUpMessage } from "@/lib/admin/shared/contact-actions";
import { formatDayOfMonth, formatLongDate, formatMonth, formatPlainDate, formatReceivedDate, formatReceivedDateTime, formatTime, receivedDate, receivedTime } from "@/lib/admin/shared/dates";
import { appointmentStatusLabels, appointmentStatusOrder, enquiryStatusLabels, enquiryStatusOrder } from "@/lib/admin/shared/labels";

describe("administrator date formatting", () => {
  it("formats calendar dates without shifting with the viewer's time zone", () => {
    assert.equal(formatLongDate("2026-11-06"), "Friday, 6 November 2026");
    assert.equal(formatPlainDate("2026-11-06"), "6 Nov 2026");
    assert.equal(formatMonth("2026-11-06"), "Nov");
    assert.equal(formatDayOfMonth("2026-11-06"), "6");
    assert.equal(formatPlainDate("2026-12-31"), "31 Dec 2026");
    assert.equal(formatPlainDate("2028-02-29"), "29 Feb 2028", "leap day");
  });

  it("formats 24-hour times as 12-hour", () => {
    assert.equal(formatTime("00:00"), "12:00 am");
    assert.equal(formatTime("09:30"), "9:30 am");
    assert.equal(formatTime("12:00"), "12:00 pm");
    assert.equal(formatTime("16:05"), "4:05 pm");
    assert.equal(formatTime("23:59"), "11:59 pm");
  });

  it("reads received timestamps in Lagos time, whatever the instant's own offset", () => {
    assert.equal(receivedDate("2026-11-05T23:30:00Z"), "2026-11-06");
    assert.equal(receivedTime("2026-11-05T23:30:00Z"), "00:30");
    assert.equal(formatReceivedDate("2026-11-05T23:30:00Z"), "6 Nov 2026");
    assert.equal(formatReceivedDateTime("2026-11-05T23:30:00Z"), "6 Nov 2026, 00:30");
    assert.equal(formatReceivedDateTime("2026-11-06T10:31:00+02:00"), "6 Nov 2026, 09:31");
  });
});

describe("status lists", () => {
  it("every status has a label, in the fixed order", () => {
    assert.deepEqual([...enquiryStatusOrder], ["new", "in_progress", "contacted", "resolved"]);
    assert.deepEqual([...appointmentStatusOrder], ["requested", "confirmed", "completed", "cancelled"]);
    for (const status of enquiryStatusOrder) assert.ok(enquiryStatusLabels[status]);
    for (const status of appointmentStatusOrder) assert.ok(appointmentStatusLabels[status]);
  });
});

describe("the WhatsApp follow-up message", () => {
  it("uses the agreed professional wording and is only ever a draft the administrator sends themselves", () => {
    assert.equal(
      followUpMessage({ name: "Ada Test", reference: "BOOM-2026-00011", service: "Solar installation" }),
      "Hello Ada Test, this is BOOM MULTI GLOBAL COMPANY LIMITED. We are following up on your enquiry BOOM-2026-00011 regarding Solar installation. How may we assist you further?",
    );
  });
});
