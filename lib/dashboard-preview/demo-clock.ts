import { addDays } from "./dates";
import type { DemoReference } from "./reference";

const minuteMs = 60_000;

/**
 * Builders for the sample data's times, all relative to the reference moment, so no calendar date is ever
 * typed into the data. Africa/Lagos has a fixed +01:00 offset all year (no daylight saving), so wall-clock
 * times written here are exact.
 */
export function createDemoClock(reference: DemoReference) {
  return {
    /** The calendar day `offset` days from today (negative = past), YYYY-MM-DD. */
    day: (offset: number): string => addDays(reference.today, offset),
    /** A wall-clock time (HH:MM, Lagos) on the day `offset` days from today, as an ISO 8601 timestamp. */
    at: (offset: number, time: string): string => `${addDays(reference.today, offset)}T${time}:00+01:00`,
    /** An instant `minutes` before now, as an ISO 8601 timestamp (so it can never be in the future). */
    minutesAgo: (minutes: number): string => new Date(reference.nowMs - minutes * minuteMs).toISOString(),
  };
}
