import { adminHomePath, isProtectedAdminPath } from "./admin-paths";

/**
 * Turns an untrusted "return to" value into a destination that is safe to redirect to after sign-in.
 *
 * Only an internal path inside the administrator area is allowed (for example `/admin` or
 * `/admin/enquiries?status=new`). Anything else (another site, a protocol-relative `//host`, a backslash trick,
 * control characters, a path that escapes `/admin` after normalising, the sign-in page itself, a non-string)
 * falls back to `/admin`. The result is rebuilt from the parsed path and query, never echoed from the input.
 */
export function safeAdminRedirect(input: unknown, fallback: string = adminHomePath): string {
  if (typeof input !== "string") return fallback;
  const value = input.trim();
  if (value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  // Backslashes (browsers treat them as slashes) and control characters have no place in an internal path.
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;

  let parsed: URL;
  try {
    parsed = new URL(value, "http://internal.invalid");
  } catch {
    return fallback;
  }
  if (parsed.origin !== "http://internal.invalid") return fallback;
  if (!isProtectedAdminPath(parsed.pathname)) return fallback;
  return `${parsed.pathname}${parsed.search}`;
}
