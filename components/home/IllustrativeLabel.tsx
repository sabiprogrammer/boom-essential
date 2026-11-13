type IllustrativeLabelProps = {
  /** Position classes, relative to the nearest positioned ancestor. Defaults to the top-left corner. */
  className?: string;
  /** "small" for narrow frames (the hero bars). The wording never changes. */
  size?: "default" | "small";
};

const sizes = {
  default: "px-2.5 py-1 text-xs tracking-[0.08em]",
  small: "px-1.5 py-0.5 text-[0.625rem] leading-tight tracking-[0.04em]",
} as const;

/** Discreet disclosure that an image is illustrative (stock or generated), not real company work. */
export function IllustrativeLabel({ className = "top-4 left-4 sm:top-5 sm:left-5", size = "default" }: IllustrativeLabelProps) {
  return (
    <span className={`absolute z-10 bg-navy/85 font-heading font-semibold text-white uppercase ${sizes[size]} ${className}`}>
      Illustrative image
    </span>
  );
}
