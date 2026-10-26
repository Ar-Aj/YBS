# YBS Performance, SEO, AEO and GEO Audit

Audit date: 27 October 2026. Scope: the repository at `c:\Yacht Broker Service` (Next.js 16.3.5, React 19.2.8, App Router, all nine routes statically prerendered).

Status: audit and plan only. No site code, media, hero section, brand-loader animation or motion file was changed. Nothing in this document has been implemented. Implementation waits for approval.

## How to read this report

- **[Measured]** a number produced by running a tool in this session (Lighthouse 12.8.2, HTTP requests, parsing the prerendered HTML).
- **[Inspected]** read directly from source files or rendered HTML.
- **[Judgement]** expert opinion, not a measurement.
- **[Unverified]** could not be tested here. The exact manual test is in section 11.
- No keyword volume, keyword difficulty, traffic, ranking or competitor performance figure appears in this report. None was available. See section 8.
- Lab scores come from one Windows machine testing `localhost`. They are indicative, not field data. Section 3 shows how much they vary between runs.

## 1. Scorecard

Scores do not reward a feature for existing. Each one reflects whether the feature works and what it achieves. The unweighted mean is 5.7. Treat it as a rough summary only, because the categories are not equally important.

| # | Category | Score | Realistic target | Confidence | Main basis |
| --- | --- | --- | --- | --- | --- |
| 1 | Mobile and desktop performance | 6 | 8 | Medium-high | Mobile Lighthouse 64-84, desktop 92-100 [Measured] |
| 2 | Core Web Vitals and loading | 5 | 8 | Medium | CLS 0, but mobile lab LCP 3.5-8.1 s and TBT up to 943 ms [Measured]. No field data. |
| 3 | Technical SEO and indexability | 7 | 9 | Medium-high | Clean canonicals, robots, sitemap, 404s [Measured]. Live domain unreachable. |
| 4 | On-page SEO and intent coverage | 5 | 7 | Medium | Good titles. Slogan H1s, thin pages, placeholder `/insights` [Inspected, Judgement] |
| 5 | Structured data and entity consistency | 6 | 8 | Medium | Valid linked `@graph` [Measured]. Sparse entity facts, unresolved domain conflict. |
| 6 | AEO: answer extraction | 6 | 8 | Medium | 12 server-rendered FAQ answers. Little question coverage elsewhere. |
| 7 | GEO: AI-assisted discovery readiness | 4 | 6 | Low-medium | Crawlable, but no external corroboration. Citations cannot be measured. |
| 8 | Accessibility and responsive behaviour | 8 | 9 | Medium | Lighthouse accessibility 100 on 18 of 18 runs. No manual assistive-technology test. |
| 9 | Motion performance and interaction | 6 | 8 | Medium | CLS 0, reduced motion handled. Heavy media, intro replays on every load. No trace run. |
| 10 | Conversion, trust and lead generation | 4 | 8 | High | Contact form does not submit. Privacy link 404s. No analytics. [Inspected] |

## 2. Test environment and method

| Item | Detail |
| --- | --- |
| Build | `npm run build` succeeded. All nine routes are `○ (Static)`. |
| Server | `next start` on `localhost:3120`. The production domain could not be reached (see section 8). |
| Lighthouse | 12.8.2, headless Chrome (system install), categories: performance, accessibility, best-practices, SEO |
| Runs | 9 routes x mobile (default emulated Moto-class device, simulated slow 4G, 4x CPU) and desktop preset = 18 runs |
| Extra runs | 3 repeat mobile runs on `/`, `/about`, `/faq` for variance. 1 run of each with `?noloader`. 1 run of each with observed (`devtools`) throttling. |
| HTTP checks | Metadata, canonical, robots meta, Open Graph, Twitter tags, JSON-LD, H1 count, image alt, internal links, headers, `robots.txt`, `sitemap.xml`, `/llms.txt`, 404 behaviour |
| Source checks | Search for legacy tier names in `src`, `public`, `docs` and the prerendered HTML in `.next/server/app` |
| Not run | CrUX or other field data, INP, screen reader testing, real-device tests, keyword tools. See section 11. |

The Lighthouse mobile profile is deliberately harsh. A pass here is meaningful. A fail does not prove real users on recent phones see the same delay.

## 3. Lighthouse results (Measured)

Single run per route and mode. Accessibility was 100, best-practices 96 and SEO 100 on all 18 runs, so those columns are left out below.

| Route | Mobile perf | Mobile LCP | Mobile TBT | Mobile page weight | Desktop perf | Desktop LCP |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 76 | 3.5 s | 560 ms | 23.9 MB | 92 | 1.8 s |
| `/about` | 64 | 8.1 s | 330 ms | 5.1 MB | 95 | 1.4 s |
| `/services` | 82 | 3.6 s | 230 ms | n/r | 100 | 0.7 s |
| `/the-ybs-difference` | 75 | 4.2 s | 290 ms | n/r | 93 | 1.7 s |
| `/how-it-works` | 79 | 3.9 s | 310 ms | n/r | 94 | 1.7 s |
| `/leadership` | 78 | 3.9 s | 290 ms | 17.7 MB | 93 | 1.7 s |
| `/faq` | 79 | 3.8 s | 360 ms | 4.4 MB | 100 | 0.7 s |
| `/insights` | 84 | 3.5 s | 310 ms | n/r | 100 | 0.7 s |
| `/contact` | 76 | 4.1 s | 320 ms | n/r | 100 | 0.7 s |

n/r = not recorded for that route. CLS was 0 on every run. Desktop TBT was 10 to 50 ms.

### Variance (Measured)

| Route | Run 1 | Repeat A | Repeat B | Spread |
| --- | --- | --- | --- | --- |
| `/` | 76 | 83 | 69 | 14 points. TBT 208 to 943 ms. |
| `/about` | 64 | 59 | 66 | 7 points. LCP 7.8 to 8.2 s. |
| `/faq` | 79 | 80 | 88 | 9 points |

Differences under about 10 points between pages or between changes are inside run-to-run noise. Treat the scores as bands, not exact values.

### Additional experiments (Measured, single runs, directional only)

| Test | `/` | `/about` | `/faq` |
| --- | --- | --- | --- |
| Default (simulated throttling) | 76, LCP 3.5 s | 64, LCP 8.1 s | 79, LCP 3.8 s |
| `?noloader` (intro skipped) | 89, LCP 3.5 s, TBT 104 ms | 74, LCP 7.0 s | 86, LCP 3.3 s |
| Observed throttling (`devtools`) | 42, LCP 4.2 s, TBT 2674 ms | 45, LCP 4.1 s, TBT 2530 ms | 58, LCP 3.0 s, TBT 1666 ms |

What these show:

- Skipping the intro raised scores by 7 to 13 points, but that is about the size of the noise, so it is not proof. It did not fix `/about` LCP.
- Under observed throttling the `/about` LCP of 8 s disappears (4.1 s). The 8 s figure is probably amplified by Lighthouse's simulation. Do not quote it as a user experience.
- Observed throttling produces much higher blocking time (1.7 to 2.7 s). The main thread is busy on a throttled CPU, whatever the exact figure.

<!--CONTINUE-->
