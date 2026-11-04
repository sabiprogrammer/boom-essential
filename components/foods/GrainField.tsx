import type { CSSProperties } from "react";

type Stalk = { x: number; height: number; bend: number; gold?: boolean };

const BASE = 520;

/** Five stalks of different heights, drawn as geometric grass-like grain. One carries the single gold accent. */
const stalks: readonly Stalk[] = [
  { x: 60, height: 300, bend: -22 },
  { x: 142, height: 390, bend: 20 },
  { x: 224, height: 450, bend: -14, gold: true },
  { x: 304, height: 360, bend: 20 },
  { x: 384, height: 270, bend: -8 },
];

/** Point on a stalk's quadratic curve at t (0 at the ground, 1 at the tip). */
function pointOn({ x, height, bend }: Stalk, t: number) {
  const control = { x: x + bend * 2, y: BASE - height * 0.55 };
  const end = { x: x + bend, y: BASE - height };
  const u = 1 - t;
  return {
    x: u * u * x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * BASE + 2 * u * t * control.y + t * t * end.y,
  };
}

const GRAIN_STEPS = [0.52, 0.62, 0.72, 0.82, 0.92];

/**
 * Hero artwork for BOOM Foods: abstract stalks of grain standing in the green field panel. Geometric
 * and botanical, not a depiction of any BOOM product or farm. Each stalk grows up once on load. Decorative.
 */
export function GrainField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 520"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {stalks.map((stalk, index) => {
        const tip = pointOn(stalk, 1);
        return (
          <g
            key={stalk.x}
            className="sprout"
            style={{ transformOrigin: `${stalk.x}px ${BASE}px`, "--delay": `${300 + index * 170}ms` } as CSSProperties}
          >
            <path
              d={`M${stalk.x} ${BASE}Q${stalk.x + stalk.bend * 2} ${BASE - stalk.height * 0.55} ${tip.x.toFixed(1)} ${tip.y.toFixed(1)}`}
              className="stroke-white"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {GRAIN_STEPS.map((t) => {
              const p = pointOn(stalk, t);
              return [-1, 1].map((side) => (
                <ellipse
                  key={`${t}-${side}`}
                  cx={p.x + side * 9}
                  cy={p.y}
                  rx="4.5"
                  ry="12"
                  transform={`rotate(${side * 38} ${p.x + side * 9} ${p.y})`}
                  className={stalk.gold ? "fill-gold" : "fill-white/85"}
                />
              ));
            })}
            <ellipse cx={tip.x} cy={tip.y - 8} rx="4" ry="12" className={stalk.gold ? "fill-gold" : "fill-white/85"} />
          </g>
        );
      })}
    </svg>
  );
}
