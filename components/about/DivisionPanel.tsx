import type { CSSProperties } from "react";
import { aboutContent } from "@/content/about";
import type { Division } from "@/content/divisions";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Brand surface for each division (navy, charcoal navy, agricultural green). */
const surfaces: Record<Division["id"], string> = {
  energy: "bg-navy",
  security: "bg-charcoal",
  foods: "bg-green",
};

/** One of three flush, full-height colour panels that together read as a single triptych. */
export function DivisionPanel({ division, index }: { division: Division; index: number }) {
  return (
    <article
      aria-labelledby={`about-division-${division.id}`}
      data-surface="dark"
      className={`group/panel reveal relative flex min-h-[28rem] flex-col justify-between overflow-hidden p-8 text-white sm:p-10 lg:min-h-[34rem] lg:p-12 ${surfaces[division.id]}`}
      style={{ "--i": index } as CSSProperties}
    >
      {/* Gold rule draws across the top on hover and focus. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-(--ease-standard) group-focus-within/panel:scale-x-100 group-hover/panel:scale-x-100"
      />

      <div className="flex items-start justify-between gap-6">
        <p className="font-heading text-[clamp(2.5rem,1.9rem+2.4vw,3.75rem)] leading-none font-extrabold break-words text-white">
          {division.word}.
        </p>
        <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-on-dark-muted">
          {division.number}
        </span>
      </div>

      <div className="mt-16">
        <h3 id={`about-division-${division.id}`} className="text-h2 font-extrabold text-white">
          {division.name}
        </h3>
        <p className="mt-2 font-heading text-sm font-bold tracking-[0.12em] text-on-dark-muted uppercase">
          {division.descriptor}
        </p>
        <p className="mt-5 max-w-sm text-body text-on-dark-muted lg:min-h-[5.25rem]">{aboutContent.divisions.descriptions[division.id]}</p>
        <div className="mt-8">
          <ButtonLink href={division.href} surface="dark" variant="secondary" arrow>
            {division.cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
