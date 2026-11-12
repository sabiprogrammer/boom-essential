import { categoryEnquiryHref } from "./enquiry-options";
import type { IllustrativeImage } from "./illustrative-image";
import { divisionEnquiryHref } from "./enquiry-links";
import { foodProducts, foodsEnquiryHref } from "./foods";
import { industrialEnquiryHref } from "./industrial-equipment";
import { productPhotos } from "./product-photos";
import { projectPhotos } from "./project-photos";
import { securityIllustrativeImages } from "./security-illustrative-images";
import type { SitePhoto } from "./site-photo";

/**
 * The Products catalogue (client request, 10 Nov 2026). Product names and descriptions repeat the confirmed
 * wording of the division pages; nothing is added. NO PRICES anywhere: not in data, not in wording, and the
 * flyer price panels are cropped out of the machine photographs. Never add brands, models, specifications,
 * sizes, capacities or availability. Pictures: authentic client photographs where they exist; otherwise a
 * drawing or a stock photograph, both labelled illustrative.
 */

export type CatalogueDrawing = "recorder" | "signal";

export type CatalogueVisual =
  | { kind: "photo"; photo: SitePhoto; note?: string; fit?: "cover" | "contain" }
  | { kind: "drawing"; drawing: CatalogueDrawing }
  /** A stock photograph used as an illustration: always labelled, never presented as BOOM work. */
  | { kind: "illustrative"; image: IllustrativeImage };

export type CatalogueItem = {
  slug: string;
  name: string;
  description?: string;
  visual?: CatalogueVisual;
  enquiryHref: string;
};

export type CatalogueSectionData = {
  id: "energy" | "security" | "foods" | "industrial";
  eyebrow: string;
  heading: string;
  lead: string;
  pageHref: string;
  pageLabel: string;
  items: readonly CatalogueItem[];
};

export const catalogueHeader = {
  eyebrow: "Products catalogue",
  title: "Our Products.",
  lead: "What we supply across energy, security and food, and our pounding machines.",
  priceNote: "Prices are not listed on this site. Tell us what you need and our team will talk you through it.",
} as const;

export const catalogueEnquiryLabel = "Enquire";
export const catalogueIllustrativeNote = "Illustrative drawing. Not a BOOM product.";

export const catalogueSections: readonly CatalogueSectionData[] = [
  {
    id: "energy",
    eyebrow: "BOOM Energy",
    heading: "Power Equipment.",
    lead: "Inverter, battery and solar lighting equipment, supplied by our energy division.",
    pageHref: "/energy",
    pageLabel: "See BOOM Energy",
    items: [
      {
        slug: "inverter-solutions",
        name: "Inverter systems",
        description: "Supply, installation, configuration and servicing of inverter systems.",
        visual: { kind: "photo", photo: projectPhotos.inverterWall },
        enquiryHref: divisionEnquiryHref("energy", "inverter-solutions"),
      },
      {
        slug: "battery-storage",
        name: "Battery storage",
        description: "Battery systems for energy storage, backup power and improved system performance.",
        visual: { kind: "photo", photo: projectPhotos.batteryRacks },
        enquiryHref: divisionEnquiryHref("energy", "battery-storage"),
      },
      {
        slug: "solar-street-lights",
        name: "Solar street lights",
        description: "Solar-powered street lights for outdoor and roadside lighting.",
        visual: { kind: "photo", photo: productPhotos.streetLights },
        enquiryHref: categoryEnquiryHref("energy"),
      },
    ],
  },
  {
    id: "security",
    eyebrow: "BOOM Security",
    heading: "Surveillance and Security Equipment.",
    lead: "CCTV, recording, fencing, access control and remote monitoring, supplied by our security division.",
    pageHref: "/security",
    pageLabel: "See BOOM Security",
    items: [
      {
        slug: "cctv-cameras",
        name: "CCTV cameras",
        description: "Supply of CCTV cameras, recording equipment, storage devices and related surveillance accessories.",
        visual: { kind: "photo", photo: productPhotos.ptzCamera, note: "Product image", fit: "contain" },
        enquiryHref: divisionEnquiryHref("security", "cctv-sales-supply"),
      },
      {
        slug: "recording-equipment",
        name: "Recording equipment and storage",
        description: "Recording equipment and storage devices for CCTV systems.",
        visual: { kind: "drawing", drawing: "recorder" },
        enquiryHref: divisionEnquiryHref("security", "cctv-sales-supply"),
      },
      {
        slug: "security-fencing",
        name: "Security fencing",
        description:
          "Supply and installation of security fencing solutions designed to strengthen property boundaries and improve perimeter protection.",
        visual: { kind: "illustrative", image: securityIllustrativeImages.perimeterFence },
        enquiryHref: divisionEnquiryHref("security", "security-fencing"),
      },
      {
        slug: "access-control",
        name: "Access control",
        description: "Installation and configuration of access control systems for controlled entry and restricted areas.",
        visual: { kind: "illustrative", image: securityIllustrativeImages.accessControl },
        enquiryHref: divisionEnquiryHref("security", "access-control"),
      },
      {
        slug: "remote-monitoring",
        name: "Remote monitoring",
        description:
          "Setup and support for remote surveillance and monitoring systems, subject to available technology and connectivity.",
        visual: { kind: "drawing", drawing: "signal" },
        enquiryHref: divisionEnquiryHref("security", "remote-monitoring"),
      },
    ],
  },
  {
    id: "foods",
    eyebrow: "BOOM Foods",
    heading: "Food and Agricultural Products.",
    lead: "Household staples are supplied in bag sizes ranging from 1kg to 100kg. For any product, tell us the product and the quantity you need.",
    pageHref: "/foods",
    pageLabel: "See BOOM Foods",
    items: foodProducts.map((product) => ({
      slug: product.slug,
      name: product.name,
      description: product.description,
      enquiryHref: foodsEnquiryHref(product.slug),
    })),
  },
  {
    id: "industrial",
    eyebrow: "Additional offering · Industrial Equipment",
    heading: "Pounding Machines.",
    lead: "Pounding machines are supplied in different sizes for the restaurant business. They are an additional offering, separate from the three divisions.",
    pageHref: "/industrial-equipment",
    pageLabel: "See Industrial Equipment",
    items: [
      {
        slug: "pounding-machine",
        name: "Pounding machine",
        visual: { kind: "photo", photo: productPhotos.poundingMachine },
        enquiryHref: industrialEnquiryHref(),
      },
      {
        slug: "pounding-machines-smaller",
        name: "Smaller pounding machines",
        visual: { kind: "photo", photo: productPhotos.poundingMachinesSmall },
        enquiryHref: industrialEnquiryHref(),
      },
    ],
  },
];
