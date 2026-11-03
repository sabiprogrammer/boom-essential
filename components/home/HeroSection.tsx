import type { CSSProperties } from "react";
import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { HeroBars } from "./HeroBars";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Homepage hero: asymmetric editorial composition on Deep Navy. Headline and copy on the left;
 * the three principal areas as rising bars standing on the section's baseline on the right.
 */
export function HeroSection() {
  return (
    <section
      data-surface="dark"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-navy pt-14 text-white sm:pt-20 lg:pt-20"
    >
      <Container>
        <div className="grid items-end gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="pb-0 lg:col-span-7 lg:pb-24">
            <p className="rise flex items-center gap-3 font-heading text-xs font-bold tracking-[0.18em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="h-0.5 w-10 shrink-0 bg-gold" />
              {company.tagline}
            </p>

            <h1
              id="hero-heading"
              className="rise mt-7 text-h1 leading-[1.04] font-extrabold text-white sm:text-[clamp(2.75rem,1.2rem+4.4vw,4.5rem)] lg:text-[clamp(3rem,0.8rem+4.4vw,5.25rem)]"
              style={delay(120)}
            >
              Practical Solutions for a <span className="text-gold">Better Tomorrow.</span>
            </h1>

            <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
              From dependable solar power and integrated security solutions to quality food and agricultural
              products, BOOM MULTI GLOBAL provides practical solutions for homes, businesses and institutions.
            </p>

            <div className="rise mt-10 flex flex-col gap-4 sm:flex-row" style={delay(400)}>
              <ButtonLink href="#divisions" surface="dark" size="lg" arrow>
                Explore Our Solutions
              </ButtonLink>
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                Talk to Our Team
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroBars />
          </div>
        </div>
      </Container>
    </section>
  );
}
