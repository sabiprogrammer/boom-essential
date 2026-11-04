import type { CSSProperties } from "react";
import { foodsContent } from "@/content/foods";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * Introduction on a soft green surface: the statement beside the explanation, then the two product
 * groups as oversized counts that link to their sections.
 */
export function FoodsIntroSection() {
  const { eyebrow, heading, paragraphs, groups } = foodsContent.intro;

  return (
    <Section tone="leaf" space="lg" aria-labelledby="foods-intro-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-green uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {eyebrow}
            </p>
            <h2 id="foods-intro-heading" className="text-h1 font-extrabold text-balance text-navy">
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

        <ul className="mt-16 grid gap-0 border-t-2 border-green sm:grid-cols-2 lg:mt-24">
          {groups.map((group, index) => (
            <li key={group.label} className="reveal sm:last:pl-8" style={{ "--i": index } as CSSProperties}>
              <SmartLink
                href={group.href}
                className="group/count flex items-end gap-6 border-b border-line-strong py-8 transition-colors duration-300 hover:border-green lg:py-10"
              >
                <span className="font-heading text-[clamp(4rem,2.5rem+6vw,8rem)] leading-[0.85] font-extrabold text-green tabular-nums transition-transform duration-500 ease-(--ease-standard) group-hover/count:-translate-y-1">
                  {group.count}
                </span>
                <span className="pb-1 font-heading text-h3 font-extrabold text-navy">
                  {group.label}
                  <span aria-hidden="true" className="mt-1 block h-0.5 w-8 origin-left bg-gold transition-transform duration-500 group-hover/count:scale-x-[2.5]" />
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
