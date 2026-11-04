import type { CSSProperties } from "react";
import { company } from "@/content/company";
import { securityAssessmentHref, securityContent } from "@/content/security";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SecurityPlanGraphic } from "./SecurityPlanGraphic";
import { Viewfinder } from "./Viewfinder";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Faint drafting mesh over Charcoal Navy, the same language as the homepage Security panel. */
const meshStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
  backgroundSize: "2.5rem 2.5rem",
};

/**
 * BOOM Security hero on Charcoal Navy with a drafting mesh. Text on the left; on the right a framed
 * plan-view schematic (fence line, gate, building, four cameras) inside a camera viewfinder.
 */
export function SecurityHero() {
  const { eyebrow, headline, copy, primaryCta, secondaryCta, schematicNote } = securityContent.hero;

  return (
    <section
      data-surface="dark"
      aria-labelledby="security-heading"
      className="relative isolate overflow-hidden bg-charcoal py-14 text-white sm:py-20 lg:py-24"
      style={meshStyle}
    >
      <Container>
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="rise flex items-start gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-10 shrink-0 bg-gold" />
              {eyebrow}
            </p>

            <h1
              id="security-heading"
              className="rise mt-7 text-[clamp(2.5rem,1rem+4.8vw,4.75rem)] leading-[1.04] font-extrabold text-white"
              style={delay(120)}
            >
              <span className="block">{headline[0]}</span> <span className="block text-gold">{headline[1]}</span>
            </h1>

            <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
              {copy}
            </p>

            <div className="rise mt-10 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start xl:flex-row" style={delay(400)}>
              <ButtonLink href={securityAssessmentHref} surface="dark" size="lg" arrow>
                {primaryCta}
              </ButtonLink>
              <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
                {secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <figure className="rise lg:col-span-6" style={delay(300)}>
            <div className="relative bg-navy p-5 sm:p-8">
              <Viewfinder cornerClassName="size-7 border-2" className="inset-2 sm:inset-3" />
              <SecurityPlanGraphic className="block h-auto w-full" />
            </div>
            <figcaption className="mt-3 text-sm text-on-dark-muted">{schematicNote}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
