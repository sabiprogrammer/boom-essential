import { appointmentStatusLabels, enquiryStatusLabels } from "@/lib/admin/shared/labels";
import type { AppointmentStatus, EnquiryStatus } from "@/lib/admin/shared/types";

/**
 * Status pills are functional, muted and always carry a text label (never colour alone). Each status also has
 * a distinct dot (solid, ring or none) so it can be told apart without colour.
 */
const pill =
  "inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 font-heading text-xs font-bold whitespace-nowrap ring-1 ring-inset";

type Look = { className: string; dot: string };

const enquiryLooks: Record<EnquiryStatus, Look> = {
  new: { className: "bg-navy text-white ring-navy", dot: "bg-gold" },
  in_progress: { className: "bg-gold-tint text-navy ring-gold/50", dot: "bg-gold ring-2 ring-navy/70" },
  contacted: { className: "bg-tint text-navy ring-line-strong", dot: "border-[1.5px] border-navy" },
  resolved: { className: "bg-leaf text-green ring-green/30", dot: "bg-green" },
};

const appointmentLooks: Record<AppointmentStatus, Look> = {
  requested: { className: "bg-gold-tint text-navy ring-gold/50", dot: "border-[1.5px] border-navy" },
  confirmed: { className: "bg-green text-white ring-green", dot: "bg-white" },
  completed: { className: "bg-leaf text-green ring-green/30", dot: "bg-green" },
  cancelled: { className: "bg-tint text-ink-muted ring-line-strong", dot: "bg-ink-muted" },
};

function Pill({ label, look }: { label: string; look: Look }) {
  return (
    <span className={`${pill} ${look.className}`}>
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${look.dot}`} />
      {label}
    </span>
  );
}

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <Pill label={enquiryStatusLabels[status]} look={enquiryLooks[status]} />;
}

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Pill label={appointmentStatusLabels[status]} look={appointmentLooks[status]} />;
}
