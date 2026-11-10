import type { Metadata } from "next";
import { careersContent } from "@/content/careers";
import { company } from "@/content/company";
import { CareersContactSection } from "@/components/careers/CareersContactSection";
import { PageHeader } from "@/components/sections/PageHeader";

const title = "Careers";
const description =
  "Interested in working with Boom Multi Global in Akure, Ondo State? Call or WhatsApp our team to ask about opportunities.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/careers" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/careers",
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

/** Careers: no vacancies, roles or application process have been supplied, so none are stated. */
export default function CareersPage() {
  const { header } = careersContent;

  return (
    <>
      <PageHeader id="careers-heading" eyebrow={header.eyebrow} title={header.title} lead={header.lead} />
      <CareersContactSection />
    </>
  );
}
