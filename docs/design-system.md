# Design System

Labels: **[Confirmed]** = from the brief; **[Proposed]** = our decision for approval. Nothing here is built yet.

## 1. Direction

Premium corporate: confident, editorial, restrained. It should feel like an established organisation, not a template. **[Confirmed]**

Avoid **[Confirmed]**: generic AI layouts; repetitive card grids; excessive rounded boxes; arbitrary gradients; decorative filler; heavy or distracting animation; poorly composed image areas; small or cramped type.

**Central idea [Proposed]:** the tagline *Power. Protection. Provision.* is the organising structure. Three divisions, three words, one identity. Use it for the home page rhythm and division navigation. (Confirm client is comfortable with the mapping.)

## 2. Colour  **[Confirmed values]**

| Token | Hex | Role **[Proposed]** |
|---|---|---|
| Deep Navy | `#092C59` | Primary brand colour; headers, hero grounds, primary buttons, headings on light |
| Gold | `#E9AD19` | Accent only: key actions on navy, thin rules, focus accents. Never body text on light backgrounds |
| Warm White | `#F7F8FA` | Page background |
| Charcoal Navy | `#172B42` | Body text, dark sections, admin chrome |
| Agricultural Green | `#287447` | BOOM Foods accent |

Contrast (calculated, WCAG 2.x): gold on Deep Navy ≈ 6.9:1 (passes); gold on white/warm white ≈ 2:1 (**fails**, so no gold text or thin gold icons on light); Deep Navy on Warm White ≈ 12:1; Green on Warm White ≈ 5.5:1 (passes AA). Check every combination again at build time.

Division accents **[Proposed]**: Energy = navy + gold; Security = charcoal navy + gold; Foods = green + gold. Tints/shades of the five colours may be derived for UI states and neutrals, but no new hues. Gradients only where they reproduce the logo's own metallic gold or serve a stated purpose (e.g. image legibility scrim).

Status colours for the admin dashboard (new/contacted/etc.) are functional; keep them muted and always paired with a text label. Not colour alone.

## 3. Typography  **[Confirmed proposal]**

- Headings: **Manrope**. Body: **Inter**. Load via `next/font` (self-hosted, no layout shift). Verify licences/subsets (Latin) at build.
- **[Proposed]** scale (fluid with `clamp`): display 56–88 px, H1 40–56, H2 32–40, H3 22–26, body 17–18, small 14–15, never below 14 px for content, 16 px minimum for form inputs (avoids iOS zoom).
- Line length 60–75 characters; line height ~1.6 body, 1.1–1.2 headings; generous letter-spacing on small uppercase labels only.
- Naira symbol and Nigerian phone numbers must render correctly in both fonts (test).

## 4. Layout principles  **[Proposed]**

- 12-column grid, generous outer margins, a clear spacing scale (4/8-based). Large vertical rhythm between sections.
- Editorial compositions: asymmetric splits, oversized type, full-bleed imagery, overlap of type and image where legible. Vary section structure from page to page; no stack of identical card grids.
- Lists of services are presented as indexed or ruled lists (numbered rows with hairline dividers), not boxed cards.
- Corners: square or minimal radius (≤ 4 px) for images and panels; larger radius only on small controls where it aids affordance.
- Thin gold rules and the logo's swoosh geometry are the only decorative devices.
- Navigation: sticky, compact on scroll; "Request a consultation" always reachable; WhatsApp link visible on mobile.
- Industrial Equipment is visually secondary to the three divisions (supports the "not a fourth division" requirement).

## 5. Responsive behaviour  **[Proposed]**

- Mobile first. Breakpoints approximately 480 / 768 / 1024 / 1280 / 1536.
- Target users are largely on mobile with variable connectivity: images responsive (`next/image`, AVIF/WebP, sized), minimal JS on public pages, tap targets ≥ 44 px, forms single-column on mobile.
- Mobile nav is a full-screen or large-panel menu with clear open/close states, keyboard and screen-reader accessible.
- Admin dashboard: desktop-first, but must remain usable on a phone (stacked list/detail views).
- Test widths: 360, 390, 768, 1024, 1440; check long names/positions and long product lists.

## 6. Animation  **[Proposed]**

