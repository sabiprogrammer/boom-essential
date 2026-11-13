import Link from "next/link";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import { displayStatus } from "@/lib/admin/appointments/transitions";
import type { AppointmentListQuery, AppointmentWithEnquiry } from "@/lib/admin/appointments/types";
import { describeRequest } from "@/lib/admin/enquiries/labels";
import { Avatar } from "@/components/dashboard-preview/Avatar";
import { DivisionBadge } from "@/components/admin/enquiries/DivisionBadge";
import { EnquiryContactActions } from "@/components/admin/enquiries/EnquiryContactActions";
import { AppointmentStateBadge } from "./AppointmentStateBadge";
import { AppointmentWhen } from "./AppointmentWhen";

const head = "px-4 py-3 text-left font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase first:pl-6 last:pr-6";
const cell = "px-4 py-4 align-middle first:pl-6 last:pr-6";

/**
 * The appointments as a table, for wide containers. Each row has one real link (the customer name) whose hit area is
 * stretched over the row, so the whole row opens the appointment drawer (the address gains ?appointment=<id>). The
 * Actions cell sits above that hit area (relative z-10), so Call and WhatsApp never open it.
 */
export function AppointmentTable({ rows, query, selectedId }: { rows: readonly AppointmentWithEnquiry[]; query: AppointmentListQuery; selectedId: string | null }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <caption className="sr-only">Appointment requests with their customers</caption>
        <thead>
          <tr className="border-b border-line bg-warm-white/80">
            <th scope="col" className={head}>Customer</th>
            <th scope="col" className={head}>When</th>
            <th scope="col" className={head}>Status</th>
            <th scope="col" className={head}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ appointment, enquiry, replacedById }) => (
            <tr
              key={appointment.id}
              className={`group relative border-b border-line transition-[background-color,box-shadow] duration-150 last:border-b-0 hover:bg-warm-white hover:shadow-[inset_3px_0_0_var(--color-gold)] ${
                selectedId === appointment.id ? "bg-tint shadow-[inset_3px_0_0_var(--color-navy)]" : ""
              }`}
            >
              <td className={cell}>
                <div className="flex items-center gap-3.5">
                  <Avatar name={enquiry.organisation ?? enquiry.fullName} />
                  <div className="min-w-0">
                    <Link
                      href={appointmentsHref({ ...query, appointmentId: appointment.id })}
                      prefetch={false}
                      scroll={false}
                      className="text-left font-heading text-base leading-snug font-extrabold whitespace-nowrap text-navy after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                    >
                      {enquiry.fullName}
                      <span className="sr-only">, open appointment for enquiry {enquiry.reference}</span>
                    </Link>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm leading-snug text-ink-muted">
                      <span className="font-heading text-xs font-bold tracking-wide text-charcoal tabular-nums">{enquiry.reference}</span>
                      <DivisionBadge division={enquiry.division} />
                    </p>
                    <p className="text-sm text-ink-muted">{describeRequest(enquiry)}</p>
                  </div>
                </div>
              </td>
              <td className={cell}>
                <AppointmentWhen appointment={appointment} />
              </td>
              <td className={cell}>
                <AppointmentStateBadge status={displayStatus(appointment, replacedById)} />
                {appointment.rescheduledFromId ? <p className="mt-1.5 text-xs text-ink-muted">Replaces an earlier appointment</p> : null}
              </td>
              <td className={cell}>
                <div className="relative z-10 w-fit">
                  <EnquiryContactActions enquiry={enquiry} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
