import type { Metadata } from "next";
import { company } from "@/content/company";
import { privacyContent } from "@/content/privacy";
import { PrivacyDocument } from "@/components/privacy/PrivacyDocument";
import { PageHeader } from "@/components/sections/PageHeader";

const title = "Privacy Notice";
const description =
  "How Boom Multi Global Company Limited handles the personal information you send through this website, your rights under Nigerian data protection law, and how to contact us about your information.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/privacy",
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

/**
 * Privacy Notice. Static content only (content/privacy.ts): every statement describes what the website and its database
 * actually do. No retention period, data-sharing arrangement or privacy officer is stated because none has been confirmed.
 */
export default function PrivacyPage() {
  const { header } = privacyContent;

  return (
    <>
      <PageHeader id="privacy-heading" eyebrow={header.eyebrow} title={header.title} lead={header.lead} />
      <PrivacyDocument />
    </>
  );
}
