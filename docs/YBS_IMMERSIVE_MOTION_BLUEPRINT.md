# YBS Immersive Motion Blueprint

Status: design blueprint only. No application source, styles, components, dependencies, configuration, or assets were changed to produce it.
Date: 2026-10-26
Companion document: `docs/YBS_IMAGE_ART_DIRECTION.md` (image prompts, asset plan, crop rules).

## Contents

1. Evidence base and limits
2. Creative thesis and motion language
3. Audit of the current motion system, with scorecard
4. Protected components and how to keep them frozen
5. Motion tokens and primitives (the proposed system)
6. Section-by-section choreography (all nine routes)
7. Signature moments versus quiet rhythm
8. Cross-cutting: header, route transitions, micro-interactions
9. Mobile, accessibility, reduced-motion, and performance constraints
10. Content and brand flags found during the audit
11. Ranked implementation plan with acceptance criteria
12. Verification protocol and open decisions

---

## 1. Evidence base and limits

Every claim below is tagged so you can see how it was established.

- [Code] Read directly from source in this session.
- [Browser] Measured earlier in this engagement with Chrome DevTools Protocol at 1440x900 (desktop) and 390x844 (mobile), using computed styles, a MutationObserver on class changes, and SVG stroke metrics.
- [Script] Taken from the two supplied PDF scripts (Detailed YBS Explainer Video Script; YBS Final Video Script, "Be the Architect of Your Future").
- [Web] Checked on 2026-10-26 (browser support figures).
- [Inferred] Reasoned from the above, not directly observed.

What was not verified, and should be before build starts:

- No performance baseline exists. No Lighthouse run, trace, or INP/CLS figure was captured, so no "before" numbers are quoted. Capturing one is step 0 of the plan.
- The visual content of the existing stills (`kent.png`, `Logo.png`, `yacht-marker.png`, the hero JPGs) was not assessed beyond file size and pixel dimensions.
- The `Button`, `Footer`, `PageHero`, and `TierCard` stylesheets were not audited. `PageHero` may be unused; confirm before treating it as live.
- Real-device behavior (iOS Safari address-bar resize, Android Chrome) was emulated only.

---

## 2. Creative thesis and motion language

### 2.1 Thesis: "The Architect's Drawing Table"

The final script closes on one line: "Be the Architect of Your Future." The audience is independent brokers who want to hear that they are the firm and that YBS is the support behind them ("You are the firm, and we are your support" [Script]). The motion system should enact that idea instead of decorating it.

Every page is treated as a drawing that becomes a built thing:

1. A gold hairline is drawn first (structure, intent).
2. Surfaces and photographs resolve behind it (material, light).
3. Content settles into place last (the finished work).

The gold hairline already exists in the product as `GoldRule`, the header progress bar, and the ecosystem hub ring [Code]. Using it as the single recurring motion motif gives the site one visual signature without adding a new vocabulary.

### 2.2 Tone, taken from the script notes

The scripts call for "the calm, measured confidence of a luxury watch commercial or a high-end wealth management firm" and "wealth and success" conveyed through "lighting, texture, and high-end environments" [Script]. Translated into motion:

| Script direction | Motion rule |
|---|---|
| Calm, measured confidence | Long settles (700-1100 ms) with a strong ease-out. Nothing bounces, overshoots, or springs. |
| Lighting and texture | Light moves, objects do not. Prefer a slow gold light sweep or exposure shift over flying elements. |
| Elegant, medium-paced transitions | One idea per viewport. A second animated element may enter only after the first has settled. |
| Exclusive, empowering | Restraint is the luxury signal. Most sections get quiet motion; a few get a signature moment. |
| Deep ocean blues, wood, glass | Imagery reveals like opening a shutter or lifting a curtain, never a zoom-pop. |

### 2.3 Six motion principles

1. **Draw, then fill.** Lines and rules animate before the content they frame.
2. **Light over movement.** Prefer opacity, exposure, and clip reveals to large translations.
3. **One owner per transform.** Positioning and animation never share an element (see defect F2 in section 3).
4. **Settle, do not arrive.** Entrances decelerate into place; there are no exits on scroll-back.
5. **Earn the signature.** At most one signature moment per roughly 2.5 viewport heights, and at most two per page.
6. **Content is never conditional on motion.** Every state is complete and readable with JS off, reduced motion on, or the animation never firing.

### 2.4 What "extraordinary" does not mean here

- No WebGL, 3D scenes, or custom cursors. `three`, `@react-three/fiber`, and `@react-three/drei` are installed but not imported anywhere in `src` [Code: no matches for `from 'three'`, `@react-three`, `<Canvas`]. A luxury brokerage audience on phones and corporate laptops is better served by photographic depth than by a 3D hull. Treat those three packages as dead weight to confirm and remove in a separate dependency change.
- No scroll-jacking and no smooth-scroll library. The page uses native scrolling with `scroll-behavior: smooth` in CSS [Code]. Pinned scenes use `position: sticky`, which the layout already protects (`overflow-x: clip` rather than `hidden`, with a comment explaining why [Code, `globals.css` ~253]).
- No new animation dependency. `motion` 11.18.2 is installed and already used for `useScroll`, `useTransform`, and `AnimatePresence` [Code]. It covers every spec below.

---

## 3. Audit of the current motion system

### 3.1 What exists

Everything outside the heroes and the loader is built from four pieces [Code]:

| Piece | Where | What it does |
|---|---|---|
| `RevealOnScroll` | `src/components/ui/RevealOnScroll.tsx`, classes in `globals.css` 398-475 | IntersectionObserver at fixed `threshold: 0.15`, then toggles `.revealed`. Four variants: up (20 px), left (-28 px), right (+28 px), scale (0.98). 500 ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Disconnects after the first hit. |
| `stagger` mode | same file | Adds `.stagger-children`; on `.revealed`, direct children run a 14 px fade-up with 70 ms steps up to 420 ms. |
| `ServicesEcosystem` | `src/components/home/` | Motion `useScroll` + `useTransform`: hub scales 0.7 to 1, three nodes drift in, three SVG lines "draw". Desktop orbit at 1024 px and up; simple card stack below. |
| `ServiceDetail` | `src/components/home/` | Accordion; Motion `AnimatePresence` animates `height: auto` and opacity over 300 ms. |

Supporting behavior: `VideoHero` and `HeroVideo` pause off-screen via IntersectionObserver (0.25 and 0.2). The header draws a scroll-progress hairline. FAQ uses native `<details>` with no open animation. `html.js` is set by an inline script so hidden reveal states only apply when JS runs; with JS off, everything stays visible [Code, `layout.tsx` and `globals.css` 408-413]. That last part is well done and must be preserved.

Usage volume: `RevealOnScroll` has 56 call sites across the nine page files (home 15, difference 9, about 8, how-it-works 7, insights 5, services 4, leadership 3, faq 3, contact 2), plus one inside `CinematicHero`. `stagger` is used 8 times (home 3, difference 2, insights 1, how-it-works 1, about 1) [Code, grep]. The FAQ page maps over categories, so it renders more instances at runtime than its 3 call sites suggest. Almost every section on every page therefore uses the same two or three entrances.

### 3.2 Defects found

Numbering is stable; later sections refer to these as F1, F2, and so on.

**F1. Stagger targets the wrong element.** On the home page, How It Works, Difference, About, and Insights, `stagger` wraps a single grid `<div>`, so `> *` selects that one wrapper, not the cards inside it. The cards never stagger individually. Also, `.stagger-children` has no hidden pre-state: children are visible, then snap to `opacity: 0` the moment `.revealed` is added, then animate in. That is a visible flash [Code; flash observed in browser].

**F2. Positioning and animation fight over `transform`.** In `ServicesEcosystem`, the hub is centered with CSS `transform: translate(-50%, -50%)` and the top node with `translateX(-50%)`. Motion writes its own inline `transform` (scale, x, y), which replaces the CSS one. Measured at 1440x900: the hub sits about 70 px right and down of center, and the top node about 120 px right of center [Browser]. The layout the designer intended is not what ships.

**F3. The "drawn" lines are dotted.** `ConnectionLine` sets `strokeDasharray="1"` on a `<line>` without `pathLength="1"`. With real user-space length (hundreds of px), a dash of 1 is a 1 px dot pattern, and animating `strokeDashoffset` from 1 to 0 moves it by one pixel. The result is a static dotted line, not a line that draws [Code; stroke metrics read in browser]. Line endpoints are fixed percentages (50/20, 20/70, 80/30) that are not derived from node positions, so they would miss the nodes even if F2 were fixed [Inferred].

**F4. Only three of four pillars appear.** `servicePillars.slice(0, 3)` drops "Transaction & Closing Support" from both the orbit and the mobile stack, while the Services page and the script describe four pillars [Code; Script].

**F5. Icons render as words.** `{pillar.icon}` outputs the data string ("layers", "briefcase", "monitor") at 2rem in the node and mobile card [Code].

**F6. Descriptions cut mid-word.** `pillar.description.slice(0, 90)…` truncates at a fixed character count [Code].

**F7. Reveal timing is crude.** Fixed `threshold: 0.15` with no `rootMargin` means every element waits until 15% of its own height is visible, which measured as 82-96% down the viewport at 1440x900 [Browser]. Two consequences: reveals feel late on short elements, and a very tall wrapper can fail to reach 15% on a small screen. The Services page wraps all four chapters in one `RevealOnScroll`; if that block is ever taller than about 6.7 viewport heights it would never reveal [Inferred, not reproduced].

**F8. Permanent compositor layers.** `will-change: opacity, transform` is set on every `.reveal*` element for the life of the page (`globals.css` 539-544) and is never removed after reveal. With 56+ instances that is avoidable memory pressure on phones [Code].

**F9. `transition: all` on `TierCard`.** `TierCard.module.css` line 8 animates every property on hover, including layout-affecting ones if added later [Code].