- Purposeful and subtle: gentle reveal on scroll (opacity + ≤ 24 px translate, 300–600 ms, ease-out), link/button hover states, image slow-zoom on hover for division entries, menu transitions.
- No parallax-heavy, looping, autoplay or scroll-jacking effects.
- Honour `prefers-reduced-motion` (disable transforms, keep opacity). Animate only `transform`/`opacity`.
- Never delay content visibility behind animation (important for slow connections and SEO).

## 6.1 Decisions made in Stage 1 (implemented)

- Tokens live in `app/tokens.css`. Breakpoints are xs 480 / sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536; desktop navigation begins at lg, the drawer applies below it.
- Header is a solid white surface because the supplied logo is a JPEG on white. In the footer the logo sits on a white plate on Charcoal Navy. Original logo is never recoloured or cropped.
- Gold is used as: thin rules, buttons on navy/charcoal (navy text), the development-preview banner, and icons on charcoal. Never as text on light surfaces.
- Focus indicator: 2px navy outline on light surfaces, gold on dark (`data-surface="dark"`).
- Navigation uses a disclosure dropdown (button + links), not an ARIA menu. Industrial Equipment is separated from the three divisions everywhere it appears.
- The WhatsApp action uses Agricultural Green (no extra brand colour), is a 56px circle on phones and a labelled pill from 768px, and hides while the footer is in view.
- Motion: CSS only; panels use `inert` rather than `visibility` so focus can enter on the first frame of a transition.

## 7. Accessibility baseline  **[Recommendation]**

WCAG 2.2 AA target: visible focus states, semantic landmarks, labelled form fields with inline error text tied via `aria-describedby`, alt text on all meaningful images, skip link, sufficient contrast, keyboard operable menus and forms.

## 8. Image selection and handling  **[Confirmed rules + Proposed standards]**

Rules (client README, brief and review corrections) **[Confirmed]**:
1. **Authentic first.** Authentic client-supplied photographs and branding assets take priority over anything else.
2. Originals in `boom-client-assets/` are never edited, recoloured, distorted or overwritten.
3. Never generate replacement photographs of management members.
4. Never present generated or stock imagery as actual company products, installations, projects, customers or employees.
5. Marketing flyers remain references, not automatic website content. Never use a whole flyer as a hero or in place of real responsive text.
6. Only approved production images are copied into `public/`; reference material stays outside it.
7. **Illustrative supporting visuals** (non-photographic or clearly generic imagery used to support a layout where authentic photographs are unavailable) may be considered separately. They require approval from Sabi Programmers before use and must be clearly distinguished from real company work (see "Illustrative visuals" below).
8. Do not generate or introduce any image without approval.

Standards **[Proposed]**:
- Prefer authentic photography: wide, high-resolution, natural light, subject clearly in frame. Heroes need ≥ 2400 px wide originals.
- Portraits: common ratio (e.g. 4:5), proportional crop only, faces unobstructed, consistent size and treatment.
- Logo: use the supplied master logo unaltered (spacing and minimum size rules to be set once a vector version exists). On dark backgrounds, use it in its own white/light container only if a transparent version is unavailable. No recolouring.
- Alt text describes what is actually shown; decorative images get empty alt.
- Delivery: derive resized AVIF/WebP via the framework's image pipeline; keep a naming scheme `division-subject-NN.ext`.
- Until real photography exists: type-led layouts, with clearly marked placeholders in development only, never deployed publicly.

**Illustrative visuals [Proposed handling, approval required]**
- Each use needs prior approval from Sabi Programmers, decided per image or per set. Nothing is generated, sourced or added before that approval.
- Clear distinction from real work: illustrative visuals use a visibly different treatment from authentic photography (for example graphic/diagrammatic rather than photographic), carry honest alt text ("Illustration: …"), and are never captioned or placed so they imply a real Boom product, installation, project, customer or employee.
- Never used for management portraits or any person presented as a Boom employee or customer, and never as a stand-in for a specific product Boom sells.
- Stock photography falls under the same approval requirement and the same restrictions.
- Illustrative visuals are tracked in `asset-inventory.md` once approved, and are replaced by authentic photography when it becomes available.
