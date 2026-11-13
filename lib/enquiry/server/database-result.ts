import type { ParsedEnquiry } from "./parse";

/** What the database layer reports back to the request handler. Never carries an error message or a record. */
export type DatabaseSubmitResult =
  /** Saved now, or an identical earlier submission is being confirmed again (`duplicate`). */
  | { kind: "saved"; reference: string; appointmentRequested: boolean; duplicate: boolean }
  /** Too many enquiries from this client recently; nothing was saved. */
  | { kind: "rate_limited" }
  /** The database refused the data (a constraint); nothing was saved. Indicates a rule the validator missed. */
  | { kind: "rejected" }
  /** The enquiry could not be saved (not configured, unreachable, unexpected error); nothing was saved. */
  | { kind: "unavailable" };

/** The seam between the request handler and Supabase, so the handler can be tested with a stand-in. */
export type SubmitToDatabase = (parsed: ParsedEnquiry, clientKey: string) => Promise<DatabaseSubmitResult>;
