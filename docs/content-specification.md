# Content Specification

Labels: **[Confirmed]**, **[Proposed]**, **[Recommendation]**, **[Confirm]** (see `project-overview.md`).

**Content rules.** Only use facts from the brief or confirmed by the client. No invented statistics, years in business, warranties, certifications, testimonials, client names, project counts or biographies. Marketing lines found on flyers are client-written but still need confirmation before use as site copy. Spelling: British (**[Confirm]**). Food prices never appear anywhere public.

## 1. Sitemap  **[Proposed]**

| Page | Route | Nav |
|---|---|---|
| Home | `/` | yes |
| About Us | `/about` | yes |
| BOOM Energy | `/energy` | yes (division) |
| BOOM Security | `/security` | yes (division) |
| BOOM Foods | `/foods` | yes (division) |
| Industrial Equipment | `/industrial-equipment` | yes (own item, visually distinct from the three divisions) |
| Contact Us | `/contact` | yes (primary action) |
| Admin login | `/admin/login` | **never** |
| Admin dashboard | `/admin/...` | **never**; `noindex`, disallowed in robots |
| Privacy notice | `/privacy` | footer only; needs client content **[Confirm]** |

Persistent elements: header (logo, nav, "Request a consultation" action), WhatsApp contact link, footer (address, phones, nav, tagline).

## 2. Page-by-page requirements

### Home
- Hero stating who the company is: BOOM MULTI GLOBAL and **POWER. PROTECTION. PROVISION.** Photography-led once real images exist.
- Three division entries (Energy = Power, Security = Protection, Foods = Provision). The tagline maps neatly onto the three divisions: **[Proposed]** use as the structural device. Confirm the client intends this reading.
- Short note that Industrial Equipment is also supplied, linking to its page, not presented as a division.
- Route-to-action band: enquire / request a consultation / WhatsApp.
- Contact strip with address and phones.
- Not allowed: statistics, "years of experience", client logos, testimonials.

**Implemented in Stage 2 (2026-11-03), in order:** Hero (headline "Practical Solutions for a Better Tomorrow.", tagline, three principal areas as rising bars, CTAs "Explore Our Solutions" → `#divisions` and "Talk to Our Team" → WhatsApp) · Company introduction ("One Company. Three Essential Solutions.") · Three divisions (Energy, Security, Foods, with the four highlights each and CTAs to `/energy`, `/security`, `/foods`) · Featured solutions (nine items named exactly as in this documentation, interleaved across divisions, no prices) · Industrial Equipment (secondary, "Additional offering", CTA to `/industrial-equipment`) · Core values (Customer-First, Honesty, Progress) · How we work (Listen, Understand, Work towards the right solution) · Leadership preview (names and positions only, link to About Us) · Closing contact ("Let's Talk About What You Need.", Request a Consultation, WhatsApp, Contact Us, both phone numbers).

**Wording supplied by Sabi Programmers in the Stage 2 brief** (not previously in these docs; used as instructed): hero headline and supporting copy; "indigenous Nigerian company operating across energy, security and food supply"; the customer-first listening approach; the Industrial Equipment line, which was later corrected (see below).

**Industrial Equipment wording (corrected 2026-11-04):** the original client information confirms pounding machines for the restaurant business, so the homepage now reads "We supply pounding machines in different sizes for the restaurant business. Contact our team to discuss available options and your equipment requirements." The earlier phrase "restaurants and food-processing businesses" must not be used.

**Core value wording (supplied 2026-11-03, client-confirmed):** the client's descriptions are now in `content/values.ts` and display on the homepage and About Us. Leadership portraits are intentionally not used on the homepage (they appear on About Us). "Indigenous" is confirmed by the About Us information supplied by Sabi Programmers, and the restaurant-business wording for pounding machines is confirmed by the original client information.

### About Us
**Implemented in Stage 3 (2026-11-03), in order:** About hero (eyebrow "About BOOM MULTI GLOBAL"; heading "A Company Built Around Essential Needs."; the tagline as three columns paired with the divisions) · Who we are ("More Than Products. A Commitment to Solutions.", the confirmed company statement, the three principal divisions, the listening belief) · Core values ("What Guides Us.") · Divisions ("Three Areas of Focus. One Company.", links to `/energy`, `/security`, `/foods`; Industrial Equipment only as a separate "Also supplied" note) · Leadership ("The People Behind BOOM MULTI GLOBAL.", five portraits with name and position only) · Closing ("Let's Build Something Valuable Together."; Explore Our Solutions, Contact Us, WhatsApp, both phone numbers). Copy is in `content/about.ts`. Nothing about founding year, history, headcount, statistics, partnerships, certifications or coverage is shown; none is confirmed.

