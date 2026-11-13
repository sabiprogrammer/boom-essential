import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkAdminAccess, type AdminAccess } from "./admin-access";
import { adminLoginPath } from "./admin-paths";

/**
 * The administrator decision for the current request, without redirecting. Use it where a redirect is wrong,
 * such as a Route Handler that should answer `401`/`403` JSON:
 *
 *   const access = await getAdminAccess();
 *   if (!access.allowed) return Response.json({ error: "forbidden" }, { status: 403 });
 *
 * Verified with `getClaims()` against the `BOOM_ADMIN_USER_IDS` allowlist (see `admin-access.ts`). Wrapped in
 * React's `cache()` so a layout and its page share one verification per render, never across requests.
 * Any failure denies.
 */
export const getAdminAccess = cache(async (): Promise<AdminAccess> => {
  try {
    const supabase = await createSupabaseServerClient();
    return await checkAdminAccess(supabase.auth, process.env.BOOM_ADMIN_USER_IDS);
  } catch {
    return { allowed: false, reason: "verification-failed" };
  }
});

export type AdminIdentity = { userId: string; email?: string };

/**
 * Guard for protected Server Components, layouts and Server Actions. Returns the verified administrator, or
 * redirects to the sign-in page and never returns.
 *
 * Call it in EVERY admin layout, page, Server Action and Route Handler. Do not rely on the proxy alone, and do
 * not assume a parent layout has already checked: layouts are not re-run on client-side navigation between
 * pages. Because it reads cookies it is request-time, so render it inside `<Suspense>`, and never put code
 * that calls it inside `use cache`.
 */
export async function requireAdmin(): Promise<AdminIdentity> {
  const access = await getAdminAccess();
  if (!access.allowed) redirect(adminLoginPath);
  return { userId: access.userId, email: access.email };
}
