import { foodsContent, proteinProducts } from "@/content/foods";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProteinPanel } from "./ProteinPanel";

const styles = [
  { surface: "charcoal", motif: "smoke" },
  { surface: "navy", motif: "frost" },
] as const;

/** Smoked fish and frozen chicken as two full-bleed panels beneath a Warm White heading. */
export function ProteinProductsSection() {
  const { eyebrow, heading, lead, enquiryCta } = foodsContent.proteins;

  return (
    <Section tone="light" space="lg" id="protein-products" aria-labelledby="foods-proteins-heading" className="pb-0 lg:pb-0">
      <Container>
        <div className="reveal">
          <SectionHeading id="foods-proteins-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>
      </Container>

      <div className="mt-14 grid lg:mt-20 lg:grid-cols-2">
        {proteinProducts.map((product, index) => (
          <ProteinPanel
            key={product.slug}
            product={product}
            cta={enquiryCta}
            index={index}
            surface={styles[index].surface}
            motif={styles[index].motif}
          />
        ))}
      </div>
    </Section>
  );
}
