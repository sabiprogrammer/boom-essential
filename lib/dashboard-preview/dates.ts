/**
 * Date helpers for the dashboard preview. Everything is computed against a FIXED demonstration date, never
 * the real clock: `new Date()` cannot run during prerender, and a fixed date keeps the sample data (which
 * records "upcoming" and "past" appointments) consistent. Appointment dates are plain calendar dates, so they
 * are parsed and formatted in UTC and never shift with the viewer's time zone.
 */

/** The date the demonstration treats as "today" (YYYY-MM-DD). */
export const demoToday = "2026-11-04";

const dayMs = 86_400_000;

function utc(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function addDays(date: string, days: number): string {
  return new Date(utc(date) + days * dayMs).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((utc(to) - utc(from)) / dayMs);
}

const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const plainDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthOnly = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const dayOnly = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "UTC" });

export function formatLongDate(date: string): string {
  return longDate.format(utc(date));
}

/** "Thu 5 Nov" */
export function formatShortDate(date: string): string {
  return shortDate.format(utc(date)).replace(",", "");
}

/** "5 Nov 2026" */
export function formatPlainDate(date: string): string {
  return plainDate.format(utc(date));
}

export function formatMonth(date: string): string {
  return monthOnly.format(utc(date));
}

export function formatDayOfMonth(date: string): string {
  return dayOnly.format(utc(date));
}

/** "Today", "Tomorrow", "In 3 days", "Yesterday", "3 days ago". */
export function describeRelativeDay(date: string): string {
  const diff = daysBetween(demoToday, date);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}

/** "14:30" -> "2:30 pm" */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

const receivedDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" });
const receivedClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });

/** The Lagos calendar day (YYYY-MM-DD) of an ISO timestamp. */
export function receivedDate(iso: string): string {
  return receivedDay.format(new Date(iso));
}

/** "3 Nov 2026" */
export function formatReceivedDate(iso: string): string {
  return formatPlainDate(receivedDate(iso));
}

/** "3 Nov 2026, 14:20" */
export function formatReceivedDateTime(iso: string): string {
  return `${formatReceivedDate(iso)}, ${receivedClock.format(new Date(iso))}`;
}
