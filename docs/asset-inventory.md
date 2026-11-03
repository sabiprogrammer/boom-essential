# Asset Inventory

Source: `boom-client-assets/` (17 image files + README). Inspected 2026-11-03. Dimensions measured from the files. **Originals must never be edited, recoloured, distorted or overwritten.** Production copies are made only at implementation time, into the app's `public/` folder (cropping proportionally and format conversion/resizing for delivery are permitted; retouching is not).

Labels: see `project-overview.md`.

## 1. Branding

| File | Size | Contents | Notes |
|---|---|---|---|
| `branding/boom-multi-global-logo.jpeg` | 1080×1080 | Master logo: navy circle with gold ring, white "B" with gold swoosh and bars, "BOOM" white, "MULTI GLOBAL" gold, tagline "POWER. PROTECTION. PROVISION." | JPEG on a white square (no transparency). Usable on light backgrounds as-is; on navy sections it will show a white square. Need vector/transparent version. |

## 2. Leadership photographs

| File | Size | Person / position (per client README) | Observations | Suitability |
|---|---|---|---|---|
| `leadership/01-ceo-olarewaju-olawale-oba.jpeg` | 413×531 | Olarewaju Olawale Oba — Chief Executive Officer | Passport-style: white background, dark suit, purple tie. **Low resolution**; will look soft beyond ~200 px wide on standard screens, poor on retina. | Usable only small. **Request higher-resolution original.** The CEO is the most prominent profile, so this matters most. |
| `leadership/02-chief-technical-adviser-sijin-vijayan.jpeg` | 1080×1421 | Sijin Vijayan — Chief Technical Adviser | **Casual** outdoor photo (t-shirt, sunglasses-style tinted glasses, blurred background). A thin black bar along the top edge and a video "mute" icon at bottom right are baked into the image (looks like a screenshot from a video). | Resolution fine, but style clashes with the formal set. Cropping to head-and-shoulders would remove the artefacts (a crop, not a retouch), but the tone mismatch remains. **Recommend requesting a formal portrait.** |
| `leadership/03-head-global-partners-expansion-ademola-olanrewaju.jpeg` | 1080×1080 | Ademola Olanrewaju — Head, Global Partners & Expansion | Studio-style, neutral grey backdrop, dark suit. Good quality. | Good. |
| `leadership/04-head-human-resources-abiola-favour.jpeg` | 688×904 | Abiola Favour — Head of Human Resources | Studio-style, neutral grey backdrop, dark suit. Moderate resolution. | Good at typical profile sizes. |
| `leadership/05-customer-experience-manager-adeola-jejelowo.jpeg` | 1080×1044 | Adeola Jejelowo — Customer Experience Manager | Studio-style, neutral grey backdrop, dark blazer. Good quality. | Good. |

**Consistency note:** 03/04/05 share a similar studio look; 01 (white passport background) and 02 (casual outdoor) do not. A consistent About-page portrait set will need either replacement photos or a layout that tolerates the difference. Never recolour or replace backgrounds.

**Proposed handling:** crop to a common 4:5 portrait ratio with faces preserved; display photo, full name and official position only. Positions are exactly as in the client README (note the spelling "Adviser").

## 3. Marketing references (reference only — not site content)

All are flyer/graphic artwork. The product shots, houses, freezers and food arrangements inside them are **illustrative artwork, not photographs of Boom products or projects** (garbled on-product text and mock-up logos are visible, e.g. on the freezer image). They must not be shown as real installations, products or customers. Their text content can inform copy only after client confirmation.

