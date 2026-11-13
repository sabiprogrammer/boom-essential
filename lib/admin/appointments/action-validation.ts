import { isUuid } from "@/lib/admin/enquiries/query-params";
import { cleanMessage, cleanSingleLine } from "@/lib/enquiry/server/text";
import { validateSlot } from "./slot";

/**
 * Server-side checks for the four things an administrator can do to an appointment. Pure: the Server Actions call
 * these first and trust nothing from the browser. The limits match the database's (venue 200 characters, notes 1000).
 */

export const maxVenueLength = 200;
export const maxNoteLength = 1000;
export const maxReasonLength = 500;

type Failure = { ok: false; message: string; fieldErrors?: { date?: string; time?: string } };

const bad = (message: string): Failure => ({ ok: false, message });
const openStatus = (value: unknown): value is "requested" | "confirmed" => value === "requested" || value === "confirmed";

function optionalText(value: unknown, clean: (v: string) => string, max: number, label: string): { ok: true; value: string | null } | Failure {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (typeof value !== "string") return bad(`${label} is not valid.`);
  const text = clean(value);
  if (text.length > max) return bad(`Keep ${label.toLowerCase()} to ${max} characters or fewer.`);
  return { ok: true, value: text || null };
}

export type ConfirmInput = { id: string; date: string; time: string; venue: string | null; note: string | null };

export function parseConfirm(
  input: { appointmentId: unknown; date: unknown; time: unknown; venue?: unknown; note?: unknown },
  today: string,
): ({ ok: true } & ConfirmInput) | Failure {
  if (!isUuid(input.appointmentId)) return bad("That appointment could not be identified.");
  const slot = validateSlot(input.date, input.time, today);
  if (!slot.ok) return { ok: false, message: slot.errors.date ?? slot.errors.time ?? "Check the date and time.", fieldErrors: slot.errors };
  const venue = optionalText(input.venue, cleanSingleLine, maxVenueLength, "The venue");
  if (!venue.ok) return venue;
  const note = optionalText(input.note, cleanMessage, maxNoteLength, "The note");
  if (!note.ok) return note;
  return { ok: true, id: input.appointmentId.toLowerCase(), date: slot.date, time: slot.time, venue: venue.value, note: note.value };
}

export type RescheduleInput = { id: string; expected: "requested" | "confirmed"; date: string; time: string; confirm: boolean; note: string | null };

export function parseReschedule(
  input: { appointmentId: unknown; expectedStatus: unknown; date: unknown; time: unknown; confirm?: unknown; note?: unknown },
  today: string,
): ({ ok: true } & RescheduleInput) | Failure {
  if (!isUuid(input.appointmentId)) return bad("That appointment could not be identified.");
  if (!openStatus(input.expectedStatus)) return bad("Only a requested or confirmed appointment can be rescheduled.");
  const slot = validateSlot(input.date, input.time, today);
  if (!slot.ok) return { ok: false, message: slot.errors.date ?? slot.errors.time ?? "Check the date and time.", fieldErrors: slot.errors };
  const note = optionalText(input.note, cleanMessage, maxNoteLength, "The note");
  if (!note.ok) return note;
  return { ok: true, id: input.appointmentId.toLowerCase(), expected: input.expectedStatus, date: slot.date, time: slot.time, confirm: input.confirm === true, note: note.value };
}

export type CancelInput = { id: string; expected: "requested" | "confirmed"; reason: string | null };

export function parseCancel(input: { appointmentId: unknown; expectedStatus: unknown; reason?: unknown }): ({ ok: true } & CancelInput) | Failure {
  if (!isUuid(input.appointmentId)) return bad("That appointment could not be identified.");
  if (!openStatus(input.expectedStatus)) return bad("Only a requested or confirmed appointment can be cancelled.");
  const reason = optionalText(input.reason, cleanMessage, maxReasonLength, "The reason");
  if (!reason.ok) return reason;
  return { ok: true, id: input.appointmentId.toLowerCase(), expected: input.expectedStatus, reason: reason.value };
}

export type CompleteInput = { id: string };

export function parseComplete(input: { appointmentId: unknown; expectedStatus: unknown }): ({ ok: true } & CompleteInput) | Failure {
  if (!isUuid(input.appointmentId)) return bad("That appointment could not be identified.");
  if (input.expectedStatus !== "confirmed") return bad("Only a confirmed appointment can be marked as completed.");
  return { ok: true, id: input.appointmentId.toLowerCase() };
}

/**
 * The cancellation reason is kept in the appointment's scheduling note, after anything already written there, and never
 * longer than the database allows. The earlier note is shortened (from the start) rather than the reason.
 */
export function composeCancellationNote(existing: string | null, reason: string | null): string | null {
  if (!reason) return null;
  const addition = `Cancelled: ${reason}`;
  if (!existing) return addition.slice(0, maxNoteLength);
  const room = maxNoteLength - addition.length - 1;
  if (room <= 0) return addition.slice(0, maxNoteLength);
  const kept = existing.length > room ? existing.slice(existing.length - room) : existing;
  return `${kept}\n${addition}`;
}
