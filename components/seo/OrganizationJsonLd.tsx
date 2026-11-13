import { company } from "@/content/company";

/**
 * schema.org Organization data built only from confirmed company facts
 * (name, website, telephone, email, address, logo). No ratings, awards, social profiles or hours.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    url: `https://${company.website}`,
    logo: `https://${company.website}/assets/branding/boom-multi-global-logo.jpeg`,
    slogan: company.tagline,
    telephone: company.phone.display,
    email: company.email.general.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Petrocam Filling Station, Federal Housing Estate, Shagari",
      addressLocality: "Akure",
      addressRegion: "Ondo State",
      addressCountry: "NG",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Static, trusted content built above; `<` is escaped to keep the payload inert inside HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
