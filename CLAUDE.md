# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Commercial website for **BOOM MULTI GLOBAL COMPANY LIMITED** (Akure, Ondo State, Nigeria), delivered by Sabi Programmers: a premium corporate site plus a private admin dashboard for customer enquiries and appointment requests. Tagline: **POWER. PROTECTION. PROVISION.**

**Status: Stages 0 to 3 approved and committed (homepage `9eebe17`, About Us `82772f7`). Stage 4 (division and equipment pages) is under way one page at a time: BOOM Energy (`/energy`) is approved and committed (`eda3caf`); BOOM Security (`/security`) is approved and committed (`f6f7f7b`); BOOM Foods (`/foods`) is approved and committed (`9fff678`); Industrial Equipment (`/industrial-equipment`) is approved and committed (`346b703`). Stage 5 (Contact and enquiry interface, `/contact`) is complete as a frontend only and committed (`3857852`). A frontend-only **dashboard preview** (`/dashboard-preview`, fictional data, no login by design) with Call and WhatsApp contact actions is built and committed (`0fa9fff`, pushed to `origin/main` at github.com/sabiprogrammer/boom-essential by the user) and is live at https://boom-essential.vercel.app/. The repository now has that GitHub remote; Claude still never pushes or changes remotes, and does not commit unless asked. The dashboard refinement (relative dates, demo contact actions, drawers) is committed (`90c9430`). Client corrections received 10 Nov 2026 are applied but uncommitted: wording fixes, the Garri Ekiti rename, the "Boom Multi Global" casing, grouped featured solutions, new pages **Projects** (`/projects`), **Products catalogue** (`/products`) and **Careers** (`/careers`), footer and menu links, and the client’s new photographs (see `docs/client-corrections-2026-11-10.md`). Stage 6 (backend and data, real `/admin`) has not started.** Work one stage at a time (see `docs/implementation-plan.md`, §6 and §6.1–6.4) and stop for review at each gate. Do not build pages, forms, backend or dashboard before their stage is approved.

**Homepage content rules:** sections live in `components/home/`, copy data in `content/` (`divisions`, `featured-solutions`, `values`, `leadership`). The client's own wording for the three core values is in `content/values.ts` and shown verbatim on the homepage and About Us; never paraphrase or extend it.

**BOOM Energy rules:** sections live in `components/energy/`, copy in `content/energy.ts`. Use "BOOM ENERGY", never "BOOM SOLAR". The nine services keep their supplied titles and descriptions. Never add capacities, performance figures, warranties, manufacturer partnerships, certifications, statistics, testimonials, completed-project claims or response/installation times. Artwork is custom SVG/CSS (the three property-type drawings in "Who we serve" are labelled illustrative), and the approved homepage solar illustration stays on the homepage only. Authentic client installation photographs appear under services 03 to 05 (`content/energy-service-photos.ts`) and on `/projects`; never name a brand, place, date or capacity in their captions. Do not describe pounding machines as being for "food-processing businesses". The assessment CTA target is `solarAssessmentHref` in `content/energy.ts`.

**Contact and enquiry rules:** sections live in `components/contact/`; copy in `content/contact.ts`; the allowlist of categories and interests in `content/enquiry-options.ts`; link builders in `content/enquiry-links.ts` (plus `foodsEnquiryHref` and `industrialEnquiryHref`, which stay the source of truth for their URL patterns); form logic in `lib/enquiry/` and `hooks/useEnquiryForm.ts`. The form is FRONTEND ONLY: `submitEnquiry` sends and stores nothing, `enquirySubmissionEnabled` is false, and the UI must never show success without a confirmed server response. No localStorage, sessionStorage or cookies for customer data; no mailto; no invented email, hours, social links, map or response times. URL values are untrusted: only allowlisted values may select a category or interest. Appointment requests are never confirmed by the site; keep the notice "Appointment requests are subject to confirmation by our team. Submitting a request does not constitute a confirmed booking." Do not add Supabase or backend code until Stage 6 is approved.

