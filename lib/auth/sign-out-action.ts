"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminLoginPath } from "./admin-paths";

/**
 * Server Action behind the "Sign out" button. Ends the Supabase session (revoking it at the Auth server) and
 * clears the session cookies through the server client, then sends the person to the sign-in page. It needs no
 * administrator check: signing out is always allowed, and it grants nothing.
 */
export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Even if revoking failed, still leave the area; the proxy and requireAdmin() decide access on every request.
  }
  redirect(adminLoginPath);
}
