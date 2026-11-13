import Image from "next/image";
import type { CSSProperties } from "react";
import { productPhotos } from "@/content/product-photos";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { Section } from "@/components/ui/Section";

/**
 * Industrial Equipment: an additional offering, not a fourth division. Deliberately smaller in scale
 * and lighter in treatment than the divisions. No specifications or capacities (none supplied).
 */
export function IndustrialEquipmentSection() {
  const machines = productPhotos.poundingMachinesSmall;

  return (
    <Section tone="tint" space="sm" aria-labelledby="industrial-heading">
      <Container>
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-x-14">
          <div className="reveal lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              Additional offering
            </p>
            <h2 id="industrial-heading" className="text-h2 font-extrabold">
              Industrial Equipment
            </h2>
            <p className="mt-5 max-w-xl text-lead text-charcoal">
              We supply pounding machines in different sizes for the restaurant business. Contact our team to
              discuss available options and your equipment requirements.
            </p>
            <div className="mt-8">
              <ButtonLink href="/industrial-equipment" variant="secondary" arrow>
                Explore Industrial Equipment
              </ButtonLink>
            </div>
          </div>

          <div className="reveal lg:col-span-5" style={{ "--i": 1 } as CSSProperties}>
            <figure className="relative flex h-full flex-col border-l-[3px] border-navy bg-white">
              <span aria-hidden="true" className="absolute top-0 right-0 z-10 h-10 w-10 border-t-2 border-r-2 border-gold" />
              {/* The client's own photograph of the machines (flyer banner and price cropped out). */}
              <div data-pic className="relative aspect-[5/4] overflow-hidden bg-tint lg:aspect-auto lg:min-h-64 lg:flex-1">
                <Image
                  src={machines.src}
                  alt={machines.alt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 55%" }}
                />
                <PhotoLightbox photo={machines} />
              </div>
              <figcaption className="p-6 sm:p-7">
                <span className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">Supplied</span>
                <span className="mt-1.5 block font-heading text-h3 leading-tight font-extrabold text-navy">Pounding machines</span>
                <span className="mt-2 block text-base text-ink-muted">For the restaurant business.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </Section>
  );
}
