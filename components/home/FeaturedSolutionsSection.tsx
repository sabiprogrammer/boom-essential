import type { CSSProperties } from "react";
import { featuredSolutionGroups } from "@/content/featured-solutions";
import type { DivisionId } from "@/content/divisions";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartLink } from "@/components/ui/SmartLink";
import { TextLink } from "@/components/ui/TextLink";

const marker: Record<DivisionId, string> = {
  energy: "bg-gold",
  security: "bg-white",
  foods: "bg-green ring-1 ring-white/60",
};

/**
 * Selected solutions as an editorial index on Charcoal Navy: a sticky introduction beside a long,
 * ruled list. The list is arranged by category (Energy, Security, Foods), each with its own heading;
 * the numbering runs on continuously across the three groups. Deliberately not a grid of cards.
 */
export function FeaturedSolutionsSection() {
  return (
    <Section tone="charcoal" aria-labelledby="featured-heading">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <div className="reveal lg:sticky lg:top-32">
              <SectionHeading
                id="featured-heading"
                surface="dark"
                eyebrow="Featured solutions"
                title="Selected services and products"
                lead="A look at what we supply across energy, security and food."
              />
              <p className="mt-8 max-w-sm text-base text-on-dark-muted">
                For food products, tell us the product and quantity you need.
              </p>
              <p className="mt-8">
                <TextLink href="/contact" surface="dark" arrow>
                  Make an enquiry
                </TextLink>
              </p>
            </div>
          </div>

          <div className="space-y-12 lg:col-span-8">
            {featuredSolutionGroups.map((group) => {
              const { start } = group;
              return (
                <div key={group.division} className="reveal">
                  <h3 className="flex items-center gap-3 pb-4 font-heading text-sm font-bold tracking-[0.14em] text-on-dark-muted uppercase">
                    <span aria-hidden="true" className={`size-2.5 ${marker[group.division]}`} />
                    {group.label}
                  </h3>
                  <ol className="border-t border-line-on-dark" start={start} aria-label={`${group.label} featured solutions`}>
                    {group.items.map((item, index) => (
                      <li
                        key={item.title}
                        className="reveal border-b border-line-on-dark"
                        style={{ "--i": index } as CSSProperties}
                      >
                        <SmartLink
                          href={item.href}
                          className="group/item relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 transition-colors duration-300 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] sm:grid-cols-[4rem_1fr_auto] sm:gap-x-6 sm:py-7"
                        >
                          <span className="pl-1 font-heading text-sm font-bold text-on-dark-muted tabular-nums">
                            {String(start + index).padStart(2, "0")}
                          </span>
                          <span className="block font-heading text-h3 font-bold text-white transition-transform duration-300 group-hover/item:translate-x-1.5">
                            {item.title}
                          </span>
                          <ArrowRightIcon className="mr-1 size-6 text-gold transition-transform duration-300 group-hover/item:translate-x-1" />
                        </SmartLink>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
