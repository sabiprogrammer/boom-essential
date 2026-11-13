import Image from "next/image";
import type { SitePhoto } from "@/content/site-photo";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";

/**
 * One of the client's own installation photographs, filling the frame that `ServiceFeature` provides (the frame
 * crops it; `position` chooses what stays in view). The alt text describes only what is visible.
 */
export function ServicePhoto({ photo, position = "50% 50%" }: { photo: SitePhoto; position?: string }) {
  return (
    <div data-pic className="relative size-full">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 1024px) 40vw, 92vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <PhotoLightbox photo={photo} />
    </div>
  );
}
