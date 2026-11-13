import { normaliseNigerianMobile } from "@/lib/dashboard-preview/phone";

/**
 * The normalised international form (+234...) stored beside the phone number exactly as typed, so the dashboard
 * can build tel: and WhatsApp links and search by number. Returns null when the number cannot be normalised
 * with confidence; the typed number is still stored and the enquiry is still accepted.
 *
 * The database accepts only /^\+[1-9][0-9]{7,14}$/, and this function never returns anything else.
 */
export function toE164(typed: string): string | null {
  const nigerianMobile = normaliseNigerianMobile(typed);
  if (nigerianMobile) return `+${nigerianMobile}`;

  const compact = typed.replace(/[\s\-().]/g, "");
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  if (/^234\d{10}$/.test(compact)) return `+${compact}`;
  if (/^0\d{10}$/.test(compact)) return `+234${compact.slice(1)}`;
  return null;
}
