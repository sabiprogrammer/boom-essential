"use server";

import { revalidatePath } from "next/cache";
import { enquiryStatusLabels } from "@/lib/admin/shared/labels";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "./action-state";
import { parseNote, parseStatusChange } from "./action-validation";

/**
 * The two changes an administrator can make to an enquiry. Both are Server Actions, which are public HTTP
 * endpoints in all but name, so each one:
 *   1. calls requireAdmin() FIRST (verified session and the allowlist; redirects to sign-in otherwise),
 *   2. validates every input itself (nothing from the browser is trusted),
 *   3. writes with the signed-in administrator's own session, so Row Level Security independently requires an
 *      ACTIVE administrator in the database, and the column grants allow only the `status` column of `enquiries`
 *      and the `enquiry_id` and `content` columns of `enquiry_notes`,
 *   4. answers with a fixed, plain message (never a database message, which can quote the row).
 *
 * The audit trail is written by the DATABASE, not by this code: a trigger records the previous and new status, the
 * administrator (from the verified session) and the time whenever a status genuinely changes, and another logs a
 * note being added (never its text). A note's author is also set by the database from the session, so neither can
 * be forged or skipped from here. Nothing is ever deleted.
 */

const unavailable: ActionState = { status: "error", message: "That could not be saved just now. Nothing was changed. Please try again." };

export async function updateEnquiryStatusAction(enquiryId: string, expectedStatus: string, nextStatus: string): Promise<ActionState> {
  await requireAdmin();

  const input = parseStatusChange({ enquiryId, expectedStatus, nextStatus });
  if (!input.ok) return { status: "error", message: input.message };

  try {
    const supabase = await createSupabaseServerClient();

    // The update only applies if the enquiry still has the status the administrator was looking at, so two people
    // working on the same enquiry never silently overwrite each other.
    const { data, error } = await supabase
      .from("enquiries")
      .update({ status: input.next })
      .eq("id", input.id)
      .eq("status", input.expected)
      .select("id");
    if (error) return unavailable;

    if (!data || data.length === 0) {
      const current = await supabase.from("enquiries").select("status").eq("id", input.id).maybeSingle();
      if (current.error) return unavailable;
      if (current.data) {
        revalidatePath("/admin");
        return { status: "error", message: "Someone else has just changed this enquiry. It has been refreshed, so please check and try again." };
      }
      return { status: "error", message: "That enquiry could not be updated. It may not exist, or you may not have permission." };
    }

    revalidatePath("/admin");
    return { status: "success", message: `Status changed to ${enquiryStatusLabels[input.next]}.` };
  } catch {
    return unavailable;
  }
}

export async function addEnquiryNoteAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const input = parseNote({ enquiryId: formData.get("enquiryId"), content: formData.get("content") });
  if (!input.ok) return { status: "error", message: input.message };

  try {
    const supabase = await createSupabaseServerClient();
    // Only these two columns are ever sent: the author and the time are set by the database.
    const { data, error } = await supabase
      .from("enquiry_notes")
      .insert({ enquiry_id: input.enquiryId, content: input.content })
      .select("id");
    if (error) {
      return error.code === "23503"
        ? { status: "error", message: "That enquiry could not be found, so the note was not added." }
        : unavailable;
    }
    if (!data || data.length === 0) return unavailable;

    revalidatePath("/admin");
    return { status: "success", message: "Note added." };
  } catch {
    return unavailable;
  }
}
