/**
 * Illustrative drawing of a wall-mounted bullet camera with its field of view. A generic CCTV camera type,
 * not a BOOM product, model or installation. Decorative: labelled "illustrative" wherever it is shown.
 */
export function BulletCameraDrawing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 300" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" className="fill-charcoal" />

      {/* Wall */}
      <path d="M56 0V300" className="stroke-white/40" strokeWidth="2" />
      <path d="M56 0l-12 12M56 50l-12 12M56 100l-12 12M56 150l-12 12M56 200l-12 12M56 250l-12 12" className="stroke-white/15" strokeWidth="1.5" />

      {/* Bracket */}
      <rect x="56" y="104" width="22" height="46" className="fill-navy stroke-white/60" strokeWidth="1.5" />
      <path d="M78 127H150" className="stroke-white/60" strokeWidth="6" />

      {/* Camera body with sun shield */}
      <rect x="146" y="84" width="186" height="12" rx="2" className="fill-navy stroke-white/60" strokeWidth="1.5" />
      <rect x="150" y="96" width="176" height="50" rx="10" className="fill-navy stroke-white/60" strokeWidth="1.5" />
      <ellipse cx="326" cy="121" rx="12" ry="25" className="fill-charcoal stroke-gold" strokeWidth="2" />
      <ellipse cx="326" cy="121" rx="5" ry="11" className="fill-gold" />
      <circle cx="318" cy="102" r="2.5" className="fill-white/70" />
      <circle cx="318" cy="140" r="2.5" className="fill-white/70" />
      <path d="M170 146v22" className="stroke-white/40" strokeWidth="3" />

      {/* Field of view */}
      <g className="stroke-gold" fill="none" strokeWidth="1.5" strokeDasharray="4 6">
        <path d="M340 112L480 36" />
        <path d="M340 130L480 214" />
        <path d="M480 36Q500 125 480 214" opacity="0.7" />
      </g>
    </svg>
  );
}
