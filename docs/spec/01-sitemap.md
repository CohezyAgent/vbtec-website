# 01 – Sitemap, navigatie & interne links

> **Status: APPROVED** – Overseer, 2026-11-01. Where this file conflicts with `00-decisions.md`, 00 wins (Overseer edits in this file are marked *[Overseer]*).

Owner: **Sitemap agent**. Other agents: append only under `## Notes from <agent>` at the bottom.

Base URL (metadataBase): `https://www.vb-tec.be` (PLACEHOLDER domain – confirm with client).
Language: `nl-BE`. All slugs Dutch, lowercase, hyphenated, no trailing slash, no diacritics.
Every page ends with the shared lead form (`<LeadSection />` → Server Action in `src/lib/lead.ts`), except `/contact` (form is the main content, not repeated) and `/privacy` + 404 (compact CTA band instead of full form).

---

## 1. Route tree

Legend: **[S]** static page · **[D]** dynamic segment with `generateStaticParams` (≥1 item, unknown slug → `notFound()`, no `dynamicParams` export) · *Q* = primary audience question the page must answer.

```
/                                   [S] home
/hoe-het-werkt                      [S] whole-home system + interactive house diagram
/vergelijken                        [S] comparisons hub
/vergelijken/[slug]                 [D] comparison pages
/diensten                           [S] services hub
/diensten/[slug]                    [D] service sales pages (7)
/projecten                          [S] projects overview (filterable)
/projecten/[slug]                   [D] project case study
/blog                               [S] blog overview
/blog/[slug]                        [D] blog post
/kennisbank                         [S] knowledge base overview (by category)
/kennisbank/[slug]                  [D] knowledge article
/over-ons                           [S] about / story / values
/hoe-we-werken                      [S] process: calculation → advice → install → follow-up
/team                               [S] engineers & installers
/contact                            [S] contact + lead form + details
/privacy                            [S] privacy & cookies
not-found.tsx                       404
sitemap.ts   → /sitemap.xml
robots.ts    → /robots.txt
```

Filesystem: `src/app/(site)/…` is NOT required; flat `src/app/<slug>/page.tsx`. Dynamic: `src/app/vergelijken/[slug]/page.tsx`, etc. Data in `src/content/*.ts` (see §6).

### 1.1 Static pages – purpose & audience question

| Route | Purpose | Primary audience question (*Q*) | Secondary goal |
|---|---|---|---|
| `/` | Hook, debunk "loont niet meer", show the combined-system idea, proof, convert. Keeps existing Hero, ProductsSection, MissionSection, ServicesSection. | *"Kan ik in Vlaanderen nog écht besparen op energie, of hou ik beter mijn gasketel?"* | Route to /hoe-het-werkt, /vergelijken, /diensten |
| `/hoe-het-werkt` | Explain how PV / PVT / heat pump / battery / inverter / charger / dynamic tariff work **together** in one home; interactive house diagram (click a part → flow of energy & € ; day/night/winter toggle). Pillar page for AEO. | *"Hoe werken al die toestellen samen, en waar komt de winst precies vandaan?"* | Push to free calculation |
| `/vergelijken` | Hub: all comparisons as decision cards ("Twijfel je tussen…?"). | *"Welke keuze moet ik maken voor mijn situatie?"* | |
| `/diensten` | Hub: 7 products as one system, each card → sales page; message "we duwen geen product, we rekenen". | *"Wat bieden jullie en wat heb ik eigenlijk nodig?"* | |
| `/projecten` | Proof: real-life (placeholder) families/homes with before/after bill, setup, payback. Filter by product & home type. | *"Heeft dit bij mensen zoals ik echt gewerkt?"* | |
| `/blog` | News/opinion: tariff changes, premies, myths. Freshness signal for SEO. | *"Wat verandert er en wat betekent dat voor mij?"* | |
| `/kennisbank` | Evergreen explainers grouped by category (Tarieven & factuur, Warmtepompen, Zon & PVT, Opslag & laden, Premies & regelgeving). AEO-oriented, FAQ schema. | *"Wat betekent X en hoe zit dat juist?"* | |
| `/over-ons` | Story: engineers not salesmen; honest ("we zeggen het als er geen winst is"); customer first; R&D on PVT. | *"Wie zijn jullie en waarom zou ik jullie vertrouwen?"* | Link /team, /hoe-we-werken |
| `/hoe-we-werken` | Step process (StepsReveal style): 1 gratis berekening → 2 plaatsbezoek & meting → 3 voorstel met scenario's (ook "niets doen") → 4 premies & papierwerk → 5 installatie → 6 opvolging & monitoring. What it costs, how long. HowTo schema. | *"Wat gebeurt er als ik contact opneem, en zit ik dan vast?"* | Reduce friction to CTA |
| `/team` | Faces + roles + certifications (placeholder people). E-E-A-T authors for blog/kennisbank. | *"Wie komt er bij mij thuis en wie rekent mijn installatie?"* | |
| `/contact` | Main lead form (extended fields), phone, e-mail, address, regio, opening hours, response time promise. | *"Hoe snel en makkelijk krijg ik een eerlijke berekening?"* | LocalBusiness schema |
| `/privacy` | GDPR privacy & cookie statement (placeholder legal text, clearly marked). | *"Wat doen jullie met mijn gegevens?"* | noindex: no (indexable, low priority) |
| 404 | Friendly "deze pagina bestaat niet (meer)" + links to home, /hoe-het-werkt, /diensten, /kennisbank + CTA. | *"Waar moet ik nu heen?"* | |

