import type { CSSProperties } from "react";
import { securityAudiences, securityContent } from "@/content/security";
import { securityAudienceImages } from "@/content/security-scene-images";
import { Container } from "@/components/ui/Container";
import { IllustrativePhoto } from "@/components/ui/IllustrativePhoto";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SecurityIcon } from "./SecurityIcon";
import { Viewfinder } from "./Viewfinder";

/**
 * Residential, commercial and institutional as three ledger rows with oversized labels, each with an
 * illustrative picture of that kind of property. On hover or focus the viewfinder
 * around each icon tightens, as a camera locking on.
 */
export function SecurityAudienceSection() {
  const { eyebrow, heading, lead } = securityContent.audiences;

  return (
    <Section tone="navy" space="lg" id="who-we-serve" aria-labelledby="security-audiences-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="security-audiences-heading" surface="dark" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ul className="mt-14 border-t border-line-on-dark lg:mt-20">
          {securityAudiences.map((audience, index) => (
            <li
              key={audience.id}
              className="reveal group/row grid items-center gap-x-10 gap-y-5 border-b border-line-on-dark py-10 lg:grid-cols-12 lg:py-14"
              style={{ "--i": index } as CSSProperties}
            >
              <div className="flex items-center gap-6 lg:col-span-7">
                <span className="relative grid size-20 shrink-0 place-items-center text-gold sm:size-24">
                  <Viewfinder
                    cornerClassName="size-4 border-2"
                    className="inset-0 transition-[inset] duration-500 ease-(--ease-standard) group-hover/row:inset-2"
                  />
                  <SecurityIcon name={audience.icon} className="size-10 sm:size-12" strokeWidth={1.25} />
                </span>
                <h3 className="break-words text-[clamp(1.875rem,1.2rem+3.2vw,3.75rem)] leading-none font-extrabold tracking-tight text-white uppercase">
                  {audience.label}
                </h3>
              </div>

              <div className="lg:col-span-5">
                <p className="text-lead text-white">{audience.includes}</p>
                <p className="mt-3 max-w-md text-body text-on-dark-muted">{audience.focus}</p>
                <IllustrativePhoto
                  image={securityAudienceImages[audience.id]}
                  aspect="16 / 9"
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="mt-8 border-t-[3px] border-gold"
                />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
