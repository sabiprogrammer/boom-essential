import { aboutContent } from "@/content/about";
import { divisions } from "@/content/divisions";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { DivisionPanel } from "./DivisionPanel";

/**
 * The three principal divisions as a full-bleed triptych. Industrial Equipment follows as a quiet,
 * clearly separate note: an additional offering, never a fourth panel.
 */
export function AboutDivisionsSection() {
  const { eyebrow, heading, lead, industrial } = aboutContent.divisions;

  return (
    <Section tone="white" space="lg" aria-labelledby="about-divisions-heading" className="pb-0 lg:pb-0">
      <Container>
        <div className="reveal">
          <SectionHeading id="about-divisions-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>
      </Container>

      <div className="mt-14 grid lg:mt-20 lg:grid-cols-3">
        {divisions.map((division, index) => (
          <DivisionPanel key={division.id} division={division} index={index} />
        ))}
      </div>

      <Container>
        <div className="reveal flex flex-col gap-3 py-10 sm:flex-row sm:items-baseline sm:gap-10 lg:py-14">
          <p className="shrink-0 font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">
            {industrial.label}
          </p>
          <p className="max-w-2xl text-body text-charcoal">
            {industrial.text}{" "}
            <TextLink href={industrial.href} arrow className="whitespace-nowrap">
              {industrial.cta}
            </TextLink>
          </p>
        </div>
      </Container>
    </Section>
  );
}
