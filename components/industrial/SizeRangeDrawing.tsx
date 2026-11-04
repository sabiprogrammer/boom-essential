import { MachineUnit } from "./MachineUnit";

/**
 * The same generic unit at three increasing scales on one baseline, with a gold arrow beneath. It says
 * "different sizes" and nothing more: no sizes, counts or specifications are implied. Decorative.
 */
export function SizeRangeDrawing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 320" className={className} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 262H620" className="stroke-white/35" strokeWidth="1.5" />
      <MachineUnit x={110} y={262} scale={0.6} />
      <MachineUnit x={290} y={262} scale={0.88} />
      <MachineUnit x={510} y={262} scale={1.2} />

      <g className="stroke-gold" strokeWidth="2" fill="none">
        <path d="M60 296H580" />
        <path d="m566 286 14 10-14 10" />
      </g>
    </svg>
  );
}
