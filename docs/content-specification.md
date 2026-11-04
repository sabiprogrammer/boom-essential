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
- Public name: **BOOM ENERGY** (client-confirmed). Do not use "BOOM SOLAR" on the site; it is an older branding reference from promotional materials.
- Intro: Solar Power and Energy Solutions.
- Services **[Confirmed]**: energy assessment and power audits; solar system design; solar installation; inverter solutions; battery storage; maintenance; upgrades; residential solar; commercial and institutional solar.
- Who it is for: homeowners, businesses, offices, commercial property owners, schools, hotels, organisations (from flyers; **[Confirm]**).
- Solar enquiry form; link to appointment request; WhatsApp link.

### BOOM Security
- Intro: Security and Surveillance Solutions.
- Services **[Confirmed]**: CCTV sales and supply; CCTV installation; CCTV maintenance and support; security fencing; access control; remote monitoring; security assessment.
- No supplied product, brand or project detail. Descriptions stay at service level; no brand names or specs.
- Security enquiry form; appointment link; WhatsApp link.

### BOOM Foods
- Intro: Food and Agricultural Products.
- Products **[Confirmed]**: Garri; Ekiti Garri; Fufu powder; Ofada rice; Igbemo rice; Smoked fish; Frozen chicken. Each listed by name with an "Enquire" action that preselects the product.
- **No prices, "from ₦", or price-implying language.** Wording such as "affordable" (on flyers) needs care; **[Confirm]**.
- Short per-product descriptions only if supplied (origin of Ekiti Garri / Igbemo rice etc. must not be invented).
- Food enquiry form with product + quantity; WhatsApp link.
- Flyer items outside the brief (livestock, raw/processed foods, bulk supply): **[Confirm]** before including.

### Industrial Equipment
- Intro: industrial food-processing equipment, particularly pounding machines. **[Confirmed]**
- No specifications, capacities, prices, brands or images supplied: **[Confirm]**. Page should be built to hold a product list later.
- Industrial equipment enquiry form; WhatsApp link.
- Must read as an additional offering, not a fourth division (no division logo or colour block parity with the other three).

### Contact Us
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
