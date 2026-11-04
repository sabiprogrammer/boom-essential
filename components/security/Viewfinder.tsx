type ViewfinderProps = {
  /** Corner bracket size and thickness classes, e.g. "size-6 border-2". Defaults suit small frames. */
  cornerClassName?: string;
  /** Colour class for the brackets. Gold on dark surfaces, navy on light. */
  colorClassName?: string;
  className?: string;
};

/**
 * Four corner brackets, as on a camera viewfinder. Absolutely positioned to fill the nearest positioned
 * ancestor. Purely decorative. The parent can add `group` classes to animate the inset on hover.
 */
export function Viewfinder({
  cornerClassName = "size-5 border-2",
  colorClassName = "border-gold",
  className = "inset-0",
}: ViewfinderProps) {
  const corner = `absolute ${cornerClassName} ${colorClassName}`;
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <span className={`${corner} top-0 left-0 border-r-0 border-b-0`} />
      <span className={`${corner} top-0 right-0 border-b-0 border-l-0`} />
      <span className={`${corner} bottom-0 left-0 border-t-0 border-r-0`} />
      <span className={`${corner} right-0 bottom-0 border-t-0 border-l-0`} />
    </span>
  );
}
