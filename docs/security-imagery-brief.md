# Security (CCTV) imagery: sourcing brief

Status: prepared 2026-11-10 at the client's request ("make sure CCTV/security images are well represented on the website").
Owner: Sabi Programmers. Nothing in this file has been downloaded, generated or published except where marked **Done**.

## Where we are

| Route | What | Status |
|---|---|---|
| A. Custom SVG drawings | Dome camera, bullet camera, recorder and monitor (Security page and Products catalogue); fence, access and monitoring diagrams already existed | **Done.** Each is labelled "illustrative" and says it is not a BOOM product |
| Client photograph | One solar-powered multi-lens CCTV camera, white background, supplied by the client | **Done.** Shown as a "Product image" (Security page, Products catalogue). It is a product shot, not an installation |
| B. AI-generated images | Photorealistic scenes for the Security page and the catalogue | **Waiting on Sabi Programmers** to generate from the prompts below |
| C. Licensed stock photographs | Free-licence photographs, labelled illustrative | **Waiting on approval.** Claude does not download anything without it (see "Route C") |
| D. The client's own installation photographs | The only authentic option | **To request** (message below) |

## Rules that apply to every route

- Anything that is not a photograph of real BOOM work carries the **"Illustrative image"** label (`IllustrativeLabel`) and an honest alt text that says it is AI-generated or stock and not a BOOM installation. See `docs/asset-inventory.md` §4a and `content/division-images.ts` for the existing pattern.
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

Suggested alt text pattern: "Illustration of a dome CCTV camera under the eave of a two-storey house, with a perimeter wall and gate behind it. AI-generated, not a photograph of a BOOM installation."

## Route C: licensed stock photographs

Claude cannot browse for or download photographs without your explicit approval for each file. When you approve this route, Claude will bring a shortlist with, for each candidate: the file name, the source page, the photographer and licence, the pixel size and the file size. Nothing is downloaded until you say yes to that list. Acceptable sources are those whose licence allows commercial use on a company website (for example Unsplash and Pexels, whose licences permit this without attribution); keep a copy of each licence page in `docs/`. Stock photographs follow the same rules as Route B: labelled illustrative, never presented as BOOM work.

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
