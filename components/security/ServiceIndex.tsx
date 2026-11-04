import { Viewfinder } from "./Viewfinder";

type ServiceIndexProps = {
  number: string;
  /** "dark" for navy/charcoal surfaces, "light" for white and tint. */
  surface?: "dark" | "light";
  className?: string;
};

/** The service number set inside viewfinder brackets: the distinctive marker used by every service. */
export function ServiceIndex({ number, surface = "light", className = "" }: ServiceIndexProps) {
  const dark = surface === "dark";
  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid h-16 min-w-16 place-items-center px-3 font-heading text-2xl font-extrabold tabular-nums ${
        dark ? "text-white" : "text-navy"
      } ${className}`}
    >
      <Viewfinder cornerClassName="size-3 border-[1.5px]" colorClassName={dark ? "border-gold" : "border-navy"} />
      {number}
    </span>
  );
}
