/**
 * Abstract remote viewing: a camera, dashed signal arcs and a screen. Illustrates "remote monitoring"
 * in general. It shows no real system, network or product. Decorative.
 */
export function SignalDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" className="fill-navy" />

      {/* Camera */}
      <rect x="30" y="86" width="56" height="30" rx="3" className="fill-charcoal stroke-white/60" strokeWidth="1.5" />
      <circle cx="74" cy="101" r="7" className="fill-gold" />
      <path d="M58 116v22M44 138h28" className="stroke-white/50" strokeWidth="2" />

      {/* Signal */}
      <g className="stroke-gold" fill="none" strokeWidth="1.5" strokeDasharray="4 5">
        <path d="M120 70A55 55 0 0 1 120 150" />
        <path d="M148 52A80 80 0 0 1 148 168" opacity="0.7" />
        <path d="M176 36A105 105 0 0 1 176 184" opacity="0.4" />
      </g>

      {/* Screen */}
      <rect x="236" y="62" width="130" height="86" rx="3" className="fill-charcoal stroke-white/60" strokeWidth="1.5" />
      <path d="M252 126l22-26 18 16 26-30 24 24" className="stroke-gold" fill="none" strokeWidth="2" />
      <path d="M301 148v22M276 170h50" className="stroke-white/50" strokeWidth="2" />
    </svg>
  );
}
