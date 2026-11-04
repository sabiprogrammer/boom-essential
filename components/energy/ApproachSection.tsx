import type { CSSProperties } from "react";
import { energyContent, energySteps } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The five-step customer journey on a vertical rail, beside a sticky headline. No timings or guarantees. */
export function ApproachSection() {
  const { eyebrow, heading, lead } = energyContent.approach;

  return (
    <Section tone="white" space="lg" aria-labelledby="energy-approach-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading id="energy-approach-heading" eyebrow={eyebrow} title={heading} lead={lead} />
          </div>

          <ol className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.375rem] w-px bg-line-strong" />
            {energySteps.map((step, index) => (
              <li
                key={step.number}
                className="reveal relative flex gap-6 pb-12 last:pb-0 sm:gap-8"
                style={{ "--i": index } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 font-heading text-sm font-extrabold ${
                    index === energySteps.length - 1
                      ? "border-navy bg-navy text-white"
                      : "border-navy bg-white text-navy"
                  }`}
                >
                  {step.number}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-h3 font-extrabold text-navy">{step.title}</h3>
                  <p className="mt-2 max-w-md text-body text-ink-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
