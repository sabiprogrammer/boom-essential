import Image from "next/image";
import { divisionImages } from "@/content/division-images";

/**
 * The homepage's illustrative Foods picture, reused above the Foods catalogue entries and on the Foods page. It shows no
 * BOOM product and carries no label. Replace with authentic photographs when supplied.
 * The 3.7:1 frame, anchored to the bottom, trims the white strip along the file's top edge.
 */
export function FoodsIllustration() {
  const image = divisionImages.foods;
  if (!image) return null;

  return (
    <div data-pic className="relative mt-10 overflow-hidden border-t-[3px] border-gold" style={{ aspectRatio: "3.7 / 1" }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1280px) 1200px, 92vw"
        className="object-cover"
        style={{ objectPosition: "50% 100%" }}
      />
    </div>
  );
}
