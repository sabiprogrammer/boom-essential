import type { CSSProperties } from "react";
import { industrialContent } from "@/content/industrial-equipment";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const chevron = "lg:[clip-path:polygon(0_0,calc(100%-1.5rem)_0,100%_50%,calc(100%-1.5rem)_100%,0_100%,1.5rem_50%)]";
const firstChevron = "lg:[clip-path:polygon(0_0,calc(100%-1.5rem)_0,100%_50%,calc(100%-1.5rem)_100%,0_100%)]";

/**
 * A suggested enquiry journey as three chevron tabs that point the way, each with its description
 * below. Clearly presented as a suggestion, not an established or guaranteed operational process.
 */
export function EnquiryJourneySection() {
  const { eyebrow, heading, lead, steps } = industrialContent.journey;

  return (
    <Section tone="tint" space="lg" aria-labelledby="industrial-journey-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="industrial-journey-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ol className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-0">
          {steps.map((step, index) => (
            <li key={step.number} className="reveal" style={{ "--i": index } as CSSProperties}>
              <div
                data-surface="dark"
                className={`flex items-center gap-4 bg-navy px-6 py-5 text-white lg:py-6 lg:pr-10 ${index === 0 ? `${firstChevron} lg:pl-6` : `${chevron} lg:pl-10`} ${
                  index === 1 ? "lg:bg-navy-hover" : ""
                }`}
              >
                <span aria-hidden="true" className="font-heading text-3xl leading-none font-extrabold tabular-nums text-gold">
                  {step.number}
                </span>
                <h3 className="font-heading text-lg leading-snug font-extrabold text-white">{step.title}</h3>
              </div>
              <p className="mt-5 max-w-xs text-body text-ink-muted lg:pl-6">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
