import { industrialContent } from "@/content/industrial-equipment";
import { divisions } from "@/content/divisions";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * Makes the business structure unmistakable: the three principal divisions as linked, numbered
 * entries, then a visibly separate, dashed "additional offering" marker for this page. It is never a
 * fourth numbered division.
 */
export function OfferingMapSection() {
  const { label, text, divisionsLabel, additionalLabel, additionalName, hereLabel } = industrialContent.position;

  return (
    <Section tone="white" space="sm" aria-labelledby="industrial-position-heading">
      <Container>
        <div className="reveal grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-4">
            <h2 id="industrial-position-heading" className="flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase">
              <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
              {label}
            </h2>
            <p className="mt-4 text-body text-charcoal">{text}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-[1fr_auto_minmax(0,0.8fr)] sm:items-stretch lg:col-span-8 lg:gap-x-10">
            <div>
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{divisionsLabel}</p>
              <ol className="mt-3 border-t-2 border-navy">
                {divisions.map((division) => (
                  <li key={division.id} className="border-b border-line-strong">
                    <SmartLink
                      href={division.href}
                      className="group/division flex items-baseline gap-4 py-3.5 font-heading font-extrabold text-navy transition-colors duration-200 hover:text-navy-hover"
                    >
                      <span aria-hidden="true" className="text-sm tracking-[0.16em] text-ink-muted">
                        {division.number}
                      </span>
                      <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-200 group-hover/division:decoration-gold">
                        {division.name}
                      </span>
                    </SmartLink>
                  </li>
                ))}
              </ol>
            </div>

            <span aria-hidden="true" className="hidden w-px bg-line-strong sm:block" />

            <div>
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{additionalLabel}</p>
              <div className="relative mt-3 border-2 border-dashed border-navy p-5">
                <p className="font-heading text-lg font-extrabold text-navy">{additionalName}</p>
                <p className="mt-2 inline-block bg-navy px-2.5 py-1 font-heading text-xs font-bold tracking-[0.12em] text-white uppercase">
                  {hereLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
