# YBS Performance, SEO, AEO and GEO Audit

Audit date: 27 October 2026. Scope: the working tree at `c:\Yacht Broker Service` (Next.js 16.3.5, React 19.2.8, App Router, all nine routes statically prerendered).

Status: audit and plan only. No site code, media, hero section, brand-loader animation or motion file was changed. Nothing in this document has been implemented. Implementation waits for approval.

## How to read this report

- **[Measured]** a number produced by running a tool in this session (Lighthouse 12.8.2, HTTP requests, parsing rendered HTML, file system checks).
- **[Inspected]** read directly from source files or rendered HTML.
- **[Judgement]** expert opinion or arithmetic on measured figures, not a direct measurement.
- **[Unverified]** could not be tested here. The exact manual test is in section 11.
- No keyword volume, keyword difficulty, traffic, ranking or competitor performance figure appears in this report. None was available. See section 8.
- Lab scores come from one Windows machine testing `localhost`. They are indicative, not field data. Section 3 shows how much they vary between runs.
- The production build used for testing was made at 03:02. Five files (`Header.tsx`, `Header.module.css`, `Footer.tsx`, `Footer.module.css`, `globals.css`) were edited after it, between 04:12 and 04:23. Those edits are not in the measurements. Re-run before relying on any header or footer finding.

## 1. Scorecard

Scores do not reward a feature for existing. Each one reflects whether the feature works and what it achieves. The unweighted mean is 5.6. Treat it as a rough summary only, because the categories are not equally important.

| # | Category | Score | Realistic target | Confidence | Main basis |
| --- | --- | --- | --- | --- | --- |
| 1 | Mobile and desktop performance | 6 | 8 | Medium-high | Mobile Lighthouse 61-83, desktop 91-100. Mobile media payload up to 25.5 MB [Measured] |
| 2 | Core Web Vitals and loading | 5 | 8 | Medium | CLS 0 on 18 of 18 runs. Mobile lab LCP 3.3-8.4 s, TBT 220-650 ms. No field data [Measured] |
| 3 | Technical SEO and indexability | 6 | 9 | Medium | Canonicals, robots, sitemap and 404s are clean [Measured]. Canonical domain unconfirmed and unreachable from here. |
| 4 | On-page SEO and intent coverage | 5 | 7 | Medium | Good titles. Slogan H1s, thin core pages, placeholder `/insights` [Inspected, Judgement] |
| 5 | Structured data and entity consistency | 6 | 8 | Medium | Parseable linked `@graph` on every route [Measured]. Sparse entity facts, unresolved domain conflict. |
| 6 | AEO: answer extraction | 6 | 8 | Medium | 12 server-rendered FAQ answers [Inspected]. Little question coverage elsewhere. |
| 7 | GEO: AI-assisted discovery readiness | 4 | 6 | Low-medium | Crawlable, but no external corroboration. Citations cannot be measured here. |
| 8 | Accessibility and responsive behaviour | 8 | 9 | Medium | Lighthouse accessibility 100 on 18 of 18 runs [Measured]. No manual assistive-technology test. |
| 9 | Motion performance and interaction | 6 | 8 | Medium | CLS 0, reduced motion handled in 17 files. Heavy media, intro replays on every load. No trace review. |
| 10 | Conversion, trust and lead generation | 4 | 8 | High | Contact form does not submit. Privacy link 404s. No analytics. [Inspected, Measured] |

Targets assume the Top 10 fixes in section 9 are delivered. They are goals for planning, not predictions or guarantees.

## 2. Test environment and method

| Item | Detail |
| --- | --- |
| Build | Existing production build in `.next` (`BUILD_ID` 03:02). All nine routes are prerendered static. |
| Server | `next start -p 3120` on `localhost`. The production domain `yachtbrokerservices.com` could not be fetched from this machine (see section 5). |
| Lighthouse | 12.8.2 with system Chrome, headless. Categories: performance, accessibility, best-practices, SEO. |
| Core matrix | 9 routes x mobile (Lighthouse default mobile emulation, simulated slow 4G, 4x CPU slowdown) and desktop preset = 18 runs, one run each. |
| Extra runs | `/`, `/about`, `/faq`, mobile, performance only: 2 repeat runs, 1 run with `?noloader`, 1 run with `--throttling-method=devtools`. 12 runs. |
| HTTP checks | Title, description, canonical, robots meta, Open Graph, Twitter tags, JSON-LD parse, H1 and H2 counts, headers, `robots.txt`, `sitemap.xml`, `/llms.txt`, `/privacy-policy`, 404 behaviour, preload hints, footer links. |
| Source checks | Search of `src` and `public` for legacy tier names. Search of all nine rendered pages for legacy and tier terms. |
| Not run | Field data (CrUX), INP, screen reader and keyboard testing, real-device tests, visual regression at phone widths, keyword tools. See section 11. |

The Lighthouse mobile profile is deliberately harsh. A pass there is meaningful. A fail does not prove that real users on recent phones see the same delay.

## 3. Lighthouse results (Measured)

One run per route and mode. Accessibility scored 100, SEO scored 100 and best-practices scored 96 on all 18 runs. The Lighthouse console-errors audit passed on all 18 runs. CLS was 0 on all 18 runs.

| Route | Mobile perf | Mobile LCP | Mobile TBT | Mobile transfer | Desktop perf | Desktop LCP | Desktop TBT | Desktop transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 73 | 4.0 s | 420 ms | 25.5 MB | 91 | 1.9 s | 80 ms | 25.6 MB |
| `/about` | 61 | 8.3 s | 410 ms | 5.0 MB | 95 | 1.5 s | 50 ms | 5.0 MB |
| `/services` | 81 | 3.3 s | 450 ms | 4.3 MB | 100 | 0.7 s | 10 ms | 4.3 MB |
| `/the-ybs-difference` | 61 | 8.4 s | 500 ms | 12.5 MB | 93 | 1.7 s | 50 ms | 12.8 MB |
| `/how-it-works` | 74 | 3.5 s | 650 ms | 11.2 MB | 99 | 0.9 s | 30 ms | 12.2 MB |
| `/leadership` | 83 | 3.8 s | 220 ms | 17.0 MB | 93 | 1.7 s | 50 ms | 8.1 MB |
| `/faq` | 82 | 3.4 s | 400 ms | 4.3 MB | 100 | 0.7 s | 20 ms | 4.3 MB |
| `/insights` | 81 | 3.6 s | 290 ms | 4.3 MB | 100 | 0.7 s | 20 ms | 4.3 MB |
| `/contact` | 74 | 3.7 s | 610 ms | 4.3 MB | 99 | 0.8 s | 20 ms | 4.3 MB |

