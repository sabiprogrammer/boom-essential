# Implementation Plan

Labels: **[Confirmed]** agreed in the brief; **[Recommendation]** our technical proposal needing approval; **[Confirm]** needs client input.
Nothing here is built. No package is installed. Versions are verified at the start of Stage 0.

## 1. Technology  **[Confirmed for planning]**

Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Supabase (PostgreSQL + Auth) · Vercel.
At Stage 0, verify the current stable Next.js, React, Tailwind, `@supabase/ssr` and Node LTS versions and their compatibility, and pin them.

**[Recommendation]** supporting libraries (each needs approval before install): a schema validator (e.g. Zod) shared between client and server; a form library only if it clearly reduces code; no UI kit, so the design system stays bespoke; no animation library unless CSS proves insufficient.

## 2. Architecture

Single Next.js application at the project root (no nested app folder). `boom-client-assets/` stays at the root, outside `public/`.

- **Public pages:** Server Components by default, static where possible. Client Components only for interactive parts (menu, forms, reveal animations).
- **Form submission:** Server Actions (or route handlers) validate with the shared schema, apply spam/rate checks, then write to the database using a **server-only** Supabase client. Browsers never write to the database directly.
- **Admin:** under `/admin`, protected by middleware plus per-request server-side session and role checks (middleware alone is not sufficient). Data reads use the signed-in admin's session so RLS enforces access.
- **Environment:** secrets only in Vercel/`.env.local`; the service-role key is server-only and never exposed to the client; `.env.example` documents the variables.

### Proposed application structure (to be created in Stage 0 onwards)

```
app/
  (site)/            public pages: page.tsx, about, energy, security, foods,
                     industrial-equipment, contact, privacy
  admin/             login + dashboard routes (noindex)
  actions/           server actions for form submission, one per responsibility
components/
  layout/ ui/ forms/ sections/ admin/
lib/
  supabase/          server, browser and admin clients (separate files)
  validation/        shared schemas
  security/          rate limiting, spam checks
  export/            CSV generation
content/             typed content for services/products/leadership
public/              approved production images only
supabase/migrations/ SQL migrations, RLS policies
docs/
```

Code organisation follows the single-responsibility rule in CLAUDE.md: one clear job per file.

## 3. Database planning  **[Recommendation]**

Final fields follow the form requirements in `content-specification.md` after client review.

| Table | Purpose | Key columns |
|---|---|---|
| `enquiries` | All enquiry types | id, created_at, kind (`energy`/`security`/`food`/`industrial`/`general`), division, status, full_name, phone, email, contact_method, message, details (JSONB for per-form fields, validated by schema), source_page |
| `appointments` | Appointment requests | id, created_at, division, preferred_date, preferred_time, timezone, method, location, note, contact fields, status, confirmed_date/time (set by admin), reviewed_by |
| `enquiry_notes` | Internal follow-up notes | id, enquiry_id (or appointment_id), author, body, created_at |
| `admin_users` | Allowlist of authorised administrators (maps to `auth.users`) | user_id, role, created_at |

- Statuses **[Proposed]**: enquiries `new → contacted → in_progress → closed`; appointments `requested → confirmed / declined / rescheduled → completed / cancelled`. Use Postgres enums or check constraints. Final labels **[Confirm]** with the owner.
- Food enquiries store product + quantity, **never prices**. No price column exists anywhere.
- Notes live in their own table so no public-facing query or policy can ever touch them.
- Indexes on status, division, created_at; trigram or full-text search on name/phone/message for the dashboard search.
- Store timestamps as `timestamptz`; display in Africa/Lagos.
- Retention policy and deletion process for personal data **[Confirm]**.

## 4. Dashboard functionality  **[Confirmed scope]**

- Login (Supabase Auth, email + password; no public sign-up; admins are created by invitation/manually).
- Overview: totals by status and division; recent enquiries; pending appointment requests.
- Enquiries table: search, filter by division and status, sort, pagination.
- Enquiry detail: all submitted fields, status change, internal notes (append-only with author and time).
- Appointments: list/filter, detail, confirm (setting the confirmed date and time), decline, reschedule. Confirmation is an explicit admin action only.
- CSV export of the current filtered view, admin-only, generated server-side. Neutralise spreadsheet formula injection (prefix cells starting with `=`, `+`, `-`, `@`); UTF-8 with BOM for Excel.
- Admin UI design follows `design-system.md`, desktop-first and phone-usable.
- Not in scope: email notifications (excluded until separately approved), customer accounts, payments, public booking calendar.

## 5. Security considerations

1. Server-side validation of every public submission (types, lengths, allowed values, phone format); reject unknown fields; sanitise output (React escapes by default; never `dangerouslySetInnerHTML` with user data).
2. RLS **enabled on every table**. **[Recommendation]**: no policies for `anon`; public writes go only through server code. Authenticated access requires membership in `admin_users` (policy checks it). Test policies with anon, non-admin authenticated and admin roles.
3. Internal notes unreachable from any public path or policy.
4. Rate limiting: per-IP and per-contact-value limits on submissions. Store counters in Postgres (no extra service) or an approved external store; note serverless instances do not share memory, so in-memory limiters are insufficient. Combine with a honeypot field and minimum-time-to-submit check. A CAPTCHA (e.g. Cloudflare Turnstile) is a third-party addition: use only if spam persists and the client approves.
5. Admin hardening: no public sign-up, strong passwords, consider MFA, short session lifetimes, `noindex` and robots disallow on `/admin`, generic login errors, login throttling.
6. Secrets: service-role key only on the server, never `NEXT_PUBLIC_`; separate dev/preview/production Supabase projects.
7. Security headers (CSP, HSTS, `X-Content-Type-Options`, frame protections) configured in Next config; verify CSP with the fonts and any approved embeds.
8. CSV export gated by the same server-side admin check, and logged **[Recommendation]**.
9. Privacy: privacy notice and consent text on forms; personal data of customers is collected, so Nigeria Data Protection Act 2023 obligations apply. Client should obtain advice on compliance **[Confirm]**.
10. Dependency hygiene: lockfile committed, audit before launch.

## 6. Development stages (review gate after each)

