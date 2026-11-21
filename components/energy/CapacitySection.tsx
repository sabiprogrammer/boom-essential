import type { CSSProperties } from "react";
import { energyContent } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The client's own capacity statement (company profile, 2026-11-21): the range it states, what it reaches, and the
 * four kinds of customer it names. No other figure, size or performance claim appears here.
 */
export function CapacitySection() {
  const { eyebrow, heading, range, reach, audiencesLabel, audiences } = energyContent.capacity;

  return (
    <Section tone="tint" space="lg" aria-labelledby="energy-capacity-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal space-y-6 lg:col-span-7">
            <SectionHeading id="energy-capacity-heading" eyebrow={eyebrow} title={heading} />
            <p className="font-heading text-h3 leading-snug font-semibold text-navy lg:text-[1.75rem]">{range}</p>
            <p className="text-lead text-charcoal">{reach}</p>
          </div>

          <div className="reveal lg:col-span-5 lg:pt-12" style={{ "--i": 1 } as CSSProperties}>
            <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{audiencesLabel}</p>
            <ul className="mt-4 border-t-2 border-navy">
              {audiences.map((audience) => (
                <li key={audience} className="border-b border-line py-4 font-semibold text-navy">
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
