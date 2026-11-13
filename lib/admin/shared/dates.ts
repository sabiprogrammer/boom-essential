/**
 * Date formatting for the administrator screens. Appointment dates are plain calendar days (YYYY-MM-DD) and are parsed
 * and formatted in UTC, so they never shift with the viewer's time zone. Instants (when something was received or
 * changed) are shown in Africa/Lagos time, whatever the viewer's device is set to. Nothing here reads the clock.
 */

function utc(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const plainDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthOnly = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const dayOnly = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "UTC" });
const lagosDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" });
const lagosClock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });

/** "Friday, 20 November 2026" */
export function formatLongDate(date: string): string {
  return longDate.format(utc(date));
}

/** "5 Nov 2026" */
export function formatPlainDate(date: string): string {
  return plainDate.format(utc(date));
}

/** "Nov" */
export function formatMonth(date: string): string {
  return monthOnly.format(utc(date));
}

/** "5" */
export function formatDayOfMonth(date: string): string {
  return dayOnly.format(utc(date));
}

/** "14:30" -> "2:30 pm" */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** The Lagos calendar day (YYYY-MM-DD) of an ISO timestamp. */
export function receivedDate(iso: string): string {
  return lagosDay.format(new Date(iso));
}

/** The Lagos wall-clock time of an ISO timestamp, "14:20". */
export function receivedTime(iso: string): string {
  return lagosClock.format(new Date(iso));
}

/** "3 Nov 2026" */
export function formatReceivedDate(iso: string): string {
  return formatPlainDate(receivedDate(iso));
}

/** "3 Nov 2026, 14:20" */
export function formatReceivedDateTime(iso: string): string {
  return `${formatReceivedDate(iso)}, ${receivedTime(iso)}`;
}
