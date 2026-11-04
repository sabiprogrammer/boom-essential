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
| 4. Division and equipment pages | Energy (**COMPLETE, awaiting approval and uncommitted, 2026-11-04**, see §6.5), then Security, Foods, Industrial Equipment (one page per review) | Content accuracy review |
| 5. Contact and forms (front end) | All six forms, validation UX, confirmation states | Review |
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

- **Git:** About Us committed first (`82772f7`). The Energy page is uncommitted pending review.
- **Page** at `/energy` (`app/(site)/energy/page.tsx`; own title, description, canonical, Open Graph with the master logo), composed from `components/energy/`: `EnergyHero` + `SolarGraphic` (sun rising on the hero's bottom edge behind a tilted two-row array, full-bleed SVG), `EnergyIntroSection`, `EnergyServicesSection` (assembles `ServiceFeature` with `LoadProfileDiagram` / `BlueprintDiagram` for services 01-02, `SystemBand` for 03-05, `SustainBand` for 06-09), `WhoWeServeSection`, `ApproachSection` (vertical rail), `EnergyClosingSection`; shared helpers `EnergyIcon` (ten drawn line icons) and `SunArcs`. Copy and structure are in `content/energy.ts`.
- **Imagery:** none supplied or used. All artwork is custom SVG/CSS in the brand palette (decorative, `aria-hidden`, no values or labels that could read as data). The approved homepage solar illustration is not reused here. No image was generated or sourced.
- **Shared change:** `app/motion.css` gained a `sun-rise` keyframe and `.sunrise` class (gated on `prefers-reduced-motion: no-preference`).
- **Links:** `Request a Solar Assessment` goes to `solarAssessmentHref` (= `/contact#appointment`, a proposed anchor); `/contact` still shows the 404 page until Stage 5.
- **Content guard:** an in-browser text check found none of "BOOM SOLAR", "food-processing businesses", "warranty" or "guarantee" on the page.
- **Verification:** lint, typecheck and production build pass; headless Chrome review at 360, 390, 768, 1024, 1280 and 1440px found no horizontal overflow; with reduced motion on, no animations run and all content is visible. Real-device and screen-reader testing have not been done.

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
