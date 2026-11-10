import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDays,
  daysBetween,
  describeActivityTime,
  describeRelativeDay,
  formatDayMonth,
  formatLongDate,
  formatReceivedDateTime,
  formatTime,
  formatWeekdayDayMonth,
  receivedDate,
} from "@/lib/dashboard-preview/dates";
import { createDemoReference, lagosDateOf } from "@/lib/dashboard-preview/reference";

describe("the demo reference follows the Africa/Lagos calendar day", () => {
  it("uses the Lagos day, not the UTC day", () => {
    // 23:30 UTC on 5 Nov is 00:30 on 6 Nov in Lagos (UTC+1).
    assert.equal(createDemoReference(new Date("2026-11-05T23:30:00Z")).today, "2026-11-06");
    assert.equal(createDemoReference(new Date("2026-11-06T22:59:00Z")).today, "2026-11-06");
    assert.equal(createDemoReference(new Date("2026-11-06T23:00:00Z")).today, "2026-11-07");
  });

  it("turns over at Lagos midnight", () => {
    assert.equal(lagosDateOf(new Date("2026-11-06T00:00:00+01:00")), "2026-11-06");
    assert.equal(lagosDateOf(new Date("2026-11-05T23:59:59+01:00")), "2026-11-05");
  });

  it("keeps the instant it was created from", () => {
    const now = new Date("2026-11-06T09:15:00+01:00");
    assert.equal(createDemoReference(now).nowMs, now.getTime());
  });

  it("is a pure function of the clock it is given", () => {
    const now = new Date("2027-01-01T00:10:00+01:00");
    assert.deepEqual(createDemoReference(now), createDemoReference(new Date(now)));
  });
});

describe("date arithmetic", () => {
  it("adds days across month, year and leap-day boundaries", () => {
    assert.equal(addDays("2026-11-06", 1), "2026-11-07");
    assert.equal(addDays("2026-11-30", 1), "2026-12-01");
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2028-02-28", 1), "2028-02-29");
    assert.equal(addDays("2028-02-29", 1), "2028-03-01");
    assert.equal(addDays("2026-11-06", -6), "2026-10-31");
    assert.equal(addDays("2026-11-06", 0), "2026-11-06");
  });

  it("counts whole days between dates, with sign", () => {
    assert.equal(daysBetween("2026-11-06", "2026-11-06"), 0);
    assert.equal(daysBetween("2026-11-06", "2026-11-09"), 3);
    assert.equal(daysBetween("2026-11-06", "2026-11-04"), -2);
    assert.equal(daysBetween("2026-12-30", "2027-01-02"), 3);
    assert.equal(daysBetween("2028-02-28", "2028-03-01"), 2);
  });
});

describe("relative day labels", () => {
  const today = "2026-11-06";
  const cases: [number, string][] = [
    [0, "Today"],
    [1, "Tomorrow"],
    [2, "In 2 days"],
    [7, "In 7 days"],
    [-1, "Yesterday"],
    [-2, "2 days ago"],
    [-15, "15 days ago"],
  ];
  for (const [offset, label] of cases) {
    it(`labels ${offset >= 0 ? "+" : ""}${offset} days as "${label}"`, () => {
      assert.equal(describeRelativeDay(addDays(today, offset), today), label);
    });
  }

  it("moves with the reference date", () => {
    assert.equal(describeRelativeDay("2026-11-07", "2026-11-06"), "Tomorrow");
    assert.equal(describeRelativeDay("2026-11-07", "2026-11-07"), "Today");
    assert.equal(describeRelativeDay("2026-11-07", "2026-11-08"), "Yesterday");
  });
});

describe("activity time labels", () => {
  const today = "2026-11-06";
  it("describes today, yesterday, a weekday and an older date", () => {
    assert.equal(describeActivityTime("2026-11-06T08:42:00+01:00", today), "Today, 08:42");
    assert.equal(describeActivityTime("2026-11-05T17:00:00+01:00", today), "Yesterday, 17:00");
    assert.equal(describeActivityTime("2026-11-03T14:30:00+01:00", today), "Tuesday, 14:30");
    assert.equal(describeActivityTime("2026-10-28T09:15:00+01:00", today), "28 Oct, 09:15");
  });

  it("reads the time in Lagos whatever the instant's own offset", () => {
    assert.equal(describeActivityTime("2026-11-05T23:30:00Z", today), "Today, 00:30");
  });
});

describe("formatting", () => {
  it("formats calendar dates without shifting with the viewer's time zone", () => {
    assert.equal(formatLongDate("2026-11-06"), "Friday, 6 November 2026");
    assert.equal(formatWeekdayDayMonth("2026-11-09"), "Monday 9 November");
    assert.equal(formatDayMonth("2026-11-09"), "9 November");
  });

  it("formats 24-hour times as 12-hour", () => {
    assert.equal(formatTime("00:00"), "12:00 am");
    assert.equal(formatTime("09:30"), "9:30 am");
    assert.equal(formatTime("12:00"), "12:00 pm");
    assert.equal(formatTime("16:05"), "4:05 pm");
  });

  it("reads received timestamps in Lagos time", () => {
    assert.equal(receivedDate("2026-11-05T23:30:00Z"), "2026-11-06");
    assert.equal(formatReceivedDateTime("2026-11-05T23:30:00Z"), "6 Nov 2026, 00:30");
  });
});