| Stage | Scope | Gate |
|---|---|---|
| 0. Foundation — **COMPLETE, awaiting approval (2026-11-03)** | Verify versions; `git init`; scaffold Next.js in the project root (`create-next-app` may refuse a non-empty folder; scaffold carefully so `CLAUDE.md`, `docs/`, `boom-client-assets/` are preserved); TS strict, Tailwind, ESLint, `.env.example`, `.gitignore`, README. Design tokens and fonts moved to Stage 1 (see §6.1). | Builds and lints cleanly; structure approved |
| 1. Design system and shell — **COMPLETE, awaiting approval (2026-11-03)** | Tokens, typography, header/nav/footer, mobile menu, WhatsApp link, base UI primitives, temporary design preview (see §6.2) | Visual review at all breakpoints |
| 2. Home — **COMPLETE, approved and committed (`9eebe17`, 2026-11-03)** | Hero, intro, divisions, featured solutions, industrial equipment, values, how we work, leadership preview, closing contact, plus temporary illustrative division images (see §6.3) | Design review (photography gap flagged) |
| 3. About — **COMPLETE, approved and committed (`82772f7`, 2026-11-03)** | Hero, who we are, core values, divisions, leadership gallery with five real portraits, closing CTA (see §6.4) | Review |
| 4. Division and equipment pages | Energy (**COMPLETE, approved and committed `eda3caf`**, §6.5); Security (**COMPLETE, approved and committed `f6f7f7b`**, §6.6); Foods (**COMPLETE, approved and committed `9fff678`**, §6.7); Industrial Equipment (**COMPLETE, approved and committed `346b703`**, §6.8) | Content accuracy review |
| 5. Contact and forms (front end) — **COMPLETE and committed (`3857852`, 2026-11-04)** | One shared enquiry form with optional appointment request, URL prefilling, validation UX and preview/loading/success/error states, frontend only (see §6.9). The six separate forms were consolidated into one; per-offering fields await client confirmation | Review |
| 6. Backend and data | Supabase projects, migrations, RLS, server actions, rate limiting/spam | RLS test results reviewed |
| 7. Admin dashboard | Auth, overview, table, detail, notes, appointments, CSV | Walkthrough with owner |
| 8. Hardening and QA | Accessibility, performance, SEO metadata, security headers, cross-device testing, content freeze | QA report |
| 9. Deployment and handover | Domain/DNS, Vercel production, monitoring, admin accounts, handover notes | Go-live approval |

Stages 5 and 6 may swap or be combined per milestone if review prefers it. Work proceeds one stage at a time; no stage starts before the previous is approved.

### 6.1 Stage 0 outcome (recorded 2026-11-03)

- **Scaffolding:** official `create-next-app@16.4.4` run in a temporary directory (flags: App Router, TypeScript, Tailwind, ESLint, npm, no `src/`, `@/*` alias), then merged into the project root with no overwrites (no file conflicts). Nothing in `CLAUDE.md`, `docs/` or `boom-client-assets/` was touched. The starter screen is unchanged apart from moving `page.tsx` to `app/(site)/page.tsx`.
- **Pinned versions:** Node 22.21.0 / npm 11.6.2 (Next requires Node ≥ 20.9). Next.js 16.4.4, React / React DOM 19.3.0, TypeScript 5.9.3 (strict on), Tailwind CSS 4.3.4 with `@tailwindcss/turbopack` 4.3.4, ESLint 9.39.5 with `eslint-config-next` 16.4.4. `package.json` declares `engines.node >=20.9.0`.
- **Structure created:** the folders from §2, as `.gitkeep` placeholders: `app/(site)`, `app/admin`, `app/actions`, `components/{layout,ui,forms,sections,admin}`, `lib/{supabase,validation,security,export}`, `content`, `supabase/migrations`. `public/` still holds only the starter SVGs. No client asset has been copied.
- **Scripts:** `dev`, `build`, `start`, `lint`, and `typecheck` (`next typegen && tsc --noEmit`; plain `tsc` fails before types are generated because `LayoutProps` is a Next-generated global).
- **Not done in Stage 0, by decision:** no Prettier (extra dependency, not yet approved); no Supabase; no animation library; design tokens and Manrope/Inter fonts wait for Stage 1.
- **Items for review:**
  1. The CLI's default `next.config.ts` enables `cacheComponents` and `partialPrefetching`. **Decision (Stage 1): intentional, keep enabled.** Rules that follow: dynamic data goes behind Suspense; private enquiry, appointment and admin data is never cached across sessions or users and never statically prerendered; no unsafe caching of authenticated data.
  2. `AGENTS.md` (written by the Next.js CLI) tells coding agents to read the version-matched docs in `node_modules/next/dist/docs/` before writing code. Kept; useful for this version.
  3. `npm audit` reports 16 moderate findings, all in the ESLint toolchain (dev-only; 0 in production dependencies). The suggested "fixes" are major-version downgrades, so none were applied. ESLint 9.39.5 prints an end-of-life deprecation notice. **Recorded as a maintenance item to resolve before production release** (Stage 8/9 checklist). No `npm audit fix` / `--force`.
  4. Git is initialised on `main` with no commits yet.
- **Verification:** `npm install`, `npm run lint`, `npm run typecheck` and `npm run build` all pass.

### 6.3 Stage 2 outcome (recorded 2026-11-03)

- **Git:** Stage 1 committed first (`0b10e64`). Stage 2 approved and committed as `9eebe17` (`feat(home): implement corporate homepage`).
- **Homepage** at `/` (`app/(site)/page.tsx`) composed from `components/home/` (one file per section plus `HeroBars`, `SwooshMark`, `DivisionRow`, `DivisionVisual`, `DivisionGeometry`). Copy data lives in `content/` (`divisions.ts`, `featured-solutions.ts`, `values.ts`, `leadership.ts`). The Stage 1 `_preview` folder was deleted.
- **Metadata:** absolute title, description, canonical, Open Graph (uses the approved master logo), and `schema.org` Organization JSON-LD (`components/seo/OrganizationJsonLd.tsx`) built only from confirmed facts.
- **Motion:** `app/motion.css`, CSS only and gated on `prefers-reduced-motion: no-preference`. Hero entrance and bar growth are load animations; scroll reveals use CSS scroll-driven animation (`animation-timeline: view()`) as progressive enhancement, so browsers without support simply show the content. No new dependencies.
- **Imagery:** no real photographs. The three division visuals now use temporary AI-generated illustrative images (`public/assets/images/homepage/illustrative/`, wired in `content/division-images.ts`; each carries an "Illustrative image" label and honest alt text; tracked in `asset-inventory.md` §4a and to be replaced by authentic photography). The Foods panorama is shown whole ("band" fit) rather than cropped. Portraits were not used on the homepage.
- **Changed shared component:** `Section` gained a `tint` tone.
- **Open items:** client wording for core-value explanations; confirmation of "indigenous" and "restaurants"; real photography; vector logo. Links to `/about`, `/energy`, `/security`, `/foods`, `/industrial-equipment`, `/contact` still resolve to the 404 page until their stages.
- **Verification:** lint, typecheck and production build pass. Headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow. Real-device testing, screen-reader testing and a reduced-motion pass in a live browser have not been done.

