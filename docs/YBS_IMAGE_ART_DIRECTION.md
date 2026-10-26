# YBS Image Art Direction

Status: art direction and generation brief only. No images were generated, and no application files, styles, or assets were changed to produce it.
Date: 2026-10-26
Companion document: `docs/YBS_IMMERSIVE_MOTION_BLUEPRINT.md`. Every image below exists because a specific motion moment needs it.
Supersedes: `docs/YBS_IMAGE_GENERATION_BRIEFS.md` (left in place, untouched). Section 3 explains why it is replaced.

## Contents

1. How to use this document
2. Inventory of existing photographic assets and gaps
3. Critique of the previous briefs
4. Art direction bible (look, camera, light, people, authenticity)
5. Delivery specification and crop/safe-area conventions
6. Section-to-image map for all nine routes
7. Prompts, IMG-01 to IMG-20 (each standalone)
8. Real photography that should not be generated
9. Priority ranking and build order
10. Review checklist for generated images

---

## 1. How to use this document

- Each prompt in section 7 is standalone. Copy one block into a text-to-image model without needing any other part of this file. The shared look is repeated inside every prompt on purpose.
- Prompts are written for photorealistic models. Adapt syntax (weights, flags) to your tool, but keep the content, including the negatives.
- Generate at the highest native resolution the tool offers, then upscale with a photographic upscaler. Do not let the upscaler invent new detail beyond about 1.5x.
- "Motion role" tells you what the image must survive: a clipped unveil, a slow drift, a crossfade, or a headline laid over it. That drives the crop and safe-area notes.
- Mobile frames are separate generations, not crops, wherever the table says "own frame". A crop of a 21:9 band to 4:5 loses the subject.
- Where a person appears, the brief controls how (see section 4.4). Do not generate the likeness of a real person, including the founder.

---

## 2. Inventory of existing photographic assets and gaps

Evidence tags: [Code] read from the repo or file system on 2026-10-26; [Inferred] reasoned, not observed.

### 2.1 What exists in `public/`

| File | Pixels | Size | Role | Status |
|---|---|---|---|---|
| `hero-home.jpg` | 1376x768 | 885 KB | Home hero poster | Protected |
| `hero_about.jpg` | 1376x768 | 708 KB | About hero poster | Protected |
| `hero-about-poster.jpg` | 1376x768 | 708 KB | About "video" poster | Byte-identical to `hero_about.jpg` (F11 in the motion blueprint) |
| `hero_services.jpg` | 1376x768 | 734 KB | Services hero poster | Protected |
| `hero_difference.jpg` | 1376x768 | 736 KB | Difference hero poster | Protected |
| `hero_how_it_works.jpg` | 1376x768 | 708 KB | How It Works hero poster | Protected |
| `hero_leadership.jpg` | 1376x768 | 783 KB | Leadership hero poster | Protected |
| `hero_faq.jpg` | 1376x768 | 671 KB | FAQ hero poster | Protected |
| `hero_insights.jpg` | 1376x768 | 649 KB | Insights hero poster | Protected |
| `hero_contact.jpg` | 1376x768 | 673 KB | Contact hero poster | Protected |
| `kent.png` | 1254x1254 | 2,036 KB | Founder portrait (a real person) | Not protected, but needs owner approval to change |
| `Logo.png` | 1254x1254 | 659 KB | Brand logo | Protected by association with the loader and header; do not alter |
| `yacht-marker.png` | 1254x1254 | 432 KB | Loader yacht marker | Protected |
| `og-image.jpg` | 1264x848 | 498 KB | Social share image | Open for replacement |
| `videos/*.mp4`, `logo/ybs-logo-intro.mp4` | n/a | 3.5-30 MB each | Hero loops and loader intro | Protected |

[Code, file system listing and image headers]

Observations from the numbers:

1. Every hero poster is 1376x768. That is below the 1440 px desktop width and well below what a 2x display wants. The heroes are locked, so this is a note, not a task. It does tell us the new images must not be matched to the heroes' pixel density; they should be sharper.
2. `og-image.jpg` is 1264x848 (3:2). Social platforms commonly crop share images to about 1.91:1, so the 3:2 file will likely be cropped. Not verified on each platform.
3. The About page shows one photograph twice (hero poster and the "video" poster), as recorded in the motion blueprint.
4. Outside the heroes and the founder portrait there is no photography in `public/` [Code]. The only other files are default Next.js scaffold SVGs and `favicon.svg`.

### 2.2 What was not assessed

The file listing came from the file system. I opened `og-image.jpg`, `kent.png`, `hero-home.jpg`, `hero_about.jpg`, `hero_services.jpg`, and `hero_contact.jpg` with the image reader during this session, but the output carried no visible image content I could describe, so **I have no first-hand view of the existing grade, subject matter, or quality of any current still.** Because of that, this document does not claim to match the heroes' look. Step 1 of section 9 is a human review of the heroes and the founder portrait, from which the grade reference in 4.2 is sampled.

### 2.3 Gap analysis

The motion blueprint needs photography in these places and has none today:

| Need | Where | Count |
|---|---|---|
| Closing-section background shared by six pages | Home, Services, How It Works, Leadership, FAQ, Insights (IMG-18) | 1 image, 6 uses |
| Unique closing payoffs | Home (IMG-03), About and Contact (IMG-06), Difference (IMG-11) | 3 images |
| Tier section background | Home and Difference, shared (IMG-02) | 1 image, 2 uses |
| Four service chapters | Services (IMG-07 to IMG-10) | 4 images |
| Three process steps | How It Works (IMG-12 to IMG-14) | 3 images |
| Ambient depth | Home narrative (IMG-01), About vision (IMG-04), About panel (IMG-05) | 3 images |
| Leadership atmosphere | Leadership (IMG-15) | 1 image |
| Insights cards | Insights (IMG-16, IMG-17, IMG-20) | 3 images |
| Texture | About mobile fallback (IMG-19) | 1 image |
| **Total new images** | | **20** (one of which, IMG-06, serves two routes) |

Beyond generated stills, three gaps cannot be closed with generation and need real photography (section 8): a better founder portrait set, the spokesman and broker scenes from the video scripts, and any picture of the real YBS team or office.

---

## 3. Critique of the previous briefs

Source: `docs/YBS_IMAGE_GENERATION_BRIEFS.md` (235 lines, 16 entries). It is a reasonable first pass with good instincts (restraint, warm light, no embedded text). It falls short of what the motion plan needs for these reasons.

