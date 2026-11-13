"use server";

import { redirect } from "next/navigation";
import { adminAuthCopy } from "@/content/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseLoginInput } from "./login-input";
import { safeAdminRedirect } from "./safe-redirect";
import { signInAdmin, type SignInResult } from "./sign-in";
import type { SignInState } from "./sign-in-state";

/**
 * Server Action behind the sign-in form. Open to anyone by necessity (it is how you sign in), so it trusts
 * nothing from the form: input is validated again, the `next` destination is restricted to `/admin` paths, and
 * the redirect happens only after the verified user id is found on the administrator allowlist.
 */
export async function signInAction(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const input = parseLoginInput(formData);
  if (!input.ok) return { fieldErrors: input.fieldErrors, email: input.email };

  let result: SignInResult;
  try {
    const supabase = await createSupabaseServerClient();
    result = await signInAdmin(supabase.auth, { email: input.email, password: input.password }, process.env.BOOM_ADMIN_USER_IDS);
  } catch {
    result = { ok: false };
  }
  if (!result.ok) return { error: adminAuthCopy.signInFailed, email: input.email };

  // Outside any try/catch: redirect() works by throwing.
  redirect(safeAdminRedirect(formData.get("next")));
}
