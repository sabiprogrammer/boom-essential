import Link from "next/link";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import { displayStatus } from "@/lib/admin/appointments/transitions";
import type { AppointmentListQuery, AppointmentWithEnquiry } from "@/lib/admin/appointments/types";
import { describeRequest } from "@/lib/admin/enquiries/labels";
import { Avatar } from "@/components/dashboard-preview/Avatar";
import { EnquiryContactActions } from "@/components/admin/enquiries/EnquiryContactActions";
import { AppointmentStateBadge } from "./AppointmentStateBadge";
import { AppointmentWhen } from "./AppointmentWhen";

/**
 * The appointments as stacked rows, for narrow containers (phones, small tablets). The Call and WhatsApp buttons are
 * full-size touch targets on their own line, above the row's hit area, so they never open the appointment.
 */
export function AppointmentList({ rows, query, selectedId }: { rows: readonly AppointmentWithEnquiry[]; query: AppointmentListQuery; selectedId: string | null }) {
  return (
    <ul>
      {rows.map(({ appointment, enquiry, replacedById }) => (
        <li
          key={appointment.id}
          className={`relative border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-warm-white sm:px-6 ${
            selectedId === appointment.id ? "bg-tint shadow-[inset_3px_0_0_var(--color-navy)]" : ""
          }`}
        >
          <div className="flex items-start gap-3.5">
            <Avatar name={enquiry.organisation ?? enquiry.fullName} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={appointmentsHref({ ...query, appointmentId: appointment.id })}
                  prefetch={false}
                  scroll={false}
                  className="text-left font-heading text-base leading-snug font-extrabold text-navy after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-navy focus-visible:outline-none"
                >
                  {enquiry.fullName}
                  <span className="sr-only">, open appointment for enquiry {enquiry.reference}</span>
                </Link>
                <AppointmentStateBadge status={displayStatus(appointment, replacedById)} />
              </div>
              <p className="text-sm text-ink-muted">
                {enquiry.reference} · {describeRequest(enquiry)}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <AppointmentWhen appointment={appointment} />
          </div>

          <div className="relative z-10 mt-4">
            <div className="grid grid-cols-2 gap-2 [&>div]:contents [&_a]:h-11 [&_a]:w-full [&_span[role=link]]:h-11 [&_span[role=link]]:w-full">
              <EnquiryContactActions enquiry={enquiry} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