| # | Problem | Evidence | Effect | What this document does instead |
|---|---|---|---|---|
| 1 | **Briefs are not prompts.** Each entry is a description plus metadata (Purpose, Placement, Lighting...). A model needs a single, ordered prompt with a negative list. | Entries 1-16 | The person generating has to translate, and results will vary between runs | Section 7: one copyable block per image, with a shared look repeated inside it |
| 2 | **Several briefs depict people doing staged things.** Handshake (7), "professional yacht broker standing on a dock" (3), "founder in tailored business attire" (11), consultation (9). | Entries 3, 7, 9, 11 | Generated people in handshake and meeting scenes are the most common failure point: hands, faces, and a stock-photo feel. Entry 11 asks for a generated founder, which would put an invented likeness next to a real person's name | People policy in 4.4: no faces, no hands in contact, no generated founder; real photography where a person is essential (section 8) |
| 3 | **The Difference diptych (8)** asks for a "crowded traditional brokerage office with fluorescent light and corporate signage" against a warm independent office. | Entry 8 | It caricatures competitors and breaks the brand rule that the comparison lives only as typography on the Difference page; invites a legal read | Dropped. The Difference page is typographic. See the note in the motion blueprint, section 6.4 |
| 4 | **No motion role.** Nothing says whether an image is clipped, drifts, crossfades, or sits under text. | Whole file | Wrong crops and unsafe areas: a headline over a busy centre, a subject cut by a curtain edge, a parallax that reveals an edge | Every entry in section 6 has a "motion role"; every prompt has a safe-area note |
| 5 | **No mobile frames.** One crop per placement. | Dimensions in each entry | A 1600x600 band cannot become a 4:5 phone image without losing the subject | Section 5: separate frames where the subject changes |
| 6 | **No consistent grade.** "Warm natural color" is stated, but the colour system is not tied to the site palette. | Header paragraph; entries' Color Treatment lines | Twenty images with twenty slightly different warmths look like a stock gallery | Section 4.2: one palette, one light direction, one lens family |
| 7 | **Placements are loose and partly stale.** Entries 1 and 2 are marked "(optional)", which signals low importance and leaves them unconnected to any sequence. Entry 14 targets a "Let's Start the Conversation" section; no heading with that text exists in `src` (the nearest is "Your Future Starts with a Conversation" on the home page). The other section names I checked (home "Everything You Need to Succeed", About "Your Independence Starts Here") do exist. | Entries 1, 2, 14; [Code, grep of `src`] | The images were never wired into a block-by-block sequence | Section 6 maps each image to a block in the motion blueprint |
| 8 | **UI screens in the brief.** Entry 6 asks for a laptop showing a CRM dashboard; entry 5 asks for a tablet with a yacht listing and brochures. | Entries 5, 6 | Models render unreadable fake UI and garbled brochure text, which reads as fake at once | Rule in 4.3: screens are off, dark, or out of focus; no legible text anywhere |
| 9 | **Weights and formats are generic.** "JPEG 85-92%", "2x where practical". | Technical Notes | No pixel targets, no AVIF/WebP, no file naming convention, no byte budget | Section 5 |
| 10 | **Priority ranking favours office and desk shots.** Workspace, broker portrait, marketing, consultation, and office rank highest. | Generation Priority | The strongest brand idea in the scripts is the water, the light, and the sense of arrival. Desks are the most generic content and the weakest differentiator | Section 9 puts IMG-18, IMG-03, and IMG-07 to IMG-10 first |
| 11 | **Authenticity is not addressed.** Nothing says that all images are AI-generated or must not look real-person specific, and nothing about yacht realism beyond a line. | Technical Notes | Risk of invented boats resembling real hulls, implied endorsement, or misleading "our team" imagery | 4.5 authenticity rules and disclosure guidance |
| 12 | **Entry 16 (gold hairline PNG)** is not a photograph and is better done in CSS (the brief says so itself). | Entry 16 | Wasted slot | Dropped; the gold rule is the `DrawRule` primitive |

What is kept from the old file: the warm, restrained tone; "images support the copy, never compete"; no embedded text; the ivory/champagne/navy palette; the linen texture (now IMG-19); the horizon-and-yacht-silhouette idea (reworked into IMG-16/17/20 as non-literal editorial images).

The old file is left in place and unedited. This document replaces it for planning; delete or archive the old one once this is approved.

---

## 4. Art direction bible

One rule above all: **these pictures are about arrival, not about boats.** The audience is a broker who already sells superyachts. A glossy hull is not news to them. What they have not seen is a calm, private, well-run place that is theirs. The scripts say it plainly: "wealth and success", "lighting, texture, and high-end environments (beautiful wood finishes, large glass windows, rich furnishings & art, deep ocean blues)", delivered with "the calm, measured confidence of a luxury watch commercial" [Script].

### 4.1 The look in one paragraph

Quiet morning or late-afternoon light, falling from one side and low. Cool deep-sea blues against warm teak, brass, and ivory. Wide margins of calm in the frame (water, sky, wall, linen) so type and motion have somewhere to sit. Shallow but not extreme depth of field. Real materials with believable wear: oiled teak, brushed brass, linen, stone, glass. Nothing glossy, nothing HDR, nothing with a sparkle. If a picture looks like it is trying to impress, discard it.

### 4.2 Palette and grade

Tied to the site's tokens [Code, `globals.css`] so the pictures sit on the page without a colour fight.

| Role | Site token | Hex | In the photograph |
|---|---|---|---|
| Ivory / highlights | `--ivory`, `--pearl` | #faf5ea, #fffdf9 | Linen, plaster, sails in shade, sky near the horizon. Highlights land here, never pure white |
| Champagne | `--champagne` | #f7ebcf | Late sun on wood, wall wash, water glints |
| Gold / brass | `--gold-500`, `--gold-600` | #c8a45a, #a9822f | Brass hardware, rope whipping, a candle flame, a lamp. Small, never dominant |
| Deep navy | `--navy-deep` | #0b2239 | Shadow side of water, hull shadow, evening sky. This is the cool anchor |
| Warm charcoal | `--charcoal-deep`, `--charcoal-mid` | #17140f, #231e17 | Deepest shadows. Blacks are lifted slightly toward this warm tone, not neutral black |

Grade rules:

1. **Split tone.** Shadows toward navy-teal, highlights toward champagne. Midtones stay natural. Skin and wood must still look like skin and wood.
2. **Colour temperature.** Morning scenes 4300-5000 K; dusk 3200-3800 K. Never mix a blue key with an orange fill in the same frame unless the scene is dusk with a real lamp.
3. **Contrast.** Gentle S-curve. Lifted blacks (about 4-6%), rolled highlights. No crushed shadows, no clipped skies.
4. **Saturation.** Reduce the blues by about 10% from "holiday brochure" levels, keep golds natural. The reference is a luxury hotel's printed book, not a charter website.
5. **Grain.** Fine, even film grain at about 2-3% in generation or added in post, to hide the plastic look of generated surfaces. Add the same grain to every image so they sit together.
6. **Reference check.** The existing hero posters carry the site's current feel. Section 9 step 1 has a human compare each finished image against the hero stills side by side and adjust the grade to sit between them; this document did not assess those stills first-hand (2.2).

### 4.3 Camera and lens

| Parameter | Rule |
|---|---|
| Look | Medium-format or full-frame mirrorless, prime lenses |
| Focal length | 35 mm for rooms and scenes; 50-85 mm for details and objects; 24 mm only for architecture; avoid ultra-wide |
| Aperture | f/2.8-f/5.6 for details; f/8 for architecture and water |
| Height | Eye level or slightly below. No drone or high-angle novelty shots unless stated |
| Verticals | Straight. Correct converging lines |
| Movement | Locked-off frame. The motion comes from the website, not the picture |
| Aspect | Composed for the target crop (section 5); safe area for text is part of the composition |
| Screens | Dark, off, or out of focus. No legible screen content, ever |
| Text | No legible text anywhere: no signs, brochures, labels, or hull names. Prompt for blank or unreadable surfaces; check after generation |

