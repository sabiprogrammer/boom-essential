import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";

/**
 * Supabase client for the server (Server Components, Server Actions, Route Handlers).
 *
 * A NEW client is created on every call and bound to that request's cookies. Never keep one in a
 * module-level variable: it would carry one visitor's session into another's request.
 *
 * `server-only` makes importing this file from a Client Component a build error.
 *
 * Reading `cookies()` makes the caller request-time (dynamic), so use it inside a `<Suspense>`
 * boundary, as the caching rules in CLAUDE.md require. Never wrap code that uses it in `use cache`.
 *
 * Cookie writes: Server Components cannot set cookies, so `setAll` ignores that error. Refreshing
 * the session cookie on each request is the job of the Next.js 16 `proxy.ts`, which belongs to the
 * authentication milestone and does not exist yet. Until then this client holds no session and
 * nothing is protected by it.
 *
 * Nothing imports this yet: authentication and data access are later Stage 6 milestones.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabasePublicConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, which cannot write cookies. Safe to ignore once the
          // proxy refreshes sessions; it is the only place that can persist them.
        }
      },
    },
  });
}
