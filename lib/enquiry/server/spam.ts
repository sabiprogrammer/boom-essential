/**
 * Cheap, dependency-free spam signals for the public form. They stop unsophisticated bots; the real throttling is
 * the database-backed rate limit inside public.submit_enquiry(), which survives serverless cold starts. No CAPTCHA
 * or third-party service is used (none is approved).
 */

/**
 * The honeypot field is invisible to people and tempting to bots. Anything other than an absent, null or
 * blank value means a bot filled it in.
 */
export function isHoneypotTriggered(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  return typeof value !== "string" || value.trim().length > 0;
}

/**
 * A browser sends an Origin header with every cross-origin and every POST request. Requiring it to match this
 * site's own host (and the browser's Sec-Fetch-Site, when sent, to say "same-origin") stops the endpoint being
 * driven from other websites. It is an abuse-reduction measure, not authentication: a script can forge headers.
 */
export function isSameOriginRequest(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return false;

  const fetchSite = headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }

  const host = (headers.get("x-forwarded-host")?.split(",")[0].trim() || headers.get("host") || "").toLowerCase();
  return host.length > 0 && originHost === host;
}