### 6.4 Stage 3 outcome (recorded 2026-11-03)

- **Git:** the approved homepage was committed first (`9eebe17`; no remote, nothing pushed). Stage 3 approved and committed as `82772f7` (`feat(about): add company profile and leadership`).
- **About Us** at `/about` (`app/(site)/about/page.tsx`, own metadata and canonical) composed from `components/about/`: `AboutHero` (navy; tagline set as three ruled columns that rise to the right), `WhoWeAreSection` (sticky headline; statement, divisions list, listening belief), `AboutValuesSection` (stepped staircase), `AboutDivisionsSection` with `DivisionPanel` (full-bleed navy / charcoal / green triptych; Industrial Equipment as a separate "Also supplied" note, never a fourth panel), `LeadershipSection` with `LeaderEntry` and `LeaderPortrait`, `AboutClosingSection`. Copy lives in `content/about.ts`.
- **Core values:** the client-supplied wording for all three is now in `content/values.ts` (single source), so the homepage values section shows it too. Because of that, the homepage section got a one-line width and size adjustment so "Customer-First" stays on one line; its content is otherwise unchanged.
- **Leadership:** five real portraits (byte-identical copies in `public/assets/images/leadership/`), each shown through an explicit 4:5 crop box in `content/leadership.ts` (cropping only; no retouching). The CEO is a featured entry capped at 20rem wide because the source is 413px; the other four sit on a staggered row (single row layout on phones). Only photograph, full name and position are shown; `LeadershipMember.bio` is an optional field that renders after the position, so biographies can be added later without layout changes.
- **Motion:** the existing CSS-only `rise`/`reveal` utilities; confirmed that with `prefers-reduced-motion: reduce` animations are disabled and content is fully visible.
- **Open items:** the quality notes in `asset-inventory.md` §2 still apply (CEO resolution; the Sijin photo is casual); `/energy`, `/security`, `/foods`, `/industrial-equipment` and `/contact` still show the 404 page until their stages; no founding year, history, headcount or statistics are shown because none are confirmed.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; all five portraits load. Real-device and screen-reader testing have not been done.

### 6.5 Stage 4 outcome: BOOM Energy (recorded 2026-11-04)

