import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/**
 * Industrial Equipment: an additional offering, not a fourth division. Deliberately smaller in scale
 * and lighter in treatment than the divisions. No specifications or capacities (none supplied).
 */
export function IndustrialEquipmentSection() {
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
              Alongside its three principal divisions, BOOM MULTI GLOBAL supplies industrial food-processing
              equipment, including pounding machines for restaurants and food-processing businesses.
            </p>
            <div className="mt-8">
              <ButtonLink href="/industrial-equipment" variant="secondary" arrow>
                Explore Industrial Equipment
              </ButtonLink>
            </div>
          </div>

          <div className="reveal lg:col-span-5" style={{ "--i": 1 } as CSSProperties}>
            <div className="relative flex h-full min-h-48 flex-col justify-end border-l-[3px] border-navy bg-white p-7 sm:p-9">
              <span aria-hidden="true" className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-gold" />
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">Supplied</p>
              <p className="mt-2 font-heading text-h2 leading-tight font-extrabold text-navy">Pounding machines</p>
              <p className="mt-3 text-base text-ink-muted">For restaurants and food-processing businesses.</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
