# QA – SEO + AEO audit

Owner: **SEO+AEO agent** · run 2026-11-01 against `http://localhost:3000` (dev server) · other agents append under `## Notes from <agent>`.

## Method
Every URL in `/sitemap.xml` (46) was curled and parsed (BeautifulSoup): `<h1>` count, `<title>`, meta description, canonical, `html[lang]`, OG/Twitter tags, every `application/ld+json` block (`JSON.parse` + `@type`), FAQPage Q/A text vs visible DOM (verbatim match + 30–70 words), BreadcrumbList, visible breadcrumb nav, image `alt`, internal links (header/footer/mega-menu/breadcrumb excluded) vs 01-sitemap §5, and words = visible text of `<main>` + streamed Suspense chunks, minus nav/header/footer/form/`#berekening`.

## Global results
- **All 46 routes**: 200, exactly one H1 (spec wording), `lang="nl-BE"`, self-canonical on `https://www.vb-tec.be` (no trailing slash), og:title/description/url/locale/type/image + twitter card, valid JSON-LD (Organization + WebSite everywhere), visible breadcrumbs + BreadcrumbList on every non-home page.
- **FAQ**: FAQPage on every page with ≥3 visible FAQs; all JSON-LD questions/answers appear verbatim in the DOM (`<details>`, in initial HTML); all answers 40–60 words (none outside 30–70).
- **Schema per template** matches 02 §0.7: Service (areaServed Vlaanderen, no offers), Article (hoe-het-werkt, comparisons, kennisbank, projects), BlogPosting, HowTo, AboutPage, ContactPage, ItemList (hubs), HomeAndConstructionBusiness (home/contact, no placeholder NAP). No Review/AggregateRating/Person emitted (placeholder-safe ✔).
- **OG type** `article` on hoe-het-werkt, comparisons, kennisbank, blog, projects.
- **Images**: 0 missing alt, all Dutch and descriptive, family/home-centred where photographic.
- `/sitemap.xml` lists all 46 routes (priorities per 01 §6); `/robots.txt` allows `*` + the 9 AI crawlers and references `https://www.vb-tec.be/sitemap.xml`. `/llms.txt` present. 404 → noindex.

## Per-route table
Title length includes ` | VB-TEC`. Words = measured / spec minimum. FAQ = FAQPage questions.

