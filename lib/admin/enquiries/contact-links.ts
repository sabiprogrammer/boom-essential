import { followUpMessage } from "@/lib/dashboard-preview/contact-actions";
import { normaliseNigerianMobile } from "@/lib/dashboard-preview/phone";
import { describeRequest } from "./labels";
import type { EnquiryRecord } from "./types";

export type CustomerContactLinks = {
  /** `tel:+...`, or null when there is no usable number. */
  call: string | null;
  /** `https://wa.me/...?text=...`, or null when there is no usable number. */
  whatsapp: string | null;
  /** The prefilled WhatsApp message. The administrator reads it and presses send themselves; nothing is ever sent for them. */
  message: string;
};

/** International digits without "+", 8 to 15 long and not starting with 0 (the E.164 shape). */
const E164_DIGITS = /^[1-9]\d{7,14}$/;

/**
 * The digits to dial. Prefers the number the server normalised when the enquiry arrived (`phone_e164`, which can
 * be any country's); otherwise tries the number as typed, which is understood only as a Nigerian mobile number.
 * Anything else gives null, so the interface offers no dead or wrong link.
 */
function dialDigits(enquiry: Pick<EnquiryRecord, "phone" | "phoneE164">): string | null {
  if (enquiry.phoneE164) {
    const digits = enquiry.phoneE164.replace(/^\+/, "");
    if (E164_DIGITS.test(digits)) return digits;
  }
  return normaliseNigerianMobile(enquiry.phone);
}

export function buildCustomerContactLinks(enquiry: EnquiryRecord): CustomerContactLinks {
  const message = followUpMessage({
    name: enquiry.fullName,
    reference: enquiry.reference,
    service: describeRequest(enquiry),
  });
  const digits = dialDigits(enquiry);
  if (!digits) return { call: null, whatsapp: null, message };
  return { call: `tel:+${digits}`, whatsapp: `https://wa.me/${digits}?text=${encodeURIComponent(message)}`, message };
}
