import { divisionLabels } from "@/lib/dashboard-preview/labels";
import type { DivisionId } from "@/lib/dashboard-preview/types";

/** Accent per offering. Decorative: the name is always written out. Industrial Equipment stays neutral. */
const accents: Record<DivisionId, string> = {
  energy: "bg-navy",
  security: "bg-charcoal",
  foods: "bg-green",
  "industrial-equipment": "bg-line-strong",
};

export function DivisionTag({ division }: { division: DivisionId }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-heading text-xs font-bold tracking-[0.07em] text-ink-muted uppercase">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-[2px] ${accents[division]}`} />
      {divisionLabels[division]}
    </span>
  );
}
