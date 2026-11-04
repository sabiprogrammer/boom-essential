import type { CSSProperties } from "react";
import { SunArcs } from "./SunArcs";

const ROWS = [0, 90];
const COLUMNS = 7;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT = 80;

/**
 * Hero artwork: a sun rising on the hero's bottom edge (the horizon) behind a tilted two-row solar
 * array on legs. Pure SVG geometry in the brand palette; an illustration, not a depiction of any
 * real installation. Decorative.
 */
export function SolarGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 100 640 372"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun and glow, rising from the horizon */}
      <g className="sunrise text-gold">
        <SunArcs cx={430} cy={470} radii={[185, 225, 270, 320]} opacities={[0.6, 0.4, 0.25, 0.14]} />
        <path d="M280 470A150 150 0 0 1 580 470Z" fill="currentColor" />
      </g>

      {/* Legs */}
      <g className="stroke-white/45" strokeWidth="4" strokeLinecap="square">
        <path d="M100 450V470M360 404V470" />
      </g>

      {/* Array: two rows of panels tilted toward the sun */}
      <g transform="translate(40 290) skewY(-10)" className="rise" style={{ "--delay": "300ms" } as CSSProperties}>
        {ROWS.map((y) => (
          <g key={y} transform={`translate(0 ${y})`}>
            <rect width={PANEL_WIDTH} height={PANEL_HEIGHT} className="fill-navy-hover stroke-white/45" strokeWidth="1.5" />
            <path
              d={[
                ...Array.from({ length: COLUMNS - 1 }, (_, i) => `M${((i + 1) * PANEL_WIDTH) / COLUMNS} 0V${PANEL_HEIGHT}`),
                `M0 ${PANEL_HEIGHT / 2}H${PANEL_WIDTH}`,
              ].join("")}
              className="stroke-white/20"
              strokeWidth="1"
            />
            <path d={`M0 ${PANEL_HEIGHT}L130 0H190L60 ${PANEL_HEIGHT}Z`} className="fill-white/10" />
          </g>
        ))}
        <path d={`M0 0H${PANEL_WIDTH}`} className="stroke-gold" strokeWidth="3" />
      </g>

      {/* Horizon */}
      <path d="M0 471H640" className="stroke-white/35" strokeWidth="1.5" />
    </svg>
  );
}
