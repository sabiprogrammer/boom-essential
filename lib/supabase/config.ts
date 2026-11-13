export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

/**
 * The two public Supabase settings, read from the environment and checked.
 *
 * Both are safe for the browser by design: the project URL is public, and the publishable key only
 * identifies the project and acts with the anonymous role (Row Level Security decides what that may
 * do). The service-role (secret) key is never read here and never gets a `NEXT_PUBLIC_` name.
 *
 * The two `process.env.NEXT_PUBLIC_*` reads must stay written out in full: Next.js replaces them at
 * build time, so a dynamic lookup such as `process.env[name]` would be empty in the browser.
 *
 * Error messages name the variable only, never its value.
 */
export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!publishableKey) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !publishableKey) {
    throw new Error(`Supabase is not configured: missing ${missing.join(" and ")}. Set it in .env.local (see .env.example).`);
  }

  try {
    new URL(url);
  } catch {
    throw new Error("Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  }

  return { url, publishableKey };
}
