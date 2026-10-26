# YBS Repositioning, SEO and Motion: Research, Audit and Plan

Baseline date: 26 October 2026. Status: plan written before source edits.

## 1. Verified business facts

Sources: `Detailed_YBS_Explainer_Video_Script` (Q&A, "Explainer"), `YBS_Final_Video_Script` ("Brand film"), and the client "Website Layout" data in the brief.

| Fact | Source | Site action |
|---|---|---|
| Cannes: $1,500/month, retain 75% of gross commissions | Explainer Part I | Rename tiers from Standard/Premium |
| Monaco: $3,000/month, retain 90% of gross commissions | Explainer Part I | Rename |
| Both include MLS and CRM access plus the services in the Membership Agreement | Explainer | Keep |
| Initial term 24 months, then automatic 12-month renewals, either party may decline with 60 days' notice before the anniversary | Explainer Part II | Replace "annual commitment" |
| Tier can be changed annually on renewal. The tier in effect on the date a client agreement is signed governs that transaction through closing | Explainer | Add |
| Monthly dues by ACH. Deal fees collected through escrow at closing | Explainer | Add |
| Exclusivity: during the term, brokerage and charter activity runs through the YBS platform and transactions are recorded in the membership portal | Explainer | Add (previously absent) |
| US members need a yacht broker licence or must be licensed under a member Employing Broker. YBS can introduce one. Non-US members need a licence where the jurisdiction requires it | Explainer | Add |
| Non-digital marketing costs (magazine ads, banners, print, boat shows, premium promotions) are paid by the member or their clients | Explainer | **Remove "no hidden fees / no variable costs / no surprise invoices" claims** |
| Client data is owned entirely by the member. YBS sees only what the member shares and uses it only to support their activities | Explainer | Promote as a core point |
| After the initial 24 months a departing member keeps IP and marketing materials, subject to the agreement | Explainer | Add with qualification |
| Entity setup, stylized brand kit, website creation, social media support, monthly branded newsletter, legal advice access, contract templates, comps research and reports, survey and sea-trial support, closing-document coordination | Explainer | Use these terms |
| One AI-generated video monthly, private CRM, assistant support, prospecting email templates, luxury co-marketing and events, contract production, KYC support, haul-out scheduling, basic legal services | Client layout data | Keep |
| "At Yacht Broker Services you're our client. We work for you!" | Brand film | Keep |
| Address 1314 East Las Olas Blvd, Fort Lauderdale, FL 33301. Phone 954-478-7000. Site www.yachtbroker.services | Brand film (end card) | **Not placed in code.** The script says "Company logo (we need one)" and the domain differs from `siteConfig.url`. Needs client confirmation (see §7) |

Claims removed or corrected because the sources contradict or do not support them:

- "No hidden fees / no variable costs / no à la carte / no surprise invoices" (site, FAQ, Difference, Services, How It Works). Contradicted by the Explainer on non-digital marketing costs.
- "Annual commitment" on both tiers. Actual initial term is 24 months.
- "Most Popular" badge on the 90% tier. No evidence supplied.
- Founder quote attributed to Kent (`foundingPrinciple`) and the About-page philosophy quote. No quote was supplied by the client, so both are invented attributions.
- "Traditional brokerages take 30–50%" stated as fact in the FAQ and repeated on About/Home. The client table says "50/50 to 70/30" for comparison only; it is kept on the Difference page only, framed as typical structures.
- "Born from a simple observation: the most talented professionals were leaving established firms" (About). Not in any supplied material.
- "Industry veteran" (Kent). The brief supplies only the name "Kent". Rewritten without credentials. Needs client biography.
- "Worldwide" `areaServed` in JSON-LD and "Available worldwide" on Contact. The licensing rules make this a qualified claim, so it becomes "members in the US and, where licensing permits, elsewhere".
- "Legal and accounting services" in the client homepage copy vs "basic legal services" in deliverables. Accounting is not itemised in the Explainer. Copy uses "legal advice access and basic legal services" and avoids promising accounting beyond what the brand film and client text state. Flagged in §7.

## 2. Market research baseline (October 2026)

Method: direct page fetches on 26 Oct 2026 and the two Google documents. No paid keyword tools are configured in this environment, so no volumes, difficulty scores, rankings or traffic figures are reported.