| Route | HTTP | Title len | Desc len | Words | FAQ | Schema (besides Org/WebSite) | Imgs | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | 51 | 162 | 2987 / 900 | 6 | FAQPage, HomeAndConstructionBusiness | 22 | OK |
| `/hoe-het-werkt` | 200 | 60 | 155 | 3966 / 1800 | 6 | Article, BreadcrumbList, FAQPage | 6 | OK |
| `/diensten` | 200 | 69 | 149 | 725 / 400 | 4 | BreadcrumbList, FAQPage, ItemList | 12 | OK |
| `/vergelijken` | 200 | 68 | 156 | 956 / 400 | 4 | BreadcrumbList, FAQPage, ItemList | 1 | OK |
| `/projecten` | 200 | 61 | 162 | 1221 / 400 | 5 | BreadcrumbList, FAQPage, ItemList | 8 | OK |
| `/blog` | 200 | 63 | 151 | 551 / 400 | 0 | BreadcrumbList, ItemList | 7 | OK |
| `/kennisbank` | 200 | 66 | 152 | 1103 / 400 | 5 | BreadcrumbList, FAQPage | 1 | OK |
| `/over-ons` | 200 | 60 | 160 | 986 / 700 | 5 | AboutPage, BreadcrumbList, FAQPage | 4 | OK |
| `/hoe-we-werken` | 200 | 59 | 153 | 1300 / 700 | 6 | BreadcrumbList, FAQPage, HowTo | 2 | OK |
| `/team` | 200 | 60 | 127 | 906 / 300 | 4 | BreadcrumbList, FAQPage | 1 | OK |
| `/contact` | 200 | 55 | 129 | 499 / 300 | 4 | BreadcrumbList, ContactPage, FAQPage, HomeAndConstructionBusiness | 0 | OK |
| `/privacy` | 200 | 37 | 121 | 609 / 0 | 0 | BreadcrumbList | 0 | OK |
| `/diensten/zonnepanelen` | 200 | 61 | 155 | 2877 / 1200 | 7 | BreadcrumbList, FAQPage, Service | 9 | OK |
| `/diensten/pvt-panelen` | 200 | 60 | 150 | 2466 / 1200 | 6 | BreadcrumbList, FAQPage, Service | 10 | OK |
| `/diensten/omvormers` | 200 | 54 | 148 | 2313 / 1200 | 6 | BreadcrumbList, FAQPage, Service | 10 | OK |
| `/diensten/lucht-water-warmtepomp` | 200 | 62 | 137 | 2980 / 1200 | 8 | BreadcrumbList, FAQPage, Service | 10 | OK |
| `/diensten/lucht-lucht-warmtepomp` | 200 | 53 | 146 | 2165 / 1200 | 6 | BreadcrumbList, FAQPage, Service | 13 | OK |
| `/diensten/thuisbatterij` | 200 | 63 | 159 | 2708 / 1200 | 7 | BreadcrumbList, FAQPage, Service | 9 | OK |
| `/diensten/laadpalen` | 200 | 59 | 159 | 2220 / 1200 | 6 | BreadcrumbList, FAQPage, Service | 9 | OK |
| `/vergelijken/gasketel-vs-warmtepomp` | 200 | 62 | 153 | 3203 / 1200 | 9 | Article, BreadcrumbList, FAQPage | 5 | OK |
| `/vergelijken/met-of-zonder-thuisbatterij` | 200 | 58 | 156 | 2487 / 1200 | 7 | Article, BreadcrumbList, FAQPage | 5 | OK |
| `/vergelijken/met-of-zonder-zonnepanelen` | 200 | 64 | 154 | 2604 / 1200 | 7 | Article, BreadcrumbList, FAQPage | 5 | OK |
| `/vergelijken/warmtepomp-vs-airco` | 200 | 55 | 152 | 2224 / 1200 | 7 | Article, BreadcrumbList, FAQPage | 5 | OK |
| `/vergelijken/zonnepanelen-vs-pvt-panelen` | 200 | 44 | 151 | 1747 / 1200 | 6 | Article, BreadcrumbList, FAQPage | 4 | OK |
| `/vergelijken/vast-vs-dynamisch-energiecontract` | 200 | 61 | 153 | 1851 / 1200 | 7 | Article, BreadcrumbList, FAQPage | 5 | OK |
| `/kennisbank/wat-is-het-capaciteitstarief` | 200 | 60 | 142 | 1291 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/injectietarief-en-zelfverbruik` | 200 | 62 | 152 | 1583 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/dynamisch-tarief-uitgelegd` | 200 | 62 | 155 | 1342 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/scop-en-cop-uitgelegd` | 200 | 49 | 146 | 1529 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/is-mijn-woning-geschikt-voor-een-warmtepomp` | 200 | 53 | 158 | 1255 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/wat-is-een-pvt-paneel` | 200 | 48 | 153 | 1266 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/hoe-groot-moet-een-thuisbatterij-zijn` | 200 | 47 | 149 | 1427 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/mijn-verbouwpremie-voor-energie` | 200 | 61 | 148 | 1496 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/kennisbank/epc-en-renovatieverplichting` | 200 | 56 | 138 | 1362 / 900 | 5 | Article, BreadcrumbList, FAQPage | 3 | OK |
| `/projecten/gezinswoning-gent-warmtepomp-pvt` | 200 | 47 | 148 | 1431 / 500 | 5 | Article, BreadcrumbList, FAQPage | 10 | OK |
| `/projecten/nieuwbouw-leuven-all-electric` | 200 | 55 | 149 | 1421 / 500 | 5 | Article, BreadcrumbList, FAQPage | 10 | OK |
| `/projecten/rijwoning-antwerpen-zon-batterij` | 200 | 52 | 157 | 1305 / 500 | 5 | Article, BreadcrumbList, FAQPage | 9 | OK |
| `/projecten/fermette-brugge-airco-zonnepanelen` | 200 | 49 | 156 | 1309 / 500 | 5 | Article, BreadcrumbList, FAQPage | 9 | OK |
| `/projecten/koppel-hasselt-laadpaal-dynamisch` | 200 | 47 | 153 | 1340 / 500 | 5 | Article, BreadcrumbList, FAQPage | 9 | OK |
| `/projecten/gezin-kortrijk-geen-batterij-advies` | 200 | 61 | 155 | 1309 / 500 | 5 | Article, BreadcrumbList, FAQPage | 9 | OK |
| `/blog/loont-een-warmtepomp-nog-in-2026` | 200 | 53 | 145 | 2077 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |
| `/blog/einde-terugdraaiende-teller-wat-nu` | 200 | 58 | 142 | 1492 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |
| `/blog/capaciteitstarief-verlagen-zo-doe-je-het` | 200 | 59 | 144 | 1199 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |
| `/blog/gasketel-verbod-vlaanderen-wat-betekent-het` | 200 | 57 | 136 | 1516 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |
| `/blog/waarom-wij-soms-nee-zeggen` | 200 | 53 | 133 | 1315 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |
| `/blog/dynamisch-energiecontract-ja-of-nee` | 200 | 62 | 140 | 1352 / 900 | 4 | BlogPosting, BreadcrumbList, FAQPage | 5 | OK |