**Dashboard preview rules:** `/dashboard-preview` is a DEMONSTRATION with fictional data (Demo Customer NN, example.com emails, 000 phone numbers), open without login on purpose and noindex. It must stay frontend only: no Supabase, auth, database, server actions, API routes, network requests or browser storage, and never connected to the public enquiry form. It shows the banner "DEMO PREVIEW — Sample data only. No live customer records are connected." at all times, and every simulated change (status, appointment confirmation, note) is labelled demo only and never claims to be saved. Components live in `components/dashboard-preview/`, copy in `content/dashboard-preview.ts`, data and pure logic in `lib/dashboard-preview/` (replace `demo-enquiries.ts` with real queries later). Dates are never typed into the demo data: every date is an offset from the demo reference (`lib/dashboard-preview/reference.ts`: the Africa/Lagos calendar day plus the instant "now", chosen ONCE per page load in the browser by `hooks/useDemoReference.ts`, never during prerender and never stored). The server therefore renders only a placeholder (`DemoReadyGate`) and the sample data appears after hydration, so there is no hydration mismatch; functions that need "today" take it as a parameter (`dates.ts`, `appointments.ts`, `stats.ts`); `createDemoEnquiries(reference)` builds the records. Upcoming means today or later. Demo phone numbers are `+234 000 DEMO 00NN` placeholders (letters, so never callable): never put a real or realistic-looking number in the demo data. Call and WhatsApp (`components/dashboard-preview/ContactActions.tsx`) are controlled by `contactActionsMode` in `lib/dashboard-preview/contact-mode.ts`: in "demo" they only show a notice and never open the dialler or WhatsApp; in "live" they use `buildContactActions()` (valid Nigerian mobile numbers only, `tel:` and `https://wa.me/...` with a prefilled message the administrator sends manually; no link for missing or invalid numbers). Never put real customer data here. The real protected dashboard is a separate `/admin` stage.

**Industrial Equipment rules:** sections live in `components/industrial/`, copy in `content/industrial-equipment.ts`. It is an ADDITIONAL OFFERING, never a fourth division: never number it, style it as a division or use `division=` in its links. The only product is pounding machines, supplied in different sizes for the restaurant business; the only audiences are restaurants and restaurant owners and operators. Never add sizes, capacities, power ratings, dimensions, materials, brands, prices, warranties, certifications, other customer segments (factories, general food-processing companies) or the phrase "food-processing businesses". The enquiry link is built by `industrialEnquiryHref()` (`/contact?offering=industrial-equipment&product=pounding-machine#enquiry`); the Contact stage must honour it. The client’s own machine photographs (`content/product-photos.ts`) are cropped from flyers: the banner and the PRICE panels are always cropped out and prices never appear. `industrialContent.productImage` is set to the smaller-machines photograph (the hero), and the options section shows both photographs; set `productImage` to `undefined` to fall back to the generic drawing.

**BOOM Foods rules:** sections live in `components/foods/`, copy and product data in `content/foods.ts`. No prices or price-implying wording anywhere, no checkout, payments, inventory or accounts. Household staples (garri, Garri Ekiti, fufu powder, Ofada rice, Igbemo rice) are stated only as supplied in bag sizes ranging from 1kg to 100kg; never add per-product weights, availability, grades, species, cuts, brands, storage specifications, certifications, origins, contracts or volumes. Every product enquiry link is built by `foodsEnquiryHref()` (`/contact?division=foods&product=<slug>#enquiry`); the Contact stage must honour it. "From our farms and trusted sources to your table." is flyer-derived (supplied in the Stage 6 brief) and still needs client confirmation. No food photographs have been supplied: the homepage Foods illustration (AI-generated, labelled "Illustrative image") is also reused above the Products catalogue Foods entries; other artwork is custom SVG/CSS. Use white (not the muted grey) for text on Agricultural Green.

**BOOM Security rules:** sections live in `components/security/`, copy in `content/security.ts`. The seven services keep their supplied titles and descriptions. Never add brands, models, specifications, camera counts, ranges, monitoring arrangements, response times, warranties, service levels, certifications, statistics, testimonials, customer names or completed-installation claims. Artwork is custom SVG/CSS, the hero schematic must keep its "illustrative, not a BOOM installation" caption, and the homepage CCTV illustration stays on the homepage only. The client’s solar-powered camera is a white-background PRODUCT image (`content/product-photos.ts`), always shown with the "Product image" note, never as an installation; the dome, bullet and recorder drawings in `SecurityEquipmentSection` are labelled illustrative. Sourcing more CCTV imagery: `docs/security-imagery-brief.md`. Pounding machines are described as being for the restaurant business. The assessment CTA target is `securityAssessmentHref` in `content/security.ts`.

**About Us rules:** sections live in `components/about/`, copy in `content/about.ts`. Leadership shows photograph, full name and official position only; `LeadershipMember.bio` (in `content/leadership.ts`) stays empty until the client supplies biographies. Portraits are byte-identical copies in `public/assets/images/leadership/`, framed only by crop boxes in `content/leadership.ts` (never edited, retouched or replaced). Do not add a founding year, history, headcount, statistics, partnerships, certifications or coverage claims. No real photographs are used. The three division visuals use temporary **AI-generated illustrative images** (`public/assets/images/homepage/illustrative/`, wired in `content/division-images.ts`, each with an "Illustrative image" label and honest alt text; see `docs/asset-inventory.md` §4a). They are placeholders to be replaced by authentic photography, and must never be used for leadership, product specifications or project evidence, or presented as BOOM's work. Portraits are not used on the homepage until the issues in `docs/asset-inventory.md` are resolved.

