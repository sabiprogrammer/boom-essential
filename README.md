# BOOM MULTI GLOBAL — Website

Corporate website and private enquiry/appointment dashboard for BOOM MULTI GLOBAL COMPANY LIMITED (Akure, Ondo State, Nigeria). Delivered by Sabi Programmers.

**Status:** Stage 2 (homepage) approved and committed; Stage 3 (About Us, `/about`) approved and committed; Stage 4 in progress (BOOM Energy, `/energy`, approved and committed; BOOM Security, `/security`, approved and committed; BOOM Foods, `/foods`, approved and committed; Industrial Equipment, `/industrial-equipment`, awaiting review). The Contact page is not built yet and shows the 404 page. See `docs/implementation-plan.md` for the staged plan.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · ESLint · npm. Supabase and Vercel are planned for later stages and are not integrated yet.

## Requirements

- Node.js 20.9 or newer (developed on Node 22) and npm
- Git

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |

Before handing over any milestone, `npm run lint`, `npm run typecheck` and `npm run build` must all pass.

## Environment variables

Copy `.env.example` to `.env.local`. No variables are required yet. Never commit `.env.local` or any real secret.

## Project layout

```
app/              Next.js routes ((site) public pages, admin, actions)
components/       Shared components (layout, ui, forms, sections, admin)
hooks/            Reusable React hooks
lib/              fonts, navigation helpers; later supabase, validation, security, export
content/          Typed site content
supabase/         Migrations and RLS policies (Stage 6)
public/           Approved production assets only
docs/             Project documentation (source of truth)
boom-client-assets/  Client-supplied originals. Read-only, never served
```

Empty planned folders hold a `.gitkeep` placeholder until their stage begins.

## Documentation

Start with `CLAUDE.md`, then `docs/project-overview.md`, `content-specification.md`, `design-system.md`, `asset-inventory.md` and `implementation-plan.md`.

## Rules to remember

- Do not edit anything in `boom-client-assets/`. Only approved images are copied into `public/`.
- Keep the repository private: it contains client assets and, later, project configuration.
- Food prices are never shown publicly.
