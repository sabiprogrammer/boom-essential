import { appointmentRecords, isUpcoming } from "./appointments";
import { daysBetween, receivedDate } from "./dates";
import { divisionLabels, divisionOrder } from "./labels";
import type { DemoEnquiry, DivisionId } from "./types";

export type OverviewStats = {
  total: number;
  newCount: number;
  inProgress: number;
  appointmentRequests: number;
  /** Supporting figures, all derived from the same records. */
  receivedLastSevenDays: number;
  awaitingContact: number;
  awaitingConfirmation: number;
  upcomingAppointments: number;
};

/** Headline figures. Always computed from the records, so they cannot disagree with the lists. */
export function overviewStats(enquiries: readonly DemoEnquiry[], today: string): OverviewStats {
  const records = appointmentRecords(enquiries);
  const count = (predicate: (enquiry: DemoEnquiry) => boolean) => enquiries.filter(predicate).length;

  return {
    total: enquiries.length,
    newCount: count((e) => e.status === "new"),
    inProgress: count((e) => e.status === "in_progress"),
    appointmentRequests: records.length,
    receivedLastSevenDays: count((e) => daysBetween(receivedDate(e.receivedAt), today) < 7),
    awaitingContact: count((e) => e.status === "new"),
    awaitingConfirmation: records.filter((r) => r.appointment.status === "requested").length,
    upcomingAppointments: records.filter((r) => isUpcoming(r, today) && r.appointment.status !== "cancelled").length,
  };
}

export type DivisionShare = { id: DivisionId; label: string; count: number; percent: number };

/** Enquiries per offering, largest first (ties keep the standard order). */
export function divisionBreakdown(enquiries: readonly DemoEnquiry[]): DivisionShare[] {
  const total = enquiries.length;
  return divisionOrder
    .map((id) => {
      const count = enquiries.filter((e) => e.division === id).length;
      return { id, label: divisionLabels[id], count, percent: total === 0 ? 0 : Math.round((count / total) * 100) };
    })
    .sort((a, b) => b.count - a.count);
}
