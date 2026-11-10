import type { Metadata } from "next";
import { company } from "@/content/company";
import { AboutClosingSection } from "@/components/about/AboutClosingSection";
import { AboutDivisionsSection } from "@/components/about/AboutDivisionsSection";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutValuesSection } from "@/components/about/AboutValuesSection";
import { LeadershipSection } from "@/components/about/LeadershipSection";
import { WhoWeAreSection } from "@/components/about/WhoWeAreSection";

const title = "About Us";
const description =
  "Boom Multi Global Company Limited is an indigenous Nigerian company with its head office in Akure, Ondo State, operating across energy, security and food supply. Meet our core values, our three principal divisions and our management team.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/about",
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

/** About Us (Stage 3). Navy hero, then light, tint, white, tint and a navy close. */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAreSection />
      <AboutValuesSection />
      <AboutDivisionsSection />
      <LeadershipSection />
      <AboutClosingSection />
    </>
  );
}
