import { foodsContent, stapleProducts } from "@/content/foods";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { fieldStripes } from "./field-stripes";
import { PackagingScale } from "./PackagingScale";
import { ProductEnquiryRow } from "./ProductEnquiryRow";

/**
 * Household staples. A sticky Agricultural Green panel carries the heading and the packaging
 * information (bag sizes from 1kg to 100kg); beside it, the five products as numbered enquiry rows.
 */
export function HouseholdStaplesSection() {
  const { eyebrow, heading, lead, packagingLabel, packaging, packagingNote, sizeFrom, sizeTo, enquiryCta } =
    foodsContent.staples;

  return (
    <Section tone="white" space="lg" id="household-staples" aria-labelledby="foods-staples-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="reveal lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div className="relative bg-green p-8 text-white sm:p-10" style={fieldStripes(0.1)} data-surface="dark">
              <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />
              <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase">
                <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
                {eyebrow}
              </p>
              <h2 id="foods-staples-heading" className="text-h1 font-extrabold text-white">
                {heading}
              </h2>
              <p className="mt-4 text-lead text-white">{lead}</p>

              <div className="mt-10 border-t border-white/35 pt-8">
                <p className="font-heading text-xs font-bold tracking-[0.16em] uppercase">{packagingLabel}</p>
                <p className="mt-3 font-heading text-h3 font-extrabold text-white">{packaging}</p>
                <div className="mt-8">
                  <PackagingScale from={sizeFrom} to={sizeTo} />
                </div>
                <p className="mt-8 text-body text-white">{packagingNote}</p>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {stapleProducts.map((product, index) => (
              <ProductEnquiryRow key={product.slug} product={product} cta={enquiryCta} index={index} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