- Company introduction, limited to confirmed facts (name, indigenous Nigerian company, Akure, three divisions, listening approach). **[Confirmed]**
- **Core values [Confirmed]**, from the client's original company profile: **Customer-First** ("We listen to our customers and feel their pain. Our customers are our priority."), **Honesty** ("We are very honest in our promises."), **Progress** ("We want to see our customers, communities, partners, employees thrive and progress every day."). Present exactly these three with exactly this wording. Do not add values or paraphrase.
- Leadership section: five portraits, each with full name and official position only (see §3).
- Division overview recap.
- **Mission and vision: [Confirm]** — not supplied. Do not write or imply them. Leave no placeholder text on the live page.

### BOOM Energy
**Implemented in Stage 4 (2026-11-04), in order:** Hero (eyebrow "BOOM Energy · Solar Power & Energy Solutions"; "Reliable Power. A Brighter Tomorrow."; CTAs "Request a Solar Assessment" → `/contact#appointment` and "Talk to Our Energy Team" → WhatsApp) · Introduction · Services (all nine, exact titles and descriptions supplied by Sabi Programmers, in four compositions) · Who we serve (Residential, Commercial, Institutional, with the property types as supplied and a general, non-numerical note on how needs differ) · Our approach (five steps: Consultation, Assessment, System Design, Installation, Support; no timings) · Closing ("Let's Find the Right Energy Solution for You."; Request a Solar Assessment, WhatsApp Our Team, both phone numbers). Copy lives in `content/energy.ts`. No system capacities, performance figures, warranties, manufacturer partnerships, certifications, statistics, testimonials, completed-project claims or response times appear; none are confirmed. The assessment CTA target is the single constant `solarAssessmentHref` (currently the appointment anchor; Stage 5 may point it at a dedicated solar enquiry form). No photography is used; the page relies on custom SVG/CSS artwork.

- Public name: **BOOM ENERGY** (client-confirmed). Do not use "BOOM SOLAR" on the site; it is an older branding reference from promotional materials.
- Intro: Solar Power and Energy Solutions.
- Services **[Confirmed]**: energy assessment and power audits; solar system design; solar installation; inverter solutions; battery storage; maintenance; upgrades; residential solar; commercial and institutional solar.
- Who it is for **[Confirmed, Stage 4 brief]**: Residential (homes, apartments and residential properties); Commercial (offices, shops, hotels, supermarkets and other business facilities); Institutional (schools, hospitals, factories, farms and other institutional properties). The older flyer wording (homeowners, commercial property owners, organisations) is not used.
- Solar enquiry form; link to appointment request; WhatsApp link.

### BOOM Security
**Implemented in Stage 5 (2026-11-04), in order:** Hero (eyebrow "BOOM Security · Security and Surveillance Solutions"; "Protect What Matters Most."; CTAs "Request a Security Assessment" → `/contact#appointment` and "Talk to Our Security Team" → WhatsApp) · Introduction ("A More Thoughtful Approach to Property Security.", with the four things considered: property layout, access points, perimeter areas, surveillance requirements) · Services (all seven, exact titles and descriptions supplied by Sabi Programmers, in three groups: surveillance, perimeter and entry, monitoring and assessment) · Who we serve (Residential, Commercial, Institutional, with the supplied property types and one hedged "may" line each) · Our approach (five steps; no timings, monitoring arrangements, warranties or service levels) · Closing ("Let's Discuss Your Security Requirements."; Request a Security Assessment, WhatsApp Our Team, both phone numbers). Copy is in `content/security.ts`. The assessment CTA target is the single constant `securityAssessmentHref`. No brands, models, specifications, camera counts, ranges, customer names or completed-installation claims appear. No photography is used: the hero plan and the service diagrams are custom SVG/CSS, and the hero schematic carries the caption "Illustrative schematic. Not a BOOM installation."

