/**
 * Phone number handling for customer contact actions. Pure functions, no imports, so they can be tested on
 * their own and reused unchanged when real customer numbers are connected.
 *
 * Accepted (Nigerian mobile numbers only, because WhatsApp needs a mobile number):
 *   08031234567, 0803 123 4567, +234 803 123 4567, 2348031234567, 002348031234567, +2340803...
 * Rejected: anything with letters or other characters, wrong length, non-Nigerian country codes, and
 * numbers whose network prefix is not a Nigerian mobile prefix (70x, 80x, 81x, 90x, 91x).
 * Landlines are deliberately not accepted yet; add them only when the client confirms they are needed.
 */

const MOBILE_NATIONAL = /^[789][01]\d{8}$/;

/** Returns the number in international digits without "+" (e.g. "2348031234567"), or null when it is not valid. */
export function normaliseNigerianMobile(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return null;

  const plus = cleaned.startsWith("+");
  const digits = plus ? cleaned.slice(1) : cleaned;

  let national: string;
  if (plus) {
    if (!digits.startsWith("234")) return null;
    national = digits.slice(3);
  } else if (digits.startsWith("00234")) {
    national = digits.slice(5);
  } else if (digits.startsWith("234") && digits.length === 13) {
    national = digits.slice(3);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else {
    return null;
  }

  // A trunk zero written after the country code (+234 0803...) is a common slip: tolerate it.
  if (national.length === 11 && national.startsWith("0")) national = national.slice(1);

  return MOBILE_NATIONAL.test(national) ? `234${national}` : null;
}

export function isValidNigerianMobile(raw: unknown): boolean {
  return normaliseNigerianMobile(raw) !== null;
}