Mobile performance averages 74 across the nine routes, desktop 97. Mobile FCP was 0.9 to 1.6 s. Server response time was under 20 ms on every run, as expected for static output on localhost.

A 3.5 MB floor on every page comes from the brand intro video `/logo/ybs-logo-intro.mp4` (3.46 MB on disk). The preload hint for it appears twice in the HTML of `/` [Inspected].

### Run-to-run variance (Measured)

| Route (mobile) | Matrix run | Repeat 1 | Repeat 2 | Range |
| --- | --- | --- | --- | --- |
| `/` | 73 | 80 | 84 | 11 points. TBT 420, 232, 182 ms. |
| `/about` | 61 | 70 | 59 | 11 points. LCP 8.3 s on all three. |
| `/faq` | 82 | 84 | 91 | 9 points |

Score differences under about 10 points, between pages or between code changes, are inside run-to-run noise. Treat the scores as bands. The LCP values were far steadier than the scores.

### Additional experiments (Measured, single runs, directional only)

| Test (mobile) | `/` | `/about` | `/faq` |
| --- | --- | --- | --- |
| Default simulated throttling (mean of 3) | 79, LCP 3.9 s | 63, LCP 8.3 s | 86, LCP 3.4 s |
| `?noloader` (intro skipped) | 86, LCP 3.6 s | 68, LCP 7.1 s | 87, LCP 3.4 s |
| Observed throttling (`devtools`) | 45, LCP 3.8 s, TBT 4134 ms | 45, LCP 4.0 s, TBT 3740 ms | 56, LCP 2.8 s, TBT 2154 ms |

What these show:

- Skipping the intro moved scores by +7, +5 and +1 points against the three-run means. That is inside the noise, so these runs do not show a measurable score cost from the intro. They do not show it is free either.
- `/about` has a simulated LCP of 8.3 s on three of three runs, but 4.0 s under observed throttling. The 8.3 s figure is probably amplified by Lighthouse's simulation. It is still reproducible, and `/the-ybs-difference` also scored a simulated LCP of 8.4 s in the matrix (observed throttling was not run on that route, and its LCP breakdown shows a shorter render delay of 1.3 s). Both should be investigated (section 9, fix 4) and neither should be quoted as a user experience.
- Observed throttling produces very high blocking time (2.2 to 4.1 s). On a throttled CPU the main thread is busy for seconds during load, which fits the long tasks seen in section 4.

## 4. Findings: performance, Core Web Vitals and motion (categories 1, 2, 9)

### What the LCP element is

On the five mobile reports inspected (`/`, `/about`, `/the-ybs-difference`, `/faq`, `/leadership`) the LCP element is the hero poster `<img>` served through `next/image` with `priority` [Measured, Inspected in `CinematicHero.tsx`]. It is requested early (under 90 ms) and is small after optimisation (17 to 46 KB). The Lighthouse LCP breakdown attributes nearly all of the delay to element render delay:

| Route (mobile) | Load delay | Load duration | Element render delay |
| --- | --- | --- | --- |
| `/` | 23 ms | 82 ms | 2,503 ms |
| `/about` | 24 ms | 76 ms | 2,680 ms |
| `/the-ybs-difference` | 25 ms | 56 ms | 1,255 ms |
| `/faq` | 27 ms | 63 ms | 291 ms |

The breakdown phases do not sum to the simulated LCP of 8.3 s on `/about`, so treat the table as a pointer to where time is lost, not an exact account. The pattern is consistent: the image arrives quickly and then waits to be painted. Network is not the bottleneck for the hero image on any route.

Likely contributors, none confirmed [Judgement]:

- Main-thread work during hydration (TBT 220 to 650 ms, long tasks of 327, 260 and 247 ms on `/`, with a 327 ms task in the shared chunk `0cuv1slon936n.js`).
- The brand intro overlay and `useBrandLoaderGate` rendering on the client after hydration. The intro mounts only on the client (server snapshot is `false`), so the first server paint has no overlay and the overlay appears after hydration.
- The hero video and its poster competing for bandwidth on the three routes that carry video.

`/faq`, which has the simplest hero, had the shortest render delay (291 ms). `/` and `/about` had the longest (about 2.5 and 2.7 s). I did not pull the breakdown for `/services`, `/insights`, `/how-it-works` or `/contact`. `/the-ybs-difference` has a long simulated LCP (8.4 s) but only a 1.3 s render delay, so its delay is coming from somewhere else, which I did not identify. The manual test in section 11 (a DevTools performance trace on `/about` and `/the-ybs-difference`) will separate these causes.

### Payload (Measured)

| Item | Finding |
| --- | --- |
| Brand intro | `/logo/ybs-logo-intro.mp4`, 3.46 MB, fetched on every route and every full load. Preloaded twice in `/` HTML. |
| `/` mobile | 25.5 MB transferred. `hero-home-mobile.mp4` alone is 20.3 MB on the wire in the matrix run, and the file on disk is 28.1 MB. |
| `/leadership` mobile | 17.0 MB. `hero-leadership.mp4` is 12.2 MB transferred, 20.1 MB on disk. |
| `/the-ybs-difference`, `/how-it-works` | 12.5 and 11.2 MB. Hero videos are 7.8 and 8.3 MB on disk. |
| JavaScript | 169 to 179 KB transferred per page (about 27 KB reported unused). CSS about 19 KB. |
| Unused dependencies | `three`, `@react-three/fiber`, `@react-three/drei` are in `package.json`. Zero imports from them exist in `src`. They add no bundle weight today but add install weight and audit surface. |
| Stray media | `public/videos/hero-leadership-not used.mp4` (9.6 MB) is in the public folder and so is served if requested. |

The 28 MB mobile home video is the largest single performance risk on the site for visitors on cellular data [Judgement]. `HeroVideo` uses `preload="metadata"` and mounts only the active tier, which is the right approach, but autoplay on a muted video still downloads as it plays. Lighthouse transfer counts are for the load window only, so the real cost depends on how long the visitor stays on the page.

