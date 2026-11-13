import type { Metadata } from "next";
import { company } from "@/content/company";
import { ClosingContactSection } from "@/components/home/ClosingContactSection";
import { CoreValuesSection } from "@/components/home/CoreValuesSection";
import { DivisionsSection } from "@/components/home/DivisionsSection";
import { FeaturedSolutionsSection } from "@/components/home/FeaturedSolutionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowWeWorkSection } from "@/components/home/HowWeWorkSection";
import { IndustrialEquipmentSection } from "@/components/home/IndustrialEquipmentSection";
import { OurWorkSection } from "@/components/home/OurWorkSection";
import { IntroSection } from "@/components/home/IntroSection";
import { LeadershipPreviewSection } from "@/components/home/LeadershipPreviewSection";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

const title = `${company.shortName}: Power. Protection. Provision.`;
const description =
  "Boom Multi Global Company Limited is a Nigerian company with its head office in Akure, Ondo State, and three principal divisions: BOOM Energy (solar power and energy solutions), BOOM Security (security and surveillance) and BOOM Foods (food and agricultural products).";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/",
    title,
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

/** Homepage (Stage 2). Section order alternates dark and light for rhythm. */
export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HeroSection />
      <IntroSection />
      <DivisionsSection />
      <FeaturedSolutionsSection />
      <IndustrialEquipmentSection />
      <OurWorkSection />
      <CoreValuesSection />
      <HowWeWorkSection />
      <LeadershipPreviewSection />
      <ClosingContactSection />
    </>
  );
}
