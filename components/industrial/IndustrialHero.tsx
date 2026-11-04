import type { CSSProperties } from "react";
import { industrialContent, industrialEnquiryHref } from "@/content/industrial-equipment";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MachineStage } from "./MachineStage";
import { ProductMedia } from "./ProductMedia";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Industrial Equipment hero on Charcoal Navy with a thin gold tab at its top edge. Text on the left; on the right a
 * product plinth (a gold block offset behind a navy frame) that holds the illustrative drawing today and an
 * authentic photograph when one is supplied.
 */
export function IndustrialHero() {
  const { eyebrow, headline, copy, primaryCta, secondaryCta, drawingNote } = industrialContent.hero;
  const { whatsapp } = industrialContent.contact;

  return (
    <section
      data-surface="dark"
      aria-labelledby="industrial-heading"
      className="relative isolate overflow-hidden bg-charcoal pb-16 text-white sm:pb-20 lg:pb-24"
    >
      <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-gold" />

      <Container className="pt-14 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="rise flex items-start gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-10 shrink-0 bg-gold" />
              {eyebrow}
            </p>

            <h1
              id="industrial-heading"
              className="rise mt-7 text-[clamp(2.5rem,1rem+4vw,4rem)] leading-[1.04] font-extrabold text-white"
              style={delay(120)}
            >
              <span className="block">{headline[0]}</span> <span className="block text-gold">{headline[1]}</span>
            </h1>

            <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
              {copy}
            </p>

            <div className="rise mt-10 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start xl:flex-row" style={delay(400)}>
              <ButtonLink href={industrialEnquiryHref()} surface="dark" size="lg" arrow>
                {primaryCta}
              </ButtonLink>
              <ButtonLink href={whatsapp.href} surface="dark" variant="secondary" size="lg">
                {secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="rise relative lg:col-span-5" style={delay(300)}>
            <ProductMedia
              aspect="520 / 440"
              drawing={<MachineStage className="absolute inset-0 size-full" />}
              drawingNote={drawingNote}
              sizes="(min-width: 1024px) 40vw, 100vw"
              plinth
              className="relative pr-3 pb-0 sm:pr-4"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
