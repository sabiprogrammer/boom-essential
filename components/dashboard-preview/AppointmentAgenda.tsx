"use client";

import { describeRelativeDay, formatLongDate } from "@/lib/dashboard-preview/dates";
import type { AppointmentRecord } from "@/lib/dashboard-preview/types";
import { AppointmentItem } from "./AppointmentItem";
import { useDetailSelection } from "./DetailSelectionProvider";

/**
 * Appointments grouped under a heading per calendar day, in the order given. Upcoming days get a navy marker
 * and a relative label (Today, Tomorrow, In 3 days); past days are set in quieter tones. Must sit inside a Panel.
 */
export function AppointmentAgenda({
  groups,
  past,
}: {
  groups: readonly { date: string; records: AppointmentRecord[] }[];
  past: boolean;
}) {
  const { selection, openAppointment } = useDetailSelection();
  const selectedId = selection?.kind === "appointment" ? selection.id : null;

  return (
    <div>
      {groups.map((group) => (
        <section key={group.date} aria-label={formatLongDate(group.date)}>
          <h3 className="flex flex-wrap items-center justify-between gap-x-4 border-b border-line bg-warm-white px-5 py-2.5 sm:px-6">
            <span className={`flex items-center gap-2.5 font-heading text-sm font-extrabold ${past ? "text-ink-muted" : "text-navy"}`}>
              <span aria-hidden="true" className={`size-2 rounded-full ${past ? "bg-line-strong" : "bg-navy"}`} />
              {formatLongDate(group.date)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 font-heading text-xs font-bold tracking-[0.06em] uppercase ${
                past ? "bg-tint text-ink-muted" : "bg-navy/[0.07] text-navy"
              }`}
            >
              {describeRelativeDay(group.date)}
            </span>
          </h3>
          <ul>
            {group.records.map((record) => (
              <AppointmentItem key={record.enquiry.id} record={record} selected={selectedId === record.enquiry.id} onOpen={openAppointment} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
