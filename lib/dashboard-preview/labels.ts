import type { AppointmentStatus, DivisionId, EnquiryStatus } from "./types";

/** Display names. Public-facing names stay exactly as in the brand: BOOM ENERGY, never "BOOM SOLAR". */
export const divisionOrder: readonly DivisionId[] = ["energy", "security", "foods", "industrial-equipment"];

export const divisionLabels: Record<DivisionId, string> = {
  energy: "BOOM ENERGY",
  security: "BOOM SECURITY",
  foods: "BOOM FOODS",
  "industrial-equipment": "Industrial Equipment",
};

export const enquiryStatusOrder: readonly EnquiryStatus[] = ["new", "in_progress", "contacted", "resolved"];

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  contacted: "Contacted",
  resolved: "Resolved",
};

export const appointmentStatusOrder: readonly AppointmentStatus[] = ["requested", "confirmed", "completed", "cancelled"];

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function isDivisionId(value: string | null | undefined): value is DivisionId {
  return !!value && (divisionOrder as readonly string[]).includes(value);
}

export function isEnquiryStatus(value: string | null | undefined): value is EnquiryStatus {
  return !!value && (enquiryStatusOrder as readonly string[]).includes(value);
}
