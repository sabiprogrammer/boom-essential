import { formatLongDate, formatPlainDate, formatTime } from "@/lib/admin/shared/dates";

/**
 * Appointment dates are plain calendar days and times are wall-clock times in Africa/Lagos (Nigeria has a single time
 * zone and no daylight saving), so they are shown exactly as stored and always labelled as Lagos time. Nothing is
 * converted to the viewer's time zone. Pure.
 */

/** "Thursday 20 November 2026, 10:30 am" */
export function formatSlotLong(date: string, time: string): string {
  return `${formatLongDate(date)}, ${formatTime(time)}`;
}

/** "20 Nov 2026, 10:30 am" */
export function formatSlotShort(date: string, time: string): string {
  return `${formatPlainDate(date)}, ${formatTime(time)}`;
}

export const lagosTimeNote = "Lagos time";
