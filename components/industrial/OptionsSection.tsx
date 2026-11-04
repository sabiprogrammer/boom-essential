import type { CSSProperties } from "react";
import { industrialContent, industrialEnquiryHref } from "@/content/industrial-equipment";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SizeRangeDrawing } from "./SizeRangeDrawing";

/**
 * Available options on Deep Navy: the explanation and an enquiry action beside a size-range drawing.
 * No product catalogue, no sizes, no specifications: the goal is to start a conversation.
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
            <div className="border-t-[3px] border-gold bg-charcoal p-6 sm:p-10">
              <SizeRangeDrawing className="block h-auto w-full" />
              <div aria-hidden="true" className="mt-3 flex justify-between font-heading text-sm font-bold tracking-[0.12em] text-on-dark-muted uppercase">
                <span>{smaller}</span>
                <span>{larger}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
