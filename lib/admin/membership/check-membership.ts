import "server-only";
import { cache } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Asks the database whether the signed-in person is an ACTIVE administrator there (public.am_i_active_admin()).
 *
 * Why it exists: access to /admin needs TWO things, the application's allowlist (BOOM_ADMIN_USER_IDS) AND an active row
 * in the database's administrator table. If only the first is true, row-level security hides every record and the lists
 * look empty, which would read as "no enquiries" instead of "not set up". This lets the screen say so.
 *
 *   "active"   the database lists this person as an active administrator
 *   "inactive" it does not (the lists will be empty; the screen explains why)
 *   "unknown"  the check could not be made (for example the function is not installed yet): show nothing, assume nothing
 *
 * The function answers only about the caller and returns a bare true or false. This code never decides access: the
 * allowlist check and Row Level Security do. It only explains the outcome.
 */
export type AdminMembership = "active" | "inactive" | "unknown";

export const getAdminMembership = cache(async (): Promise<AdminMembership> => {
  await requireAdmin();
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("am_i_active_admin");
    if (error || typeof data !== "boolean") return "unknown";
    return data ? "active" : "inactive";
  } catch {
    return "unknown";
  }
});