### 1.2 `/vergelijken/[slug]` – comparison pages (6)

Each page: verdict-first summary ("Kort antwoord"), side-by-side table, 20-year cost scenario chart (numbers from `facts.ts`, labelled indicatief), "wanneer NIET" section (honesty), DoubtsSection reuse allowed, FAQ (FAQPage schema), related service + kennisbank links.

| Slug | *Q* |
|---|---|
| `gasketel-vs-warmtepomp` | *"Is een warmtepomp vandaag nog voordeliger dan mijn gasketel, ook met de huidige gas- en stroomprijzen?"* |
| `met-of-zonder-thuisbatterij` | *"Loont een thuisbatterij nu de terugdraaiende teller weg is en het capaciteitstarief er is?"* |
| `met-of-zonder-zonnepanelen` | *"Zijn zonnepanelen zonder terugdraaiende teller en met laag injectietarief nog rendabel?"* |
| `warmtepomp-vs-airco` | *"Lucht-water of lucht-lucht: wat past bij mijn woning, en is airco een volwaardige verwarming?"* |
| `zonnepanelen-vs-pvt-panelen` | *"Waarom PVT in plaats van gewone zonnepanelen, en wanneer heeft het zin?"* |
| `vast-vs-dynamisch-energiecontract` | *"Heb ik baat bij een dynamisch tarief als ik een warmtepomp/batterij/laadpaal heb?"* |

(First 4 required; last 2 recommended. `generateStaticParams` returns all entries in `src/content/comparisons.ts`.)

### 1.3 `/diensten/[slug]` – service sales pages (7)

Shared template: client-centred hero (the family/home/bill), pain → how it fits the whole system → what VB-TEC calculates → specs/what you get → premies → project proof → reviews → FAQ (FAQPage + Service schema) → lead form (product pre-selected via hidden field `interesse`).

| Slug | Product | *Q* |
|---|---|---|
| `zonnepanelen` | PV-installatie | *"Hoeveel panelen heb ik nodig en wat levert het mij nog op zonder terugdraaiende teller?"* |
| `pvt-panelen` | PVT (stroom + warm water), R&D angle, rare offering | *"Wat is een PVT-paneel en haal ik daar meer uit dan uit gewone panelen?"* |
| `omvormers` | Omvormers (string/hybride, batterij-ready) | *"Welke omvormer heb ik nodig, en moet de mijne vervangen worden?"* |
| `thuisbatterij` | Thuisbatterij | *"Hoe groot moet mijn batterij zijn en verdien ik ze terug?"* |
| `laadpalen` | Laadpaal (slim laden, op zonne-overschot/dynamisch tarief) | *"Kan ik mijn auto thuis goedkoop en slim laden zonder mijn capaciteitstarief op te blazen?"* |
| `lucht-water-warmtepomp` | Lucht-water warmtepomp | *"Kan mijn woning met een warmtepomp verwarmd worden, en wat kost dat per jaar vs gas?"* |
| `lucht-lucht-warmtepomp` | Lucht-lucht (airco) | *"Kan ik met airco efficiënt verwarmen én koelen, en voor welke ruimtes?"* |

