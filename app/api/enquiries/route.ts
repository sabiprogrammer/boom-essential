import { handleEnquiryRequest } from "@/lib/enquiry/server/handle-request";
import { submitToDatabase } from "@/lib/enquiry/server/submit-to-database";

/**
 * POST /api/enquiries: the public Contact form's only way to save an enquiry. Everything happens in
 * lib/enquiry/server/handle-request.ts (origin check, size limit, spam checks, full server-side validation,
 * then one atomic database call); this file only wires the real database and clock into it. Other methods are
 * answered by Next.js with 405. Not part of the /admin area: it is public by design, so its protection is
 * validation, the honeypot, the same-origin check and the database-backed rate limit.
 */
export async function POST(request: Request): Promise<Response> {
  return handleEnquiryRequest(request, { submit: submitToDatabase, now: () => new Date() });
}
