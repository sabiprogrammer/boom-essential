import Link from "next/link";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import { formatSlotLong, lagosTimeNote } from "@/lib/admin/appointments/format-slot";
import type { AppointmentDetailData, AppointmentListQuery } from "@/lib/admin/appointments/types";
import { adminDivisionLabels, requestedLabels } from "@/lib/admin/enquiries/labels";
import { enquiriesHref } from "@/lib/admin/enquiries/query-params";
import { formatReceivedDateTime } from "@/lib/admin/shared/dates";
import { DetailItem, DetailList, DetailSection, Quote } from "@/components/admin/ui/DetailSection";
import { BuildingIcon, CalendarIcon, CheckIcon, ClockIcon, InboxIcon } from "@/components/admin/ui/icons";
import { EnquiryStatusBadge } from "@/components/admin/ui/StatusBadge";
import { ActivityTimeline } from "@/components/admin/enquiries/ActivityTimeline";
import { CustomerSection } from "@/components/admin/enquiries/CustomerSection";
import { AppointmentChain } from "./AppointmentChain";
import { AppointmentHistory } from "./AppointmentHistory";
import { AppointmentManager } from "./AppointmentManager";

const link = "font-heading text-sm font-semibold text-navy underline underline-offset-4 hover:text-navy-hover";

/**
 * Everything about one appointment as distinct sections: when (asked for and confirmed, in Lagos time), how to manage it,
 * the customer with contact actions, the linked enquiry, the appointment's history and the whole enquiry's activity.
 */
export function AppointmentDetailContent({ data, today, query }: { data: AppointmentDetailData; today: string; query: AppointmentListQuery }) {
  const { appointment, enquiry, chain, history, activity, replacedById } = data;
  const requested = requestedLabels(enquiry);

  return (
    <>
      <DetailSection title="When" icon={<CalendarIcon />}>
        <DetailList>
          <DetailItem label="The customer asked for" wide>
            {formatSlotLong(appointment.preferredDate, appointment.preferredTime)}
            <span className="ml-2 text-sm text-ink-muted">({lagosTimeNote})</span>
          </DetailItem>
          {appointment.confirmedDate && appointment.confirmedTime ? (
            <DetailItem label="Confirmed for" wide>
              <strong className="font-heading text-green">{formatSlotLong(appointment.confirmedDate, appointment.confirmedTime)}</strong>
              <span className="ml-2 text-sm text-ink-muted">({lagosTimeNote})</span>
              {appointment.confirmedAt ? <span className="block text-sm text-ink-muted">Confirmed on {formatReceivedDateTime(appointment.confirmedAt)}</span> : null}
            </DetailItem>
          ) : (
            <DetailItem label="Confirmed for" wide>
              Not confirmed yet. An appointment request is never a booking until an administrator confirms it.
            </DetailItem>
          )}
          {appointment.venue ? <DetailItem label="Venue" wide>{appointment.venue}</DetailItem> : null}
          {appointment.schedulingNote ? (
            <DetailItem label="Scheduling note" wide>
              <span className="whitespace-pre-line">{appointment.schedulingNote}</span>
            </DetailItem>
          ) : null}
        </DetailList>
      </DetailSection>

      <DetailSection title="Manage appointment" icon={<CheckIcon />}>
        {replacedById ? (
          <p className="text-base text-charcoal">
            This appointment was rescheduled and is kept as a record.{" "}
            <Link href={appointmentsHref({ ...query, appointmentId: replacedById })} prefetch={false} scroll={false} className={link}>
              View the replacement
            </Link>
          </p>
        ) : (
          <AppointmentManager key={`${appointment.id}-${appointment.status}`} appointment={appointment} today={today} />
        )}
        <div className="mt-5 empty:hidden">
          <AppointmentChain chain={chain} currentId={appointment.id} query={query} />
        </div>
      </DetailSection>

      <DetailSection title="Customer" icon={<BuildingIcon />}>
        <CustomerSection enquiry={enquiry} />
      </DetailSection>

      <DetailSection title="Linked enquiry" icon={<InboxIcon />}>
        <DetailList>
          <DetailItem label="Reference">{enquiry.reference}</DetailItem>
          <DetailItem label="Enquiry status">
            <EnquiryStatusBadge status={enquiry.status} />
          </DetailItem>
          <DetailItem label="Division">{adminDivisionLabels[enquiry.division]}</DetailItem>
          <DetailItem label={enquiry.division === "foods" || enquiry.division === "industrial-equipment" ? "Products requested" : "Services requested"}>
            {requested.length > 0 ? requested.join(", ") : "None chosen"}
          </DetailItem>
          <DetailItem label="Message" wide>
            <Quote>{enquiry.message}</Quote>
          </DetailItem>
        </DetailList>
        <Link
          href={enquiriesHref({ enquiryId: enquiry.id })}
          className="mt-5 inline-flex h-11 items-center rounded-md border border-navy px-5 font-heading text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Open the full enquiry
        </Link>
      </DetailSection>

      <DetailSection title="Appointment history" icon={<ClockIcon />}>
        <AppointmentHistory appointment={appointment} history={history} />
      </DetailSection>

      <DetailSection title="Enquiry activity" icon={<InboxIcon />}>
        <ActivityTimeline activity={activity} />
      </DetailSection>
    </>
  );
}
