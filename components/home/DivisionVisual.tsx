import type { Division } from "@/content/divisions";
import type { DivisionImage } from "@/content/division-images";
import { DivisionGeometry } from "./DivisionGeometry";
import { DivisionImageLayer } from "./DivisionImageLayer";

type DivisionVisualProps = {
  division: Division;
  /**
   * Picture for this division (see `content/division-images.ts`). Without one, the CSS-generated field
   * is shown.
   */
  image?: DivisionImage;
};

/** The visual panel of a division row: image (or generated field) with number and name overlaid. */
export function DivisionVisual({ division, image }: DivisionVisualProps) {
  // A whole panoramic picture is short, so its panel is shorter too; otherwise the field outweighs it.
  const height =
    image?.fit === "band" ? "min-h-[14rem] sm:min-h-[16rem] lg:min-h-[19rem]" : "min-h-[18rem] sm:min-h-[22rem] lg:min-h-[30rem]";

  return (
    <div className={`relative isolate overflow-hidden border-t-[3px] border-gold ${height}`}>
      {image ? <DivisionImageLayer id={division.id} image={image} /> : <DivisionGeometry id={division.id} />}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
        <span aria-hidden="true" className="font-heading text-display leading-none font-extrabold">
          {division.number}
        </span>
        <span className="text-right font-heading text-sm font-bold tracking-[0.16em] uppercase">
          {division.name}
        </span>
      </div>
    </div>
  );
}
