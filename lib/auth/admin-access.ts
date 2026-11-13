import { isAllowlistedAdmin, isUuid, parseAdminAllowlist } from "./admin-allowlist";

/**
 * The one thing the access decision needs from Supabase Auth: `getClaims()`, which verifies the session's
 * token (its signature and expiry) rather than trusting the cookie's contents. Written as a structural type so
 * the decision can be tested with a plain fake and so the real `supabase.auth` satisfies it.
 */
export type ClaimsSource = {
  getClaims(): Promise<{
    data: { claims: { sub?: unknown; role?: unknown; email?: unknown } } | null;
    error: unknown;
  }>;
};

export type AdminDenialReason =
  /** BOOM_ADMIN_USER_IDS is missing, empty or contains a malformed entry. */
  | "allowlist-invalid"
  /** No session, or a token that is not a signed-in user's. */
  | "unauthenticated"
  /** Signed in and verified, but not on the allowlist. */
  | "not-allowlisted"
  /** Verification itself failed (network, bad token, unexpected error). */
  | "verification-failed";

export type AdminAccess =
  | { allowed: true; userId: string; email?: string }
  | { allowed: false; reason: AdminDenialReason };

const deny = (reason: AdminDenialReason): AdminAccess => ({ allowed: false, reason });

/**
 * Decides whether the current request belongs to a BOOM administrator.
 *
 * Authentication alone is NOT enough: Supabase self-service sign-up is open, so anyone can hold a valid
 * session. Access is granted only when the VERIFIED user id (`sub` from `getClaims()`) is on the server-side
 * allowlist. `user_metadata` and `app_metadata` are never consulted (the first is user-editable). Every
 * failure, including an exception, denies.
 */
export async function checkAdminAccess(auth: ClaimsSource, allowlistRaw: string | null | undefined): Promise<AdminAccess> {
  try {
    const allowlist = parseAdminAllowlist(allowlistRaw);
    if (!allowlist.valid) return deny("allowlist-invalid");

    const { data, error } = await auth.getClaims();
    if (error) return deny("verification-failed");
    if (!data || typeof data.claims !== "object" || data.claims === null) return deny("unauthenticated");

    const { sub, role, email } = data.claims;
    if (role !== "authenticated" || !isUuid(sub)) return deny("unauthenticated");
    if (!isAllowlistedAdmin(allowlist, sub)) return deny("not-allowlisted");

    return { allowed: true, userId: sub.toLowerCase(), ...(typeof email === "string" ? { email } : {}) };
  } catch {
    return deny("verification-failed");
  }
}
