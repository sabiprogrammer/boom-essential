import type { CSSProperties } from "react";
import { projectGallery } from "@/content/project-photos";
import { projectsContent } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The installation photographs as an editorial run: photographs keep their own proportions and flow down
 * three columns, each with a number and a short factual caption. Deliberately not a grid of identical cards.
 */
export function ProjectGallerySection() {
  const { eyebrow, heading, lead, label } = projectsContent.gallery;

  return (
    <Section tone="light" space="lg" aria-labelledby="projects-gallery-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="projects-gallery-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ul aria-label={label} className="mt-14 columns-1 gap-x-8 sm:columns-2 lg:mt-20 lg:columns-3 lg:gap-x-10">
          {projectGallery.map((photo, index) => (
            <li
              key={photo.src}
              className="reveal mb-10 break-inside-avoid lg:mb-12"
              style={{ "--i": index % 3 } as CSSProperties}
            >
              <PhotoFigure
                photo={photo}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                priority={index === 0}
              />
              <p aria-hidden="true" className="mt-1 font-heading text-xs font-bold tracking-[0.16em] text-navy">
                {String(index + 1).padStart(2, "0")}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
