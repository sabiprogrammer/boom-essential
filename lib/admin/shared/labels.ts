import type { AppointmentStatus, EnquiryStatus } from "./types";

/** Display names and the fixed order of the statuses. The order is the order of the filter chips and status buttons. */
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
