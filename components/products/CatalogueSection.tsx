import type { CSSProperties } from "react";
import { catalogueEnquiryLabel, type CatalogueSectionData } from "@/content/product-catalogue";
import { Container } from "@/components/ui/Container";
import { Section, type SectionTone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { CatalogueVisual } from "./CatalogueVisual";
import { FoodsIllustration } from "./FoodsIllustration";

type CatalogueSectionProps = {
  section: CatalogueSectionData;
  tone: SectionTone;
};

/**
 * One division's catalogue. Entries with a picture are laid out as picture-over-text columns; entries without
 * one (the food products) are ruled ledger rows under the division's illustrative picture. Every entry ends in
 * an enquiry link that pre-selects it on the Contact form. No prices.
 */
export function CatalogueSection({ section, tone }: CatalogueSectionProps) {
  const dark = tone === "navy" || tone === "charcoal";
  const withPictures = section.items.some((item) => item.visual);
  const headingId = `catalogue-${section.id}-heading`;
  const muted = dark ? "text-on-dark-muted" : "text-ink-muted";
  const title = dark ? "text-white" : "text-navy";

  return (
    <Section tone={tone} space="lg" id={section.id} aria-labelledby={headingId}>
      <Container>
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id={headingId}
            surface={dark ? "dark" : "light"}
            eyebrow={section.eyebrow}
            title={section.heading}
            lead={section.lead}
          />
          <p>
            <TextLink href={section.pageHref} surface={dark ? "dark" : "light"} arrow>
              {section.pageLabel}
            </TextLink>
          </p>
        </div>

        {section.id === "foods" ? <FoodsIllustration /> : null}

        {withPictures ? (
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10">
            {section.items.map((item, index) => (
              <li key={item.slug} className="reveal" style={{ "--i": index % 3 } as CSSProperties}>
                {item.visual ? <CatalogueVisual visual={item.visual} /> : null}
                <h3 className={`mt-5 font-heading text-h3 font-extrabold ${title}`}>{item.name}</h3>
                {item.description ? <p className={`mt-2 max-w-md text-body ${muted}`}>{item.description}</p> : null}
                <p className="mt-4">
                  <TextLink href={item.enquiryHref} surface={dark ? "dark" : "light"} arrow>
                    {catalogueEnquiryLabel}
                    <span className="sr-only"> about {item.name}</span>
                  </TextLink>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 border-t-2 border-navy lg:mt-14">
            {section.items.map((item, index) => (
              <li
                key={item.slug}
                className="reveal grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-baseline"
                style={{ "--i": index % 3 } as CSSProperties}
              >
                <div>
                  <h3 className={`font-heading text-h3 font-extrabold ${title}`}>{item.name}</h3>
                  {item.description ? <p className={`mt-1 max-w-xl text-body ${muted}`}>{item.description}</p> : null}
                </div>
                <TextLink href={item.enquiryHref} arrow>
                  {catalogueEnquiryLabel}
                  <span className="sr-only"> about {item.name}</span>
                </TextLink>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
