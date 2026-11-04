/**
 * Abstract site survey: a plan outline with unlabelled markers at access points and perimeter corners.
 * Illustrates "security assessment" in general. It shows no real property. Decorative.
 */
export function PlanDiagram({ className }: { className?: string }) {
  const corners = [
    [60, 40],
    [340, 40],
    [60, 180],
    [340, 180],
  ];

  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" className="fill-charcoal" />
      <path
        d={Array.from({ length: 15 }, (_, i) => `M${i * 28} 0V220`).join("") + Array.from({ length: 9 }, (_, i) => `M0 ${i * 28}H400`).join("")}
        className="stroke-white/10"
        strokeWidth="1"
      />

      <rect x="60" y="40" width="280" height="140" className="stroke-white/40" fill="none" strokeWidth="1.5" strokeDasharray="6 5" />
      <rect x="120" y="70" width="160" height="80" className="fill-navy-hover/70 stroke-white/55" strokeWidth="1.5" />
      <path d="M200 70v80M120 110h160" className="stroke-white/20" strokeWidth="1" />

      {/* Access-point markers */}
      <g className="stroke-gold" fill="none" strokeWidth="1.5">
        <circle cx="200" cy="180" r="9" />
        <path d="M200 166v28M186 180h28" />
        <circle cx="200" cy="70" r="9" />
        <path d="M200 56v28M186 70h28" />
      </g>

      {/* Perimeter corners */}
      {corners.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" className="fill-gold" />
      ))}
    </svg>
  );
}
