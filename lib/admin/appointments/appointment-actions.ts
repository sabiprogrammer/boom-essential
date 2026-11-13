"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLongDate, formatTime } from "@/lib/admin/shared/dates";
import { composeCancellationNote, parseCancel, parseComplete, parseConfirm, parseReschedule } from "./action-validation";
import type { AppointmentActionState, CancelPayload, CompletePayload, ConfirmPayload, ReschedulePayload } from "./action-state";
import { lagosToday } from "./slot";

/**
 * The four things an administrator can do to an appointment. Server Actions are public HTTP endpoints in all but name,
 * so each one:
 *   1. calls requireAdmin() FIRST (verified session and the allowlist; redirects to sign-in otherwise),
 *   2. validates every input itself, with "today" taken on the server in Africa/Lagos,
 *   3. acts with the signed-in administrator's own session, so Row Level Security independently requires an ACTIVE
 *      administrator, and the column grants allow only status, the confirmed date and time, venue and scheduling note,
 *   4. only applies a change if the appointment still has the status the administrator was looking at,
 *   5. answers with a fixed, plain message, never a database message.
 *
 * The audit trail is the DATABASE's: triggers write the status history and the activity entry (who, when, from and to)
 * whenever a status genuinely changes, and the database stamps who confirmed an appointment and when. Rescheduling is
 * one database function, so the original is cancelled and its linked replacement created together or not at all; the
 * original record is kept untouched. Nothing is ever deleted, and no preferred date or time is ever edited.
 */

const unavailable: AppointmentActionState = { status: "error", message: "That could not be saved just now. Nothing was changed. Please try again." };
const conflictMessage = "Someone else has just changed this appointment. It has been refreshed, so please check and try again.";
const missingMessage = "That appointment could not be updated. It may not exist, or you may not have permission.";

function refreshScreens() {
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

type Client = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type UpdateOutcome = "ok" | "conflict" | "missing" | "invalid" | "failed";

/** Applies a status-guarded update and works out why it changed nothing when it did not. */
async function guardedUpdate(supabase: Client, id: string, expected: string, patch: Record<string, string>): Promise<UpdateOutcome> {
  const { data, error } = await supabase.from("appointments").update(patch).eq("id", id).eq("status", expected).select("id");
  if (error) return error.code === "23514" ? "invalid" : "failed";
  if (data && data.length > 0) return "ok";
  const current = await supabase.from("appointments").select("status").eq("id", id).maybeSingle();
  if (current.error) return "failed";
  return current.data ? "conflict" : "missing";
}

function failure(outcome: Exclude<UpdateOutcome, "ok">): AppointmentActionState {
  if (outcome === "conflict") return { status: "error", message: conflictMessage };
  if (outcome === "missing") return { status: "error", message: missingMessage };
  if (outcome === "invalid") return { status: "error", message: "The date or time was not accepted. Please check them and try again." };
  return unavailable;
}

export async function confirmAppointmentAction(payload: ConfirmPayload): Promise<AppointmentActionState> {
  await requireAdmin();

  const input = parseConfirm(payload, lagosToday());
  if (!input.ok) return { status: "error", message: input.message, fieldErrors: input.fieldErrors };

  try {
    const supabase = await createSupabaseServerClient();
    const patch: Record<string, string> = { status: "confirmed", confirmed_date: input.date, confirmed_time: input.time };
    if (input.venue) patch.venue = input.venue;
    if (input.note) patch.scheduling_note = input.note;

    const outcome = await guardedUpdate(supabase, input.id, "requested", patch);
    if (outcome !== "ok") {
      if (outcome === "conflict") refreshScreens();
      return failure(outcome);
    }
    refreshScreens();
    return { status: "success", message: `Confirmed for ${formatLongDate(input.date)} at ${formatTime(input.time)} (Lagos time).` };
  } catch {
    return unavailable;
  }
}

export async function completeAppointmentAction(payload: CompletePayload): Promise<AppointmentActionState> {
  await requireAdmin();

  const input = parseComplete(payload);
  if (!input.ok) return { status: "error", message: input.message };

  try {
    const supabase = await createSupabaseServerClient();
    const outcome = await guardedUpdate(supabase, input.id, "confirmed", { status: "completed" });
    if (outcome !== "ok") {
      if (outcome === "conflict") refreshScreens();
      return failure(outcome);
    }
    refreshScreens();
    return { status: "success", message: "Marked as completed." };
  } catch {
    return unavailable;
  }
}

export async function cancelAppointmentAction(payload: CancelPayload): Promise<AppointmentActionState> {
  await requireAdmin();

  const input = parseCancel(payload);
  if (!input.ok) return { status: "error", message: input.message };

  try {
    const supabase = await createSupabaseServerClient();
    const patch: Record<string, string> = { status: "cancelled" };

    if (input.reason) {
      // Keep the reason with the appointment (after any note already there), never replacing it.
      const current = await supabase.from("appointments").select("scheduling_note").eq("id", input.id).maybeSingle();
      if (current.error) return unavailable;
      const existing = typeof current.data?.scheduling_note === "string" ? current.data.scheduling_note : null;
      const note = composeCancellationNote(existing, input.reason);
      if (note) patch.scheduling_note = note;
    }

    const outcome = await guardedUpdate(supabase, input.id, input.expected, patch);
    if (outcome !== "ok") {
      if (outcome === "conflict") refreshScreens();
      return failure(outcome);
    }
    refreshScreens();
    return { status: "success", message: "Appointment cancelled. The record is kept in the history." };
  } catch {
    return unavailable;
  }
}

export async function rescheduleAppointmentAction(payload: ReschedulePayload): Promise<AppointmentActionState> {
  await requireAdmin();

  const input = parseReschedule(payload, lagosToday());
  if (!input.ok) return { status: "error", message: input.message, fieldErrors: input.fieldErrors };

  try {
    const supabase = await createSupabaseServerClient();
    // One database function does both steps atomically: cancel the original (kept) and create the linked replacement.
    const { data, error } = await supabase.rpc("reschedule_appointment", {
      p_appointment_id: input.id,
      p_expected_status: input.expected,
      p_preferred_date: input.date,
      p_preferred_time: input.time,
      p_confirm: input.confirm,
      p_note: input.note,
    });

    if (error) {
      if (error.code === "PGRST202" || error.code === "42883") {
        return { status: "error", message: "Rescheduling is not available yet because a database update has not been applied. Nothing was changed." };
      }
      return failure(error.code === "23514" ? "invalid" : "failed");
    }

    const outcome = typeof data === "object" && data !== null ? (data as Record<string, unknown>).outcome : null;
    if (outcome === "conflict") {
      refreshScreens();
      return failure("conflict");
    }
    if (outcome === "not_found") return failure("missing");
    if (outcome !== "rescheduled") return unavailable;

    refreshScreens();
    const when = `${formatLongDate(input.date)} at ${formatTime(input.time)} (Lagos time)`;
    return {
      status: "success",
      message: input.confirm
        ? `Rescheduled and confirmed for ${when}. The original is kept as cancelled.`
        : `Rescheduled to ${when}. The new time is a request until you confirm it, and the original is kept as cancelled.`,
    };
  } catch {
    return unavailable;
  }
}
