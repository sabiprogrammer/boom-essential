import Image from "next/image";
import type { IllustrativeImage } from "@/content/illustrative-image";
import { IllustrativeLabel } from "@/components/home/IllustrativeLabel";

type IllustrativePhotoProps = {
  image: IllustrativeImage;
  sizes: string;
  /** CSS aspect-ratio of the frame. The picture covers it, so a different ratio crops the edges. */
  aspect?: string;
  className?: string;
};

/**
 * A stock photograph shown as an illustration: the "Illustrative image" label sits on the picture itself, so it
 * can never be shown without it. Fills a frame of the given aspect ratio. Authentic client photographs use
 * `PhotoFigure` instead; the two are deliberately separate so one can never pass for the other.
 */
export function IllustrativePhoto({ image, sizes, aspect = "5 / 3", className = "" }: IllustrativePhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-tint ${className}`} style={{ aspectRatio: aspect }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: image.position ?? "50% 50%" }}
      />
      <IllustrativeLabel className="top-3 left-3" />
    </div>
  );
}
