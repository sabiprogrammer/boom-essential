import { appointmentStatusLabels, enquiryStatusLabels } from "@/lib/dashboard-preview/labels";
import type { ActivityRecord, AppointmentStatus, EnquiryStatus } from "./types";

export type ActivityKind = "enquiry" | "appointment" | "status" | "note";

const enquiryLabel = (status: string | null) => enquiryStatusLabels[status as EnquiryStatus] ?? status ?? "unknown";
const appointmentLabel = (status: string | null) => appointmentStatusLabels[status as AppointmentStatus] ?? status ?? "unknown";

/**
 * One plain sentence per audit event, in the words an administrator expects. The log holds only statuses, the
 * public reference and the division (never personal data), so the sentences are built from those alone.
 * "By" names who: an administrator, or the system (the public form or a database job).
 */
export function describeActivity(record: ActivityRecord): { text: string; kind: ActivityKind } {
  const by = record.actorType === "admin" ? "An administrator" : "The system";
  switch (record.action) {
    case "enquiry_received":
      return { text: "Enquiry received through the website.", kind: "enquiry" };
    case "enquiry_status_changed":
      return {
        text: `${by} changed the status from ${enquiryLabel(record.fromStatus)} to ${enquiryLabel(record.toStatus)}.`,
        kind: "status",
      };
    case "appointment_requested":
      return { text: "An appointment was requested.", kind: "appointment" };
    case "appointment_confirmed":
      return { text: `${by} confirmed the appointment.`, kind: "appointment" };
    case "appointment_cancelled":
      return { text: `${by} cancelled the appointment.`, kind: "appointment" };
    case "appointment_status_changed":
      return {
        text: `${by} changed the appointment from ${appointmentLabel(record.fromStatus)} to ${appointmentLabel(record.toStatus)}.`,
        kind: "appointment",
      };
    case "note_added":
      return { text: "An administrator added an internal note.", kind: "note" };
  }
}
