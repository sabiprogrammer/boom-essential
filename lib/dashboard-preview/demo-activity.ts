import { describeActivityTime, formatTime, formatWeekdayDayMonth } from "./dates";
import { divisionLabels } from "./labels";
import type { DemoReference } from "./reference";
import type { ActivityKind, DemoActivity, DemoEnquiry } from "./types";

type DraftEvent = { id: string; kind: ActivityKind; text: string; at: string };

/**
 * DEMONSTRATION DATA ONLY: the starting activity feed. It is built FROM the sample enquiries, so every event
 * agrees with them (references, customers, dates and times) and moves with the reference date. Newest first.
 * Newer events are added at the top while the visitor tries the demo controls.
 */
export function createDemoActivity(enquiries: readonly DemoEnquiry[], reference: DemoReference): DemoActivity[] {
  const find = (number: number) => enquiries.find((e) => e.reference === `BMG-2026-0${number}`);
  const noteTime = (enquiry: DemoEnquiry | undefined, noteId: string) => enquiry?.notes.find((n) => n.id === noteId)?.createdAt ?? null;

  const events: (DraftEvent | null | undefined)[] = [];

  for (const [id, number] of [
    ["a-1", 124],
    ["a-2", 123],
  ] as const) {
    const enquiry = find(number);
    events.push(
      enquiry && {
        id,
        kind: "enquiry",
        text: `New enquiry ${enquiry.reference} received from ${enquiry.customer.name} (${divisionLabels[enquiry.division].toUpperCase()}).`,
        at: enquiry.receivedAt,
      },
    );
  }

  const requested = find(122);
  events.push(
    requested?.appointment && {
      id: "a-3",
      kind: "appointment",
      text: `Appointment requested for ${requested.reference}, ${formatWeekdayDayMonth(requested.appointment.preferredDate)}, ${formatTime(requested.appointment.preferredTime)}.`,
      at: requested.receivedAt,
    },
  );

  const confirmed = find(118);
  const confirmedAt = noteTime(confirmed, "n-118-1");
  events.push(
    confirmed && confirmedAt
      ? { id: "a-4", kind: "status", text: `${confirmed.reference} moved to In Progress after the appointment was confirmed.`, at: confirmedAt }
      : null,
  );

  const noted = find(117);
  const notedAt = noteTime(noted, "n-117-1");
  events.push(
    noted && notedAt
      ? { id: "a-5", kind: "note", text: `Internal note added to ${noted.reference} asking for system details and photos.`, at: notedAt }
      : null,
  );

  const checked = find(109);
  const checkedAt = noteTime(checked, "n-109-2");
  events.push(
    checked && checkedAt
      ? { id: "a-6", kind: "appointment", text: `Site check completed for ${checked.reference} (CCTV maintenance).`, at: checkedAt }
      : null,
  );

  return events
    .filter((event): event is DraftEvent => !!event)
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .map((event) => ({ id: event.id, kind: event.kind, text: event.text, at: describeActivityTime(event.at, reference.today) }));
}
