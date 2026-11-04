import type { EnquiryCategory } from "@/content/enquiry-options";

/**
 * Typed shapes for the customer enquiry form. Concepts are kept distinct so they can later map one-to-one
 * onto the Supabase enquiry schema (see docs/implementation-plan.md, "Proposed enquiry payload"):
 * customer details, business category, specific interests, message, enquiry type, appointment
 * preference and submission status. No persistence exists yet.
 */

export type { EnquiryCategory };

/** What kind of record this is. An appointment request is never a confirmed booking. */
export type EnquiryType = "enquiry" | "appointment_request";

export type CustomerDetails = {
  fullName: string;
  phone: string;
  email: string;
  organisation: string;
  location: string;
};

/** The business category and the specific services or products within it. "" until the customer chooses. */
export type EnquiryTarget = {
  category: EnquiryCategory | "";
  /** Slugs from the allowlist in content/enquiry-options.ts. */
  interests: string[];
};

export type AppointmentPreference = {
  requested: boolean;
  /** YYYY-MM-DD, required only when `requested`. */
  preferredDate: string;
  /** HH:MM (24-hour), required only when `requested`. */
  preferredTime: string;
};

/** Raw form state, exactly what the visitor has typed or selected. */
export type EnquiryFormValues = {
  customer: CustomerDetails;
  target: EnquiryTarget;
  message: string;
  appointment: AppointmentPreference;
  /** Honeypot: a field real visitors never see. A non-empty value marks the submission as spam server-side. */
  website: string;
};

/**
 * The validated, cleaned payload the future secure server-side handler will receive. Empty optional
 * strings become null. The submission status (e.g. "new", or "requested" for appointments) is assigned by
 * the server and is deliberately not part of this client payload.
 */
export type EnquirySubmission = {
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
    organisation: string | null;
    location: string | null;
  };
  target: { category: EnquiryCategory; interests: string[] };
  message: string;
  type: EnquiryType;
  appointment: { preferredDate: string; preferredTime: string } | null;
  /** Where the visitor came from, for the admin dashboard. Never personal data. */
  source: { page: "/contact"; prefilled: boolean };
  honeypot: string;
};

export type FieldKey =
  | "fullName"
  | "phone"
  | "email"
  | "organisation"
  | "location"
  | "category"
  | "message"
  | "preferredDate"
  | "preferredTime";

export type FieldErrors = Partial<Record<FieldKey, string>>;

/**
 * The form's submission status as the interface sees it. "preview" means the backend is not connected, so
 * nothing was sent or stored. "success" is reserved for a confirmed server response and is not reachable yet.
 */
export type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "preview" }
  | { state: "success" }
  | { state: "error"; message: string };

/** Initial form state, derived from the URL by lib/enquiry/prefill.ts. */
export type EnquiryInitial = {
  category: EnquiryCategory | "";
  interests: string[];
  appointmentRequested: boolean;
  /** True when the category (and possibly a product) came from the URL. */
  prefilled: boolean;
};
