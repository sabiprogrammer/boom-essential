import { toAppointmentRecord, toEnquiryRecord } from "@/lib/admin/enquiries/mappers";
import type { AppointmentWithEnquiry, StatusHistoryRecord } from "./types";

/**
 * Database rows to screen records for the Appointments screen. Defensive like the enquiry mappers: a row that is not what
 * the schema promises is dropped (null) instead of crashing the page. Pure.
 */

type Row = Record<string, unknown>;
const isRow = (value: unknown): value is Row => typeof value === "object" && value !== null && !Array.isArray(value);

/** PostgREST returns an embedded many-to-one as one object (occasionally a one-element array, depending on version). */
function embedded(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

/** An appointment row that embeds its enquiry as `enquiries`. */
export function toAppointmentWithEnquiry(row: unknown, replacedById: string | null): AppointmentWithEnquiry | null {
  if (!isRow(row)) return null;
  const appointment = toAppointmentRecord(row);
  const enquiry = toEnquiryRecord(embedded(row.enquiries));
  if (!appointment || !enquiry || enquiry.id !== appointment.enquiryId) return null;
  return { appointment, enquiry, replacedById };
}

export function toStatusHistoryRecord(row: unknown, currentUserId: string): StatusHistoryRecord | null {
  if (!isRow(row)) return null;
  if (typeof row.id !== "string" || typeof row.new_status !== "string" || typeof row.changed_at !== "string") return null;
  return {
    id: row.id,
    previousStatus: typeof row.previous_status === "string" ? row.previous_status : null,
    newStatus: row.new_status,
    createdAt: row.changed_at,
    by: row.changed_by === null || row.changed_by === undefined ? "system" : row.changed_by === currentUserId ? "you" : "administrator",
  };
}
