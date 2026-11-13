import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

/**
 * A Supabase client that acts with the project's SECRET key (the service_role privilege), for server code that
 * must write on behalf of the public: today only the enquiry submission (lib/enquiry/server/). Approved by the
 * owner on 2026-11-13 for that purpose.
 *
 * Rules, enforced by tests/supabase/boundaries.test.ts:
 *   - this file is the ONLY place the key is read, from `SUPABASE_SECRET_KEY`, a server-only variable that must
 *     never get a `NEXT_PUBLIC_` name and is never printed, logged, committed or sent to the browser;
 *   - only lib/enquiry/server/ may import this file;
 *   - a new client is built per call and never stored (no module-level instance), and it persists no session;
 *   - the key bypasses Row Level Security, so every use must be a narrow, validated operation. The only one is the
 *     public.submit_enquiry() function, whose privileges are limited to creating an enquiry and its appointment
 *     request. Never expose a generic "run this query" path.
 *
 * The error messages name the variable, never its value. A publishable key in this variable is refused, because it
 * would silently fail every write.
 */
export function createSupabaseSecretClient(): SupabaseClient {
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!key) throw new Error("Supabase secret key is not configured: set SUPABASE_SECRET_KEY on the server.");
  if (key.startsWith("sb_publishable_")) throw new Error("SUPABASE_SECRET_KEY holds a publishable key; it needs the project's secret key.");

  const { url } = getSupabasePublicConfig();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
