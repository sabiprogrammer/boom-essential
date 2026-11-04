import type { Metadata } from "next";
import { company } from "@/content/company";
import { EnquiryJourneySection } from "@/components/industrial/EnquiryJourneySection";
import { IndustrialAudienceSection } from "@/components/industrial/IndustrialAudienceSection";
import { IndustrialClosingSection } from "@/components/industrial/IndustrialClosingSection";
import { IndustrialHero } from "@/components/industrial/IndustrialHero";
import { OfferingMapSection } from "@/components/industrial/OfferingMapSection";
import { OptionsSection } from "@/components/industrial/OptionsSection";
import { ProductIntroSection } from "@/components/industrial/ProductIntroSection";

const title = "Industrial Equipment: Pounding Machines for Restaurants";
const description =
  "Industrial Equipment is an additional offering of BOOM MULTI GLOBAL in Akure, Ondo State. We supply pounding machines in different sizes for the restaurant business. Contact our team to discuss available options and your equipment requirements.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/industrial-equipment" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/industrial-equipment",
    title: `${title} | ${company.shortName}`,
    description,
    images: [
      {
        url: "/assets/branding/boom-multi-global-logo.jpeg",
        width: 1080,
        height: 1080,
        alt: "BOOM MULTI GLOBAL logo",
      },
    ],
  },
};

/** Industrial Equipment (Stage 7): an additional offering, never a fourth division. */
export default function IndustrialEquipmentPage() {
  return (
    <>
      <IndustrialHero />
      <OfferingMapSection />
      <ProductIntroSection />
      <OptionsSection />
      <IndustrialAudienceSection />
      <EnquiryJourneySection />
      <IndustrialClosingSection />
    </>
  );
}
