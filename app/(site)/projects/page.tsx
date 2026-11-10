import type { Metadata } from "next";
import { company } from "@/content/company";
import { projectsContent } from "@/content/projects";
import { ProjectGallerySection } from "@/components/projects/ProjectGallerySection";
import { EnquiryBand } from "@/components/sections/EnquiryBand";
import { PageHeader } from "@/components/sections/PageHeader";

const title = "Projects: Inverter and Battery Installations";
const description =
  "A selection of inverter and battery installations by Boom Multi Global. See the work, then request a solar assessment from our team in Akure, Ondo State.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/projects",
    title: `${title} | ${company.shortName}`,
    description,
    images: [
      {
        url: "/assets/branding/boom-multi-global-logo.jpeg",
        width: 1080,
        height: 1080,
        alt: "Boom Multi Global logo",
      },
    ],
  },
};

/** Projects: client-supplied installation photographs only. No names, places, dates or capacities. */
export default function ProjectsPage() {
  const { header, closing } = projectsContent;

  return (
    <>
      <PageHeader id="projects-heading" eyebrow={header.eyebrow} title={header.title} lead={header.lead} />
      <ProjectGallerySection />
      <EnquiryBand
        id="projects-closing-heading"
        eyebrow={closing.eyebrow}
        heading={closing.heading}
        copy={closing.copy}
        primary={closing.primary}
      />
    </>
  );
}
