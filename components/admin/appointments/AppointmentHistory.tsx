import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import type { StatusHistoryRecord } from "@/lib/admin/appointments/types";
import { appointmentStatusLabels } from "@/lib/dashboard-preview/labels";
import { formatReceivedDateTime } from "@/lib/dashboard-preview/dates";
import type { AppointmentStatus } from "@/lib/admin/enquiries/types";

const who = { you: "You", administrator: "An administrator", system: "The system" } as const;
const label = (status: string | null) => (status ? (appointmentStatusLabels[status as AppointmentStatus] ?? status) : "");

/**
 * This appointment's own history, newest first: each status change (from, to, who and when) written by the database,
 * ending with when it was first recorded. Times are the moments the changes were made, shown in Lagos time.
 */
export function AppointmentHistory({ appointment, history }: { appointment: AppointmentRecord; history: readonly StatusHistoryRecord[] }) {
  return (
    <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
      {history.map((entry) => (
        <li key={entry.id} className="relative pl-6">
          <span aria-hidden="true" className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-navy bg-white" />
          <p className="text-base leading-snug text-charcoal">
            Status changed from <strong className="font-heading text-navy">{label(entry.previousStatus)}</strong> to{" "}
            <strong className="font-heading text-navy">{label(entry.newStatus)}</strong>
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {who[entry.by]}, {formatReceivedDateTime(entry.createdAt)}
          </p>
        </li>
      ))}
      <li className="relative pl-6">
        <span aria-hidden="true" className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-line-strong bg-white" />
        <p className="text-base leading-snug text-charcoal">
          {appointment.rescheduledFromId ? "Created by rescheduling an earlier appointment" : "Appointment requested"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">{formatReceivedDateTime(appointment.createdAt)}</p>
      </li>
    </ol>
  );
}
