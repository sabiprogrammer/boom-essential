type IllustrativeLabelProps = {
  /** Position classes, relative to the nearest positioned ancestor. Defaults to the top-left corner. */
  className?: string;
};

/** Discreet disclosure that an image is illustrative (stock or generated), not real company work. */
export function IllustrativeLabel({ className = "top-4 left-4 sm:top-5 sm:left-5" }: IllustrativeLabelProps) {
  return (
    <span
      className={`absolute z-10 bg-navy/85 px-2.5 py-1 font-heading text-xs font-semibold tracking-[0.08em] text-white uppercase ${className}`}
    >
      Illustrative image
    </span>
  );
}
