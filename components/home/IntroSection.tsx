import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { divisions } from "@/content/divisions";

/** Company introduction: a wide, quiet editorial spread. Headline left, copy right. */
export function IntroSection() {
  return (
    <Section tone="light" space="lg" aria-labelledby="intro-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="reveal lg:col-span-6">
            <p className="mb-6 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              About the company
            </p>
            <h2 id="intro-heading" className="text-h1 font-extrabold">
              One Company. <span className="block">Three Essential Solutions.</span>
            </h2>
            <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-heading text-sm font-bold tracking-[0.14em] text-ink-muted uppercase" aria-label="Areas of operation">
              {divisions.map((division, index) => (
                <li key={division.id} className="flex items-center gap-5">
                  {division.shortName}
                  {index < divisions.length - 1 ? <span aria-hidden="true" className="h-4 w-px bg-line-strong" /> : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal space-y-6 text-lead text-charcoal lg:col-span-6 lg:pt-12" style={{ "--i": 1 } as CSSProperties}>
            <p>
              BOOM MULTI GLOBAL COMPANY LIMITED is an indigenous Nigerian company operating across energy,
              security and food supply from Akure, Ondo State.
            </p>
            <p className="text-ink-muted">
              We begin by understanding what our customers need, then recommend the solutions that suit
              them, whether that is dependable power, protection for a property, or quality food and
              agricultural products.
            </p>
            <p className="pt-2">
              <TextLink href="/about" arrow>
                Learn more About Us
              </TextLink>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
