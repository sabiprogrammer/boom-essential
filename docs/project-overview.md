# Project Overview — BOOM MULTI GLOBAL COMPANY LIMITED

Production website and private enquiry/appointment dashboard, delivered by Sabi Programmers.
Status: **preparation phase** (documentation only; no application code exists yet).

## Labelling convention (used in every doc)

| Label | Meaning |
|---|---|
| **[Confirmed]** | Stated by the client in the project brief or visible on client-supplied material they own. |
| **[Proposed]** | A design or content decision made by us; needs approval before it is treated as settled. |
| **[Recommendation]** | A technical recommendation from us; needs approval where it adds cost, a third party or an architectural choice. |
| **[Confirm]** | Information we do not have and must get from the client. Never fill these in ourselves. |

## 1. Company background

- **[Confirmed]** Company: BOOM MULTI GLOBAL COMPANY LIMITED, a Nigerian company.
- **[Confirmed]** Tagline: **POWER. PROTECTION. PROVISION.** (appears on the master logo).
- **[Confirmed]** Website: www.boomessential.com
- **[Confirmed]** Office: Petrocam Filling Station, Federal Housing Estate, Shagari, Akure, Ondo State, Nigeria.
- **[Confirmed]** Main phone: +234 805 554 4415. WhatsApp: +234 816 650 3634.
- **[Confirmed]** Management: five people with supplied photographs (see `content-specification.md` §Leadership).
- **[Confirmed]** Core values (from the client's original company profile): **Customer-First, Honesty, Progress.** No other values may be added.
- **[Confirm]** Mission and vision statements: not supplied; never invent them.
- **[Confirm]** Everything else about the company: year founded, CAC registration number, number of staff, service area, project history, partners and certifications. None of this may be written on the site until supplied.

## 2. Project objectives

1. A visually exceptional, responsive corporate website that gives the company a credible online presence.
2. Show the three principal divisions and the Industrial Equipment offering clearly.
3. Make it easy for customers to enquire, request services and request consultations.
4. A private admin dashboard so the owner can manage enquiries and appointment requests without third-party tooling.
5. Engineering quality equal to design quality: maintainable, secure, reviewed milestone by milestone.

## 3. Business divisions

Three principal divisions, plus one additional offering. Industrial Equipment is **not** a fourth division (navigation item and page only).

### A. BOOM Energy — Solar Power and Energy Solutions  **[Confirmed]**
The public-facing name is **BOOM ENERGY** (client-confirmed). "BOOM SOLAR" is an older branding reference that appears on the promotional materials; it is not used as a public name.

Energy assessment and power audits · solar system design · solar installation · inverter solutions · battery storage · solar maintenance · solar upgrades · residential solar · commercial and institutional solar.

### B. BOOM Security — Security and Surveillance Solutions  **[Confirmed]**
CCTV sales and supply · CCTV installation · CCTV maintenance and support · security fencing · access control · remote monitoring · security assessment.

### C. BOOM Foods — Food and Agricultural Products  **[Confirmed]**
Garri · Ekiti Garri · Fufu powder · Ofada rice · Igbemo rice · Smoked fish · Frozen chicken.
**Prices are never shown publicly.** Customers enquire with product and quantity.

### Additional offering: Industrial Equipment  **[Confirmed]**
Industrial food-processing equipment, particularly pounding machines. Own page and nav item; presented as an offering of the company, not a division.

## 4. Confirmed requirements

**Public site:** responsive navigation; seven public pages (Home, About Us, BOOM Energy, BOOM Security, BOOM Foods, Industrial Equipment, Contact Us); enquiry forms for solar, security, food, industrial equipment and general; appointment request form; WhatsApp links; client- and server-side validation; clear submission confirmation.

**Admin dashboard (private, not in public navigation):** secure administrator login; enquiry overview and total counts; searchable and filterable table (by division and status); enquiry detail view; status management; internal follow-up notes; appointment request management; CSV export.

**Appointments:** customer picks preferred date, time and consultation method. An administrator reviews and confirms. Submission never auto-confirms.

**Security:** server-side validation of every public submission; Supabase auth for admins; Row Level Security; no public exposure of enquiries; rate limiting and spam protection; safe environment-variable handling; internal notes never public; CSV export restricted to authorised admins.

**Excluded from initial release:** email notifications (optional paid upgrade; do not integrate without separate approval). Biographies for leadership (to be supplied later).

**Agreed technology (for planning):** Next.js App Router, TypeScript, Tailwind CSS, Supabase (PostgreSQL + auth), Vercel.

## 5. Outstanding information

Grouped by what it blocks. Full asset-related gaps are in `asset-inventory.md`.

### Blocks content and design decisions (needed before Stage 1–2)
- **Photography.** No authentic photographs of installations, products, premises or staff at work exist in the pack. The flyers are illustrative/generated artwork (see asset inventory). Will the client supply real photographs or commission a shoot? Any illustrative supporting visuals need Sabi Programmers' approval and clear labelling (see `design-system.md` §8). **[Confirm]**
- **BOOM Security and Industrial Equipment have no assets at all** (no logo, photos, product details). **[Confirm]**
- **Logo files.** Only JPEGs on white backgrounds. Need vector (SVG/AI/PDF) or transparent PNG of the master logo, plus a standalone BOOM Energy logo (the only existing solar-branded logo is the older BOOM SOLAR mark embedded in flyers) and a BOOM Foods logo without the embedded phone badge. **[Confirm]**
- **Leadership photos.** CEO photo is low resolution (413×531); Chief Technical Adviser photo is a casual outdoor shot with a video-player mute icon and black bar baked in. Request replacements for consistency. **[Confirm]**

### Blocks content accuracy
- Food product list: the Foods flyer also shows *livestock, raw food products, processed foods, bulk food supply* and says "from our farms". The brief lists seven products only. Which is authoritative? Does Boom operate farms? **[Confirm]**
- Boom Deep Freezer (600 L) and the "All-in-One Energy Storage System" (specs shown: 500W, 6IN1, 8.3kWh, LiFePO4) appear on flyers. Are these real products Boom sells? Deep freezers belong to no listed division. **[Confirm]**
- Whether Foods units/quantities should be constrained (kg, bags, cartons, litres) for the quantity field. **[Confirm]**
- Appointment rules: consultation methods offered (phone, WhatsApp call, video, office visit, site visit?), business hours and days, minimum notice, time slots vs free-text time, which divisions offer appointments. **[Confirm]**
- Contact email address (none supplied), social media accounts, Google Maps location/pin, opening hours. **[Confirm]**
- Privacy policy / data-handling wording (Nigeria Data Protection Act 2023 applies to personal data collected via forms). Who authors it? **[Confirm]**
- Spelling convention: client materials use British spelling ("organisations"); we assume British/Nigerian English. **[Confirm]**

### Blocks deployment
- Domain ownership and DNS access for boomessential.com; who owns the Vercel and Supabase accounts (client vs Sabi Programmers); admin user list (names/emails of who can log in); preferred Supabase region; Vercel plan (Hobby is for non-commercial use, so a commercial site needs a paid plan: verify current terms). **[Confirm]**

## 6. Potential risks

| Risk | Impact | Mitigation |
|---|---|---|
| No real photography | The "large, high-quality photography" requirement can't be met authentically; generated or stock images may never be presented as real products/projects | Raise now; plan a photo shoot or client-supplied photos; build type-led layouts that don't depend on imagery until it arrives; illustrative visuals only with approval and clear labelling |
| Inconsistent leadership photos | About page looks uneven | Request replacements; crop proportionally only; never retouch |
| Flyer content treated as fact | Inaccurate claims on a commercial site | Flyers are references; every claim needs client confirmation |
| Spam on public forms | Admin inbox noise, DB growth | Honeypot + server validation + rate limiting; CAPTCHA only if approved |
| Free-tier hosting limits (Supabase project pausing, Vercel Hobby terms) | Downtime or terms breach | Confirm plans with client before launch |
| Personal data in enquiries | Legal and security exposure | RLS, server-only writes, restricted exports, privacy notice |
