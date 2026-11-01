# 00 – Decisions, conflict resolution, build order & ownership

Owner: **Overseer**. Other agents: append only under `## Notes from <agent>` at the bottom.

> **Status: APPROVED** – Overseer, 2026-11-01. This file wins over every other spec.

## 1. Precedence (which spec decides what)

| Question | Decides | Then |
|---|---|---|
| Anything listed in this file | **00** | – |
| Routes, slugs, nav items, link relations | 01 | – |
| Section order, geometry and bg per page, component props | **05** (supersedes the 04 §3.2 recipes and the 03 §3 orders) | 04 rotation rules |
| H1, title, meta, H2 outline, FAQ questions, schema, word counts | 02 | – |
| Copy wording, CTA labels, trust, urgency, the whole lead form | 03 | – |
| Tokens, geometry visuals, motion, header/footer/form look | 04 – and the **existing homepage components win** on visual details | – |
| Every number | `src/content/facts.ts` | if no fact exists → write the sentence without a number |
| Images | 07 + `src/content/images.ts` | – |

## 2. Decision log (conflicts resolved)

1. **Content files.** `company.ts` + `navigation.ts` (01/03/05) become **one file `src/content/site.ts`** (exports `site` = NAP, metrics, `responseTime`, guarantees, `isPlaceholder`, and `navigation`). New foundation file **`src/content/registry.ts`**: slug + `shortTitle` (+ kennisbank category) for every routable item. `links.ts`, nav, footer, breadcrumbs and `sitemap.ts` read the registry, so they never depend on a builder's content file. Builders' content files must use exactly the registry slugs (typed unions `ServiceSlug`, `ComparisonSlug`, `ProjectSlug`, `PostSlug`, `ArticleSlug` exported by the registry).
2. **Shared types** live in `src/content/types.ts` (foundation): `Service`, `Comparison`, `Project`, `Post`, `Article`, `TeamMember`, `Review`, `FaqItem`, `ImageRef`, `Cta`, `LinkItem`, `Bg`. Builders may add page-specific optional fields with an intersection type in their own file; they never edit `types.ts` (request changes under Notes).
3. **Header on home**: the Hero's inline header is removed; the shared `site/Header` is used on every page (01 said "non-home only" – overruled by 04 §5.1).
4. **LeadSection** look = framed image with deep-green overlay + white form card (05 §0.3-1). Copy = 03 §6 (heading, 4 promise checks, success text "Bedankt, {voornaam}! Je aanvraag is goed aangekomen."). The 04 wording is dropped. The verbruik toggle defaults to "€ per maand".
5. **Response time**: one value `site.responseTime` (PLACEHOLDER "2 werkdagen"). 02 said "1 werkdag" – fixed.
6. **Home order** = 05 §1 (pain stack → Mission → Services slide-over → myth → data → PVT → house teaser → projects → reviews → comparisons → FAQ → lead). DoubtsSection is not used in v1.
7. **Titles and claims**: no bare "naar ~€0" in titles, H1s or process promises. Home title = `VB-TEC | Je energiefactuur zo dicht mogelijk bij €0`; default title = `VB-TEC – energie-ingenieurs voor jouw woning`; /hoe-we-werken H1 = "Van je jaarafrekening naar een installatie die écht opbrengt". The lucht-water meta no longer says "premie tot €6.000" (that is income category 4 only).
8. **Placeholder-safe structured data** (02 §0.7 updated): no Review/AggregateRating; no `Person` for placeholder team members (the Article author is then the Organization); `LocalBusiness`/`Organization` emit telephone, e-mail, address and opening hours only when `site.isPlaceholder === false`. FAQPage is emitted on **every** page with a visible FAQ of ≥3 items.
9. **Review score**: while `reviews.isPlaceholder`, no score and no platform name anywhere (no "4,9/5", no "Google"). Show the label "Voorbeeldreviews" and leave the score out of the hero trustline. The trustline is "Gratis en vrijblijvend · Berekend door een ingenieur · Eerlijk, ook als het niet loont".
10. **Facts added/fixed** (Overseer checked all the derived maths):
    - Added: `zelfverbruikZonder`, `zelfverbruikMet`, `scopLuchtLucht`, `levensduurGasketel`, `levensduurOmvormer`, `evVerbruikPer100km`, `kostPer100kmThuisNet`, `kostPer100kmZonOverschot`, `warmtekostElektrischPerKwhWarmte`, `warmtekostAircoPerKwhWarmte`, `terugverdientijdZonnepanelen`. They are all `estimate: true`, and the ones marked "bron te bevestigen" are VB-TEC working assumptions that need a source before launch.
    - Fixed in MYTHS: the solar payback "6–10 jaar" was optimistic. Our own maths gives ca. 7 years at 65% zelfverbruik and ca. 12 years at 30%, so the text now says "ca. 7 à 12 jaar, hoe meer zelfverbruik hoe sneller". The "2,5 à 3× duurder" line now says "bij een gemiddeld contract", because with the cheapest gas contracts the ratio is much higher.
    - `terugdraaiendeTellerEinde` is now flagged as an estimate: verify it, and copy names no year until it is verified.
    - The CRO myth bank keys were mapped to real fact keys. The CRO line "toestellen worden niet goedkoper" was rewritten, because battery prices are falling (that is in our own facts). The urgency line on net tariffs is hidden until a fact exists.