- Intro: Security and Surveillance Solutions.
- Services **[Confirmed]**: CCTV sales and supply; CCTV installation; CCTV maintenance and support; security fencing; access control; remote monitoring; security assessment.
- No supplied product, brand or project detail. Descriptions stay at service level; no brand names or specs.
- Security enquiry form; appointment link; WhatsApp link.

### BOOM Foods
**Implemented in Stage 6 (2026-11-04), in order:** Hero (eyebrow "BOOM Foods · Food and Agricultural Products"; "Good Food. Healthy Lives." from the supplied branding; the supplied statement "From our farms and trusted sources to your table."; CTAs "Enquire About Products" and "See Our Products"; an index of the seven products) · Introduction ("Everyday Food Products. Supplied With Care.") · Household staples (Garri, Ekiti Garri, Fufu Powder, Ofada Rice, Igbemo Rice, with the packaging line "Supplied in bag sizes ranging from 1kg to 100kg." from the original client information) · Protein products (Smoked Fish, Frozen Chicken, each with one generic description) · Who we serve (Households, Businesses, Organisations and Institutions, supplied wording) · Supply and enquiries ("Tell Us What You Need."; bulk and general enquiries welcome; enquiry route, WhatsApp, phone) · Closing ("Let's Talk About Your Food Supply Needs."; Enquire About Products, WhatsApp Our Team, Contact Us, both phone numbers). Copy and product data are in `content/foods.ts`.

**Product enquiry links.** Every product has an action "Enquire About This Product" whose destination names it: `/contact?division=foods&product=<slug>#enquiry`, with slugs `garri`, `ekiti-garri`, `fufu-powder`, `ofada-rice`, `igbemo-rice`, `smoked-fish`, `frozen-chicken`. A general link is `/contact?division=foods#enquiry`. Both are built by `foodsEnquiryHref()` in `content/foods.ts`, the only place that knows the path, parameter names and anchor. The Contact page (a later stage) should read `division` and `product` to preselect the food enquiry form, and provide an element with `id="enquiry"`. Until then the links lead to the 404 page.

**Content cautions.** No prices or price-implying wording, no checkout, payments, inventory or accounts. The packaging range is the only supplied size information: no per-product availability, weights, grades, species, cuts, brands, storage specifications, certifications or origins are stated. **[Confirm, launch blocker]** "From our farms and trusted sources to your table." is client-supplied marketing wording (client flyers, repeated in the Stage 6 brief), but whether BOOM actually operates farms is not confirmed. It is retained in the development build only and **must receive final client confirmation before public launch**; if it cannot be confirmed, remove or reword it (single source: `hero.statement` in `content/foods.ts`). No photography is used.

- Intro: Food and Agricultural Products.
- Products **[Confirmed]**: Garri; Ekiti Garri; Fufu powder; Ofada rice; Igbemo rice; Smoked fish; Frozen chicken. Each listed by name with an "Enquire" action that preselects the product.
- **No prices, "from ₦", or price-implying language.** Wording such as "affordable" (on flyers) needs care; **[Confirm]**.
- Short per-product descriptions only if supplied (origin of Ekiti Garri / Igbemo rice etc. must not be invented).
- Food enquiry form with product + quantity; WhatsApp link.
- Flyer items outside the brief (livestock, raw/processed foods, bulk supply): **[Confirm]** before including.

### Industrial Equipment
**Implemented in Stage 7 (2026-11-04), in order:** Hero (eyebrow "Additional offering · Industrial Equipment"; "Equipment for the Restaurant Business."; "We supply pounding machines in different sizes for people in the restaurant business."; CTAs "Enquire About Pounding Machines" and "WhatsApp Our Team") · "Where this fits" (a map: the three principal divisions as linked numbered entries, and Industrial Equipment as a separate dashed "Additional offering … You are here" marker; states it is not a fourth division) · Product introduction ("Pounding Machines for Restaurant Businesses.", with an at-a-glance sheet of confirmed facts only) · Available options ("Different Sizes. Options to Discuss.", a generic size-range drawing and an enquiry action) · Who it serves (restaurants; restaurant owners and operators, and nothing else) · Suggested enquiry journey (01 Tell Us What You Need, 02 Discuss Available Options, 03 Make an Enquiry; labelled a suggestion, not a fixed process) · Closing ("Let's Discuss Your Equipment Requirements."; both CTAs, both phone numbers). Copy is in `content/industrial-equipment.ts`.

