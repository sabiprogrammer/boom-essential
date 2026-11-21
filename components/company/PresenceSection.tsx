import type { CSSProperties } from "react";
import { companyProfile } from "@/content/company-profile";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Nationwide presence and the strategic partnership, on Deep Navy. Statements come from the client's own
 * company profile (content/company-profile.ts): no number of agents, offices or States is stated beyond them.
 */
export function PresenceSection() {
  const { eyebrow, heading, lead, points, agents } = companyProfile.presence;
  const { label, text } = companyProfile.partnership;

  return (
    <Section tone="navy" space="lg" aria-labelledby="presence-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal lg:col-span-5">
            <SectionHeading id="presence-heading" surface="dark" eyebrow={eyebrow} title={heading} lead={lead} />
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t-2 border-gold">
              {points.map((point, index) => (
                <li
                  key={point}
                  className="reveal border-b border-line-on-dark py-5 text-lead text-white"
                  style={{ "--i": index } as CSSProperties}
                >
                  {point}
                </li>
              ))}
            </ul>
            <p className="reveal mt-6 font-heading text-sm font-bold tracking-[0.14em] text-gold uppercase">{agents}</p>

            <div className="reveal mt-14 border-l-4 border-gold pl-6 sm:pl-8">
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">{label}</p>
              <p className="mt-2 text-lead text-white">{text}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
