import type { EnquiryApiFailure, EnquiryApiFailureCode, EnquiryApiSuccess } from "../api-contract";
import type { FieldErrors } from "../types";

/**
 * Builders for the endpoint's JSON responses. Every response is uncacheable and not indexable, and failure
 * messages are fixed strings: nothing from a database error or an exception ever reaches the visitor.
 */

const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

const failures: Record<EnquiryApiFailureCode, { status: number; message: string }> = {
  invalid: { status: 400, message: "Some details need attention. Please check the form and try again." },
  rejected: { status: 400, message: "We could not accept this enquiry." },
  rate_limited: { status: 429, message: "You have sent several enquiries recently. Please try again later." },
  too_large: { status: 413, message: "That enquiry is too large to send." },
  unsupported: { status: 415, message: "We could not read that request." },
  unavailable: { status: 503, message: "We could not save your enquiry just now." },
};

export function respondSuccess(reference: string, appointmentRequested: boolean, duplicate: boolean): Response {
  const body: EnquiryApiSuccess = { ok: true, reference, appointmentRequested };
  // 201 for a new record, 200 when an earlier identical submission is being confirmed again.
  return Response.json(body, { status: duplicate ? 200 : 201, headers });
}

export function respondFailure(code: EnquiryApiFailureCode, fieldErrors?: FieldErrors): Response {
  const { status, message } = failures[code];
  const body: EnquiryApiFailure = { ok: false, code, message, ...(fieldErrors && Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}) };
  const extra: Record<string, string> = code === "rate_limited" ? { "Retry-After": "3600" } : {};
  return Response.json(body, { status, headers: { ...headers, ...extra } });
}
