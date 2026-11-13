import { checkAdminAccess, type ClaimsSource } from "./admin-access";

/** What the sign-in needs from Supabase Auth; the real `supabase.auth` satisfies it, and tests use a fake. */
export type SignInSource = ClaimsSource & {
  signInWithPassword(credentials: { email: string; password: string }): Promise<{ error: unknown }>;
  signOut(): Promise<{ error: unknown }>;
};

/** Deliberately carries no reason: a wrong password, an unknown email and a non-administrator look identical. */
export type SignInResult = { ok: true } | { ok: false };

async function endSession(auth: SignInSource) {
  try {
    await auth.signOut();
  } catch {
    // Nothing more can be done here; the caller still reports failure.
  }
}

/**
 * Email and password sign-in for the administrator area.
 *
 * 1. Sign in with Supabase Auth (this stores the session cookies).
 * 2. Verify the session with `getClaims()` and check the verified user id against `BOOM_ADMIN_USER_IDS`.
 * 3. If the person is signed in but is not an administrator, END THE SESSION again so no usable session is
 *    left behind, and report the same failure as a wrong password.
 *
 * Passwords, tokens and error details are never logged.
 */
export async function signInAdmin(
  auth: SignInSource,
  credentials: { email: string; password: string },
  allowlistRaw: string | null | undefined,
): Promise<SignInResult> {
  try {
    const { error } = await auth.signInWithPassword(credentials);
    if (error) return { ok: false };

    const access = await checkAdminAccess(auth, allowlistRaw);
    if (!access.allowed) {
      await endSession(auth);
      return { ok: false };
    }
    return { ok: true };
  } catch {
    await endSession(auth);
    return { ok: false };
  }
}
