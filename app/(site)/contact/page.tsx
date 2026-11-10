import type { Metadata } from "next";
import { company } from "@/content/company";
import { ContactChannelsSection } from "@/components/contact/ContactChannelsSection";
import { ContactHero } from "@/components/contact/ContactHero";
import { EnquirySection } from "@/components/contact/EnquirySection";

const title = "Contact Us";
const description =
  "Contact Boom Multi Global Company Limited in Akure, Ondo State, Nigeria. Visit our office, call or WhatsApp our team, or send one enquiry about BOOM Energy, BOOM Security, BOOM Foods or Industrial Equipment, with an optional appointment request.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.legalName,
    url: "/contact",
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

/** Contact Us and the customer enquiry interface (Stage 8). The form is a preview: it does not send anything yet. */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactChannelsSection />
      <EnquirySection />
    </>
  );
}
