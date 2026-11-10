/**
 * Illustrative drawing of a recording unit beside a monitor showing four camera views. Generic recording
 * equipment, not a BOOM product or model. Decorative: labelled "illustrative" wherever it is shown.
 */
export function RecorderDrawing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 300" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" className="fill-navy" />
      <path d="M0 252H500" className="stroke-white/30" strokeWidth="1.5" />

      {/* Monitor with four camera views */}
      <rect x="236" y="46" width="224" height="146" rx="4" className="fill-charcoal stroke-white/60" strokeWidth="2" />
      <g className="stroke-white/25" strokeWidth="1.5">
        <path d="M348 54V184" />
        <path d="M244 119H452" />
      </g>
      <path d="M254 100l18-20 14 12 20-24" className="stroke-gold" fill="none" strokeWidth="2" />
      <path d="M368 100l22-16 20 14 20-22" className="stroke-white/55" fill="none" strokeWidth="2" />
      <path d="M254 174l24-14 16 10 22-18" className="stroke-white/55" fill="none" strokeWidth="2" />
      <path d="M368 174l18-18 22 14 24-20" className="stroke-white/55" fill="none" strokeWidth="2" />
      <circle cx="446" cy="62" r="3" className="fill-gold" />
      <path d="M348 192v28M306 220h84" className="stroke-white/50" strokeWidth="3" />

      {/* Recording unit */}
      <rect x="40" y="170" width="170" height="52" rx="3" className="fill-charcoal stroke-white/60" strokeWidth="2" />
      <rect x="54" y="184" width="62" height="8" className="fill-white/20" />
      <rect x="54" y="200" width="62" height="8" className="fill-white/20" />
      <circle cx="162" cy="192" r="4" className="fill-gold" />
      <circle cx="180" cy="192" r="4" className="fill-white/50" />
      <circle cx="198" cy="192" r="4" className="fill-white/50" />
      <path d="M130 222v14M120 236h20" className="stroke-white/40" strokeWidth="2" />
      <path d="M210 196H236" className="stroke-gold" strokeWidth="2" strokeDasharray="3 5" />
    </svg>
  );
}
