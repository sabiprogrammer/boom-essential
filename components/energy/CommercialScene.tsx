/**
 * Illustrative drawing of a two-storey shop or office with solar panels on a flat roof. A generic commercial
 * property, not a BOOM project. Decorative: the section says the drawings are illustrative.
 */
export function CommercialScene({ className }: { className?: string }) {
  const roofPanels = [118, 158, 198, 238];

  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" className="fill-white/5" />
      <path d="M0 200H400" className="stroke-white/30" strokeWidth="1.5" />

      {/* Sun */}
      <circle cx="346" cy="44" r="14" className="stroke-gold" fill="none" strokeWidth="2" />
      <path d="M346 18v-7M346 77v-7M320 44h-7M379 44h-7" className="stroke-gold" strokeWidth="1.5" strokeDasharray="2 4" />

      {/* Roof panels */}
      {roofPanels.map((x) => (
        <g key={x}>
          <path d={`M${x} 70L${x + 26} 70L${x + 32} 52L${x + 6} 52Z`} className="fill-gold/15 stroke-gold" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={`M${x + 13} 70L${x + 19} 52`} className="stroke-gold/70" strokeWidth="1.2" />
        </g>
      ))}

      {/* Building */}
      <rect x="96" y="70" width="208" height="8" className="fill-white/10 stroke-white/60" strokeWidth="1.5" />
      <rect x="100" y="78" width="200" height="122" className="stroke-white/60" fill="none" strokeWidth="2" />
      <path d="M100 118H300" className="stroke-white/30" strokeWidth="1.5" />

      {/* Upper windows */}
      {[116, 164, 212, 260].map((x) => (
        <rect key={x} x={x} y="90" width="26" height="20" className="stroke-white/60" fill="none" strokeWidth="1.5" />
      ))}

      {/* Shop front */}
      <path d="M96 124H304L296 138H104Z" className="fill-gold/20 stroke-gold" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="114" y="146" width="172" height="54" className="stroke-white/60" fill="none" strokeWidth="1.5" />
      <path d="M157 146V200M243 146V200" className="stroke-white/35" strokeWidth="1.5" />
      <rect x="186" y="156" width="28" height="44" className="fill-white/10 stroke-white/60" strokeWidth="1.5" />
    </svg>
  );
}
