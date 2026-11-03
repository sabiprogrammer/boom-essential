import type { CSSProperties } from "react";
import type { Division } from "@/content/divisions";
import { divisionImages } from "@/content/division-images";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DivisionVisual } from "./DivisionVisual";

type DivisionRowProps = {
  division: Division;
  /** Alternates the visual to the right on large screens for rhythm. */
  flip?: boolean;
};

/** One principal division: a visual field beside the story, alternating sides down the page. */
export function DivisionRow({ division, flip = false }: DivisionRowProps) {
  const headingId = `division-${division.id}`;

  return (
    <article aria-labelledby={headingId} className="group/row reveal grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-16">
      <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
        <DivisionVisual division={division} image={divisionImages[division.id]} />
      </div>

      <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`} style={{ "--i": 1 } as CSSProperties}>
        <p className="mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
          <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
          {division.word}.
        </p>
        <h3 id={headingId} className="text-h1 font-extrabold">
          {division.name}
        </h3>
        <p className="mt-3 text-lead text-ink-muted">{division.descriptor}</p>

        <ul className="mt-8 border-t border-line-strong">
          {division.highlights.map((item) => (
            <li key={item} className="flex items-center gap-4 border-b border-line py-4 text-body font-medium text-charcoal">
              <span aria-hidden="true" className="size-1.5 shrink-0 bg-navy" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-9">
          <ButtonLink href={division.href} arrow>
            {division.cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