### 1.4 `/projecten/[slug]` (≥4, PLACEHOLDER)

Template: family/home intro (situation, verbruik vooraf), challenge, calculated setup (diagram mini), results (factuur voor/na, terugverdientijd – indicatief), quote from client, gallery, products used (→ /diensten), related comparison.

| Slug | Situation | Products |
|---|---|---|
| `gezinswoning-gent-warmtepomp-pvt` | Gezin 4p, jaren '70 woning, gasketel eruit | lucht-water WP, PVT, omvormer |
| `nieuwbouw-leuven-all-electric` | Nieuwbouw, EPC-eis | lucht-water WP, zonnepanelen, thuisbatterij, laadpaal |
| `rijwoning-antwerpen-zon-batterij` | Rijwoning, beperkt dak, digitale meter | zonnepanelen, thuisbatterij, omvormer |
| `fermette-brugge-airco-zonnepanelen` | Gerenoveerde fermette, stookolie → hybride | lucht-lucht WP, zonnepanelen |
| `koppel-hasselt-laadpaal-dynamisch` | Koppel met EV, dynamisch contract | laadpaal, thuisbatterij |
| `gezin-kortrijk-geen-batterij-advies` | Honest case: battery advised **against** | zonnepanelen only (shows honesty USP) |

### 1.5 `/blog/[slug]` (≥4, PLACEHOLDER, authored by /team members)

| Slug | Topic |
|---|---|
| `loont-een-warmtepomp-nog-in-2026` | Myth-buster with Flemish numbers |
| `einde-terugdraaiende-teller-wat-nu` | What changed, what to do now |
| `capaciteitstarief-verlagen-zo-doe-je-het` | Peak shaving: battery, smart charging, WP-sturing |
| `gasketel-verbod-vlaanderen-wat-betekent-het` | Bans/trends + renovation obligation |
| `waarom-wij-soms-nee-zeggen` | Honesty / customer-first story |
| `dynamisch-energiecontract-ja-of-nee` | Dynamic tariffs explained per profile |

### 1.6 `/kennisbank/[slug]` (≥6, evergreen, PLACEHOLDER)

| Slug | Category | *Q* |
|---|---|---|
| `wat-is-het-capaciteitstarief` | Tarieven & factuur | *"Wat is het capaciteitstarief en hoe beïnvloed ik het?"* |
| `injectietarief-en-zelfverbruik` | Tarieven & factuur | *"Wat krijg ik voor geïnjecteerde stroom en waarom is zelfverbruik zo belangrijk?"* |
| `scop-en-cop-uitgelegd` | Warmtepompen | *"Wat betekenen COP en SCOP en welk rendement mag ik verwachten?"* |
| `is-mijn-woning-geschikt-voor-een-warmtepomp` | Warmtepompen | *"Moet mijn huis perfect geïsoleerd zijn / vloerverwarming hebben?"* |
| `wat-is-een-pvt-paneel` | Zon & PVT | *"Hoe werkt een PVT-paneel en wat is het verschil met PV/zonneboiler?"* |
| `hoe-groot-moet-een-thuisbatterij-zijn` | Opslag & laden | *"Welke capaciteit past bij mijn verbruik?"* |
| `mijn-verbouwpremie-voor-energie` | Premies & regelgeving | *"Welke premies krijg ik en hoe vraag ik ze aan?"* |
| `epc-en-renovatieverplichting` | Premies & regelgeving | *"Wat moet ik doen na aankoop van een woning met slecht EPC-label?"* |
| `dynamisch-tarief-uitgelegd` | Tarieven & factuur | *"Hoe werkt een dynamisch contract en wanneer loont het?"* |