**Enquiry link.** All enquiry actions use `/contact?offering=industrial-equipment&product=pounding-machine#enquiry`, built by `industrialEnquiryHref()` in `content/industrial-equipment.ts` (the only place that knows the path, parameter names and anchor). The Contact page (next stage) should read `offering` and `product` to preselect an Industrial Equipment enquiry and provide an element with `id="enquiry"`. Until then the links lead to the 404 page. (Foods uses `division=foods`; Industrial Equipment deliberately uses `offering=`, so it is never labelled a division.)

**Imagery.** No photographs of BOOM machines exist. The hero and options artwork are generic line drawings of equipment (not a BOOM machine, size, capacity or feature), captioned "Illustrative drawing. Not a BOOM machine." The flyer machine images are not used. The page is ready for a real photograph: set `industrialContent.productImage` in `content/industrial-equipment.ts` (authentic, approved image only) and it replaces the drawing and the caption in the hero.

**Content cautions.** No sizes, capacities, power ratings, dimensions, materials, brands, prices, warranties, certifications, or customer segments beyond the restaurant business (no factories or general food-processing companies). The corrected wording: pounding machines for the restaurant business (never "food-processing businesses").

- Intro (earlier documentation): industrial food-processing equipment, particularly pounding machines. **[Confirmed]** Public copy on the page and homepage now describes the offering as pounding machines for the restaurant business.
- No specifications, capacities, prices, brands or images supplied: **[Confirm]**. Page should be built to hold a product list later.
- Industrial equipment enquiry form; WhatsApp link.
- Must read as an additional offering, not a fourth division (no division logo or colour block parity with the other three).

### Contact Us
**Implemented in Stage 8 (2026-11-04), in order:** Hero (eyebrow "Get in touch"; "Let's Talk About What You Need."; an index of what the team can help with, each row linking to the enquiry form with that category chosen) · Contact information (Visit us: the office address; Call us: +234 805 554 4415, `tel:+2348055544415`; WhatsApp: +234 816 650 3634, `https://wa.me/2348166503634`) · Enquiry form (one form for every offering, with an optional appointment request). Copy is in `content/contact.ts`. **Not shown, because not supplied or confirmed:** a business email, opening hours, social links, a map or coordinates, and any response-time promise. There is no mailto link.

**The enquiry form (frontend only; it does not send anything yet).**
- *About you:* full name (required), phone number (required), email (optional), business or organisation (optional), location (optional).
- *What do you need:* required category (General Enquiry, BOOM Energy, BOOM Security, BOOM Foods, Industrial Equipment, the last set apart as an additional offering) and optional specific interests (multi-select) for the chosen category: Energy (9 services), Security (7), Foods (7 products), Industrial Equipment (Pounding Machines). The allowlist is `content/enquiry-options.ts`.
- *Your message:* required, 10 to 2,000 characters.
- *Appointment (optional):* tick "I would like to request an appointment." to reveal a preferred date and time, both required only then. The date must be today or later (Africa/Lagos). Notice always shown: "Appointment requests are subject to confirmation by our team. Submitting a request does not constitute a confirmed booking." No hours, durations, notice periods or consultation methods are stated. The block carries `id="appointment"`; the enquiry section carries `id="enquiry"`. The enquiry type shown on the form is "Enquiry" or "Appointment request".
- *Validation:* required fields, a phone check (Nigerian national `0` + 10 digits, `+234` / `234` numbers, or international `+` with 8 to 15 digits), an email check, length limits, an error summary that takes focus and links to each field, and inline messages with an icon (never colour alone).
- *Submission:* a validated, typed payload is built and passed to `submitEnquiry`, which today makes no network request, stores nothing and returns "not connected". The visitor then sees an honest preview notice ("has not been sent and nothing has been saved") with phone and WhatsApp actions. A persistent "Development preview" notice sits above the form. Loading, success and error panels exist for the backend stage; success is unreachable until a real server response exists. Values are held in memory only (no localStorage, sessionStorage or cookies).

