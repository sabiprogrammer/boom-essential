import type { CSSProperties } from "react";
import { MachineUnit } from "./MachineUnit";

/**
 * Hero drawing: one large generic equipment unit on a plinth, with a faint gear ring behind it, unlabelled
 * leader lines and a vertical dimension line. Abstract, never a depiction of a real BOOM machine. Decorative.
 */
export function MachineStage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 440" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="520" height="440" className="fill-navy" />

      {/* Gear ring */}
      <g fill="none" className="stroke-white/10">
        <circle cx="270" cy="240" r="176" strokeWidth="16" strokeDasharray="12 9" />
        <circle cx="270" cy="240" r="156" strokeWidth="1.5" />
        <circle cx="270" cy="240" r="96" strokeWidth="1.5" />
      </g>

      {/* Ground */}
      <path d="M30 378H490" className="stroke-white/35" strokeWidth="1.5" />

      <g className="sprout" style={{ transformOrigin: "270px 378px", "--delay": "500ms" } as CSSProperties}>
        <MachineUnit x={270} y={378} scale={1.75} />
      </g>

      {/* Dimension line (no figures) */}
      <g className="stroke-gold" strokeWidth="1.5" fill="none">
        <path d="M58 116V378" />
        <path d="M48 116h20M48 378h20" />
      </g>

      {/* Leader lines with markers (no text) */}
      <g className="stroke-gold" strokeWidth="1.25" fill="none">
        <path d="M312 150H430" />
        <path d="M356 262H430" />
        <path d="M330 340H430" />
      </g>
      <g className="fill-gold">
        <circle cx="312" cy="150" r="3.5" />
        <circle cx="356" cy="262" r="3.5" />
        <circle cx="330" cy="340" r="3.5" />
      </g>
    </svg>
  );
}
