import type { CSSProperties } from "react";
import { securityContent, securitySteps } from "@/content/security";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Five-step customer journey as a checkpoint route: a horizontal line with square checkpoints on large
 * screens, a vertical rail on small ones. No timings, monitoring arrangements or service levels.
 */
export function SecurityApproachSection() {
  const { eyebrow, heading, lead } = securityContent.approach;

  return (
    <Section tone="white" space="lg" aria-labelledby="security-approach-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="security-approach-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ol className="relative mt-14 lg:mt-20 lg:grid lg:grid-cols-5 lg:gap-x-8">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line-strong lg:top-[0.6875rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
          {securitySteps.map((step, index) => (
            <li
              key={step.number}
              className="reveal relative pb-10 pl-12 last:pb-0 lg:pb-0 lg:pl-0"
              style={{ "--i": index } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 size-6 border-2 border-navy lg:relative lg:block ${
                  index === securitySteps.length - 1 ? "bg-navy" : "bg-white"
                }`}
              />
              <p aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-ink-muted lg:mt-8">
                {step.number}
              </p>
              <h3 className="mt-2 text-h3 font-extrabold text-balance text-navy">{step.title}</h3>
              <p className="mt-3 max-w-xs text-body text-ink-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