**URL prefilling.** The page reads these (all validated against the allowlist; anything else is ignored):
- `division=energy|security|foods` or `offering=industrial-equipment` selects the category (`offering` wins if both are present).
- `product=<slug>` or `service=<slug>` (interchangeable) preselects that interest, only if it belongs to the chosen category.
- `#appointment` ticks the appointment request; `#enquiry` scrolls to the form (both offset below the sticky header).
- Examples: `/contact?division=foods&product=garri#enquiry`; `/contact?offering=industrial-equipment&product=pounding-machine#enquiry`; `/contact?division=energy&service=energy-assessment#appointment` (the "Request a Solar Assessment" action); `/contact?division=security&service=security-assessment#appointment`; `/contact?division=energy`; `/contact#appointment` (the header action). The Foods and Industrial Equipment link builders (`content/foods.ts`, `content/industrial-equipment.ts`) remain the source of truth for their patterns; the Energy and Security assessment actions now use `divisionAppointmentHref()` in `content/enquiry-links.ts`.

- Address, main phone, WhatsApp, website. **[Confirmed]**
- WhatsApp link: `https://wa.me/2348166503634` **[Confirmed number]**; click-to-call link for the main phone.
- General enquiry form and appointment request form (or a clear route to each).
- Map embed/pin, email address, opening hours: **[Confirm]**. A map embed is a third-party integration; static link to a map app is the lighter option **[Recommendation]**.

## 3. Leadership presentation  **[Confirmed content, Proposed layout]**

Order as supplied by the client:

| # | Name | Position |
|---|---|---|
| 1 | Olarewaju Olawale Oba | Chief Executive Officer |
| 2 | Sijin Vijayan | Chief Technical Adviser |
| 3 | Ademola Olanrewaju | Head, Global Partners & Expansion |
| 4 | Abiola Favour | Head of Human Resources |
| 5 | Adeola Jejelowo | Customer Experience Manager |

- Display photo, full name, position. Nothing else in the initial release. (Implemented: CEO as a featured entry, the other four on a staggered row; `LeadershipMember.bio` is an optional field for when biographies are supplied.)
- No placeholder biographies, quotes or "read more" links. The layout should leave room for biographies to be added later without redesign.
- Crop portraits proportionally to a common ratio with faces preserved; never retouch. Photo-quality issues for 01 and 02 are in `asset-inventory.md`.
- Alt text: "Portrait of {name}, {position}".

## 4. Forms

> **Stage 8 update:** the first implementation is ONE shared enquiry form for all offerings with an optional appointment request (see Contact Us above), not the six separate forms below. The per-offering fields listed below (property type, quantity and units, equipment details, appointment method and so on) are **not** implemented; add them only once the client confirms them. Treat the field lists below as the earlier proposal.

Common to all forms: client-side validation for UX plus server-side validation as the authority; honeypot and rate limiting; clear in-page confirmation after submit ("Your enquiry has been received", plus what happens next. Wording must not promise a response time unless confirmed **[Confirm]**); WhatsApp alternative beside every form; consent statement linked to the privacy notice **[Recommendation]**. Never auto-confirm appointments. Field lists below are **[Proposed]** pending client review.

**Shared fields:** full name (required), phone (required; Nigerian format validated, international tolerated), email (optional; none is required because notifications are out of scope), preferred contact method (phone / WhatsApp), message (optional, length-limited).

| Form | Specific fields |
|---|---|
| Solar enquiry | Service of interest (the nine Energy services, multi-select); property type (residential / commercial / institutional / other); location (town/state); current power situation (free text, optional) |
| Security enquiry | Service of interest (the seven Security services, multi-select); property type; location; number of cameras/areas (optional free text) |
| Food product enquiry | Product(s) from the seven-item list (multi-select), **quantity per product** (number + unit, units **[Confirm]**); delivery location; purpose (household / business / institution, optional). **No price fields anywhere.** |
| Industrial equipment enquiry | Equipment of interest (pounding machine preselected, "other food-processing equipment" option); quantity; business/organisation name (optional); location |
| General enquiry | Subject (optional), message (required); optionally which division it relates to |
| Appointment request | Division/topic; **preferred date**; **preferred time** (window vs exact slot **[Confirm]**); **consultation method** (options **[Confirm]**: phone call, WhatsApp call, video call, office visit, site visit); location (needed for site visit); short note. Status begins as "Requested". Copy must say the request is not confirmed until an administrator confirms it. |

Date/time rules (**[Proposed]**, hours **[Confirm]**): Africa/Lagos time (WAT); no past dates; a minimum notice period; limited booking horizon; disallow days/hours outside business hours.

Admin-side labels for status and division values are in `implementation-plan.md` (database planning).
