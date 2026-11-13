import type { CSSProperties } from "react";
import { productsLink } from "@/content/navigation";
import { productPhotos } from "@/content/product-photos";
import { securityContent } from "@/content/security";
import { securitySceneImages } from "@/content/security-scene-images";
import { Container } from "@/components/ui/Container";
import { IllustrativePhoto } from "@/components/ui/IllustrativePhoto";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

const pictures = {
  dome: securitySceneImages.equipmentDome,
  monitoring: securitySceneImages.equipmentMonitoring,
} as const;

/**
 * CCTV equipment in view: the client's camera product image beside two illustrative pictures of equipment in use.
 * The photograph is a product image, not an installation, and says so; the other two carry the "Illustrative image" label.
 */
export function SecurityEquipmentSection() {
  const { eyebrow, heading, lead, photoNote, picturesLabel, picturesNote, pictures: items, cta } = securityContent.equipment;

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
            <ul aria-label={picturesLabel} className="grid gap-8 lg:gap-10">
              {items.map((item, index) => (
                <li key={item.id} className="reveal" style={{ "--i": index } as CSSProperties}>
                  <IllustrativePhoto
                    image={pictures[item.id]}
                    aspect="16 / 9"
                    sizes="(min-width: 1024px) 55vw, 92vw"
                    className="border-t-[3px] border-gold"
                  />
                  <p className="mt-3 font-heading text-base font-bold text-navy">{item.label}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-muted">{picturesNote}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
