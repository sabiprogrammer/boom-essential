/**
 * Validation of an appointment date and time as an administrator types them. Pure: "today" is passed in (the Africa/Lagos
 * calendar day), so nothing here reads the clock. The same window the database enforces: today or later, at most 366
 * days ahead. Times are 24-hour HH:MM in Lagos time.
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
export const slotWindowDays = 366;

function toUtc(date: string): Date | null {
  if (!DATE.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const value = new Date(Date.UTC(y, m - 1, d));
  return value.getUTCFullYear() === y && value.getUTCMonth() === m - 1 && value.getUTCDate() === d ? value : null;
}

export function addDaysTo(date: string, days: number): string {
  const value = toUtc(date) as Date;
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export type SlotErrors = { date?: string; time?: string };

export function validateSlot(date: unknown, time: unknown, today: string): { ok: true; date: string; time: string } | { ok: false; errors: SlotErrors } {
  const errors: SlotErrors = {};
  const d = typeof date === "string" ? date.trim() : "";
  const t = typeof time === "string" ? time.trim() : "";

  if (!d) errors.date = "Choose a date.";
  else if (!toUtc(d)) errors.date = "Enter a valid date.";
  else if (d < today) errors.date = "Choose today or a later date.";
  else if (d > addDaysTo(today, slotWindowDays)) errors.date = "Choose a date within the next year.";

  if (!t) errors.time = "Choose a time.";
  else if (!TIME.test(t)) errors.time = "Enter a valid time.";

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, date: d, time: t };
}

/** Today's calendar day in Africa/Lagos, YYYY-MM-DD. Call from request handlers only, never during prerender. */
export function lagosToday(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}
