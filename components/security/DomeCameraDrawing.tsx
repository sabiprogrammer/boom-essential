/**
 * Illustrative drawing of a ceiling-mounted dome camera with its field of view. A generic CCTV camera type,
 * not a BOOM product, model or installation. Decorative: labelled "illustrative" wherever it is shown.
 */
export function DomeCameraDrawing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 300" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" className="fill-navy" />

      {/* Ceiling */}
      <path d="M0 70H500" className="stroke-white/40" strokeWidth="2" />
      <path d="M0 70l-10 -10M50 70l-10 -10M100 70l-10 -10M150 70l-10 -10M200 70l-10 -10M250 70l-10 -10M300 70l-10 -10M350 70l-10 -10M400 70l-10 -10M450 70l-10 -10M500 70l-10 -10" className="stroke-white/15" strokeWidth="1.5" />

      {/* Mount plate and dome */}
      <rect x="196" y="70" width="108" height="14" className="fill-charcoal stroke-white/60" strokeWidth="1.5" />
      <path d="M186 84A64 64 0 0 0 314 84Z" className="fill-charcoal stroke-white/60" strokeWidth="1.5" />
      <path d="M200 92A52 52 0 0 0 300 92" className="stroke-white/20" fill="none" strokeWidth="1.5" />

      {/* Lens */}
      <circle cx="250" cy="116" r="24" className="fill-navy stroke-gold" strokeWidth="2" />
      <circle cx="250" cy="116" r="11" className="fill-gold" />
      <circle cx="250" cy="116" r="4" className="fill-navy" />
      <circle cx="214" cy="112" r="2.5" className="fill-white/70" />
      <circle cx="286" cy="112" r="2.5" className="fill-white/70" />

      {/* Field of view */}
      <g className="stroke-gold" fill="none" strokeWidth="1.5" strokeDasharray="4 6">
        <path d="M250 140L120 262" />
        <path d="M250 140L380 262" />
        <path d="M120 262Q250 292 380 262" opacity="0.7" />
      </g>
    </svg>
  );
}
