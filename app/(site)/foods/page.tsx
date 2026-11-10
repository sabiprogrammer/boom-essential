import type { Metadata } from "next";
import { company } from "@/content/company";
import { FoodsAudienceSection } from "@/components/foods/FoodsAudienceSection";
import { FoodsClosingSection } from "@/components/foods/FoodsClosingSection";
import { FoodsHero } from "@/components/foods/FoodsHero";
import { FoodsIntroSection } from "@/components/foods/FoodsIntroSection";
import { HouseholdStaplesSection } from "@/components/foods/HouseholdStaplesSection";
import { ProteinProductsSection } from "@/components/foods/ProteinProductsSection";
import { SupplyEnquirySection } from "@/components/foods/SupplyEnquirySection";

const title = "BOOM Foods: Food and Agricultural Products";
const description =
  "BOOM FOODS, a division of Boom Multi Global, with its head office in Akure, Ondo State, supplies food and agricultural products: garri, Garri Ekiti, fufu powder, Ofada rice and Igbemo rice in bag sizes from 1kg to 100kg, plus smoked fish and frozen chicken. Enquire about products and quantities.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/foods" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/foods",
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

/** BOOM Foods (Stage 6). Warm White hero, then leaf, white, light, light, leaf and a green close. */
export default function FoodsPage() {
  return (
    <>
      <FoodsHero />
      <FoodsIntroSection />
      <HouseholdStaplesSection />
      <ProteinProductsSection />
      <FoodsAudienceSection />
      <SupplyEnquirySection />
      <FoodsClosingSection />
    </>
  );
}
