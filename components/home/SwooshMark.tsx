/**
 * The master logo's swoosh, redrawn as a tapered crescent (a geometric motif, not the logo artwork itself).
 * Fills with currentColor. Decorative only.
 * `stretch` lets the crescent fill a box of any proportion (used where it must meet the bar tops).
 */
export function SwooshMark({ className, stretch = false }: { className?: string; stretch?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 240C86 92 218 18 400 0C262 46 128 126 0 240Z" />
    </svg>
  );
}