**F10. Header re-renders on scroll.** `Header` stores scroll progress in React state and updates it every animation frame, re-rendering the whole nav on every scrolled frame [Code]. The progress hairline should be driven by a ref or a Motion value instead.

**F11. The About "video" has no source.** `VideoHero` renders a `<video>` with `poster`, `autoPlay`, `loop`, but no `src` or `<source>`, and the About page passes only `poster`, `title`, and `ariaLabel` [Code]. The observer that plays and pauses it acts on nothing. Separately, `hero-about-poster.jpg` and `hero_about.jpg` are byte-identical (same MD5), so the About page shows the same photograph twice, once as the hero and once as the "video" [Code, hash]. Not confirmed visually in this session.

**F12. Four cards, one image.** Outside heroes there is no photography on any page except the founder portrait. `InsightCard` has an `.image` box that only holds a tag [Code]. There is nothing for a parallax, clip reveal, or crossfade to act on until the image plan lands.

**F13. Brand-rule leakage in motion targets.** The home page still renders a `ComparisonTable` under "Traditional Brokerage vs. YBS" (`page.tsx` 157-173). Listed here because it is also a scroll-reveal target; see section 10.

### 3.3 What works and must be kept

- Reduced motion is respected in three places: global CSS override, `usePrefersReducedMotion` (a hydration-safe `useSyncExternalStore`), and video pausing [Code].
- No-JS safety: hidden states are gated on `html.js` [Code].
- Animations use `opacity` and `transform` only [Code].
- `overflow-x: clip` preserves `position: sticky` [Code].
- The ecosystem section already has the right architecture (scroll progress mapped to values); it needs correcting, not replacing.
- Native `<details>` for FAQ is robust and accessible; enhance it, do not replace it.

### 3.4 Scorecard (1 = absent, 10 = best in class)

These are my judgments from the code and the browser measurements, not benchmarked numbers.

| Dimension | Score | Basis |
|---|---|---|
| Variety of entrance language | 2 | Four variants of the same fade-and-shift; almost every block uses `up` |
| Choreography and sequencing | 2 | Stagger is broken (F1); no section sequences more than two beats |
| Narrative tie to the brand idea | 2 | No motion expresses "architect", independence, or build-up |
| Scroll-linked depth | 3 | One prototype section, with layout and line defects (F2, F3) |
| Imagery and media in motion | 1 | No photography outside heroes (F12); About video has no source (F11) |
| Micro-interactions | 4 | Accordion, card hover, header hairline; FAQ and buttons are plain |
| Craft and polish | 3 | Defects F1-F6 are visible at first glance |
| Reduced-motion and no-JS safety | 8 | Solid foundation (3.3) |
| Performance hygiene | 6 | Compositor-only properties; permanent `will-change` and per-frame header render cost points |
| Mobile adaptation | 5 | Orbit collapses to a stack; no mobile-specific choreography |

Overall: a technically safe but visually generic system. The safety layer is the strongest part and the plan keeps it.

---

## 4. Protected components and how to keep them frozen

### 4.1 Inventory

The user's rule: hero sections on every page (video, poster, text, layout, overlays, responsive behavior) and the BrandLoader (animation and timing) do not change.

| Item | Files | Notes |
|---|---|---|
| Hero (all 9 routes) | `src/components/layout/CinematicHero.tsx`, `CinematicHero.module.css`, `HeroVideo.tsx`; `public/hero*.jpg`; `public/videos/hero-*.mp4` | `PageHero.tsx` exists but no import of it was found in `src`; treat as dead code, do not delete in this work |
| Hero token pinning | `globals.css`, block starting `section:has(> [data-hero-visual])` (~213) | Restores original navy and gold values inside heroes so the new palette does not leak in |
| Brand loader | `src/components/ui/BrandLoader.tsx`, `BrandLoader.module.css`, `src/hooks/useBrandLoaderGate.ts`, `public/logo/ybs-logo-intro.mp4`, `public/yacht-marker.png` | Timing constants and playback live in the TSX |
| Loader token pinning | `globals.css`, block starting `[role="dialog"][aria-label="Loading Yacht Broker Services"]` (~239) | Same purpose |
| Hero entrance | `RevealOnScroll` call inside `CinematicHero.tsx` (line 50) | **See 4.2** |

### 4.2 The hidden coupling: `RevealOnScroll` is shared with the hero

`CinematicHero` wraps its label, h1, subtitle, and buttons in `<RevealOnScroll>` [Code, line 50]. That means the hero's text entrance depends on `RevealOnScroll.tsx` and on the `.reveal`, `.revealed`, `--duration-slow`, and `--ease-out` rules in `globals.css`.

Consequence: any edit to `RevealOnScroll`, to `.reveal*` CSS, or to `--duration-*` / `--ease-out` values would change the hero's text behavior and break the lock. The obvious fix for the weaknesses in section 3 is to upgrade `RevealOnScroll` in place. That would break the lock, so it is ruled out.

Rule: **freeze `RevealOnScroll` and the legacy `.reveal*` / `.stagger-children` CSS exactly as they are.** Build a new primitive (section 5) with new names and migrate non-hero pages to it. The legacy component then remains used only by the hero.

### 4.3 Guardrails for the build phase

