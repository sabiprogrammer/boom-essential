import type { EnquiryCategory } from "@/content/enquiry-options";

/**
 * Typed shapes for the customer enquiry form. Concepts are kept distinct so they map one-to-one onto the
 * Supabase enquiry schema (supabase/migrations/): customer details, business category, specific interests,
 * message, enquiry type, appointment preference and submission status. The browser sends them to
 * POST /api/enquiries (lib/enquiry/api-contract.ts), where they are validated again and saved.
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
 * The validated, cleaned payload sent to the server handler. Empty optional strings become null. The
 * submission status ("new", or "requested" for appointments), the id, the reference and the timestamps are
 * assigned by the server and database and are deliberately not part of this client payload. `type` and
 * `source` are informational only: the server ignores them (an appointment exists only if `appointment` does).
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
 * The form's submission status as the interface sees it. "success" is reserved for a response the server
 * confirmed (the enquiry is saved and has a reference); it is never set optimistically. "error" means nothing
 * is known to be saved, and the visitor's entries are kept so they can try again.
 */
export type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; appointmentRequested: boolean }
  | { state: "error"; message: string };

/** Initial form state, derived from the URL by lib/enquiry/prefill.ts. */
export type EnquiryInitial = {
  category: EnquiryCategory | "";
  interests: string[];
  appointmentRequested: boolean;
  /** True when the category (and possibly a product) came from the URL. */
  prefilled: boolean;
};
