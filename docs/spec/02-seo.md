# 02 – SEO + AEO spec

> **Status: APPROVED** – Overseer, 2026-11-01. Where this file conflicts with `00-decisions.md`, 00 wins (Overseer edits in this file are marked *[Overseer]*).

Owner: **SEO+AEO agent**. Other agents: append only under `## Notes from <agent>` at the bottom.
Depends on: `01-sitemap.md` (routes, slugs, relations). Numbers: **only** from `src/content/facts.ts` (never hard-code a number in copy; reference `fact("key")`).

---

## 0. Global rules (all templates)

### 0.1 Titles & descriptions
- Root layout `metadata`: `metadataBase: new URL("https://www.vb-tec.be")` (PLACEHOLDER domain), `title: { default: "VB-TEC – energie-ingenieurs voor jouw woning", template: "%s | VB-TEC" }` *[Overseer: no "naar ~€0" claim in a bare title]*, `applicationName: "VB-TEC"`, `openGraph.locale: "nl_BE"`, `openGraph.siteName: "VB-TEC"`.
- Page `<title>` below is the **segment title** (template appends ` | VB-TEC`). Keep total ≤ 60 chars where possible; primary keyword first. Home uses `title.absolute`.
- Meta description: 140–160 chars, contains primary keyword + a concrete benefit + soft CTA ("Gratis berekening"). No unverified claims; "tot ~€0" only with "berekend op jouw woning".
- Dynamic pages: `generateMetadata` awaits `params`, reads `title`/`description` from content files (fields `seoTitle`, `seoDescription` fall back to `title`/`description`).