| File | Size | Contents | Use |
|---|---|---|---|
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.21.jpeg` | 1280×511 | **BOOM FOODS horizontal logo** (B-mark with green leaf/field stripes, "BOOM FOODS", "GOOD FOOD. HEALTHY LIVES.") with a WhatsApp number badge, on white | Foods logo source. Embedded phone badge makes it unsuitable as-is for the header. Need a clean version. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.2133.jpeg` | 1254×1254 | **BOOM FOODS stacked logo**, same marks and number badge, on white | Same as above. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.2288.jpeg` | 1254×1254 | BOOM Foods flyer: "Food and agricultural products", illustrative food imagery, tiles for smoked fish, frozen chicken, raw food products, processed foods, livestock, bulk food supply | Reference. Product list differs from the brief (see Outstanding information). Claims "from our farms and trusted sources": unconfirmed. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.22.jpeg` | 1080×720 | BOOM SOLAR landscape flyer: "Power Your Home & Business with Clean Energy", nine service icons, office address, WhatsApp | Reference for the Energy service list (matches the brief). Contains the **only BOOM SOLAR logo variant** (embedded). |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.22 (1).jpeg` | 1080×1080 | "All-in-One Energy Storage System" infographic (inverter/battery diagram, 500W / 6IN1 / 8.3kWh / LiFePO4 text) | Reference. Technical specs unverified; do not publish. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.23.jpeg` | 1080×1080 | Alternate layout of the All-in-One Energy Storage System infographic | Reference. Same caveat. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.23 (1).jpeg` | 1024×1024 | Generated-looking warehouse scene: "Boom Deep Freezer 600 Liters" with solar panels, inverter and a banner with distorted text | Reference only. **Not a real product photo.** Deep freezer is not in any listed division. |
| `marketing-references/WhatsApp Image 2026-10-27 at 10.08.23 (2).jpeg` | 1024×1024 | BOOM SOLAR flyer: deep freezer, panels and battery; panel listing "Target Customers", "Location", WhatsApp | Reference. Gives target-customer wording (homeowners, businesses, offices, commercial property owners, schools, hotels, organisations): needs confirmation. |
| `marketing-references/flyer1.jpeg` | 1080×1080 | BOOM SOLAR flyer: "Clean Energy. Brighter Future. For homes / businesses / communities", seven service icons, phone shown as +2348166503634 | Reference. |
| `marketing-references/flyer2.jpeg` | 720×1080 | BOOM SOLAR portrait flyer: "Save Energy. Grow Your Future.", describes the company as providing "reliable, high-quality solar solutions… across Nigeria", nine services | Reference. The "across Nigeria" and quality claims are unconfirmed. |

## 4. Other

| File | Size | Notes |
|---|---|---|
| `asset-index.jpg` | 840×1230 | Contact sheet of the above. Review aid only; never deploy. |
| `README.md` | — | Client-side usage rules (already reflected in `CLAUDE.md`). |

## 4a. Temporary illustrative images (homepage division visuals)  **[Temporary — must be replaced]**

Supplied by Sabi Programmers on 2026-11-03 in `boom-homepage-assets-individual/` (three separate files plus a README; the folder and its zip sit in the project root as reference and are never served). Byte-identical copies are in `public/assets/images/homepage/illustrative/` and are wired up in `content/division-images.ts`.

**Provenance:** all three are **AI-generated illustrations**. None depicts a verified BOOM MULTI GLOBAL installation, product, employee, premises or completed project. They are not photographs and must never be captioned or presented as company work.

| File (`public/assets/images/homepage/illustrative/`) | Size | Used for | Notes |
|---|---|---|---|
| `01-boom-energy-solar-roof-illustrative.jpg` | 1672×941 | BOOM Energy panel (homepage) | Independently generated landscape. Cropped with `object-fit: cover`, positioned right so the inverter and battery stay in view. |
| `02-boom-security-cctv-perimeter-illustrative.jpg` | 844×464 | BOOM Security panel (homepage) | Panel extracted from a generated triptych. **Low resolution** (soft on large or high-density screens). A sliver of the neighbouring panel along the left edge is trimmed in CSS. The camera carries a garbled mock logo that resembles no real mark; another reason it cannot pass as real. |
| `03-boom-foods-nigerian-staple-foods-illustrative.jpg` | 1672×467 | BOOM Foods panel (homepage) | Panel extracted from the same triptych. Panoramic (3.6:1), so it is shown whole at its own aspect ratio, never cropped to the panel. A white strip along the top edge is trimmed in CSS. |

**Presentation rules in force:** a visible "Illustrative image" label on each; honest alt text that says the image is AI-generated and not a photograph of BOOM work; the originals are never edited (cropping is done in CSS).

**Permitted use:** homepage division visuals only. **Not permitted:** leadership profiles, product specifications, project evidence, testimonials, or any claim about what BOOM supplies, installs or stocks. Do not reuse them on the division pages as if they were that division's real work; if they appear elsewhere they need the same label and Sabi Programmers' approval.

**Replacement requirement:** swap each for an authentic client photograph as soon as one is available (priority 1 in §7). To replace: copy the approved photo into `public/`, update that division's entry in `content/division-images.ts` (new `src`, `alt`, dimensions, `illustrative: false`), then delete the old file from `public/assets/images/homepage/illustrative/`. The "Illustrative image" label disappears automatically when `illustrative` is `false`. Remove this section once all three are replaced.

## 5. Recurring facts seen in client materials

- WhatsApp +234 816 650 3634 appears on all flyers (written variously as `+234 816 650 3634` and `+2348166503634`). The main phone +234 805 554 4415 appears on none. Use the formats in the brief.
- Office address on flyers matches the brief. Some flyers say only "Akure, Ondo State, Nigeria".
- Flyer taglines: "Reliable Energy. Smarter Investments." (on the older BOOM SOLAR flyers; the public name is BOOM ENERGY); "Good Food. Healthy Lives." and "Quality Food for a Healthier Tomorrow" (Foods). Client-written marketing lines, but confirm before using as site copy.
- Flyer text about "Ideal for / Target customers": homeowners, businesses, offices, commercial property owners, schools, hotels and organisations.

## 6. Proposed page usage (once approved and processed)

| Page | Approved assets available now | Gap |
|---|---|---|
| Header/footer, all pages | Master logo (JPEG) | Vector/transparent logo |
| Home | Master logo, division naming; three temporary illustrative (AI-generated) division images, §4a | Hero photography; authentic per-division photos to replace the illustrations |
| About Us | Five portraits (01 and 02 caveats) | Consistent portraits; office/team photos |
| BOOM Energy | Only an older "BOOM SOLAR" mark exists, embedded in flyers (not the public name) | Real installation/product photos; standalone BOOM Energy logo |
| BOOM Security | none | Everything: logo, photos, product info |
| BOOM Foods | Foods logos (with phone badge) | Product photos (garri, fufu, rice, fish, chicken); clean logo |
| Industrial Equipment | none | Pounding-machine photos, specs, logo |
| Contact Us | Address and phones from brief | Map pin, email, hours |
| Admin | Master logo | — |

## 7. Missing assets and recommendations

1. **Real photography** for every division and the premises (priority 1). Recommend a half-day shoot in Akure: office exterior, solar installation or equipment, CCTV/fencing work, food products (each of the seven), pounding machines, team portraits.
2. **Vector logos** (SVG/AI/PDF) or transparent PNG for Master, BOOM Energy, BOOM Foods, plus BOOM Security and Industrial Equipment marks if they exist.
3. **Replacement portraits** for 01 (resolution) and 02 (formal, clean).
4. **Favicon/app icon and social share image**: derive from the master logo once vector is available (derivation needs approval).
5. **Product specification sheets** for anything we may describe (equipment, storage systems, freezers).
6. **Legal/company documents** if the client wants registration or certification shown.
7. Until real images arrive, use type-led layouts and clearly marked development placeholders; no generated or stock images presented as Boom's work. Illustrative supporting visuals (including stock) are considered only with Sabi Programmers' approval and must be clearly distinguished from real company work (`design-system.md` §8).
