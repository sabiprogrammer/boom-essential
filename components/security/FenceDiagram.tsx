const POSTS = [50, 130, 210, 290, 370, 450];

/**
 * Abstract fence line: posts, panels with mesh lines and a ground line. Illustrates "security fencing"
 * in general. It shows no real product, height or specification. Decorative.
 */
export function FenceDiagram({ className }: { className?: string }) {
  const panels = POSTS.slice(0, -1).map((x, i) => ({ x, w: POSTS[i + 1] - x }));

  return (
    <svg viewBox="0 0 500 300" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" className="fill-navy" />
      <path d="M0 240H500" className="stroke-white/35" strokeWidth="1.5" />

      {panels.map(({ x, w }) => (
        <g key={x}>
          <rect x={x} y="96" width={w} height="144" className="fill-white/5 stroke-white/35" strokeWidth="1.5" />
          <path
            d={Array.from({ length: 7 }, (_, i) => `M${x + ((i + 1) * w) / 8} 96V240`).join("") +
              Array.from({ length: 5 }, (_, i) => `M${x} ${96 + ((i + 1) * 144) / 6}H${x + w}`).join("")}
            className="stroke-white/15"
            strokeWidth="1"
          />
        </g>
      ))}

      {POSTS.map((x) => (
        <g key={x}>
          <rect x={x - 6} y="84" width="12" height="156" className="fill-charcoal stroke-white/60" strokeWidth="1.5" />
          <rect x={x - 6} y="80" width="12" height="6" className="fill-gold" />
        </g>
      ))}
    </svg>
  );
}
