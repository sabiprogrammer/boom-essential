import { enquirySubmissionEnabled } from "./config";
import type { EnquirySubmission } from "./types";

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "not-connected" }
  | { ok: false; reason: "failed"; message: string };

/**
 * The single seam between the form and a future secure server-side handler. TODAY IT SENDS NOTHING: it
 * makes no network request, stores nothing (no localStorage, cookies or session storage) and never
 * reports success. When the backend exists, replace the body with a call to a server action that validates
 * again, applies rate limiting and spam protection, and writes the record with the server-assigned status.
 */
export async function submitEnquiry(submission: EnquirySubmission): Promise<SubmitResult> {
  void submission;
  if (!enquirySubmissionEnabled) return { ok: false, reason: "not-connected" };
  return { ok: false, reason: "failed", message: "Submission is not available yet." };
}
