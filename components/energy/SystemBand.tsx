import type { CSSProperties } from "react";
import { energyContent, energyServices } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EnergyIcon } from "./EnergyIcon";

/** Installation, inverter and battery storage: the working system, joined by a dashed flow line. */
export function SystemBand() {
  const items = energyServices.slice(2, 5);

  return (
    <Section tone="charcoal" space="md"aria-labelledby="energy-system-heading">
      <Container>
        <div className="reveal">
          <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
            Services 03 to 05
          </p>
          <h3 id="energy-system-heading" className="text-h2 font-extrabold text-white">
            {energyContent.services.groups.system}
          </h3>
        </div>

        <ol className="relative mt-14 grid gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-x-12">
          <span
            aria-hidden="true"
            className="absolute top-10 right-[calc(33.333%-4.5rem)] left-10 hidden border-t border-dashed border-gold/60 lg:block"
          />
          {items.map((service, index) => (
            <li
              key={service.number}
              className="reveal relative border-t border-line-on-dark pt-8 lg:border-t-0 lg:pt-0"
              style={{ "--i": index } as CSSProperties}
            >
              <div className="relative grid size-20 place-items-center border border-gold bg-charcoal text-gold">
                <EnergyIcon name={service.icon} className="size-9" />
              </div>
              <p aria-hidden="true" className="mt-8 font-heading text-sm font-bold tracking-[0.16em] text-on-dark-muted">
                {service.number}
              </p>
              <h4 className="mt-2 text-h3 font-extrabold text-white">{service.title}</h4>
              <p className="mt-4 max-w-sm text-body text-on-dark-muted">{service.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
