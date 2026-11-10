import type { Metadata } from "next";
import { company } from "@/content/company";
import { SecurityApproachSection } from "@/components/security/SecurityApproachSection";
import { SecurityAudienceSection } from "@/components/security/SecurityAudienceSection";
import { SecurityClosingSection } from "@/components/security/SecurityClosingSection";
import { SecurityEquipmentSection } from "@/components/security/SecurityEquipmentSection";
import { SecurityHero } from "@/components/security/SecurityHero";
import { SecurityIntroSection } from "@/components/security/SecurityIntroSection";
import { SecurityServicesSection } from "@/components/security/SecurityServicesSection";

const title = "BOOM Security: Security and Surveillance Solutions";
const description =
  "BOOM SECURITY, a division of Boom Multi Global, with its head office in Akure, Ondo State, provides security and surveillance solutions: CCTV sales, supply, installation and maintenance, security fencing, access control, remote monitoring and security assessment for homes, businesses and institutions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/security" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/security",
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

/** BOOM Security (Stage 5). Charcoal hero, then light, charcoal, tint, white, navy, white and a navy close. */
export default function SecurityPage() {
  return (
    <>
      <SecurityHero />
      <SecurityIntroSection />
      <SecurityServicesSection />
      <SecurityEquipmentSection />
      <SecurityAudienceSection />
      <SecurityApproachSection />
      <SecurityClosingSection />
    </>
  );
}
