import Image from "next/image";
import { industrialContent } from "@/content/industrial-equipment";

type ProductMediaProps = {
  /** Aspect ratio of the frame, as a CSS aspect-ratio value. */
  aspect: string;
  sizes: string;
  /** Adds a solid gold block offset behind the frame (the hero plinth). It sits behind the frame only. */
  plinth?: boolean;
  className?: string;
};

/**
 * A framed product slot showing the client's own photograph of the pounding machines
 * (`industrialContent.productImage`). Always a photograph: there is no drawing fallback.
 */
export function ProductMedia({ aspect, sizes, plinth = false, className = "" }: ProductMediaProps) {
  const image = industrialContent.productImage;

  return (
    <figure className={className}>
      <div className="relative">
        {plinth ? <span aria-hidden="true" className="absolute -right-3 -bottom-3 size-full bg-gold sm:-right-4 sm:-bottom-4" /> : null}
        <div className="relative overflow-hidden border-t-[3px] border-gold bg-navy" style={{ aspectRatio: aspect }}>
          <Image src={image.src} alt={image.alt} fill priority sizes={sizes} className="object-cover" />
        </div>
      </div>
    </figure>
  );
}