**Client corrections rules (10 Nov 2026):** the product is **Garri Ekiti** everywhere (its URL slug stays `ekiti-garri`); the short brand name is written "Boom Multi Global", never in capitals (only `company.legalName` and division names such as BOOM ENERGY stay capitalised); the company is "with its head office in Akure", never "based in Akure". The homepage featured-solutions list is grouped by category (Energy, Security, Foods) with continuous numbering. **Projects** (`content/projects.ts`, `content/project-photos.ts`) shows only the client's installation photographs with factual captions: no names, places, dates, capacities or brands. **Products catalogue** (`content/product-catalogue.ts`) has no prices; every entry links to an enquiry the Contact page accepts (tested). **Careers** (`content/careers.ts`) states only that no vacancies are listed, plus the confirmed phone and WhatsApp, until the client supplies wording. "Our team" is `/about#leadership`. New client photographs are used only as crops in `public/assets/images/projects|products/` (never the originals): the GPS stamp, phone watermarks, logo overlays, phone UI and flyer banners/prices are cropped out. The header navigation is tight: keep labels `whitespace-nowrap` and re-measure at 1024, 1280 and 1440 when adding items.

The project root is the application root. Never create a nested app directory.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # next typegen && tsc --noEmit (typegen is required; plain tsc fails on LayoutProps)
npm run build        # production build
```

`npm test` runs the unit tests in `tests/` with Node's built-in runner (`node:test`; no dependency; `tests/support/` lets Node load the project's TypeScript and `@/` imports). They cover the dashboard preview's dates, demo data, phone normalisation and contact links. Browser, RLS and Playwright tests are planned for later stages. Lint, typecheck, tests and build must pass before any milestone is handed over.

## Stack and layout (as installed)

Next.js 16.4.4 (App Router, Turbopack), React 19.3, TypeScript 5.9 (strict), Tailwind CSS 4.3, ESLint 9, npm, Node ≥ 20.9. Path alias `@/*` maps to the project root (no `src/`). Folders not yet used (`app/admin`, `app/actions`, `components/{forms,sections,admin}`, `lib/{supabase,validation,security,export}`, `supabase/migrations`) are `.gitkeep` placeholders. `AGENTS.md` (from the Next.js CLI) says to read the version-matched docs in `node_modules/next/dist/docs/` before writing Next code; do so, since this version differs from older Next.js.

**Where things live (Stage 1):** design tokens in `app/tokens.css` (single source of truth: colour, type, spacing, widths, radius, shadow, motion, breakpoints) and base styles in `app/globals.css`; fonts in `lib/fonts.ts`; confirmed company facts in `content/company.ts`; navigation in `content/navigation.ts`; UI primitives in `components/ui/` (Button, ButtonLink, TextLink, SmartLink, Container, Section, SectionHeading, icons); site frame in `components/layout/` (`SiteShell` wraps header, footer, WhatsApp action; used by `app/(site)/layout.tsx` and `app/not-found.tsx`); reusable hooks in `hooks/`. The public logo copy is `public/assets/branding/boom-multi-global-logo.jpeg` (byte-identical to the original; it is a JPEG on white, so it sits on white surfaces).

**Next.js 16 caching (intentional configuration, do not remove):** `cacheComponents` and `partialPrefetching` stay enabled.
- Dynamic or request-time data needs a `<Suspense>` boundary (or `use cache` for genuinely shareable data).
- `new Date()`, `Math.random()` and similar fail prerender, so the footer year is a constant in `content/company.ts`.
- **Never cache private data across users or sessions**: enquiries, appointments, admin pages, notes and CSV exports must not use `use cache` or be statically prerendered. Read the session/cookies at request time inside Suspense.
- Do not introduce unsafe caching of authenticated data.

**Maintenance items before production release:**
1. ESLint 9 is end-of-life (npm prints a deprecation notice) and `npm audit` reports 16 moderate findings in the ESLint toolchain (dev-only; none in production dependencies). Upgrade the lint toolchain when `eslint-config-next` supports a supported ESLint. Do not run `npm audit fix` or `npm audit fix --force` (the suggested fixes are major downgrades).
2. **Launch blocker (backend): the enquiry form is a development preview.** It sends and saves nothing, so a public launch needs the Stage 6 server-side handler first (see `docs/implementation-plan.md` §6.9). The "Development preview" notice disappears when `enquirySubmissionEnabled` is set to true.
3. **Launch blocker (content): "From our farms and trusted sources to your table."** (BOOM Foods hero, `content/foods.ts` `hero.statement`) is client-supplied marketing wording, but it is not confirmed that BOOM operates farms. It stays in the development build only. The client must confirm it before public launch; if they cannot, remove or reword it.

## Read these first (the docs are the source of truth)

- `docs/project-overview.md`: company facts, confirmed requirements, outstanding client questions, risks. Defines the labels **[Confirmed] / [Proposed] / [Recommendation] / [Confirm]**.
- `docs/content-specification.md`: sitemap, page content, forms, leadership.
- `docs/design-system.md`: colours, type, layout, motion, image standards.
- `docs/asset-inventory.md`: every supplied asset, dimensions, problems, gaps.
- `docs/implementation-plan.md`: stack, structure, schema, security, staged plan, testing.

When a decision changes, update the relevant doc, not just the code.

## Business structure (do not get this wrong)

- Three principal divisions: **BOOM Energy** (solar/energy), **BOOM Security** (CCTV, fencing, access control), **BOOM Foods** (garri, Garri Ekiti, fufu powder, Ofada rice, Igbemo rice, smoked fish, frozen chicken).
- **Industrial Equipment** (pounding machines, food-processing equipment) is an additional offering with its own page and nav item. It is **not** a fourth division.
- Pages: Home, About Us, BOOM Energy, BOOM Security, BOOM Foods, Industrial Equipment, Contact Us, plus the private Admin Dashboard (never in public navigation).
- The public-facing name of the solar division is **BOOM ENERGY** (client-confirmed). "BOOM SOLAR" is an older branding reference found on promotional materials; do not use it as a public name.
- Confirmed core values: **Customer-First, Honesty, Progress**. Do not add others. Mission and vision statements are unconfirmed; never invent them.

## Technology direction (agreed for planning)

Next.js App Router, TypeScript, Tailwind CSS, Supabase (Postgres + Auth), Vercel. Supabase is not integrated yet (Stage 6). Keep the architecture simple. Do not add dependencies, third-party services (CAPTCHA, maps, analytics, email) or architectural changes without approval. Email notifications are explicitly out of scope.

## Non-negotiable rules

**Content accuracy**
- Never invent business claims, statistics, years in business, warranties, certifications, testimonials, customer names, achievements, or leadership biographies. Leadership shows photo, full name and official position only until the client supplies more.
- **Food prices must never appear publicly** (no price fields in data, UI or API responses). Food enquiries capture product + quantity.
- Flyers are references, not facts (they use the older BOOM SOLAR branding). Flyer-only claims (e.g. livestock, 600 L deep freezer, storage-system specs) need client confirmation before use. "From our farms and trusted sources to your table." is used on the Foods page at Sabi Programmers' instruction and is pending client confirmation.
- Missing info goes in the **[Confirm]** lists in the docs; never fill it in.

**Assets**
- `boom-client-assets/` is read-only. Never edit, recolour, distort, overwrite or replace the logo or portraits; crop proportionally, preserve faces.
- Only approved production images are copied into `public/`. Keep reference material (flyers, contact sheet) outside `public/`.
- Image policy:
  - Authentic client-supplied photographs and branding assets take priority.
  - Never generate replacement photographs of management members.
  - Never present generated or stock imagery as actual company products, installations, projects, customers or employees.
  - Marketing flyers are references, not automatic website content.
  - Illustrative supporting visuals may be considered where authentic photographs are unavailable, but only with approval from Sabi Programmers, and they must be clearly distinguished from real company work.
  - Do not generate or introduce any image without approval. Report asset gaps instead of filling them.

**Appointments and security**
- A submitted appointment request is never auto-confirmed; only an administrator confirms.
- Server-side validation for every public submission; RLS on every table; internal notes never reachable publicly; CSV export admin-only; rate limiting and spam protection; secrets only in environment variables (service-role key server-only).

## Design standards

Brand colours: Deep Navy `#092C59`, Gold `#E9AD19`, Warm White `#F7F8FA`, Charcoal Navy `#172B42`, Agricultural Green `#287447`. Fonts: Manrope (headings), Inter (body). Gold fails contrast on light backgrounds, so use it only as an accent or on navy.

The result must look premium and bespoke, not like an AI template: editorial layouts, strong hierarchy, authentic photography, purposeful subtle motion, excellent mobile layout. Avoid repetitive card grids, excessive rounded boxes, arbitrary gradients, decoration for its own sake and small type. Design quality is never traded away for implementation convenience. Details are in `docs/design-system.md`.

## Workflow

- Work incrementally by stage (see `docs/implementation-plan.md`) and stop for review at each milestone. Never build the site in one large operation.
- No unapproved architectural decisions. If something is ambiguous, ask.
- Code is clean, reusable and maintainable. The global single-responsibility rule applies: one concern per file.
- British spelling in site copy (to be confirmed with the client).
- Confirmed contacts: main phone +234 805 554 4415; WhatsApp +234 816 650 3634 (`https://wa.me/2348166503634`); website www.boomessential.com; office at Petrocam Filling Station, Federal Housing Estate, Shagari, Akure, Ondo State, Nigeria.
