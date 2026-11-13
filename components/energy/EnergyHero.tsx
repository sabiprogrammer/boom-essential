import type { CSSProperties } from "react";
import { energyContent, solarAssessmentHref } from "@/content/energy";
import Image from "next/image";
import { company } from "@/content/company";
import { projectPhotos } from "@/content/project-photos";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * BOOM Energy hero on Deep Navy. Text on the left. On the right, full bleed to the top, right and bottom edges
 * (so it also sits behind the transparent header), one of the client's own photographs of an installed system:
 * a room of wall-mounted inverters. It fades into the navy so the text stays clear of it.
 */
export function EnergyHero() {
  const { eyebrow, headline, copy, primaryCta, secondaryCta } = energyContent.hero;
  const photo = projectPhotos.inverterRoom;

  return (
    <section
      data-surface="dark"
      aria-labelledby="energy-heading"
      className="relative isolate overflow-hidden bg-navy pt-14 text-white sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="lg:w-[56%] lg:pb-28">
          <p className="rise flex items-start gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase" style={delay(0)}>
            <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-10 shrink-0 bg-gold" />
            {eyebrow}
          </p>

          <h1
            id="energy-heading"
            className="rise mt-7 text-[clamp(2.5rem,1rem+4.6vw,4.75rem)] leading-[1.04] font-extrabold text-white"
            style={delay(120)}
          >
            <span className="block">{headline[0]}</span> <span className="block text-gold">{headline[1]}</span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lead text-on-dark-muted" style={delay(260)}>
            {copy}
          </p>

          <div className="rise mt-10 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start xl:flex-row" style={delay(400)}>
            <ButtonLink href={solarAssessmentHref} surface="dark" size="lg" arrow>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href={company.whatsapp.href} surface="dark" variant="secondary" size="lg">
              {secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>

      <div className="relative mt-12 aspect-[4/3] lg:absolute lg:inset-y-0 lg:right-0 lg:z-[-1] lg:mt-0 lg:aspect-auto lg:w-[42%]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "50% 38%" }}
        />
        {/* Fades the picture into the navy on its text side, and darkens its top edge for the transparent header. */}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/60 to-transparent lg:bg-linear-to-r lg:from-navy lg:via-navy/15 lg:to-transparent" />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-navy/70 to-transparent" />
        <span aria-hidden="true" className="absolute top-0 right-0 h-1.5 w-24 bg-gold" />
      </div>
    </section>
  );
}
