import type { CSSProperties } from "react";
import { energyContent } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/**
 * Introduction on Warm White: a large statement beside the explanation, then the four service
 * families as a ruled path, each marked with a gold node.
 */
export function EnergyIntroSection() {
  const { eyebrow, heading, paragraphs, path } = energyContent.intro;

  return (
    <Section tone="light" space="lg" aria-labelledby="energy-intro-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="energy-intro-heading" className="text-h1 font-extrabold text-balance text-navy">
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

        <ol aria-label="What BOOM ENERGY provides" className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:mt-24">
          {path.map((item, index) => (
            <li
              key={item}
              className="reveal relative border-t-2 border-navy pt-5"
              style={{ "--i": index } as CSSProperties}
            >
              <span aria-hidden="true" className="absolute -top-[7px] left-0 size-3 bg-gold" />
              <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-heading text-h3 font-extrabold text-navy">{item}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
