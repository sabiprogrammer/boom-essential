# Security (CCTV) imagery: sourcing brief

Status: prepared 2026-11-10 at the client's request ("make sure CCTV/security images are well represented on the website").
Owner: Sabi Programmers. Nothing in this file has been downloaded, generated or published except where marked **Done**.

## Where we are

| Route | What | Status |
|---|---|---|
| A. Custom SVG drawings | Dome camera, bullet camera, recorder and monitor (Security page and Products catalogue); fence, access and monitoring diagrams already existed | **Done.** Each is labelled "illustrative" and says it is not a BOOM product |
| Client photograph | One solar-powered multi-lens CCTV camera, white background, supplied by the client | **Done.** Shown as a "Product image" (Security page, Products catalogue). It is a product shot, not an installation |
| B. Generated scene images | Photorealistic scenes for the Security page and the catalogue | **Done (2026-11-12).** Sabi Programmers generated all six prompts (three variants each; two variants of prompts 2 and 5 were missing). Four are live: dome (prompt 1), bullet shopfront (4), solar pole (2) and monitoring desk (3), on the Security page; credits and the reasons the rest are unused are in `docs/asset-inventory.md` §10 |
| C. Licensed stock photographs | Free-licence photographs, labelled illustrative | **Partly done.** Two are live (perimeter fence, access control terminal) on the Security page and in the catalogue; credits in `docs/asset-inventory.md` §9. Dome camera, control room and the rest are still open (see "Route C") |
| D. The client's own installation photographs | The only authentic option | **To request** (message below) |

## Rules that apply to every route

