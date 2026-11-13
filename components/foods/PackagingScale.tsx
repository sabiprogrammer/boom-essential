const BAG_HEIGHTS = [26, 38, 54, 76, 104];

/**
 * A size ruler for household staples: bags growing from the smallest to the largest supplied size.
 * Only the two supplied end points are labelled. The bags in between show no sizes, so no
 * availability or weights are implied. Drawn for the Agricultural Green panel (white on green).
 */
export function PackagingScale({ from, to }: { from: string; to: string }) {
  return (
    <div aria-hidden="true">
      {/* On the very narrowest phones the five bags are allowed to shrink with the panel instead of overflowing it. */}
      <div className="flex items-end gap-2 min-[400px]:gap-3">
        {BAG_HEIGHTS.map((height) => (
          <svg
            key={height}
            viewBox="0 0 40 52"
            style={{ height }}
            className="w-auto min-w-0 shrink"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 9 12 3h16l5 6v41H7Z" className="fill-white/15 stroke-white" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 9h26" className="stroke-white" strokeWidth="2" />
          </svg>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 font-heading text-sm font-bold text-white">
        <span>{from}</span>
        <span className="h-px flex-1 bg-white/50" />
        <span>{to}</span>
      </div>
    </div>
  );
}
