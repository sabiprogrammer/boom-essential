import { divisions } from "@/content/divisions";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DivisionRow } from "./DivisionRow";

/** The three principal business divisions (target of the hero's "Explore Our Solutions" button). */
export function DivisionsSection() {
  return (
    <Section id="divisions" tone="white" aria-labelledby="divisions-heading">
      <Container>
        <div className="reveal">
          <SectionHeading
            id="divisions-heading"
            eyebrow="Our divisions"
            title="Three Principal Business Divisions"
            lead="Energy, security and food supply, brought together under one company."
          />
        </div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
          {divisions.map((division, index) => (
            <DivisionRow key={division.id} division={division} flip={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
