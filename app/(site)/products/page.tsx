import type { Metadata } from "next";
import { company } from "@/content/company";
import { catalogueHeader, catalogueSections } from "@/content/product-catalogue";
import { CatalogueSection } from "@/components/products/CatalogueSection";
import { EnquiryBand } from "@/components/sections/EnquiryBand";
import { PageHeader } from "@/components/sections/PageHeader";

const title = "Products Catalogue";
const description =
  "The products Boom Multi Global supplies: inverters and battery storage, CCTV and security equipment, food and agricultural products, and pounding machines. Tell our team what you need.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/products",
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

/** The Products catalogue: by division, then Industrial Equipment (an additional offering). No prices. */
export default function ProductsPage() {
  const tones = ["light", "white", "light", "white"] as const;

  return (
    <>
      <PageHeader
        id="products-heading"
        eyebrow={catalogueHeader.eyebrow}
        title={catalogueHeader.title}
        lead={
          <>
            {catalogueHeader.lead} <span className="mt-3 block text-base">{catalogueHeader.priceNote}</span>
          </>
        }
      />
      {catalogueSections.map((section, index) => (
        <CatalogueSection key={section.id} section={section} tone={tones[index]} />
      ))}
      <EnquiryBand
        id="products-closing-heading"
        eyebrow="Get in touch"
        heading="Not Sure What You Need?"
        copy="Tell us about your requirements and our team will help you find the right option."
        primary={{ label: "Make an Enquiry", href: "/contact#enquiry" }}
      />
    </>
  );
}
