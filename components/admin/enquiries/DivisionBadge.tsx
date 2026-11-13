import { adminDivisionLabels } from "@/lib/admin/enquiries/labels";
import type { AdminDivision } from "@/lib/admin/enquiries/types";

/** Accent per offering. Decorative: the name is always written out. General and Industrial Equipment stay neutral. */
const accents: Record<AdminDivision, string> = {
  general: "bg-line-strong",
  energy: "bg-navy",
  security: "bg-charcoal",
  foods: "bg-green",
  "industrial-equipment": "bg-line-strong",
};

export function DivisionBadge({ division }: { division: AdminDivision }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-heading text-xs font-bold tracking-[0.07em] text-ink-muted uppercase">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-[2px] ${accents[division]}`} />
      {adminDivisionLabels[division]}
    </span>
  );
}