11. **Comparisons**: all 6 are built in v1. The 20-year lines use **flat prices** (no invented growth %), and the assumptions say so. When an option has no fact-backed cost (dynamisch contract), use table mode without a chart. Social proof = last StackCards card is a review. The DataBand gets 1–2 urgency rows that are backed by facts.
12. **Lead `interesse` values** = service slugs plus `"advies"` ("Ik weet het nog niet"). Comparisons preselect services through `comparison.interesse: ServiceSlug[]`, for example gasketel-vs-warmtepomp → `["lucht-water-warmtepomp"]` and vast-vs-dynamisch → `["thuisbatterij","laadpalen"]`. Never put `?interesse=` in a URL.
13. **Images**: generating images is not part of the build. `images.ts` maps the 14 keys from 07 to the closest existing stock image, with an alt text that describes the photo actually shown. Swapping in real photos later is one edit in `images.ts`. Team portraits stay silhouettes.
14. **Word counts** (02 §0.4) count visible FAQ answers, Kort antwoord, table cells and card bodies. The comparison target is 1200 words; the "pref. 1500" is dropped.
15. **Existing home components**: Foundation does the mechanical refactor: fonts move to the layout, the Hero inline header is removed, Enerza → VB-TEC (3 occurrences), the Mission `[data-hold-fade]` selectors become Reveal/in-view per 04 §4.3, and CountUp moves to `motion/`. After that, **Builder 1** owns `src/components/{hero,products,mission,services,doubts}` for the Dutch copy and data wiring through `src/content/home.ts`.

## 3. Honesty rules (consolidated, binding for all builders)

- Every number goes through `fact()`/`FactValue` with a `FactNote` ("indicatief · bron · stand"). MYTHS prose may carry numbers, but only numbers that match `facts.ts`.
- "€0" only appears as "tot ~€0" or "zo dicht mogelijk bij €0", plus a footnote with the assumptions. Never write "gratis energie", give a guarantee, or invent a percentage.
- Every placeholder data file starts with `// PLACEHOLDER – vervang door echte gegevens` and has `isPlaceholder: true`. The UI shows the badges "Voorbeeldproject" and "Voorbeeldreviews". Do not use third-party logos or quality labels, and do not name a real customer.
- Placeholder project figures must be consistent with `facts.ts` (for example, a gas household of ca. 17.000 kWh plus 3.500 kWh stroom pays ca. €3.300/jaar, about €275/maand). Builder 3 writes the derivation as a comment.
- Urgency is factual only (03 §5). No countdowns.
- PVT: no yield or price numbers, only "per project berekend". "Weinig installateurs bieden PVT aan" is the client's own claim; phrase it as VB-TEC's statement and do not cite a market statistic.

## 4. Folder ownership

