import { appointmentStatusOrder } from "@/lib/dashboard-preview/labels";
import { isAdminDivision } from "./labels";
import { isEnquiryStatus } from "./query-params";
import type { ActivityAction, ActivityRecord, AppointmentRecord, AppointmentStatus, EnquiryRecord, NoteRecord } from "./types";

/**
 * Turns database rows (untyped JSON) into the shapes the screens use. Every field is checked: a row that is not
 * what the schema promises is dropped (null) instead of crashing the page or showing a half-record. Pure.
 */

type Row = Record<string, unknown>;

const isRow = (value: unknown): value is Row => typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): string | null => (typeof value === "string" ? value : null);
const optionalText = (value: unknown): string | null => (typeof value === "string" && value.length > 0 ? value : null);
const slugs = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);

/** Postgres `time` arrives as "09:30:00"; the screens use "09:30". */
function hhmm(value: unknown): string | null {
  return typeof value === "string" && /^\d{2}:\d{2}/.test(value) ? value.slice(0, 5) : null;
}

export function toEnquiryRecord(row: unknown): EnquiryRecord | null {
  if (!isRow(row)) return null;
  const { id, reference, full_name, phone, message, created_at, updated_at, source } = row;
  if (
    typeof id !== "string" || typeof reference !== "string" || typeof full_name !== "string" || typeof phone !== "string" ||
    typeof message !== "string" || typeof created_at !== "string" || typeof updated_at !== "string" || typeof source !== "string" ||
    !isAdminDivision(row.division) || !isEnquiryStatus(row.status)
  ) {
    return null;
  }
  return {
    id,
    reference,
    fullName: full_name,
    phone,
    phoneE164: optionalText(row.phone_e164),
    email: optionalText(row.email),
    organisation: optionalText(row.organisation),
    location: optionalText(row.location),
    division: row.division,
    requestedService: slugs(row.requested_service),
    requestedItem: slugs(row.requested_item),
    message,
    status: row.status,
    source,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export function toAppointmentRecord(row: unknown): AppointmentRecord | null {
  if (!isRow(row)) return null;
  const preferredTime = hhmm(row.preferred_time);
  if (
    typeof row.id !== "string" || typeof row.enquiry_id !== "string" || typeof row.preferred_date !== "string" || !preferredTime || typeof row.created_at !== "string" ||
    typeof row.status !== "string" || !(appointmentStatusOrder as readonly string[]).includes(row.status)
  ) {
    return null;
  }
  return {
    id: row.id,
    enquiryId: row.enquiry_id,
    rescheduledFromId: optionalText(row.rescheduled_from_id),
    status: row.status as AppointmentStatus,
    preferredDate: row.preferred_date,
    preferredTime,
    timezone: text(row.timezone) ?? "Africa/Lagos",
    confirmedDate: optionalText(row.confirmed_date),
    confirmedTime: hhmm(row.confirmed_time),
    venue: optionalText(row.venue),
    schedulingNote: optionalText(row.scheduling_note),
    confirmedAt: optionalText(row.confirmed_at),
    createdAt: row.created_at,
  };
}

export function toNoteRecord(row: unknown, currentUserId: string): NoteRecord | null {
  if (!isRow(row)) return null;
  if (typeof row.id !== "string" || typeof row.content !== "string" || typeof row.created_at !== "string") return null;
  return { id: row.id, content: row.content, createdAt: row.created_at, mine: row.admin_user_id === currentUserId };
}

const actions: readonly ActivityAction[] = [
  "enquiry_received",
  "enquiry_status_changed",
  "appointment_requested",
  "appointment_status_changed",
  "appointment_confirmed",
  "appointment_cancelled",
  "note_added",
];

export function toActivityRecord(row: unknown): ActivityRecord | null {
  if (!isRow(row)) return null;
  if (typeof row.id !== "string" || typeof row.created_at !== "string" || typeof row.action !== "string") return null;
  if (!(actions as readonly string[]).includes(row.action)) return null;
  const metadata = isRow(row.metadata) ? row.metadata : {};
  return {
    id: row.id,
    action: row.action as ActivityAction,
    actorType: row.actor_type === "admin" ? "admin" : "system",
    createdAt: row.created_at,
    fromStatus: text(metadata.from_status),
    toStatus: text(metadata.to_status),
  };
}

/** Keeps only the rows that mapped, in order. */
export function compact<T>(items: readonly (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null);
}
