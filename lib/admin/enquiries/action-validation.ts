import { cleanMessage } from "@/lib/enquiry/server/text";
import { isEnquiryStatus, isUuid } from "./query-params";
import type { EnquiryStatus } from "./types";

/** Server-side checks for the two things an administrator can change. Pure: the Server Actions call these first. */

export const maxNoteLength = 4000;

export type StatusChangeInput = { id: string; expected: EnquiryStatus; next: EnquiryStatus };
export type NoteInput = { enquiryId: string; content: string };
type Failure = { ok: false; message: string };

export function parseStatusChange(input: { enquiryId: unknown; expectedStatus: unknown; nextStatus: unknown }): ({ ok: true } & StatusChangeInput) | Failure {
  if (!isUuid(input.enquiryId)) return { ok: false, message: "That enquiry could not be identified." };
  if (!isEnquiryStatus(input.nextStatus) || !isEnquiryStatus(input.expectedStatus)) return { ok: false, message: "That is not a valid status." };
  if (input.nextStatus === input.expectedStatus) return { ok: false, message: "The enquiry already has that status." };
  return { ok: true, id: input.enquiryId.toLowerCase(), expected: input.expectedStatus, next: input.nextStatus };
}

export function parseNote(input: { enquiryId: unknown; content: unknown }): ({ ok: true } & NoteInput) | Failure {
  if (!isUuid(input.enquiryId)) return { ok: false, message: "That enquiry could not be identified." };
  if (typeof input.content !== "string") return { ok: false, message: "Write a note before adding it." };
  const content = cleanMessage(input.content);
  if (content.length === 0) return { ok: false, message: "Write a note before adding it." };
  if (content.length > maxNoteLength) return { ok: false, message: `Keep the note to ${maxNoteLength} characters or fewer.` };
  return { ok: true, enquiryId: input.enquiryId.toLowerCase(), content };
}
