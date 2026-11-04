import type { CSSProperties } from "react";
import { industrialContent } from "@/content/industrial-equipment";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustrialIcon } from "./IndustrialIcon";

/**
 * The two audiences, and only these: restaurants, and restaurant owners and operators. Two flush panels
 * under a Warm White heading. No other customer segment is shown without client confirmation.
 */
export function IndustrialAudienceSection() {
  const { eyebrow, heading, items } = industrialContent.audience;
  const surfaces = ["bg-white text-navy", "bg-charcoal text-white"] as const;

  return (
    <Section tone="white" space="lg" aria-labelledby="industrial-audience-heading" className="pb-0 lg:pb-0">
      <Container>
        <div className="reveal">
          <SectionHeading id="industrial-audience-heading" eyebrow={eyebrow} title={heading} />
        </div>
      </Container>

      <ul className="mt-14 grid border-y border-line-strong lg:mt-20 lg:grid-cols-2">
        {items.map((item, index) => {
          const dark = index === 1;
          return (
            <li
              key={item.label}
              data-surface={dark ? "dark" : "light"}
              className={`reveal relative px-6 py-14 sm:px-12 lg:px-16 lg:py-20 ${surfaces[index]} ${index === 0 ? "lg:pl-[max(4rem,calc((100vw-80rem)/2+2.5rem))]" : ""}`}
              style={{ "--i": index } as CSSProperties}
            >
              <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />
              <IndustrialIcon name={item.icon} className={`size-14 ${dark ? "text-gold" : "text-navy"}`} />
              <h3 className={`mt-8 break-words text-h1 leading-[1.05] font-extrabold ${dark ? "text-white" : "text-navy"}`}>{item.label}</h3>
              <p className={`mt-4 max-w-md text-lead ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}>{item.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
