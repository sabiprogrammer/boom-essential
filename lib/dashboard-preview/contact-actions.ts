import { normaliseNigerianMobile } from "./phone";

export type ContactDetails = {
  name: string;
  /** The phone number exactly as stored; validated here, never trusted. */
  phone: string;
  reference: string;
  /** The service or product the customer asked about. */
  service: string;
};

export type ContactActionLinks = {
  /** `tel:+234...` link, or null when the phone number is missing or invalid. */
  call: string | null;
  /** `https://wa.me/234...?text=...` link, or null when the phone number is missing or invalid. */
  whatsapp: string | null;
  /** The prefilled WhatsApp message. The administrator still reads it and presses send themselves. */
  message: string;
};

const companyName = "BOOM MULTI GLOBAL COMPANY LIMITED";

/** The professional follow-up message placed in the WhatsApp chat box. Nothing is ever sent automatically. */
export function followUpMessage({ name, reference, service }: Pick<ContactDetails, "name" | "reference" | "service">): string {
  return `Hello ${name}, this is ${companyName}. We are following up on your enquiry ${reference} regarding ${service}. How may we assist you further?`;
}

/**
 * Builds the real contact links for a customer. A link is only produced for a valid Nigerian mobile number:
 * missing or invalid numbers give null, so the interface can never offer a dead or wrong link.
 */
export function buildContactActions(details: ContactDetails): ContactActionLinks {
  const message = followUpMessage(details);
  const digits = normaliseNigerianMobile(details.phone);
  if (!digits) return { call: null, whatsapp: null, message };

  return {
    call: `tel:+${digits}`,
    whatsapp: `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
    message,
  };
}
