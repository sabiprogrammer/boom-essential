import type { CSSProperties } from "react";
import { foodsEnquiryHref, type FoodProduct } from "@/content/foods";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProteinMotif } from "./ProteinMotif";

type ProteinPanelProps = {
  product: FoodProduct;
  cta: string;
  index: number;
  /** Brand surface and matching motif. */
  surface: "charcoal" | "navy";
  motif: "smoke" | "frost";
};

const surfaces = { charcoal: "bg-charcoal", navy: "bg-navy" } as const;

/** A protein product as a large flush panel: oversized number, name, description and an enquiry action. */
export function ProteinPanel({ product, cta, index, surface, motif }: ProteinPanelProps) {
  const headingId = `food-${product.slug}`;

  return (
    <article
      aria-labelledby={headingId}
      data-surface="dark"
      className={`reveal relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden p-8 text-white sm:p-12 lg:min-h-[32rem] lg:p-14 ${surfaces[surface]}`}
      style={{ "--i": index } as CSSProperties}
    >
      <ProteinMotif kind={motif} className="pointer-events-none absolute -right-6 -bottom-4 -z-10 h-[24rem] w-auto sm:h-[28rem]" />
      <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />

      <div className="flex items-start justify-between gap-6">
        <span aria-hidden="true" className="font-heading text-[clamp(3.5rem,2rem+5vw,6.5rem)] leading-none font-extrabold text-white/90 tabular-nums">
          {product.number}
        </span>
        <span className="font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">Protein product</span>
      </div>

      <div className="mt-14">
        <h3 id={headingId} className="text-h1 font-extrabold text-white">
          {product.name}
        </h3>
        <p className="mt-4 max-w-sm text-lead text-on-dark-muted">{product.description}</p>
        <div className="mt-8">
          <ButtonLink href={foodsEnquiryHref(product.slug)} surface="dark" arrow>
            {cta}
            <span className="sr-only">: {product.name}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
