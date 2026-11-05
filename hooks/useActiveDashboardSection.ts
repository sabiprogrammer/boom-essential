"use client";

import { usePathname } from "next/navigation";
import { dashboardSections } from "@/content/dashboard-preview";

/** The dashboard section the current URL belongs to (Overview for anything unrecognised). */
export function useActiveDashboardSection() {
  const pathname = usePathname() ?? "";
  return (
    dashboardSections.find((section) => section.id !== "overview" && pathname.startsWith(section.href)) ?? dashboardSections[0]
  );
}