Each article: "Kort antwoord" box (40–60 words, AEO), body with H2 questions, facts with source/date, "Laatst bijgewerkt", author (team), FAQ, related links.

---

## 2. Header navigation

The Hero currently contains its own inline header. Build a shared `src/components/site/Header.tsx` used on **all** pages (incl. home: the Hero's inline header is removed and replaced by this header, per 04 §5.1). Nav data lives in `src/content/site.ts` (`navigation`) *[Overseer]*. Brand: "VB-TEC" (replace "Enerza").

### Desktop (≥900px)
Logo `VB-TEC` (→ `/`) · nav items · secondary link · primary CTA pill.

1. **Diensten** ▾ (mega-panel, frosted glass)
   - Column "Opwekken": Zonnepanelen, PVT-panelen, Omvormers
   - Column "Verwarmen & koelen": Lucht-water warmtepomp, Lucht-lucht warmtepomp
   - Column "Opslaan & laden": Thuisbatterij, Laadpalen
   - Feature tile: "Alles samen? → Hoe het werkt" (`/hoe-het-werkt`) + link "Alle diensten" (`/diensten`)
2. **Hoe het werkt** → `/hoe-het-werkt`
3. **Vergelijken** ▾ → list of comparisons + "Alle vergelijkingen"
4. **Projecten** → `/projecten`
5. **Kennis** ▾ → Kennisbank, Blog
6. **Over ons** ▾ → Over ons, Hoe we werken, Team
- Secondary (text link): phone number (`tel:`) – PLACEHOLDER
- **Primary CTA**: pill "Gratis berekening" + arrow circle (rotates 45° on hover) → `#berekening` (anchor of the lead form at page end; on `/contact` same anchor). Never a separate page.

Behaviour: transparent over dark hero, becomes frosted-glass after scroll; hides on scroll down, reappears on scroll up. Active item marked with `aria-current="page"`.

### Mobile (<900px)
Bar: logo · compact CTA pill "Berekening" · burger button (`aria-expanded`, `aria-controls`).
Full-screen overlay menu (deep green #071813, lime accents), order:
1. Accordion **Diensten** (7 items + Alle diensten)
2. Hoe het werkt
3. Accordion **Vergelijken**
4. Projecten
5. Accordion **Kennis** (Kennisbank, Blog)
6. Accordion **Over ons** (Over ons, Hoe we werken, Team)
7. Contact
- Bottom (sticky in overlay): full-width CTA "Gratis berekening" + tel + e-mail.
Closes on route change and Esc; focus trap; body scroll lock.

---

## 3. Footer (`src/components/site/Footer.tsx`, all pages)

Deep green / ink background, large "VB-TEC" wordmark, static year (no `new Date()` in render – hardcode or build-time constant).

- **Top band**: one-line promise "Ingenieurs die rekenen, geen verkopers die duwen." + CTA "Gratis berekening".
- **Columns**
  1. Diensten: 7 service links
  2. Vergelijken: all comparisons
  3. Kennis: Hoe het werkt, Kennisbank, Blog, Projecten
  4. Bedrijf: Over ons, Hoe we werken, Team, Contact
  5. Contact (PLACEHOLDER): adres, tel, e-mail, BTW-nr, werkgebied ("Heel Vlaanderen"), openingsuren
- **Trust row**: certifications / quality labels (PLACEHOLDER, text only, no real third-party logos claimed), review score badge (PLACEHOLDER).
- **Bottom bar**: © 2026 VB-TEC · Privacy (`/privacy`) · Sitemap (`/sitemap.xml`) · disclaimer "Alle cijfers zijn indicatief; je persoonlijke berekening is bindend."

---

## 4. Breadcrumb rules

- Shown on every page **except** home and 404. Placement: top of content, under header, small, on whatever background the first section has.
- Format: `Home › <Hub> › <Item>`; last item not a link, `aria-current="page"`. Use item's short title (≤40 chars, truncate with ellipsis on mobile).
- Hubs: Diensten, Vergelijken, Projecten, Blog, Kennisbank.
- Kennisbank articles: `Home › Kennisbank › <Categorie> › <Artikel>`; category is a non-link label (no category routes) – rendered but not in JSON-LD; JSON-LD uses 3 levels.
- Single static pages: `Home › Over ons`, `Home › Hoe we werken`, `Home › Team`, `Home › Hoe het werkt`, `Home › Contact`, `Home › Privacy`.
- Every breadcrumb emits `BreadcrumbList` JSON-LD (absolute URLs from metadataBase).

---

## 5. Internal-link matrix

Rule of thumb: every page links **up** (breadcrumb), **across** (2–4 related items of other types), and **down** to the CTA. All relation lists live in data files (by slug), not hardcoded in components.

### 5.1 Section-level matrix (→ = links to)

| From \ To | Home | Hoe het werkt | Diensten | Vergelijken | Projecten | Kennisbank | Blog | Hoe we werken / Team / Over ons | Contact / #berekening |
|---|---|---|---|---|---|---|---|---|---|
| Home | – | hero/mission CTA | ProductsSection cards → each service | "Twijfel je?" teaser → 3 comparisons | 3 featured | 3 popular | – | ServicesSection → /hoe-we-werken; team teaser | yes |
| Hoe het werkt | | – | each diagram hotspot → its service | gasketel-vs-warmtepomp, met-of-zonder-thuisbatterij | 2 | capaciteitstarief, injectietarief, dynamisch tarief | – | /hoe-we-werken | yes |
| Diensten hub | | yes | all 7 | all | 2 | – | – | /hoe-we-werken | yes |
| Service page | | yes ("hoe past dit in je systeem") | 2–3 complementary services | 1–2 related comparisons | 2 projects using product | 2–3 articles | 1 post | /team (engineer) | yes, pre-selected |
| Comparison | | yes | the services involved | 2 other comparisons | 1–2 projects (incl. honest "nee" case) | 2–3 articles (fact sources) | 1 | – | yes |
| Project | | – | products used | 1 related | 2 other projects | 1 | – | – | yes ("Zo'n berekening voor jouw woning?") |
| Kennisbank art. | | yes | 1–2 services | 1 comparison | 1 | 2 related articles | – | author → /team | yes |
| Blog post | | yes | 1–2 | 1 | 1 | 2 (definitions) | 2 related | author → /team | yes |
| Over ons | | | /diensten | – | 2 | – | – | /team, /hoe-we-werken | yes |
| Hoe we werken | | yes | /diensten | – | 2 | mijn-verbouwpremie | – | /team | yes |
| Team | | | – | – | – | – | posts per author | /over-ons | yes |

### 5.2 Concrete cluster map (services ↔ comparisons ↔ kennisbank ↔ projects)

| Service | Comparisons | Kennisbank | Projects | Complementary services |
|---|---|---|---|---|
| zonnepanelen | met-of-zonder-zonnepanelen, zonnepanelen-vs-pvt-panelen | injectietarief-en-zelfverbruik, wat-is-het-capaciteitstarief | rijwoning-antwerpen-zon-batterij, gezin-kortrijk-geen-batterij-advies | omvormers, thuisbatterij, pvt-panelen |
| pvt-panelen | zonnepanelen-vs-pvt-panelen, gasketel-vs-warmtepomp | wat-is-een-pvt-paneel, scop-en-cop-uitgelegd | gezinswoning-gent-warmtepomp-pvt | lucht-water-warmtepomp, omvormers |
| omvormers | met-of-zonder-thuisbatterij | injectietarief-en-zelfverbruik, hoe-groot-moet-een-thuisbatterij-zijn | rijwoning-antwerpen-zon-batterij | zonnepanelen, thuisbatterij |
| thuisbatterij | met-of-zonder-thuisbatterij, vast-vs-dynamisch-energiecontract | hoe-groot-moet-een-thuisbatterij-zijn, wat-is-het-capaciteitstarief, dynamisch-tarief-uitgelegd | rijwoning-antwerpen-zon-batterij, gezin-kortrijk-geen-batterij-advies | zonnepanelen, omvormers, laadpalen |
| laadpalen | vast-vs-dynamisch-energiecontract | wat-is-het-capaciteitstarief, dynamisch-tarief-uitgelegd | koppel-hasselt-laadpaal-dynamisch, nieuwbouw-leuven-all-electric | thuisbatterij, zonnepanelen |
| lucht-water-warmtepomp | gasketel-vs-warmtepomp, warmtepomp-vs-airco | scop-en-cop-uitgelegd, is-mijn-woning-geschikt-voor-een-warmtepomp, mijn-verbouwpremie-voor-energie, epc-en-renovatieverplichting | gezinswoning-gent-warmtepomp-pvt, nieuwbouw-leuven-all-electric | pvt-panelen, zonnepanelen |
| lucht-lucht-warmtepomp | warmtepomp-vs-airco, gasketel-vs-warmtepomp | scop-en-cop-uitgelegd, is-mijn-woning-geschikt-voor-een-warmtepomp | fermette-brugge-airco-zonnepanelen | zonnepanelen |

Comparisons link back to every service listed against them above; kennisbank articles link back to the services listing them (first 2). Projects link to all their `products` services.

### 5.3 Anchor-text rules
Descriptive Dutch anchors ("bereken of een thuisbatterij loont"), never "klik hier"; vary anchors; max one link to the same URL per section.

---

## 6. Data & implementation notes (for builder agents)

- Content files (all begin with `// PLACEHOLDER – vervang door echte gegevens` where content is invented):
  `src/content/site.ts` (*[Overseer]* = company/NAP/metrics + `navigation`; replaces the former `navigation.ts` and `company.ts`), `registry.ts` (*[Overseer]* slug + shortTitle registry of every routable item, foundation-owned, see 00 §4), `services.ts`, `comparisons.ts`, `projects.ts`, `blog.ts`, `kennisbank.ts`, `team.ts`, `reviews.ts`, `faqs.ts`, `facts.ts` (all numbers + source + date).
- Each item type has `slug`, `title`, `shortTitle` (breadcrumb/nav), `description` (meta), and relation arrays by slug: `relatedServices`, `relatedComparisons`, `relatedArticles`, `relatedProjects`, `relatedPosts`. A small helper `src/lib/links.ts` resolves slugs → `{href,label}` **via `src/content/registry.ts`** (not via the builders' content files, so builders are decoupled) and throws in dev on unknown slugs (catches broken links).
- Route helpers: `routes.service(slug) = /diensten/${slug}` etc. – no string-built URLs in components.
- `sitemap.ts`: all static routes + every slug from content files; priority: home 1.0; hoe-het-werkt, diensten hub & services 0.9; vergelijken 0.8; kennisbank 0.7; projecten 0.6; blog 0.6; over-ons/hoe-we-werken/team/contact 0.5; privacy 0.2. `lastModified` from item `updatedAt` (static strings, not Date.now()).
- `robots.ts`: allow all, disallow nothing public; `sitemap: <base>/sitemap.xml`. Allow AI crawlers (AEO goal).
- Lead form anchor id `berekening` on every page; hidden fields `bron` (route) and `interesse` (service slug when relevant).
- Schema per page type: see 02 §0.7 (authoritative) and 00 §2 placeholder-safe rules *[Overseer]*. Placeholder reviews must NOT be emitted as AggregateRating/Review schema until real; placeholder team members are not emitted as `Person`; placeholder NAP is not emitted in `LocalBusiness`.
- Canonicals: self-referencing, no trailing slash. Project filters on `/projecten` are client-side state (no query-param URLs indexed).

## Open questions
- Real domain, NAP, phone, certifications.
- ~~Whether optional comparisons are built in v1~~ → *[Overseer]* decided: all 6 comparisons are built in v1.
