import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FoodsIllustration } from "@/components/products/FoodsIllustration";

/**
 * A wide band of the staple foods between the introduction and the products. The picture is illustrative (no food
 * photographs have been supplied), so it carries the "Illustrative image" label; replace it with the client's own
 * photographs when they arrive.
 */
export function FoodsPictureBand() {
  return (
    <Section tone="leaf" space="sm" aria-label="Staple foods" className="flow-root pt-0">
      <Container>
        <FoodsIllustration />
      </Container>
    </Section>
  );
}
