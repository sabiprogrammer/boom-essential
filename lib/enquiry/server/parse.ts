import { findCategory, type EnquiryCategory } from "@/content/enquiry-options";
import type { FieldErrors } from "../types";
import { isValidPhone, limits } from "../validation";
import { toE164 } from "./phone-e164";
import { cleanMessage, cleanSingleLine } from "./text";

/**
 * Server-side validation of a Contact form submission. THE AUTHORITY: the browser's checks are a convenience, and
 * this function trusts nothing in the request. It builds a fresh object from known fields only (so a request
 * that carries an id, a reference, a status, a source or a timestamp simply has those ignored), cleans every
 * string, enforces the same limits as the form and the database, and checks every category and interest slug
 * against the allowlist in content/enquiry-options.ts. Pure: today's date is passed in.
 */

export type ParsedEnquiry = {
  submissionId: string;
  fullName: string;
  phone: string;
  phoneE164: string | null;
  email: string | null;
  organisation: string | null;
  location: string | null;
  division: EnquiryCategory;
  /** Services (energy, security). null when none were chosen or the division uses products. */
  requestedService: string[] | null;
  /** Products (foods, industrial equipment). null when none were chosen or the division uses services. */
  requestedItem: string[] | null;
  message: string;
  appointment: { preferredDate: string; preferredTime: string } | null;
};

export type ParseResult =
  | { ok: true; value: ParsedEnquiry }
  | { ok: false; fieldErrors: FieldErrors };

const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const LINK = /https?:\/\/|www\./gi;

/** Phone numbers are stored as typed, so the database's own limit (7 to 40 characters) applies to the typed form. */
const PHONE_MAX_TYPED = 40;
/** Appointments may be requested for today and up to a year ahead (the database enforces the same window). */
const APPOINTMENT_WINDOW_DAYS = 366;
/** A genuine enquiry rarely carries web links; more than this is treated as a spam signal. */
const MAX_LINKS_IN_MESSAGE = 2;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function toDate(value: string): Date | null {
  if (!DATE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

function addDays(isoDate: string, days: number): string {
  const date = toDate(isoDate) as Date;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** A trimmed, cleaned string, or null when the value is not a string at all. */
function text(value: unknown, clean: (value: string) => string): string | null {
  return typeof value === "string" ? clean(value) : null;
}

export function parseEnquiryRequest(body: unknown, todayInLagos: string): ParseResult {
  const errors: FieldErrors = {};
  if (!isRecord(body)) return { ok: false, fieldErrors: {} };

  const customer = isRecord(body.customer) ? body.customer : {};
  const target = isRecord(body.target) ? body.target : {};

  // --- Customer details -------------------------------------------------------------------------------------------
  const fullName = text(customer.fullName, cleanSingleLine);
  if (fullName === null || fullName.length < limits.name.min) errors.fullName = "Enter your full name.";
  else if (fullName.length > limits.name.max) errors.fullName = `Keep your name to ${limits.name.max} characters or fewer.`;

  const phone = text(customer.phone, cleanSingleLine);
  if (!phone) errors.phone = "Enter a phone number we can reach you on.";
  else if (phone.length > PHONE_MAX_TYPED || !isValidPhone(phone))
    errors.phone = "Enter a valid phone number, in Nigerian or international format.";

  let email: string | null = null;
  if (customer.email !== undefined && customer.email !== null) {
    const typed = text(customer.email, cleanSingleLine);
    if (typed === null || (typed && (!EMAIL.test(typed) || typed.length > limits.email))) {
      errors.email = "Enter a valid email address, or leave this blank.";
    } else email = typed || null;
  }

  const optional = (value: unknown, max: number, key: "organisation" | "location"): string | null => {
    if (value === undefined || value === null) return null;
    const typed = text(value, cleanSingleLine);
    if (typed === null || typed.length > max) {
      errors[key] = `Keep this to ${max} characters or fewer.`;
      return null;
    }
    return typed || null;
  };
  const organisation = optional(customer.organisation, limits.organisation, "organisation");
  const location = optional(customer.location, limits.location, "location");

  // --- Category and interests (allowlisted) -----------------------------------------------------------------------
  const category = typeof target.category === "string" ? findCategory(target.category) : undefined;
  let requestedService: string[] | null = null;
  let requestedItem: string[] | null = null;
  if (!category) {
    errors.category = "Choose what you are enquiring about.";
  } else {
    const interests = target.interests === undefined ? [] : target.interests;
    const allowed = new Set(category.interests.map((interest) => interest.slug));
    if (!Array.isArray(interests) || interests.length > 20 || !interests.every((slug) => typeof slug === "string" && allowed.has(slug))) {
      errors.category = "Choose only from the options listed.";
    } else if (interests.length > 0) {
      const unique = [...new Set(interests as string[])];
      if (category.id === "energy" || category.id === "security") requestedService = unique;
      else requestedItem = unique;
    }
  }

  // --- Message ----------------------------------------------------------------------------------------------------
  const message = text(body.message, cleanMessage);
  if (!message) errors.message = "Tell us what you need.";
  else if (message.length < limits.message.min) errors.message = "Please tell us a little more about what you need.";
  else if (message.length > limits.message.max) errors.message = `Keep your message to ${limits.message.max} characters or fewer.`;
  else if ((message.match(LINK) ?? []).length > MAX_LINKS_IN_MESSAGE)
    errors.message = "Please leave web links out of your message. Tell us what you need and we will get in touch.";

  // --- Appointment request (optional) -----------------------------------------------------------------------------
  let appointment: ParsedEnquiry["appointment"] = null;
  if (body.appointment !== undefined && body.appointment !== null) {
    if (!isRecord(body.appointment)) {
      errors.preferredDate = "Enter a valid date.";
    } else {
      const date = typeof body.appointment.preferredDate === "string" ? body.appointment.preferredDate.trim() : "";
      const time = typeof body.appointment.preferredTime === "string" ? body.appointment.preferredTime.trim() : "";
      if (!date) errors.preferredDate = "Choose your preferred date.";
      else if (!toDate(date)) errors.preferredDate = "Enter a valid date.";
      else if (date < todayInLagos) errors.preferredDate = "Choose today or a future date.";
      else if (date > addDays(todayInLagos, APPOINTMENT_WINDOW_DAYS)) errors.preferredDate = "Choose a date within the next year.";

      if (!time) errors.preferredTime = "Choose your preferred time.";
      else if (!TIME.test(time)) errors.preferredTime = "Enter a valid time.";

      if (!errors.preferredDate && !errors.preferredTime) appointment = { preferredDate: date, preferredTime: time };
    }
  }

  // --- Submission id (the idempotency token) ----------------------------------------------------------------------
  const submissionId = typeof body.submissionId === "string" ? body.submissionId.trim().toLowerCase() : "";
  const idValid = SUBMISSION_ID.test(submissionId);

  if (Object.keys(errors).length > 0 || !idValid || !category || !fullName || !phone || !message) {
    return { ok: false, fieldErrors: errors };
  }

  return {
    ok: true,
    value: {
      submissionId,
      fullName,
      phone,
      phoneE164: toE164(phone),
      email,
      organisation,
      location,
      division: category.id,
      requestedService,
      requestedItem,
      message,
      appointment,
    },
  };
}