| Source | Verified observation (26 Oct 2026) | Implication |
|---|---|---|
| yachtr.com/professional-yacht-brokers | Page titled "Find a certified professional broker". Positions brokers as accredited-association members who bring buyer databases. Listing gated on accredited association membership. Fort Lauderdale address | Yachtr is a consumer-facing directory. Its audience is yacht owners and buyers, not brokers looking for business infrastructure. Different intent from YBS |
| yatco.com | Title "Luxury Yachts for Sale & Private Yacht Charter". Claims 15,000+ yachts for sale, 2,000 charter, 30,000 professional businesses, 50,000+ captains/crew. Positions as a database plus a business-services directory | YATCO is inventory and directory first. A broker-membership platform is not described on the page |
| yachtworld.com | Listing marketplace. Home page content is listings by dealer | Marketplace intent. Confirms brokers think about listing syndication |
| zillow.com/agent-resources | Educational articles, tools for agents and brokers (market predictions, listing tools, client insights) | Adjacent real-estate analogue: a major consumer portal also publishes practical agent education. Supports a plain "resources for brokers" content approach |
| Google AI optimization guide | SEO fundamentals still apply. Non-commodity content, crawlability, semantic HTML. `llms.txt`, content chunking, rewriting for AI and inauthentic mentions are explicitly not needed. Structured data is not required for AI features | Do not add `llms.txt`, hidden Q&A or chunked doorway pages. Keep JSON-LD accurate and minimal |
| Google spam policies | Keyword stuffing, link spam and scaled content abuse named as violations | No competitor-name pages, no mass FAQ generation |

Query/intent table (inferred, not measured):

| Opportunity | Status | Where YBS is genuinely relevant |
|---|---|---|
| Independent yacht broker membership / business platform | Competitor positioning observed: none of the four sites above describes this offer. Search demand unmeasured | Home, About, How It Works |
| Yacht broker commission split / retention | Inferred intent. Unvalidated volume | Difference (comparison), How It Works (tiers), FAQ |
| Yacht broker CRM, MLS access, comps research | Inferred. Unvalidated | Services |
| Yacht transaction coordination (contract, KYC, survey, haul-out, closing documents) | Inferred. Unvalidated | Services |
| Yacht broker website/branding/marketing | Inferred. Unvalidated | Services |
| Own client data / leaving a house with your book | Inferred from brand film themes. Unvalidated | FAQ, Leadership/About |

Unresolved gaps: no keyword volumes, no SERP snapshots by location, no Search Console data (site not yet verified), no backlink data. Recommended tooling and validation steps are in `YBS_OFFPAGE_SEO_STRATEGY.md`.

## 3. Audit of the nine routes (before changes)

Build baseline: `next build` exit 0, 14 static pages, Next.js 16.3.5 (Turbopack). Hashes recorded for `CinematicHero.tsx`, `CinematicHero.module.css`, `HeroVideo.tsx`, `BrandLoader.tsx`, `BrandLoader.module.css`, `RevealOnScroll.tsx` and `useBrandLoaderGate.ts` (stored locally to compare after the work).

| Route | Content | SEO and structure | Motion |
|---|---|---|---|
| `/` | Comparison table section (H7) and "Traditional vs YBS" headline; "Most Popular"; "No obligation" CTA; 3-stat strip with "White-Glove" non-stat | Title/description inherited from layout. No page-level canonical differences. Single H1 in hero (protected) | Generic up/left/right reveals on every block. `stagger` wrapper on card grids. Ecosystem has defects |
| `/about` | Anti-traditional philosophy block, invented quote, invented origin story | Title ok. Duplicated OG description | Reveal wrappers; quote block hidden until revealed |
| `/services` | "No à la carte, no surprise invoices"; AEO heading block of generic copy | Heading hierarchy ok. Inline styles for centered blocks | Single reveal around full list |
| `/the-ybs-difference` | Comparison table (correct home), but also "no hidden desk fees / no variable costs" and duplicated tier explanation (two blocks) | Title ok | Reveal + scale on table |
| `/how-it-works` | "Annual commitment", "No hidden fees" | Title ok | Reveal |
| `/leadership` | Invented quote, "industry veteran" | Person schema absent | Reveal |
| `/faq` | "No hidden fees", "Traditional brokerages take 30–50%" | `FAQPage` JSON-LD present (single block) | Reveal per category |
| `/insights` | Placeholder posts (not substantiated content) | No `Article` schema (correct since placeholders) | Reveal |
| `/contact` | "Available worldwide", booking link `#` placeholder | No `ContactPage` schema | Reveal |

Site-wide technical findings:

1. `robots.ts` disallows `/_next/`, which blocks the CSS and JS Googlebot needs to render the page. Fix.
2. `sitemap.ts` uses `new Date()` for every `lastModified`, so every build claims every page changed. Fix: remove the field rather than invent dates.
3. Three separate root-level JSON-LD scripts (`Organization`, `WebSite`, `ProfessionalService`) with duplicate names and no `@id` links. Consolidate into one `@graph` with `@id` references. Remove the invented `priceRange`.
4. `BreadcrumbList` generator exists but the visible `Breadcrumbs` component is not used on pages. Check usage before changing.
5. Root-layout `alternates.canonical: '/'` is inherited by any page that forgets to override. Every page sets its own, so the root default is removed to avoid a wrong canonical on `not-found` and future routes.
6. Pages share the root `openGraph` image only. Per-page OG titles exist but not `url`.
7. Per-page inline `style={{ textAlign: 'center' ... }}` for the AEO headings. Move to CSS.
8. `will-change` is permanently applied to every `.reveal*` element (globals.css) and to ecosystem nodes.

Motion defects (from `YBS_IMMERSIVE_MOTION_BLUEPRINT.md` and re-verified in code):

| ID | Defect | Evidence |
|---|---|---|
| F1 | Orbit nodes lose `translateX(-50%)` centring: Motion writes `transform` for `x/y/scale`, overriding the CSS `transform: translateX(-50%)` on `.nodeTop` | `ServicesEcosystem.module.css` `.nodeTop` + motion style |
| F2 | Connection lines never draw: `strokeDasharray="1"` with `strokeDashoffset` on a non-normalised `<line>` (no `pathLength`) | `ConnectionLine` |
| F3 | Only 3 of 4 pillars on desktop; mobile uses `slice(0, 3)` | `ServicesEcosystem.tsx` |
| F4 | Raw icon id ("layers", "briefcase") printed as text | `{pillar.icon}` |
| F5 | Descriptions cut at 90 characters with an ellipsis | `slice(0, 90)` |
| F6 | `finalX/finalY` always 0 and the connection endpoints are hard-coded percentages unrelated to node positions | Props and `<svg>` |
| F7 | `stagger-children.revealed > *` starts at `opacity: 0` then animates: first frame after `revealed` flashes | globals.css |
| F8 | `.reveal` threshold 0.15 of element height fires when the top is ~85–100% down the viewport. 500 ms is too short to be perceived | RevealOnScroll + `--duration-slow` |
| F9 | Wrapping server content in client `RevealOnScroll` makes the entire section depend on an observer for visibility (hidden `html.js` state) | globals.css |
| F10 | Accordion `AnimatePresence` height animation on ServiceDetail has no reduced-motion handling | `ServiceDetail.tsx` |
| F11 | Permanent `will-change` | globals.css |

## 4. Implementation design

### 4.1 Content (Phase 3)

Homepage order, after consolidation:

1. Hero (protected, unchanged).
2. Offer strip: Monaco/Cannes retention figures and "your client data stays yours" (replaces the "Full / White-Glove" non-stats).
3. "You are the firm": independent broker's business and brand, client-data ownership, brand-kit/website/newsletter.
4. Services ecosystem (all four pillars, fixed).
5. Membership: Cannes and Monaco with included services and the key terms (24-month initial term, annual tier change, ACH dues, escrowed deal fees).
6. How it works (3 steps) with licensing eligibility.
7. Leadership preview (no invented quote).
8. FAQ preview (term, licensing, expenses).
9. Final CTA.

Removed from `/`: `ComparisonTable`, "Traditional Brokerage vs. YBS" header, "Learn More About the Difference" button repositioned as an inline link in the membership section to `/the-ybs-difference`.

Other routes: remove anti-traditional language from About, FAQ, Services, Leadership, Insights and Contact copy. Difference page retains the factual table (client data verbatim, framed as "typical structures") and loses the duplicated tier block and "no hidden fees" claims.

Tier data renamed to `cannes` / `monaco`. `featured` flag removed from display ("Most Popular" badge dropped). Both cards describe retention, monthly dues, and what is included, with the contractual qualifications in a shared terms note.

### 4.2 Technical SEO (Phase 4)

