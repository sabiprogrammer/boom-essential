import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

/**
 * Supabase client for the browser (Client Components and event handlers).
 *
 * It uses only the public URL and publishable key, so it can do nothing Row Level Security does not
 * allow the anonymous role. Never put customer data in browser storage through it. `@supabase/ssr`
 * returns the same instance on repeated calls in the browser, so calling this per use is fine.
 *
 * Nothing imports this yet: sign-in runs on the server (Server Actions), so no browser-side auth code exists.
 * Data access (tables, RLS) is a later Stage 6 milestone.
 */
export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createBrowserClient(url, publishableKey);
}