### 4.4 People policy

Generated people are the biggest risk to this brand. A broker will spot a fake hand or a stock smile in a second, and a fake face beside the real founder portrait would erode trust.

1. **No generated person who could be taken for a specific real individual**, and **never the founder** in any form.
2. **Default to no face.** Where a human presence helps, use: a back view at distance, a silhouette against light, hands doing a simple task with no faces (adjusting a cufflink, setting down a glass), or an empty chair with a jacket on it.
3. **No handshakes, toasts, or hands in contact.** Generated hands and glasses touching are the most common failure. The toast scene in the final script [Script, 1:05-1:15] is a real-photography scene (section 8), not a generation.
4. **At most one person per frame, small in frame (under 12% of height).** Larger figures invite scrutiny.
5. **No cultural or gender-coded shorthand** (no "executive in a suit" clichés). Dress is smart casual: a linen shirt, a navy jacket over an open collar, bare feet on a balcony as in the script.
6. **Any image with a person is tagged `contains-person`** in its file name and must be reviewed by a human before use. See 10.
7. **Disclosure.** If any generated image with a person is used, the site should not describe that person as a member, client, or employee. Captions and alt text describe the scene ("A broker's balcony at dusk"), not an identity.

### 4.5 Authenticity and honesty

1. **No invented vessels that look like real named yachts.** Use clean, generic modern hull forms; do not prompt for a specific builder, class, or named boat. After generation, check the yacht is physically plausible (rails, windows, tender garage, proportions) and not a near-copy of a famous hull.
2. **No fake awards, logos, flags of real clubs, or boat show branding.**
3. **No "our office", "our team", or "our clients"** implied by a generated picture. Spaces are described as environments (a broker's office, a marina at dusk), never as YBS premises, unless a real photograph of the real place replaces them.
4. **Marina and city realism.** Fort Lauderdale is the stated address [Script]. Imagery should feel South Florida or Mediterranean in a general way (low skyline, palms, calm water, concrete docks) without real landmarks that could be checked and found wrong.
5. **Generated imagery is a stand-in.** Plan to replace the most-seen images with commissioned photography over time (section 8). Keep original generation prompts and seeds alongside each file so they can be reproduced or retired.
6. **Check platform terms** for the generation tool you use: commercial-use rights, output ownership, and any content-credential or metadata requirements. This document did not verify any tool's terms.

### 4.6 Composition rules for motion

Every image has to survive one of four things. The motion role in section 6 says which.

| Role | Composition rule | Safe area |
|---|---|---|
| **Curtain** (clip-path unveil from one edge) | Strong subject placed away from the unveil edge; no critical detail within 8% of any edge | Subject in the central 70% |
| **Parallax / drift** | The image is oversized by 12% (6% per side) in the delivery crop; no horizon tilt; no important edge details | Subject in the central 60%, horizon level |
| **Background under text** | A clear, low-detail zone at least 40% of the frame where the headline or cards sit; no bright highlights in that zone | Text zone: keep luminance within a narrow band; verify with a 90% ivory or charcoal overlay |
| **Crossfade / settle** | Subject centred or on a clear third; the 1.04 to 1.0 scale settle must not push a face or object past the edge | Central 80% |

Never put the horizon in the exact centre. Use the lower third for water-led scenes, the upper third for sky-led ones.

### 4.7 Global negative prompt

Repeated inside every prompt in section 7 so each one is standalone. Keep it in sync if you edit it.

> text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands

---

## 5. Delivery specification and crop/safe-area conventions

### 5.1 Master files and web files

| Item | Spec |
|---|---|
| Master | Highest native resolution from the tool, then upscaled at most 1.5x with a photographic upscaler. Keep as 16-bit PNG or max-quality JPEG in a separate `source/` store, not in `public/` |
| Colour space | sRGB for web files. Embed the profile |
| Web formats | AVIF and WebP generated by `next/image`; keep one JPEG fallback at quality 82-86. Read the Next.js image docs in `node_modules/next/dist/docs/` before wiring (per `AGENTS.md`); this version may differ from what you remember |
| Grain | Added to the master once (4.2), not per export, so it is the same at all sizes |
| Metadata | Strip EXIF/GPS. Keep the generation prompt, seed, tool, and date in a sidecar file next to the master (4.5.5) |
| Naming | `ybs-{route}-{slot}-{subject}[-m][-person].jpg` in kebab case, for example `ybs-services-ch1-marketing-desk.jpg`, `ybs-home-cta-departure-m.jpg`. `-m` marks a mobile frame. `-person` marks an image containing a person |
| Location | `public/images/` (new folder, proposed). Heroes and logo files are not touched |
| Alt text | Written per image in the delivery table in section 6. Informational images get a specific description; ambient images get `alt=""` |

### 5.2 Size classes

Pixel sizes are for the largest display need at 2x where the image is full width, and 1.5x for contained images. Larger is allowed; smaller is not.

| Class | Use | Desktop frame | Mobile frame | Target web weight |
|---|---|---|---|---|
| **W** (wide band) | Section backgrounds, CTAs | 3200x1400 (21:9-ish, delivered 2.29:1) | 1200x1500 (4:5), own frame | 220 KB AVIF desktop, 110 KB mobile |
| **L** (landscape card) | Service chapters, process steps | 2400x1600 (3:2) | 1200x1500 (4:5), own frame | 180 KB AVIF |
| **P** (portrait) | Side images | 1600x2000 (4:5) | same | 160 KB AVIF |
| **S** (square) | Insight index cards | 1600x1600 (1:1) | same | 130 KB AVIF |
| **T** (texture) | Tileable surfaces | 2000x2000 | same | 90 KB |

Weights are budgets I am proposing, not measurements; adjust after the performance baseline (motion blueprint, phase 0). The total new photography on any one route should stay under 600 KB AVIF on desktop and 350 KB on phones.

### 5.3 Parallax and curtain headroom

1. **Parallax images are delivered 12% larger** than their display frame (6% extra on each moving edge) so no edge shows at the extremes. The delivery size in 5.2 already includes this for classes W and L where the table says "drift".
2. Parallax is disabled below 768 px, so mobile frames are delivered at exact size with no headroom.
3. **Curtain images** need nothing extra, but must keep the 8% edge-clearance rule (4.6).

### 5.4 Safe areas, in percentages of the delivered frame

Use these when composing and when checking a result with a transparent overlay.

| Layout | Text zone | Subject zone | Notes |
|---|---|---|---|
| Section background under cards or text | 100% of frame is potentially covered, so keep luminance flat (no hot highlights) | Interest placed in the outer 30% on one side | Covered by ivory or charcoal at 90-94% in most placements, so mood and tone matter more than detail |
| CTA with right-side image (IMG-03, IMG-11) | Left 55% is text | Right 45%, subject centred within it | Image is a full-height panel that unveils from the right |
| Service chapter, text left / image right (or the reverse) | n/a (side by side) | Central 70% | Alternates by chapter, so avoid left-right asymmetry in the composition |
| Process step image | n/a | Central 80% | Shown at 4:5 on phones |
| Portrait backdrop (IMG-15) | n/a | None: purely atmospheric | Rendered at 100% blur, so only colour and light shape matter |

### 5.5 Colour-managed review

Review on a calibrated or at least factory-calibrated display at 100% zoom and again at 25%. Check on a phone in daylight; warm greens and golds often shift on OLED. Print a contact sheet of all 20 and view them together: any image whose grade differs visibly from the rest fails (10).

---

## 6. Section-to-image map for all nine routes

All 20 images, the block each serves in `docs/YBS_IMMERSIVE_MOTION_BLUEPRINT.md`, how it moves, and what must survive. Heroes are not listed; they are locked. Fallback means what ships if the image is not ready, so the build is never blocked.

| ID | Subject (short) | Route and block | Size class | Motion role | Frames | Alt text | Fallback if missing |
|---|---|---|---|---|---|---|---|
| IMG-01 | Blank brass nameplate beside a teak door | Home, H3 narrative | W | Parallax, behind left panel, very low opacity | desktop only | `""` (ambient) | Plain ivory surface and the vertical gold rule |
| IMG-02 | Marina at blue hour, calm water, soft lights | Home H6 and Difference D6 (tiers background) | W | Slow parallax under a 90-94% ivory overlay | desktop and mobile | `""` | Ivory-to-champagne gradient |
| IMG-03 | A superyacht departing into open water, seen from shore | Home H11 (final CTA only) | L (right panel), W (mobile bg) | Curtain from the right; mobile at 25% strength | own mobile frame | "A yacht leaving a marina at dusk" | IMG-18 alone |
| IMG-04 | Sunrise over a superyacht bow, wide, mostly sky and water | About A4 vision band | W | Parallax under a champagne wash | desktop; mobile uses IMG-19 | `""` | Champagne band |
| IMG-05 | Teak deck and brass hardware in raking light | About A2 panel (if the owner chooses a still, O5) | L | Curtain plus parallax | own mobile frame | "Teak decking and brass hardware in low sunlight" | Existing poster, once the duplicate is resolved |
| IMG-06 | A waterfront balcony at dusk, overlooking a marina | About A7 CTA; Contact C2 sidebar (optional) | L | Curtain | own mobile frame | "A balcony overlooking a marina at dusk" | IMG-18 |
| IMG-07 | Brand & Marketing: a designer's desk, brand materials in soft focus, no readable text | Services S3 chapter 01 | L | Curtain from the side opposite the text, parallax | own mobile frame | "Brand and marketing materials on a desk" | Typographic numeral only |
| IMG-08 | Business Operations: an orderly desk, ledger and documents closed, a lamp | Services S3 chapter 02 | L | same | own mobile frame | "A tidy desk with closed folders and a lamp" | same |
| IMG-09 | CRM & MLS: an off or dark laptop and a notebook by a window onto a marina | Services S3 chapter 03 | L | same | own mobile frame | "A laptop and notebook by a window overlooking a marina" | same |
| IMG-10 | Transaction & Closing: a closed leather folder and a pen on a table, aboard or in a lounge | Services S3 chapter 04 | L | same | own mobile frame | "A leather folder and pen on a table" | same |
| IMG-11 | A private office with a view of a marina through floor-to-ceiling glass, no people | Difference D7 CTA | P | Curtain from the right | desktop and mobile | "A private office overlooking a marina" | IMG-18 |
| IMG-12 | Step 1, a confidential call: a quiet corner, two chairs, a closed laptop, a glass of water | How It Works W3 step 1 | L | Curtain | own mobile frame | "A quiet meeting corner" | Numeral and ring only |
| IMG-13 | Step 2, choose a tier: two sets of brass keys or two cards on a tray, no text | How It Works W3 step 2 | L | Curtain | own mobile frame | "Two sets of brass keys on a tray" | same |
| IMG-14 | Step 3, launch: an open door onto a dock at morning | How It Works W3 step 3 | L | Curtain | own mobile frame | "An open door leading to a dock" | same |
| IMG-15 | Blurred marina bokeh, warm lights on water | Leadership L2, behind the founder portrait | W | Static atmosphere, rendered at 100% blur | desktop and mobile | `""` | Flat ivory |
| IMG-16 | Abstract: horizon and water at first light, no vessel | Insights I2 featured card | L | Curtain plus parallax | desktop and mobile | `""` or the article title | Gold-tinted gradient with the tag |
| IMG-17 | Abstract: ripples and soft reflections, cool tones | Insights I2 index card (top) | S | Rise, hover scale | same | `""` | Gradient |
| IMG-18 | Dusk water texture, deep navy to charcoal, a thread of gold light | CTA background: Home, Services, How It Works, Leadership, FAQ, Insights | W | Slow horizontal drift (24 px total max) | own mobile frame | `""` | Existing charcoal gradient |
| IMG-19 | Ivory linen texture, tileable | About A4 mobile fallback; general soft surfaces | T | Static | one | `""` | Flat ivory |
| IMG-20 | Abstract: a rope coil and brass cleat in soft focus, warm light | Insights I2 index card (bottom) | S | Rise, hover scale | same | `""` | Gradient |

Reuse rules (from the motion blueprint): IMG-03 appears on the home page only. IMG-18 is the shared CTA background everywhere except About, Difference, and Contact. IMG-06 is shared by About and Contact. IMG-02 is shared by Home and Difference. No other image repeats.

Two things to note on this map:

1. **Services chapters.** The old briefs wanted a desk and a handshake for these. That was weak. The replacements are *objects with a point of view* (a closed leather folder, a pen, a lamp, a quiet window) and no screens, no people, no readable text. They suit the "calm, measured confidence" tone and avoid the generated-hands problem.
2. **Insights cards** are deliberately abstract so any headline can sit on them. When real articles exist, replace them with real photography or commissioned illustration, not more generated stills.

---

## 7. Prompts, IMG-01 to IMG-20

Each block below is complete on its own. The look, palette, and negative list are repeated in every prompt on purpose. Replace nothing except the aspect ratio syntax your tool needs. Where the table in section 6 says "own mobile frame", run the prompt a second time with the mobile framing line given in the block.

Format of each entry:

- **Use**: where it goes (details in section 6).
- **Frame**: desktop size class and aspect; mobile framing if it is a separate generation.
- **Prompt**: copy this.
- **Negative**: copy this (identical in every entry).
- **Check**: what to inspect before accepting.

---

### IMG-01. Brass nameplate and teak door

- **Use**: Home, narrative section background (very low opacity, parallax).
- **Frame**: W, 3200x1400 (2.29:1). Desktop only.

**Prompt**
```
Photorealistic editorial photograph, shot on a medium-format mirrorless camera with a 50mm prime at f/5.6. A tall oiled teak door with a small blank brushed-brass nameplate at eye level, set in a pale plaster wall, in soft low raking morning light from the left. The nameplate is completely blank, no engraving. Quiet, private, understated luxury. Composition: door and plate sit in the right third; the left two thirds are calm plaster wall with gentle falloff, leaving open space. Split-tone grade: navy-teal in the shadows, champagne in the highlights. Palette: warm ivory #faf5ea, brass gold #c8a45a, deep navy #0b2239 accents, lifted warm charcoal blacks. Fine, even film grain. Straight verticals, no distortion. Calm, restrained, timeless.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, engraved text on the plate
```

**Check**: the plate is truly blank (zoom to 200%); no fake lettering in the grain of the wood; wall is flat enough that a headline can sit over the left side.

---

### IMG-02. Marina at blue hour

- **Use**: Home membership tiers and Difference tiers, section background under a 90-94% ivory overlay, slow parallax.
- **Frame**: W, 3200x1400. Mobile: 1200x1500 (4:5) with the lights lower in frame.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 35mm prime at f/8, tripod, 6-second exposure for silky water. A calm private marina at blue hour just after sunset. Several large modern motor yachts moored in a row, simple clean hull forms, no visible names, their cabin lights glowing a soft warm gold. Still, glassy water with long gentle reflections. Low skyline of palms and low buildings far away. Deep navy sky fading to a thin champagne band at the horizon. Horizon sits on the lower third. Open, calm sky area in the upper half for overlay. Split-tone grade: navy-teal shadows, champagne highlights. Palette: deep navy #0b2239, brass gold #c8a45a for the lights only, warm ivory in the horizon glow, lifted warm charcoal blacks. Fine film grain. Quiet, expensive, unhurried.
Mobile variant: vertical 4:5, horizon on the lower fifth, yachts placed in the lower third, more sky above.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people on deck, fireworks
```

**Check**: the hulls are plausible (rails, windows, tender garages, straight waterline); reflections match the boats; no names on sterns; lights are warm points, not blooms.

---

### IMG-03. A yacht departing

- **Use**: Home final CTA only. The payoff image for "Be the Architect of Your Future".
- **Frame**: L, 2400x1600 (3:2) for the right-hand panel; mobile: 1200x1500 (4:5) as a background at 25% strength.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 85mm lens at f/8 from the shore, slightly compressed perspective. A single large modern motor yacht seen in three-quarter view from the stern, cruising slowly away from a marina entrance into open water at dusk, small clean wake behind it. Hull is simple and elegant, dark navy with a pale superstructure, no visible name, no flags. Breakwater and a few low lights on the left edge. Wide open sea and sky fill the right two thirds. Sun just below the horizon, sky a gradient from deep navy at the top to a thin champagne band at the water line. Horizon on the lower third, perfectly level. The yacht sits left of centre, small in the frame (about 20% of image width), leaving calm space around it. Split-tone grade: navy-teal shadows, champagne highlights, a thread of brass gold in the wake. Lifted warm blacks, fine film grain. Quiet, resolved, cinematic stillness.
Mobile variant: vertical 4:5, the yacht in the lower third, the sky taking the upper half.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, sailboat, people on deck, helicopter, drone, birds
```

**Check**: single vessel, level horizon, plausible hull and wake, no name or flag, and the subject survives a curtain from the right (nothing important within 8% of any edge).

---

### IMG-04. Sunrise over a superyacht bow

- **Use**: About, vision band, behind the heading under a champagne wash. Parallax.
- **Frame**: W, 3200x1400. Mobile uses IMG-19 instead (no mobile frame).

**Prompt**
```
Photorealistic editorial photograph, shot on a medium-format mirrorless camera with a 50mm prime at f/8, low eye-level on the foredeck. The bow of a large modern motor yacht at sunrise: clean white deck, teak rail cap, polished stainless anchor fitting, gently catching the first light, a still calm sea beyond. The bow points to the left edge; most of the frame is open pale water and sky. Sun low on the right horizon, soft champagne glow, a few thin high clouds. Horizon sits on the lower third, perfectly level. A broad low-detail sky area across the top half for text. Split-tone grade: navy-teal in the water shadows, champagne in the sky highlights. Palette: warm ivory #faf5ea, champagne #f7ebcf, brass gold #c8a45a, deep navy #0b2239. Fine film grain, lifted warm blacks. Calm, hopeful, restrained.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people on deck, sun disc with starburst
```

**Check**: no starburst or bloom around the sun; the rail and anchor fitting are mechanically believable; the top half is quiet enough for a headline.

---

### IMG-05. Teak and brass in raking light

- **Use**: About, cinematic panel, only if the owner chooses a still (decision O5 in the motion blueprint). Curtain plus parallax.
- **Frame**: L, 2400x1600 (3:2). Mobile: 1200x1500 (4:5), own frame.

**Prompt**
```
Photorealistic editorial photograph, shot on a medium-format mirrorless camera with a 85mm macro-capable lens at f/4. A close, low-angle view along oiled teak yacht decking with fine black caulking lines, and a brushed-brass cleat and a curl of pale rope in the middle distance, in warm raking sunlight from the left at golden hour. Shallow depth of field: the cleat is sharp, the deck beyond falls softly out of focus into a deep navy-shadow sea edge. The pattern of the planks leads the eye diagonally. Warm wood, brass, a little ivory rope, deep navy shadow. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. Tactile, quiet, crafted.
Mobile variant: vertical 4:5, the cleat on the lower third, planks running up the frame.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, varnished plastic look, fake wood texture, repeating pattern
```

**Check**: the wood grain and caulking are not tiled or repeating; the cleat has a believable shape; the rope has consistent twist.

---

### IMG-06. Waterfront balcony at dusk

- **Use**: About CTA and (optionally) Contact sidebar. Echoes the script scene of the broker on the balcony [Script, 0:15-0:35] without showing him.
- **Frame**: L, 2400x1600 (3:2). Mobile: 1200x1500 (4:5), own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 35mm prime at f/5.6. A modern waterfront condominium balcony at dusk: a clean glass balustrade with a slim brushed-brass top rail, a stone-tiled floor, a single teak lounge chair angled toward the view, a pair of linen-textured cushions, and a folded cashmere throw. Beyond the rail, a calm marina with several large yachts, their lights glowing softly, under a deep navy sky with a champagne band on the horizon. Empty of people. Interior light from behind is warm and low. The horizon is on the lower third, perfectly level. Open space on the right for text. Split-tone grade: navy-teal shadows, champagne highlights, brass gold in the rail and interior glow. Lifted warm blacks, fine film grain. Private, still, aspirational.
Mobile variant: vertical 4:5, the lounge chair in the lower third and the marina above it.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people, silhouettes of people, wine glasses
```

**Check**: no figure in the glass reflections; the balustrade is physically coherent; the yachts in the distance are plausible and unnamed.

---

### IMG-07. Brand and marketing desk (Services, chapter 01)

- **Use**: Services, chapter 01 "Brand & Marketing". Curtain from the side opposite the text; parallax.
- **Frame**: L, 2400x1600 (3:2). Mobile: 1200x1500 (4:5), own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 50mm prime at f/4. A designer's desk by a tall window in soft morning light: a large sheet of heavy cream paper with an abstract ink wash and a few blank colour swatch cards in navy, champagne and brass, laid out in a considered grid; a fountain pen resting beside them; a small brass desk lamp, off. In soft focus behind, a rolled drawing and a stone paperweight. Every sheet and card is blank, with no printed text, no logos, no lettering. Warm oak desk surface, ivory linen cloth edge, window light from the left. Composition on the right two thirds with open desk space and falloff at the left edge. Split-tone grade: navy-teal shadows, champagne highlights. Palette: ivory #faf5ea, champagne #f7ebcf, brass #c8a45a, navy #0b2239. Lifted warm blacks, fine film grain. Calm, tactile, considered.
Mobile variant: vertical 4:5, the swatches and pen centred on the lower two thirds.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, printed brochures with text, business cards with text, computer monitor, tablet
```

**Check**: every card and sheet is truly blank; no pseudo-letters in the ink wash; pen and lamp look like real objects.

---

### IMG-08. Business operations (Services, chapter 02)

- **Use**: Services, chapter 02 "Business Operations". Same motion role as IMG-07.
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 50mm prime at f/5.6. An orderly desk in a quiet study: a stack of three closed navy linen-bound ledgers squared against each other, a closed cream document folder with a brass clip, a polished stone tray holding a pen, and a small warm lamp, lit, casting a pool of soft light. Dark oak wall panelling softly out of focus behind. Window light from the left, a hint of blue dusk outside. All covers and spines are blank, no labels, no printed text. Composition: objects in the lower right, calm panelled wall and gentle shadow elsewhere. Split-tone grade: navy-teal shadows, champagne highlights, brass accents. Lifted warm blacks, fine film grain. Orderly, discreet, trustworthy.
Mobile variant: vertical 4:5, ledgers and lamp in the lower half.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, labels on spines, calculators, charts, numbers
```

**Check**: no labels or numbers on spines or folders; lamp light is physically consistent; the stack is square.

---

### IMG-09. CRM and MLS (Services, chapter 03)

- **Use**: Services, chapter 03 "CRM & MLS".
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 35mm prime at f/5.6. A slim silver laptop, closed, resting on a pale stone window ledge beside a plain cream notebook and a pen, with a tall window behind showing a softly blurred marina and yachts in early evening light. Warm room, cool outside; the window glow is champagne fading to blue. Everything is blank and unlit, no screen visible, no text. Composition: laptop and notebook in the lower left third, the marina in the upper right, calm negative space across the middle. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. Connected, quiet, modern.
Mobile variant: vertical 4:5, the laptop in the lower third and the window view above.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, open laptop, dashboard, glowing screen, apple logo
```

**Check**: the laptop is closed with no logo; the window frame is straight; the yachts beyond are blurred enough to avoid shape errors.

---

### IMG-10. Transaction and closing (Services, chapter 04)

- **Use**: Services, chapter 04 "Transaction & Closing Support".
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a medium-format mirrorless camera with a 85mm lens at f/4. A closed dark-tan leather document folder with a plain brass corner detail and a fine black fountain pen laid diagonally across it, on a polished walnut table in a yacht saloon, soft warm light from a round porthole on the left, a hint of blue sea in the glass. Cream upholstery softly out of focus behind. The folder is blank, with no embossing, no text. Composition: folder and pen in the right third, open space and gentle falloff on the left. Split-tone grade: navy-teal shadows, champagne highlights, brass gold accents. Lifted warm blacks, fine film grain. Resolved, final, discreet.
Mobile variant: vertical 4:5, the folder centred on the lower third.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, signed paper, signature, embossed monogram, wax seal
```

**Check**: no embossing or letters on the leather; the pen has believable proportions; the porthole is circular and coherent.

---

### IMG-11. Private office with marina view (Difference CTA)

- **Use**: The YBS Difference, CTA right-side panel (curtain from the right).
- **Frame**: P, 1600x2000 (4:5). Same frame on mobile. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 35mm tilt-corrected lens at f/8. A private corner office with floor-to-ceiling glass looking over a calm marina with large yachts at golden hour. A low walnut desk with nothing on it but a closed leather notebook and a small brass lamp, an empty leather chair turned slightly toward the view, a pale wool rug, a single abstract canvas in muted navy and ivory on the wall. Glass and window mullions perfectly straight. Warm interior, cool dusk outside. No people. Composition: window view in the upper two thirds, desk and chair in the lower third, subject centred in the central 70%. Split-tone grade: navy-teal shadows, champagne highlights, brass accents. Lifted warm blacks, fine film grain. Independent, composed, quiet success.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people, reflections of people in the glass, computer monitors, corporate signage
```

**Check**: window lines are vertical and parallel; no figures in the glass; the chair reads as empty; yachts are unnamed and plausible.

---

### IMG-12. Step 1: a confidential call

- **Use**: How It Works, step 1 image. Curtain.
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 50mm prime at f/4. A quiet meeting corner in a refined private office: two matching cream leather armchairs angled toward one another across a low round walnut table, on the table a glass carafe of water, two tumblers, and a closed slim notebook. A tall window with sheer linen curtains, soft late-morning light, a pale sea beyond the glass. The space feels private and unhurried. Empty of people. Composition: armchairs in the central 70%, table in the lower third. Split-tone grade: navy-teal shadows, champagne highlights, brass accents. Lifted warm blacks, fine film grain.
Mobile variant: vertical 4:5, the table and chairs centred, window above.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people, video call, monitors, phones
```

**Check**: two chairs only, symmetrical and undistorted; glasses are plausible; no figures.

---

### IMG-13. Step 2: choose a tier

- **Use**: How It Works, step 2 image. Curtain.
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a medium-format mirrorless camera with a 85mm lens at f/5.6. Two sets of brass keys with plain unmarked leather fobs laid side by side on a dark navy velvet tray, one set slightly larger and heavier than the other, on a pale marble surface. Soft raking light from the left, deep soft shadow to the right. Everything blank, no engraving, no tags with writing. Composition: tray in the central 70%, plenty of marble and shadow around it. Split-tone grade: navy-teal shadows, champagne highlights, brass gold clearly warm. Lifted warm blacks, fine film grain. A considered choice.
Mobile variant: vertical 4:5, the tray centred.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, price tags, numbers, engraving, car keys
```

**Check**: keys are mechanically plausible (a blade, a bow, a split ring); there are exactly two sets; no marks or numbers on fobs. If the model repeatedly draws car keys, switch to two ornate brass padlock keys on a ring.

---

### IMG-14. Step 3: launch

- **Use**: How It Works, step 3 image. Curtain.
- **Frame**: L, 2400x1600. Mobile: 1200x1500, own frame. People: none.

**Prompt**
```
Photorealistic editorial photograph, shot on a full-frame mirrorless camera with a 35mm prime at f/8. A tall open double glass door in a pale stone wall, leading out to a quiet wooden dock at early morning, with the door held open at an angle and a thin curtain lifting in a light breeze. Beyond, calm water, a single large modern yacht moored in the distance, soft haze, a pale champagne sky. The dock planks lead the eye toward the water. Nobody present. Composition: door and dock in the central 70%, horizon on the lower third and perfectly level. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. A threshold, an arrival, a beginning.
Mobile variant: vertical 4:5, the door filling the frame, dock leading down.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, people, signs, flags
```

**Check**: door frame and glass are physically consistent (no warped panes, no doubled frames); plank perspective converges correctly; the distant yacht is plausible.

---

### IMG-15. Marina bokeh (Leadership backdrop)

- **Use**: Leadership, founder block, behind the real portrait (`kent.png`), shown fully blurred. Atmosphere only.
- **Frame**: W, 3200x1400. Same on mobile (cropped from the centre). People: none.

**Prompt**
```
Photorealistic abstract photograph of an out-of-focus marina at dusk, shot on a full-frame mirrorless camera with an 85mm lens at f/1.4, focused far behind the subject so the entire frame is soft bokeh. Warm gold and champagne round highlights from moored yacht lights and dock lamps, scattered across a deep navy and charcoal water ground. No recognisable objects, only colour, light and soft shapes. Brightest highlights toward the lower right, calm dark area in the upper left. Split-tone grade: navy-teal shadows, champagne and brass highlights. Lifted warm blacks, very fine film grain. Quiet, warm, dignified.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, sharp objects, hexagonal bokeh, rainbow colours
```

**Check**: nothing in focus; colours stay within navy, charcoal, champagne, and brass. If the portrait's skin tones look cold beside it, warm the backdrop slightly. Compare to `kent.png` side by side before approving.

---

### IMG-16. Abstract horizon at first light (Insights featured)

- **Use**: Insights, featured card image. Curtain plus parallax.
- **Frame**: L, 2400x1600 (3:2). Same on mobile (crop to 4:5 from the centre works). People: none.

**Prompt**
```
Photorealistic minimalist photograph, shot on a medium-format camera with a 85mm lens at f/11, long exposure. Open sea at first light under a clear pale sky. A perfectly level horizon on the lower third; the water is nearly glass, with a very gentle sheen. A narrow band of champagne light at the horizon fades upward into soft ivory then pale blue-grey, and the water below is deep navy-teal with a thin thread of brass-gold light. No vessel, no land, no birds, no clouds beyond a faint haze. Nothing in the frame except sea and sky. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. Contemplative, spacious, patient.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, boat, ship, sailboat, birds, sun disc, rainbow
```

**Check**: horizon level to the pixel (measure it), no stray objects or banding in the sky gradient.

---

### IMG-17. Abstract ripples (Insights index, top)

- **Use**: Insights, first index card. Rise; slow hover scale.
- **Frame**: S, 1600x1600 (1:1). People: none.

**Prompt**
```
Photorealistic abstract close photograph, shot on a full-frame mirrorless camera with a 100mm macro lens at f/5.6, overhead view of still dark navy water with slow concentric ripples spreading from an unseen point just outside the lower right of the frame. Soft champagne highlights run along the crests, deep navy-teal in the troughs, a faint thread of brass light across the surface. Calm, cool, minimal; no objects, no foam, no splash. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. Quiet, thoughtful.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, splash, foam, fish, leaves, swimming pool tiles
```

**Check**: ripples look physical and concentric, not like a vector pattern; no pool tile or sparkle artefacts.

---

### IMG-18. Dusk water texture (shared CTA background)

- **Use**: Final CTA background on Home, Services, How It Works, Leadership, FAQ, Insights. Slow horizontal drift of at most 24 px.
- **Frame**: W, 3200x1400, delivered with 12% headroom for drift. Mobile: 1200x1500 (4:5), own frame, no drift. People: none.

**Prompt**
```
Photorealistic photograph of the surface of a dark sea at dusk, shot on a full-frame mirrorless camera with a 100mm lens at f/8, slightly elevated angle so the water fills the entire frame. Long gentle swells, almost still. The deepest navy fading to warm charcoal, with a single narrow thread of soft brass-gold light running horizontally across the frame at the upper third, and faint champagne glints on the crests nearest it. Very low contrast, very smooth, no horizon, no objects, no foam. Overall dark and calm so white and ivory text reads easily on top. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm charcoal blacks #17140f, fine film grain. Deep, quiet, expensive.
Mobile variant: vertical 4:5, the gold thread at the upper third, slightly lower overall brightness.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, whitecaps, spray, boats, horizon, sparkle, moon
```

**Check**: bright glints stay small and sparse; average luminance low enough that ivory text passes 4.5:1 across the full text zone (measure it); no visible tile repeat when drifted 24 px.

---

### IMG-19. Ivory linen

- **Use**: About, mobile fallback for the vision band; any soft ivory surface.
- **Frame**: T, 2000x2000, tileable. People: none.

**Prompt**
```
Photorealistic seamless top-down photograph of fine natural linen fabric in warm ivory, shot on a 100mm macro lens at f/8 with even soft diffused light and no visible shadows, the weave visible at 100% but very subtle, with tiny natural slubs. Colour between #faf5ea and #f4ecda. No folds, no creases, no stitching, no edges. Make the pattern tileable. Fine film grain. Calm, quiet, tactile.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, folds, creases, stitching, colour variation, vignette
```

**Check**: tile the image 3x3 in an editor and look for seams or repeated blotches; confirm the average colour sits in the ivory range.

---

### IMG-20. Rope coil and brass cleat (Insights index, bottom)

- **Use**: Insights, second index card. Rise; slow hover scale.
- **Frame**: S, 1600x1600 (1:1). People: none.

**Prompt**
```
Photorealistic editorial still-life, shot on a full-frame mirrorless camera with a 85mm lens at f/2.8. A neat flat coil of thick ivory three-strand rope lying on oiled teak decking beside a polished brass cleat, in warm low sunlight from the left. Sharp focus on the near edge of the coil and the cleat's base; the rest falls softly out of focus. Warm wood, ivory rope, brass gold, a little deep navy shadow at the frame edge. The composition leaves an empty teak area at the upper left. Split-tone grade: navy-teal shadows, champagne highlights. Lifted warm blacks, fine film grain. Seamanlike, careful, practised.
```

**Negative**
```
text, letters, words, logos, watermark, signature, brand names, hull names, signs, labels, readable screens, UI, brochure text, faces in close-up, hands touching, handshake, toast, crowd, children, stock photo, HDR, oversaturated, neon, lens flare, bloom, glossy plastic, CGI, 3D render, illustration, painting, fisheye, ultra-wide distortion, tilted horizon, fake reflections, extra rails, impossible hull geometry, duplicate objects, warped windows, deformed hands, tangled rope, knots with impossible structure, plastic rope
```

**Check**: rope twist direction is consistent and strands do not fuse; the cleat is a recognisable, symmetrical shape.

---

## 8. Real photography that should not be generated

Some images have to be real people in real places. Generated stand-ins would damage trust with an audience that knows yachts and knows brokers.

### 8.1 Founder portrait set (Kent)

Existing: `kent.png`, 1254x1254, 2 MB (a real person) [Code]. I could not view it first-hand in this session (2.2), so I make no claim about its quality.

Recommended shoot (half a day, one photographer, one assistant):

1. **Environmental portrait** at a real marina, aboard a real yacht or at a private dock. 4:5 portrait, 85 mm, f/2.8, late-afternoon light. This replaces what the old brief asked a model to invent (entry 11, "Founder Environmental Portrait", in `YBS_IMAGE_GENERATION_BRIEFS.md`).
2. **Seated portrait** in a real private office with natural window light, 3:2 landscape, for the Leadership page.
3. **Hands and detail**: a pen on a folder, a hand on a rail, a watch cuff. No face. Usable across pages.
4. **Candid**: a conversation with a colleague or client on a deck (with written consent), 3:2.
5. **Wardrobe**: the script suggests button-down shirts, tailored slacks, a tie-and-jacket variant, and bare feet on a balcony [Script]. Bring the navy jacket, an ivory linen shirt, and one darker option.
6. **Deliverables**: RAW plus graded JPEG at 5000 px on the long edge, with a signed model release and a usage licence covering web, social, and print.
7. **Grade** to the rules in 4.2 so the real photos match the generated ones, not the reverse.

### 8.2 The spokesman and the script scenes

The scripts use a recurring spokesman and a broker character in specific places [Script]: the office, the condo balcony, the aft-deck toast with a client, the signature on a digital contract. These are video scenes, but stills from the same shoot should become website photography.

- Shoot **stills in parallel** with the video days: balcony at dusk (the broker from behind), the aft-deck toast (hands and glasses only), the contract signature (hand and pen), and the office.
- The toast is exactly the kind of shot that fails when generated (4.4.3). Do it for real.
- Replace IMG-06 with a real photograph of the real balcony or an equivalent.

### 8.3 Places and team

- If YBS has a real office at the stated Fort Lauderdale address [Script], photograph the entrance and a meeting room. Do not present generated interiors as "our office" (4.5.3).
- If there is a real support team (accounting, legal, administration, marketing), a simple honest group or workspace photograph is worth more than twenty generated desks. I did not verify that such a team exists in the sense the site implies; ask the owner.
- Real yachts: partner with a client or friendly broker for a yacht-interior shoot, with the owner's permission and no visible name.

### 8.4 Rules for all real photography

1. Written permission from every identifiable person and every yacht owner.
2. No visible hull names, registration numbers, or client documents.
3. Retain RAW files and licences in the same repository as the generation prompts (4.5.5).
4. Keep a record of which images are real and which are generated, and update the site's image credits if any are required by law or platform policy. I did not check legal disclosure requirements for AI-generated images in your jurisdictions; ask counsel.

---

## 9. Priority ranking and build order

Ranked by how much each image lifts the experience per unit of effort, and by the motion plan's phase order. P0 is first.

### Build order

0. **Human review of existing stills (P0).** Compare the hero posters and `kent.png` with the palette in 4.2. This is the one step this document could not do for you (2.2). Adjust the grade table if the heroes differ materially.
1. **Run a 3-image pilot (P0).** Generate IMG-18, IMG-02, and IMG-07 first. They cover the three roles most used (CTA backdrop, section background under overlay, a chapter card). Check the whole set against section 10. If the three do not feel like one family, fix the shared look in 4.1-4.2 before generating more.
2. **Home and Services (P1):** IMG-18, IMG-03, IMG-02, IMG-01, then IMG-07 to IMG-10.
3. **Difference and How It Works (P1):** IMG-11, IMG-12 to IMG-14.
4. **About, Leadership, Contact (P2):** IMG-04, IMG-05 (only if a still is chosen), IMG-06, IMG-15.
5. **Insights and texture (P3):** IMG-16, IMG-17, IMG-20, IMG-19.
6. **Replace with real photography as it arrives (ongoing):** section 8.

### Ranking table

| Rank | Image | Why |
|---|---|---|
| 1 | IMG-18 | One image covers six CTAs; the script's closing mood (deep blue water) |
| 2 | IMG-03 | The single strongest narrative image: the yacht sailing off [Script, 1:15-1:30] |
| 3 | IMG-02 | One image covers two tier sections |
| 4 | IMG-07 to IMG-10 | Services is the page with the most missing photography; four chapters |
| 5 | IMG-12 to IMG-14 | The three-step process needs images to carry the rail |
| 6 | IMG-11, IMG-06 | Unique closing images for Difference, About, and Contact |
| 7 | IMG-01, IMG-04, IMG-05, IMG-15 | Ambient depth; lower impact individually |
| 8 | IMG-16, IMG-17, IMG-20 | Insights cards; the page has no real articles yet (see the motion blueprint, B10) |
| 9 | IMG-19 | A texture; lowest visibility |

### Do not generate yet

- IMG-05 until the owner resolves the About video question (O5).
- IMG-06 for Contact until the owner says whether the confidentiality page wants imagery at all (O7).
- Anything with a person (none in this set) until the real shoot is scheduled.

### Estimated effort

Roughly 10-15 generation attempts per image to get one passing the checklist is typical for photographic work of this kind [Inferred, not measured]; plan a few days of selection and grading for the full set, plus upscaling and QA. Real photography adds a shoot day and a retouching week.

---

## 10. Review checklist for generated images

Run every image through this before it enters `public/images/`. Fail on any "no".

### 10.1 Content

- [ ] No readable text, letters, numbers, logos, hull names, or flags anywhere (zoom to 200% and check surfaces, spines, screens, sails).
- [ ] No people, or the person rules in 4.4 are satisfied and a human has approved.
- [ ] Objects are mechanically plausible: yachts (rails, windows, tender garage, waterline), keys, pens, cleats, rope, glass, chairs, doors, frames.
- [ ] No duplicated or fused objects; no warped straight lines; no impossible reflections.
- [ ] No resemblance to a real named yacht or a recognisable landmark.

### 10.2 Brand

- [ ] Palette sits within section 4.2 (navy, champagne, ivory, brass, warm charcoal).
- [ ] Light direction is low and from one side; shadows lean navy-teal; highlights lean champagne.
- [ ] No HDR halo, over-sharpening, plastic skin or surfaces, neon, or bloom.
- [ ] The picture is calm. If it feels like it is trying to impress, reject it.
- [ ] Sits comfortably beside the heroes and beside the other 19 (contact-sheet test, 5.5).
- [ ] Not a comparison, not a swipe at traditional brokerages (brand rule).

### 10.3 Motion and layout

- [ ] Safe area for its motion role respected (4.6, 5.4).
- [ ] Parallax images carry the 12% headroom (5.3).
- [ ] Text zone is flat enough; ivory or charcoal text passes 4.5:1 with the planned overlay (measure).
- [ ] Horizon is level to the pixel where there is one.
- [ ] Nothing important sits within 8% of an edge for curtain images.
- [ ] Mobile frame exists wherever section 6 says "own frame".

### 10.4 Technical

- [ ] Delivered at or above the pixel size in 5.2; upscale no more than 1.5x.
- [ ] sRGB, EXIF stripped, grain applied once at master.
- [ ] Web weight within budget; per-route total within 600 KB (desktop) / 350 KB (phone).
- [ ] File named per 5.1; prompt, seed, tool, date stored in the sidecar.
- [ ] `alt` text written per section 6 (descriptive or empty).
- [ ] Tool terms allow commercial use (4.5.6); a person has signed off.

### 10.5 Sign-off

A named person on the YBS side approves each image, and the set as a whole. Nothing ships without it.

---

*End of art direction.*
