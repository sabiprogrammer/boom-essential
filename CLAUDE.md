# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Commercial website for **BOOM MULTI GLOBAL COMPANY LIMITED** (Akure, Ondo State, Nigeria), delivered by Sabi Programmers: a premium corporate site plus a private admin dashboard for customer enquiries and appointment requests. Tagline: **POWER. PROTECTION. PROVISION.**

**Status: Stages 0 to 3 approved and committed (homepage `9eebe17`, About Us `82772f7`). Stage 4 (division and equipment pages) is under way one page at a time: BOOM Energy (`/energy`) is approved and committed (`eda3caf`); BOOM Security (`/security`) is complete, awaiting approval and uncommitted; Foods and Industrial Equipment have not started.** Work one stage at a time (see `docs/implementation-plan.md`, §6 and §6.1–6.4) and stop for review at each gate. Do not build pages, forms, backend or dashboard before their stage is approved.

**Homepage content rules:** sections live in `components/home/`, copy data in `content/` (`divisions`, `featured-solutions`, `values`, `leadership`). The client's own wording for the three core values is in `content/values.ts` and shown verbatim on the homepage and About Us; never paraphrase or extend it.

**BOOM Energy rules:** sections live in `components/energy/`, copy in `content/energy.ts`. Use "BOOM ENERGY", never "BOOM SOLAR". The nine services keep their supplied titles and descriptions. Never add capacities, performance figures, warranties, manufacturer partnerships, certifications, statistics, testimonials, completed-project claims or response/installation times. No photography: artwork is custom SVG/CSS, and the approved homepage solar illustration stays on the homepage only. Do not describe pounding machines as being for "food-processing businesses". The assessment CTA target is `solarAssessmentHref` in `content/energy.ts`.

**BOOM Security rules:** sections live in `components/security/`, copy in `content/security.ts`. The seven services keep their supplied titles and descriptions. Never add brands, models, specifications, camera counts, ranges, monitoring arrangements, response times, warranties, service levels, certifications, statistics, testimonials, customer names or completed-installation claims. No photography: artwork is custom SVG/CSS, the hero schematic must keep its "illustrative, not a BOOM installation" caption, and the homepage CCTV illustration stays on the homepage only. Pounding machines are described as being for the restaurant business. The assessment CTA target is `securityAssessmentHref` in `content/security.ts`.

**About Us rules:** sections live in `components/about/`, copy in `content/about.ts`. Leadership shows photograph, full name and official position only; `LeadershipMember.bio` (in `content/leadership.ts`) stays empty until the client supplies biographies. Portraits are byte-identical copies in `public/assets/images/leadership/`, framed only by crop boxes in `content/leadership.ts` (never edited, retouched or replaced). Do not add a founding year, history, headcount, statistics, partnerships, certifications or coverage claims. No real photographs are used. The three division visuals use temporary **AI-generated illustrative images** (`public/assets/images/homepage/illustrative/`, wired in `content/division-images.ts`, each with an "Illustrative image" label and honest alt text; see `docs/asset-inventory.md` §4a). They are placeholders to be replaced by authentic photography, and must never be used for leadership, product specifications or project evidence, or presented as BOOM's work. Portraits are not used on the homepage until the issues in `docs/asset-inventory.md` are resolved.

The project root is the application root. Never create a nested app directory.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # next typegen && tsc --noEmit (typegen is required; plain tsc fails on LayoutProps)
npm run build        # production build
```

No test runner is installed yet (planned: unit, RLS and Playwright tests in later stages). Lint, typecheck and build must pass before any milestone is handed over.

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

## Read these first (the docs are the source of truth)

- `docs/project-overview.md`: company facts, confirmed requirements, outstanding client questions, risks. Defines the labels **[Confirmed] / [Proposed] / [Recommendation] / [Confirm]**.
- `docs/content-specification.md`: sitemap, page content, forms, leadership.
- `docs/design-system.md`: colours, type, layout, motion, image standards.
- `docs/asset-inventory.md`: every supplied asset, dimensions, problems, gaps.
- `docs/implementation-plan.md`: stack, structure, schema, security, staged plan, testing.

When a decision changes, update the relevant doc, not just the code.

## Business structure (do not get this wrong)

- Three principal divisions: **BOOM Energy** (solar/energy), **BOOM Security** (CCTV, fencing, access control), **BOOM Foods** (garri, Ekiti garri, fufu powder, Ofada rice, Igbemo rice, smoked fish, frozen chicken).
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
- Flyers are references, not facts (they use the older BOOM SOLAR branding). Flyer-only claims (e.g. "from our farms", livestock, 600 L deep freezer, storage-system specs) need client confirmation before use.
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
