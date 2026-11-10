"use client";

import { useMemo, useState } from "react";
import { appointmentRecords, groupByDate, pastAppointments, upcomingAppointments } from "@/lib/dashboard-preview/appointments";
import type { AppointmentRecord, AppointmentStatus, DemoEnquiry } from "@/lib/dashboard-preview/types";

export type Timeframe = "upcoming" | "past";
export type AppointmentStatusFilter = AppointmentStatus | "all";

function countByStatus(records: readonly AppointmentRecord[]): Record<AppointmentStatusFilter, number> {
  const count = (status: AppointmentStatus) => records.filter((r) => r.appointment.status === status).length;
  return {
    all: records.length,
    requested: count("requested"),
    confirmed: count("confirmed"),
    completed: count("completed"),
    cancelled: count("cancelled"),
  };
}

/** Upcoming/past choice and status filter for the Appointments list. Status counts follow the chosen timeframe. */
export function useAppointmentListState(enquiries: readonly DemoEnquiry[], today: string) {
  const [timeframe, setTimeframe] = useState<Timeframe>("upcoming");
  const [status, setStatus] = useState<AppointmentStatusFilter>("all");

  const all = useMemo(() => appointmentRecords(enquiries), [enquiries]);
  const upcoming = useMemo(() => upcomingAppointments(all, today), [all, today]);
  const past = useMemo(() => pastAppointments(all, today), [all, today]);

  const inTimeframe = timeframe === "upcoming" ? upcoming : past;
  const counts = useMemo(() => countByStatus(inTimeframe), [inTimeframe]);
  const shown = useMemo(
    () => (status === "all" ? inTimeframe : inTimeframe.filter((r) => r.appointment.status === status)),
    [inTimeframe, status],
  );
  const groups = useMemo(() => groupByDate(shown), [shown]);

  return {
    timeframe,
    status,
    counts,
    groups,
    total: shown.length,
    upcomingCount: upcoming.length,
    pastCount: past.length,
    setTimeframe,
    setStatus,
    clearStatus: () => setStatus("all"),
  };
}