- **Git:** About Us committed first (`82772f7`). The Energy page was approved and committed as `eda3caf` (`feat(energy): add solar solutions page`).
- **Page** at `/energy` (`app/(site)/energy/page.tsx`; own title, description, canonical, Open Graph with the master logo), composed from `components/energy/`: `EnergyHero` + `SolarGraphic` (sun rising on the hero's bottom edge behind a tilted two-row array, full-bleed SVG), `EnergyIntroSection`, `EnergyServicesSection` (assembles `ServiceFeature` with `LoadProfileDiagram` / `BlueprintDiagram` for services 01-02, `SystemBand` for 03-05, `SustainBand` for 06-09), `WhoWeServeSection`, `ApproachSection` (vertical rail), `EnergyClosingSection`; shared helpers `EnergyIcon` (ten drawn line icons) and `SunArcs`. Copy and structure are in `content/energy.ts`.
- **Imagery:** none supplied or used. All artwork is custom SVG/CSS in the brand palette (decorative, `aria-hidden`, no values or labels that could read as data). The approved homepage solar illustration is not reused here. No image was generated or sourced.
- **Shared change:** `app/motion.css` gained a `sun-rise` keyframe and `.sunrise` class (gated on `prefers-reduced-motion: no-preference`).
- **Links:** `Request a Solar Assessment` goes to `solarAssessmentHref` (= `/contact#appointment`, a proposed anchor); `/contact` still shows the 404 page until Stage 5.
- **Content guard:** an in-browser text check found none of "BOOM SOLAR", "food-processing businesses", "warranty" or "guarantee" on the page.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; with reduced motion on, no animations run and all content is visible. Real-device and screen-reader testing have not been done.

### 6.6 Stage 4 outcome: BOOM Security (recorded 2026-11-04)

- **Git:** the homepage Industrial Equipment wording was corrected first (`dc9f871`, `fix(content): clarify industrial equipment offering`), then BOOM Energy committed (`eda3caf`). The Security page was approved and committed as `f6f7f7b` (`feat(security): add security and surveillance page`).
- **Page** at `/security` (`app/(site)/security/page.tsx`; own title, description, canonical, Open Graph with the master logo) from `components/security/`: `SecurityHero` + `SecurityPlanGraphic` (plan-view schematic of an imaginary property: fence line, gate, access point, building and four corner cameras whose fields of view sweep in once) inside a `Viewfinder`; `SecurityIntroSection` (spec-sheet of four considerations); `SecurityServicesSection` assembling `SurveillanceBand` (01-03, dashed signal line), `PerimeterPanels` (04-05 with `FenceDiagram`, `AccessDiagram`) and `MonitoringRows` (06-07 with `SignalDiagram`, `PlanDiagram`); `SecurityAudienceSection` (ledger rows, lock-on viewfinder on hover); `SecurityApproachSection` (checkpoint route); `SecurityClosingSection`. Shared helpers: `SecurityIcon` (14 drawn icons), `Viewfinder`, `ServiceIndex` (viewfinder-bracketed service numbers). Copy and structure in `content/security.ts`.
- **Imagery:** none. The homepage CCTV illustration is not reused. All artwork is custom SVG/CSS and decorative (`aria-hidden`), with no values or labels that could read as data; the hero schematic is captioned as illustrative and not a BOOM installation.
- **Shared change:** `app/motion.css` gained `scan-in` and `lock-on` keyframes and classes (one-time, gated on `prefers-reduced-motion: no-preference`; no looping animation).
- **Links:** assessment CTAs use `securityAssessmentHref` (= `/contact#appointment`, a proposed anchor); `/contact` still shows the 404 page until the Contact stage.
- **Content guard:** an in-browser text check found none of "BOOM SOLAR", "warrant", "guarantee", "24/7", "response time", "service-level" or "food-processing" on the page, and no `img` elements in `main`.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; with reduced motion on, no animations run and all content is visible. Real-device and screen-reader testing have not been done.

### 6.7 Stage 4 outcome: BOOM Foods (recorded 2026-11-04)

- **Git:** BOOM Security committed first (`f6f7f7b`). The Foods page was approved and committed (`feat(foods): add food and agricultural products page`).
- **Launch blocker:** the hero statement "From our farms and trusted sources to your table." is client-supplied wording, but whether BOOM operates farms is unconfirmed. Retained for development; must be confirmed by the client before public launch (Stage 8/9 checklist), otherwise removed or reworded.
- **Page** at `/foods` (`app/(site)/foods/page.tsx`; own title, description, canonical, Open Graph with the master logo) from `components/foods/`: `FoodsHero` + `GrainField` (full-bleed Agricultural Green field panel with stalks of grain that grow in once), `FoodsIntroSection`, `HouseholdStaplesSection` (sticky green packaging panel with `PackagingScale`, beside numbered `ProductEnquiryRow`s), `ProteinProductsSection` (`ProteinPanel` + `ProteinMotif`), `FoodsAudienceSection` (three full-bleed bands), `SupplyEnquirySection`, `FoodsClosingSection`; `field-stripes.ts` shares the logo-derived stripe treatment. Copy, product data and the enquiry-link builder are in `content/foods.ts`.
- **Enquiry links:** `foodsEnquiryHref(slug?)` builds `/contact?division=foods&product=<slug>#enquiry` (or the general link without a slug). Verified in the browser that all seven products produce distinct links. The Contact stage must honour `division`, `product` and `#enquiry`.
- **Shared changes:** a `leaf` (soft green) and a `green` tone for `Section`; a `--color-leaf` token (a tint of Agricultural Green, no new hue); a `sprout` keyframe in `app/motion.css` (one-time, gated on `prefers-reduced-motion: no-preference`).
- **Imagery:** none. The homepage Foods illustration, the flyers and any stock or generated imagery are not used. Artwork is custom SVG/CSS and decorative.
- **Colour note:** white text is used on Agricultural Green (about 5.6:1); the muted on-dark grey is not, as it would fall below 4.5:1; gold appears only as rules, markers and one grain accent on green.
- **Content guard:** an in-browser check found no price, currency, "affordable", cart, checkout, certification or warranty wording, no `img` elements in `main`, all seven products as headings, and the packaging line verbatim.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; with reduced motion on, no animations run and all content is visible. Real-device and screen-reader testing have not been done.

### 6.8 Stage 4 outcome: Industrial Equipment (recorded 2026-11-04)

- **Git:** BOOM Foods committed first (`9fff678`, `feat(foods): add food and agricultural products page`). The Industrial Equipment page is uncommitted pending review.
- **Page** at `/industrial-equipment` (`app/(site)/industrial-equipment/page.tsx`; own title, description, canonical, Open Graph with the master logo) from `components/industrial/`: `IndustrialHero` (charcoal with a thin gold tab at its top edge and a gold-plinth product frame; the diagonal hazard-stripe band first proposed was removed at review as too loud), `OfferingMapSection` (three linked principal divisions beside a dashed, separate "Additional offering · You are here" marker), `ProductIntroSection`, `OptionsSection` (+ `SizeRangeDrawing`), `IndustrialAudienceSection` (+ `IndustrialIcon`), `EnquiryJourneySection` (chevron tabs), `IndustrialClosingSection`; shared `MachineUnit` / `MachineStage` drawings, and `ProductMedia` (the photo-ready slot). Copy and the enquiry helper are in `content/industrial-equipment.ts`.
- **Structure made explicit:** the page states Industrial Equipment is an additional offering and not a fourth division (eyebrow, "Where this fits" map, closing copy). It is never numbered or styled as a division, and the enquiry parameter is `offering=`, not `division=`.
- **Enquiry link:** `industrialEnquiryHref()` builds `/contact?offering=industrial-equipment&product=pounding-machine#enquiry`. Verified in the browser on all three enquiry buttons. The Contact stage must honour `offering`, `product` and `#enquiry`.
- **Imagery:** none of BOOM's machines. Generic line drawings are captioned "Illustrative drawing. Not a BOOM machine."; flyer machine images unused; no generated or stock images. `ProductMedia` swaps in an authentic photograph (and drops the caption) when `industrialContent.productImage` is set.
- **Content guard:** an in-browser check found no price, currency, cart, checkout, warranty, certification, factory/food-processing, capacity, power or brand wording, no `img` elements in `main`, and the restaurant business as the only audience.
- **Shared change:** none to global components or tokens.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; with reduced motion on, no animations run and all content is visible. Real-device and screen-reader testing have not been done.

### 6.9 Stage 5 outcome: Contact and enquiry interface, frontend only (recorded 2026-11-04)

- **Git:** Industrial Equipment committed first (`346b703`, `feat(industrial): add pounding machine offering page`), including the removal of the hazard-stripe band at review (the hero now has only a thin gold tab; the closing section's stripe was removed too; `hazard-stripe.ts` was deleted). The Contact page is uncommitted pending review.
- **Page** at `/contact` (`app/(site)/contact/page.tsx`; own title, description, canonical, Open Graph; fully static) from `components/contact/`: `ContactHero`, `ContactChannelsSection`, `EnquirySection` (`id="enquiry"`; the form sits in `Suspense` and its fallback is the same blank form, so ids and layout exist in the first HTML) and the form parts `EnquiryForm`, `PrefilledEnquiryForm`, `FormStep`, `FormField`, `CustomerFields`, `CategoryPicker`, `InterestPicker`, `MessageField`, `AppointmentFields` (`id="appointment"`), `ErrorSummary`, `PreviewNotice`, `EnquiryStatusPanel`, `SubmitBar`, `ContactActions`.
- **Logic** (no UI): `lib/enquiry/types.ts` (typed form values, payload, status), `validation.ts`, `prefill.ts` (allowlisted URL parsing), `submit.ts` (the single backend seam; sends nothing today), `config.ts` (`enquirySubmissionEnabled = false`); `hooks/useEnquiryForm.ts`, `hooks/useAppointmentIntent.ts` (tracks the visitor's intent to request an appointment from link clicks and the URL hash, so the "Request a Consultation" actions tick the box, on arrival or while already on the page, without resetting typed data). Data: `content/contact.ts`, `content/enquiry-options.ts` (the allowlist), `content/enquiry-links.ts`.
- **Link consistency:** the Energy and Security assessment actions (`solarAssessmentHref`, `securityAssessmentHref`) changed from the bare `/contact#appointment` to `/contact?division=<id>&service=<slug>#appointment`, so they preselect the division and the assessment and tick the appointment request. Foods and Industrial Equipment helpers are unchanged. The header and footer "Request a Consultation" action (`/contact#appointment`) ticks the appointment request with no category.
- **Shared change:** a functional `--color-danger` / `--color-danger-tint` token pair for form errors only (muted red, always with text and an icon).
- **Honesty rules enforced:** no false success (the only reachable outcome is a "preview" notice stating nothing was sent or saved), no browser storage, no mailto, no invented email, hours, map, social links or response times.
- **Verification:** lint, typecheck and production build pass. Headless Chrome tests: general, Energy, Security, Foods and Industrial prefill; division-only; mismatched product ignored; unknown, scripted, array and oversized parameters ignored; normalised case and whitespace; hash-only appointment; empty and invalid submits (error summary focused); appointment missing, past and valid date; preview notice focused after a valid submit; zero network requests and nothing in storage; no horizontal overflow at 360, 390, 768, 1024, 1280 and 1440px, including the error and appointment states. Real-device and screen-reader testing have not been done.

**Proposed enquiry payload** (what `submitEnquiry` will send to a future server action; the server assigns `id`, `created_at` and `status`, and must re-validate everything):

```json
{
  "customer": { "fullName": "string", "phone": "string", "email": "string | null", "organisation": "string | null", "location": "string | null" },
  "target": { "category": "general | energy | security | foods | industrial-equipment", "interests": ["slug"] },
  "message": "string (10 to 2000)",
  "type": "enquiry | appointment_request",
  "appointment": { "preferredDate": "YYYY-MM-DD", "preferredTime": "HH:MM" } ,
  "source": { "page": "/contact", "prefilled": true },
  "honeypot": ""
}
```

(`appointment` is `null` for a plain enquiry.) **Mapping to the schema proposed in §5:** the single `enquiries` table gains `type`, `category`, `interests text[]`; an appointment request is an `enquiries` row with `type = appointment_request` plus an `appointments` row (`enquiry_id`, `preferred_date`, `preferred_time`, `timezone = Africa/Lagos`, `status = requested`, never auto-confirmed). Category ids use `foods` and `industrial-equipment` (the plan's earlier `food`/`industrial` kinds should be aligned). Statuses stay server-assigned: enquiries `new`, appointments `requested`.

**Outstanding backend requirements (Stage 6):** a server action with its own validation (the client checks are not the authority), rate limiting and spam protection (honeypot field `website` is already in the form; CAPTCHA only if approved), RLS (public insert only, no public read), Supabase schema and migrations, secrets in environment variables, a real success response before the success panel can appear, error handling, and `enquirySubmissionEnabled = true` (which removes the preview notice). No email notification is in scope. **Decisions still needed:** whether a privacy notice and consent statement are required and what they say; whether phone is the only required contact; the allowed appointment window (hours, minimum notice, horizon) and consultation methods; whether per-offering fields (property type, quantity and units, equipment details) are wanted; the real email address (and whether to show it); opening hours; whether a map link may be added; and the final status labels.

### 6.10 Dashboard preview, frontend only (recorded 2026-11-04)

A client-reviewable **demonstration** of the future administration dashboard. It uses fictional data only and **no backend work has started** (no Supabase, no authentication, no database, no server actions or API routes, no network requests, no localStorage/sessionStorage/cookies). It is deliberately reachable without a login at `/dashboard-preview` so the client can review it, and it carries `noindex` metadata (a courtesy to search engines, not a security measure). The real, protected dashboard (`/admin`) is a separate later stage.

- **Routes:** `app/dashboard-preview/` (own layout, separate from the public header and footer): `page.tsx` (Overview), `enquiries/page.tsx`, `appointments/page.tsx`. All static. Navigation is client-side (no reload).
- **Components:** `components/dashboard-preview/` (shell: `PreviewShell`, `Sidebar`, `SidebarNav`, `TabBar`, `TopBar`, `DemoBanner`; overview panels; enquiry and appointment lists; `DetailDrawer` with enquiry and appointment detail; small primitives). Copy and navigation: `content/dashboard-preview.ts`. State hooks: `hooks/useEnquiryListState.ts`, `hooks/useAppointmentListState.ts`, `hooks/useActiveDashboardSection.ts`.
- **Demo data seam:** `lib/dashboard-preview/`. `types.ts` mirrors the proposed schema (§5, §6.9); `demo-enquiries.ts` holds 24 fictional enquiries (Demo Customer 01 to 24, example.com emails, and `+234 000 DEMO 00NN` placeholders that contain letters so they can never be dialled) across all four offerings, 14 with appointment requests; `demo-activity.ts`; pure helpers (`stats.ts`, `filter-enquiries.ts`, `appointments.ts`, `dates.ts`, `labels.ts`) and `demo-reducer.ts`. Every headline figure is computed from the records. Dates are relative to a fixed `demoToday` (2026-11-04) because `new Date()` cannot run at prerender. Replacing the demo module with database queries should not require rewriting the interface.
- **Demonstration actions:** changing a status, confirming an appointment or adding an internal note changes in-memory state only (shared across views, restored by "Reset demo data" or a refresh) and is labelled "demo only" next to the control. Nothing claims to be saved.
- **Statuses used:** enquiries New, In Progress, Contacted, Resolved; appointments Requested, Confirmed, Completed, Cancelled. These differ slightly from the proposal in §3 and the labels remain **[Confirm]** with the client.
- **Design notes:** sidebar on desktop (lg and up), bottom tab bar below; stat tiles link to filtered views (`/dashboard-preview/enquiries?status=new`); the enquiry breakdown is plain CSS ranked bars in one hue (no chart dependency); tables switch to stacked lists by container width. Small shared changes: `--color-gold-tint` token, `panel-in` and `fade-in` motion classes, `Icon` exported from `components/ui/icons.tsx`.
- **Design refinement and contact actions (recorded 2026-11-04):** the preview was restyled as a premium CRM interface: Deep Navy sidebar with an elegant brand lockup and gold-outlined count pills, a quieter top bar, a slim pale-gold demo strip instead of a gold band, a hero KPI tile with a status-mix bar, one-column-per-concern enquiry table (customer with monogram, enquiry with reference and division, status with date received, actions), segmented Upcoming/Past control, calendar tiles and status edges on appointments, and drawers rebuilt as separate white sections on a warm-white ground. **Customer contact actions:** `lib/dashboard-preview/phone.ts` (`normaliseNigerianMobile`: accepts 0803..., +234..., 234..., 00234..., Nigerian mobile prefixes 70x/80x/81x/90x/91x only; returns null for anything else), `contact-actions.ts` (`buildContactActions` gives `tel:+234...` and `https://wa.me/234...?text=...` only for valid numbers; `followUpMessage` builds the professional follow-up text), `contact-mode.ts` (`contactActionsMode = "demo"`). UI: `ContactActions` (compact in tables and lists, prominent in drawers), `EnquiryContactActions`, `CustomerContactBlock`, `NoticeProvider`. In demo mode the buttons only show a notice (with the WhatsApp message that would be prefilled); they never open the dialler or WhatsApp and make no request. Setting `contactActionsMode = "live"` when real records exist turns the same controls into real links; a missing or invalid number gives a disabled control, never a link. The administrator always sends the WhatsApp message manually. Landlines are not accepted yet (client to confirm).
- **Demo dates now follow the real date (recorded 2026-11-06):** the fixed `demoToday` of 4 November 2026 was removed. The sample data is built relative to a reference (`lib/dashboard-preview/reference.ts`): the Africa/Lagos calendar day plus the current instant, chosen once per page load in the browser (`hooks/useDemoReference.ts`, via `useSyncExternalStore` with a `null` server snapshot). Dates are offsets (`demo-clock.ts`: `day`, `at`, `minutesAgo`), so upcoming appointments are always in the future (today or later), past ones in the past, and Today, Tomorrow, In 2 days and Yesterday are accurate; the newest enquiries are "minutes ago" so none is dated in the future, and the activity feed is derived from the enquiries. The server renders only a placeholder (`DemoReadyGate`) in place of dated content, so there is no hydration mismatch; nothing is stored. A tab left open past midnight keeps the date it loaded with until it is reloaded. Unit tests: `npm test` (`tests/dashboard-preview/`: dates, demo data and grouping across midnight, month, year and leap-day boundaries, phone normalisation and contact links).
- **Client corrections and new content (recorded 2026-11-10, uncommitted):** seven corrections from the client's WhatsApp screenshots plus twelve new photographs. Wording (head office in Akure, Garri Ekiti, "Boom Multi Global" casing, "Meet our leadership team", "The Management Team"), the homepage featured list grouped by category, footer and menu links, and new pages Projects (`/projects`), Products catalogue (`/products`) and Careers (`/careers`; wording pending from the client). Pictures for the offerings: real installation photographs on Energy and Projects, property-type drawings, a CCTV equipment section on Security, machine photographs on Industrial Equipment. Full record: `docs/client-corrections-2026-11-10.md`; CCTV imagery sourcing: `docs/security-imagery-brief.md`. Header navigation needed tightening (nowrap labels, smaller item padding, header CTA hidden at 1024 to 1279 px) to fit the two new items.
- **Still to do before the real dashboard:** everything in Stage 6 (schema, RLS, Supabase Auth, server-side validation, protected `/admin`, CSV export, audit of who changed what), plus client decisions on status labels and the fields shown. Real-device and screen-reader testing of the preview has not been done.

### 6.11 Stage 6, milestone 1: Supabase connection infrastructure (recorded 2026-11-13, approved and committed)

Only the **connection** is established. There is no authentication, no database work and no change to the public site or the dashboard preview.

- **Project configuration:** one Supabase project. Its URL and publishable key are in the root `.env.local` (git-ignored by the `.env*` rule; only `.env.example` is tracked) under `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Both are public by design: the publishable key only identifies the project and acts with the anonymous role, so **Row Level Security, not the key, is what protects data**. The same two names must be added to the Vercel project's environment variables before a deployment can use Supabase. Separate development and production projects are still recommended (§5 item 6, §8); the single project now connected should be treated as development until that is decided **[Confirm]**.
- **Packages installed (npm, `package.json` and `package-lock.json` updated):** `@supabase/supabase-js` and `@supabase/ssr`. The `server-only` package was **not** installed: Next.js 16 handles `import "server-only"` itself (documented in `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`).
- **Where things live (`lib/supabase/`):**
  - `config.ts`: reads and validates the two public variables. Errors name the variable, never its value. The `process.env.NEXT_PUBLIC_*` reads are written out in full because Next.js inlines them at build time.
  - `client.ts`: `createSupabaseBrowserClient()` (`createBrowserClient` from `@supabase/ssr`).
  - `server.ts`: `createSupabaseServerClient()`, async (`await cookies()`), a **new client per call** bound to that request's cookies, with `getAll`/`setAll`; `setAll` ignores the error thrown when a Server Component tries to write cookies. It imports `server-only`, so importing it into a Client Component is a build error (verified on 2026-11-13 with a throwaway Client Component, since deleted).
- **Security boundaries:** no service-role or secret key is read, named in code, stored or requested, and none may ever use a `NEXT_PUBLIC_` name. No credential appears in source, docs, logs or reports (the tests scan for hard-coded project addresses and keys). Using `cookies()` makes a caller request-time, so it belongs inside `<Suspense>` and never inside `use cache` (CLAUDE.md caching rules). **Having these clients does not make anything authenticated or protected.**
- **Connection check (2026-11-13):** a throwaway script outside the repository called the Auth health and settings endpoints with the configured key, and printed only status codes: 200 for both; the same call with a wrong key and with no key returned 401. The configured URL and key therefore reach the intended Supabase project and the key is accepted. No public test endpoint exists.
- **Tests:** `tests/supabase/config.test.ts` (validation, trimming, error messages carry no values) and `tests/supabase/boundaries.test.ts` (server client is `server-only` and per-call; browser client uses no server API; no service-role/secret key or hard-coded project address in source; no `proxy.ts`/`middleware.ts` at the time; since §6.12: `proxy.ts` exists, no `middleware.ts`, no database query, and pages and components reach Supabase only through `lib/auth`). These tests were updated deliberately by the authentication milestone (§6.12).
- **Still outstanding after this milestone:** authentication was delivered in §6.12; schema and migrations; RLS policies and their tests; the server-side enquiry handler with validation, rate limiting and spam protection; replacing the dashboard demo data with queries; CSV export; `enquirySubmissionEnabled`. The enquiry form still sends and stores nothing.

### 6.12 Stage 6, milestone 2: Administrator authentication (recorded 2026-11-13, approved and committed)

Administrator sign-in, sign-out and a protected `/admin` placeholder. **No tables, migrations or RLS; no real enquiry or appointment data; the dashboard preview is unchanged.**

- **Access model.** Supabase self-service sign-up is open, so authentication alone must never grant access. Access requires a VERIFIED user id (the `sub` of `supabase.auth.getClaims()`, which checks the token's signature and expiry) that appears in the server-only variable **`BOOM_ADMIN_USER_IDS`**: one or more UUIDs, comma-separated, set in the git-ignored `.env.local` (and, later, the Vercel project's environment variables). `.env.example` carries only the name and an all-zero placeholder. The list fails closed: missing, empty or any malformed entry denies everyone; `user_metadata` and `app_metadata` are never consulted; any exception denies. An administrator is created by hand in Supabase Auth, and added by appending their UUID. This is an interim model: a database-backed role table with RLS is the likely replacement once the schema exists **[Decision for a later milestone]**.
- **Authentication flow.** `/admin/login` (public) → `signInAction` Server Action: server-side validation of email and password, `signInWithPassword`, then `getClaims()` and the allowlist check. A signed-in account that is not allowlisted is signed out again and sees the same generic message as a wrong password (no account enumeration). On success it redirects to `safeAdminRedirect(next)`: only internal `/admin` paths survive (no other origin, `//host`, backslash or control characters, dot-segment escape, or the login page itself), otherwise `/admin`. Sign-out (`signOutAction`) calls `supabase.auth.signOut()` (global scope: the session is revoked at the Auth server and the cookies cleared) and redirects to `/admin/login`. Passwords, tokens and auth errors are never logged, and the password is never returned to the browser.
- **Protected routes.** `/admin` and all descendants except `/admin/login`. Files: `app/admin/layout.tsx` (noindex/nofollow metadata for the whole area), `app/admin/login/page.tsx`, `app/admin/(protected)/layout.tsx` and `page.tsx`. The login page deliberately sits outside the `(protected)` group so the guard cannot redirect to itself. `/admin` is a branded placeholder stating that the workspace is ready and that live data is the next milestone; it shows no figures.
- **Proxy (`proxy.ts`, Next.js 16).** Matcher `["/admin", "/admin/:path*"]`, so public pages make no Supabase call. For protected paths: refreshes the session via `getClaims()`; writes refreshed cookies onto the request (so the Server Components of that same request do not refresh a single-use refresh token a second time), the response, and any redirect; redirects visitors who are not verified, allowlisted administrators to `/admin/login` (adding `?next=` for deeper paths); sets `Cache-Control: private, no-store` and `X-Robots-Tag: noindex, nofollow`. `/admin/login` is passed through untouched so the form and its Server Action are never blocked. Logic: `lib/auth/admin-proxy.ts` (dependency-injected, unit-tested); the Supabase variant for the proxy: `lib/supabase/proxy-client.ts`.
- **Server-side authorisation, independent of the proxy.** `lib/auth/require-admin.ts` (server-only): `requireAdmin()` returns the verified administrator or redirects to `/admin/login`; `getAdminAccess()` returns the decision without redirecting, for Route Handlers that should answer 401/403. The protected layout and the admin page both call `requireAdmin()` inside `<Suspense>` (reading the session is request-time under Cache Components, and layouts are not re-run on client-side navigation). **Every future admin page, Server Action and Route Handler must call it.**
- **Login UI.** Split layout: navy brand panel (logo on its white square, company name, POWER. PROTECTION. PROVISION.) and a warm-white form card with a gold top rule; stacked on mobile. Labelled email and password fields, a show/hide password toggle (`aria-pressed`, label names the action), server-validated field errors (`aria-invalid`, `aria-describedby`, focus moves to the first field to fix), a `role="alert"` message for a failed sign-in, a pending state ("Signing in…", announced through a live region). No sign-up, social sign-in, magic link or forgot-password link. Reuses `FormField`/`inputStyles` from the Contact form.
- **Tests (`tests/auth/`, `tests/supabase/`):** allowlist parsing (valid, several, case, missing, empty, malformed); access decision (allowlisted, not allowlisted, metadata ignored, invalid claims, errors and throws); safe redirects and path classification; the proxy's redirect behaviour, public login path, refreshed cookies and fail-closed cases (with a fake Supabase client, no network); sign-in logic including sign-out of non-administrators; structural checks (guards present in the layout and page, no registration anywhere, no `NEXT_PUBLIC_` admin variable, no credential logging, `/admin` independent of the demo data, sign-out ends the session then redirects). `tests/support/ts-resolve.mjs` gained a narrow fallback so Node can load `next/server`. The previous boundary test "no proxy exists" now asserts the opposite and that no database query exists.
- **Checked over HTTP against the production build (2026-11-13):** unauthenticated, garbage-cookie and forged-JWT-shaped-cookie requests to `/admin` and descendants (including `POST`s that mimic a Server Action) all redirect to `/admin/login`; the login page is public and `noindex`; a hostile `?next=` is rendered as `/admin`; the public pages and `/dashboard-preview/*` still return 200; no administrator id or key appears in any rendered HTML.
- **Manual testing:** the assistant could not test the signed-in paths (it has no administrator password and must not create accounts). The project owner reported on 2026-11-13 that the administrator sign-in was tested manually and works. **Not recorded as tested end to end:** an authenticated NON-allowlisted account (needs a second Supabase account) being refused and signed out. That path is covered only by unit tests with a fake client; test it with a real second account before relying on the allowlist in production.
- **Still outstanding in Stage 6:** tables, migrations and RLS (and RLS tests); live enquiry and appointment data in `/admin`; the server-side enquiry handler with validation, rate limiting and spam protection; CSV export; audit trail; a decision on closing self-service sign-up in the Supabase project (it is harmless to `/admin` thanks to the allowlist, but unused accounts can still be created and receive Supabase's confirmation emails); custom brute-force protection if Supabase Auth's own limits are not enough; Vercel environment variables for production; separate development and production Supabase projects.

### 6.13 Client feedback round (recorded 2026-11-13): more pictures, fewer graphs, transparent header

Triggered by the client's complaint that the site showed few of the photographs he had supplied, plus a design request from Sabi Programmers.

- **Finding: the live site was stale.** On 2026-11-13 https://boom-essential.vercel.app/ was about eight days old: it still showed the Industrial Equipment machine DRAWING (the client's screenshot), and its homepage had no link to Projects, Products or Careers. The repository already had the photograph, the Projects page and the links; the deployment needed pushing. Several complaints therefore stemmed from the old deployment, not the code.
- **Photographs instead of diagrams.** Only 12 authentic client photographs exist (8 installations, 4 products), all already in use, so the approach was to place them in more places honestly and to replace schematics with the labelled illustrative pictures where no real photograph exists (`docs/asset-inventory.md` §10 and §11). Energy: hero, services 01 and 02 are now real photographs (the bar chart, blueprint and solar-array drawings were deleted). Industrial Equipment: the drawing fallback was removed, and the homepage panel now shows the machines. Homepage: the hero's three bars are photographs (Energy real; Security and Foods labelled illustrative) and a new "Our work" band (`content/home-work.ts`) shows four installation photographs and links to Projects. Security: the hero schematic, the three equipment drawings and the assessment plan diagram became labelled illustrative pictures (five more of the supplied CCTV images). Foods: a wide band of the labelled staples picture under the introduction. Products catalogue: the recording and remote monitoring drawings became pictures. Unused drawing components were deleted. Still drawings: the three property-type scenes on the Energy page ("Who we serve"), the wheat on the Foods hero, packaging sizes and protein motifs on Foods, and decorative geometry; the client has not asked about these.
- **Missing links.** Projects and Products are in the desktop navigation, the mobile menu and the footer, Careers and Our team in the footer; the homepage now also links to Projects from the "Our work" band.
- **Transparent header.** See "Site header rules" in CLAUDE.md. Verified at 1440 px and 390 px on every page type, including the open mobile menu and the scrolled state.
- **Not changed:** no pricing, brand, place, date or capacity was added anywhere; no client photograph was edited (only the existing web crops are reused); labelled illustrative pictures stay labelled and are never used on `/projects`.

### 6.2 Stage 1 outcome (recorded 2026-11-03)

- **Git:** baseline commit made before any Stage 1 edits (no remote; repository stays private).
- **Design tokens** in `app/tokens.css` (Tailwind v4 `@theme`): five approved colours plus neutral tints/shades, Manrope/Inter stacks with system fallbacks, fluid type scale (14px floor), spacing (`gutter`, `section-sm/section/section-lg`), widths (`content` 80rem, `narrow` 60rem, `prose` 42rem), radius (2/4px/full), navy-tinted shadows, motion (150/250/450ms, standard easing), breakpoints (xs 480, sm 640, md 768, lg 1024, xl 1280, 2xl 1536). Tailwind's default palette, type sizes, radii and shadows are removed so only tokens can be used.
- **Fonts** via `next/font/google` in `lib/fonts.ts` (self-hosted at build; fallback stacks declared in tokens).
- **Shell:** sticky white header (compacts and gains shadow on scroll), disclosure-pattern "Our Divisions" dropdown with full keyboard support, Industrial Equipment separated by a divider (and under "Additional offering" in the drawer and footer), "Request a Consultation" action (`/contact#appointment`, a proposed anchor), modal mobile drawer below 1024px (focus trap, Escape, backdrop, scroll lock, inert when closed), footer on Charcoal Navy, floating WhatsApp action (hides while the footer is visible), skip link, branded 404 inside the shell.
- **Primitives:** Button, ButtonLink, TextLink, SmartLink, Container, Section, SectionHeading, inline SVG icons. No UI framework, icon library or animation dependency; no package versions changed.
- **Temporary preview:** `/` renders `app/(site)/_preview/` (colour and computed contrast table, type scale, controls, layout tokens, inspection guide) under a "Development preview" banner, `noindex`. Delete it at the homepage milestone.
- **Fixed during verification:** focus could not enter a panel whose `visibility` was transitioning (drawer open, dropdown ArrowDown). Both panels now use `inert` plus opacity/translate instead of `visibility`.
- **Known limitations:** navigation targets (`/about`, `/energy`, `/security`, `/foods`, `/industrial-equipment`, `/contact`) are not built yet and show the 404 page; the logo JPEG has a very faint non-white fringe on white; the footer copyright year is a constant (`new Date()` is disallowed during prerender); social links and email are omitted because none were supplied.

## 7. Testing strategy  **[Recommendation]**

- Unit tests for validation schemas and CSV generation (including formula-injection cases).
- Integration tests for server actions against a local/test Supabase.
- **RLS tests** (SQL or API level) proving: anon cannot read or write any table directly; non-admin users cannot read; admin can; notes are never exposed.
- End-to-end tests (Playwright) for: each form's happy and error paths, appointment submit leaving status "requested", admin login, filter/search, status change, export.
- Accessibility checks (axe) and manual keyboard pass; Lighthouse performance budgets on mobile throttling.
- Manual device checks on real Android and iOS phones and common Nigerian network conditions (slow 3G emulation).
- Specific checks: no food price anywhere in the public DOM or API responses; `/admin` absent from public nav and sitemap.

## 8. Deployment  **[Recommendation]**

- Vercel: production + preview deployments; environment variables per environment; custom domain boomessential.com (DNS access **[Confirm]**).
- Supabase: separate production project; migrations applied from `supabase/migrations`; backups enabled; region chosen for latency to Nigeria (nearest available, e.g. Europe) **[Confirm]**.
- Plans: Vercel Hobby is for non-commercial use; a commercial client site needs an appropriate plan. Supabase free projects can pause when inactive. Verify current terms and agree plan ownership and billing with the client **[Confirm]**.
- Launch checklist: HTTPS, redirects (www/non-www), metadata and Open Graph image (needs asset), `robots`/sitemap, favicon (needs asset), error pages, analytics only if approved, production smoke test, backup and rollback notes.

## 9. Technical risks

| Risk | Note |
|---|---|
| Missing photography | Largest design risk; see overview |
| Spam/abuse without CAPTCHA | Layered mitigations first; escalate if needed |
| Serverless rate limiting | Needs shared store (Postgres) |
| RLS mistakes | Mitigated by default-deny and automated RLS tests |
| Scaffolding into a non-empty root | Handle in Stage 0 without overwriting docs or assets |
| Free-tier limits and licence terms | Confirm plans before launch |
| Scope creep (email, CAPTCHA, maps, analytics) | Each is a separate approval |
