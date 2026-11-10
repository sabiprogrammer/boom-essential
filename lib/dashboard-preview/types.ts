/**
 * Typed shapes for the admin dashboard PREVIEW. They mirror the proposed Supabase schema
 * (docs/implementation-plan.md §5 and §6.9) so the interface can later be fed by real queries without being
 * rewritten. Nothing here is connected to a database: the records come from demo-enquiries.ts.
 */

/** The four offerings. Industrial Equipment is an additional offering, not a fourth division. */
export type DivisionId = "energy" | "security" | "foods" | "industrial-equipment";

export type EnquiryStatus = "new" | "in_progress" | "contacted" | "resolved";

/** An appointment request is never auto-confirmed: only an administrator confirms it. */
export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";

export type DemoCustomer = {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  location: string;
};

export type DemoAppointment = {
  purpose: string;
  /** YYYY-MM-DD */
  preferredDate: string;
  /** HH:MM, 24-hour, Africa/Lagos */
  preferredTime: string;
  /** Where the visit or call would take place. */
  venue: string;
  /** What the customer wrote when asking for the appointment. */
  customerNote: string;
  status: AppointmentStatus;
};

export type DemoNote = {
  id: string;
  author: string;
  /** Pre-formatted label ("3 Nov 2026, 16:05" or "Just now (demo)"). */
  at: string;
  /** ISO 8601 timestamp (an instant); null for a note added live during the demonstration. */
  createdAt: string | null;
  text: string;
};

export type DemoEnquiry = {
  id: string;
  /** Human-readable reference, e.g. BMG-2026-0107. */
  reference: string;
  customer: DemoCustomer;
  division: DivisionId;
  /** The service or product asked about, in the customer's category terms. */
  service: string;
  /** One-line summary shown in lists. */
  summary: string;
  message: string;
  /** ISO 8601 timestamp (an instant; shown in Africa/Lagos time). */
  receivedAt: string;
  status: EnquiryStatus;
  appointment: DemoAppointment | null;
  notes: DemoNote[];
};

export type ActivityKind = "enquiry" | "appointment" | "status" | "note";

export type DemoActivity = {
  id: string;
  kind: ActivityKind;
  text: string;
  /** Pre-formatted relative label ("Today, 09:40"). */
  at: string;
};

/** An appointment together with the enquiry it belongs to, as the Appointments view needs it. */
export type AppointmentRecord = {
  enquiry: DemoEnquiry;
  appointment: DemoAppointment;
};
