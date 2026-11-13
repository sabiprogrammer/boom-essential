import type { CSSProperties } from "react";
import { homeWork } from "@/content/home-work";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "Our work": four of the client's own installation photographs in a staggered row, with a link to the Projects
 * page. Real photographs only, so no "illustrative" label; captions are the factual ones used on /projects.
 */
export function OurWorkSection() {
  const { eyebrow, heading, lead, cta, photos } = homeWork;

  return (
    <Section tone="white" aria-labelledby="our-work-heading">
      <Container>
        <div className="reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <SectionHeading id="our-work-heading" eyebrow={eyebrow} title={heading} lead={lead} />
          <ButtonLink href={cta.href} variant="secondary" arrow>
            {cta.label}
          </ButtonLink>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
          {photos.map(({ photo, position }, index) => (
            <li
              key={photo.src}
              className={`reveal ${index % 2 === 1 ? "lg:mt-12" : ""}`}
              style={{ "--i": index } as CSSProperties}
            >
              <PhotoFigure photo={photo} aspect="4 / 5" position={position} sizes="(min-width: 1024px) 22vw, 46vw" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
