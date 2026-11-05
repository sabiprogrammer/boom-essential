import type { DashboardSectionId } from "@/content/dashboard-preview";
import { CalendarIcon, InboxIcon, OverviewIcon } from "./icons";

export function SectionIcon({ id, className }: { id: DashboardSectionId; className?: string }) {
  if (id === "enquiries") return <InboxIcon className={className} />;
  if (id === "appointments") return <CalendarIcon className={className} />;
  return <OverviewIcon className={className} />;
}
