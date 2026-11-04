type SunArcsProps = {
  /** Centre of the sun, which sits on the horizon line. */
  cx: number;
  cy: number;
  radii: readonly number[];
  /** Stroke opacity for each radius, innermost first. */
  opacities: readonly number[];
};

/** Concentric half-circles rising from a horizon: the sun's glow, drawn as fine gold lines. SVG group, decorative. */
export function SunArcs({ cx, cy, radii, opacities }: SunArcsProps) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      {radii.map((r, index) => (
        <path key={r} d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`} opacity={opacities[index] ?? 0.2} />
      ))}
    </g>
  );
}
