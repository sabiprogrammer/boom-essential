"use client";

import { appointmentRecords } from "@/lib/dashboard-preview/appointments";
import type { DashboardSectionId } from "@/content/dashboard-preview";
import { useDemoData } from "./DemoDataProvider";

/**
 * Small counts shown beside navigation items: enquiries still new, and appointment requests awaiting
 * confirmation by an administrator. Derived from the same records as everything else.
 */
export function useSectionBadges(): Partial<Record<DashboardSectionId, number>> {
  const { enquiries } = useDemoData();
  return {
    enquiries: enquiries.filter((e) => e.status === "new").length,
    appointments: appointmentRecords(enquiries).filter((r) => r.appointment.status === "requested").length,
  };
}
