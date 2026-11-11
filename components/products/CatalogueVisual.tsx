import { catalogueIllustrativeNote, type CatalogueVisual as CatalogueVisualData } from "@/content/product-catalogue";
import { RecorderDrawing } from "@/components/security/RecorderDrawing";
import { SignalDiagram } from "@/components/security/SignalDiagram";
import { IllustrativePhoto } from "@/components/ui/IllustrativePhoto";
import { PhotoFigure } from "@/components/ui/PhotoFigure";

const drawings = {
  recorder: RecorderDrawing,
  signal: SignalDiagram,
} as const;

/** The picture for one catalogue entry: an authentic client photograph, or an illustration (drawing or stock photograph) that says so. */
export function CatalogueVisual({ visual }: { visual: CatalogueVisualData }) {
  if (visual.kind === "photo") {
    return (
      <PhotoFigure
        photo={visual.photo}
        note={visual.note}
        fit={visual.fit}
        aspect="4 / 3"
        showCaption={Boolean(visual.note)}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
      />
    );
  }

  if (visual.kind === "illustrative") {
    return (
      <figure>
        <div className="border-t-[3px] border-gold">
          <IllustrativePhoto image={visual.image} aspect="4 / 3" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" />
        </div>
        <figcaption className="mt-3 text-sm text-ink-muted">{visual.image.caption}</figcaption>
      </figure>
    );
  }

  const Drawing = drawings[visual.drawing];
  return (
    <figure>
      <div className="aspect-[4/3] overflow-hidden border-t-[3px] border-gold">
        <Drawing className="size-full object-cover" />
      </div>
      <figcaption className="mt-3 text-sm text-ink-muted">{catalogueIllustrativeNote}</figcaption>
    </figure>
  );
}
