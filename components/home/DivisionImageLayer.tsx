import Image from "next/image";
import type { DivisionImage } from "@/content/division-images";
import type { DivisionId } from "@/content/divisions";
import { DivisionGeometry } from "./DivisionGeometry";

const SIZES = "(min-width: 1024px) 45vw, 100vw";

/** Offsets that push the picture beyond the clipped panel so a baked-in edge artefact is cropped out. */
function trimInset(trim: DivisionImage["trim"]) {
  if (!trim) return undefined;
  const { top = 0, right = 0, bottom = 0, left = 0 } = trim;
  return { inset: `${-top}% ${-right}% ${-bottom}% ${-left}%` };
}

/**
 * The picture inside a division panel.
 * "cover" fills the panel and crops, steered by `position`.
 * "band" keeps a panoramic picture whole at its own aspect ratio on top of the generated field, so
 * no subject is cropped away.
 */
export function DivisionImageLayer({ id, image }: { id: DivisionId; image: DivisionImage }) {
  if (image.fit === "band") {
    return (
      <>
        <DivisionGeometry id={id} />
        <div className="relative w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute" style={trimInset(image.trim) ?? { inset: 0 }}>
              <Image src={image.src} alt={image.alt} fill sizes={SIZES} className="object-cover" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute" style={trimInset(image.trim) ?? { inset: 0 }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={SIZES}
          style={{ objectPosition: image.position }}
          className="object-cover transition-transform duration-700 ease-(--ease-standard) motion-safe:group-hover/row:scale-105"
        />
      </div>
      {/* Keeps the white number and name legible over light parts of the picture. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-navy/80 to-transparent" />
    </>
  );
}
