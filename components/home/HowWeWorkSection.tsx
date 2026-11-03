import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* Wording follows the client's stated approach only: listen, understand needs and expectations,
 * work towards appropriate solutions. No timings, guarantees or process details are claimed. */
const steps = [
  { title: "Listen", text: "We start by listening to our customers.", rise: "lg:mt-24" },
  { title: "Understand", text: "We seek to understand their needs and expectations.", rise: "lg:mt-12" },
  { title: "Work towards the right solution", text: "We work towards solutions that are appropriate for them.", rise: "lg:mt-0" },
];

/**
 * The customer-first approach as three rising steps (a staircase echoing the logo's ascending bars),
 * each marked by a rule that gets progressively stronger.
 */
export function HowWeWorkSection() {
  return (
    <Section tone="light" aria-labelledby="how-heading">
      <Container>
        <div className="reveal">
          <SectionHeading
            id="how-heading"
            eyebrow="How we work"
            title="A customer-first approach"
            lead="Our approach is simple: listen first, then recommend."
          />
        </div>

        <ol className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-3 lg:items-start lg:gap-8">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={`reveal ${step.rise}`}
              style={{ "--i": index } as CSSProperties}
            >
              <div
                aria-hidden="true"
                className={`mb-6 ${index === 0 ? "border-t-2 border-line-strong" : index === 1 ? "border-t-[3px] border-navy" : "border-t-4 border-gold"}`}
              />
              <p className="font-heading text-sm font-bold tracking-[0.16em] text-ink-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-h3 font-extrabold">{step.title}</h3>
              <p className="mt-3 max-w-xs text-body text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
