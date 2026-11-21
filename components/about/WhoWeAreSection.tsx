import type { CSSProperties } from "react";
import { aboutContent } from "@/content/about";
import { company } from "@/content/company";
import { divisions } from "@/content/divisions";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Editorial split: a sticky headline on the left; the company statement, the three principal
 * divisions and the listening belief, set in decreasing weight, on the right.
 */
export function WhoWeAreSection() {
  const { eyebrow, heading, statement, solutionPartners, divisionsIntro, belief } = aboutContent.whoWeAre;

  return (
    <Section tone="white" space="lg" aria-labelledby="who-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading id="who-heading" eyebrow={eyebrow} title={heading} />
            <dl className="mt-10 border-t border-line-strong">
              <div className="border-b border-line py-4">
                <dt className="font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">Company</dt>
                <dd className="mt-1 font-semibold text-navy">{company.legalName}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <p className="reveal font-heading text-h3 leading-snug font-semibold text-navy lg:text-[1.75rem]">{statement}</p>
            <p className="reveal mt-8 text-lead text-charcoal" style={{ "--i": 1 } as CSSProperties}>
              {solutionPartners}
            </p>

            <div className="reveal mt-14 lg:mt-20" style={{ "--i": 1 } as CSSProperties}>
              <p className="text-lead text-ink-muted">{divisionsIntro}</p>
              <ul className="mt-6 border-t-2 border-navy">
                {divisions.map((division) => (
                  <li
                    key={division.id}
                    className="grid gap-1 border-b border-line py-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:items-baseline sm:gap-8"
                  >
                    <p className="font-heading text-lg font-extrabold tracking-wide text-navy uppercase">{division.name}</p>
                    <p className="text-body text-charcoal">{division.descriptor}.</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal mt-14 border-l-4 border-gold pl-6 sm:pl-8 lg:mt-20" style={{ "--i": 2 } as CSSProperties}>
              <p className="text-lead text-charcoal">{belief}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
