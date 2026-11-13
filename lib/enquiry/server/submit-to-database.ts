import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/secret-client";
import { isEnquiryReference } from "../api-contract";
import type { DatabaseSubmitResult, SubmitToDatabase } from "./database-result";

/**
 * The only database call the public form makes: the SECURITY DEFINER function public.submit_enquiry (see
 * supabase/migrations/20261113110100_create_submit_enquiry_function.sql). It creates the enquiry and, when asked,
 * its appointment request in ONE transaction, applies the persistent rate limit and the idempotency check, and
 * generates the id, reference, status, source and timestamps itself. This code passes only validated values and
 * never a status, id, reference or timestamp. The function is executable by the secret-key role alone.
 *
 * Nothing from a database error is ever returned or logged beyond its short error code: a constraint failure
 * message can quote the row that failed, and that row holds a visitor's personal details.
 */

const KNOWN_OUTCOMES = new Set(["created", "duplicate", "rate_limited"]);

export const submitToDatabase: SubmitToDatabase = async (parsed, clientKey): Promise<DatabaseSubmitResult> => {
  let client;
  try {
    client = createSupabaseSecretClient();
  } catch {
    console.error("[enquiries] the secret-key client is not configured");
    return { kind: "unavailable" };
  }

  try {
    const { data, error } = await client.rpc("submit_enquiry", {
      p_submission_id: parsed.submissionId,
      p_client_key: clientKey,
      p_full_name: parsed.fullName,
      p_phone: parsed.phone,
      p_phone_e164: parsed.phoneE164,
      p_email: parsed.email,
      p_organisation: parsed.organisation,
      p_location: parsed.location,
      p_division: parsed.division,
      p_requested_service: parsed.requestedService,
      p_requested_item: parsed.requestedItem,
      p_message: parsed.message,
      p_preferred_date: parsed.appointment?.preferredDate ?? null,
      p_preferred_time: parsed.appointment?.preferredTime ?? null,
    });

    if (error) {
      console.error("[enquiries] the database call failed", { code: error.code });
      return { kind: error.code === "23514" ? "rejected" : "unavailable" };
    }

    const outcome = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
    if (!outcome || typeof outcome.outcome !== "string" || !KNOWN_OUTCOMES.has(outcome.outcome)) {
      console.error("[enquiries] the database returned an unexpected result");
      return { kind: "unavailable" };
    }

    if (outcome.outcome === "rate_limited") return { kind: "rate_limited" };

    if (!isEnquiryReference(outcome.reference)) {
      console.error("[enquiries] the database returned no valid reference");
      return { kind: "unavailable" };
    }
    return {
      kind: "saved",
      reference: outcome.reference,
      appointmentRequested: outcome.appointment === true,
      duplicate: outcome.outcome === "duplicate",
    };
  } catch {
    console.error("[enquiries] the database call threw");
    return { kind: "unavailable" };
  }
};
