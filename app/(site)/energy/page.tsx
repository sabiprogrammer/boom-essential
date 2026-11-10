import type { Metadata } from "next";
import { company } from "@/content/company";
import { ApproachSection } from "@/components/energy/ApproachSection";
import { EnergyClosingSection } from "@/components/energy/EnergyClosingSection";
import { EnergyHero } from "@/components/energy/EnergyHero";
import { EnergyIntroSection } from "@/components/energy/EnergyIntroSection";
import { EnergyServicesSection } from "@/components/energy/EnergyServicesSection";
import { WhoWeServeSection } from "@/components/energy/WhoWeServeSection";

const title = "BOOM Energy: Solar Power and Energy Solutions";
const description =
  "BOOM ENERGY, a division of Boom Multi Global, with its head office in Akure, Ondo State, provides solar power and energy solutions: energy assessment and power audits, solar system design and installation, inverters, battery storage, maintenance and upgrades for homes, businesses and institutions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/energy" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/energy",
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

/** BOOM Energy (Stage 4). Navy hero, then light, white, charcoal, tint, navy, white and a navy close. */
export default function EnergyPage() {
  return (
    <>
      <EnergyHero />
      <EnergyIntroSection />
      <EnergyServicesSection />
      <WhoWeServeSection />
      <ApproachSection />
      <EnergyClosingSection />
    </>
  );
}