1. Do not edit any file in the inventory above. A pull request that touches one is rejected unless the user approves it.
2. New global CSS must be class-scoped with a `ybs-m-` or `m-` prefix. No new element selectors (`section`, `h1`, `p`, `a`, `button`, `main > *`) in global CSS, because they can reach into the hero.
3. New custom properties use a new prefix (`--m-*`). Do not change the values of existing `--duration-*`, `--ease-*`, or color tokens.
4. Lenis-style or global scroll libraries are excluded (they would affect the loader's scroll lock and the hero video observers).
5. Any change to `Header` (a global overlay on every hero) is limited to the progress hairline and requires a hero screenshot diff.
6. Keep the loader's body-lock contract: it sets `body.style.overflow = 'hidden'` and the class `ybs-loader-active` while playing [Code]. New scene code must not set body overflow and must not start work while that class is present.

### 4.4 Mechanical check (recommended, not created here)

Fingerprints taken on 2026-10-26 from the working tree. All files were clean in git at the time (no diff against HEAD), so these match the committed state.

| File | SHA-256 (first 16 hex) |
|---|---|
| `src/components/layout/CinematicHero.tsx` | `c799bf42ab5c6533` |
| `src/components/layout/CinematicHero.module.css` | `229610716f3db2af` |
| `src/components/layout/HeroVideo.tsx` | `cf847478255e28d3` |
| `src/components/ui/BrandLoader.tsx` | `a322e3d880a045d0` |
| `src/components/ui/BrandLoader.module.css` | `900bb86b2bb59ece` |
| `src/hooks/useBrandLoaderGate.ts` | `bcf1ddf8fbc2f366` |
| `public/logo/ybs-logo-intro.mp4` | `b7ac086a3640d6db` |
| `public/yacht-marker.png` | `c26508e359e3aeb8` |
| `public/hero-home.jpg` | `7bbc93ce6265c2ed` |
| `public/hero_about.jpg` | `c333da97070ea289` |
| `public/hero_services.jpg` | `7c835f4a1e8b0799` |
| `public/hero_difference.jpg` | `6e1f58678afaa532` |
| `public/hero_how_it_works.jpg` | `7655aa54b5bae7e6` |
| `public/hero_leadership.jpg` | `742b86c95394ce01` |
| `public/hero_faq.jpg` | `e87edf3b95837ed3` |
| `public/hero_insights.jpg` | `b87e934e32fa0234` |
| `public/hero_contact.jpg` | `e5b0ef0263d3c226` |
| `public/videos/hero-home.mp4` | `c23eeb9863fad63b` |
| `public/videos/hero-home-tablet.mp4` | `348a67f08701002a` |
| `public/videos/hero-home-mobile.mp4` | `f34abf5681cf3b46` |
| `public/videos/hero-difference.mp4` | `9171f8f69aeba73f` |
| `public/videos/hero-how-it-works.mp4` | `62acbdcae85d99e6` |
| `public/videos/hero-leadership.mp4` | `21de67c96c9d5b37` |

Add a CI step that recomputes these and fails on mismatch, plus the frozen portions of `globals.css` (the two token-pinning blocks and the legacy motion block, lines ~398-482). Also freeze `RevealOnScroll.tsx` by hash once it is in its final state. Visual check: before/after screenshots of each hero at 1440x900, 1024x768, and 390x844, taken with `?noloader` (supported by `useBrandLoaderGate`) so the loader does not mask the hero.

---

## 5. Motion tokens and primitives (the proposed system)

All new code lives beside, not inside, the frozen legacy layer. Suggested location: `src/components/motion/` and `src/styles/motion.css` (names are proposals).

### 5.1 Tokens (new `--m-*` namespace; legacy tokens untouched)

| Token | Value | Use |
|---|---|---|
| `--m-ease-settle` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances (stronger deceleration than legacy) |
| `--m-ease-draw` | `cubic-bezier(0.65, 0, 0.35, 1)` | Line drawing, clip reveals |
| `--m-ease-light` | `cubic-bezier(0.4, 0, 0.2, 1)` | Exposure and opacity shifts |
| `--m-dur-micro` | `180ms` | Hover, focus, press |
| `--m-dur-ui` | `420ms` | Accordion, tab, small state change |
| `--m-dur-reveal` | `900ms` | Standard section entrance |
| `--m-dur-feature` | `1400ms` | Signature moments only |
| `--m-stagger` | `90ms` | Step between siblings, capped at 6 siblings (540 ms) |
| `--m-shift` | `24px` | Maximum entrance translation |
| `--m-reveal-start` | `-12%` | IntersectionObserver `rootMargin` bottom inset (reveal when 12% inside viewport) |

Motion library equivalents live in one `motion-tokens.ts` so JS and CSS cannot drift.

### 5.2 Primitives

Each primitive has one job, renders complete content by default, and applies motion only after it has confirmed it can.

**`<Reveal>`** replaces `RevealOnScroll` for all non-hero use.
- Variants: `rise` (opacity + up to 24 px), `veil` (opacity only), `draw` (a rule scales from 0 to 1 on X, origin left or center), `curtain` (clip-path inset reveal), `mask-lines` (headline split by line, each line translating up inside an overflow-clip wrapper).
- Observer: `rootMargin: '0px 0px -12% 0px'`, `threshold: 0`, so the trigger no longer depends on element height (fixes F7).
- Hidden pre-state applied only after hydration, from a `data-m="ready"` attribute set on `<html>` by a new inline script alongside the existing `js` one. The server HTML is always the finished state.
- After the transition ends, removes `will-change` (fixes F8).
- Honors reduced motion by rendering the end state with no transition.

**`<Stagger>`** replaces `stagger` mode.
- Wraps a list, not a container. Takes `items` or maps `children`, giving each child its own `<Reveal>` with `delay = min(index, 5) * var(--m-stagger)`. Fixes F1 properly: it targets the cards, and the hidden pre-state exists before reveal, so there is no flash.

**`<DrawRule>`** is the signature motif: a 1 px champagne-gold line that draws on enter. Used under every section header and between chapters. Implemented as `transform: scaleX()` on a pseudo-element, not as a stroke, so it costs one compositor layer and no SVG.

**`<ScrollScene>`** wraps a Motion `useScroll` target and exposes `progress` (0-1) to children via a render prop or context. Standardizes the offset presets (`enter`, `cross`, `pinned`). `ServicesEcosystem` is rebuilt on this.

**`<Parallax>`** wraps an image with a sub-viewport depth shift: `translate3d(0, y, 0)` with `y` mapped from scroll progress across at most +/-6% of the image height, inside an `overflow: hidden` parent, with the image oversized by 12% so edges never show. Disabled below 768 px and under reduced motion.

**`<Counter>`** animates numerals (for example 90, 75) by interpolating a Motion value and writing text with `tabular-nums`. It always renders the final figure in the HTML (and in `aria-label`), so crawlers, screen readers, and no-JS users see the exact number.

**`<LightSweep>`** is a one-shot diagonal highlight (a gradient pseudo-element translating once across a surface). Used for tier cards and the closing CTA.

### 5.3 Technique selection rules

1. Entrance of text/cards: CSS transition driven by a class toggle (cheapest, no JS per frame).
2. Scroll-linked values (parallax, line drawing, counters tied to scroll): Motion `useScroll` + `useTransform`, writing to `transform`/`opacity` only.
3. Progressive enhancement: native CSS `animation-timeline: view()` is a valid optimization for simple scrubbed reveals. As of 2026-10-26 it is supported in Chrome/Edge 115+, Safari 26+ (including iOS), and Firefox 159+; Firefox 158 and earlier lack it [Web: caniuse]. Because a meaningful share of users are on older Firefox/Safari, do not depend on it. If used, wrap in `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`, and make the default (unsupported) state the finished state. Treat as a later optimization, not part of the first build.
4. Shared-element route transitions: Next 16 documents React `<ViewTransition>` for route changes, with no configuration in the App Router [Code: `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`]. The doc notes it needs Chromium 125+ and recent Safari/Firefox, and that without support the app works normally. See 8.2 for how it is used here, and the risk to the hero.
5. Never animate `width`, `height`, `top`, `left`, `margin`, or `box-shadow` on scroll. The one exception is the existing accordion's `height: auto`, which is user-triggered, not scroll-driven.
6. No more than 6 concurrently animating elements per viewport, and no more than 2 concurrent scroll-linked transforms.

### 5.4 Migration shape (no hero impact)

- Add primitives; leave `RevealOnScroll` and the `.reveal*` CSS untouched (used by the hero only after migration).
- Replace `RevealOnScroll` per page, one page per change, in the order given in section 11.
- Because `Section` and `Container` are server components with no motion, they stay untouched; per-section motion is added by wrapping children, not by editing `Section`.

---

## 6. Section-by-section choreography

Conventions used below:

- **Beat** = one motion event. A section has at most 3 beats, in order.
- Durations and easings refer to section 5 tokens.
- "Image ref" points to an entry in `docs/YBS_IMAGE_ART_DIRECTION.md` (IMG-xx). Until that image exists, the section uses the fallback named, so the build is never blocked on art.
- **Hero** rows are listed only to show they are skipped.
- Each section lists reduced-motion and mobile behavior. If a row says "same", it means no difference.
- Brand rule check: no section outside `/the-ybs-difference` contrasts YBS with traditional brokerages.

### 6.1 Home `/`

Sequence on the page today (11 blocks): hero, stat strip, narrative, ecosystem, what you get, tiers, comparison, how it works, leadership preview, FAQ preview, final CTA [Code, `page.tsx`].

**H1. Hero.** Locked. No work.

**H2. Stat strip (90% / Full / White-Glove).**
- Concept: the three promises arrive like instruments reading out.
- Beat 1: a `DrawRule` draws left to right across the top of the strip (900 ms, draw easing).
- Beat 2: "90%" runs `Counter` from 60 to 90 in 1200 ms with `tabular-nums` (final value in markup); "Full" and "White-Glove" do a `veil` with 90 ms offsets.
- Mobile: stack; counter only on the first stat.
- Reduced motion: final numerals, no rule animation.
- Truthfulness: the figure is "up to 90%". The counter label must keep "Up to"; do not count past the brand figure.

**H3. Platform narrative ("Your Name Above the Door" / "Autonomy, Fully Supported").**
- Concept: the script line "You are the firm, and we are your support" [Script]. Left panel is the firm, right panel is the support.
- Beat 1: headline `mask-lines` on the left panel (3 lines, 90 ms apart, 900 ms each).
- Beat 2: a vertical gold `DrawRule` between the panels draws top to bottom (1100 ms).
- Beat 3: the right panel rises after the rule completes (delay 500 ms from rule start).
- Depth: an ambient `Parallax` image (IMG-01, blank brass nameplate and teak door) behind the left panel at 6% opacity-equivalent via overlay, shift range +/-4%.
- Fallback without image: the ivory surface with the rule only.
- Mobile: panels stack; rule becomes horizontal between them; no parallax.
- Today's `left`/`right` variants (-28 px / +28 px) are replaced; they read as a generic slide-in.

**H4. Services ecosystem (signature moment 1 of 2 on this page).**
- Concept: "complete turnkey enterprise" [Script]. The broker sits at the centre; the four pillars assemble around them.
- Pin: `position: sticky` stage inside a 220vh track (a 1.2 viewport pin plus travel). Scroll progress 0-1 drives everything.
- Progress map: 0.00-0.12 ring and hub draw; 0.12-0.55 four pillar nodes resolve one after another (0.12, 0.24, 0.36, 0.48 start, each 0.20 long); 0.45-0.80 connector lines draw from hub to each node; 0.80-1.00 settle and unpin.
- Correct the defects: separate the positioning wrapper (CSS centering, never animated) from the animated inner element (fixes F2); give each `<line>` `pathLength="1"` with `strokeDasharray="1"` and animate `strokeDashoffset` 1 to 0 (fixes F3); compute line endpoints from the same coordinates as the nodes via one array so they cannot diverge; render all four pillars (fixes F4); replace icon-name text with inline SVGs drawn with the same hairline style (fixes F5); show the full first sentence of each description instead of slicing at 90 characters (fixes F6).
- Hub label: "YBS" over "Infrastructure" stays. Add the broker at the centre in copy only if the owner approves; otherwise keep the hub as is.
- Hover/focus on a node: border to gold, lift 2 px, 180 ms. Keyboard focus shows the same plus a visible ring.
- Below 1024 px: no pin. Four cards enter one by one with `rise`, and a vertical gold line connects them, drawing as the stack scrolls (Motion `useScroll` on the stack, 0 to 1 over its height).
- Reduced motion: all four nodes and all lines at final state, no pin (a static layout).
- Acceptance: nodes sit exactly where the CSS places them at progress 1; lines end inside each node's border box (measured in browser at 1440, 1280, 1024).

**H5. What You Get (accordion of four pillars).**
- Concept: quiet. The ecosystem above is the show; this section is the reference list.
- Beat 1: header `mask-lines` plus `DrawRule`.
- Beat 2: the four accordion rows `Stagger` in (90 ms steps).
- Accordion refinement (keep the Motion `AnimatePresence` approach): the open panel's feature list items `rise` 8 px with 40 ms steps after the height settles; the `+`/`-` glyph rotates 90 degrees in 180 ms instead of swapping text; the row's left gold bar scales from 0 to 1 on Y when open.
- Keyboard: unchanged (`aria-expanded` is already correct). Add `aria-controls` ids in the build.
- Mobile: same. Reduced motion: height snaps, no item stagger.
- Note: the first pillar is open by default (`useState(0)`), so on load one panel is already tall. That is acceptable; do not animate it on mount (`initial={false}` already does this).

**H6. Membership tiers (signature moment 2 of 2 on this page).**
- Concept: two clear, exact numbers, shown with confidence. Premium is $3,000 with a 90/10 split; Standard is $1,500 with a 75/25 split [Code, `difference.ts`].
- Beat 1: the two cards enter with `curtain` (clip-path inset from the bottom, 900 ms), Standard first, Premium 140 ms later.
- Beat 2: split numerals run `Counter` (90 from 50, 75 from 50) with `tabular-nums`; final figures in markup.
- Beat 3: a one-shot `LightSweep` crosses the Premium card once, 1400 ms, 400 ms after the counter ends. This is the only decorative sweep on the page.
- Background: IMG-02 (marina at blue hour) behind the section, covered by an ivory gradient at 90-94% so cards stay legible; slow `Parallax` +/-3%.
- Hover (fine pointer only): card lifts 4 px, border to gold-500, 180 ms. Replace `transition: all` with explicit properties (fixes F9).
- Mobile: cards stack; curtain becomes `rise`; no sweep (saves a layer).
- Reduced motion: final state; no sweep.
- Content note: the "Most Popular" badge is on Premium. Nothing in the repo or scripts supports that claim; see section 10.

**H7. Comparison table.** Brand rule: traditional-brokerage comparisons belong only on `/the-ybs-difference`. The recommendation in section 10 is to remove this block from the home page. If the owner keeps it, it must not be a motion target and must not be built into any signature moment. Remaining home sections below assume it is gone.

**H8. How it works (three steps).**
- Concept: the architect's three strokes: call, choose, launch.
- Beat 1: a horizontal `DrawRule` spans the three cards (draws left to right over 1100 ms) and each card's numeral (01, 02, 03) lights as the line passes it (opacity 0.25 to 1 plus a 1 px gold underline).
- Beat 2: card bodies `rise` with 90 ms steps, each starting when the line reaches it, driven by one shared scroll progress so the timing is exact.
- Mobile: the rule runs vertically down the left edge of the stacked cards, scrubbed by scroll.
- Reduced motion: lines drawn, numerals lit, no scrub.
- This is the same component as the How It Works page rail (6.5); build once with a `layout` prop.

**H9. Leadership preview.**
- Concept: the founder, with dignity. Do not over-animate a person.
- Beat 1: header `veil`.
- Beat 2: portrait `curtain` reveal from left (1000 ms), then a slow `scale` 1.04 to 1.0 settle across 1600 ms.
- Founder is a real person (`/kent.png`, 2 MB, 1254x1254). Motion must not crop the face: portrait is `object-position: 50% 30%` and any scale animation is capped at 1.04 so no feature crosses the frame edge.
- Mobile / reduced motion: static.

**H10. FAQ preview (3 items).**
- Concept: help, not spectacle.
- Beat: items `Stagger` in. The `<details>` open animation is a CSS `interpolate-size`/`::details-content` height transition where supported, otherwise native snap. The chevron rotates 180 degrees in 180 ms.
- Because `<details>` content is in the DOM when closed, the answer text remains crawlable; do not replace it with JS-mounted content.
- Mobile / reduced motion: same, minus the chevron rotation.

**H11. Final CTA (charcoal).**
- Concept: the script's last image: the yacht sails off into open ocean, with the line "Be the Architect of Your Future" [Script, 1:15-1:30].
- Layers: IMG-18 (dusk water texture) as a full-bleed background drifting horizontally at 0.4 px per 100 px scrolled, at most 24 px total travel; IMG-03 (yacht departing) on larger screens at the right side, `curtain` reveal from the right.
- Beat 1: the headline `mask-lines`. Beat 2: `DrawRule` center. Beat 3: the two buttons `rise` together.
- The tagline "Be the Architect of Your Future" already exists in the hero title, so repeat it here only as a small eyebrow, not as a second headline.
- Mobile: IMG-03 becomes the section background at 25% strength; no drift.
- Reduced motion: static image, final text.

### 6.2 About `/about`

Blocks today: hero, "video" panel, philosophy, vision, origin, leadership preview, CTA [Code].

**A1. Hero.** Locked.

**A2. Cinematic panel (currently `VideoHero`).**
- Defect: no video source and a duplicate poster (F11). Decision needed from the owner (section 12): supply a real clip, or convert the block into a still-image panel.
- If a clip exists: keep play/pause on visibility; add a `curtain` reveal (clip-path inset from the bottom, 1100 ms) and a title that `mask-lines` in after 300 ms. Apply a 1.06 to 1.0 settle on the poster only. Provide a visible pause control if the clip loops longer than 5 seconds (WCAG 2.2.2).
- If a still: IMG-05 (teak and brass raking light) with `Parallax` +/-5% and the same title treatment.
- Mobile: no parallax; poster only unless the user taps play.
- Reduced motion: poster only, video not started (already how `VideoHero` behaves).

**A3. Philosophy (quote + "Independence With Infrastructure").**
- Concept: the quote is the thesis; set it as typography.
- Beat 1: the quote `mask-lines`, one line at a time, 120 ms apart, with a large closing quotation glyph that fades in last.
- Beat 2: right column `rise`; `DrawRule` under the heading.
- Replace the generic `left`/`right` slide-ins.
- Existing issue: `.quote` is `position: sticky` (`about/page.module.css` 29-30), but its `RevealOnScroll` wrapper `<div>` contains only the blockquote, so the wrapper is exactly as tall as the quote and the sticky has no range to travel in [Inferred from structure; not measured in a browser]. To make the quote actually pin while the right column scrolls, the sticky element must sit in a taller parent (the `.philosophy` grid cell), which means the reveal wrapper has to go inside the sticky element, not around it.
- Mobile / reduced motion: quote `veil`; same text.

**A4. Vision (champagne band).**
- Quiet. `DrawRule` center, headline `mask-lines`, paragraph `veil`.
- Ambient: IMG-04 (sunrise over a superyacht bow, wide band) behind the heading under a champagne wash, `Parallax` +/-4%. On mobile, IMG-19 (ivory linen) replaces it as a static texture.

**A5. Origin spread (margin + body).**
- This is the longest copy block on the site; keep it calm.
- Beat 1: the left margin (label, h2, rule) is already `position: sticky` on desktop (`about/page.module.css` 72-75, switched to static under 1023 px and under reduced motion) [Code]. Keep it. Do not wrap the margin in a transformed element, and do not wrap the whole spread in one reveal wrapper, or the sticky containing block changes.
- Beat 2: body paragraphs `veil` in sequence on entry, 90 ms apart.
- Mobile: no sticky; paragraphs `veil`.
- The `{/* REPLACE: Final founding narrative pending client review */}` comment is in this section; do not finalize motion around copy that is still pending.

**A6. Leadership preview.**
- Same treatment as H9. The founding-principle callout `veil`s in before the portrait. Use `Stagger` on the founders grid (F1: with one founder the grid has one child, so this reduces to a single reveal).

**A7. CTA.**
- Same as H11 with IMG-06 (balcony at marina) replacing IMG-03 to echo script scene 2 (waterfront condo overlooking the marina) [Script, 0:15-0:35]. Do not repeat the home CTA composition.

### 6.3 Services `/services`

Blocks today: hero, "What Services Does YBS Provide?" answer block, four chapters, CTA [Code].

**S1. Hero.** Locked.

**S2. Answer block (AEO text).**
- Quiet `veil`. This copy exists for search and answer engines; keep it in the HTML in full, never behind a trigger. `DrawRule` center.

**S3. Four chapters (signature moment of this page).**
- Concept: four rooms of one building. Each pillar is a "chapter" with a large numeral, a title, a description, a feature list, and a photograph.
- Today all four chapters sit inside a single `RevealOnScroll`, so they reveal as one block (F7 risk). Each chapter becomes its own `<ScrollScene>`.
- Per chapter, on scroll entry:
  - Beat 1: the numeral (01-04) draws in via `clip-path` from the bottom, 700 ms, in champagne-gold at a large optical size.
  - Beat 2: image `curtain` from the side opposite the text (alternating left/right), 1000 ms, with an inner `Parallax` +/-6%.
  - Beat 3: title `mask-lines`, description `veil`, features `Stagger` (90 ms, max 6).
- Image refs: 01 Brand & Marketing: IMG-07; 02 Business Operations: IMG-08; 03 CRM & MLS: IMG-09; 04 Transaction & Closing: IMG-10.
- A thin progress rail on the left (desktop only) fills 0 to 100% across the four chapters, showing position. It is decorative (`aria-hidden`), driven by `useScroll` on the list.
- Mobile: image above text, no alternation, no parallax, no rail. Each chapter `rise`.
- Reduced motion: all chapters final state.
- Accessibility: each chapter is already an `<article>` with an `<h3>`; keep the heading order. Images use meaningful `alt` text describing the subject (not "decorative"), except where the image is pure ambience (then `alt=""`).
- Pillar 04 uses the line from the page copy: "Contract production and KYC support / Survey coordination and haul-out scheduling / Basic legal services and documentation / Closing support" [Code, `services.ts`]. Do not paraphrase these claims in the motion layer.

**S4. CTA.** Same family as H11, using IMG-18 (dusk water) only, so IMG-03 stays unique to the home page.

### 6.4 The YBS Difference `/the-ybs-difference`

This is the only route where traditional-brokerage comparison is allowed. Blocks today: hero, comparison table, "Can brokers keep their own brand" answer, four impact cards, "How do commission tiers work" answer, tiers, CTA [Code].

**D1. Hero.** Locked.

**D2. Comparison table (signature moment of this page).**
- Concept: a reading, not a fight. Three or four rows of fact; the YBS column is the answer.
- Rows today [Code, `difference.ts`]: Commission Split (50/50 to 70/30 vs 90/10 or 75/25), Autonomy & Brand, Operational Support, Monthly Overhead. Do not alter figures or wording in the motion layer.
- Beat 1: `DrawRule` across the header row (900 ms).
- Beat 2: rows reveal one at a time as they cross 55% of viewport height, driven by per-row `Reveal` (not one wrapper). The Traditional cell settles at 55% opacity; the YBS cell rises to full opacity and gains a 2 px gold left rule that draws in (400 ms). The contrast comes from emphasis on the YBS column, not from animating the traditional column away.
- Beat 3: the commission-split numerals in the YBS cell run `Counter` once.
- Hover (fine pointer): the row's background warms by one step; no movement.
- Mobile: the component already renders cards below the table breakpoint; use the same row-by-row reveal on cards.
- Reduced motion: final state.
- Do not use red/negative styling or "X" iconography on the traditional column. The tone is factual.

**D3. "Can brokers keep their own brand" answer block.** Quiet `veil`. Full text stays in HTML.

**D4. Impact cards (More Earnings / Your Brand / Your Way / Predictable Costs).**
- `Stagger` fixed to target the four cards individually (F1).
- Each card's `GoldRule` becomes a `DrawRule` that draws 200 ms after its card lands.
- Hover (fine pointer): card lifts 3 px, rule extends from 32 px to 56 px, 180 ms.
- Mobile: single column, same stagger. Reduced motion: final state.

**D5. "How do commission tiers work" answer block.** Quiet `veil`. This text states $3,000 per month at 90/10 and $1,500 per month at 75/25, matching `tiers` [Code]. Keep full text in HTML.

**D6. Tier cards.**
- Reuse H6 choreography (curtain, counters, one sweep) for consistency. A page with a tier block should not invent a different treatment.
- Background: the same IMG-02, no new asset.

**D7. CTA.** Same family as H11, with IMG-11 (an independent broker's private office, marina visible through glass) as a right-side image that `curtain`s in. Copy: "Ready to Make the Switch?" stays.

Imagery note for this page: the traditional side is not photographed. A caricatured corporate office would be unflattering stock and invites a legal read; the typographic table makes the point on its own.

### 6.5 How It Works `/how-it-works`

Blocks today: hero, "How Does YBS Work?" answer, three-step process rail, eleven deliverables, tiers, CTA [Code].

**W1. Hero.** Locked.

**W2. Answer block.** Quiet `veil`.

**W3. Three-step process (signature moment of this page).**
- Concept: the architect's three strokes as a vertical timeline. The page already renders `StepCard rail`, which means a vertical rail variant exists in CSS; the build adds the drawing.
- Pin: none. Desktop uses a two-column layout: the rail on the left (sticky for the section's height), step content scrolling on the right. Mobile: rail on the left edge of the cards.
- Scrub: one `useScroll` over the process list. A 1 px gold line fills 0 to 100% as the section scrolls; each numeral (01, 02, 03) lights (opacity 0.25 to 1, plus a ring draws around it) when the line reaches it.
- Each step has a photograph that `curtain`s in on its side: Step 1 IMG-12, Step 2 IMG-13, Step 3 IMG-14.
- Mobile: 4:5 images stacked above text; line along the left; ring draws are instant.
- Reduced motion: line full, numerals lit.
- This is the same rail logic as H8 on the home page; one component, two layouts.

**W4. Eleven deliverables.**
- Concept: a checklist being completed. Eleven items is a lot; do not animate them all identically.
- Beat 1: the heading and rule.
- Beat 2: items reveal in two groups of 5 and 6 as each group enters, within the group by 60 ms (shorter step because the list is long). Each numeral (01-11) tints from ivory to gold as its row crosses the 60% line.
- No bullets bounce or check-mark confetti.
- Items are copy from `deliverables` [Code]; the list includes "One AI-generated video monthly featuring you or one of your listings". Keep wording exactly.
- Mobile: same, groups of 4. Reduced motion: final.

**W5. Tiers.** Reuse H6.

**W6. CTA.** Same family as H11. Use IMG-18 (dusk water) only. IMG-03 (yacht departing) is reserved for the home CTA so it stays a unique payoff.

### 6.6 Leadership `/leadership`

Blocks today: hero, founder block(s), founding principle, CTA [Code]. One founder (Kent) is in the data [Code, `leadership.ts`].

**L1. Hero.** Locked (this route has a hero video).

**L2. Founder profile.**
- Concept: a person introduced with respect, not a stage entrance.
- Beat 1: portrait `curtain` from the left, 1000 ms; subtle settle 1.04 to 1.0.
- Beat 2: role (eyebrow), name `mask-lines`, a short `DrawRule`, bio `veil` with 120 ms offsets.
- Today the layout alternates left/right per founder (`i % 2`) and uses `left`/`right` reveals. With one founder the alternation never shows; keep the logic for later additions but drop the slide-in.
- Image: the existing `/kent.png` is the real founder portrait and stays. IMG-15 is an environmental backdrop (blurred marina bokeh), not a replacement portrait; it sits behind the portrait at 100% blur so it adds atmosphere without a second face. Never generate or composite a likeness of the founder.
- Mobile: portrait full-width above text, no settle. Reduced motion: final.

**L3. Founding principle.**
- Concept: the single most important line on the site, treated as a pull quote.
- Beat: the quote is split per line (`mask-lines`), 120 ms apart; the opening quote glyph draws first at 0.6 opacity. No parallax, no background image. Silence is the effect.
- Source line: "I didn't build YBS to compete with brokers. I built it to empower them..." [Code, `leadership.ts`]. Do not edit.

**L4. CTA.** Same family as H11, IMG-18 only.

### 6.7 FAQ `/faq`

Blocks today: hero, category nav + categories with accordions, CTA [Code, `faq/page.tsx`].

**Q1. Hero.** Locked.

**Q2. Category navigation and accordions.**
- Concept: wayfinding that feels fast and precise.
- The side nav (`faqNav`) links to `#category` anchors. Add: the active category's link gets a gold underline that slides between links (a single absolutely positioned pseudo-element transformed with `translateY`, 300 ms), driven by an IntersectionObserver on category headers.
- Anchor jumps use the existing smooth scroll and `scroll-padding-top` [Code].
- Category headers: `EyebrowLabel` `veil`, `DrawRule` draws. Accordions: `Stagger` of rows only on first entry per category, so the page does not become a wall of simultaneous motion (each category has several items; cap at 6).
- Open/close: same native `<details>`, with the chevron rotation and the CSS height transition where supported (see H10).
- Because FAQ content feeds `FAQPage` JSON-LD (via `faqPageJsonLd`) [Code], visible text must continue to match structured data. Do not hide answers behind JS.
- Mobile: nav becomes a horizontally scrolling chip row with `overscroll-behavior-x: contain` (already in `.scroll-x`); active chip auto-scrolls into view.
- Reduced motion: no underline slide, instant active state.

**Q3. CTA.** Same family as H11, IMG-18 only.

### 6.8 Insights `/insights`

Blocks today: hero, featured article + two-card index, three resource cards, CTA [Code, `insights.ts`]. All three articles are "Coming Soon" placeholders; all three resources are not yet available [Code].

**I1. Hero.** Locked.

**I2. Featured article and index (editorial masthead).**
- Concept: a magazine front page. Large featured card with a photograph; two smaller cards beside it.
- Today `InsightCard` has an `.image` box that only contains a tag; there is no photograph [Code]. Images: featured IMG-16, index IMG-17 and IMG-20 (all abstract and non-literal so they can carry any headline).
- Beat 1: the featured card `curtain`s from the left; its image has a slow `Parallax` +/-5%.
- Beat 2: the two index cards `rise` 120 ms apart.
- Hover (fine pointer): image scales 1.03 over 700 ms (clipped by the card), the "Read More" arrow translates 4 px. Cards with `placeholder: true` have no link, so they get no hover affordance and no arrow, to avoid implying a destination that does not exist.
- Date shows "Coming Soon" for every post; motion cannot fix that. The page will read as unfinished until at least one article is real; flagged in section 10.
- Mobile: single column; no parallax. Reduced motion: final.

**I3. Resources (champagne band).**
- `Stagger` fixed to target the three cards (F1). Each card's "Coming Soon" badge is static. Because all three are unavailable, do not give the cards hover lift or any "clickable" cue.

**I4. CTA.** Same family as H11, IMG-18 only.

### 6.9 Contact `/contact`

Blocks today: hero, two-column form + sidebar [Code, `contact/page.tsx`]. Only one section below the hero.

**C1. Hero.** Locked.

**C2. Form and sidebar.**
- Concept: privacy and calm. "Confidential" is the word the page repeats; the motion should feel like closing a door gently.
- Beat 1: the two columns `veil` together (no slide), with the sidebar 150 ms later.
- Form interactions (micro, 180 ms): label rises and shrinks on focus or when filled; the input's bottom border draws from the left to full width on focus (`scaleX`); error text fades in and the field gets a 2 px red-brown left rule, with `aria-describedby` and `role="alert"` already present [Code]. No shake animation.
- Submit: the button label changes to "Sending..." (exists) and shows a small progress hairline along its bottom edge (indeterminate, 1200 ms to match the placeholder wait). On success the form fades to the "Message Sent" panel with a check that draws (stroke dash with `pathLength="1"`), 600 ms. The panel is `role="alert"` already.
- Sidebar: the email and "Available worldwide" rows `Stagger`; the "Schedule a Call" button gets the standard hover.
- Image: optionally IMG-06 (waterfront balcony) at the top of the sidebar as a 16:10 still with `curtain`. If the owner wants no imagery on a confidentiality page, omit it; the page stands without it.
- Mobile: single column; form first. Reduced motion: no line draws; instant state changes.
- Not verified: the `Schedule a Call` button points to `#` with a `REPLACE` comment and the submit handler is a mocked 1.2 s wait [Code]. Motion work must not make these look finished; flagged in section 10.

---

## 7. Signature moments versus quiet rhythm

A luxury feel comes from contrast: a few deliberate set pieces inside long stretches of stillness. Six signature moments are proposed for the whole site. Everything else is quiet.

### 7.1 The six signature moments

| # | Moment | Route | Idea | Cost |
|---|---|---|---|---|
| 1 | The assembling ecosystem | `/` | Hub, ring, four pillars, and lines resolve on a pinned scroll | Medium (rebuild of existing section) |
| 2 | The two numbers | `/` and `/the-ybs-difference` and `/how-it-works` | Tier cards curtain in; 90 and 75 count; one light sweep | Low (shared component) |
| 3 | The four chapters | `/services` | Numeral draws, photograph unveils, features cascade, per chapter | Medium |
| 4 | The reading table | `/the-ybs-difference` | Rows read one at a time; YBS column gains a gold rule and counts | Low |
| 5 | The three strokes | `/` and `/how-it-works` | A gold line draws through three steps and lights each numeral | Medium (one component, two layouts) |
| 6 | The departure | `/` (final CTA) | Dusk water drifts, the departing yacht unveils, the closing line sets | Low (one image, one clip-path) |

Limit: no page carries more than two. Home has 1, 2, 5, 6 (four moments) over eleven blocks; this exceeds the limit and is the first thing to cut if effort is tight. Recommended: on the home page keep 1, 2, and 6; make 5 a quiet version (line draws, no photographs) and let the How It Works page own the full version.

### 7.2 Quiet rhythm (everything else)

The default for any block not listed above:

1. Heading: `mask-lines` (or `veil` for short labels).
2. `DrawRule`.
3. Body: `veil` or `rise` with `Stagger` for lists, max 6 items.

That is three beats and under 1.5 seconds end to end. If a block needs more than that, it is a candidate for a signature moment and must justify its place against the cap.

### 7.3 Pacing map for the home page (what the visitor feels, in order)

1. Loader and hero (locked).
2. Stat strip: short, confident read-out.
3. Narrative: two voices, one gold line between them.
4. Ecosystem: the long, pinned set piece (peak 1).
5. What You Get: stillness, a list.
6. Tiers: second peak, small and exact.
7. How it works: a gentle line (quiet version).
8. Leadership: a portrait, no tricks.
9. FAQ: stillness.
10. Final CTA: the departure (peak 3), then the footer.

Peaks at 4, 6, 10 with quiet blocks between them. That ratio (three peaks in ten blocks) is the target.

---

## 8. Cross-cutting design

### 8.1 Header

The header sits over every hero, so it is protected by guardrail 5. Allowed changes:

- Replace per-frame `setProgress` React state with a Motion value or a ref-driven `transform: scaleX()` write, so the nav stops re-rendering on every scrolled frame (F10). Visible output is identical.
- Keep the 24 px threshold for the `scrolled` style.
- Add nothing else (no hide-on-scroll-down; it would change the hero's header contract).

### 8.2 Route transitions

Next 16 documents React `<ViewTransition>` for page-to-page transitions [Code: `view-transitions.md`]. For this site:

- Use a short crossfade on `<main>` content only (180-240 ms), not on the header or footer, so the persistent chrome does not flicker.
- Do not transition the hero. Its video and poster must load and play exactly as they do now; a view transition that snapshots the old hero would hold stale frames and could interact with the loader gate (`useBrandLoaderGate` plays the intro on every full load; client-side route changes do not replay it [Code]). If a hero is ever included in a transition, treat it as a change to a protected component and get approval.
- Because React's integration needs a modern browser and the docs state the app works normally without support [Code: docs note], this is a safe progressive enhancement.
- Not verified: how `ViewTransition` interacts with the existing `Header` `usePathname` effects and `body.style.overflow` handling in the mobile menu. Test before enabling.
- Priority: low (section 11, phase 5). Per-section choreography matters more.

### 8.3 Micro-interactions (fine pointer only unless stated)

| Element | Behavior | Time |
|---|---|---|
| Primary button | Existing hover stays; add a gold hairline that draws under the label on hover | 180 ms |
| Ghost button | Underline draws from left on hover | 180 ms |
| Text links in body | Underline offset animates 2 px | 180 ms |
| Cards | 3-4 px lift, border to gold-500 (explicit properties, not `all`) | 180 ms |
| Header links | Active route has a 1 px gold underline that persists | 180 ms |
| Form inputs | Label float, bottom-border draw (6.9) | 180 ms |
| FAQ chevron | 180 degree rotation | 180 ms |
| Focus | `:focus-visible` ring in gold with 2 px offset, never removed. Applies to touch and keyboard. | none |

Touch devices get no hover motion; tap states use a 90 ms opacity dip.

### 8.4 Loading and empty states

- Skeletons are not needed: all pages are statically rendered content (no client fetches were found in `src`).
- The not-found page (`not-found.module.css` exists) can reuse `DrawRule` and `mask-lines`; low priority.

### 8.5 Sound

None. Auto-playing audio contradicts the discreet audience and the "no autoplay" rule for accessibility.

---

## 9. Mobile, accessibility, reduced-motion, and performance constraints

These apply to every item in sections 5 to 8. Where a number appears below, it is a proposed target, not a measured baseline (see section 1: no baseline exists yet).

### 9.1 Reduced motion contract

The existing contract is kept and extended [Code]: a global CSS override, `usePrefersReducedMotion` (hydration-safe), and video pausing.

1. Under `prefers-reduced-motion: reduce`, every new primitive renders its **end state with no transition**. It does not shorten the animation; it removes it.
2. Opacity-only fades of 180 ms or less may remain for state feedback (focus, hover, open/close). Nothing translates, scales, clips, parallaxes, pins, or counts.
3. Scroll pinning (H4) is replaced by a normal static layout. A pinned stage is a motion effect, not just a layout.
4. `Counter` renders the final number immediately.
5. Videos that are not heroes never autoplay under reduce (already how `VideoHero` behaves).
6. The preference is read live (`matchMedia` change listener), so toggling the OS setting mid-session takes effect without reload.
7. Test both states for every route. A route is not done until its reduced-motion screenshot equals the "final state" of its full-motion run.

### 9.2 Mobile

Targets: 390x844 as the reference phone, 768 as the tablet break, 1024 as the orbit/pin break (matches the existing ecosystem break) [Code].

| Concern | Rule |
|---|---|
| Hover | No hover-only information or motion. Hover styles live inside `@media (hover: hover) and (pointer: fine)`. Touch gets a 90 ms opacity dip on press. |
| Parallax | Off below 768 px. It costs a scroll-linked transform per image for a depth cue that is barely visible on a small screen. |
| Pinned scenes | Off below 1024 px. Pinned stages interact badly with the dynamic mobile address bar (`100vh` changes during scroll). Use `100svh` for any full-height stage and test on a real iOS device (emulation does not reproduce this). |
| Simultaneous motion | At most 3 animating elements in view on phones (6 on desktop). |
| Clip-path reveals | Allowed, but replaced by `rise` on phones for any image taller than 60% of the viewport, because large clip repaints are the most expensive effect in this system [Inferred]. |
| Counters | Only the first stat in a group counts on phones. |
| Tap targets | 44x44 px minimum (accordion rows, FAQ chips, header menu) [WCAG 2.5.8 sets 24 px; 44 is the platform guideline]. |
| Sticky | `position: sticky` margins already switch to static below 1023 px in About [Code]; keep that pattern. Never add `transform` to an ancestor of a sticky element. |
| Orientation | Landscape phones (about 844x390) are shorter than most desktop breakpoints assume. Pin heights use `min(220vh, 1800px)` and are tested at 844x390. |
| Video | No new video is proposed for any page. Hero videos are locked. |

### 9.3 Accessibility

This section lists design constraints. It is not a WCAG conformance claim. Conformance needs manual testing with assistive technologies (screen reader on iOS and desktop, keyboard only, zoom to 400%) and an expert review.

1. **Content is never gated on motion.** Server HTML is the finished state. Hidden pre-states exist only after hydration and only when motion is allowed (5.2). Search engines, screen readers, and no-JS users get the full text. This also protects the AEO answer blocks and FAQ JSON-LD [Code].
2. **No reading order changes.** Splitting headlines into lines for `mask-lines` must keep a single accessible name: the heading gets the full text in its `aria-label` or the visual spans are `aria-hidden` with a visually hidden full string. Screen readers must not announce fragments.
3. **Counters** expose the final figure to assistive tech (`aria-label` on the element) and never announce intermediate values (`aria-live` is off).
4. **Pause, stop, hide (WCAG 2.2.2).** Any motion that starts automatically, lasts more than 5 seconds, and runs alongside other content needs a way to stop it. Scroll-driven motion is user-controlled and exempt. The only auto-running items are the locked hero videos and a possible About clip (A2), which gets a visible pause control.
5. **Flashing (WCAG 2.3.1).** Nothing flashes. `LightSweep` is a single slow low-contrast pass.
6. **Focus.** `:focus-visible` rings are never removed. Pinned and sticky regions must not hide focused elements behind them (WCAG 2.4.11, focus not obscured); verify tabbing through H4 and the FAQ nav.
7. **Anchor jumps** keep `scroll-padding-top` for the sticky header [Code]. A reveal must not change the position a link lands on: reserve space, never animate layout.
8. **Contrast.** Gold on ivory is the highest risk pairing in this palette. Hairlines and decorative numerals are exempt from text contrast, but any gold text must meet 4.5:1 (3:1 for large text). Measure the actual token values before use; this document did not measure them.
9. **Images.** Informational images get specific `alt` text; ambient images get `alt=""`. Images in motion keep their `alt` while clipped.
10. **Zoom and text size.** Layouts must hold at 200% text size and 400% zoom without a reveal leaving content permanently hidden. A reveal that depends on viewport height can mis-fire when zoomed; the `rootMargin` observer in 5.2 does not depend on element height for this reason.
11. **Keyboard parity.** Anything that reveals on hover reveals on focus.

### 9.4 Performance

No baseline exists, so these are budgets to be checked against a measured "before" (step 0 of section 11).

| Budget | Target | Why |
|---|---|---|
| Added client JS for motion | 12 KB gzip or less over today's bundle | `motion` is already shipped; primitives are small [Inferred, unmeasured] |
| Long tasks during scroll | none over 50 ms | Scroll jank is what the audience will notice first |
| INP | 200 ms or less at p75 | Google's published "good" threshold |
| CLS | 0.1 or less | Reveals must not move layout; images carry explicit dimensions |
| LCP | No regression | Heroes are locked; new images are below the fold and lazy |
| Compositor layers | `will-change` only while animating, removed after | Fixes F8 |
| Image weight | See the delivery spec in the art direction doc; AVIF/WebP via `next/image` | Largest risk to page weight |
| Animated properties | `transform`, `opacity`, and `clip-path` only | No layout or paint-heavy properties (rule 5.3.5) |

Concrete rules:

1. Scroll-linked work uses Motion values written directly to the DOM, not React state. No `setState` on scroll (also fixes F10).
2. One `IntersectionObserver` per primitive type, shared across instances, rather than one per element (today: one per `RevealOnScroll`, 56+ on the site).
3. Observers disconnect after firing, except the ones that must stay live (FAQ active category, ecosystem progress).
4. New images use `next/image` with explicit `sizes`, `loading="lazy"`, and a blur or dominant-color placeholder so the reveal never starts on a blank box. Read the Next.js image docs in `node_modules/next/dist/docs/` before wiring this, as required by `AGENTS.md`; this version may differ from older releases.
5. Existing weight to be aware of (not to be changed here): the three home hero videos total about 79 MB on disk (30.4 + 19.9 + 28.8 MB), and `kent.png` is 2 MB [Code, file sizes]. The hero videos are locked. `kent.png` is not on the protected list, but it is the real founder portrait; any re-encode needs owner approval and a visual check.
6. Do not add `three`, `@react-three/fiber`, or `@react-three/drei` usage. They are installed and unused in `src` [Code, grep]; removing them from `package.json` would cut install and audit surface, and is a separate, optional clean-up that needs approval because it changes dependencies.
7. Test on a throttled profile (4x CPU slowdown, Fast 4G) and on at least one mid-range Android device. The audience is likely on recent iPhones and Macs, but a luxury effect that stutters reads as cheap on any device.

### 9.5 Browser support

| Feature | Use | Fallback |
|---|---|---|
| `IntersectionObserver`, `clip-path: inset()`, `transform`, `opacity` | Core | Content visible, no motion |
| `position: sticky` | Core | Static layout |
| CSS `animation-timeline: view()` | Optional later optimization (5.3.3) | Observer-based reveal |
| React `<ViewTransition>` | Optional route polish (8.2) | Normal navigation |
| `interpolate-size` / `::details-content` | FAQ height animation (H10) | Native snap |

Support figures for scroll-driven animations were re-checked on 2026-10-26: Chrome/Edge 115+, Safari 26+ (macOS and iOS) have it, and Firefox 159 is listed with support but its release date is 2026-10-27, one day after this document. Treat Firefox as "arriving" and keep the fallback path regardless [Web: caniuse, Baseline timeline]. Support for `interpolate-size` and `::details-content` was not re-checked in this session; verify before relying on them.

---

## 10. Content and brand flags found during the audit

None of these were changed. They are listed because motion makes copy louder: an animated claim that is wrong or inconsistent is worse than a static one. Each needs an owner decision (collected in section 12). Evidence tags show where each came from.

| # | Flag | Evidence | Why it matters to this work |
|---|---|---|---|
| B1 | **Tier names differ between the scripts and the site.** The Detailed Explainer script calls the tiers "Cannes" ($1,500/month, 75%) and "Monaco" ($3,000/month, 90%). The site calls them "Standard Tier" and "Premium Tier" with the same prices and splits. | [Script] vs [Code: `difference.ts`, `faq.ts`] | The tier cards are signature moment 2. Naming must be settled before the numerals and labels are choreographed. Prices and percentages agree; only names differ. |
| B2 | **Contract term.** The Detailed script says the initial term is 24 months, renewing for successive 12-month periods, with 60 days' notice of non-renewal. The site says "Annual commitment, billed monthly" on both tiers and "choose your tier annually". | [Script] vs [Code: `difference.ts`, `faq.ts`] | These cannot both be right as written. A 24-month initial term is a material fact for a prospect. The legal comment `REPLACE: Legal review required` already sits on the Difference page [Code]. |
| B3 | **"No hidden fees" versus listed extra costs.** The site says dues cover the "full suite" with "no hidden charges". The script says brokers or their clients also pay for non-digital marketing (magazine ads, banners, print, boat shows, premium promotions), and that deal fees are collected through escrow at closing. | [Code: `faq.ts`] vs [Script] | Counting up a "predictable costs" card is a strong visual claim. It should be backed by wording that does not contradict the script. |
| B4 | **Leaving the platform.** The final script says "your portfolio goes with you. No anchors. No obligations." The Detailed script says IP and marketing materials are released after the initial 24-month term, "subject only to the restrictions outlined in the detailed terms". | [Script] vs [Script] | Do not put "No anchors. No obligations." on screen as a motion headline until legal confirms it is consistent with the agreement. |
| B5 | **Exclusivity and licensing requirements are not on the site.** The Detailed script says members must conduct all brokerage and charter activity through the platform and hold a yacht broker's license (or be licensed under an Employing Broker). No search of `src` found either statement. | [Script]; [Code: grep for exclusivity, licence, employing broker returned nothing relevant] | Not a motion issue, but the "full autonomy" message sits next to an exclusivity term. Owner and counsel should decide how this is disclosed. |
| B6 | **Claims on the site that appear in neither script.** "One AI-generated video monthly featuring you or one of your listings" (services, how-it-works, faq) and "haul-out scheduling" are on the site. The scripts mention a personalized monthly newsletter, a brand kit, website creation, social media support, legal advice, contract templates, comps research and reports, survey and sea-trial support, and closing-document coordination. | [Code] vs [Script] | May well be real services described elsewhere. Confirm before building a showcase around them. W4 animates the eleven-item list that contains them. |
| B7 | **Comparison table on the home page.** The brand rule says traditional-brokerage comparisons belong only on `/the-ybs-difference`, but `page.tsx` renders `ComparisonTable` with "Traditional Brokerage vs. YBS" and a "Learn More About the Difference" button. | [Code: `page.tsx` 157-173] | Recommendation: remove the block from the home page and keep its link in the tiers area. This blueprint assumes it is removed (H7). Removing it is a content change and is not done here. |
| B8 | **"Most Popular" badge on Premium.** `TierCard` shows the badge for `featured: true`, which is Premium. Nothing in the repo or scripts supports "most popular". | [Code: `TierCard.tsx`, `difference.ts`] | An unsupported popularity claim. Consider "Maximum commission" or removing it. |
| B9 | **Domain and contact details are inconsistent.** The final script shows `www.yachtbroker.services`, a phone number, and a Fort Lauderdale street address. The site uses `yachtbrokerservices.com` for URL, email (`info@...`, marked `REPLACE: real email`), sitemap, robots, and metadata. Phone and address are not rendered anywhere in `src`. | [Script] vs [Code] | I did not verify which domain is live. The script's contact block was not confirmed by the owner; do not hard-code it into the closing CTA until confirmed. |
| B10 | **Unfinished pieces that motion could make look finished.** Contact: booking button goes to `#` and the form submit is a mocked 1.2 s wait. Insights: all three articles say "Coming Soon" and all three resources are unavailable. About: founding narrative marked pending client review, and the "video" has no source (F11). Structured data and analytics are `REPLACE` stubs. | [Code] | Polished motion on a non-functional form is a trust risk. Wire the real endpoint and booking link before shipping contact motion. |
| B11 | **Script has no company logo yet.** The final script says "Company Logo (we need one)". The site has `Logo.png` and an intro video. | [Script] vs [Code] | Informational. If a new logo appears later, `Logo.png` and the loader's assets are in the protected list and need approval to change. |
| B12 | **Typo in the Detailed script.** "Unted States" and "its'" appear in the script text. | [Script] | Mentioned so they are not copied into the site. |
| B13 | **Founder portrait.** `kent.png` is 2 MB at 1254x1254. It is the real founder photo [Code]. | [Code] | Any tighter crop or re-encode must be approved. Never generate his likeness (see the art direction doc, section 8). |

Brand invariants confirmed against the code: the headline numbers on the site (up to 90%, 75/25, 90/10, $1,500, $3,000) match the Detailed script. Retained commissions are described as 75-90% in the scripts and "up to 90%" on the site [Script; Code]. Client data ownership appears in the Detailed script ("you own all of your client data in its entirety") and in the CRM copy on the Services page ("Your private CRM keeps your data confidential") [Script; Code]. The two phrasings are not identical; the stronger ownership wording is not on the site.

---

## 11. Ranked implementation plan with acceptance criteria

Ordering logic: fix what is broken before adding anything, build the shared system once, apply it to the highest-traffic and highest-value pages first, and put the effects with the most risk or the least payoff last. Effort sizes are relative (S under 1 day, M 1-3 days, L 3-5 days) and are my estimates, not measured.

Every phase ends with the **global gate** (11.7). A phase is not done until its own criteria and the global gate both pass.

### 11.1 Phase 0 (priority P0): baseline and safety net. Size S

Nothing visual changes.

1. Capture a performance baseline for `/`, `/services`, `/the-ybs-difference` on desktop and a throttled mobile profile: LCP, CLS, INP (or a scripted interaction proxy), total JS, long tasks during a scripted scroll.
2. Add the hash check from 4.4 to CI, covering the protected files and the three frozen blocks of `globals.css`.
3. Capture hero screenshots (1440x900, 1024x768, 390x844, `?noloader`) for all nine routes as the visual reference.
4. Capture a loader recording (frame-by-frame timing) as the reference for the locked loader.

Acceptance:
- Baseline numbers stored in the repo or the ticket, with the device/profile used.
- CI fails if any protected hash changes (test by changing a byte in a branch).
- Screenshots exist for all nine routes at three sizes.

### 11.2 Phase 1 (P0): repair defects with no new design. Size M

Fixes F1-F6, F9, F10 where they stand, before any new language is added. These are bugs that a visitor can see today.

| Item | Change | Defects |
|---|---|---|
| 1a | Rebuild `ServicesEcosystem` positioning (static wrapper vs animated inner), `pathLength="1"` on lines, derived endpoints, four pillars, inline SVG icons, sentence-aware descriptions | F2-F6 |
| 1b | `TierCard` explicit transition properties | F9 |
| 1c | `Header` progress via Motion value or ref; same visuals | F10 |
| 1d | Make stagger target the actual cards (temporary fix in the pages, using the new primitive from phase 2 if ready) | F1 |

Acceptance:
- At 1440, 1280, and 1024 px: hub center is within 2 px of the container center; each node's center is within 2 px of its design coordinates; each line starts inside the hub border box and ends inside its node border box (measured with `getBoundingClientRect`).
- `getComputedStyle(line).strokeDashoffset` goes from 1 to 0 across the animation range and `strokeDasharray` is `1`; a screenshot at 50% progress shows a partial solid line, not dots.
- Four pillars render at every width. No text equals an icon name.
- The header re-render count during a 2-second scroll is 0 for `Header` children (React Profiler), and the progress bar still reaches full width at page bottom.
- Hero screenshot diff is zero for all nine routes (Header change must be pixel-identical in the hero region at scroll 0).

### 11.3 Phase 2 (P1): the motion foundation. Size M

Add `src/components/motion/` and `--m-*` tokens: `Reveal`, `Stagger`, `DrawRule`, `ScrollScene`, `Parallax`, `Counter`, `LightSweep`, plus `motion-tokens.ts`, the `data-m` inline script, and a small test page or Storybook-style route (dev only) that shows each primitive in all states.

Acceptance:
- With JavaScript disabled, a page using each primitive renders all content visible (verified by disabling JS in the browser and by `curl` of the server HTML).
- With `prefers-reduced-motion: reduce`, no primitive applies a transform or a transition longer than 180 ms (verified by a script that reads computed styles after load).
- `will-change` is absent from every element 100 ms after its transition ends.
- One observer per primitive type (verified by wrapping `IntersectionObserver` in a test and counting constructions).
- The 4.4 hashes still match; `RevealOnScroll.tsx` and legacy `.reveal*` CSS are byte-identical.
- Unit tests for `Counter` (final value in markup, `aria-label` present) and `Reveal` (end state under reduced motion).

### 11.4 Phase 3 (P1): the three highest-value pages. Size L

Order: Home, then The YBS Difference, then Services. These carry the main message, the numbers, and the four pillars.

| Item | Spec | Signature moment |
|---|---|---|
| 3a Home H2-H3, H5, H6, H8-H11 | Section 6.1 (without H4, done in phase 1 and extended here) | 2 (tiers) |
| 3b Home H4 pinned assembly | Section 6.1 H4 progress map | 1 |
| 3c Difference D2-D7 | Section 6.4 | 4 |
| 3d Services S2-S4 | Section 6.3 | 3 |
| 3e Remove the home comparison table (if owner approves, B7) | Section 10 | none |

Acceptance (per page):
- Every block uses at most the three beats in its spec; the total entrance for any block is 1.5 s or less, except the five named signature moments.
- No page has more than two signature moments in view at once; the home page has no more than three in total (7.1 recommendation).
- Counters end on exactly the brand figures (90, 75); the "up to" wording remains.
- Text content (all words and numbers) is byte-identical to before; verified by diffing extracted `innerText` pre and post.
- Reduced motion run equals the full-motion final state (screenshot diff within 0.1%).
- Image slots render with a placeholder when the asset is missing (build never blocked on art).
- Phone profile: no dropped-frame cluster longer than 100 ms in a scripted scroll (trace); no layout shift above 0.1 in total.
- Brand rule check: no traditional-brokerage comparison outside `/the-ybs-difference`.

### 11.5 Phase 4 (P2): remaining pages. Size M

How It Works (W2-W6, with the shared rail also reused by home H8), About (A2-A7), Leadership (L2-L4), FAQ (Q2-Q3), Insights (I2-I4), Contact (C2).

Acceptance:
- Same criteria as 11.4, plus:
- FAQ: `FAQPage` JSON-LD output is unchanged, answers remain in the DOM when closed, the active-category indicator follows scroll with at most one observer and no scroll listeners.
- Contact: all micro-interaction states reachable by keyboard; error messages still announced (`role="alert"` exists in the form) [Code]; no state suggests a working submission until the real endpoint (B10) is wired.
- Insights: cards flagged `placeholder` have no hover or link affordance.
- About: if the A2 video decision is "still", no empty `<video>` element remains (F11).

### 11.6 Phase 5 (P3/P4): polish and optional work. Size M

Ranked lowest because they carry the most risk for the least gain:

| Item | Priority | Gate |
|---|---|---|
| Micro-interactions from 8.3 not already done | P3 | Hover only on fine pointers |
| `<ViewTransition>` crossfade for `<main>` (8.2) | P3 | Must be tested with the loader gate and mobile menu first; hero excluded |
| CSS scroll-driven animations as an optimization (5.3.3) | P4 | Only if a measured main-thread cost justifies it |
| Not-found page treatment (8.4) | P4 | none |
| Remove unused 3D dependencies (9.4.6) | P4 | Owner approval; separate PR |
| Retire `RevealOnScroll` for non-hero use | P4 | Never delete: the hero depends on it |

Acceptance:
- ViewTransition: back/forward and the mobile menu (scroll lock, `usePathname` effects) behave as before; no stale hero frame appears during or after a route change.
- Any dependency removal: `npm ls` and the build pass; nothing in `src` imports them (re-grep before removal).

### 11.7 Global gate (every phase)

1. Protected-file hashes (4.4) unchanged.
2. Hero screenshot diff zero on all nine routes at three sizes.
3. Loader recording matches the reference timing (same duration within frame tolerance) and the page is scrollable after it completes.
4. Production build passes; lint passes; type-check passes. The repo includes a Next.js version whose docs live in `node_modules/next/dist/docs/` and which `AGENTS.md` says differs from older releases, so read the relevant guide before using any framework API in a new primitive.
5. No console errors or hydration warnings on any route.
6. Reduced-motion and no-JS runs pass (9.1, 9.3.1).
7. Performance budgets (9.4) compared against the phase 0 baseline; regressions are explained or fixed.
8. Keyboard walk of the changed pages: all interactive elements reachable, focus visible, nothing hidden behind sticky/pinned layers.
9. Text content diff shows no unintended wording or number change.

---

## 12. Verification protocol and open decisions

### 12.1 How to verify each kind of change

| Check | Method |
|---|---|
| Layout correctness | `getBoundingClientRect` assertions at 1440, 1280, 1024, 768, 390 and 844x390 landscape |
| Motion happens | Poll computed `opacity`/`transform` at set times or progress values; do not rely on screenshots alone |
| Motion is smooth | Chrome performance trace on a 4x-throttled CPU; read long tasks and frame times |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` via DevTools and also set the OS setting once |
| No-JS | Disable JavaScript in DevTools; reload; read the full page |
| Heroes untouched | Hash check + screenshot diff (4.4) |
| Loader untouched | Hash check + timing recording; confirm `ybs-loader-active` is removed and `body` overflow restores |
| Real devices | At least one iPhone (Safari) and one mid-range Android (Chrome); emulation does not reproduce address-bar resize or thermal throttling |
| Accessibility | Keyboard-only pass; a screen reader pass on at least one platform; contrast measurement of any gold text; expert review before claiming conformance |
| Content integrity | Extract `innerText` per route before and after and diff |

### 12.2 What this document could not verify

- No performance numbers: no trace, Lighthouse, or INP/CLS baseline was captured.
- No real-device tests. Mobile claims come from 390x844 emulation and code reading.
- The visual content of existing stills was not assessed beyond dimensions and size.
- `Button`, `Footer`, `PageHero`, and `TierCard` styles were not fully audited; `PageHero` appears unused but that was not exhaustively proven.
- F11 (duplicate poster, no video source) comes from code and file hashes and was not confirmed by looking at the rendered page.
- The About sticky-quote issue (A3) is inferred from DOM structure and not measured.
- `interpolate-size` / `::details-content` support was not re-checked.
- Accessibility items are design constraints, not a conformance assessment.
- Gold-on-ivory contrast ratios were not measured.

### 12.3 Open decisions for the owner

| # | Decision | Options | Recommendation | Blocks |
|---|---|---|---|---|
| O1 | Tier names (B1) | Standard/Premium, Cannes/Monaco, other | Pick one and use it in site, scripts, and agreement | Phase 3 tier cards |
| O2 | Contract term wording (B2, B4) | Match the agreement (24 months then annual) or revise the site | Legal to confirm the exact wording before any animated claim | Phase 3 and 4 copy |
| O3 | Home comparison table (B7) | Remove, or keep and forgo motion | Remove; brand rule says Difference page only | Phase 3e |
| O4 | "Most Popular" badge (B8) | Remove, rename, or support with data | Remove or rename | Phase 3a |
| O5 | About "video" (F11) | Supply a real clip, or use a still | Still now (IMG-05); upgrade later | Phase 4 A2 |
| O6 | Contact confirmation (B9, B10) | Confirm phone, address, domain, booking link, form endpoint | Wire before shipping contact motion | Phase 4 C2 |
| O7 | Imagery on Contact (C2) | Include IMG-06 or none | None is acceptable; consider omitting on a confidentiality page | Phase 4 C2 |
| O8 | Services not in the scripts (B6) | Confirm or remove (AI video, haul-out) | Confirm they are real | Phase 3d, 4 W4 |
| O9 | Founder imagery | Real photoshoot (see art doc, section 8) | Commission one; do not generate | Phase 4 L2 |
| O10 | Home signature-moment count | Three (recommended) or four | Three | Phase 3 |
| O11 | Remove unused 3D packages | Yes / no | Yes, separately | Phase 5 |
| O12 | Dev-only motion test route | Allowed or not | Allowed, excluded from production build | Phase 2 |

### 12.4 Definition of done for the whole program

The program is done when all nine routes meet their section 6 specs, the six signature moments (or the approved subset) are live, the global gate passes on the final build, the open decisions are resolved or explicitly deferred in writing, and the protected hashes still match the Phase 0 values. Hero sections and the brand loader will then be exactly as they are today.

---

*End of blueprint.*
