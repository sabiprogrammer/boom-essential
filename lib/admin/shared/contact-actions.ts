const companyName = "BOOM MULTI GLOBAL COMPANY LIMITED";

/**
 * The professional follow-up message placed in the WhatsApp chat box when an administrator chooses to message a customer.
 * The administrator reads it and presses send themselves: nothing is ever sent automatically.
 */
export function followUpMessage({ name, reference, service }: { name: string; reference: string; service: string }): string {
  return `Hello ${name}, this is ${companyName}. We are following up on your enquiry ${reference} regarding ${service}. How may we assist you further?`;
}
