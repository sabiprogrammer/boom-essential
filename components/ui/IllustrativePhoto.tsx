import Image from "next/image";
import type { IllustrativeImageBase } from "@/content/illustrative-image";

type IllustrativePhotoProps = {
  image: IllustrativeImageBase;
  sizes: string;
  /** CSS aspect-ratio of the frame. The picture covers it, so a different ratio crops the edges. */
  aspect?: string;
  /** Preload: only for the picture at the top of a page. */
  priority?: boolean;
  className?: string;
};

/**
 * A stock photograph or generated scene picture, filling a frame of the given aspect ratio. It shows no label (removed at
 * Sabi Programmers' request, 2026-11-13), so its alt text must describe only what is visible and never claim the scene as BOOM's,
 * and it must never be used on the Projects page. Authentic client photographs use `PhotoFigure` instead; the two stay separate
 * components so the difference between them is always visible in the code.
 */
export function IllustrativePhoto({ image, sizes, aspect = "5 / 3", priority = false, className = "" }: IllustrativePhotoProps) {
  return (
    <div data-pic className={`relative overflow-hidden bg-tint ${className}`} style={{ aspectRatio: aspect }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: image.position ?? "50% 50%" }}
      />
    </div>
  );
}
