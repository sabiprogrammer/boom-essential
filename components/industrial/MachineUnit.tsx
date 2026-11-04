type MachineUnitProps = {
  /** Position of the unit's ground point (bottom centre) in the parent SVG. */
  x: number;
  y: number;
  scale?: number;
};

const line = { vectorEffect: "non-scaling-stroke" } as const;

/**
 * A generic line drawing of a floor-standing piece of equipment: base plate, body, vessel and a side
 * housing. It is deliberately abstract. It does not depict any BOOM machine, size, capacity or feature.
 * Returns an SVG group; draw it inside an `aria-hidden` SVG. Strokes keep their width when scaled.
 */
export function MachineUnit({ x, y, scale = 1 }: MachineUnitProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-62" y="-14" width="124" height="14" className="fill-charcoal stroke-white/70" strokeWidth="1.5" {...line} />
      <path d="M-62 -14H62" className="stroke-gold" strokeWidth="2.5" {...line} />

      <rect x="46" y="-64" width="30" height="34" className="fill-charcoal stroke-white/60" strokeWidth="1.5" {...line} />
      <rect x="-46" y="-84" width="92" height="70" className="fill-navy-hover stroke-white/70" strokeWidth="1.5" {...line} />
      <path d="M-46 -49H46" className="stroke-white/25" strokeWidth="1" {...line} />

      <path d="M-36 -84-42 -150H42L36 -84Z" className="fill-white/10 stroke-white/70" strokeWidth="1.5" strokeLinejoin="round" {...line} />
      <ellipse cx="0" cy="-150" rx="42" ry="8" className="fill-white/15 stroke-white/70" strokeWidth="1.5" {...line} />
    </g>
  );
}
