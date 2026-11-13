import type { CSSProperties } from "react";
import { foodProducts, foodsContent, foodsEnquiryHref } from "@/content/foods";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { fieldStripes } from "./field-stripes";
import { GrainField } from "./GrainField";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * BOOM Foods hero on Warm White: oversized headline, the supplied statement and a ruled index of the
 * seven products on the left; an Agricultural Green field panel with stalks of grain on the right, which starts
 * below the (transparent) header so the navigation stays readable on Warm White.
 */
export function FoodsHero() {
  const { eyebrow, headline, copy, statement, primaryCta, secondaryCta, indexLabel } = foodsContent.hero;

  return (
    <section
      aria-labelledby="foods-heading"
      data-header-top="light"
      className="relative isolate overflow-hidden bg-warm-white pt-14 sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="lg:w-[56%] lg:pb-24">
          <p
            className="rise flex items-start gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase"
            style={delay(0)}
          >
            <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-10 shrink-0 bg-gold" />
            {eyebrow}
          </p>

          <h1
            id="foods-heading"
            className="rise mt-7 text-[clamp(2.75rem,1rem+5.4vw,5.5rem)] leading-[1.02] font-extrabold text-navy"
            style={delay(120)}
          >
            <span className="block">{headline[0]}</span> <span className="block text-green">{headline[1]}</span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lead text-charcoal" style={delay(260)}>
            {copy}
          </p>
          <p className="rise mt-5 max-w-xl border-l-4 border-gold pl-5 font-heading text-lg font-bold text-green" style={delay(340)}>
            {statement}
          </p>

          <div className="rise mt-10 flex flex-col gap-4 sm:flex-row" style={delay(440)}>
            <ButtonLink href={foodsEnquiryHref()} size="lg" arrow>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href="#household-staples" variant="secondary" size="lg">
              {secondaryCta}
            </ButtonLink>
          </div>

          <div className="rise mt-12 border-t border-line-strong pt-5" style={delay(540)}>
            <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{indexLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-y-1.5 font-heading text-base font-bold text-navy">
              {foodProducts.map((product) => (
                <li
                  key={product.slug}
                  className="flex items-center gap-2 pr-6 before:size-1.5 before:shrink-0 before:bg-gold before:content-['']"
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="relative mt-14 h-[26rem] overflow-hidden bg-green sm:h-[30rem] lg:absolute lg:top-(--header-height) lg:right-0 lg:bottom-0 lg:z-[-1] lg:mt-0 lg:h-auto lg:w-[40%]"
        style={fieldStripes(0.12)}
      >
        <span className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />
        <GrainField className="absolute inset-0 size-full" />
      </div>
    </section>
  );
}
