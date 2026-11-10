import type { CSSProperties } from "react";
import { industrialContent, industrialEnquiryHref } from "@/content/industrial-equipment";
import { productPhotos } from "@/content/product-photos";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { Section } from "@/components/ui/Section";

/**
 * Available options on Deep Navy: the explanation and an enquiry action beside the client's photographs of a
 * smaller and a larger pounding machine. No sizes, capacities or specifications: the goal is to start a conversation.
 */
export function OptionsSection() {
  const { eyebrow, heading, copy, smaller, larger, cta } = industrialContent.options;

  return (
    <Section tone="navy" space="lg" aria-labelledby="industrial-options-heading">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-5">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="industrial-options-heading" className="text-h1 font-extrabold text-balance text-white">
              {heading}
            </h2>
            <p className="mt-6 text-lead text-on-dark-muted">{copy}</p>
            <div className="mt-9">
              <ButtonLink href={industrialEnquiryHref()} surface="dark" size="lg" arrow>
                {cta}
              </ButtonLink>
            </div>
          </div>

          <div className="reveal lg:col-span-7" style={{ "--i": 1 } as CSSProperties}>
            <div className="grid items-end gap-8 sm:grid-cols-2">
              <div>
                <p className="mb-3 font-heading text-sm font-bold tracking-[0.12em] text-on-dark-muted uppercase">{smaller}</p>
                <PhotoFigure
                  photo={productPhotos.poundingMachinesSmall}
                  aspect="4 / 3"
                  surface="dark"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                />
              </div>
              <div>
                <p className="mb-3 font-heading text-sm font-bold tracking-[0.12em] text-on-dark-muted uppercase">{larger}</p>
                <PhotoFigure
                  photo={productPhotos.poundingMachine}
                  aspect="4 / 5"
                  surface="dark"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