Remaining Lighthouse best-practices miss on all pages: `image-aspect-ratio`. The footer logo is rendered at 160 x 44 in the built HTML while the source `Logo.png` is square (384 x 384). That mismatch would distort the logo. The footer and header files were edited after this build, so this may already be fixed. Re-test.

### Motion quality (category 9) [Measured, Inspected]

- CLS is 0 on all 18 runs, so reveal and scroll motion does not shift layout.
- `prefers-reduced-motion` is handled in 17 source files. `HeroVideo` pauses video and removes autoplay for reduced motion. `BrandLoader` has a static first-frame path for reduced motion.
- `BrandLoader` locks body scroll and moves focus to a skip button while active. It fails open after 14 s. The comment in `BrandLoader.tsx` states a two-pass time of about 7.4 s for the intro clip. That is a long mandatory wait for a returning visitor or a crawler-like user. A skip button exists, which limits the harm.
- The intro replays on every full page load, by design (`useBrandLoaderGate.ts`). Internal links navigate client-side and do not replay it. Search visitors who land directly on any inner page will see it every time.
- Not measured: frame rate, scroll jank, INP, GPU cost of the hero video on low-end phones. A trace is needed (section 11).

Score 6 for motion: the implementation is careful and layout-stable, but the heaviest media and the mandatory intro are not shown to be harmless and nothing about interaction latency was measured.

## 5. Findings: technical SEO, on-page SEO and structured data (categories 3, 4, 5)

### Technical SEO and indexability [Measured]

| Check | Result |
| --- | --- |
| Status codes | All nine routes return 200. `/does-not-exist`, `/privacy-policy`, `/terms`, `/llms.txt` return 404. |
| Canonicals | Present and self-referencing on all nine routes. Home canonical has no trailing slash and matches the sitemap entry. |
| Robots meta | No `robots` meta tag on any route, so default `index, follow` applies. |
| `robots.txt` | `Allow: /`, `Disallow: /api/`, sitemap line points at `https://yachtbrokerservices.com/sitemap.xml`. No `/api` route exists, so the disallow is harmless. |
| `sitemap.xml` | Nine URLs, all on `yachtbrokerservices.com`, none with `lastmod`, `changefreq` or `priority`. Adding `lastmod` that reflects real content changes would help. |
| Open Graph, Twitter | Complete on every route. One shared `og-image.jpg` (1264 x 848). Every page shares the same image. |
| `lang`, viewport | `en`, `width=device-width, initial-scale=1`. |
| Headers | `Cache-Control: s-maxage=31536000`, `X-Powered-By: Next.js` exposed. No security headers configured (`next.config.ts` is empty). |
| Manifest, app icons | `/manifest.webmanifest` returns 404. `/favicon.ico` returns 200. |
| Analytics, Search Console | No analytics script. No `google-site-verification` tag. `AnalyticsProvider` returns `null`. |

### The canonical domain conflict (critical, unresolved)

- The repository uses `https://yachtbrokerservices.com` for canonicals, sitemap, Open Graph and JSON-LD. `siteConfig.url` carries a `REPLACE: confirm canonical domain` comment.
- `yachtbrokerservices.com` could not be fetched from this machine. A direct DNS query returned an A record (207.148.248.143) and no MX record, but the HTTP client failed with "remote name could not be resolved" in the final check, and an earlier attempt in this audit ended in a 504 gateway timeout. These results disagree, so I cannot say whether the site is live. This could be a local resolver issue or a half-configured host. The owner needs to confirm what is deployed there. The missing MX record also means no mail is set up for `info@yachtbrokerservices.com` as far as this query shows, and the contact page and the footer both publish that address [Unverified].
- The brand film script and `docs/YBS_REPOSITIONING_AND_MOTION_PLAN.md` name `www.yachtbroker.services`. That domain is live now: HTTP 200, `robots.txt` and `sitemap.xml` present, canonical `https://yachtbroker.services/`, title "Yacht Broker Services", H1 "Navigate Your Yacht Journey". It carries no Express, Preferred, Cannes or Monaco wording. It appears to be a different, older site.
- If the new site launches on one domain while canonicals, sitemap and structured data name the other, every canonical will point at the wrong host. Until the domain is confirmed, no SEO work that depends on absolute URLs is safe to ship. This is the first decision needed.

### On-page SEO [Measured, Inspected]

| Route | Title length | Description length | H1 | Words (rendered, approx.) |
| --- | --- | --- | --- | --- |
| `/` | 59 | 170 | Be The Architect of Your Future | 1,131 |
| `/about` | 59 | 151 | The Firm Behind Your Independence | 369 |
| `/services` | 51 | 168 | Your Complete Brokerage Ecosystem | 457 |
| `/the-ybs-difference` | 53 | 153 | Why YBS Changes Everything | 617 |
| `/how-it-works` | 55 | 165 | Three Steps to Independence | 740 |
| `/leadership` | 56 | 162 | The Person Behind YBS | 458 |
| `/faq` | 54 | 149 | Frequently Asked Questions | 615 |
| `/insights` | 56 | 145 | Insights & Resources | 304 |
| `/contact` | 51 | 152 | Let's Talk - Discreetly and Confidentially | 207 |

- Each route has exactly one H1 and a unique title and description. Titles are intent-led and under 60 characters. Descriptions are specific and factual. Home (170) and `/services` (168) will likely truncate in results. This is a minor issue.
- The H1s are brand slogans. They carry no category terms such as "independent yacht broker membership". The titles and descriptions do that work, but the H1 is the main on-page signal and the first thing an answer engine reads. `/` has a `<br/>` inside the H1, which renders as "Be The Architectof Your Future" in naive text extraction. That is a small extraction hazard.
- Word counts are low for the core commercial pages (`/about` 369, `/contact` 207, `/services` 457). They are not thin by any rule, but they are light for a high-consideration decision with a monthly fee and a 24-month term.
- `/insights` is a placeholder. All three articles are marked "Coming Soon" with `placeholder: true`, and three resources are `available: false`. A page whose purpose is future content has no search value today and the sitemap lists it with equal weight to real pages. Consider keeping it out of the sitemap until at least one article exists, or keeping it indexable but honest. Do not create mass-produced articles to fill it.
- Internal linking: the header, footer and in-page buttons link every route. The footer reaches all nine routes. There is no breadcrumb schema on the home page, which is correct.
- The home hero subtitle says "tailored to elite yacht brokers" and the footer says "Empowering elite yacht brokers". "Elite" is a superlative claim about the audience, not a legacy term. It is worth a copy review against the "positive and professional, no unsupported claims" brief, but it is not a defect.

