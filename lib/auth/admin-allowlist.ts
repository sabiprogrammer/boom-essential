const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export type AdminAllowlist =
  | { valid: true; ids: ReadonlySet<string> }
  | { valid: false; reason: "missing" | "empty" | "malformed" };

/**
 * Parses the server-only `BOOM_ADMIN_USER_IDS` value: one or more Supabase user UUIDs, comma-separated.
 *
 * Fails closed. A missing or empty value, or ANY entry that is not a UUID, makes the whole list invalid and
 * nobody is allowed in; a typo is never skipped silently, because skipping could hide a mistake while
 * granting access on a half-read list. Blank segments (a trailing comma) are ignored. IDs are compared in
 * lower case.
 */
export function parseAdminAllowlist(raw: string | null | undefined): AdminAllowlist {
  if (raw === undefined || raw === null) return { valid: false, reason: "missing" };

  const entries = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  if (entries.length === 0) return { valid: false, reason: "empty" };
  if (!entries.every(isUuid)) return { valid: false, reason: "malformed" };

  return { valid: true, ids: new Set(entries.map((entry) => entry.toLowerCase())) };
}

export function isAllowlistedAdmin(allowlist: AdminAllowlist, userId: string): boolean {
  return allowlist.valid && allowlist.ids.has(userId.toLowerCase());
}
