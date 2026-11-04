import Image from "next/image";
import type { ReactNode } from "react";
import { industrialContent } from "@/content/industrial-equipment";

type ProductMediaProps = {
  /** Aspect ratio of the frame, as a CSS aspect-ratio value. */
  aspect: string;
  /** The illustrative drawing shown until an authentic photograph exists. */
  drawing: ReactNode;
  /** Short note shown under the drawing. Omitted when a real photograph replaces it. */
  drawingNote?: string;
  sizes: string;
  /** Adds a solid gold block offset behind the frame (the hero plinth). It sits behind the frame only, never the caption. */
  plinth?: boolean;
  className?: string;
};

/**
 * A framed product slot. With no photograph configured it shows the illustrative drawing and its
 * "illustrative" note. Once `industrialContent.productImage` is set to an authentic, approved photograph,
 * the photograph replaces the drawing and the note disappears. No other change is needed.
 */
export function ProductMedia({ aspect, drawing, drawingNote, sizes, plinth = false, className = "" }: ProductMediaProps) {
  const image = industrialContent.productImage;

  return (
    <figure className={className}>
      <div className="relative">
        {plinth ? <span aria-hidden="true" className="absolute -right-3 -bottom-3 size-full bg-gold sm:-right-4 sm:-bottom-4" /> : null}
        <div className="relative overflow-hidden border-t-[3px] border-gold bg-navy" style={{ aspectRatio: aspect }}>
          {image ? (
            <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
          ) : (
            drawing
          )}
        </div>
      </div>
      {!image && drawingNote ? <figcaption className="mt-3 text-sm text-on-dark-muted">{drawingNote}</figcaption> : null}
    </figure>
  );
}