Internal-link matrix (01 §5): services link to pillar, 2–3 complementary services, their comparisons, 2–3 articles, ≥1 post, `/team` and all their related projects; comparisons link to involved services, 2 comparisons, 1–2 projects, 2–3 articles, 1 post, pillar; kennisbank/blog link to pillar, 2 services, 1 comparison, 2 articles/posts, author → `/team`; projects link to products used, 1 comparison, 2 other projects, 1 article.

## Fixes applied in this pass
1. **og:image missing on all 45 non-home pages** – page-level `openGraph` replaced the layout's (shallow merge) and dropped the file-based image. `src/lib/seo.ts` now attaches `/opengraph-image` (1200×630 + alt) to `openGraph.images` and `twitter.images`.
2. **Article schema** (`src/lib/schema.ts` `article()`): `image` falls back to the OG image and `datePublished` to `dateModified` (were missing on hoe-het-werkt, comparisons, projects).
3. **Internal links**: service pages now link every `relatedProjects` item (thuisbatterij, laadpalen, lucht-water were missing one) – `ServiceView.tsx`; comparisons, kennisbank and blog now link the pillar `/hoe-het-werkt` (`ComparisonView.tsx`, `ArticleTemplate.tsx`); project pages link their 2nd related project (`projecten/[slug]/page.tsx`).
4. **Meta descriptions** of 4 projects trimmed to ≤160 chars (`src/content/projects.ts`).
5. `RelatedLinks` rendered `class="undefined …"` – fixed class join.
6. `npx tsc --noEmit` ✔, `npm run lint` ✔.

## Open issues / accepted deviations
- **Soft 404 on unknown dynamic slugs** (e.g. `/diensten/bestaat-niet`): HTTP 200 in dev because `notFound()` runs inside the streamed Suspense child (Next 16 cacheComponents pattern); Next injects `noindex` + the not-found UI, so not indexable. Verify status in the production build; if still 200, consider a `proxy.ts` slug allow-list.
- Home and `/projecten` metas are 162 chars and hub titles (`/diensten` 69, `/vergelijken` 68, `/kennisbank` 66) exceed 60 incl. suffix – both verbatim from the approved spec; Google may truncate the tail ` | VB-TEC`. Acceptable.
- Kennisbank back-links: each article links 2 services that list it, not always the *first* 2 per 01 §5.2 (e.g. capaciteitstarief → thuisbatterij/laadpalen, not zonnepanelen). Semantically correct; left as is.
- `/diensten/lucht-water-warmtepomp` links 3 of its 4 cluster articles (EPC not linked) – spec allows 2–3.
- Home H1 contains a footnote link `*` → `#voetnoot-nul` (honesty footnote); harmless for SEO.
- `og:image` URLs use the PLACEHOLDER domain `www.vb-tec.be` (metadataBase) – update with the real domain.
- Keyword volumes still unvalidated (02 §1) – check with GSC/DataForSEO after launch.

## Notes from other agents
