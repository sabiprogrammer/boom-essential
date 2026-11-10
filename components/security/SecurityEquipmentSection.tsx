import type { CSSProperties } from "react";
import { productsLink } from "@/content/navigation";
import { productPhotos } from "@/content/product-photos";
import { securityContent } from "@/content/security";
import { Container } from "@/components/ui/Container";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { BulletCameraDrawing } from "./BulletCameraDrawing";
import { DomeCameraDrawing } from "./DomeCameraDrawing";
import { RecorderDrawing } from "./RecorderDrawing";

const drawings = {
  dome: DomeCameraDrawing,
  bullet: BulletCameraDrawing,
  recorder: RecorderDrawing,
} as const;

/**
 * CCTV equipment in view: the client's camera product image beside three drawings of common equipment types.
 * The photograph is a product image, not an installation, and says so; the drawings are labelled illustrative.
 */
export function SecurityEquipmentSection() {
  const { eyebrow, heading, lead, photoNote, drawingsLabel, drawingsNote, drawings: items, cta } = securityContent.equipment;

  return (
    <Section tone="light" space="lg" aria-labelledby="security-equipment-heading">
      <Container>
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12 lg:items-start">
          <div className="reveal lg:col-span-5">
            <SectionHeading id="security-equipment-heading" eyebrow={eyebrow} title={heading} lead={lead} />
            <PhotoFigure
              photo={productPhotos.ptzCamera}
              note={photoNote}
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="mt-10 max-w-md"
            />
            <p className="mt-8">
              <TextLink href={productsLink.href} arrow>
                {cta}
              </TextLink>
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul aria-label={drawingsLabel} className="grid gap-8 sm:grid-cols-2 lg:gap-10">
              {items.map((item, index) => {
                const Drawing = drawings[item.id];
                return (
                  <li
                    key={item.id}
                    className={`reveal ${index === 2 ? "sm:col-span-2" : ""}`}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <div className="aspect-[5/3] overflow-hidden border-t-[3px] border-gold">
                      <Drawing className="size-full" />
                    </div>
                    <p className="mt-3 font-heading text-base font-bold text-navy">{item.label}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-ink-muted">{drawingsNote}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
