import Image from "next/image";
import type { CSSProperties } from "react";
import type { GalleryTile, TileSpan } from "./gallery-layout";

/** Full class names, written out so Tailwind can see them (it cannot build class names from variables). */
const spanClass: Record<TileSpan, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  8: "lg:col-span-8",
  12: "lg:col-span-12",
};

/**
 * One photograph in the gallery grid. The frame's shape depends on the screen:
 *  - phones: the photograph's own proportions, so nothing is cropped;
 *  - tablets (two columns): an even square;
 *  - desktop: the row's anchor tile has the row's aspect ratio and the others stretch to the same height.
 * The caption is the tile's number and one factual line, side by side, in a block reserved for two lines so a longer
 * caption never makes its picture shorter than its neighbours' (from tablet width up).
 */
export function ProjectTile({ tile, total }: { tile: GalleryTile; total: number }) {
  const { photo, index, span, anchor, rowAspect } = tile;
  const frameStyle = {
    "--natural": `${photo.width} / ${photo.height}`,
    "--row": rowAspect,
  } as CSSProperties;

  return (
    <li
      className={`reveal flex flex-col ${spanClass[span]}`}
      style={{ "--i": index % 3 } as CSSProperties}
    >
      <figure className="flex flex-1 flex-col">
        <div
          style={frameStyle}
          className={`relative aspect-(--natural) overflow-hidden border-t-[3px] border-gold bg-tint sm:aspect-square ${
            anchor ? "lg:aspect-(--row)" : "lg:min-h-0 lg:flex-1 lg:aspect-auto"
          }`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={`(min-width: 1024px) ${Math.round((span / 12) * 100)}vw, (min-width: 640px) 46vw, 92vw`}
            priority={index === 0}
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 flex items-baseline gap-3 text-sm text-ink-muted sm:min-h-[2lh]">
          <span aria-hidden="true" className="font-heading text-xs font-bold tracking-[0.16em] text-navy tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="sr-only">
              Photograph {index + 1} of {total}.{" "}
            </span>
            {photo.caption}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}