### 0.2 Headings
- Exactly one `<h1>` per page (on home it lives in Hero – keep it there; the Hero's big visual line must be the h1 or contain it).
- H2s are **questions or clear statements matching search phrasing** (AEO). H3 for sub-points. Never skip levels for styling – style via CSS Modules.
- Every service / comparison / kennisbank / blog page starts (directly under H1 + intro) with a **"Kort antwoord"** box: 40–60 words, self-contained, contains the primary keyword, numbers via `facts.ts` with "(indicatief, stand <asOf>)".

### 0.3 AEO answer pattern (FAQ + H2 sections)
1. First sentence answers the question directly (yes/no/number/range).
2. Total first paragraph 40–60 words, standalone (no "zoals hierboven").
3. Then detail: assumptions, "wanneer niet", link to fact source + internal link.
- FAQ answers in data files: `{ q, a, aLong? }` where `a` = 40–60 words (also used in FAQPage JSON-LD), `aLong` optional extra paragraph shown in the accordion.
- FAQ visible on page (accordion, content in DOM even when collapsed – use `<details>`/`<summary>` or hidden-but-rendered panel; not lazy-loaded).

### 0.4 Word counts (visible body copy, excl. nav/footer/form)
| Template | Min words |
|---|---|
| Home | 900 |
| `/hoe-het-werkt` (pillar) | 1800 |
| Service pages `/diensten/[slug]` | **1200** |
| Comparison pages `/vergelijken/[slug]` | **1200** (pref. 1500) |
| Blog posts | **900** (pref. 1200) |
| Kennisbank articles | **900** |
| Project case studies | 500 |
| Hubs (`/diensten`, `/vergelijken`, `/kennisbank`, `/blog`, `/projecten`) | 400 (intro + card summaries) |
| `/over-ons`, `/hoe-we-werken` | 700 |
| `/team`, `/contact` | 300 |
*[Overseer]* Visible FAQ answers (`a` + `aLong`), Kort antwoord, table cells and card bodies all count. Comparisons: 1200 is the target ("pref. 1500" dropped for time budget). Kennisbank/blog: 900 incl. FAQ.
Builders: long text should be presented in the design flow (sticky side-titles, split sections, expandable "Lees meer" with content in DOM) – never hidden from crawlers.

### 0.5 Canonical rules
- Every page: `alternates: { canonical: "<path>" }` (relative → resolved by metadataBase), self-referencing, lowercase, **no trailing slash**, no query string, no hash.
- `/projecten` filter state is client-only (no `?` URLs). Any accidental query variants still canonicalise to the clean path.
- Single language → no `hreflang` (only `<html lang="nl-BE">`). If FR is added later: `alternates.languages` with `nl-BE`, `fr-BE`, `x-default`.
- `not-found` → Next returns 404 + `noindex` automatically; don't add canonical.
- `robots` metadata: index,follow everywhere (incl. `/privacy`). Set `robots: { index: false }` only on any future thank-you / preview routes.
- `www` vs apex and http→https redirect: handled at hosting (note for deploy).

### 0.6 Open Graph / Twitter rules
- Root: `openGraph: { type: "website", locale: "nl_BE", siteName: "VB-TEC" }`, `twitter: { card: "summary_large_image" }`.
- Per page `openGraph.title` = page title without suffix, `openGraph.description` = meta description, `openGraph.url` = canonical.
- Images 1200×630: *[Overseer – scope cut]* v1 = **one** `src/app/opengraph-image.tsx` (foundation; deep green #071813 bg, lime #dbef75 accent, "VB-TEC" + site tagline). Per-template OG images are a post-v1 stretch. Alt text = site tagline.
- Blog/kennisbank: `openGraph.type: "article"`, `publishedTime`, `modifiedTime`, `authors` (team member URL), `section` (category).
- No people photos in OG unless real & consented.

### 0.7 Schema.org (JSON-LD) per template
Render via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />` in page/layout. Build objects in `src/lib/schema.ts` (helpers: `organization()`, `localBusiness()`, `website()`, `breadcrumb(items)`, `service(s)`, `faqPage(faqs)`, `article(a)`, `howTo(steps)`). Use absolute URLs. Use `@id` anchors: `${base}/#organization`, `${base}/#website`, `${base}/#localbusiness`.

| Template | Types |
|---|---|
| Root layout (all pages) | `Organization` (+ `logo`, `sameAs` [] until real; `contactPoint` only when `site.isPlaceholder === false`), `WebSite` (no SearchAction – no site search) |
| `/` and `/contact` | + `LocalBusiness` → subtype `HomeAndConstructionBusiness` (name, `@id`, url, `areaServed: { "@type": "AdministrativeArea", name: "Vlaanderen" }`, priceRange "€€"). *[Overseer]* telephone, email, address, openingHours are emitted **only when `site.isPlaceholder === false`** – never put invented NAP into structured data. Data from `src/content/site.ts`. |
| All except home/404 | `BreadcrumbList` (Kennisbank: 3 levels, category omitted) |
| `/diensten/[slug]` | `Service` (`serviceType`, `name`, `description`, `provider: {"@id": org}`, `areaServed` Vlaanderen, `offers` omitted – no prices) + `FAQPage` |
| `/diensten` hub | `ItemList` of the 7 services (url + name) |
| `/vergelijken/[slug]` | `Article` (headline, dateModified, author org) + `FAQPage` |
| `/hoe-het-werkt` | `Article` + `FAQPage` |
| `/kennisbank/[slug]` | `Article` (author: `Person` from team.ts with `url` → `/team#<slug>` **only when `team.isPlaceholder === false`, else author = Organization** *[Overseer]*; `datePublished`, `dateModified`, `publisher` org, `about`) + `FAQPage` |
| `/blog/[slug]` | `BlogPosting` (same fields as Article) – FAQPage only if post has ≥3 FAQs |
| `/hoe-we-werken` | `HowTo` (6 steps) – note: Google no longer shows HowTo rich results; kept for AI/semantic value |
| `/team` | `Person` per member (`worksFor` org, `jobTitle`, `knowsAbout`) – *[Overseer]* emitted **only when `team.isPlaceholder === false`**; with placeholder people only BreadcrumbList is emitted (no structured data about invented people). |
| `/projecten/[slug]` | `Article` (about: the project) – **no `Review`** |
| `/over-ons` | `AboutPage` + Organization reference |
| `/contact` | `ContactPage` + LocalBusiness |

**Review / AggregateRating – placeholder-safe rule:** `reviews.ts` carries `isPlaceholder: true`. `schema.ts` must emit `Review`/`AggregateRating` **only** when `isPlaceholder === false` and reviews are first-party, real, and verifiable (and then on `LocalBusiness`/`Organization`, never self-serving on Service pages per Google policy). Until then: show reviews visually with a small "voorbeeldreview" label in dev/staging, no JSON-LD.

**FAQPage rule:** JSON-LD question/answer text must match the visible FAQ verbatim (use the short `a`). *[Overseer]* Emit FAQPage on **every** page that renders a visible FAQ with ≥3 items (incl. home and hubs) – one simple rule for builders.

### 0.8 Facts in copy
- Any number → `fact(key)`; render with `formatFactValue()` + footnote "Bron: {source}, stand {asOf} – indicatief". Comparison/service pages end with a "Bronnen & aannames" list (auto-generated from used fact keys).
- "€0" phrasing: always "tot ~€0 energiefactuur" / "zo dicht mogelijk bij €0" + "afhankelijk van verbruik, dak, woning en contract". Never "gratis energie".
- Show `FACTS_DISCLAIMER` above each lead form and in footer.

### 0.9 Technical SEO checklist (for builders)
- `sitemap.ts` / `robots.ts` per 01-sitemap §6. robots: `allow: "/"` for `*`; explicitly allow `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `Bingbot`.
- Optional `public/llms.txt`: short site summary + links to pillar, comparisons and kennisbank (AEO).
- Images: `next/image` with descriptive Dutch `alt` centred on the family/home ("Gezin in een gerenoveerde rijwoning met zonnepanelen op het dak"); hero image `preload`; others lazy.
- Internal links per 01-sitemap §5 with descriptive anchors.
- Show "Laatst bijgewerkt: {updatedAt}" on services, comparisons, kennisbank, blog (freshness + E-E-A-T) and author box linking to `/team`.
- Core Web Vitals: scroll effects via CSS/IntersectionObserver, no layout shift; FAQ content in initial HTML.

---

## 1. Keyword universe (Flemish search terms)

Use Flemish forms: "zonnepanelen", "thuisbatterij", "laadpaal", "warmtepomp", "premie", "Vlaanderen", "Fluvius", "terugverdientijd", "loont het nog", "digitale meter", "capaciteitstarief", "injectietarief", "dynamisch contract", "airco als verwarming". Avoid NL-only forms ("thuisaccu" only as synonym, "salderingsregeling" never, "ISDE" never).

| Cluster | Head terms | Long-tail / question terms (AEO) |
|---|---|---|
| Warmtepomp | warmtepomp, lucht-water warmtepomp, warmtepomp prijs, warmtepomp premie 2026 | loont een warmtepomp nog, warmtepomp of gasketel, warmtepomp in oude woning, warmtepomp met radiatoren, verbruik warmtepomp per jaar, warmtepomp capaciteitstarief |
| Airco | airco als verwarming, lucht-lucht warmtepomp, airco plaatsen, multi-split airco | verwarmen met airco kost, airco premie Vlaanderen, airco of warmtepomp |
| Zonnepanelen | zonnepanelen, zonnepanelen prijs, zonnepanelen installateur | zijn zonnepanelen nog rendabel, terugverdientijd zonnepanelen zonder terugdraaiende teller, hoeveel zonnepanelen nodig, injectietarief |
| PVT | pvt panelen, pvt zonnepanelen, hybride zonnepanelen | wat is een pvt paneel, pvt paneel met warmtepomp, pvt vs zonneboiler, pvt rendement |
| Thuisbatterij | thuisbatterij, thuisbatterij prijs, thuisbatterij premie | loont een thuisbatterij, hoe groot thuisbatterij, thuisbatterij capaciteitstarief, thuisbatterij dynamisch contract |
| Laadpaal | laadpaal thuis, laadpaal installeren, slimme laadpaal | laden op zonne-energie, laadpaal capaciteitstarief, laadpaal dynamisch tarief, laadpaal bedrijfswagen thuis |
| Omvormer | omvormer zonnepanelen, hybride omvormer, omvormer vervangen | levensduur omvormer, omvormer voor batterij, omvormer kapot |
| Tarieven | capaciteitstarief, injectietarief, dynamisch energiecontract, digitale meter | capaciteitstarief verlagen, wat is mijn maandpiek, dynamisch contract loont het |
| Premies/regels | mijn verbouwpremie, premie warmtepomp 2026, renovatieverplichting, EPC label | verbod gasketel Vlaanderen, gasaansluiting nieuwbouw verbod, btw 6% warmtepomp |
| Merk/vertrouwen | VB-TEC, energie-ingenieur, onafhankelijk energieadvies | eerlijk advies zonnepanelen, energieadvies op maat Vlaanderen |

Volumes are not measured (no keyword tool data in this run) – priorities based on intent + topical authority. Open issue: validate with DataForSEO/GSC after launch.

---

## 2. Per-URL specs

Format per page: **KW** (primary · secondary) · **Title** · **Meta** · **H1** · **H2 outline** · **Words** · **FAQ** (4–8, answer-first). FAQ answers are written by the copy agent following §0.3; key fact keys given in brackets.

### 2.1 Static pages

#### `/` – Home
- **KW**: energie besparen Vlaanderen · warmtepomp zonnepanelen thuisbatterij combinatie, energiefactuur verlagen, loont warmtepomp nog
- **Title** (absolute): `VB-TEC | Je energiefactuur zo dicht mogelijk bij €0` *[Overseer]*
- **Meta**: `Warmtepomp, zonnepanelen, PVT of batterij? Onze ingenieurs berekenen welke combinatie jouw gezin zo dicht mogelijk bij €0 brengt. Eerlijk, ook als het niet loont.`
- **H1** (in Hero): `Jouw energiefactuur, zo dicht mogelijk bij €0`
- **H2**: Loont het nog? Wat de cijfers in Vlaanderen zeggen (mythes) · Eén systeem, niet één product (ProductsSection) · Waarom ingenieurs rekenen in plaats van verkopers (Mission) · Zo werken we (Services) · Gezinnen die het voordeden (projecten) · Twijfel je tussen…? (vergelijkingen) · Veelgestelde vragen · Vraag je gratis berekening aan
- **Words**: 900
- **FAQ**: Loont een warmtepomp nog in 2026? [breakEvenScop, warmtekost*] · Zijn zonnepanelen nog rendabel zonder terugdraaiende teller? [injectievergoeding, stroomprijsAllIn] · Kan mijn energiefactuur echt naar €0? (honest: tot ~€0, voorwaarden) · Wat kost een berekening bij VB-TEC? (gratis, vrijblijvend) · Verkopen jullie altijd een product? (nee, ook "niets doen" scenario) · In welke regio werken jullie? (heel Vlaanderen – PLACEHOLDER)

#### `/hoe-het-werkt` – pillar
- **KW**: warmtepomp zonnepanelen batterij combineren · energiesysteem woning, zelfverbruik verhogen, all-electric woning
- **Title**: `Hoe warmtepomp, zonnepanelen & batterij samenwerken`
- **Meta**: `Zie hoe zonnepanelen, PVT, warmtepomp, batterij en laadpaal samen je factuur verlagen – dag, nacht en winter. Met Vlaamse cijfers en een gratis berekening.`
- **H1**: `Hoe je woning één slim energiesysteem wordt`
- **H2**: Kort antwoord · Waar komt de winst vandaan? (zelfverbruik vs injectie) · Overdag: zonnestroom eerst in huis · 's Avonds en 's nachts: batterij en slim sturen · In de winter: warmtepomp, PVT en dynamisch tarief · Het capaciteitstarief: waarom pieken vermijden telt · Wat betekent dit in euro? Een rekenvoorbeeld · Waarom we nooit één product duwen · Veelgestelde vragen
- **Words**: 1800
- **FAQ** (6): Waarom is zelfverbruik belangrijker dan injectie? · Heb ik een batterij nodig als ik een warmtepomp heb? · Kan een warmtepomp op zonnestroom draaien in de winter? · Wat is het verschil tussen PV en PVT in zo'n systeem? · Verhoogt een warmtepomp of laadpaal mijn capaciteitstarief? · Heb ik een dynamisch contract nodig?

#### `/diensten` – hub
- **KW**: energie-installaties Vlaanderen · installateur warmtepomp zonnepanelen
- **Title**: `Diensten: warmtepomp, zonnepanelen, PVT, batterij & laadpaal`
- **Meta**: `Zeven technieken, één doel: jouw woning zo zuinig mogelijk. Ontdek wat elke oplossing doet en laat onze ingenieurs berekenen wat jij echt nodig hebt.`
- **H1**: `Alles wat je woning nodig heeft – en niets meer`
- **H2**: Opwekken · Verwarmen & koelen · Opslaan & laden · Waarom we rekenen voor we iets voorstellen · Veelgestelde vragen
- **Words**: 400 · **FAQ** (4): Welke combinatie levert het meest op? · Kan ik in fases investeren? · Installeren jullie ook bij bestaande installaties? · Welke premies bestaan er nog?

#### `/vergelijken` – hub
- **KW**: warmtepomp of gasketel, thuisbatterij ja of nee · vergelijking energieoplossingen
- **Title**: `Vergelijken: gasketel vs warmtepomp, met of zonder batterij`
- **Meta**: `Twijfel je tussen gasketel en warmtepomp, met of zonder batterij, PV of PVT? Eerlijke vergelijkingen met Vlaamse cijfers – inclusief wanneer het níet loont.`
- **H1**: `Twijfel je? Vergelijk eerlijk, met echte cijfers`
- **H2**: Verwarming · Zonne-energie · Opslag & contract · Hoe we vergelijken (aannames, bronnen)
- **Words**: 400 · **FAQ** (4): Hoe betrouwbaar zijn deze vergelijkingen? · Waarom zeggen jullie soms dat iets niet loont? · Met welke energieprijzen rekenen jullie? · Kan ik mijn eigen situatie laten doorrekenen?

#### `/projecten`
- **KW**: warmtepomp ervaringen, zonnepanelen ervaringen Vlaanderen · realisaties
- **Title**: `Projecten: zo verlaagden gezinnen hun energiefactuur`
- **Meta**: `Gezinswoning, rijwoning, fermette of nieuwbouw: bekijk welke combinatie we berekenden, wat het kostte en wat de factuur nu is. Ook waar we een batterij afraadden.`
- **H1**: `Gezinnen zoals jij, facturen zoals je wil`
- **H2**: Filter op woning en techniek · Uitgelicht · Hoe we resultaten meten
- **Words**: 400 · **FAQ** (4): Zijn deze resultaten representatief? · Hoe meten jullie de besparing? · Kan ik een installatie bezoeken? · Wat als mijn woning anders is?
- Note: projects are PLACEHOLDER – label "Voorbeeldproject" until real.

#### `/blog`
- **KW**: energienieuws Vlaanderen, nieuwe energieregels 2026
- **Title**: `Blog: energietarieven, premies en mythes in Vlaanderen`
- **Meta**: `Wat verandert er aan capaciteitstarief, premies, gasprijzen en contracten – en wat betekent het voor jouw gezin? Helder uitgelegd door onze ingenieurs.`
- **H1**: `Wat verandert er, en wat betekent het voor jou?`
- **Words**: 400 · **FAQ**: none (hub) – skip FAQPage.

#### `/kennisbank`
- **KW**: capaciteitstarief uitleg, scop betekenis, mijn verbouwpremie uitleg
- **Title**: `Kennisbank: energie, tarieven en premies helder uitgelegd`
- **Meta**: `Wat is het capaciteitstarief, wat betekent SCOP, hoe groot moet je batterij zijn? Korte antwoorden en diepgaande uitleg, met bronnen en Vlaamse cijfers.`
- **H1**: `Energie, eindelijk helder uitgelegd`
- **H2**: per categorie (Tarieven & factuur · Warmtepompen · Zon & PVT · Opslag & laden · Premies & regelgeving)
- **Words**: 400 · **FAQ** (4): Hoe vaak worden deze artikels bijgewerkt? · Waar komen jullie cijfers vandaan? · Wie schrijft deze artikels? · Kan ik een vraag stellen die hier niet staat?

#### `/over-ons`
- **KW**: VB-TEC, energie-ingenieurs Vlaanderen, eerlijk energieadvies
- **Title**: `Over VB-TEC: ingenieurs die rekenen, geen verkopers`
- **Meta**: `VB-TEC is een Vlaams ingenieursbedrijf dat per gezin de optimale energie-installatie berekent. We duwen geen product en zeggen het eerlijk als er geen winst is.`
- **H1**: `We rekenen eerst. Verkopen komt pas daarna – of niet.`
- **H2**: Waarom we VB-TEC startten · Wat ons anders maakt · Klant eerst, ook als het "nee" is · Onderzoek naar PVT · Ons team · Waar we werken
- **Words**: 700 · **FAQ** (4): Zijn jullie onafhankelijk van merken? · Waarom ontwikkelen jullie mee aan PVT? · Wie voert de installatie uit? · Hoe lang bestaan jullie? (PLACEHOLDER)

#### `/hoe-we-werken`
- **KW**: energieadvies op maat, offerte warmtepomp, plaatsbezoek zonnepanelen
- **Title**: `Hoe we werken: van gratis berekening tot opvolging`
- **Meta**: `In 6 stappen van gratis berekening naar een installatie die écht opbrengt: plaatsbezoek, scenario's (ook niets doen), premies, installatie en monitoring.`
- **H1**: `Van je jaarafrekening naar een installatie die écht opbrengt` *[Overseer: "naar ~€0" as a process promise is not honest]*
- **H2**: 1 Gratis berekening · 2 Plaatsbezoek & meting · 3 Voorstel met scenario's · 4 Premies & papierwerk · 5 Installatie · 6 Opvolging & monitoring · Wat kost het en hoe lang duurt het? · Veelgestelde vragen
- **Words**: 700 · **FAQ** (6): Is de berekening echt gratis en vrijblijvend? · Hoe lang duurt het van aanvraag tot installatie? · Regelen jullie de premieaanvraag? [premieLuchtWater*] · Wat als de installatie minder oplevert dan berekend? · Zijn jullie RESCert-gecertificeerd? (PLACEHOLDER) · Welke gegevens heb ik nodig voor de berekening? (jaarverbruik, piek uit digitale meter, foto's)

#### `/team`
- **KW**: VB-TEC team, energie-ingenieur
- **Title**: `Ons team: de ingenieurs en installateurs van VB-TEC`
- **Meta**: `Maak kennis met de ingenieurs die jouw installatie berekenen en de vakmensen die ze plaatsen. Geen verkopers, wel specialisten.`
- **H1**: `De mensen die bij jou thuis komen rekenen`
- **Words**: 300 · **FAQ** (4): Wie komt het plaatsbezoek doen? · Werken jullie met onderaannemers? · Welke certificaties hebben jullie? · Kan ik rechtstreeks met een ingenieur praten?

#### `/contact`
- **KW**: VB-TEC contact, gratis berekening warmtepomp, offerte zonnepanelen
- **Title**: `Contact: vraag je gratis energieberekening aan`
- **Meta**: `Vraag vrijblijvend een berekening aan voor warmtepomp, zonnepanelen, PVT, batterij of laadpaal. We antwoorden binnen {site.responseTime} (PLACEHOLDER, default "2 werkdagen").` *[Overseer: one source of truth, was "1 werkdag" vs 03 "2 werkdagen"]*
- **H1**: `Vraag je gratis berekening aan`
- **Words**: 300 · **FAQ** (4): Hoe snel krijg ik antwoord? · Wat gebeurt er met mijn gegevens? · Moet ik al weten wat ik wil? · Werken jullie in mijn gemeente?

#### `/privacy`
- **Title**: `Privacy- en cookieverklaring` · **Meta**: `Hoe VB-TEC je gegevens verwerkt wanneer je een berekening aanvraagt, welke cookies we gebruiken en welke rechten je hebt.` · **H1**: `Privacy- en cookieverklaring` · no FAQ, no word minimum. Indexable, sitemap priority 0.2.

#### 404
- Title `Pagina niet gevonden` (Next adds noindex). No schema.

### 2.2 Service pages `/diensten/[slug]` (≥1200 words each)

Shared H2 skeleton (adapt wording per product; question-form where natural):
1. Kort antwoord (box)
2. Herken je dit? (pain: the family's bill/situation)
3. Hoe werkt <product>? 
4. Hoe past het in jouw energiesysteem? (link /hoe-het-werkt)
5. Wat kost het en wat levert het op? (facts + rekenvoorbeeld)
6. Wanneer raden we het af?
7. Wat we voor jou berekenen
8. Premies, btw en regels
9. Projecten (proof) · Reviews (visual only)
10. Veelgestelde vragen
11. Bronnen & aannames → lead form (`interesse` preselected)

#### `zonnepanelen`
- **KW**: zonnepanelen · zonnepanelen prijs 2026, zonnepanelen rendabel, terugverdientijd zonnepanelen, zonnepanelen zonder terugdraaiende teller, hoeveel zonnepanelen nodig
- **Title**: `Zonnepanelen: nog rendabel in 2026? Eerlijk berekend`
- **Meta**: `Zonder terugdraaiende teller draait alles om zelfverbruik. We berekenen hoeveel panelen jouw gezin echt nodig heeft en wat ze opleveren. Gratis en eerlijk.`
- **H1**: `Zonnepanelen die renderen, ook zonder terugdraaiende teller`
- **FAQ** (7): Zijn zonnepanelen nog rendabel in 2026? [stroomprijsAllIn, injectievergoeding, prijsZonnepanelenPerKwp] · Hoeveel kWh levert 1 kWp op in Vlaanderen? [pvOpbrengstPerKwp] · Hoeveel zonnepanelen heb ik nodig? · Wat krijg ik voor stroom die ik op het net zet? [injectievergoeding] · Is er nog een premie voor zonnepanelen? [btwZonnepanelenBatterij] · Wat is de terugverdientijd? · Werken panelen op een oost-west dak?

#### `pvt-panelen`
- **KW**: pvt panelen · pvt zonnepanelen, hybride zonnepaneel, pvt warmtepomp, pvt rendement, pvt prijs
- **Title**: `PVT-panelen: stroom én warm water van hetzelfde dak`
- **Meta**: `Een PVT-paneel maakt stroom én warmte. Gekoppeld aan een warmtepomp haal je meer uit je dak. Ontdek wanneer PVT loont – berekend door onze ingenieurs.`
- **H1**: `Eén dak, twee opbrengsten: stroom en warmte`
- **Extra H2**: Waarom zo weinig installateurs PVT aanbieden · Ons onderzoek naar PVT (R&D) · PVT als bron voor een warmtepomp
- **FAQ** (6): Wat is een PVT-paneel? · Is PVT beter dan gewone zonnepanelen? · Kan een PVT-paneel een warmtepomp voeden? · Hoeveel warm water levert PVT? (estimate, per project) · Is er een premie voor PVT? [premieZonneboiler] · Voor welke woningen is PVT geschikt?
- Honesty: no fabricated efficiency numbers; PVT yields only as "indicatief, per project berekend".

#### `omvormers`
- **KW**: omvormer zonnepanelen · hybride omvormer, omvormer vervangen, omvormer kapot, omvormer thuisbatterij
- **Title**: `Omvormer vervangen of hybride omvormer nodig?`
- **Meta**: `Je omvormer bepaalt hoeveel je zonnepanelen opbrengen en of je later een batterij kan koppelen. We rekenen welke omvormer bij jouw installatie past.`
- **H1**: `Het hart van je zonne-installatie, klaar voor morgen`
- **FAQ** (6): Hoe lang gaat een omvormer mee? · Hoe weet ik of mijn omvormer kapot is? · Wat is een hybride omvormer? · Moet ik mijn omvormer vervangen voor een thuisbatterij? · String-omvormer of micro-omvormers? · Kan een omvormer injectie beperken bij negatieve prijzen? [negatievePrijsUren2025]

#### `thuisbatterij`
- **KW**: thuisbatterij · thuisbatterij prijs, loont thuisbatterij, thuisbatterij capaciteitstarief, thuisbatterij dynamisch contract, hoe groot thuisbatterij
- **Title**: `Thuisbatterij: loont ze voor jou? Eerlijk doorgerekend`
- **Meta**: `Een thuisbatterij loont niet voor iedereen. We rekenen met jouw verbruik, piek en contract of ze zich terugverdient – en zeggen het eerlijk als dat niet zo is.`
- **H1**: `Een thuisbatterij, alleen als ze jou iets oplevert`
- **FAQ** (7): Loont een thuisbatterij in 2026? [prijsThuisbatterijPerKwh, injectievergoeding] · Hoe groot moet mijn thuisbatterij zijn? · Verlaagt een batterij mijn capaciteitstarief? [capaciteitstariefPerKw] · Wat kost een thuisbatterij? · Is er een premie voor thuisbatterijen? · Werkt een batterij met een dynamisch contract? [negatievePrijsUren2025] · Hoe lang gaat een thuisbatterij mee?

#### `laadpalen`
- **KW**: laadpaal thuis · slimme laadpaal, laadpaal installeren, laden met zonnepanelen, laadpaal capaciteitstarief, laadpaal bedrijfswagen
- **Title**: `Laadpaal thuis: slim laden op zon en goedkope uren`
- **Meta**: `Laad je elektrische auto thuis op zonnestroom of goedkope uren zonder je capaciteitstarief op te blazen. We berekenen de slimste laadoplossing voor jouw gezin.`
- **H1**: `Je auto laden op zon, niet op je piek`
- **FAQ** (6): Wat kost thuis laden per 100 km? [stroomprijsAllIn] · Verhoogt een laadpaal mijn capaciteitstarief? · Kan ik laden met mijn zonnepanelen? · Heb ik 3-fasige aansluiting nodig? · Hoe werkt terugbetaling voor een bedrijfswagen? (MID-meter) · Werkt een laadpaal met een dynamisch tarief?

#### `lucht-water-warmtepomp`
- **KW**: lucht-water warmtepomp · warmtepomp prijs, warmtepomp premie 2026, warmtepomp of gasketel, warmtepomp met radiatoren, verbruik warmtepomp
- **Title**: `Lucht-water warmtepomp: jouw gasketel eruit, berekend`
- **Meta**: `Kan jouw woning met een warmtepomp verwarmd worden en wat kost dat per jaar vs gas? We rekenen het uit, met Mijn VerbouwPremie en 6% btw.` *[Overseer: "premie tot €6.000" only applies to income cat. 4 → misleading in a meta]*
- **H1**: `Warm wonen zonder gasfactuur`
- **FAQ** (8): Loont een warmtepomp tegenover een gasketel? [warmtekost*, voorbeeldBesparingWarmtepomp] · Werkt een warmtepomp met gewone radiatoren? [scopLuchtWater55] · Wat is een goede SCOP? · Hoeveel premie krijg ik in 2026? [premieLuchtWater*] · Hoeveel stroom verbruikt een warmtepomp per jaar? · Maakt een warmtepomp lawaai? · Moet mijn woning perfect geïsoleerd zijn? · Mag ik mijn gasketel nog vervangen door een nieuwe? [verbodGasNieuwbouw, btwGasketel]

#### `lucht-lucht-warmtepomp`
- **KW**: airco als verwarming · lucht-lucht warmtepomp, airco plaatsen, multi-split, airco premie
- **Title**: `Airco als verwarming: lucht-lucht warmtepomp`
- **Meta**: `Verwarmen én koelen met één toestel, tot 3 à 4 keer efficiënter dan elektrisch stoken. Ontdek voor welke ruimtes een lucht-lucht warmtepomp loont.`
- **H1**: `Warm in de winter, koel in de zomer – per ruimte`
- **FAQ** (6): Kan je met een airco efficiënt verwarmen? · Wat kost verwarmen met airco per jaar? · Is er een premie voor een airco? [premieLuchtLuchtCat12] · Kan een airco mijn hele woning verwarmen? · Mono-split of multi-split? · Werkt een airco op zonnepanelen?

### 2.3 Comparison pages `/vergelijken/[slug]` (≥1200 words, pref. 1500)

Shared H2 skeleton: Kort antwoord (verdict) · Vergelijking in één tabel · Kosten over 20 jaar (scenario, indicatief) · Wanneer kies je A? · Wanneer kies je B? · Wanneer geen van beide? (eerlijk) · Wat je vaak hoort (mythes, DoubtsSection allowed) · Veelgestelde vragen · Bronnen & aannames.

#### `gasketel-vs-warmtepomp`
- **KW**: warmtepomp of gasketel · warmtepomp vs gasketel kosten, gasketel vervangen door warmtepomp, loont warmtepomp nog, gasketel verbod Vlaanderen
- **Title**: `Gasketel of warmtepomp in 2026? Eerlijke vergelijking`
- **Meta**: `Is een warmtepomp vandaag nog voordeliger dan je gasketel? Vergelijk kosten per kWh warmte, premies, btw en de CO₂-taks vanaf 2028 – met Vlaamse cijfers.`
- **H1**: `Gasketel of warmtepomp: wat kost jouw warmte echt?`
- **FAQ** (8): Is een warmtepomp goedkoper dan een gasketel? [breakEvenScop] · Hoeveel bespaar ik per jaar? [voorbeeldBesparingWarmtepomp] · Mag ik in Vlaanderen nog een gasketel plaatsen? [verbodGasNieuwbouw] · Wat is ETS2 en wat betekent het voor gas? [ets2Start, ets2MeerkostGasgezin] · Is een hybride warmtepomp een goed tussenstation? [premieHybrideCat12] · Hoeveel btw betaal ik? [btwWarmtepomp, btwGasketel] · Wat als stroom duurder wordt? · Hoeveel CO₂ bespaar ik? [co2BesparingWarmtepomp]

#### `met-of-zonder-thuisbatterij`
- **KW**: thuisbatterij ja of nee · loont thuisbatterij 2026, thuisbatterij terugverdientijd, thuisbatterij capaciteitstarief
- **Title**: `Thuisbatterij: met of zonder? Zo reken je het uit`
- **Meta**: `Loont een thuisbatterij nu de terugdraaiende teller weg is en het capaciteitstarief er is? Wanneer wel, wanneer niet – eerlijk berekend met Vlaamse cijfers.`
- **H1**: `Met of zonder thuisbatterij?`
- **FAQ** (6): Loont een batterij als ik weinig overdag verbruik? · Hoeveel verhoogt een batterij mijn zelfverbruik? · Hoeveel bespaar ik op het capaciteitstarief? · Wat is de terugverdientijd van een thuisbatterij? · Moet ik wachten tot batterijen goedkoper worden? · Batterij of liever een warmtepompboiler/slim laden?

#### `met-of-zonder-zonnepanelen`
- **KW**: zonnepanelen nog rendabel · zonnepanelen zonder terugdraaiende teller, terugverdientijd zonnepanelen 2026
- **Title**: `Zonnepanelen nog rendabel zonder terugdraaiende teller?`
- **Meta**: `Zonder terugdraaiende teller en met lage injectievergoeding: lonen zonnepanelen nog? We tonen wanneer wel, wanneer niet, met Vlaamse prijzen en opbrengst.`
- **H1**: `Zonnepanelen: met of zonder, en hoeveel?`
- **FAQ** (6): Zijn zonnepanelen nog rendabel? · Wat is zelfverbruik en hoe verhoog ik het? · Wat als ik betaal voor injectie (dynamisch contract)? · Hoeveel panelen zijn optimaal zonder teller? · Wat is de terugverdientijd? · Moet ik mijn bestaande panelen uitbreiden?

#### `warmtepomp-vs-airco`
- **KW**: lucht-water of lucht-lucht · airco of warmtepomp, airco als hoofdverwarming
- **Title**: `Lucht-water of lucht-lucht warmtepomp (airco)?`
- **Meta**: `Lucht-water of lucht-lucht: wat past bij jouw woning? Vergelijk comfort, kosten, warm water en premies – en ontdek wanneer een combinatie het slimst is.`
- **H1**: `Lucht-water of airco: welke warmtepomp past bij jou?`
- **FAQ** (6): Kan een airco een warmtepomp vervangen? · Wat is goedkoper in aankoop en gebruik? · Welke premie krijg ik voor elk? · Kan ik beide combineren? · Wat met sanitair warm water? · Welke is stiller?

#### `zonnepanelen-vs-pvt-panelen`
- **KW**: pvt of zonnepanelen · pvt vs pv, pvt vs zonneboiler
- **Title**: `PVT-panelen of gewone zonnepanelen?`
- **Meta**: `PVT maakt stroom én warmte van hetzelfde dak. Wanneer is dat slimmer dan gewone zonnepanelen of een zonneboiler? Eerlijke vergelijking door ingenieurs.`
- **H1**: `Zonnepanelen of PVT: wat haal je meer uit je dak?`
- **FAQ** (5): Wat is het verschil tussen PV en PVT? · Is PVT duurder? · Levert een PVT-paneel minder stroom? · Wanneer heeft PVT zin? · PVT of zonneboiler?

#### `vast-vs-dynamisch-energiecontract`
- **KW**: dynamisch energiecontract · vast of dynamisch contract, dynamisch tarief warmtepomp, negatieve stroomprijs
- **Title**: `Vast of dynamisch energiecontract: wat past bij jou?`
- **Meta**: `Met een warmtepomp, batterij of elektrische auto kan een dynamisch tarief flink besparen – of net niet. Zo kies je het juiste contract voor jouw profiel.`
- **H1**: `Vast of dynamisch: welk contract past bij jouw woning?`
- **FAQ** (6): Wat is een dynamisch energiecontract? · Voor wie loont een dynamisch contract? · Wat zijn negatieve stroomprijzen? [negatievePrijsUren2025] · Heb ik een digitale meter nodig? · Wat is het risico van een dynamisch contract? · Kan ik later terug naar vast?

### 2.4 Kennisbank `/kennisbank/[slug]` (≥900 words)

Skeleton: Kort antwoord · 3–6 question H2s · Rekenvoorbeeld (where relevant) · Veelgestelde vragen · Bronnen · Laatst bijgewerkt + auteur.

| Slug | KW (primary · secondary) | Title | H1 | Meta (≤160) | FAQ (5) |
|---|---|---|---|---|---|
| `wat-is-het-capaciteitstarief` | capaciteitstarief · capaciteitstarief berekenen, maandpiek, capaciteitstarief verlagen | `Wat is het capaciteitstarief en hoe verlaag je het?` | `Het capaciteitstarief, helder uitgelegd` | `Het capaciteitstarief rekent je gemiddelde maandpiek aan, met minimum 2,5 kW. Zo werkt het, zoveel kost het in 2026 en zo hou je je piek laag.` | Hoe wordt het berekend? · Wat is mijn maandpiek? · Wat kost 1 kW extra? · Hoe verlaag ik mijn piek? · Telt mijn warmtepomp mee? |
| `injectietarief-en-zelfverbruik` | injectietarief · injectievergoeding, zelfverbruik verhogen | `Injectievergoeding en zelfverbruik: wat krijg je nog?` | `Wat krijg je voor je zonnestroom, en waarom zelf verbruiken loont` | `Voor geïnjecteerde stroom krijg je in 2026 maar enkele centen per kWh. Daarom bepaalt zelfverbruik het rendement. Zo verhoog je het.` | Wat is het verschil tussen injectietarief en -vergoeding? · Hoeveel krijg ik per kWh? · Wat is een goed zelfverbruik? · Kan injectie geld kosten? · Hoe verhoog ik zelfverbruik? |
| `scop-en-cop-uitgelegd` | scop warmtepomp · cop betekenis, rendement warmtepomp | `SCOP en COP van een warmtepomp uitgelegd` | `COP en SCOP: wat zeggen ze over je warmtepomp?` | `COP is het rendement op één moment, SCOP over een heel seizoen. Wat is een goede SCOP in Vlaanderen en waarom bepaalt je aanvoertemperatuur alles?` | Wat is het verschil COP/SCOP? · Wat is een goede SCOP? · Waarom daalt de SCOP met radiatoren? · Hoe meet ik de SCOP in de praktijk? · Vanaf welke SCOP is een warmtepomp goedkoper dan gas? |
| `is-mijn-woning-geschikt-voor-een-warmtepomp` | warmtepomp oude woning · warmtepomp radiatoren, warmtepomp zonder vloerverwarming | `Is mijn woning geschikt voor een warmtepomp?` | `Is jouw woning klaar voor een warmtepomp?` | `Geen vloerverwarming of een oudere woning? Een warmtepomp kan vaak toch. Zo check je isolatie, radiatoren en aanvoertemperatuur – en wanneer hybride beter is.` | Moet mijn huis perfect geïsoleerd zijn? · Werkt het met radiatoren? · Wat is de 55 °C-test? · Wanneer is hybride beter? · Hoeveel vermogen heb ik nodig? |
| `wat-is-een-pvt-paneel` | wat is een pvt paneel · pvt werking, hybride zonnepaneel | `Wat is een PVT-paneel en hoe werkt het?` | `Het PVT-paneel: stroom en warmte in één` | `Een PVT-paneel combineert een zonnepaneel met een warmtewisselaar. Zo werkt het, wat het verschil is met PV en een zonneboiler, en wanneer het zin heeft.` | Hoe werkt een PVT-paneel? · Verschil met zonneboiler? · Werkt PVT 's nachts of in de winter? · Is PVT efficiënter? · Wat met premies? |
| `hoe-groot-moet-een-thuisbatterij-zijn` | hoe groot thuisbatterij · capaciteit thuisbatterij berekenen | `Hoe groot moet een thuisbatterij zijn?` | `De juiste batterijgrootte voor jouw verbruik` | `Te groot is weggegooid geld, te klein levert weinig op. Zo bereken je welke capaciteit (kWh) en welk vermogen (kW) bij jouw verbruik en panelen past.` | Hoeveel kWh heb ik nodig? · Verschil kWh en kW? · Hangt het af van mijn zonnepanelen? · Kan ik later uitbreiden? · Wat kost elke extra kWh? |
| `mijn-verbouwpremie-voor-energie` | mijn verbouwpremie warmtepomp · premie warmtepomp 2026, premie zonnepanelen, inkomenscategorie | `Mijn VerbouwPremie 2026: welke premies krijg je nog?` | `Mijn VerbouwPremie voor energie in 2026` | `Welke premie krijg je in 2026 voor een warmtepomp, airco of warmtepompboiler, en wat verdween? Bedragen per inkomenscategorie en zo vraag je ze aan.` | Hoeveel premie voor een warmtepomp? · Welke inkomenscategorie heb ik? · Is er nog premie voor zonnepanelen/batterij? · Hoe vraag ik ze aan en wanneer? · Wat is RESCert? |
| `epc-en-renovatieverplichting` | renovatieverplichting · EPC label, renovatieplicht woning kopen | `Renovatieverplichting en EPC: wat moet je doen?` | `Een woning gekocht met slecht EPC-label: wat nu?` | `Kocht je een woning met EPC-label E of F? Dan moet je binnen 6 jaar label D halen. Zo pak je het slim aan, met de grootste winst per euro.` | Wat houdt de renovatieverplichting in? · Hoeveel tijd heb ik? · Telt een warmtepomp mee voor het EPC? · Wat als ik het niet haal? · Wat is de slimste volgorde? |
| `dynamisch-tarief-uitgelegd` | dynamisch tarief · dynamisch contract uitleg, uurprijzen stroom | `Dynamisch energietarief uitgelegd: wanneer loont het?` | `Hoe werkt een dynamisch energiecontract?` | `Met een dynamisch contract betaal je per uur de marktprijs. Voor wie met warmtepomp, batterij of EV kan dat besparen. Zo werkt het en dit zijn de risico's.` | Hoe wordt de uurprijs bepaald? · Heb ik een digitale meter nodig? · Wat met negatieve prijzen? · Wie wint het meest? · Hoe automatiseer ik mijn verbruik? |

Note `renovatieplichtTermijn` is `estimate: true` – copy must say "volgens de regels van eind 2025; check je aankoopdatum".

### 2.5 Blog `/blog/[slug]` (≥900 words)

| Slug | KW | Title | H1 | Meta | H2 outline | FAQ (4) |
|---|---|---|---|---|---|---|
| `loont-een-warmtepomp-nog-in-2026` | loont warmtepomp nog · warmtepomp rendabel 2026 | `Loont een warmtepomp nog in 2026? De cijfers` | `Loont een warmtepomp nog in 2026?` | `"Hou je gasketel maar" hoor je vaak. We rekenen het na met Vlaamse prijzen, SCOP, premies en de CO₂-taks vanaf 2028. Het antwoord is genuanceerd.` | Kort antwoord · Wat kost 1 kWh warmte met gas en met een warmtepomp? · Wat verandert er tot 2029? · Wanneer loont het níet? · Rekenvoorbeeld gezin 4p | Hoeveel bespaar ik? · Wat met premies? · Werkt het in een oud huis? · Moet ik wachten? |
| `einde-terugdraaiende-teller-wat-nu` | einde terugdraaiende teller · digitale meter zonnepanelen | `Einde terugdraaiende teller: wat moet je nu doen?` | `De terugdraaiende teller is weg. Wat nu?` | `De terugdraaiende teller bestaat niet meer. Wat betekent dat voor je zonnepanelen, en hoe haal je er toch het maximum uit? 5 concrete stappen.` | Wat is er veranderd? · Wat kost het je? · 5 manieren om zelfverbruik te verhogen · Loont uitbreiden nog? | Verlies ik geld? · Moet ik een batterij kopen? · Kan ik compensatie krijgen? · Welk contract kies ik? |
| `capaciteitstarief-verlagen-zo-doe-je-het` | capaciteitstarief verlagen · piek verlagen | `Capaciteitstarief verlagen: 6 tips die echt werken` | `Zo verlaag je je capaciteitstarief` | `Elke kW minder maandpiek bespaart ca. €52–61 per jaar. Met slim laden, warmtepompsturing en een batterij hou je je piek laag. Zo pak je het aan.` | Hoe lees ik mijn piek af? · 6 tips · Wat levert het op? | Wat is een normale piek? · Helpt een batterij? · Wat met mijn laadpaal? · Hoe zie ik mijn piek? |
| `gasketel-verbod-vlaanderen-wat-betekent-het` | verbod gasketel Vlaanderen · gasaansluiting verbod | `Gasketelverbod in Vlaanderen: wat geldt er echt?` | `Mag je je gasketel nog vervangen in Vlaanderen?` | `Geen gas meer bij nieuwbouw, 21% btw op een nieuwe gasketel, ETS2 vanaf 2028. Wat geldt nu echt voor jouw woning, en wat zijn geruchten?` | Wat is al beslist? · Wat geldt voor bestaande woningen? · Wat komt eraan? · Wat betekent dit voor jouw keuze vandaag? | Mag ik mijn kapotte gasketel vervangen? · Geldt het verbod voor mijn huis? · Wat is ETS2? · Wat met stookolie? |
| `waarom-wij-soms-nee-zeggen` | eerlijk energieadvies · installateur advies | `Waarom wij soms "nee" zeggen tegen een klant` | `Waarom we soms nee zeggen` | `Niet elke woning heeft baat bij een batterij of warmtepomp. Waarom onze ingenieurs dat eerlijk zeggen, en wat je in de plaats krijgt.` | Een batterij die we afraadden · Hoe we rekenen · Wat "klant eerst" betekent | Rekenen jullie gratis? · Wat als ik het toch wil? · Hoe weet ik dat jullie eerlijk zijn? · Wat is het "niets doen"-scenario? |
| `dynamisch-energiecontract-ja-of-nee` | dynamisch energiecontract · dynamisch contract voordelen nadelen | `Dynamisch energiecontract: ja of nee voor jouw gezin?` | `Dynamisch contract: voor wie loont het?` | `Een dynamisch contract kan veel besparen met een warmtepomp, batterij of EV – of net duurder uitvallen. Per profiel uitgelegd, met risico's.` | Hoe werkt het? · 4 profielen · Risico's · Zo automatiseer je | Wat bij een prijspiek? · Heb ik een batterij nodig? · Hoe vaak mag ik wisselen? · Wat met negatieve prijzen? |

Blog authors: team members (Person); dates as static strings in `blog.ts`.

### 2.6 Projects `/projecten/[slug]` (≥500 words, PLACEHOLDER)

- **Title pattern**: `<Woningtype> in <stad>: <oplossing>` e.g. `Gezinswoning in Gent: warmtepomp + PVT` (≤60).
- **Meta pattern**: `Hoe een gezin in <stad> van €<voor> naar ca. €<na> energiefactuur ging met <producten>. Situatie, berekening en resultaat (indicatief).`
- **H1 pattern**: `<Gezin/koppel> in <stad>: <resultaat in woorden>` (client-centred, e.g. "Van gasfactuur naar bijna niets in een jaren '70-woning").
- **H2**: De situatie · De uitdaging · Wat we berekenden · Het resultaat · In hun woorden · Gebruikte technieken · Ook interessant
- **FAQ** (4, template-filled from project data): Wat kostte de installatie? · Hoe lang duurt de terugverdientijd? · Hoe lang duurde de installatie? · Zou dit ook in mijn woning werken?
- Keywords: `<product> <stad>` local long-tails (e.g. "warmtepomp Gent", "zonnepanelen Antwerpen") – only if VB-TEC actually works there (PLACEHOLDER).
- All figures labelled "Voorbeeldproject – indicatieve cijfers" until real.

---

## 3. Myths to debunk

Data source: `MYTHS` in `src/content/facts.ts` (myth, 40–60-word `answer`, honest `whenTrue`, supporting `facts`, `usedOn`). Summary:

| # | Myth (what people say) | Counter-argument | Honest nuance ("wanneer klopt het wél") | Supporting fact keys |
|---|---|---|---|---|
| 1 | "Een warmtepomp loont niet, stroom is te duur." | Stroom ≈ 2,5–3× duurder per kWh dan gas, maar SCOP 3–4 → warmte ca. 8,6 c/kWh vs ca. 12,2 c/kWh met gas; break-even SCOP ≈ 2,5. Taxshift (gas +€4,38/MWh, stroom –€11,4/MWh tegen 2029) en ETS2 (2028) vergroten het verschil. | Slecht geïsoleerd + 55 °C+ radiatoren + zeer goedkoop vast gascontract → kleine winst; eerst isoleren / hybride. | stroomprijsAllIn, gasprijsAllIn, scopLuchtWater35/55, warmtekostGasPerKwhWarmte, warmtekostWarmtepompPerKwhWarmte, breakEvenScop, accijnsShift*, ets2Start, ets2MeerkostGasgezin |
| 2 | "Hou gewoon je gasketel." | Nieuwe gasketel: 21% btw (sinds 7/2025) vs warmtepomp 6% (t.e.m. 2029); ETS2 ca. €220–550/jaar extra; vaste gaskosten €150–200/jaar; gasprijzen volatiel (+€380/jaar nieuw contract jul→sep 2026). Een ketel van nu gaat mee tot ~2045. | Jonge ketel + grote renovatie gepland → nu wachten kan verstandig zijn. | btwGasketel, btwWarmtepomp, ets2*, gasVasteKosten, gasprijsStijgingQ3_2026 |
| 3 | "Zonnepanelen zijn niet meer rendabel zonder terugdraaiende teller." | Zelfverbruikte kWh = ca. 30 c, geïnjecteerde = ca. 4 c → combineer met warmtepomp/boiler/batterij/EV; ca. 900 kWh/kWp; €1.000–1.800/kWp. | Weinig verbruik overdag, niets verschuifbaar → kleinere of geen installatie. | terugdraaiendeTellerEinde, stroomprijsAllIn, injectievergoeding, pvOpbrengstPerKwp, prijsZonnepanelenPerKwp |
| 4 | "Een thuisbatterij verdien je nooit terug." | Drie inkomstenbronnen: zelfverbruik, lagere piek (€52–61/kW/jaar), dynamisch laden (520 negatieve uren in 2025). Batterijprijzen €400–800/kWh en dalend. | Kleine PV, laag verbruik, vast contract → meestal niet rendabel (zie project Kortrijk – we raadden af). | prijsThuisbatterijPerKwh, injectievergoeding, capaciteitstariefPerKw, negatievePrijsUren2025 |
| 5 | "Door het capaciteitstarief is elektrisch verwarmen/laden onbetaalbaar." | Slim gestuurd stijgt de piek vaak maar 1–2 kW → ca. €50–120/jaar, veel minder dan de besparing. Minimum 2,5 kW betaal je sowieso. | 11 kW laden tijdens koken → wel fors duurder; slimme sturing is noodzakelijk. | capaciteitstariefPerKw, capaciteitstariefMinimumKw, gemiddeldeMaandpiekKw, capaciteitstariefGemiddeldPerJaar |
| 6 | "Een warmtepomp werkt alleen in nieuwbouw met vloerverwarming." | Bij 35 °C SCOP ≈ 4, bij 55 °C ≈ 3; vaak volstaan enkele LT-radiatoren + dak/glasisolatie. Hybride is minimaal verplicht bij ingrijpende renovatie sinds 2023. | Zeer slecht geïsoleerd → eerst isoleren of hybride. | scopLuchtWater35, scopLuchtWater55, hybrideVerplichtIER |
| 7 | "Er zijn geen premies meer." | Lucht-water warmtepomp 2026: €1.500 (cat. 1–2) tot €6.000 (cat. 4) + 6% btw. | Voor zonnepanelen, batterij, zonneboiler/PVT: inderdaad geen premie meer. | premieLuchtWaterCat12/3/4, btwWarmtepomp, btwGasketel, premieZonneboiler |
| 8 | "Een airco is om te koelen, niet om te verwarmen." | Lucht-lucht = warmtepomp, 3–4× efficiënter dan elektrisch stoken; premie €300–600 (met voorwaarden). | Geen sanitair warm water; voor grote woningen met veel kamers is lucht-water beter. | premieLuchtLuchtCat12, stroomprijsAllIn |

Copy rule: myths are presented as "Wat je vaak hoort" → "Wat de cijfers zeggen" → "Wanneer het wél klopt". The third part is mandatory (honesty USP) and builds trust more than the debunk itself.

---

## 4. Facts – research summary & caveats (as of 2026-11-01)

- **Capaciteitstarief 2026**: €51,99 (Limburg) – €60,53 (West) per kW/jaar incl. btw; minimum 2,5 kW; average peak ~4,24 kW → ~€220–257/jaar. One source listed lower figures (€49–57), likely excl. btw – we use incl. btw.
- **Electricity** all-in ~26–32 c/kWh (June 2026, new contracts), rising in Q3 2026 → rekenwaarde 30 c (estimate).
- **Gas** volatile in 2026: cheapest new contracts ~5–6 c mid-2026, average 10,2–11,6 c in Sept 2026 after a sharp autumn rise → rekenwaarde 11 c (estimate). **The heat-pump case is sensitive to this**: at gas 8 c, break-even SCOP rises to ~3,4. Copy must not overstate; recalc quarterly.
- **Mijn VerbouwPremie**: from 1 March 2026 categories 1–2 only get heat pump/warmtepompboiler premiums (lucht-water €1.500, hybride €800, lucht-lucht €300, bodem €4.000, WP-boiler €450); cat. 3: €4.500 / cat. 4: €6.000 for lucht-water. Zonneboiler premium ended 1 July 2025; no PVT/battery/PV premium.
- **Gas boiler**: no ban on replacing an existing gas boiler (yet); gas connection ban for new builds since 2025; 21% btw on gas boilers since July 2025. A 2027 "fossil replacement ban" appears in older policy documents but is **not** confirmed as current law – do NOT claim it; at most "aangekondigde plannen, nog niet beslist".
- **Renovatieverplichting**: label D within 6 years for E/F purchases (relaxed end 2025; 2028 label-C path scrapped) – estimate flag.
- **Not found / uncertain**: PVT-specific yields and prices (use per-project calc), exact Belgian grid CO₂ factor (Ember estimate), battery prices (wide range, falling).

---

## Notes from other agents
