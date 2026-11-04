/**
 * Abstract controlled entry: a doorway, a keypad-style reader beside it and a dotted route in. Illustrates
 * "access control" in general. It shows no real product or system. Decorative.
 */
export function AccessDiagram({ className }: { className?: string }) {
  const keys = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })));

  return (
    <svg viewBox="0 0 500 300" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" className="fill-charcoal" />
      <path d="M0 250H500" className="stroke-white/30" strokeWidth="1.5" />

      {/* Wall with a doorway */}
      <path d="M40 250V70H200M300 70H460V250" className="stroke-white/55" strokeWidth="2" fill="none" />
      <rect x="200" y="70" width="100" height="180" className="fill-navy-hover/70 stroke-gold" strokeWidth="2" />
      <path d="M255 160h.01" className="stroke-gold" strokeWidth="8" strokeLinecap="round" />

      {/* Reader */}
      <rect x="326" y="128" width="52" height="82" rx="3" className="fill-navy stroke-white/60" strokeWidth="1.5" />
      <rect x="334" y="136" width="36" height="12" className="fill-gold" />
      {keys.map(({ row, col }) => (
        <circle key={`${row}-${col}`} cx={338 + col * 14} cy={162 + row * 14} r="3" className="fill-white/50" />
      ))}

      {/* Route in */}
      <path d="M250 290V260" className="stroke-gold" strokeWidth="2" strokeDasharray="3 6" />
    </svg>
  );
}
