/**
 * The two status lists shared by the administrator screens. They mirror the database's CHECK constraints
 * (supabase/migrations/), and tests/database/migrations.test.ts fails if either list drifts from the SQL.
 */
export type EnquiryStatus = "new" | "in_progress" | "contacted" | "resolved";

/** An appointment request is never auto-confirmed: only an administrator confirms it. */
export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";
