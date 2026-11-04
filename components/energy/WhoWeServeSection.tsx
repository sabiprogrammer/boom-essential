import type { CSSProperties } from "react";
import { energyAudiences, energyContent } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnergyIcon } from "./EnergyIcon";

/** Residential, commercial and institutional: three hairline-divided columns with large gold line glyphs. */
export function WhoWeServeSection() {
  const { eyebrow, heading, lead } = energyContent.audiences;

  return (
    <Section tone="navy" space="lg" id="who-we-serve" aria-labelledby="energy-audiences-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="energy-audiences-heading" surface="dark" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ul className="mt-14 grid lg:mt-20 lg:grid-cols-3">
          {energyAudiences.map((audience, index) => (
            <li
              key={audience.id}
              className={`reveal border-t-2 border-gold py-10 lg:py-12 ${
                index === 0 ? "lg:pr-10" : "lg:border-l lg:border-l-line-on-dark lg:px-10"
              }`}
              style={{ "--i": index } as CSSProperties}
            >
              <EnergyIcon name={audience.icon} className="size-16 text-gold" strokeWidth={1.1} />
              <h3 className="mt-8 text-h2 font-extrabold tracking-wide text-white uppercase">{audience.label}</h3>
              <p className="mt-3 text-lead text-white">{audience.includes}</p>

              <div className="mt-8 border-t border-line-on-dark pt-6">
                <p className="font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">
                  How energy needs differ
                </p>
                <p className="mt-3 text-body text-on-dark-muted">{audience.needs}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
