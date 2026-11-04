import type { CSSProperties } from "react";
import { securityContent } from "@/content/security";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SecurityIcon } from "./SecurityIcon";

/**
 * Introduction on Warm White: a large statement beside the explanation, then the four things the
 * team considers, set as a spec-sheet table of hairline-bordered cells.
 */
export function SecurityIntroSection() {
  const { eyebrow, heading, paragraphs, considerationsLabel, considerations } = securityContent.intro;

  return (
    <Section tone="light" space="lg" aria-labelledby="security-intro-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="security-intro-heading" className="text-h1 font-extrabold text-balance text-navy">
              {heading}
            </h2>
          </div>

          <div className="reveal space-y-5 lg:col-span-5 lg:pt-12" style={{ "--i": 1 } as CSSProperties}>
            {paragraphs.map((text) => (
              <p key={text} className="text-lead text-charcoal">
                {text}
              </p>
            ))}
          </div>
        </div>

        <div className="reveal mt-16 lg:mt-24">
          <h3 className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{considerationsLabel}</h3>
          <ul className="mt-5 grid border-t-2 border-navy sm:grid-cols-2 lg:grid-cols-4">
            {considerations.map((item, index) => (
              <li
                key={item.title}
                className="group/cell flex items-center gap-4 border-b border-line-strong py-6 sm:pr-6 lg:border-l lg:px-6 lg:py-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="relative grid size-14 shrink-0 place-items-center text-navy">
                  <SecurityIcon name={item.icon} className="size-8" />
                  <span aria-hidden="true" className="absolute inset-0 border border-line-strong transition-colors duration-300 group-hover/cell:border-navy" />
                </span>
                <span>
                  <span aria-hidden="true" className="block font-heading text-xs font-bold tracking-[0.16em] text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="block font-heading text-lg leading-snug font-extrabold text-navy">{item.title}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
