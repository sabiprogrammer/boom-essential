import type { DivisionId } from "@/content/divisions";
import { SwooshMark } from "./SwooshMark";

/**
 * Purely decorative, CSS-generated field for each division. Each is derived from something real:
 * Energy: the logo's ascending bars and swoosh. Security: a camera viewfinder frame over a mesh
 * (CCTV and fencing). Foods: the field-row stripes in the BOOM Foods logo.
 * Placeholder fields only: authentic photography replaces them when supplied.
 */
export function DivisionGeometry({ id }: { id: DivisionId }) {
  if (id === "energy") {
    return (
      <div aria-hidden="true" className="absolute inset-0 bg-navy">
        <div className="absolute inset-x-0 bottom-0 flex h-3/5 items-end gap-3 px-[12%]">
          <span className="h-[38%] flex-1 bg-white/10" />
          <span className="h-[62%] flex-1 bg-white/10" />
          <span className="h-full flex-1 bg-white/10" />
        </div>
        <SwooshMark className="absolute -top-[6%] -right-[8%] w-[118%] text-gold transition-transform duration-700 ease-(--ease-standard) group-hover/row:translate-x-2 group-hover/row:-translate-y-1" />
      </div>
    );
  }

  if (id === "security") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-charcoal"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)",
          backgroundSize: "2.5rem 2.5rem",
        }}
      >
        <span className="absolute top-4 left-4 size-10 border-t-2 border-l-2 border-gold transition-all duration-500 group-hover/row:top-2.5 group-hover/row:left-2.5" />
        <span className="absolute top-4 right-4 size-10 border-t-2 border-r-2 border-gold transition-all duration-500 group-hover/row:top-2.5 group-hover/row:right-2.5" />
        <span className="absolute bottom-4 left-4 size-10 border-b-2 border-l-2 border-gold transition-all duration-500 group-hover/row:bottom-2.5 group-hover/row:left-2.5" />
        <span className="absolute right-4 bottom-4 size-10 border-r-2 border-b-2 border-gold transition-all duration-500 group-hover/row:right-2.5 group-hover/row:bottom-2.5" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-green"
      style={{
        backgroundImage:
          "repeating-linear-gradient(104deg, rgb(255 255 255 / 0.12) 0 2px, transparent 2px 2rem)",
      }}
    />
  );
}
