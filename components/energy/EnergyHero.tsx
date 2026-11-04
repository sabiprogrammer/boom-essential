import type { CSSProperties } from "react";
import { energyContent, solarAssessmentHref } from "@/content/energy";
import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SolarGraphic } from "./SolarGraphic";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * BOOM Energy hero on Deep Navy. Text on the left. The artwork is anchored to the section's bottom
 * and right edges (full bleed): a sun rises on the hero's own bottom edge behind a tilted solar array,
 * so the horizon of the artwork is the edge of the hero.
 */
export function EnergyHero() {
  const { eyebrow, headline, copy, primaryCta, secondaryCta } = energyContent.hero;

  return (
    <section
      data-surface="dark"
      aria-labelledby="energy-heading"
      className="relative isolate overflow-hidden bg-navy pt-14 text-white sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="lg:w-[56%] lg:pb-28">
          <p className="rise flex items-start gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase" style={delay(0)}>
            <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-10 shrink-0 bg-gold" />
            {eyebrow}
          </p>

          <h1
            id="energy-heading"
            className="rise mt-7 text-[clamp(2.5rem,1rem+4.6vw,4.75rem)] leading-[1.04] font-extrabold text-white"
            style={delay(120)}
          >
            <span className="block">{headline[0]}</span> <span className="block text-gold">{headline[1]}</span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
            {copy}
          </p>

          <div className="rise mt-10 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start xl:flex-row" style={delay(400)}>
            <ButtonLink href={solarAssessmentHref} surface="dark" size="lg" arrow>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
              {secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none mt-12 lg:absolute lg:right-0 lg:bottom-0 lg:z-[-1] lg:mt-0 lg:w-[46%] xl:w-[56%]">
        <SolarGraphic className="block h-auto w-full" />
      </div>
    </section>
  );
}
