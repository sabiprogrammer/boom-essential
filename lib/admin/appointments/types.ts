import type { ActivityRecord, AppointmentRecord, AppointmentStatus, EnquiryRecord } from "@/lib/admin/enquiries/types";

/**
 * Shapes for the administrator's Appointments screen (real data). The database has four appointment statuses
 * (requested, confirmed, completed, cancelled). "Rescheduled" is not a status: a reschedule cancels the original, keeps
 * it, and creates a linked replacement, so a cancelled appointment that has a successor is DISPLAYED as rescheduled.
 */
export type AppointmentStatusFilter = AppointmentStatus | "all";
export type DisplayStatus = AppointmentStatus | "rescheduled";

export type AppointmentListQuery = {
  search: string;
  status: AppointmentStatusFilter;
  page: number;
};

/** An appointment with the enquiry (and so the customer) it belongs to. */
export type AppointmentWithEnquiry = {
  appointment: AppointmentRecord;
  enquiry: EnquiryRecord;
  /** The id of the appointment that replaced this one, when it was rescheduled. */
  replacedById: string | null;
};

export type AppointmentListResult = {
  rows: AppointmentWithEnquiry[];
  total: number;
  /** Per status for the current search, so each filter chip shows what it would return. */
  counts: Record<AppointmentStatusFilter, number>;
  page: number;
  pageCount: number;
  pageSize: number;
};

export type StatusHistoryRecord = {
  id: string;
  previousStatus: string | null;
  newStatus: string;
  createdAt: string;
  /** Who made the change, without naming anyone: the signed-in administrator, another one, or the system. */
  by: "you" | "administrator" | "system";
};

export type AppointmentDetailData = AppointmentWithEnquiry & {
  /** Every appointment of the same enquiry, newest first: the original request, each reschedule and the current one. */
  chain: AppointmentRecord[];
  /** Status changes of THIS appointment, newest first. */
  history: StatusHistoryRecord[];
  /** The whole enquiry's activity (status changes, appointment events, notes), newest first. */
  activity: ActivityRecord[];
};
