import type { AppointmentDetailResult } from "@/lib/admin/appointments/queries";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import { displayStatus } from "@/lib/admin/appointments/transitions";
import type { AppointmentListQuery } from "@/lib/admin/appointments/types";
import { adminDivisionLabels } from "@/lib/admin/enquiries/labels";
import { formatReceivedDateTime } from "@/lib/admin/shared/dates";
import { DivisionBadge } from "@/components/admin/enquiries/DivisionBadge";
import { EnquiryDrawer } from "@/components/admin/enquiries/EnquiryDrawer";
import { AppointmentDetailContent } from "./AppointmentDetailContent";
import { AppointmentStateBadge } from "./AppointmentStateBadge";

/**
 * The drawer for the appointment named in the address, in whichever state its lookup ended: found, not found (it does not
 * exist or is not visible to this administrator), or a failed read. The list behind it stays usable either way.
 */
export function AppointmentDrawerFor({ detail, query, today }: { detail: AppointmentDetailResult; query: AppointmentListQuery; today: string }) {
  const closeHref = appointmentsHref({ ...query, appointmentId: null });

  if (!detail.ok) {
    return (
      <EnquiryDrawer closeHref={closeHref} eyebrow="Appointment" title="We could not load this appointment">
        <div role="alert" className="border-l-4 border-danger bg-danger-tint p-5 text-base text-charcoal">
          Something went wrong while reading this appointment, so nothing is shown. Close this panel and try again in a moment.
        </div>
      </EnquiryDrawer>
    );
  }

  if (!detail.data) {
    return (
      <EnquiryDrawer closeHref={closeHref} eyebrow="Appointment" title="Appointment not found">
        <div role="status" className="border-l-4 border-gold bg-white p-5 text-base text-charcoal">
          This appointment does not exist, or you do not have access to it.
        </div>
      </EnquiryDrawer>
    );
  }

  const { appointment, enquiry, replacedById } = detail.data;
  return (
    <EnquiryDrawer
      key={appointment.id}
      closeHref={closeHref}
      eyebrow={
        <>
          Appointment · <span className="whitespace-nowrap">{enquiry.reference}</span>
        </>
      }
      title={enquiry.fullName}
      subtitle={enquiry.organisation ?? adminDivisionLabels[enquiry.division]}
      meta={
        <>
          <AppointmentStateBadge status={displayStatus(appointment, replacedById)} />
          <DivisionBadge division={enquiry.division} />
          <span className="text-sm text-ink-muted">Requested {formatReceivedDateTime(appointment.createdAt)}</span>
        </>
      }
    >
      <AppointmentDetailContent data={detail.data} today={today} query={query} />
    </EnquiryDrawer>
  );
}
