import { createAdminProxy } from "@/lib/auth/admin-proxy";
import { createProxySupabaseClient } from "@/lib/supabase/proxy-client";

/**
 * Next.js 16 Proxy (the renamed middleware). It runs ONLY for the administrator area: the public website
 * has no sessions, so it makes no Supabase call and gains no latency. See `lib/auth/admin-proxy.ts` for what
 * it does and, importantly, what it does not do (it is not the only security boundary).
 *
 * The matcher must stay a static literal. `/admin/login` matches it on purpose and is passed through
 * untouched, so the sign-in form and its Server Action are never blocked.
 */
export const proxy = createAdminProxy({
  createClient: createProxySupabaseClient,
  getAllowlist: () => process.env.BOOM_ADMIN_USER_IDS,
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
