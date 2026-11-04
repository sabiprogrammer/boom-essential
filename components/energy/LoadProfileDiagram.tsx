const BARS = [64, 92, 74, 128, 108, 170, 148, 196, 122, 158, 100, 70];
const BASELINE = 252;

/**
 * Abstract "load profile": bars of varying height beside a dashed reference line. It illustrates the
 * idea of mapping power use over a day. It carries no values and shows no real customer data. Decorative.
 */
export function LoadProfileDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 280" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="280" className="fill-navy" />
      <path d={`M0 ${BASELINE}H360`} className="stroke-white/30" strokeWidth="1.5" />
      <path d="M24 124H336" className="stroke-gold" strokeWidth="1.5" strokeDasharray="6 6" />
      {BARS.map((height, index) => {
        const x = 28 + index * 26;
        return (
          <g key={index}>
            <rect x={x} y={BASELINE - height} width="18" height={height} className="fill-white/15" />
            <rect x={x} y={BASELINE - height} width="18" height="3" className="fill-gold" />
          </g>
        );
      })}
    </svg>
  );
}
