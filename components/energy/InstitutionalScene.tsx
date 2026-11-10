/**
 * Illustrative drawing of a wide public building (a school, say) with solar panels on its wings. A generic
 * institutional property, not a BOOM project. Decorative: the section says the drawings are illustrative.
 */
export function InstitutionalScene({ className }: { className?: string }) {
  const columns = [160, 180, 200, 220, 240];

  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" className="fill-white/5" />
      <path d="M0 200H400" className="stroke-white/30" strokeWidth="1.5" />

      {/* Sun */}
      <circle cx="352" cy="40" r="13" className="stroke-gold" fill="none" strokeWidth="2" />
      <path d="M352 16v-6M352 70v-6M328 40h-6M382 40h-6" className="stroke-gold" strokeWidth="1.5" strokeDasharray="2 4" />

      {/* Flag */}
      <path d="M200 54V30" className="stroke-white/60" strokeWidth="1.5" />
      <path d="M200 30h16v8h-16Z" className="fill-gold" />

      {/* Centre block */}
      <path d="M142 90L200 54L258 90Z" className="fill-white/5 stroke-white/60" strokeWidth="2" strokeLinejoin="round" />
      <rect x="150" y="90" width="100" height="110" className="stroke-white/60" fill="none" strokeWidth="2" />
      {columns.map((x) => (
        <path key={x} d={`M${x} 98V192`} className="stroke-white/35" strokeWidth="2" />
      ))}
      <rect x="190" y="150" width="20" height="50" className="fill-white/10 stroke-white/60" strokeWidth="1.5" />
      <path d="M144 200H256M138 206H262" className="stroke-white/40" strokeWidth="1.5" />

      {/* Wings with roof panels */}
      {[
        { x: 44, panel: [58, 92] },
        { x: 250, panel: [264, 298] },
      ].map(({ x, panel }) => (
        <g key={x}>
          <rect x={x + (x < 200 ? 0 : 6)} y="130" width="106" height="70" className="stroke-white/60" fill="none" strokeWidth="2" />
          {panel.map((px) => (
            <path key={px} d={`M${px} 128L${px + 26} 128L${px + 31} 112L${px + 5} 112Z`} className="fill-gold/15 stroke-gold" strokeWidth="1.8" strokeLinejoin="round" />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={x + (x < 200 ? 10 : 16) + i * 32} y="146" width="20" height="20" className="stroke-white/60" fill="none" strokeWidth="1.5" />
          ))}
        </g>
      ))}
    </svg>
  );
}