One owner per path. Anyone else needs a Note to the owner (in this file or the owner's spec).

| Owner | Paths |
|---|---|
| **Foundation** (shared – built first, then frozen; after phase 1 changes only via Notes) | `src/app/layout.tsx`, `src/app/globals.css`, `src/app/opengraph-image.tsx`, `src/components/ui/**`, `src/components/motion/**`, `src/components/layout/**`, `src/components/site/**`, `src/components/lead/**`, `src/components/sections/**` **except** `sections/house-diagram/**`, `src/lib/**` (`lead.ts`, `schema.ts`, `routes.ts`, `links.ts`, `format.ts`), `src/content/site.ts`, `registry.ts`, `types.ts`, `images.ts`, `reviews.ts`, `faqs.ts` (generic FAQs reused across pages: cost of a berekening, regio, gegevens, vastzitten), `facts.ts`. Phase-1 one-off refactor of `src/components/{hero,mission,products,services}` (decision 15). |
| **Builder 1** | `src/app/page.tsx`, `src/app/hoe-het-werkt/**`, `src/app/vergelijken/**`, `src/content/comparisons.ts`, `src/content/home.ts`, `src/content/hoe-het-werkt.ts`, `src/content/system.ts` (house diagram data), `src/components/sections/house-diagram/**` (HouseDiagram teaser/full/**mini**), `src/components/comparison/**`, and after phase 1 `src/components/{hero,products,mission,services,doubts}/**` |
| **Builder 2** | `src/app/diensten/**`, `src/app/over-ons/**`, `src/app/hoe-we-werken/**`, `src/app/team/**`, `src/app/contact/**`, `src/content/services.ts`, `src/content/team.ts`, `src/content/company-pages.ts` (copy and FAQs for over-ons / hoe-we-werken / team / contact), `src/components/service/**` (CurveExplorer, BatterySizer, HubGrid) |
| **Builder 3** | `src/app/blog/**`, `src/app/kennisbank/**`, `src/app/projecten/**`, `src/app/privacy/**`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`, `src/content/blog.ts`, `src/content/kennisbank.ts`, `src/content/projects.ts`, `src/components/content/**` (ProjectFilterGrid, ScenarioTable, article/TOC helpers) |

Cross-builder dependencies, with the contracts that keep them unblocked:
- **Builder 2 → Builder 1 `HouseDiagram mode="mini"`**: the props are fixed in 05 §8.4 (`{ mode, highlight?: ServiceSlug[], scenes?, id? }`). Builder 1's **first commit** is `sections/house-diagram/HouseDiagram.tsx` with that signature. It may start as a stub that renders the text alternative; the full SVG comes later.
- **Everyone → Builder 3 `projects.ts`**: Builder 3 writes it **first**, with getters `getProject(slug)`, `getProjectsByService(slug)` and `featuredProjects`.
- **Builder 3 → Builder 2 `team.ts`**: blog and kennisbank authors. Builder 2 writes it first, with `getTeamMember(slug)`.
- **Builder 1 → Builder 2 `services.ts`**: the home ProductsSection labels can come from the registry. `services.ts` is only needed for `heroFact`, etc.
- Until a dependency exists, consume the **registry and types** (links, names) and render nothing for the missing data. Never create another owner's file.

## 5. Build order

**Phase 1 – Foundation (one agent, sequential, ≈30% of the budget)**
1. Tokens and fonts in `globals.css`/`layout.tsx` (`lang="nl-BE"`, `metadataBase`, title template, Organization and WebSite JSON-LD), `types.ts`, `registry.ts`, `site.ts`, `images.ts`, `lib/routes.ts`, `lib/links.ts`, `lib/schema.ts`, `lib/format.ts`.
2. Primitives `ui/*` (Section, SectionIntro, CtaPill, TextLink, IconCircle, icons, Tag, FactNote, FactValue, KortAntwoord, TrustLine, PlaceholderBadge, Breadcrumbs, JsonLd, SmartImage, Accordion, Callout, InlineCta, AuthorBox, SourcesList, ComparisonTable, the cards and the charts) and `motion/*` (Reveal, WordReveal, CountUp, ScrollProgress).
3. Chrome: `site/Header` (mega panels may be simple column dropdowns), MobileMenu, MobileStickyCta, Footer, SkipLink.
4. Lead: `lead/*` + `src/lib/lead.ts` (`submitLead` Server Action, validation per 03 §6.6, logs only).
5. Sections A–J + PageHero, Statement, DataBand, Faq, Prose, CtaBand.
6. The one-off home component refactor (decision 15), `reviews.ts`, `faqs.ts`, `opengraph-image.tsx`.
7. Hand-off: a short "how to use" for every exported component, appended under Notes in 05 (props match 05 §8). Smoke-check `/` returns 200.

**Phase 2 – Builders 1, 2, 3 in parallel.** Each builder works in this order:
- (a) content data files + the exported stubs that others depend on (§4);
- (b) pages, in priority order;
- (c) self-check (§6).

| Builder | Priority order (if time runs out, the tail is cut, not the quality) |
|---|---|
| 1 | `HouseDiagram` stub → `comparisons.ts` + `/vergelijken/[slug]` (gasketel-vs-warmtepomp first) → home `/` → `/hoe-het-werkt` (full diagram) → `/vergelijken` hub |
| 2 | `team.ts` → `services.ts` + `/diensten/[slug]` (lucht-water first, then thuisbatterij, zonnepanelen, the rest) → `/contact` → `/hoe-we-werken` → `/diensten` hub → `/over-ons` → `/team` → signature widgets (BatterySizer, CurveExplorer; fallback = F Bento) |
| 3 | `projects.ts` → `/projecten/[slug]` + hub → `kennisbank.ts` + `/kennisbank/[slug]` + hub → `blog.ts` + `/blog/[slug]` + hub → `not-found.tsx`, `/privacy` → `sitemap.ts`, `robots.ts`, `llms.txt` |

**Phase 3 – QA/integration (one agent).** This agent alone may run `next build`. It also checks broken links (registry), schema validity, the mobile 360/390 px layouts, keyboard and screen-reader basics on the form, and an honesty grep: `Enerza`, `gratis energie`, "€0" without "tot ~"/"zo dicht mogelijk", hard-coded digits in JSX copy outside `fact()`, the review "Google"/score wording.

**Phase 4 (optional)** – generate the images from 07 and swap them in `images.ts`.

## 6. Builder rules and self-check

- Read `node_modules/next/dist/docs/` for any API you touch. Next 16 rules:
  - `params` is a Promise. Keep the page component non-async and await `params` inside a `<Suspense>` child. `generateMetadata` awaits `params`.
  - `generateStaticParams` returns every slug (≥1). There is no `dynamicParams` export; unknown slugs call `notFound()`.
  - Use `next/image` `preload` (not `priority`), with quality 75 or 90 only.
  - Forms use `useActionState`.
  - No `Date.now()` or `Math.random()` in render. Dates are static strings.
  - JSON-LD goes through `JsonLd` (`JSON.stringify(...).replace(/</g,'\\u003c')`).
- Never start a dev server and never run `next build`. Check with `npx tsc --noEmit` and with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/<route>` (expect 200, or 404 for an unknown slug).
- CSS Modules only (no Tailwind classes). Use tokens from `globals.css`. Below 900 px use explicit px.
- Every page ends with `LeadSection` (`bron`, `defaultInteresse`), except `/contact` (the form is the hero), `/privacy` and the 404 page (CtaBand).
- One H1. Breadcrumbs everywhere except home and 404. Self canonical without a trailing slash.
- Before you finish, append to `## Notes from <builder>` in this file: what you built, any deviation from 05 and why, and any missing facts or contracts.

## 7. Scope cuts (time budget)

These are cut from v1: per-template OG images, full mega-menu feature photo tiles (a text column is enough), DoubtsSection, the 20-year "jouw verbruik" slider, and the analytics events (no-op only). The ReviewWall marquee is optional; the static masonry wall counts as compliant. Scroll-scrubbed word reveal is used only inside `@supports (animation-timeline: view())`; otherwise words reveal once on view. The 7 product tiles wait for real cut-outs, so the strip keeps 5 tiles plus 2 tags (05 §0.3-5).

## 8. Open issues (for the client)

- Real domain, NAP, BTW-nr, certifications (RESCert?), response time, lead time, guarantees, "geen voorschot vóór akkoord".
- Real reviews (source and permission), real projects with measured figures, the real team, and a real % "afgeraden".
- Sources for the Overseer-added assumption facts (zelfverbruik, SCOP airco, lifetimes, EV consumption), and verification of `terugdraaiendeTellerEinde`.
- Gas prices are volatile: `breakEvenScop` rises to ca. 3,4 at 8 c/kWh gas. Recalculate `facts.ts` every quarter.
- Work area: only Vlaanderen, or Brussel too?

## Notes from other agents

### Notes from Foundation (phase 1, 2026-11-01)
- Built: tokens/fonts/layout (lang nl-BE, metadataBase, title template, Organization + WebSite JSON-LD), `content/{types,registry,site,images,reviews,faqs}.ts`, `lib/{routes,links,schema(+jsonld alias),seo,format,lead-schema,lead}.ts`, Server Action `app/actions/lead.ts`, `components/{ui,motion,sections,site,lead}`, `app/opengraph-image.tsx`, home rebrand (Hero inline header removed, Dutch copy, Products → /diensten/*, Mission entrance on Reveal, CountUp → motion/) + LeadSection on `/`.
- Full API + usage: **`docs/spec/06-components.md`**. Pages must NOT render `<main>` (layout does).
- Deviations listed in 06 §6 (no desktop header phone link, ScenarioTable left to Builder 3, aliases for brief names).

### Notes from Builder 1 (2026-11-01)
- Built: `/` (all 14 sections per 05 §1), `/hoe-het-werkt` (full pillar + interactive HouseDiagram), `/vergelijken` hub, all 6 `/vergelijken/[slug]`. Content: `content/{home,hoe-het-werkt,comparisons,system}.ts`. Components: `sections/house-diagram/HouseDiagram.tsx` (teaser/full/mini), `components/comparison/ComparisonView.tsx`.
- **HouseDiagram for Builder 2**: `<HouseDiagram mode="mini" highlight={["thuisbatterij","zonnepanelen"]} scenes?={["avond"]} tone?="light"|"dark" />` (client; text alternative via role="img" + figcaption). Use as `StickySplit` media `{ kind: "node", node: … }`.
- `v(key, { scale, dec, year, pre })` in `content/comparisons.ts` formats a fact for copy strings (adds "ca." for estimates) – reusable.
- Deviations from 05: comparison row 5 uses `MythBuster` (Statement's support column is too narrow for the 3-column MythList); /hoe-het-werkt chapters use mini house diagrams as media instead of the stock photos (scroll-step highlight per chapter); comparison row 4 ImagePanel has only the soft project link (no lime CTA). Charts: line (20 j.) for gasketel/WP and zonnepanelen, 15 j. for batterij (no battery lifetime fact), bar chart for warmtepomp-vs-airco, table only for PVT and dynamisch (00 §2.11). Gas-boiler purchase is counted at €0 (no fact; conservative, stated in assumptions).
- Open: unknown `/vergelijken/<slug>` returns a streamed 200 + noindex in dev (notFound inside Suspense, documented Next 16 behaviour). Missing facts that would sharpen copy: gasketel price, airco price, battery lifetime, PVT yield.

### Notes from Builder 3 (2026-11-01)
- Built: `/projecten` (+ client filter, featured, review wall, FAQ "Hoe we resultaten meten") and all 6 `/projecten/[slug]`; `/kennisbank` (client search + category anchors, lime statement, FAQ) and all 9 `/kennisbank/[slug]`; `/blog` (featured + grid, kennisbank rail) and all 6 `/blog/[slug]`; `/privacy` (placeholder legal text, marked); `src/app/not-found.tsx`; `src/app/sitemap.ts` (46 URLs: pages + services/comparisons from the registry + my content files, static `lastModified`); `src/app/robots.ts` (allow all + AI/search bots); `public/llms.txt`.
- Content: `content/projects.ts` (`allProjects`, `getProject`, `getProjectsByService`, `featuredProjects`, `projectFaq`, type `ProjectDetail`; derivation of every placeholder figure in comments, flat prices, consistent with facts.ts), `content/kennisbank.ts` (`allArticles`, `getArticle`, `getArticlesByCategory`, `articlesBySlugs`), `content/blog.ts` (`allPosts`, `postsByDate`, `getPost`, `postsBySlugs`). Numbers in copy go through `components/content/fx.ts` (`fx`, `eur`, `year`) so they always match facts.ts.
- Components (`components/content/**`): `ScenarioTable`, `ProjectFilterGrid`, `KennisbankBrowser`, `ArticleTemplate` (shared blog/kennisbank detail), `FeatureCard`.
- Honesty choices: Gent excludes PVT thermal gain and publishes no PVT price/payback; Hasselt states the battery takes ca. 15 years on fixed prices (dynamic benefit not counted); Kortrijk = battery advised against; Brugge says no airco premie (not sole heating). No year named for the end of the terugdraaiende teller.
- Deviations: project page row 5 ("Galerij") is a `Rail kind="image"` titled "Gebruikte technieken" with one caption per installed component (merges 02's H2 "Gebruikte technieken" with the gallery). Placeholder family names were aligned with `reviews.ts` (Sarah/Gent, Pieter/Kortrijk, An/Antwerpen, Els & Koen/Leuven, Marc/Brugge).
- Open: (1) `reviews.ts` names the Hasselt couple "Lotte & Bram" – same first names as team members Lotte Claes and Bram Wouters; suggest renaming (my project uses "Ann en Bart"). (2) Unknown `/blog|/kennisbank|/projecten/<slug>` returns streamed 200 + noindex in dev (notFound inside Suspense, documented Next 16 behaviour); `/<unknown>` returns a real 404. (3) Missing facts that would sharpen project copy: PVT yield/price, laadpaal price, airco price, battery lifetime.

### Notes from Builder 2 (phase 2, 2026-11-01)
- Built: `content/team.ts` (7 placeholder members, engineers first, `getTeamMember`, `TEAM_GROUPS`, `isPlaceholder`), `content/services.ts` (7 services + `dienstenHub`, number helpers `fx/cent/centNum/eur/year/pct` – every number in copy is interpolated from facts.ts), `content/company-pages.ts` (over-ons, hoe-we-werken, team, contact copy + FAQs). Routes: `/diensten`, `/diensten/[slug]` ×7, `/over-ons`, `/hoe-we-werken`, `/team`, `/contact` – all 200, tsc + lint clean.
- Components (`components/service/`): `HubGrid` (editorial grouped rows instead of a card grid), `CurveExplorer` (DayCurve for zonnepanelen / PeakCurve for laadpalen; illustrative profiles, numbers only from facts), `BatterySizer` (4 profiles incl. two honest "geen batterij" outcomes; sizing is a rule of thumb, no invented kWh numbers), `RoomCard` (lucht-lucht rail). Page-specific: `app/diensten/[slug]/_components/{ServiceView,ServiceSignature}`, `app/team/_components/TeamGrid`, `app/contact/_components/{ContactAside,ContactDetails}` (static stylised Flanders map).
- Signatures per 05 §3.1: zonnepanelen X DayCurve · pvt E Timeline (R&D, placeholder steps) · omvormers F Bento · thuisbatterij X BatterySizer · laadpalen X PeakCurve · lucht-water F Bento · lucht-lucht I Rail (rooms). Row 4 uses Builder 1's `HouseDiagram mode="mini"`.
- Deviations: (1) PVT extra H2s ("PVT als bron voor een warmtepomp", "Waarom zo weinig installateurs PVT aanbieden") live as h2 steps in the row-4 StickySplit; "Ons onderzoek naar PVT" is the Timeline h2. (2) Story row uses `projects.ts` quote + headline; falls back to the matching review. (3) /over-ons "Onderzoek naar PVT" is an h2 timeline step; "Waar we werken" is folded into the FAQ title (+ generic `regio` FAQ). (4) /hoe-we-werken "Wat kost het en hoe lang duurt het?" = FAQ title. (5) /team rail = kennisbank + blog items by our authors (sorted by date). (6) Unknown `/diensten/<x>` renders the not-found UI with `noindex` but HTTP 200 in dev because the content streams inside `<Suspense>` (Next 16 behaviour, see not-found docs); `notFound()` is also called in generateMetadata.
- Laadpalen bar "goedkope uren" has no fact → qualitative label ("meestal goedkoper, wisselt per uur"), illustrative bar length, said so in the note. Omvormer "string vs hybride" bar compares functions, not numbers (withNote false).
- Open: guarantee terms, R&D dates, certifications (RESCert wording marked as voorbeeldtekst), team members/counts are PLACEHOLDER.
