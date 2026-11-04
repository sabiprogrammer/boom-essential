import type { CSSProperties } from "react";
import { energyContent, energyServices } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { EnergyIcon } from "./EnergyIcon";

/**
 * Maintenance and upgrades as two staggered columns, then the two property-type services as a ruled
 * index that leads into the "Who we serve" section.
 */
export function SustainBand() {
  const [maintenance, upgrades, residential, commercial] = energyServices.slice(5);
  const featured = [maintenance, upgrades];
  const byType = [residential, commercial];
  const { groups } = energyContent.services;

  return (
    <Section tone="tint" space="lg" aria-labelledby="energy-sustain-heading">
      <Container>
        <div className="reveal">
          <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            Services 06 and 07
          </p>
          <h3 id="energy-sustain-heading" className="text-h2 font-extrabold text-navy">
            {groups.sustain}
          </h3>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          {featured.map((service, index) => (
            <article
              key={service.number}
              aria-labelledby={`service-${service.number}`}
              className={`reveal border-t-2 border-navy pt-8 ${index === 0 ? "lg:col-span-5" : "lg:col-span-7 lg:mt-20"}`}
              style={{ "--i": index } as CSSProperties}
            >
              <div className="flex items-center justify-between text-navy">
                <EnergyIcon name={service.icon} className="size-14" strokeWidth={1.25} />
                <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em]">
                  {service.number}
                </span>
              </div>
              <h4 id={`service-${service.number}`} className="mt-8 text-h2 font-extrabold text-navy">
                {service.title}
              </h4>
              <p className="mt-4 max-w-lg text-lead text-ink-muted">{service.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 lg:mt-28">
          <h3 className="reveal font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
            Services 08 and 09 &middot; {groups.propertyType}
          </h3>
          <ul className="mt-6 border-t-2 border-navy">
            {byType.map((service, index) => (
              <li
                key={service.number}
                className="reveal grid items-start gap-x-8 gap-y-3 border-b border-line-strong py-8 md:grid-cols-[5rem_1fr] lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="flex items-center gap-4 text-navy">
                  <EnergyIcon name={service.icon} className="size-9" />
                  <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] md:hidden">
                    {service.number}
                  </span>
                </div>
                <h4 className="text-h3 font-extrabold text-navy">{service.title}</h4>
                <p className="text-body text-ink-muted md:col-start-2 lg:col-start-3">{service.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <TextLink href="#who-we-serve" arrow>
              See who we serve
            </TextLink>
          </p>
        </div>
      </Container>
    </Section>
  );
}
