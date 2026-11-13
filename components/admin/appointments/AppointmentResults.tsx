import type { AppointmentListQuery, AppointmentWithEnquiry } from "@/lib/admin/appointments/types";
import { AppointmentList } from "./AppointmentList";
import { AppointmentTable } from "./AppointmentTable";

/** Chooses the layout from the container's own width: a table when there is room for four columns, stacked rows otherwise. */
export function AppointmentResults({ rows, query, selectedId }: { rows: readonly AppointmentWithEnquiry[]; query: AppointmentListQuery; selectedId: string | null }) {
  return (
    <>
      <div className="hidden @min-[52rem]:block">
        <AppointmentTable rows={rows} query={query} selectedId={selectedId} />
      </div>
      <div className="@min-[52rem]:hidden">
        <AppointmentList rows={rows} query={query} selectedId={selectedId} />
      </div>
    </>
  );
}
