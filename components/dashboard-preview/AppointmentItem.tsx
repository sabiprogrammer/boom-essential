"use client";

import { isUpcoming } from "@/lib/dashboard-preview/appointments";
import { formatShortDate, formatTime } from "@/lib/dashboard-preview/dates";
import type { AppointmentRecord, AppointmentStatus } from "@/lib/dashboard-preview/types";
import { DateTile } from "./DateTile";
import { useDemoToday } from "./DemoDataProvider";
import { DivisionTag } from "./DivisionTag";
import { EnquiryContactActions } from "./EnquiryContactActions";
import { AppointmentStatusBadge } from "./StatusBadge";

/** The thin edge marker: gold waits for confirmation, green is confirmed, greys are finished. A redundant cue; the badge names the status. */
const edge: Record<AppointmentStatus, string> = {
  requested: "before:bg-gold",
  confirmed: "before:bg-green",
  completed: "before:bg-line-strong",
  cancelled: "before:bg-line",
};

/**
 * One appointment. With `showDate` (the Overview) a calendar tile leads the row; in the day-grouped agenda
 * the time leads it, because the day heading already gives the date. Past appointments are quieter. The
 * customer name is the real button and its hit area covers the row; the contact actions sit above it.
 */
export function AppointmentItem({
  record,
  selected,
  showDate = false,
  onOpen,
}: {
  record: AppointmentRecord;
  selected: boolean;
  showDate?: boolean;
  onOpen: (id: string) => void;
}) {
  const { enquiry, appointment } = record;
  const today = useDemoToday();
  const past = !isUpcoming(record, today);

  return (
    <li
      className={`relative grid gap-x-5 gap-y-3 border-b border-line px-5 py-4 transition-colors duration-150 before:absolute before:inset-y-0 before:left-0 before:w-[3px] last:border-b-0 hover:bg-warm-white sm:px-6 @min-[44rem]:grid-cols-[6rem_minmax(0,1fr)_auto] ${edge[appointment.status]} ${
        selected ? "bg-tint" : ""
      }`}
    >
      <div className="flex items-center gap-3 @min-[44rem]:flex-col @min-[44rem]:items-start @min-[44rem]:gap-2">
        {showDate ? <DateTile date={appointment.preferredDate} muted={past} /> : null}
        <p className={`font-heading font-extrabold whitespace-nowrap tabular-nums ${showDate ? "text-base" : "text-lead"} ${past ? "text-ink-muted" : "text-navy"}`}>
          {formatTime(appointment.preferredTime)}
          {showDate ? <span className="sr-only">, {formatShortDate(appointment.preferredDate)}</span> : null}
        </p>
        <span className="ml-auto @min-[44rem]:hidden">
          <AppointmentStatusBadge status={appointment.status} />
        </span>
      </div>

      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onOpen(enquiry.id)}
          className="text-left font-heading text-base leading-snug font-extrabold text-navy after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
        >
          {enquiry.customer.name}
          <span className="sr-only">, open appointment for {enquiry.reference}</span>
        </button>
        <p className="text-sm text-ink-muted">{enquiry.customer.organisation}</p>
        <p className={`mt-2 text-base leading-snug font-medium ${past ? "text-ink-muted" : "text-charcoal"}`}>{appointment.purpose}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
          <DivisionTag division={enquiry.division} />
          <span className="text-sm text-ink-muted">{enquiry.service}</span>
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-3 @min-[44rem]:items-end">
        <span className="hidden @min-[44rem]:block">
          <AppointmentStatusBadge status={appointment.status} />
        </span>
        <div className="grid grid-cols-2 gap-2 @min-[44rem]:block [&>div]:contents @min-[44rem]:[&>div]:flex [&_button]:h-11 [&_button]:w-full @min-[44rem]:[&_button]:h-10 @min-[44rem]:[&_button]:w-auto">
          <EnquiryContactActions enquiry={enquiry} />
        </div>
      </div>
    </li>
  );
}