### Search intent coverage [Judgement, qualitative only]

Independent brokers researching a move plausibly search for questions like these (no volumes are available, see section 8):

| Intent group | Example phrasing | Covered by | Gap |
| --- | --- | --- | --- |
| Brokerage affiliation | "how to start a yacht brokerage", "join a yacht brokerage as independent" | `/`, `/how-it-works` | No page speaks to "starting out" or the licence path in plain steps |
| Commission and cost | "yacht broker commission split", "yacht brokerage fees" | `/how-it-works`, `/faq`, `/the-ybs-difference` | Covered. The comparison is confined to the difference page, as required. |
| Tools | "yacht CRM for brokers", "yacht MLS access" | `/services` | Names the offer but has no explanation of what the CRM and MLS access actually do |
| Licensing | "yacht broker license Florida", "do I need a license to broker yachts" | One FAQ answer | Licence rules vary by jurisdiction. A cautious factual page could help, but only with sourced content. |
| Marketing and admin | "brand kit for yacht broker", "yacht broker marketing support" | `/services` | Shallow |
| Trust | "is [brand] legit", reviews, leadership | `/leadership` | One person, no third-party corroboration |

The competitive set I could verify in search results is Network Yacht Brokers (cooperative, 100% commission retained, HELM CRM), United Yacht Sales (administrative, marketing and closing support), EasyMLS (CRM and private MLS) and IYBA (association and MLS). These are the businesses a searching broker compares you against. None is a listing marketplace. Yachtr and YachtWorld are listing marketplaces and are not the audience's alternative to YBS (section 7).

### Structured data [Measured, Inspected]

All JSON-LD blocks on all nine routes parse. Types found: site-wide `Organization`, `WebSite` and `ProfessionalService` in one `@graph`, plus page-level `WebPage` and `BreadcrumbList` on inner pages, `FAQPage` on `/faq` and `Person` on `/leadership`. IDs are linked (`#organization`, `#website`, `#service`, `#person`).

| Issue | Detail |
| --- | --- |
| Sparse entity | No `sameAs`, `address`, `telephone`, `foundingDate`, `areaServed` or contact point. The source comment says these are withheld until confirmed. That is the right decision, and it limits entity strength until the client confirms the facts. |
| Address conflict | The brand film lists 1314 East Las Olas Blvd, Fort Lauderdale, FL 33301 and phone 954-478-7000. Not placed in code. Needs confirmation. |
| Founder link | `Person` points at the organisation with `worksFor`. `Organization` has no `founder` property back to the person. |
| Founder `sameAs` | `leadership.ts` has `// REPLACE: Add LinkedIn URL when supplied and approved`. No profile link exists to corroborate the person. |
| Domain | Every `@id` and `url` depends on the unresolved domain. |
| FAQPage | Valid and matches visible text. Google no longer shows FAQ rich results (May 2026). The markup is harmless and may help other consumers. It will not produce a Google rich result. |

I did not run Google's Rich Results Test or the Schema.org validator, which need network access to external tools. Validity here means JSON parsed and types and IDs inspected by hand.

## 6. Findings: AEO, GEO, accessibility and conversion (categories 6, 7, 8, 10)

### AEO: answer extraction (score 6) [Inspected, Measured]

What works:

- `/faq` holds 12 questions in four groups, rendered server-side as native `<details>`/`<summary>`. The answers are in the HTML, so crawlers and answer engines can read them without running JavaScript.
- The questions are phrased the way a broker would ask them: fees, expenses beyond dues, changing tier, term length, licence, exclusivity, leaving, employment status, services, data ownership, getting started.
- Answers are factual and carry the qualifications that the source documents require (non-digital marketing costs are the member's, 24-month initial term, licence position).

What limits the score:

- Only `/faq` is built for question answering. `/how-it-works` and `/services` hold the same facts but under slogan headings ("Three Steps to Independence", "Your Complete Brokerage Ecosystem"). An answer engine looking for "what does a yacht broker membership include" has to infer the section from prose.
- `/faq` has one H2 ("Still Have Questions?"). The four group titles are rendered as `<span>` eyebrow labels (`EyebrowLabel` in `SectionHeader.tsx`), not headings, and the questions sit inside `<summary>` elements. That is accessible but gives the page almost no heading structure to anchor on.
- No definitional sentence says what YBS is in plain words on a page that an answer engine would reach first. The home meta description does. The home H1 and hero subtitle do not.
- No question covers who YBS is not for, what the licence path is for a new broker, or what the 60-day non-renewal notice means in practice. Those are the questions a cautious reader asks before a 24-month commitment.
- FAQ rich results are gone from Google (section 10). The value of the FAQ is now readability and extraction, not a SERP feature.

### GEO: readiness for AI-assisted discovery (score 4) [Judgement]

Google's own guidance (section 10) says AI Overviews and AI Mode use the same foundations as ordinary Search: an indexed, snippet-eligible, crawlable, useful page. There is no special markup, no `llms.txt` and no AI-specific file to add. `/llms.txt` returns 404 on this site and that is fine for Google.

Against those foundations the site is technically eligible. What it lacks is the external evidence that AI systems and people use to decide whether to cite a source:

- One named person, no third-party profile, press, directory or association page that confirms the business exists.
- No `sameAs` links, no address, no phone in structured data, and an unresolved domain.
- No original, citable material. Everything on the site describes the offer. Nothing is a guide, dataset or explainer that a third party would quote.
- `/insights` is empty.
- The brand name is a generic phrase (Yacht Broker Services), and an older site with the same name is live on `yachtbroker.services`. I did not survey other businesses with similar names, but a generic name makes it harder for search and AI systems to tell entities apart, so confirmed facts and external profiles matter more here than for a distinctive name.

A score of 4 reflects that eligibility is met and corroboration is absent. It cannot be raised by on-site changes alone. No citation, ranking or AI visibility figure was measured, and none should be promised. Google Search Console now has a generative AI performance report and a per-site include/exclude control (rolled out to all sites on 31 August 2026). Once the property is verified, that report is the only first-party way to see AI impressions.

### Accessibility and responsive behaviour (score 8) [Measured, Inspected]

- Lighthouse accessibility scored 100 on all 18 runs. Viewport, tap-target size and colour-contrast audits passed on the two mobile reports checked in detail.
- Native `<details>`, label-for-input pairs, `role="alert"` error messages and a skip button on the loader are in place.
- Gaps: Lighthouse covers a minority of accessibility checks. No screen reader pass, no keyboard-only pass of the loader overlay, header and menu, no zoom or text-resize test, no check at 320 px width were done. Decorative hero video is correctly `aria-hidden` and not focusable.
- The score stays at 8 rather than 9 because these manual tests were not run. Full WCAG conformance cannot be established by automated tools and needs manual testing with assistive technology and expert review.

### Conversion, trust and lead generation (score 4) [Inspected, Measured]

This is the weakest category and the most important one for a membership business whose only goal is an enquiry.

| # | Defect | Evidence | Severity |
| --- | --- | --- | --- |
| C1 | The contact form does not send anything | `ContactForm.tsx` line 47 to 48: `// REPLACE: Connect to your form endpoint` then `await new Promise((r) => setTimeout(r, 1200))`, then shows a success message. There is no `/api` route (`src/app/api` does not exist). Every visitor who submits sees "success" and the message is discarded. | Critical |
| C2 | Privacy link is a 404 | The form links to `/privacy-policy`, which returns 404. There is no terms page either. A form that collects name, email and phone must link to a real notice. | Critical |
| C3 | No analytics or measurement | `AnalyticsProvider` returns `null`. No script tags for any analytics product in the HTML. Without it, no conversion, source or page performance can be measured, and the audit's lab numbers cannot be checked against real users. | High |
| C4 | Contact email unverified | `site.ts`: `email: 'info@yachtbrokerservices.com', // REPLACE: real email`. Published in the footer and contact page as `mailto:` links. No MX record was returned in the DNS check. | High |
| C5 | No phone or address | Withheld by design pending confirmation. Brokers weighing a 24-month agreement will look for them. | Medium |
| C6 | Single-person trust base | `/leadership` has one profile. No LinkedIn link, no association membership, no verifiable third-party reference. No testimonials exist, which is correct, since none are supported. | Medium |
| C7 | Fee and term clarity is good | Express $1,500/month at 75% retention and Preferred $3,000/month at 90% retention, a 24-month initial term, non-digital marketing costs disclosed. This is a strength and supports trust. | Strength |
| C8 | No secondary conversion step | Only the contact form. No short "what happens after you enquire" summary, no downloadable overview, no scheduling link. | Medium |

The form also has a honeypot field named `website` and client-side validation, which are fine. With C1 unresolved, none of the lead-generation work on any other page can produce a result.

## 7. Membership terminology and reference sites

### 7.1 Express and Preferred terminology check [Measured, Inspected]

| Surface | Result |
| --- | --- |
| Rendered HTML, all nine routes | Zero hits for Cannes, Monaco, Monte Carlo, Platinum, Silver, Essential, Signature, "Standard Tier", "Premium Tier" or "Standard/Premium". "Express" and "Preferred" appear on every route (for example 18 and 20 times on `/how-it-works`). |
| Source (`src`) | No Cannes or Monaco. The type `Tier['name']` is `'express' \| 'preferred'` in `site.ts`. "Express" or "Preferred" appears in 15 source files. The only matches for other tier-like words were "bronze" in CSS colour comments and "elite" in two copy strings (not tier names). |
| Metadata | Titles, descriptions, Open Graph and Twitter text use "Express" and "Preferred" only (for example `/how-it-works`, `/faq`, `/contact`). |
| Structured data | No tier names at all in the JSON-LD. The `FAQPage` answers carry the current names through the visible text. |
| Backend | There is no backend. `src/app/api` does not exist. The contact form has no tier field. |
| `public/` | No text file in `public` mentions a legacy name. Image and video file names were not checked for legacy names beyond a size listing. |
| `docs/` | Legacy names remain in two documents. `docs/YBS_REPOSITIONING_AND_MOTION_PLAN.md` (lines 11, 12, 115, 118, 128) says the tiers are "Cannes" and "Monaco" and that "Tier data renamed to `cannes` / `monaco`". `docs/YBS_IMMERSIVE_MOTION_BLUEPRINT.md` (lines 775, 940) mentions them as well. |

Conclusion: the live site and code are consistent on Express and Preferred. The two documents are stale and contradict the code. A future contributor following the plan would reintroduce the old names. Fix 9 in section 9 adds a note to those two files. Wording elsewhere should be checked for the retention figures: home subtitle says "up to 90%", meta says "75% or 90%", and both match the tier data.

One note, not a defect: `featured: true` is set on Preferred in `src/data/difference.ts` and drives visual emphasis in `TierCard`. The type comment in `site.ts` says this is "factual visual emphasis only (e.g. highest retention). Not a popularity claim." The repositioning plan removed a "Most Popular" badge. No popularity claim was found in the rendered text.

### 7.2 Reference sites [Inspected via web fetch, current as of 27 October 2026]

The brief names Yachtr, YATCO, YachtWorld and Zillow as indirect references. None competes with YBS, which is a membership and business-support platform and not a listings marketplace. They are useful for patterns, not for copying.

| Site | What it is | Pattern worth learning | Pattern to avoid copying |
| --- | --- | --- | --- |
| Yachtr | MLS and listings site developed by the IYBA. About 10,971 active listings at the time of fetch. States "only verified listings". | Leads with a plain trust claim tied to a named industry body and a named quote from an IYBA officer. Visible address in the footer. | Listing-first page. YBS has no listings. |
| YATCO | Yacht sales and charter database, with a business services directory ("30,000 professional businesses"). Headline: "Search For Yachts for Sale, Yachts for Charter and Business Services". | Shows physical address, phone and email in the footer. States scale in numbers it can support. | Directory framing. Only quote numbers YBS can prove. |
| YachtWorld | Global listings marketplace. The fetched page returned little beyond listing cards and a title. | Not enough content retrieved to draw a conclusion. | n/a |
| Zillow (Premier Agent) | Real estate marketplace with a free agent profile (bio, photo, reviews, past sales, specialties) and paid lead products. Reviews can only come from people who contacted or worked with the agent, and are moderated. | Profile completeness and moderated, verifiable reviews as the trust mechanism. Plain explanation of how the programme works in an FAQ. | Paid-lead pressure language. YBS should not imply lead supply. |

Direct competitors for a broker deciding where to hang their licence, from the search I ran for this brief:

| Business | Offer as described on its own site | Relevance |
| --- | --- | --- |
| Network Yacht Brokers | Cooperative of independent brokers (UK and Europe, 23 offices). "We are not a franchise." Zero commission taken, one-time joining fee, monthly licence fee, marketing contribution, HELM CRM. | Closest model contrast: retained commission against flat fees. |
| United Yacht Sales | Large brokerage with listing-entry, marketing, closing and documentation support teams for affiliated brokers. States 250+ brokers and 25 offices. | Shows what "back-office support" looks like in a competitor's words. |
| EasyMLS | Yacht CRM, private MLS and co-brokerage, distribution to "20+ portals". | Shows how tool-first competitors explain CRM and MLS. |
| IYBA | Trade association with a code of ethics and a member MLS. | The body brokers already trust. A relevant external reference point for YBS if there is a real affiliation. |

These facts come from each company's own pages and are marketing statements, not independent verification. Per the brief, comparison with traditional firms stays on `/the-ybs-difference` and no competitor-named pages are proposed. None of this licenses a claim about YBS being better than any named firm.

## 8. Keyword research: what could and could not be done

| Item | Status |
| --- | --- |
| Keyword volume | **Not available.** No licensed keyword tool (Search Console, Semrush, Ahrefs, Google Keyword Planner) was accessible in this session. Search volume and keyword difficulty are research gaps. No number appears anywhere in this report. |
| Search Console | Not connected. The domain is unverified and `google-site-verification` is absent from the HTML. |
| Intent groups | Section 5 lists intent groups from reasoning about the audience and from what the live search results show. They are hypotheses, not ranked opportunities. |
| Related searches | One web search for independent yacht broker membership options returned four competitor pages and one association page. This is a sample and not a SERP study. |
| Manual test to close the gap | Verify the property in Search Console, wait for 28 days of impressions, then export the Queries report. In parallel, pull volumes for the 15 to 25 intent phrases from a licensed tool, and review the top ten results for each manually. |

The niche is small and specialised. Small-volume terms are normal for B2B services like this and are not a reason to expand into volume. Mass-produced location or keyword pages are not recommended.

## 9. Top 10 prioritised fixes

Ordered by impact first, then confidence, then low effort and low risk. Effort: S under half a day, M one to three days, L more than three days. None of these changes a hero section, the brand-loader animation, motion code or the theme. Where a fix comes close to one of those, it says so and waits for explicit approval.

### Critical defects

| # | Fix | Impact | Confidence | Effort | Risk | File-level change |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Make the contact form deliver enquiries | Very high | High | M | Low | `src/components/content/ContactForm.tsx`: replace the `setTimeout` stub in `handleSubmit` with a real `fetch` to a server endpoint and show an error state when it fails. Add `src/app/api/contact/route.ts` (or use a hosted form service) with server-side validation, honeypot check, rate limiting and an email or CRM hand-off. Remove the `REPLACE` comment. Add a visible failure message so a failed send is never reported as success. Needs the client to name the receiving mailbox or CRM. Note that adding an `/api` route makes the existing `Disallow: /api/` in `robots.ts` meaningful. This is an unauthenticated public endpoint, so it must have abuse controls. |
| 2 | Publish a real privacy notice | Very high | High | S to M | Low | Add `src/app/privacy-policy/page.tsx` and list it in `sitemap.ts` and the footer. The content must come from the client or their lawyer. I will not draft legal text from nothing. Until it exists, remove or soften the link text so the form does not point at a 404. |
| 3 | Confirm the canonical domain, mailbox and contact facts | Very high | High | S (decision) | Medium | Client decision, then two places must change together. `src/data/site.ts` (`url`, `email`) feeds `sitemap.ts`, `robots.ts` and `structured-data.ts`. But `src/app/layout.tsx` line 31 hardcodes `metadataBase: new URL('https://yachtbrokerservices.com')` and does not read `siteConfig.url`, and canonicals and Open Graph URLs resolve against it. Change `metadataBase` to use `siteConfig.url` so the domain lives in one place. Also confirm that mail for the published address is received (no MX record was seen). If the older `yachtbroker.services` site stays live, plan redirects before launch so two sites do not compete. |

### Quick wins and measurement

| # | Fix | Impact | Confidence | Effort | Risk | File-level change |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | Trace and fix the mobile render delay on `/about` and `/the-ybs-difference` | High | Medium | M | Low to medium | No code change at first: record a DevTools performance trace on a throttled mobile profile and identify what blocks the hero poster paint (hydration, intro overlay, video mount, or a CSS reveal that keeps the image at zero opacity). Then change only the cause. If the cause is inside `CinematicHero`, `HeroVideo`, `RevealOnScroll` or `BrandLoader`, stop and ask, because those are protected by the brief. |
| 5 | Add privacy-friendly analytics and verify Search Console | High | High | S | Low | `src/components/seo/AnalyticsProvider.tsx` (one provider, loaded after interaction or `afterInteractive`), and add a `verification` entry to the `metadata` export in `src/app/layout.tsx`. Track form submission success, CTA clicks and Core Web Vitals. This is the only way to get field LCP, INP and CLS. If a cookie-based product is chosen, a consent step is required first. |
| 6 | Reduce media weight without changing what is shown | High | Medium | M | Medium | Re-encode `hero-home-mobile.mp4` (28 MB on disk), `hero-leadership.mp4` (20 MB), `hero-home.mp4` (30 MB), `hero-home-tablet.mp4` (19 MB) and `ybs-logo-intro.mp4` (3.5 MB) to lower bitrates and add a WebM/AV1 or H.265 variant where supported. Same footage, same framing, smaller files. Remove the duplicate `<link rel="preload" as="video">` for the intro. Delete `public/videos/hero-leadership-not used.mp4`. This touches hero assets, so it needs your approval and a side-by-side visual check before anything is replaced. |
| 7 | Add plain-language answers and heading structure | Medium to high | Medium | M | Low | Below the hero (not inside it), add a one-paragraph definition of YBS and what a member receives. On `/faq`, make the four group titles real H2s (they are `<span>` labels now in `src/app/faq/page.tsx`). Add 4 to 6 reader questions that are currently missing: who YBS is not for, how the licence path works for a new broker, what the 60-day notice means, what is included at each fee level, what happens in the first 30 days. Answers must come from the membership agreement. No new claims. |

### Longer-term opportunities

| # | Fix | Impact | Confidence | Effort | Risk | File-level change |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | Complete the entity once facts are confirmed | Medium to high | Medium | S then ongoing | Low | In `src/data/structured-data.ts` add `address`, `telephone`, `sameAs`, `founder` (link to the `#person` node) and `contactPoint`, and add `sameAs` for the founder's confirmed profiles from `src/data/leadership.ts`. Only confirmed facts. Off-site: a Google Business Profile if eligible, and listings with the trade bodies YBS actually belongs to. These are what make a small brand name resolvable. No outcome is guaranteed. |
| 9 | Correct stale terminology in the docs | Low (risk reduction) | High | S | None | Add a "superseded" note to the tier table in `docs/YBS_REPOSITIONING_AND_MOTION_PLAN.md` (lines 11 to 12, 115, 118, 128) and `docs/YBS_IMMERSIVE_MOTION_BLUEPRINT.md` (lines 775 and 940), pointing at Express and Preferred. |
| 10 | Housekeeping and hardening | Low to medium | High | S to M | Low | Remove `three`, `@react-three/fiber` and `@react-three/drei` from `package.json` (no imports in `src`). Add `lastmod` to `src/app/sitemap.ts`. Set `poweredByHeader: false` and security headers in `next.config.ts` (currently empty). Re-test the footer logo aspect ratio after the post-build edits. Add a web manifest. Decide whether `/insights` stays in the sitemap while all content is "Coming Soon". Per-page Open Graph images are optional. |

### What is deliberately not on the list

- Changing any H1 or hero copy to add keywords. The H1s are slogans and a keyword-led H1 would help clarity, but the hero is protected by the brief. If you want to explore this, treat it as a separate, explicit approval.
- `llms.txt`, AI-specific markup or "AI schema". Google's current documentation says none is needed for Google Search.
- New pages for each city, competitor or keyword. They would be thin, repetitive and against the brief.
- Testimonials, review markup or case studies, because none are supported by real material.
- Rewriting FAQPage markup for rich results. Google no longer shows them.

## 10. Research sources

Google guidance, read during this session:

- Google Search Central, "Latest documentation updates" (changelog): FAQ rich result deprecated 7 May 2026 (notice 8 May), FAQ documentation removed 15 June 2026, `llms.txt` clarification 15 June 2026. https://developers.google.com/search/updates
- Google Search Central, "Optimizing for generative AI features on Google Search": the same technical foundations apply; indexed and snippet-eligible pages only; structured data is not required for generative AI search and there is no special markup. https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, "AI features and your website": no extra technical requirements for AI Overviews or AI Mode beyond Search eligibility; AI features may issue related searches across subtopics ("query fan-out"). https://developers.google.cn/search/docs/appearance/ai-features
- Search Console Help, "Search generative AI control": per-property include/exclude control for AI Overviews, AI Mode and Discover generative features, rolled out worldwide 31 August 2026. https://support.google.com/webmasters/answer/16908024
- Google blog, "New opportunities, control and insights for website owners": generative AI impression insights in Search Console. https://blog.google/products-and-platforms/products/search/new-controls-website-owners/
- Secondary: Search Engine Journal and a third-party status page on the FAQ rich result removal, used only to cross-check dates already stated in Google's changelog.

Reference and competitor pages, fetched or searched during this session (their own statements, not independent verification):

- Yachtr, https://yachtr.com
- YATCO, https://www.yatco.com
- YachtWorld, https://www.yachtworld.com (page returned little content)
- Zillow Premier Agent, https://www.zillow.com/premier-agent/ and related profile and review FAQ pages
- Network Yacht Brokers, https://www.networkyachtbrokers.com/become-a-yacht-broker/
- United Yacht Sales, https://www.whyuys.com/
- EasyMLS, https://www.easymls.com/en
- IYBA, https://iyba.org/why-join-iyba

Repository material read: `docs/YBS_REPOSITIONING_AND_MOTION_PLAN.md`, `docs/YBS_IMMERSIVE_MOTION_BLUEPRINT.md`, `docs/YBS_IMAGE_ART_DIRECTION.md`, `docs/YBS_IMAGE_GENERATION_BRIEFS.md`, `src/data/*.ts`, `src/lib/metadata.ts`, `src/app/layout.tsx`, `src/components/layout/CinematicHero.tsx`, `HeroVideo.tsx`, `src/components/ui/BrandLoader.tsx`, `src/hooks/useBrandLoaderGate.ts`, `ContactForm.tsx`, `AnalyticsProvider.tsx`.

## 11. Limitations and the manual tests that would close them

| Limitation | Effect on this report | Manual test required |
| --- | --- | --- |
| Production domain not reachable from this machine | No live TTFB, CDN, redirect, HTTPS, header or indexation check. Everything was measured on `localhost`. | After deployment, run Lighthouse and PageSpeed Insights against each of the nine live URLs. Check `curl -I` for HTTPS, `www` redirect and cache headers. Run `site:` and URL Inspection in Search Console. |
| Lab data only, one run per page in the matrix | Scores can move by about 10 points between runs. | Run each route at least five times and use the median, or use PageSpeed Insights field data when the live site has enough traffic. |
| No field data, no INP | CWV are lab proxies. TBT is not INP. | Enable analytics with web-vitals reporting (fix 5) and read 28 days of real-user data. In DevTools, record interactions (menu, accordion, form) and read INP in the Performance panel. |
| Build slightly older than the working tree | Five header, footer and CSS files changed after the build. | Rebuild, then re-run the matrix and the logo aspect-ratio audit. |
| Intro effect not isolated | `?noloader` differences were inside noise. | Record DevTools traces with and without the intro on `/about` on a mid-range Android profile and compare Total Blocking Time and LCP. |
| No real-device test | Hero video decode cost, battery and scroll smoothness are unknown. | Test on a mid-range Android phone and an older iPhone over throttled 4G. Check the Chrome performance monitor for dropped frames while scrolling `/` and `/leadership`. |
| Accessibility is automated only | Lighthouse covers a subset of WCAG checks. | Screen reader pass (NVDA with Firefox or Chrome, VoiceOver on iOS), keyboard-only pass including the loader skip button, 200% zoom and 320 px width pass, and a reduced-motion pass. |
| Schema validation by inspection | JSON parsed and types reviewed by hand. | Run Schema.org's validator and Google's Rich Results Test on the live URLs (FAQ will no longer be reported by Google). |
| Keyword data absent | No volumes or difficulty. | Section 8. |
| Search results sampled once | Competitor list is a sample, not a SERP study. | Review the top ten results for each of 15 to 25 target phrases in an incognito window by country. |
| AI visibility unmeasurable | No evidence of AI citations either way. | After verification, review the Generative AI report in Search Console. For non-Google engines, run a fixed set of 10 to 20 questions monthly and log whether the site is cited. Record, do not optimise to the sample. |
| Contact form behaviour inferred from code | Not tested against a real endpoint (none exists). | After fix 1, submit a test enquiry from a phone and from a desktop and confirm delivery. Confirm failure messaging by blocking the request in DevTools. |

## 12. Staged implementation plan

Nothing starts until you approve it. Each stage ends in a review point.

| Stage | Scope | Contents | Exit check |
| --- | --- | --- | --- |
| 0. Decisions | No code | Confirm the canonical domain, the receiving mailbox or CRM, the published address and phone, the founder's profile links, and who supplies the privacy notice text. | Written answers to the five questions in the executive summary. |
| 1. Make enquiries work | Fixes 1, 2, 3 | Contact endpoint with validation and abuse controls, real privacy page, `metadataBase` read from `siteConfig.url`, correct email. Fix sitemap and footer links. | A test enquiry arrives. `/privacy-policy` returns 200. No hard-coded domain remains in `src`. |
| 2. Measure | Fix 5 | Analytics with web-vitals reporting and Search Console verification. Rebuild and re-run the Lighthouse matrix as the new baseline. | Field data collection live. Baseline report saved to `docs/`. |
| 3. Performance | Fixes 4, 6 | Performance trace on `/about` and `/the-ybs-difference`. Media re-encoding with visual approval. Remove duplicate preload and stray file. Any change inside a protected hero or loader file stops for approval. | Median of five mobile runs improves or holds, no visual change signed off by you. |
| 4. Answer clarity | Fix 7 | Plain definition below the hero, real H2s on `/faq`, 4 to 6 missing questions drawn from the membership agreement. | Content review by the client. Rendered HTML check. |
| 5. Entity | Fix 8 | Structured data completed with confirmed facts only. Off-site profiles. | JSON-LD parses and matches visible text. |
| 6. Housekeeping | Fixes 9, 10 | Docs notes, dependency removal, headers, sitemap `lastmod`, manifest. | Build passes. Lighthouse best-practices still passes. |
| 7. Content (optional, later) | None before stage 2 data | At most a few genuinely useful guides, one at a time, each written from real knowledge and reviewed by Kent Chamberlain or another named expert. No mass production. | Search Console impressions justify each addition. |

Realistic expectation after stages 1 to 3 [Judgement, not a promise]: conversion readiness moves from 4 toward 7, with the form working and measured. Mobile lab performance should move into the 80s on the heavy pages if media weight and the render delay are fixed. Stage 4 to 5 help AEO and GEO scores, but outcomes depend on external factors the site does not control.

## 13. Executive summary

### Where YBS stands today

The site is well built on the technical basics. All nine routes prerender, canonicals and sitemap are clean, structured data parses, Lighthouse accessibility and SEO score 100 on 18 of 18 runs, CLS is 0, and the Express and Preferred terminology is consistent in all rendered pages, metadata and structured data. The content is factual, professional and avoids unsupported claims.

What the site cannot yet do is act as a business asset. The contact form shows a success message and sends nothing, the privacy link is a 404, there is no analytics, and the canonical domain and contact email are not confirmed. Mobile performance is acceptable but not strong (lab scores 61 to 83), because of very large hero video files and a render delay on two pages. As an AI-search source the site is eligible but uncorroborated.

Overall mean score 5.6 of 10. The scores are bands, not precise values. Lab figures vary by about 10 points between runs.

### Three biggest weaknesses

1. Enquiries are lost. `ContactForm.tsx` discards every submission and reports success. The privacy link goes to a 404.
2. The domain and contact identity are unresolved. `yachtbrokerservices.com` could not be confirmed live from here, `metadataBase` is hardcoded in `layout.tsx`, the mailbox has no visible MX record, and a different older site is live on `yachtbroker.services`.
3. Nothing is measured and media is heavy. No analytics, no field data, a 3.5 MB intro on every load and hero videos of up to 28 MB on disk, with an unexplained 8 s simulated LCP on `/about` and `/the-ybs-difference`.

### Three biggest opportunities

1. A working, measured enquiry path. This lifts the weakest score (4) and every other improvement depends on it.
2. Clearer answers where the audience looks. Plain-language definitions, real headings on `/faq`, and the missing reader questions improve extraction for people and answer engines without adding claims.
3. A stronger, verifiable entity. Confirmed address, phone, founder profile and genuine trade-body links give search and AI systems something to corroborate. This is the main route to a better GEO score and depends on facts only the client can supply.

### What to fix first

1. Decide the domain, mailbox, address and phone (stage 0).
2. Make the contact form deliver, and publish the privacy notice (stage 1).
3. Turn on analytics and Search Console, rebuild, and re-baseline (stage 2).
4. Then work on media weight and the `/about` render delay (stage 3).

### Questions for you before anything is implemented

1. Which domain is the permanent one: `yachtbrokerservices.com` or `yachtbroker.services`, and what should happen to the other?
2. Where should enquiries go (a mailbox, a form service or a CRM), and does `info@yachtbrokerservices.com` receive mail?
3. Who will supply the privacy notice text?
4. Can the Fort Lauderdale address and phone number from the brand film be published?
5. May I touch the hero video and intro files for re-encoding (same footage, smaller files) if you approve a side-by-side check?

No code, media, hero, brand loader or motion file has been changed. I am waiting for your approval before implementing any part of this plan.

