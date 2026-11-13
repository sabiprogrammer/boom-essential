/**
 * Illustrative drawing of a house with solar panels on its roof and an inverter on the wall. A generic residential
 * property, not a BOOM project. Decorative.
 */
export function ResidentialScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" className="fill-white/5" />
      <path d="M0 200H400" className="stroke-white/30" strokeWidth="1.5" />

      {/* Sun */}
      <circle cx="338" cy="52" r="15" className="stroke-gold" fill="none" strokeWidth="2" />
      <path d="M338 24v-8M338 88v-8M310 52h-8M374 52h-8M318 32l-6-6M364 78l-6-6M358 32l6-6M312 78l6-6" className="stroke-gold" strokeWidth="1.5" strokeDasharray="2 4" />

      {/* House */}
      <rect x="110" y="112" width="150" height="88" className="stroke-white/60" fill="none" strokeWidth="2" />
      <path d="M94 114L185 52L276 114Z" className="fill-white/5 stroke-white/60" strokeWidth="2" strokeLinejoin="round" />
      <rect x="168" y="152" width="26" height="48" className="stroke-white/60" fill="none" strokeWidth="1.5" />
      <rect x="216" y="136" width="32" height="28" className="stroke-white/60" fill="none" strokeWidth="1.5" />
      <path d="M232 136v28M216 150h32" className="stroke-white/30" strokeWidth="1.5" />

      {/* Solar panel on the roof slope */}
      <path d="M198 66L242 94V110L198 82Z" className="fill-gold/15 stroke-gold" strokeWidth="2" strokeLinejoin="round" />
      <path d="M213 76L213 92M228 86L228 102M198 74L242 102" className="stroke-gold/70" strokeWidth="1.2" />

      {/* Inverter on the wall, wired to the roof */}
      <rect x="86" y="148" width="16" height="26" rx="2" className="fill-navy stroke-gold" strokeWidth="1.5" />
      <path d="M94 148V122L198 82" className="stroke-gold" fill="none" strokeWidth="1.5" strokeDasharray="3 5" />
    </svg>
  );
}
