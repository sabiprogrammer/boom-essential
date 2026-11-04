import type { CSSProperties } from "react";

const PERIMETER = { x: 70, y: 70, w: 420, h: 300 };
const GATE = { from: 240, to: 320 };
const FOV_RADIUS = 160;
const FOV_HALF_ANGLE = 28;
const BUILDING = { x: 175, y: 130, w: 210, h: 150 };

type Camera = { x: number; y: number; from: number; to: number };

const deg = (rad: number) => (rad * 180) / Math.PI;

/** Four corner cameras, each aimed at the centre of the building with a fixed field of view. */
const cameras: readonly Camera[] = [
  [PERIMETER.x, PERIMETER.y],
  [PERIMETER.x + PERIMETER.w, PERIMETER.y],
  [PERIMETER.x, PERIMETER.y + PERIMETER.h],
  [PERIMETER.x + PERIMETER.w, PERIMETER.y + PERIMETER.h],
].map(([x, y]) => {
  const aim = deg(Math.atan2(BUILDING.y + BUILDING.h / 2 - y, BUILDING.x + BUILDING.w / 2 - x));
  return { x, y, from: aim - FOV_HALF_ANGLE, to: aim + FOV_HALF_ANGLE };
});

const rad = (deg: number) => (deg * Math.PI) / 180;

function wedge({ x, y, from, to }: Camera) {
  const x1 = x + FOV_RADIUS * Math.cos(rad(from));
  const y1 = y + FOV_RADIUS * Math.sin(rad(from));
  const x2 = x + FOV_RADIUS * Math.cos(rad(to));
  const y2 = y + FOV_RADIUS * Math.sin(rad(to));
  return `M${x} ${y}L${x1.toFixed(1)} ${y1.toFixed(1)}A${FOV_RADIUS} ${FOV_RADIUS} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z`;
}

/** Posts every 60 units along the fence line, skipping the gate opening. */
function fencePosts() {
  const posts: { x: number; y: number }[] = [];
  const { x, y, w, h } = PERIMETER;
  for (let dx = 0; dx <= w; dx += 60) {
    posts.push({ x: x + dx, y });
    const bottomX = x + dx;
    if (bottomX < GATE.from - 10 || bottomX > GATE.to + 10) posts.push({ x: bottomX, y: y + h });
  }
  for (let dy = 60; dy < h; dy += 60) {
    posts.push({ x, y: y + dy });
    posts.push({ x: x + w, y: y + dy });
  }
  return posts;
}

/**
 * Hero artwork: a plan view of an imaginary property with a fence line, a gate, an access point, a
 * building and four corner cameras whose fields of view sweep in once on load. A schematic of the
 * kind of thing the page is about, never a depiction of a real BOOM installation. Decorative.
 */
export function SecurityPlanGraphic({ className }: { className?: string }) {
  const { x, y, w, h } = PERIMETER;

  return (
    <svg
      viewBox="40 40 480 360"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Building footprint */}
      <rect x={BUILDING.x} y={BUILDING.y} width={BUILDING.w} height={BUILDING.h} className="fill-navy-hover stroke-white/45" strokeWidth="1.5" />
      <path d="M280 130V280M175 205H385" className="stroke-white/20" strokeWidth="1" />

      {/* Fields of view, drawn over the building */}
      {cameras.map((camera, index) => (
        <path
          key={index}
          d={wedge(camera)}
          className="scan-in fill-gold/15 stroke-gold/60"
          strokeWidth="1"
          style={{ transformOrigin: `${camera.x}px ${camera.y}px`, "--delay": `${700 + index * 160}ms` } as CSSProperties}
        />
      ))}

      {/* Entry route from the gate to the building */}
      <path d="M280 370V280" className="stroke-gold" strokeWidth="1.5" strokeDasharray="3 6" />

      {/* Fence line with a gate opening */}
      <path
        d={`M${GATE.from} ${y + h}H${x}V${y}H${x + w}V${y + h}H${GATE.to}`}
        className="stroke-white/55"
        strokeWidth="1.5"
        strokeDasharray="8 5"
        fill="none"
      />
      {fencePosts().map((post) => (
        <rect key={`${post.x}-${post.y}`} x={post.x - 4} y={post.y - 4} width="8" height="8" className="fill-charcoal stroke-white/70" strokeWidth="1.5" />
      ))}

      {/* Gate posts and access point */}
      <rect x={GATE.from - 5} y={y + h - 9} width="10" height="18" className="fill-gold" />
      <rect x={GATE.to - 5} y={y + h - 9} width="10" height="18" className="fill-gold" />
      <rect x={GATE.to + 14} y={y + h - 34} width="14" height="22" className="fill-charcoal stroke-gold" strokeWidth="1.5" />
      <path d={`M${GATE.to + 21} ${y + h - 27}h.01M${GATE.to + 21} ${y + h - 20}h.01`} className="stroke-gold" strokeWidth="3" strokeLinecap="round" />

      {/* Cameras */}
      {cameras.map((camera, index) => (
        <g key={index}>
          <circle cx={camera.x} cy={camera.y} r="11" className="fill-charcoal stroke-gold" strokeWidth="1.5" />
          <circle cx={camera.x} cy={camera.y} r="4" className="fill-gold" />
        </g>
      ))}
    </svg>
  );
}
