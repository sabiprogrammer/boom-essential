import { projectGallery } from "@/content/project-photos";
import { projectsContent } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { arrangeGallery } from "./gallery-layout";
import { ProjectTile } from "./ProjectTile";

/**
 * The installation photographs as a row-aligned grid: a 12-column grid from desktop, two columns on tablets and
 * one on phones. Tiles in a row share one height (see `gallery-layout.ts`), so the rows have clean edges, and the
 * numbering reads left to right. Deliberately not a masonry: masonry leaves ragged column ends and numbers
 * that run down the columns instead of across.
 */
export function ProjectGallerySection() {
  const { eyebrow, heading, lead, label } = projectsContent.gallery;
  const tiles = arrangeGallery(projectGallery);

  return (
    <Section tone="light" space="lg" aria-labelledby="projects-gallery-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="projects-gallery-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <ul
          aria-label={label}
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12"
        >
          {tiles.map((tile) => (
            <ProjectTile key={tile.photo.src} tile={tile} total={tiles.length} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