- Anything that is not a photograph of real BOOM work carries the **"Illustrative image"** label (`IllustrativeLabel`) and an alt text that describes only what is visible (Sabi Programmers' instruction, 2026-11-12: the site never states how an image was made; stock photographs also say "stock photograph" and "not a BOOM installation" in their alt text, as already live). See `docs/asset-inventory.md` §4a and `content/division-images.ts` for the existing pattern.
- Never use illustrative images as project evidence, never on the Projects page, never as "our work".
- No readable brand names, logos, licence plates, street names or house numbers; no identifiable faces.
- No camera counts, ranges, resolutions or other specifications in captions.
- Store files in `public/assets/images/security/illustrative/` (create it) and register them in a content file, not inline in components.

## Route B: prompts for generation (Sabi Programmers)

Generate at 16:9 or wider, 2000 px on the long edge or more. Add to every prompt: *photorealistic, natural light, no text, no logos, no brand names, no identifiable faces.* Save as JPEG and tell Claude the filenames. Claude then crops, wires and labels them.

| # | File name | Where it goes | Prompt |
|---|---|---|---|
| 1 | `cctv-dome-eave-residential.jpg` | Security hero and homepage Security panel candidates | A dome CCTV camera fixed under the eave of a two-storey Nigerian family home, late afternoon light, a painted perimeter wall and a metal gate softly out of focus behind it |
| 2 | `cctv-bullet-shopfront.jpg` | Security services, Products catalogue | Two bullet CCTV cameras mounted at the corners of a small shopfront in a Nigerian town, roller shutter half open, daytime |
| 3 | `cctv-control-monitors.jpg` | Remote monitoring | A security desk with a wall of monitors showing several camera views of a compound, shot from behind the operator so no face is visible, dim room, screens glowing |
| 4 | `security-fence-gate.jpg` | Fencing and perimeter | A concrete compound wall topped with an electric security fence and a sliding metal gate at dusk, tidy driveway, no vehicles |
| 5 | `access-control-keypad.jpg` | Access control | A keypad and card reader mounted beside a glass office door, close shot, shallow depth of field, no readable text on the device |
| 6 | `cctv-solar-pole-school.jpg` | Institutional audience, solar-powered camera | A solar-powered CCTV camera on a steel pole at the entrance gate of a school compound, morning light, no children or people in frame |

Suggested alt text pattern: "A dome CCTV camera under the eave of a two-storey house, with a perimeter wall and gate behind it."

## Route C: licensed stock photographs

Claude cannot browse for or download photographs without your explicit approval for each file. When you approve this route, Claude will bring a shortlist with, for each candidate: the file name, the source page, the photographer and licence, the pixel size and the file size. Nothing is downloaded until you say yes to that list. Acceptable sources are those whose licence allows commercial use on a company website (for example Unsplash and Pexels, whose licences permit this without attribution); keep a copy of each licence page in `docs/`. Stock photographs follow the same rules as Route B: labelled illustrative, never presented as BOOM work.

### Route C shortlist (researched 2026-11-10; nothing downloaded)

Each page below was opened and its details read on 2026-11-10. **Not yet seen:** the photographs themselves, because viewing one means downloading it, which needs your approval. Descriptions come from the pages. File sizes are not stated on any of the pages and will be reported after download.

**Licences (read from the licence pages).**
- *Pexels License:* free to use on a website, edit and use without credit (credit is appreciated). Not allowed: showing identifiable people in an offensive light, implying a person or brand endorses us, using a photo as part of a trademark or business name, and selling unaltered copies or redistributing on other stock sites.
- *Unsplash License:* free for commercial use, edit and use without credit. Not allowed: selling images without significant modification, and building a competing image library. It sets no rules on people, brands or endorsement, so the same care applies.

| # | Slot (prompt) | Page | Photographer | Pixels | What the page says it shows | Verdict |
|---|---|---|---|---|---|---|
| C1 | Dome camera, wall-mounted (1, 2) | [Pexels 29866272](https://www.pexels.com/photo/outdoor-security-camera-on-concrete-wall-29866272/) | Thomas VEILLON | 6240 x 4160, landscape | Close-up of a dome security camera on a concrete wall; no people | **Recommend** |
| C2 | Camera on a building exterior (2) | [Pexels 13156207](https://www.pexels.com/photo/white-and-black-cctv-on-the-wall-13156207/) | Towfiqu barbhuiya | 3456 x 5184, portrait | Close-up of a mounted security camera on a modern building exterior | Possible; portrait suits a narrow slot |
| C3 | Two cameras on a wall (2) | [Pexels 14534706](https://www.pexels.com/photo/a-pair-of-black-surveillance-cameras-on-white-wall-14534706/) | Ja Kubislav | 3939 x 5908, portrait | Surveillance cameras on an industrial building exterior | Possible; an industrial look rather than a shopfront |
| C4 | Control room (3) | [Pexels 30481728](https://www.pexels.com/photo/security-control-room-with-diverse-team-monitoring-30481728/) | AMORIE SAM | 7008 x 4672, landscape | A control room where a team watches live feeds | **Hold:** it shows a team of people, which breaks our "no identifiable faces" rule unless the preview shows faces are not identifiable |
| C5 | Fence line and perimeter (4) | [Unsplash wW5vKD8MJGA](https://unsplash.com/photos/razor-wire-sits-atop-a-tall-protective-fence-wW5vKD8MJGA) | Ben Marler | not stated | Razor wire on top of a tall fence | **Recommend** (check the preview for visible text or a recognisable place) |
| C6 | Fence (4) | [Pexels 6828576](https://www.pexels.com/photo/barbed-wire-above-the-mesh-wire-fence-6828576/) | Craig Adderley | 5472 x 3648, landscape | Rusty barbed wire fence with a city skyline behind it (Hoboken, New Jersey) | **Not recommended:** a recognisable US skyline on a Nigerian company's site |
| C7 | Access control (5) | [Pexels 37538043](https://www.pexels.com/photo/modern-fingerprint-access-control-system-37538043/) | panumas nikhomkhai | 6000 x 4000, landscape | A fingerprint scanner used for access control in an office | **Recommend** |

Gaps: no candidate for prompt 1 (a dome camera under the eave of a house) or prompt 6 (a solar-powered camera on a pole at a school gate). Route B is the better route for those two. No stock photograph will look Nigerian; every one is labelled illustrative.

**Downloaded and inspected (approved by Sabi Programmers, 2026-11-10).** C1, C5 and C7 are in `scratchpad/stock-candidates/` (outside the repository, never committed), each at 1600 x 1067 px. None carries GPS data; C1 and C7 carry a few bytes of camera metadata, which is stripped on any crop (as with the client photographs). Findings from actually viewing them:

| # | Size | What is really visible | Verdict now |
|---|---|---|---|
| C1 | 237 KB | A white dome camera on a roughened grey wall, moody blue-black light. **A brand name ("Dahua") is printed on the camera body**, centre of frame | **Changed to "avoid":** a prominent manufacturer's name on a stock image suggests a supplier relationship we have not been given; it cannot be cropped out without losing the camera. Use C2 or C3 instead, after viewing them, or accept the brand knowingly |
| C5 | 308 KB | Coils of razor wire on angled posts above a black welded-mesh fence panel, clear blue sky. No people, text, brand or recognisable place | **Use.** Caption as perimeter fencing in general, not a BOOM product. (Razor wire suits "perimeter protection" but is a strong look; the client may prefer a plain fence) |
| C7 | 132 KB | A wall-mounted keypad-and-fingerprint terminal beside a glass door, green light, blurred office behind. The screen shows a clock and a line of small script. **Mirrored lettering ("CROSS CONNECT ROOM") shows on the glass at top right** | **Use with a crop** of the top 150 px (removes the lettering, leaves about 1600 x 917, close to 16:9). The device's own brand is not readable. It is a combined time-and-access terminal, so caption it as access control in general |

The first attempt to download C5 through Unsplash's own download link returned a bot-check page (HTTP 401), saved as a fake `.jpg`; it was deleted and not worked around. The photo was fetched instead from the public image address the photo page itself links.

**Done (second approval given 2026-11-10):** C5 and C7 are cropped, labelled "Illustrative image", given honest alt text and wired into `public/assets/images/security/illustrative/`, the Security page and the Products catalogue.

**Original approval request (for the record):** download C1, C5 and C7 (and C2 and C3 if you want two more camera shots), at the mid-size version each page offers (roughly 1,200 to 1,900 px wide, enough for the site), into a scratch folder outside the repository. I would then view them, report the real file sizes and anything visible that the page did not mention (text, faces, brands, places), and only after your second yes crop, label and add them to `public/assets/images/security/illustrative/`.

## Route D: ask the client (recommended in parallel)

Real photographs are the best answer to the client's request, and they are the only thing the Projects page can use. Suggested message:

> Hello. To show BOOM Security properly on the website we need photographs of your own CCTV and security work. Please send, if you have them:
> 1. Cameras installed on buildings (homes, shops, offices, schools): wide shots and close-ups.
> 2. The recorder or control panel and a monitor showing camera views.
> 3. Fencing, gates and access control (keypads, card readers) you have installed.
> 4. Any photographs of BOOM staff installing equipment, where they agree to be shown.
>
> Please send the original photographs (not forwarded on WhatsApp, which shrinks them), ideally 8 to 12 of them. Turn off any location or date stamp on the camera app. Please confirm that the property owners are happy for the photographs to be published, and tell us whether the solar-powered camera we were sent is a model you supply.
>
> We also have no photographs of the food products (garri, Garri Ekiti, fufu powder, Ofada and Igbemo rice, smoked fish, frozen chicken) or of the pounding machines in use. Photographs of those would help too.

## Open points for the client

- Do you supply the solar-powered camera model shown? (It is currently labelled "Product image", not an installation.)
- Does BOOM supply solar street lights? (A warehouse photograph was supplied and appears in the Products catalogue under BOOM Energy with no description.)
