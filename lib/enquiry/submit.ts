import { enquiryEndpoint, isEnquiryReference, type EnquiryApiRequest } from "./api-contract";
import type { EnquirySubmission, FieldErrors } from "./types";

export type SubmitResult =
  /** The server confirmed the enquiry was saved. The ONLY result that may be shown as success. */
  | { ok: true; reference: string; appointmentRequested: boolean }
  /** The server refused specific fields; nothing was saved. */
  | { ok: false; reason: "invalid"; message: string; fieldErrors: FieldErrors }
  /** Nothing was saved. `network` means no confirmed answer arrived: the enquiry may or may not have been saved. */
  | { ok: false; reason: "rate-limited" | "unavailable" | "network" | "failed"; message: string };

const TIMEOUT_MS = 20_000;

const messages = {
  network:
    "We could not confirm that your enquiry was sent, so please check your connection and try again. Your details are still here, and sending again is safe.",
  unavailable: "We could not save your enquiry just now.",
  failed: "Something went wrong and your enquiry was not saved.",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Sends the validated form to POST /api/enquiries (see lib/enquiry/api-contract.ts) and reports what the server
 * said. Success is returned ONLY for an HTTP 2xx whose body says ok and carries a valid BOOM reference, so the
 * interface can never claim success the database has not confirmed. Nothing is stored in the browser.
 *
 * `submissionId` must stay the same across retries of one form attempt: it makes a repeat harmless (the server
 * returns the original enquiry instead of creating another).
 */
export async function submitEnquiry(submission: EnquirySubmission, submissionId: string): Promise<SubmitResult> {
  const request: EnquiryApiRequest = { ...submission, submissionId };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(enquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(request),
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    return { ok: false, reason: "network", message: messages.network };
  } finally {
    clearTimeout(timer);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // An answer that is not our JSON (a proxy error page, a cut-off response) is not a confirmation.
    return { ok: false, reason: response.ok ? "network" : "unavailable", message: response.ok ? messages.network : messages.unavailable };
  }

  if (response.ok && isRecord(body) && body.ok === true && isEnquiryReference(body.reference)) {
    return { ok: true, reference: body.reference, appointmentRequested: body.appointmentRequested === true };
  }

  if (isRecord(body) && body.ok === false) {
    const message = typeof body.message === "string" && body.message ? body.message : messages.failed;
    if (body.code === "invalid") {
      return { ok: false, reason: "invalid", message, fieldErrors: isRecord(body.fieldErrors) ? (body.fieldErrors as FieldErrors) : {} };
    }
    if (body.code === "rate_limited") return { ok: false, reason: "rate-limited", message };
    if (body.code === "unavailable") return { ok: false, reason: "unavailable", message };
    return { ok: false, reason: "failed", message };
  }

  return { ok: false, reason: "failed", message: messages.failed };
}
