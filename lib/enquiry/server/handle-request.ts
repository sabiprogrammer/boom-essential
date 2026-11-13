import { enquiryRequestMaxBytes } from "../api-contract";
import { getClientKey } from "./client-key";
import type { SubmitToDatabase } from "./database-result";
import { parseEnquiryRequest } from "./parse";
import { readBodyText } from "./read-body";
import { respondFailure, respondSuccess } from "./responses";
import { isHoneypotTriggered, isSameOriginRequest } from "./spam";

/**
 * The whole request pipeline of POST /api/enquiries, with its two outside dependencies injected so it can be
 * tested without a network: `submit` (the database) and `now` (the clock). The route file only wires the real
 * ones in. Order matters and is deliberate:
 *
 *   1. same-origin check             (cheapest; stops other sites driving the endpoint)
 *   2. JSON content type
 *   3. size-limited body read        (an oversized body is never parsed or held)
 *   4. JSON parse
 *   5. honeypot                      (before validation, so a bot learns nothing about which fields were wrong)
 *   6. full server-side validation   (the authority; client values are never trusted)
 *   7. the database call, which is atomic and enforces the persistent rate limit
 *
 * Success is returned only when the database confirms the enquiry was saved.
 */

export type HandlerDeps = {
  submit: SubmitToDatabase;
  now: () => Date;
};

export async function handleEnquiryRequest(request: Request, deps: HandlerDeps): Promise<Response> {
  try {
    return await handle(request, deps);
  } catch {
    // Never let an unexpected error surface as a raw 500 page or leak anything; nothing was reported saved.
    console.error("[enquiries] unexpected error while handling a submission");
    return respondFailure("unavailable");
  }
}

async function handle(request: Request, deps: HandlerDeps): Promise<Response> {
  if (!isSameOriginRequest(request.headers)) return respondFailure("rejected");

  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return respondFailure("unsupported");

  const raw = await readBodyText(request, enquiryRequestMaxBytes);
  if (raw === null) return respondFailure("too_large");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return respondFailure("invalid");
  }

  if (typeof body === "object" && body !== null && isHoneypotTriggered((body as Record<string, unknown>).honeypot)) {
    return respondFailure("rejected");
  }

  const todayInLagos = deps.now().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
  const parsed = parseEnquiryRequest(body, todayInLagos);
  if (!parsed.ok) return respondFailure("invalid", parsed.fieldErrors);

  const result = await deps.submit(parsed.value, getClientKey(request.headers));
  switch (result.kind) {
    case "saved":
      return respondSuccess(
        result.reference,
        result.duplicate ? parsed.value.appointment !== null : result.appointmentRequested,
        result.duplicate,
      );
    case "rate_limited":
      return respondFailure("rate_limited");
    case "rejected":
      return respondFailure("rejected");
    default:
      return respondFailure("unavailable");
  }
}
