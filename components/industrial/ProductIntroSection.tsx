import type { CSSProperties } from "react";
import { industrialContent } from "@/content/industrial-equipment";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/**
 * Product introduction on Warm White: a large headline beside the short explanation, then a spec-sheet
 * of confirmed facts only. The "Details" row sends buyers to the team rather than inventing specifications.
 */
export function ProductIntroSection() {
  const { eyebrow, heading, paragraphs, sheetLabel, sheet } = industrialContent.intro;

  return (
    <Section tone="light" space="lg" aria-labelledby="industrial-intro-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="industrial-intro-heading" className="text-h1 font-extrabold text-balance text-navy">
              {heading}
            </h2>
            <div className="mt-8 max-w-xl space-y-5">
              {paragraphs.map((text) => (
                <p key={text} className="text-lead text-charcoal">
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="reveal lg:col-span-5 lg:pt-4" style={{ "--i": 1 } as CSSProperties}>
            <div className="border-t-[3px] border-gold bg-white p-7 sm:p-9">
              <h3 className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{sheetLabel}</h3>
              <dl className="mt-4 border-t-2 border-navy">
                {sheet.map((row) => (
                  <div key={row.term} className="grid gap-1 border-b border-line-strong py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <dt className="font-heading text-sm font-bold tracking-[0.12em] text-ink-muted uppercase">{row.term}</dt>
                    <dd className="font-heading text-lg font-extrabold text-navy">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
