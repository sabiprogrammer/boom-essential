"use client";

import type { AppointmentStatusFilter, Timeframe } from "@/hooks/useAppointmentListState";
import { appointmentStatusLabels, appointmentStatusOrder } from "@/lib/dashboard-preview/labels";
import { FilterChips } from "./FilterChips";
import { SegmentedControl } from "./SegmentedControl";

/** Upcoming/past as a segmented control and appointment status chips. Status counts are for the chosen timeframe. */
export function AppointmentFilters({
  timeframe,
  status,
  counts,
  upcomingCount,
  pastCount,
  onTimeframe,
  onStatus,
}: {
  timeframe: Timeframe;
  status: AppointmentStatusFilter;
  counts: Record<AppointmentStatusFilter, number>;
  upcomingCount: number;
  pastCount: number;
  onTimeframe: (value: Timeframe) => void;
  onStatus: (value: AppointmentStatusFilter) => void;
}) {
  const timeframeOptions: { value: Timeframe; label: string; count: number }[] = [
    { value: "upcoming", label: "Upcoming", count: upcomingCount },
    { value: "past", label: "Past", count: pastCount },
  ];
  const statusOptions: { value: AppointmentStatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    ...appointmentStatusOrder.map((id) => ({ value: id, label: appointmentStatusLabels[id], count: counts[id] })),
  ];

  return (
    <div className="flex flex-col gap-3 border-b border-line bg-white px-5 py-4 sm:px-6 @min-[56rem]:flex-row @min-[56rem]:items-center @min-[56rem]:justify-between">
      <div className="shrink-0">
        <SegmentedControl label="Upcoming or past appointments" options={timeframeOptions} value={timeframe} onChange={onTimeframe} />
      </div>
      <div className="min-w-0">
        <FilterChips label="Filter by appointment status" options={statusOptions} value={status} onChange={onStatus} />
      </div>
    </div>
  );
}
