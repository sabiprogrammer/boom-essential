import Image from "next/image";
import type { SitePhoto } from "@/content/site-photo";
import { PhotoLightbox } from "./PhotoLightbox";

type PhotoFigureProps = {
  photo: SitePhoto;
  sizes: string;
  /** CSS aspect-ratio value. When set the photo fills a fixed frame (cropped by object-fit); otherwise it keeps its own proportions. */
  aspect?: string;
  /** CSS object-position used with `aspect` to choose what stays in view. */
  position?: string;
  /** "contain" shows the whole picture on white (for product shots on a white background); "cover" fills the frame. */
  fit?: "cover" | "contain";
  showCaption?: boolean;
  /** Text shown before the caption, e.g. "Product image" for pictures that are not installations. */
  note?: string;
  surface?: "light" | "dark";
  priority?: boolean;
  /** Click to enlarge (on by default). The picture also wipes in on scroll and eases closer on hover: see app/image-motion.css. */
  zoomable?: boolean;
  className?: string;
};

/**
 * One authentic client photograph with an honest alt text and a short factual caption. Used for installations,
 * products and machines. Illustrative imagery uses `IllustrativePhoto` instead; keep the two apart.
 */
export function PhotoFigure({
  photo,
  sizes,
  aspect,
  position = "50% 50%",
  fit = "cover",
  showCaption = true,
  note,
  surface = "light",
  priority = false,
  zoomable = true,
  className = "",
}: PhotoFigureProps) {
  const muted = surface === "dark" ? "text-on-dark-muted" : "text-ink-muted";

  return (
    <figure className={className}>
      {aspect ? (
        <div data-pic className={`relative overflow-hidden border-t-[3px] border-gold ${fit === "contain" ? "bg-white" : "bg-tint"}`} style={{ aspectRatio: aspect }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={fit === "contain" ? "object-contain" : "object-cover"}
            style={{ objectPosition: position }}
          />
          {zoomable ? <PhotoLightbox photo={photo} /> : null}
        </div>
      ) : (
        <div data-pic className="overflow-hidden border-t-[3px] border-gold bg-tint">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full"
          />
          {zoomable ? <PhotoLightbox photo={photo} /> : null}
        </div>
      )}
      {showCaption ? (
        <figcaption className={`mt-3 text-sm ${muted}`}>
          {note ? <span className="mr-2 font-heading text-xs font-bold tracking-[0.12em] uppercase">{note}</span> : null}
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