- `robots.ts`: allow all, disallow only `/api/`. Keep the sitemap line.
- `sitemap.ts`: drop synthetic `lastModified` and `changeFrequency`/`priority` (Google ignores the latter two).
- One `@graph` JSON-LD in the root layout: `Organization`, `WebSite`, `ProfessionalService` linked by `@id`. Page-level: `BreadcrumbList` on inner pages, `FAQPage` on `/faq` only. Remove unverified `priceRange` and "Worldwide".
- Metadata: a small helper builds title, description, canonical, OG and Twitter per page so values cannot drift. Titles under ~60 characters, descriptions under ~160.
- Heading structure: one H1 per page (the protected hero provides it), H2 per section, H3 per item. Replace inline-style AEO headings with a shared class.
- Internal links: contextual anchors between Services, Membership, Difference, FAQ and Contact; visible breadcrumbs on inner pages if the component is not already rendered.
- No `llms.txt`, no hidden text, no doorway pages, no competitor-name pages.

### 4.3 Motion (Phase 5)

New directory `src/components/motion/`:

| File | Role |
|---|---|
| `motion-tokens.ts` | Durations, easings, stagger, trigger line as constants mirrored in CSS custom properties |
| `motion.css` | `--m-*` tokens and `[data-m]` state rules scoped so they can never match inside a hero or loader |
| `Reveal.tsx` | Single-element reveal (rise, clip-up, fade) driven by one observer |
| `Stagger.tsx` | Parent that sets `--m-i` index on direct children (fixes F7 by never hiding children independently of the parent state) |
| `DrawRule.tsx` | Gold hairline that scales on the X axis when entering |
| `Counter.tsx` | Optional number tween, only for verified figures (75, 90) |
| `PillarIcon.tsx` | Four inline SVGs for the service pillars (fixes F4) |

Principles:

- Server HTML contains the full content. Hidden state is applied only after hydration, per element, by a layout effect that checks the element's position first: anything already above the trigger line is never hidden (no flash, F8/F9).
- Trigger: element top crosses 76% of the viewport height (`rootMargin: '0px 0px -24% 0px'`), tuned per section by prop.
- Durations: standard 950 ms, signature 1,300 ms. Stagger 120 ms with a cap of six steps so long lists do not cascade for seconds.
- Easing: `--m-ease-settle` (decelerating) for reveals, `--m-ease-draw` for rules.
- `will-change` is set for the duration of the transition only, then removed.
- Reduced motion: no transforms, no opacity changes; content final state at first render.
- No-JS: `[data-m]` is only ever set by script, so the content is visible.
- Hero text keeps using the unmodified `RevealOnScroll` and `.reveal*` CSS.

ServicesEcosystem rebuild: four nodes on a deterministic grid-aligned layout (hub plus a 2×2 arrangement on desktop, vertical list on small screens), full descriptions, SVG icons, connecting rules drawn with `pathLength`, one observer-based sequence instead of scroll-linked transforms (removes F1, F2, F5, F6 and per-frame transforms). Signature moment: hub appears, rules draw outward, pillars arrive in order.

### 4.4 Risks

| Risk | Mitigation |
|---|---|
| Accidentally changing hero visuals | No edits to protected files. Hash compare at the end. New CSS scoped to `[data-m]`. Shared `globals.css` `.reveal*` rules untouched |
| Hidden content before hydration | Hidden state only after layout effect; content present in SSR HTML |
| Copy over-promising | Every sentence traced to §1 |
| Unverified contact data | Not added until the client confirms |

## 5. Verification criteria

1. `npx tsc --noEmit`, `npm run lint`, `npx next build` pass with route count unchanged (14 static outputs).
2. Protected hashes unchanged.
3. SSR HTML for `/` contains tier names, retention figures and all four pillars, and does not contain "Traditional Brokerage vs".
4. `rg` finds no comparison or "traditional brokerage" copy outside `/the-ybs-difference`, the data file and the FAQ question allowed by the plan (none kept).
5. `robots.txt` has no `/_next/` rule. JSON-LD parses as valid JSON and `@id` references resolve.
6. Browser check at 1440×900 and 390×844: reveal fires when the element's top is about 76% down, no layout shift, ecosystem aligned, reduced-motion emulation shows all content.
7. Build output route sizes recorded before and after.

## 6. Out of scope

Image generation or replacement, hero or loader changes, blog content invention, analytics installation, paid tools.

## 7. Open questions for the client

1. Confirm the public domain (`yachtbrokerservices.com` in code vs `www.yachtbroker.services` in the script), phone and address for schema and footer.
2. Provide Kent's surname, biography and any approved quote.
3. Confirm whether accounting services are included (brand film and client text mention them, the Explainer does not itemise them).
4. Confirm the booking link for "Schedule a Call".
5. Supply the Independent Broker Membership Agreement for legal review of every contractual qualification.
