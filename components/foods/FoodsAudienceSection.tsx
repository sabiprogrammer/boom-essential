import type { CSSProperties } from "react";
import { foodsContent } from "@/content/foods";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fieldStripes } from "./field-stripes";

/** Each customer group sits on its own full-bleed band, from Agricultural Green deepening to Deep Navy. */
const bands = [
  { className: "bg-green", stripes: 0.12 },
  { className: "bg-green-hover", stripes: 0.1 },
  { className: "bg-navy", stripes: 0 },
] as const;

/**
 * Households, businesses, organisations and institutions as three stacked full-bleed bands under a
 * Warm White heading. Only the supplied positioning is used: no contracts, volumes or testimonials.
 */
export function FoodsAudienceSection() {
  const { eyebrow, heading, items } = foodsContent.audiences;

  return (
    <Section tone="light" space="lg" id="who-we-serve" aria-labelledby="foods-audiences-heading" className="pb-0 lg:pb-0">
      <Container>
        <div className="reveal">
          <SectionHeading id="foods-audiences-heading" eyebrow={eyebrow} title={heading} />
        </div>
      </Container>

      <ul className="mt-14 lg:mt-20">
        {items.map((item, index) => (
          <li
            key={item.label}
            data-surface="dark"
            className={`reveal relative ${bands[index].className} py-12 text-white sm:py-14 lg:py-16`}
            style={{ ...(bands[index].stripes ? fieldStripes(bands[index].stripes) : {}), "--i": index } as CSSProperties}
          >
            <Container>
              <div className="grid items-center gap-x-12 gap-y-5 lg:grid-cols-12">
                <div className="flex items-baseline gap-5 lg:col-span-7">
                  <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-white/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="break-words text-[clamp(1.875rem,1.2rem+3.2vw,3.75rem)] leading-[1.02] font-extrabold tracking-tight text-white uppercase">
                    {item.label}
                  </h3>
                </div>
                <div className="lg:col-span-5">
                  <span aria-hidden="true" className="mb-4 block h-0.5 w-10 bg-gold" />
                  <p className="max-w-md text-lead text-white">{item.text}</p>
                </div>
              </div>
            </Container>
          </li>
        ))}
      </ul>
    </Section>
  );
}
