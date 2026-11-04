/**
 * Abstract design drawing: a drafting grid, a tilted panel outline and an unlabelled dimension line.
 * It illustrates "design" in general. It shows no real system, size or layout. Decorative.
 */
export function BlueprintDiagram({ className }: { className?: string }) {
  const verticals = Array.from({ length: 14 }, (_, i) => `M${i * 28} 0V280`).join("");
  const horizontals = Array.from({ length: 11 }, (_, i) => `M0 ${i * 28}H360`).join("");

  return (
    <svg viewBox="0 0 360 280" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="280" className="fill-charcoal" />
      <path d={verticals + horizontals} className="stroke-white/10" strokeWidth="1" />

      {/* Tilted panel outline with cell lines */}
      <g transform="translate(56 112) skewY(-12)">
        <rect width="220" height="96" className="fill-navy-hover/60 stroke-white/70" strokeWidth="1.5" />
        <path d="M55 0V96M110 0V96M165 0V96M0 48H220" className="stroke-white/30" strokeWidth="1" />
      </g>

      {/* Dimension line (no figures) */}
      <g className="stroke-gold" strokeWidth="1.5">
        <path d="M56 70H276" />
        <path d="M56 62V78M276 62V78" />
        <path d="M56 70l8-4v8zM276 70l-8-4v8z" className="fill-gold" />
      </g>
    </svg>
  );
}
