import { appointmentStatusLabels } from "@/lib/dashboard-preview/labels";
import type { DisplayStatus } from "@/lib/admin/appointments/types";

/**
 * Status pills are functional, muted and always carry a text label (never colour alone); each also has a distinct dot.
 * "Rescheduled" is not a database status: it labels a cancelled appointment that was replaced by a newer one.
 */
const pill = "inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 font-heading text-xs font-bold whitespace-nowrap ring-1 ring-inset";

const looks: Record<DisplayStatus, { label: string; className: string; dot: string }> = {
  requested: { label: appointmentStatusLabels.requested, className: "bg-gold-tint text-navy ring-gold/50", dot: "border-[1.5px] border-navy" },
  confirmed: { label: appointmentStatusLabels.confirmed, className: "bg-green text-white ring-green", dot: "bg-white" },
  completed: { label: appointmentStatusLabels.completed, className: "bg-leaf text-green ring-green/30", dot: "bg-green" },
  cancelled: { label: appointmentStatusLabels.cancelled, className: "bg-tint text-ink-muted ring-line-strong", dot: "bg-ink-muted" },
  rescheduled: { label: "Rescheduled", className: "bg-tint text-navy ring-line-strong", dot: "border-[1.5px] border-dashed border-navy" },
};

export function AppointmentStateBadge({ status }: { status: DisplayStatus }) {
  const look = looks[status];
  return (
    <span className={`${pill} ${look.className}`}>
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${look.dot}`} />
      {look.label}
    </span>
  );
}
