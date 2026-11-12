# Client corrections received 10 November 2026

Source: seven WhatsApp screenshots in `boom-client-assets/correction/` and twelve images in `boom-client-assets/new_from_client/` (both read-only). Sabi Programmers answered the planning questions on 2026-11-10 (see "Decisions").

## The seven corrections

| # | Client's note | What changed |
|---|---|---|
| 1 | "Nigeria, but with head office in Akure, Ondo State" | Company copy now says an indigenous Nigerian company **with its head office in Akure, Ondo State** (About, homepage intro, page descriptions). The office address in the footer and Contact page is unchanged |
| 2 | "Meet our leadership team" | Homepage leadership link text changed from "Meet the team on our About Us page" |
| 3 | "Garri Ekiti. Then arrange them by categories" | Product renamed **Garri Ekiti** everywhere (the enquiry URL slug stays `ekiti-garri`). The homepage "Featured solutions" list is grouped Energy, Security, Foods, numbered 01 to 09 straight through |
| 4 | "Boom Multi Global (no need to write in full capital letter). The Management Team (no need to repeat coy name)" | About leadership heading is "The People Behind Boom Multi Global." and its lead is "The Management Team." The short brand name is now "Boom Multi Global" in all site copy, titles and alt text |
| 5 | "Each offering should have pictorial images or project catalogue" | Real installation photographs under Energy services 03 to 05; drawings of a house, a shop and a school under the three property types; a CCTV equipment section on the Security page; the two machine photographs on Industrial Equipment; and two new pages: **Projects** and **Products catalogue** |
| 6 | "Include: Careers, Our team" (footer) | Footer quick links now include **Our team** (the leadership section of About Us) and **Careers** (new page); Projects and Products catalogue are in the footer too |
| 7 | "Include: Projects, Products catalogue" (menu) | Both added to the desktop navigation and the mobile menu |

## Decisions (Sabi Programmers, 2026-11-10)

1. Rename "Ekiti garri" to "Garri Ekiti" everywhere.
2. Apply the capitalisation change everywhere. **Boundary chosen by Claude:** the registered legal name in `content/company.ts` (`legalName`, "BOOM MULTI GLOBAL COMPANY LIMITED", used in the copyright line, structured data and the Who We Are fact row) and the division names (BOOM ENERGY and so on) stay in capitals; the WhatsApp follow-up message in the dashboard preview also keeps the legal name. Change `legalName` if the client wants it title-cased too.
3. Build Projects, Products catalogue, Careers and Our team.
4. The new photographs may be published (rights, consent and visible equipment brands accepted).
5. Prices stay off the site (they are cropped out of the machine flyers).
6. Pictures for every offering, across all pages.
7. CCTV imagery: a mix of routes (see `docs/security-imagery-brief.md`).

## New pages

| Page | Route | Content |
|---|---|---|
| Projects | `/projects` | Eight installation photographs with factual captions; no names, places, dates or capacities |
| Products catalogue | `/products` | By division, then Industrial Equipment; pictures or labelled drawings; every entry links to a pre-filled enquiry; no prices |
| Careers | `/careers` | Says only that no vacancies are listed and gives the phone and WhatsApp numbers. **Needs the client's wording** (roles, how to apply) |
| Our team | `/about#leadership` | Not a new page: the existing leadership section on About Us |

## Image handling

Web copies in `public/assets/images/projects/` and `public/assets/images/products/` are crops of the originals, which are untouched. Cropped out: a GPS stamp that printed a street address and coordinates, phone watermarks, a manufacturer's logo overlay, phone screenshot chrome, and the banner and **price panels** of two flyers. Equipment brand names remain visible on some devices; captions and alt text never name a brand, place, date or capacity.

## Still needed from the client

- Wording for Careers (vacancies, roles, how to apply). Email addresses are coming from Sabi Programmers.
- Confirmation of "From our farms and trusted sources to your table." (BOOM Foods hero): does BOOM operate farms? It stays a pre-launch blocker until answered.
- Whether the flyers' names ("Pounded yam machine") should replace "pounding machine" (the site follows the original brief: pounding machines for the restaurant business).

## Answers received (Sabi Programmers, 2026-11-11)

- **Solar street lights:** confirmed as supplied by BOOM. The catalogue entry now carries one factual line ("Solar-powered street lights for outdoor and roadside lighting.") and nothing more: no specifications, wattage, quantities or availability.
- **Solar-powered camera model:** no model name is shown. Sabi Programmers suggested inventing a "very common model"; declined because a model name on the site is a product claim, and an invented one could be false. The camera stays "Solar-powered CCTV camera" with the "Product image" note until the client names the model.
- **"Garri and Garri Ekiti" in the Foods summary lines:** kept. These are two products (Garri and Garri Ekiti), and the client's correction #3 supplies the Garri Ekiti name.
- **Legal name:** left in capitals as the client wrote it (decision 2 above stands).
- **Photographs:** the client is supplying none; Sabi Programmers were asked to source the CCTV imagery. Stock and AI images stay, always labelled "Illustrative image".
