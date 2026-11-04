import { findCategory } from "@/content/enquiry-options";
import type { EnquiryFormValues, EnquirySubmission, FieldErrors, FieldKey } from "./types";

/**
 * Client-side validation for the enquiry form. It improves the experience only: the future server-side
 * handler must validate everything again and is the authority. Pure functions, no side effects.
 */

export const limits = {
  name: { min: 2, max: 100 },
  organisation: 120,
  location: 120,
  email: 254,
  message: { min: 10, max: 2000 },
} as const;

/** Display order of the fields, used to order the error summary. */
export const fieldOrder: readonly FieldKey[] = [
  "fullName",
  "phone",
  "email",
  "organisation",
  "location",
  "category",
  "message",
  "preferredDate",
  "preferredTime",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Accepts Nigerian national (0 + 10 digits), +234 / 234 numbers, and other international (+ then 8 to 15 digits). */
export function isValidPhone(input: string): boolean {
  const compact = input.replace(/[\s\-().]/g, "");
  if (/^\+\d{8,15}$/.test(compact)) return true;
  if (/^0\d{10}$/.test(compact)) return true;
  if (/^234\d{10}$/.test(compact)) return true;
  return false;
}

/** Today's date (YYYY-MM-DD) in Nigeria (Africa/Lagos). Call from handlers only, never during render. */
export function todayInLagos(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}

function isRealDate(value: string): boolean {
  if (!DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function validateEnquiry(values: EnquiryFormValues, today: string): FieldErrors {
  const errors: FieldErrors = {};
  const { customer, target, message, appointment } = values;

  const name = customer.fullName.trim();
  if (!name) errors.fullName = "Enter your full name.";
  else if (name.length < limits.name.min) errors.fullName = "Enter your full name.";
  else if (name.length > limits.name.max) errors.fullName = `Keep your name to ${limits.name.max} characters or fewer.`;

  const phone = customer.phone.trim();
  if (!phone) errors.phone = "Enter a phone number we can reach you on.";
  else if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number, in Nigerian or international format.";

  const email = customer.email.trim();
  if (email && (!EMAIL.test(email) || email.length > limits.email)) errors.email = "Enter a valid email address, or leave this blank.";

  if (customer.organisation.trim().length > limits.organisation)
    errors.organisation = `Keep this to ${limits.organisation} characters or fewer.`;
  if (customer.location.trim().length > limits.location) errors.location = `Keep this to ${limits.location} characters or fewer.`;

  if (!target.category || !findCategory(target.category)) errors.category = "Choose what you are enquiring about.";

  const text = message.trim();
  if (!text) errors.message = "Tell us what you need.";
  else if (text.length < limits.message.min) errors.message = "Please tell us a little more about what you need.";
  else if (text.length > limits.message.max) errors.message = `Keep your message to ${limits.message.max} characters or fewer.`;

  if (appointment.requested) {
    if (!appointment.preferredDate) errors.preferredDate = "Choose your preferred date.";
    else if (!isRealDate(appointment.preferredDate)) errors.preferredDate = "Enter a valid date.";
    else if (appointment.preferredDate < today) errors.preferredDate = "Choose today or a future date.";

    if (!appointment.preferredTime) errors.preferredTime = "Choose your preferred time.";
    else if (!TIME.test(appointment.preferredTime)) errors.preferredTime = "Enter a valid time.";
  }

  return errors;
}

/** Builds the cleaned payload for the future server handler. Call only when `validateEnquiry` found no errors. */
export function buildSubmission(values: EnquiryFormValues, prefilled: boolean): EnquirySubmission | null {
  const { customer, target, message, appointment } = values;
  const category = target.category ? findCategory(target.category) : undefined;
  if (!category) return null;

  const allowed = new Set(category.interests.map((interest) => interest.slug));
  const orNull = (value: string) => value.trim() || null;

  return {
    customer: {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      email: orNull(customer.email),
      organisation: orNull(customer.organisation),
      location: orNull(customer.location),
    },
    target: { category: category.id, interests: target.interests.filter((slug) => allowed.has(slug)) },
    message: message.trim(),
    type: appointment.requested ? "appointment_request" : "enquiry",
    appointment: appointment.requested
      ? { preferredDate: appointment.preferredDate, preferredTime: appointment.preferredTime }
      : null,
    source: { page: "/contact", prefilled },
    honeypot: values.website,
  };
}
