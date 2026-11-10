import { lagosDateOf } from "./reference";

/**
 * Date helpers for the dashboard preview. Nothing here reads the clock: every function that needs to know
 * "today" is given it (the Lagos calendar day from `DemoReference`), so results are identical on the server,
 * during hydration and on every later interaction. Appointment dates are plain calendar days (YYYY-MM-DD), so
 * they are parsed and formatted in UTC and never shift with the viewer's time zone.
 */

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
const weekdayMonth = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
const weekdayOnly = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" });
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

/** "Monday 9 November" */
export function formatWeekdayDayMonth(date: string): string {
  return weekdayMonth.format(utc(date)).replace(",", "");
}

/** "9 November" */
export function formatDayMonth(date: string): string {
  return dayMonth.format(utc(date));
}

export function formatMonth(date: string): string {
  return monthOnly.format(utc(date));
}

export function formatDayOfMonth(date: string): string {
  return dayOnly.format(utc(date));
}

/** "Today", "Tomorrow", "In 3 days", "Yesterday", "3 days ago", relative to `today`. */
export function describeRelativeDay(date: string, today: string): string {
  const diff = daysBetween(today, date);
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

const receivedClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });

/** The Lagos calendar day (YYYY-MM-DD) of an ISO timestamp. */
export function receivedDate(iso: string): string {
  return lagosDateOf(new Date(iso));
}

/** The Lagos wall-clock time of an ISO timestamp, "14:20". */
export function receivedTime(iso: string): string {
  return receivedClock.format(new Date(iso));
}

/** "3 Nov 2026" */
export function formatReceivedDate(iso: string): string {
  return formatPlainDate(receivedDate(iso));
}

/** "3 Nov 2026, 14:20" */
export function formatReceivedDateTime(iso: string): string {
  return `${formatReceivedDate(iso)}, ${receivedTime(iso)}`;
}

/**
 * A short, relative label for an activity-feed event: "Today, 08:42", "Yesterday, 17:00", a weekday name for
 * the rest of the past week ("Monday, 14:30") and a date after that ("28 Oct, 09:15").
 */
export function describeActivityTime(iso: string, today: string): string {
  const day = receivedDate(iso);
  const clock = receivedTime(iso);
  const ago = daysBetween(day, today);
  if (ago <= 0) return `Today, ${clock}`;
  if (ago === 1) return `Yesterday, ${clock}`;
  if (ago < 7) return `${weekdayOnly.format(utc(day))}, ${clock}`;
  return `${formatDayOfMonth(day)} ${formatMonth(day)}, ${clock}`;
}
