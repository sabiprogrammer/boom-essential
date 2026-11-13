import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

/**
 * Supabase client for `proxy.ts`, where cookies come from the incoming request and are written to the
 * outgoing response, so the caller supplies the cookie adapter. A new client per request, never shared.
 * Unlike `server.ts` it does not use `next/headers`, which is not available in the proxy.
 */
export function createProxySupabaseClient(cookies: CookieMethodsServer) {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createServerClient(url, publishableKey, { cookies });
}
