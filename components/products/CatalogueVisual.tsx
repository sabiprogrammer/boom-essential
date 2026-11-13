import type { CatalogueVisual as CatalogueVisualData } from "@/content/product-catalogue";
import { IllustrativePhoto } from "@/components/ui/IllustrativePhoto";
import { PhotoFigure } from "@/components/ui/PhotoFigure";

const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

/** The picture for one catalogue entry: an authentic client photograph, or an illustrative picture. */
export function CatalogueVisual({ visual }: { visual: CatalogueVisualData }) {
  if (visual.kind === "photo") {
    return (
      <PhotoFigure
        photo={visual.photo}
        note={visual.note}
        fit={visual.fit}
        aspect="4 / 3"
        showCaption={Boolean(visual.note)}
        sizes={SIZES}
      />
    );
  }

  return (
    <div className="border-t-[3px] border-gold">
      <IllustrativePhoto image={visual.image} aspect="4 / 3" sizes={SIZES} />
    </div>
  );
}
