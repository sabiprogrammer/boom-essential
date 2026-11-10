"use client";

import { useAppointmentListState } from "@/hooks/useAppointmentListState";
import { AppointmentAgenda } from "./AppointmentAgenda";
import { AppointmentFilters } from "./AppointmentFilters";
import { useDemoData, useDemoToday } from "./DemoDataProvider";
import { EmptyState } from "./EmptyState";
import { Panel } from "./Panel";

/** The Appointments screen: upcoming or past, filtered by status, grouped by day. */
export function AppointmentsView() {
  const { enquiries } = useDemoData();
  const today = useDemoToday();
  const list = useAppointmentListState(enquiries, today);
  const upcoming = list.timeframe === "upcoming";

  return (
    <Panel
      headingId="appointments-heading"
      title={upcoming ? "Upcoming appointments" : "Past appointments"}
      description={
        upcoming
          ? "Soonest first. An appointment request is never confirmed automatically."
          : "Most recent first. Select an appointment to see its details."
      }
      flush
    >
      <AppointmentFilters
        timeframe={list.timeframe}
        status={list.status}
        counts={list.counts}
        upcomingCount={list.upcomingCount}
        pastCount={list.pastCount}
        onTimeframe={list.setTimeframe}
        onStatus={list.setStatus}
      />

      {list.total === 0 ? (
        <EmptyState
          title={`No ${upcoming ? "upcoming" : "past"} appointments${list.status === "all" ? "" : " with this status"}`}
          action={
            list.status === "all" ? undefined : (
              <button
                type="button"
                onClick={list.clearStatus}
                className="inline-flex h-11 items-center rounded-sm border border-navy px-5 font-heading text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Show all statuses
              </button>
            )
          }
        >
          Choose another status, or switch between upcoming and past appointments.
        </EmptyState>
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            {list.total} {list.total === 1 ? "appointment" : "appointments"} shown
          </p>
          <AppointmentAgenda groups={list.groups} past={!upcoming} />
        </>
      )}
    </Panel>
  );
}
