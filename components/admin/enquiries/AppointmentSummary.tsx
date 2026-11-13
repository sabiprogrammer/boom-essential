import Link from "next/link";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import { formatLongDate, formatTime } from "@/lib/dashboard-preview/dates";
import { DateTile } from "@/components/dashboard-preview/DateTile";
import { DetailItem, DetailList } from "@/components/dashboard-preview/DetailSection";
import { AppointmentStatusBadge } from "@/components/dashboard-preview/StatusBadge";

/**
 * The appointment requests attached to an enquiry: what the customer asked for, and the confirmed slot once an
 * administrator has set one. Confirming, rescheduling and cancelling happen on the Appointments screen (the link on each
 * request opens it). A request is never a confirmed booking until an administrator confirms it.
 */
export function AppointmentSummary({ appointments }: { appointments: readonly AppointmentRecord[] }) {
  if (appointments.length === 0) return <p className="text-base text-ink-muted">The customer did not ask for an appointment.</p>;

  return (
    <div className="space-y-6">
      {appointments.map((appointment, index) => (
        <div key={appointment.id} className={index > 0 ? "border-t border-line pt-6" : ""}>
          <div className="flex items-start gap-4">
            <DateTile date={appointment.preferredDate} muted={appointment.status === "cancelled" || appointment.status === "completed"} />
            <div className="min-w-0">
              <p className="font-heading text-base leading-snug font-extrabold text-navy">Requested: {formatLongDate(appointment.preferredDate)}</p>
              <p className="mt-0.5 text-base text-charcoal">{formatTime(appointment.preferredTime)} (Lagos time)</p>
              <p className="mt-2">
                <AppointmentStatusBadge status={appointment.status} />
              </p>
            </div>
          </div>

          <Link
            href={appointmentsHref({ appointmentId: appointment.id })}
            className="mt-4 inline-flex h-11 items-center rounded-md border border-navy px-5 font-heading text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Manage this appointment
          </Link>

          {appointment.confirmedDate || appointment.venue || appointment.schedulingNote ? (
            <div className="mt-4">
              <DetailList>
                {appointment.confirmedDate ? (
                  <DetailItem label="Confirmed for">
                    {formatLongDate(appointment.confirmedDate)}
                    {appointment.confirmedTime ? `, ${formatTime(appointment.confirmedTime)}` : ""}
                  </DetailItem>
                ) : null}
                {appointment.venue ? <DetailItem label="Venue">{appointment.venue}</DetailItem> : null}
                {appointment.schedulingNote ? (
                  <DetailItem label="Scheduling note" wide>
                    {appointment.schedulingNote}
                  </DetailItem>
                ) : null}
              </DetailList>
            </div>
          ) : null}
        </div>
      ))}
      <p className="text-sm text-ink-muted">Appointment requests are subject to confirmation by our team. A request is not a confirmed booking.</p>
    </div>
  );
}
