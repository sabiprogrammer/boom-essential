import type { CSSProperties } from "react";
import { foodsEnquiryHref, type FoodProduct } from "@/content/foods";
import { ButtonLink } from "@/components/ui/ButtonLink";

type ProductEnquiryRowProps = {
  product: FoodProduct;
  cta: string;
  index: number;
};

/**
 * One household staple as an enquiry row: number, name and an action whose destination names the
 * product. No price, no cart. The product name is repeated for assistive technology so each of the
 * identical-looking actions is distinguishable.
 */
export function ProductEnquiryRow({ product, cta, index }: ProductEnquiryRowProps) {
  const headingId = `food-${product.slug}`;

  return (
    <li
      className="reveal group/row relative border-b border-line-strong first:border-t-2 first:border-t-green"
      style={{ "--i": index } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-1 origin-top scale-y-0 bg-green transition-transform duration-500 ease-(--ease-standard) group-hover/row:scale-y-100 group-focus-within/row:scale-y-100"
      />
      <div className="grid items-center gap-x-6 gap-y-5 py-7 sm:grid-cols-[3rem_1fr_auto] sm:pl-4 lg:py-9">
        <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-green">
          {product.number}
        </span>
        <h3
          id={headingId}
          className="break-words text-h2 font-extrabold text-navy transition-transform duration-500 ease-(--ease-standard) group-hover/row:translate-x-1.5"
        >
          {product.name}
        </h3>
        <div className="sm:justify-self-end">
          <ButtonLink href={foodsEnquiryHref(product.slug)} variant="secondary" size="sm" arrow>
            {cta}
            <span className="sr-only">: {product.name}</span>
          </ButtonLink>
        </div>
      </div>
    </li>
  );
}
