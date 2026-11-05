import { ActivityPanel } from "@/components/dashboard-preview/ActivityPanel";
import { DivisionBreakdownPanel } from "@/components/dashboard-preview/DivisionBreakdownPanel";
import { RecentEnquiriesPanel } from "@/components/dashboard-preview/RecentEnquiriesPanel";
import { StatsStrip } from "@/components/dashboard-preview/StatsStrip";
import { UpcomingAppointmentsPanel } from "@/components/dashboard-preview/UpcomingAppointmentsPanel";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <StatsStrip />
      <RecentEnquiriesPanel />
      <UpcomingAppointmentsPanel />
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-2 xl:items-start">
        <DivisionBreakdownPanel />
        <ActivityPanel />
      </div>
    </div>
  );
}
