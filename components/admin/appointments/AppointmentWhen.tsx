import { formatSlotShort, lagosTimeNote } from "@/lib/admin/appointments/format-slot";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";

/**
 * The dates and times of one appointment, labelled so they are never confused: what the customer ASKED for, and, once an
 * administrator has fixed it, what was CONFIRMED. All in Lagos time, shown exactly as stored.
 */
export function AppointmentWhen({ appointment }: { appointment: AppointmentRecord }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-charcoal">
        <span className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">Asked for </span>
        <span className="whitespace-nowrap">{formatSlotShort(appointment.preferredDate, appointment.preferredTime)}</span>
      </p>
      {appointment.confirmedDate && appointment.confirmedTime ? (
        <p className="font-semibold text-green">
          <span className="font-heading text-xs font-bold tracking-[0.06em] uppercase">Confirmed </span>
          <span className="whitespace-nowrap">{formatSlotShort(appointment.confirmedDate, appointment.confirmedTime)}</span>
        </p>
      ) : null}
      <p className="text-xs text-ink-muted">{lagosTimeNote}</p>
    </div>
  );
}
