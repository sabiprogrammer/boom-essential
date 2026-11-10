/**
 * The demonstration's reference moment: the instant the dashboard treats as "now" and the Africa/Lagos
 * calendar day it falls on ("today"). Every demo date (enquiries received, appointments, notes, activity) is
 * built relative to it, so the sample data always looks current: upcoming appointments are in the future, past
 * ones in the past, and "Today", "Tomorrow" and "Yesterday" are accurate.
 *
 * It is created once per page load, in the browser (see hooks/useDemoReference.ts), never during prerender:
 * `new Date()` cannot run while the page is prerendered, and a build-time date would be stale the moment the
 * site is visited. This module itself is pure; the caller supplies the clock.
 */
export type DemoReference = {
  /** The Africa/Lagos calendar day, YYYY-MM-DD. */
  today: string;
  /** The instant "now", in milliseconds since the epoch. */
  nowMs: number;
};

const lagosDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" });

/** The Lagos calendar day (YYYY-MM-DD) of an instant, whatever time zone the viewer's device is set to. */
export function lagosDateOf(instant: Date | number): string {
  return lagosDay.format(instant);
}

export function createDemoReference(now: Date): DemoReference {
  return { today: lagosDateOf(now), nowMs: now.getTime() };
}
