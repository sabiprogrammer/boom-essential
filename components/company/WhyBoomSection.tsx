import type { CSSProperties } from "react";
import { companyProfile } from "@/content/company-profile";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "Why Boom?" as five ruled, numbered reasons: a sticky headline on the left, the list on the right.
 * Wording is the client's own (content/company-profile.ts). Used on the homepage and About Us.
 */
export function WhyBoomSection({ tone = "white" }: { tone?: "white" | "tint" | "light" }) {
  const { eyebrow, heading, items } = companyProfile.why;

  return (
    <Section tone={tone} space="lg" aria-labelledby="why-boom-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-20">
          <div className="reveal lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading id="why-boom-heading" eyebrow={eyebrow} title={heading} />
          </div>

          <ol className="lg:col-span-7">
            {items.map((item, index) => (
              <li
                key={item.title}
                className="reveal grid gap-1 border-t border-line-strong py-6 first:border-t-2 first:border-navy sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
                style={{ "--i": index } as CSSProperties}
              >
                <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-ink-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-h3 font-extrabold text-navy">{item.title}</h3>
                  <p className="mt-2 text-body text-charcoal">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
