# 05 – Page structures (section order per template) + component inventory

> **Status: APPROVED** – Overseer, 2026-11-01. Where this file conflicts with `00-decisions.md`, 00 wins (Overseer edits in this file are marked *[Overseer]*).

Owner: **Page structure agent**. Other agents: append only under `## Notes from <agent>` at the bottom.
Depends on: `01-sitemap.md` (routes, relations, `#berekening`), `02-seo.md` (H1/H2/FAQ/schema/word counts), `03-cro.md` (beats, CTA wording, lead form), `04-design.md` (geometries A–J, rotation rules, motion).

Method: wireframe-architect (one job per section, archetype adjacency, band pacing, CTA hierarchy, declared image ratios, max one novel section per page) merged with the 04 rotation rules. Where 03 and 04 disagree, this file decides and says why (see §0.3).

---

## 0. How to read this file

### 0.1 Notation
Each page is a table: **#** · **Section** · **Goal** (the one visitor question it answers) · **Geo** (04 geometry letter; `Hero` = PageHero, `X` = custom/novel block, `FAQ`, `Lead`, `Prose` = fixed blocks) · **Bg** (`W` white, `D` deep green, `I` framed image, `L` lime) · **Content** (Dutch headline idea + data source) · **CTA** · **SEO block** · **Component**.
`(p1)/(p2)` = pinned section (max 2 per page). Under each table: one-line **chain check** (bg + geometry + dense/airy).

All copy below is a *headline direction*; final copy follows 03 §0 (je/jij, klant als onderwerp, "tot ~€0*") and every number is `fact("key")` + `FactNote`. Headlines in quotes are Dutch, ready to use.

### 0.2 Global rules applied to every page
- Primary action everywhere: **Gratis berekening → `#berekening`** (bottom `LeadSection`, embedded form, never a button-to-page). Max 1 primary + 1 soft CTA in the hero; mid-page primary CTAs only directly after a proof moment (data band, project, review), never after a pain section.
- Shared chrome on every page: `Header` (tone-aware), `MobileStickyCta` (not on `/contact`), `Footer`. Breadcrumb on every page except home/404 (inside the first section).
- Ending: `… → FAQ·W → Lead·I → Footer`. Section before FAQ is never W.
- Max 3 `I` sections per page (hero + C + lead), never adjacent. Lime `L` max once per page. Same geometry max twice per page, never adjacent.
- Each page has ≥1 number-proof, ≥1 review/project, ≥1 honesty moment, ≥1 premie signal (03 §4).

### 0.3 Decisions that resolve conflicts between earlier specs
1. **LeadSection background**: 03 §6.2 says deep green + glass panel; 04 says framed image (I). Decision: **framed image with a strong deep-green overlay** (`linear-gradient(90deg, rgba(7,24,19,.92) 0–45%, rgba(7,24,19,.55) 100%)`), white form card on the right, promise text left in white. Satisfies both (reads as "dark green conversion moment", counts as I in rotation). The lime accent = submit pill + check icons.
2. **Home order**: 03 puts the myth block at position 2; 04 keeps Products→Mission→Services first. Decision: pain comes first (03 rule "pijn vóór oplossing"), myth+data follow the Mission/Services pair. Reason: the existing Mission→Services slide-over must stay one unit, and three dense sections in a row (data → bento → cards) would break 04 rule 6. The myth is still hinted in the hero slider and the FAQ.
3. **DoubtsSection** (420svh, counts as 2 pins) is **not used on comparison pages by default** because the comparison recipe already uses a pinned B. Allowed only as an alternative variant if B is turned into a non-pinned list (see comparison template, row 5).
4. **About-type pages** (over-ons, team, hoe-we-werken) keep the lead form (project decision: form on every page) but with *soft verification copy* ("Leer ons kennen via een eerlijke berekening"), not hard-sell copy.
5. **Products strip (7 services)**: the existing A1 strip is pixel-measured for 5 product cut-outs. Keep the 5 tiles (Zonnepanelen, Omvormers, Thuisbatterijen, Laadpalen, Warmtepompen) and add a trailing tag group "Ook: PVT-panelen · Airco (lucht-lucht)" as two `Tag` links in the same strip. Upgrade to 7 tiles only when matching product cut-outs exist.

---

## 1. Home `/`

Audience mode: both ready buyers (hero CTA, header CTA, sticky mobile CTA) and researchers (story). Word target ≥ 900 (02).

| # | Section | Goal | Geo | Bg | Content | CTA | SEO block | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | **Hero** (existing, adapted) | "Am I in the right place?" – promise for *my* bill | Hero (home, 100svh) | I | H1 **"Jouw energiefactuur, zo dicht mogelijk bij €0"** (asterisk resolved in small text). Sub: "Onze ingenieurs rekenen uit welke combinatie van zon, warmtepomp en batterij jouw gezin het meest oplevert. En we zeggen het eerlijk als iets niet loont." Trustline: "Gratis en vrijblijvend · Berekend door een ingenieur · Eerlijk, ook als het niet loont" *[Overseer: no review score while reviews are placeholders]*. HighlightsSlider → 4 Dutch slides from `content/home.ts` (Project Gent "€ → €", "PVT: stroom én warm water", "Waarom we in Kortrijk géén batterij plaatsten", "Hoe het samenwerkt"). Image `gen/hero-gezin-woning.jpg` (16:10). | Hero pill **"Bereken wat jouw woning kan besparen"** → `#berekening`; ghost **"Bekijk hoe het werkt"** → `/hoe-het-werkt` | H1 (02), LocalBusiness + Organization JSON-LD on page, `preload` image | `hero/Hero` (refactor: Dutch, header via shared `site/Header`, data from `content/home.ts`) |
| 2 | **ProductsSection** (existing) | "What do you offer?" – route to services | A1 strip | W (strip, belongs to hero) | Small strip label h2 **"Eén systeem, niet één product"**. 5 tiles → `/diensten/[slug]` (Warmtepompen → lucht-water) + tags "PVT-panelen", "Airco (lucht-lucht)". | each tile = soft link | H2 (02), 7 internal links | `products/ProductsSection` (labels/hrefs from `content/services.ts`) |
| 3 | **Herken je dit?** (pain) | "Do they understand my situation?" | B (p1) | D | Sticky left: eyebrow "Herken je dit?", h2 **"Je factuur stijgt. Je verbruik niet."** Cards (4, `--c-green-card` / photo alternating): ① "Je voorschot ging omhoog, je verbruik niet." (photo `gen/gezin-keuken-factuur.jpg`, 4:3) ② "Sinds het capaciteitstarief betaal je ook voor je pieken." [`capaciteitstariefGemiddeldPerJaar`] ③ "Je panelen draaien, maar je stroom gaat voor een paar cent het net op – 's avonds koop je duur terug." [`injectievergoeding`, `stroomprijsAllIn`] ④ "Je ketel is 15+ jaar oud. Weer gas voelt als geld weggooien, een warmtepomp als een gok." Last card closes: "Iedereen zegt iets anders. Wij rekenen het uit." | none (pain → no CTA) | H2 "Herken je dit?", FactNotes | `sections/StackCards` |
| 4 | **MissionSection** (existing) | "What's your answer – and why trust it?" | F | W | Eyebrow "Onze aanpak", statement **"We verkopen geen toestel. We rekenen uit wat jouw woning nodig heeft – en zeggen het als iets niet loont."** Tiles: stat card (D) CountUp `company.adviceAgainstPct` "van de berekeningen raadden we minstens één product af" + pill "Eerlijk advies" (PLACEHOLDER); photo card `gen/ingenieur-aan-tafel.jpg` "Ingenieurs, geen verkopers"; grey card "Klant eerst" + tags "Merkonafhankelijk", "Altijd een scenario 'niets doen'", "Geen voorschot vóór akkoord" (PLACEHOLDER). | soft text link "Over ons" → `/over-ons` | H2 "Waarom ingenieurs rekenen in plaats van verkopers" | `mission/MissionSection` (Dutch + Reveal fix per 04 §4.3) |
| 5 | **ServicesSection** (existing) | "How much hassle is this?" | A2 (slide-over over #4 = p2) | D | Eyebrow "Zo werken we", h2 **"Van je jaarafrekening naar een installatie die écht opbrengt – in vier stappen."** Cards: 1 Gratis berekening · 2 Plaatsbezoek & meting · 3 Voorstel met scenario's (ook 'niets doen') · 4 Installatie & opvolging. Step 4 body ends "Start hieronder ↓". | lime pill **"Start met stap 1"** → `#berekening`; text link "Lees hoe we werken" → `/hoe-we-werken` | H2 "Zo werken we" | `services/ServicesSection` (Dutch, steps from `content/home.ts`) |
| 6 | **Mythe** | Name the belief in their head | G | W | Eyebrow "Wat je vaak hoort". Visual quote (statement-xl, `<p>`): **"'Een warmtepomp loont niet meer. Hou gewoon je gasketel.'"** H2 below (smaller): **"Klopt dat? We legden het naast de Vlaamse cijfers."** "Klopt dat?" gets highlight sweep. Up to 5 doubt pills (non-link) from `MYTHS[].myth` short labels. Scroll-scrubbed word reveal. | none | H2 "Loont het nog? Wat de cijfers in Vlaanderen zeggen" (as visually-small h2) | `sections/Statement` |
| 7 | **De cijfers** | "Prove it" – debunk with numbers | H (chart + stats) | D | h2 **"Wat kost 1 kWh warmte in Vlaanderen?"** Bar chart: gasketel [`warmtekostGasPerKwhWarmte`] vs warmtepomp [`warmtekostWarmtepompPerKwhWarmte`]. Stat row (3): break-even SCOP [`breakEvenScop`], voorbeeldbesparing per jaar [`voorbeeldBesparingWarmtepomp`], btw 6% vs 21% [`btwWarmtepomp`, `btwGasketel`]. Honesty line from `MYTHS['warmtepomp-loont-niet'].whenTrue` ("Wanneer klopt het wél?"). "Waarom nu?" mini-row: [`ets2Start`], [`verbodGasNieuwbouw`]. "Bekijk aannames" accordion. "Indicatief" pill. | lime **"Bereken wat jouw woning kan besparen"** → `#berekening` (after proof) | FactNotes + sources (AEO citable numbers) | `sections/DataBand` |
| 8 | **PVT** (differentiator) | "What can they do that others can't?" | C | I | Image `gen/pvt-dak-detail.jpg` (16:9). Glass panel bottom-right: eyebrow "PVT-panelen · onderzoek", h3 **"Eén dak, twee opbrengsten: stroom én warm water."** Body: "Weinig installateurs bieden PVT aan. Wij wel – en we blijven eraan onderzoeken. Gekoppeld aan een warmtepomp haal je meer uit hetzelfde dak, ook in de winter." No yield numbers (02 honesty). | lime **"Ontdek PVT-panelen"** → `/diensten/pvt-panelen`; link "PVT of gewone panelen?" → `/vergelijken/zonnepanelen-vs-pvt-panelen` | H2 "PVT: stroom én warmte van hetzelfde dak" | `sections/ImagePanel` |
| 9 | **Hoe het samenwerkt** (teaser) — novel | "How do all these devices work together?" | X (HouseDiagram teaser) | W | h2 **"Je woning als één systeem: zon eerst in huis, de rest slim gestuurd."** Left: 3 scene tabs Dag / Avond / Winter (auto-advance once on view, then manual) with 1 caption + 1 fact each [`stroomprijsAllIn` vs `injectievergoeding`; `capaciteitstariefPerKw`; `scopRekenwaarde`]. Right: simplified house SVG with flowing lime lines. ~120 words visible. Justification: the "system, not product" USP needs a picture; teaser of the pillar page. | ink pill **"Bekijk hoe het werkt"** → `/hoe-het-werkt` (soft, different intent) | H2, internal link to pillar | `sections/HouseDiagram mode="teaser"` |
| 10 | **Projecten** | "Did this work for people like me?" | I (rail) | D | h2 **"Gezinnen zoals jij. Hun factuur vóór en na."** 4–6 cards from `projects.ts` (featured): photo 4:3, gemeente + woningtype, hoofdgetal "€ X → € Y /maand" (indicatief), product tags, badge "Voorbeeldproject". Includes Kortrijk "We raadden een batterij af". Last rail card = CTA card. | soft "Alle projecten" → `/projecten`; end card **"Zo'n berekening voor jouw woning?"** → `#berekening` | H2 "Gezinnen die het voordeden" | `sections/Rail kind="project"` |
| 11 | **Reviews** | "Do others trust them?" | J (marquee) | W | h2 **"Wat gezinnen zeggen na hun berekening"**. 2 rows, lime summary card (score, PLACEHOLDER), every 4th card D. Note "Voorbeeldreviews". | none | no Review schema (02 §0.7) | `sections/ReviewWall` |
| 12 | **Twijfel je nog?** | "I'm still torn between options" → route | G (compact) | L | Eyebrow "Twijfel je nog?", statement **"Gasketel of warmtepomp? Met of zonder batterij? We vergelijken het eerlijk."** 4 link pills → `gasketel-vs-warmtepomp`, `met-of-zonder-thuisbatterij`, `met-of-zonder-zonnepanelen`, `vast-vs-dynamisch-energiecontract` + "Alle vergelijkingen". | link pills (soft) | H2 "Twijfel je tussen…?" | `sections/Statement bg="L" pills=links` |
| 13 | **FAQ** | Researcher objections | FAQ | W | 6 Q's from 02 §2.1 home (loont WP nog, zon zonder teller, kan factuur echt naar €0, wat kost een berekening, verkopen jullie altijd iets, regio). | none | visible FAQ + FAQPage JSON-LD (02 §0.7 rule: every visible FAQ ≥3 items) *[Overseer]* | `sections/Faq` |
| 14 | **Lead** | Convert | Lead | I | Heading **"Wat kan jouw woning besparen? We rekenen het voor je uit."** `bron="/"`. Image `gen/woonkamer-warm-winter.jpg`. | embedded form | FACTS_DISCLAIMER above form | `lead/LeadSection` |

Chain: I · W(strip) · D · W · D · W · D · I · W · D · W · L · W · I — no repeats. Geometries Hero·A1·B·F·A2·G·H·C·X·I·J·G·FAQ·Lead (G twice, not adjacent). Pins: B, slide-over = 2. Dense/airy: B(airy big cards) F A2(dense×2) G(airy) H(dense) C(airy) X(airy) I J(dense×2) G(airy) ✓. I-sections: 3 ✓.

---

## 2. Hoe het werkt `/hoe-het-werkt` (pillar, ≥1800 words, Article + FAQPage)

| # | Section | Goal | Geo | Bg | Content | CTA | SEO block | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | **PageHero** | Promise: understand where savings come from | Hero (framed, 78svh) | I | Breadcrumb `Home › Hoe het werkt`. H1 **"Hoe je woning één slim energiesysteem wordt"**. Lead: "Zon, warmte, opslag en slim laden – samen. Zo werkt het in jouw huis, dag en nacht, zomer en winter." Glass fact card: "Zelf verbruikte stroom is veel meer waard dan geïnjecteerde" with [`stroomprijsAllIn`] vs [`injectievergoeding`]. Image `gen/jaren70-woning.jpg`. | hero pill **"Bereken wat jouw woning kan besparen"**; ghost **"Naar het huisdiagram"** → `#diagram` | H1, BreadcrumbList | `sections/PageHero variant="image"` |
| 2 | **Kort antwoord + de val van losse producten** | "Why doesn't my neighbour with panels save?" (pain) | G (+ Kort antwoord box) | W | Statement **"Panelen op het dak en tóch een hoge factuur? Dan werken je toestellen niet samen."** Below: `KortAntwoord` (40–60 words, AEO) + 1 paragraph (illustrative, no real person): the "losse producten"-val. | none | H2 "Waar komt de winst vandaan?" + Kort antwoord (02) | `sections/Statement` + `ui/KortAntwoord` |
| 3 | **Interactief huisdiagram** — novel | "Show me in my house" | X (HouseDiagram full) | D | id `diagram`. Scene tabs: **Dag · Avond · Winter · Piekmoment**. 7 hotspots (zonnepanelen, PVT, omvormer, batterij, laadpaal, lucht-water, lucht-lucht) → popover: what it does in this scene, € effect (1 fact), link to service. Lime animated flow lines (net / huis / batterij / auto / warmte). Below: text alternative list per scene (in DOM). | after interaction inline card **"Wil je dit voor jouw dak en verbruik zien?"** → `#berekening` | text alternative = crawlable content; links to all 7 services | `sections/HouseDiagram mode="full"` |
| 4 | **Hoofdstukken** | "Explain it properly" (long-form) | D (p1) | W | 5 chapters, each H2 + 200–300 words + FactNote + media (diagram/mini-chart/photo, 4:5): ① "Overdag: zonnestroom eerst in huis" (zelfverbruik vs injectie) ② "'s Avonds en 's nachts: batterij en slim sturen" ③ "In de winter: warmtepomp, PVT en dynamisch tarief" [`scopLuchtWater35`, `scopLuchtWater55`] ④ "Het capaciteitstarief: waarom pieken vermijden telt" [`capaciteitstariefPerKw`, `capaciteitstariefMinimumKw`, `gemiddeldeMaandpiekKw`] (photo `gen/meter-app-hand.jpg`) ⑤ "Je auto: de grootste flexibele verbruiker" (photo `gen/laadpaal-oprit-avond.jpg`). | none (reading) | H2 outline from 02 §2.1, ~1200 words | `sections/StickySplit` |
| 5 | **Rekenvoorbeeld** | "What does it mean in euros?" | H (stats + stacked bars) | D | h2 **"Wat betekent dit in euro? Een rekenvoorbeeld"**. 4 levers as stats: zelfverbruik, piek afvlakken, goedkope uren [`negatievePrijsUren2025`], gas eruit [`voorbeeldBesparingWarmtepomp`]. Stacked bar "voorbeeldgezin vóór / na" (only fact-backed segments). Profile assumptions [`gasverbruikGezin`, `stroomverbruikGezin`] in "Bekijk aannames". | lime **"Gratis berekening"** | FactNotes, citable numbers | `sections/DataBand` |
| 6 | **Niet elk huis heeft alles nodig** | "What would fit *my* house?" (honesty) | A2 | W | h2 **"Waarom we nooit één product duwen"**. 3 photo cards: Rijwoning (`gen/rijwoning-zonnepanelen.jpg`) → zon + slim sturen, batterij "misschien"; Jaren '70-woning → warmtepomp + PVT; Nieuwbouw (`gen/nieuwbouw-gezin.jpg`) → all-electric. Each: Figtree tags for products, link to matching project. | soft links → projects | H2 (02) | `sections/CardRow skin="photo"` |
| 7 | **Eerlijk statement** | Reverse risk | G | L | **"We rekenen eerst. Is er geen winst, dan zeggen we dat."** 3 link pills → comparisons (gasketel-vs-warmtepomp, met-of-zonder-thuisbatterij, vast-vs-dynamisch-energiecontract). | link pills | — | `sections/Statement bg="L"` |
| 8 | **Klantverhaal** | "Proof from a real-feeling family" | C | I | Quote variant: project `nieuwbouw-leuven-all-electric` quote + name + gemeente (PLACEHOLDER), image `gen/nieuwbouw-gezin.jpg` (crop differs from #6) or project image. | lime **"Zo'n berekening voor jouw woning?"** → `#berekening` | — | `sections/ImagePanel variant="quote"` |
| 9 | **FAQ** | Objections | FAQ | W | 6 Q's from 02 §2.1. | — | FAQPage JSON-LD | `sections/Faq` |
| 10 | **Lead** | Convert | Lead | I | Heading **"Welke combinatie past bij jouw woning? We rekenen het uit."** `bron="/hoe-het-werkt"`. | form | — | `lead/LeadSection` |

Chain: I · W · D · W · D · W · L · I · W · I. Geometries all distinct except G×2 (rows 2, 7, not adjacent). Pins: 1 (D). Image sections: 3 ✓. Dense/airy: G X(airy) D(reading) H A2(dense×2) G C(airy) ✓.

---

## 3. Service page template `/diensten/[slug]` (×7, ≥1200 words, Service + FAQPage + BreadcrumbList)

A full landing page per product. **Shared skeleton** (rows 1–6, 9–11) + **unique rows** (3 content, 7 signature, 8 story) so pages are never duplicates.

| # | Section | Goal | Geo | Bg | Content | CTA | SEO block | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | **PageHero** | "Is this page about my situation?" | Hero (framed) | I | Breadcrumb `Home › Diensten › {shortTitle}`. H1 from 02 §2.2. Lead = the family's pain question (03 §3.2, e.g. WP: "Je gasketel is aan vervanging toe. Wat als je volgende 'ketel' 4× zo zuinig is?"). Trustline. Glass fact card = `service.heroFact`. Image `service.image` (see 07). "Laatst bijgewerkt {updatedAt}" small. | hero pill **"Bereken of {product} loont voor jou"** → `#berekening` (interesse preselected); ghost **"Hoe past het in je systeem?"** → `#systeem` | H1, BreadcrumbList, Service JSON-LD | `sections/PageHero variant="image"` |
| 2 | **Kort antwoord + Herken je dit?** | "Do they understand me?" | B (p1) | W | Sticky left column: eyebrow "Herken je dit?", h2, **KortAntwoord** box (grey). Cards (3, alternating D / G / photo): `service.painPoints[]` (03 §1.1 + product-specific). | none | H2 "Kort antwoord", "Herken je dit?" (02 skeleton 1–2) | `sections/StackCards` + `ui/KortAntwoord` |
| 3 | **Kost & opbrengst** ⟨unique content⟩ | "Does it pay – with real numbers?" | H | D | Top line: "Wat je vaak hoort: '{myth}'" (from `MYTHS` where `usedOn` includes slug). h2 **"Wat kost {product} en wat levert het op?"** `service.dataBand` (chart type + 3 stats, see §3.1). Sub-block h2 **"Premies, btw en regels"**: 2–3 rows from facts. `whenTrue` honesty line. Assumptions accordion. | lime **"Bereken of {product} loont voor jou"** | 02 skeleton 5 + 8, FactNotes | `sections/DataBand` |
| 4 | **Hoe werkt het & hoe past het in je systeem** | "How does it work, and with what?" | D (p2) | W | id `systeem`. Steps (3–4): ① h2 **"Hoe werkt {product}?"** (plain explanation, 200 words) ②–④ h2 **"Hoe past het in jouw energiesysteem?"** – one step per complementary service (01 §5.2) with the house mini-diagram highlighting this product + partner. | text links → complementary services, `/hoe-het-werkt` | 02 skeleton 3–4, ~500 words | `sections/StickySplit` (media = `HouseDiagram mode="mini" highlight={slug}`) |
| 5 | **Wanneer we het afraden** | Reverse risk (honesty USP) | G | L | Eyebrow "Eerlijk is eerlijk", statement **"Soms raden we een {product} af."** 2–4 pills = `service.advisesAgainst[]` (e.g. batterij: "Weinig avondverbruik", "Klein zonnesysteem", "Vast contract zonder piekprobleem"). Link → `/projecten/gezin-kortrijk-geen-batterij-advies` or `/blog/waarom-wij-soms-nee-zeggen`. | soft link | H2 "Wanneer raden we het af?" (02 skeleton 6) | `sections/Statement bg="L"` |
| 6 | **Wat we voor jou berekenen** | "What do I actually get?" (core USP) | A2 | D | h2 **"Wat onze ingenieur voor jou uitrekent"**. 4 cards from `service.calculates[]` (e.g. WP: warmteverlies per kamer · radiatorcheck & aanvoertemperatuur · SCOP bij jouw woning · impact op capaciteitstarief), lime progress bars. Under row: "Wat je krijgt" tags from `service.deliverables[]` (installatie, AREI-keuring, indienststelling, monitoring-app, garantie PLACEHOLDER, premieaanvraag). | none | 02 skeleton 7 | `sections/CardRow skin="photo"` |
| 7 | **Signature** ⟨unique, novel slot⟩ | product-specific question (see §3.1) | per service: F / E / X / I | W | see §3.1 | per §3.1 | adds unique H2 + 150–250 words | per §3.1 |
| 8 | **Klantverhaal** ⟨unique⟩ | "Did it work for a family like mine?" | C | I | `service.featuredProject` → image, quote, "€ X → € Y /maand" (indicatief), name + gemeente, "Voorbeeldproject". | lime **"Zo'n berekening voor jouw woning?"**; link "Bekijk het project" + "Alle projecten" | 02 skeleton 9 | `sections/ImagePanel variant="quote"` |
| 9 | **Reviews** | Social proof filtered on product | J (static, 3–6) | D | h2 **"Wat gezinnen zeggen over hun {product}"**; `reviews.ts` filtered by product (fallback: general). "Voorbeeldreviews". | none | no schema | `sections/ReviewWall variant="static"` |
| 10 | **FAQ + verder lezen + bronnen** | Remaining objections + recirculation | FAQ | W | 6–8 Q's (02 §2.2). Footer of section: "Verder lezen" link list (2–3 kennisbank, 1–2 comparisons, 1 blog – 01 §5.2) + `SourcesList` ("Bronnen & aannames", auto from used fact keys). | soft links | FAQPage JSON-LD; 02 skeleton 10–11 | `sections/Faq` (+ `relatedLinks`, `sources` props) |
| 11 | **Lead** | Convert | Lead | I | Heading **"Bereken of {product} loont in jouw woning."** `defaultInteresse={[slug]}`, `bron="/diensten/{slug}"`. | form | — | `lead/LeadSection` |

Chain: I · W · D · W · L · D · W · I · D · W · I. Geometries Hero·B·H·D·G·A2·(F/E/X/I)·C·J·FAQ·Lead, all different. Pins: B + D = 2. Image: 3 ✓. Dense/airy: B(airy) H(dense) D(reading) G(airy) A2 + signature (dense×2) C(airy) J(dense) ✓.

### 3.1 Unique content per service (rows 3, 7, 8)

| Service | Row 3 · DataBand (chart + stats) | Row 7 · Signature section | Row 8 · Story |
|---|---|---|---|
| `zonnepanelen` | Bars **"Wat is 1 kWh zonnestroom waard?"**: zelf verbruikt [`stroomprijsAllIn`] vs geïnjecteerd [`injectievergoeding`]. Stats: [`pvOpbrengstPerKwp`], [`prijsZonnepanelenPerKwp`], [`btwZonnepanelenBatterij`], [`terugdraaiendeTellerEinde`]. | **X · DayCurve** "Waar gaat jouw zonnestroom naartoe?" – day curve production vs household use, toggles *zonder sturing / + boiler & warmtepomp / + batterij*; shaded self-consumption area grows. Qualitative unless `zelfverbruikZonder/Met` facts are added. CTA soft → `/vergelijken/met-of-zonder-zonnepanelen`. | `rijwoning-antwerpen-zon-batterij` |
| `pvt-panelen` | **Table mode**: PV vs PVT vs zonneboiler (stroom ✓/✓/–, warmte –/✓/✓, bron voor warmtepomp –/✓/–, premie [`premieZonneboiler`] ended). No fabricated yields; "per project berekend". | **E · Timeline** "Ons onderzoek naar PVT" – R&D milestones (PLACEHOLDER dates) + h2 "Waarom zo weinig installateurs PVT aanbieden". Unique to this page. | `gezinswoning-gent-warmtepomp-pvt` (PVT angle quote) |
| `omvormers` | Stats: omvormer-levensduur (**add fact** `levensduurOmvormer`), [`negatievePrijsUren2025`] (injectie beperken), [`btwZonnepanelenBatterij`]. Small bar: string vs hybride feature compare. | **F · Bento** "Is je omvormer aan vervanging toe?" – tiles: stat (leeftijd), grey "4 signalen" (foutcode, opbrengst daalt, niet batterij-ready, lawaai/warmte), photo `gen/omvormer-app-klant.jpg`, wide tile "String, hybride of micro?" | `rijwoning-antwerpen-zon-batterij` (omvormer angle) |
| `thuisbatterij` | Stacked bar **"Drie manieren waarop een batterij kan opbrengen"**: zelfverbruik, lagere piek [`capaciteitstariefPerKw`], goedkope/negatieve uren [`negatievePrijsUren2025`]. Stats [`prijsThuisbatterijPerKwh`], [`injectievergoeding`]. | **X · BatterySizer** "Welke grootte past bij jou?" – 3 profile chips (klein / gemiddeld / groot avondverbruik + EV?) → indicative kWh/kW range text and a 4th outcome **"Geen batterij"**. Client-only state, text in DOM. Link → `/kennisbank/hoe-groot-moet-een-thuisbatterij-zijn`. | `gezin-kortrijk-geen-batterij-advies` (honesty case!) |
| `laadpalen` | Bars **"Wat kost 100 km thuis laden?"**: aan netprijs [`stroomprijsAllIn`] vs op zonne-overschot vs in goedkope uren (**add facts** for the latter two or show qualitative). Stats [`capaciteitstariefPerKw`], [`gemiddeldeMaandpiekKw`]. | **X · PeakCurve** "Laden zonder je piek op te blazen" – evening load curve, toggle *gewoon laden / slim laden*; maandpiek line drops; € delta from `capaciteitstariefPerKw`. | `koppel-hasselt-laadpaal-dynamisch` |
| `lucht-water-warmtepomp` | Bars **"Wat kost 1 kWh warmte?"** gas [`warmtekostGasPerKwhWarmte`] vs WP [`warmtekostWarmtepompPerKwhWarmte`]. Stats: premie per categorie [`premieLuchtWaterCat12`/`Cat3`/`Cat4`], btw [`btwWarmtepomp`] vs [`btwGasketel`], [`breakEvenScop`]. | **F · Bento** "Is jouw woning klaar voor een warmtepomp?" – tiles: stat SCOP 35 °C vs 55 °C [`scopLuchtWater35`, `scopLuchtWater55`]; grey "Radiatoren & isolatie" checklist; photo `gen/warmtepomp-tuin.jpg`; wide "Hybride als tussenstap" [`hybrideVerplichtIER`, `premieHybrideCat12`]. Link → kennisbank geschiktheid. | `gezinswoning-gent-warmtepomp-pvt` |
| `lucht-lucht-warmtepomp` | Bars **"Verwarmen per kWh: airco vs elektrische radiator"** (stroom / SCOP vs stroom – **add derived fact**). Stats [`premieLuchtLuchtCat12`], [`scopRekenwaarde`]. | **I · Rail** (W) "Per ruimte bekeken" – room cards: woonkamer, slaapkamer, zolderbureau, veranda; each: verwarmen ✓, koelen ✓, "wanneer lucht-water beter is". | `fermette-brugge-airco-zonnepanelen` |

Plus every page's rows 2, 4, 5, 6, 10 differ in data (painPoints, complementary services, advisesAgainst, calculates, FAQ), so ≥ 60% of visible text is unique per service.

---

## 4. Comparison template `/vergelijken/[slug]` (×6, ≥1200 words, Article + FAQPage)

Reader is in doubt mode → **answer first**.

| # | Section | Goal | Geo | Bg | Content | CTA | SEO block | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | **Hero + Kort antwoord** | "Give me the answer" | Hero (typographic) | W | Breadcrumb. H1 (02 §2.3, question form). Lead 1 line. **KortAntwoord** = honest verdict incl. "het hangt af van…". "Laatst bijgewerkt". | hero pill **"Laat jouw situatie doorrekenen"** → `#berekening` (2 interesses) | H1, Kort antwoord (AEO), BreadcrumbList | `sections/PageHero variant="type"` |
| 2 | **Tabel + 20 jaar** | "Prove it side by side" | H (table + line chart) | D | h2 **"Vergelijking in één tabel"**: rows aankoop (range), jaarlijkse kost, onderhoud, levensduur, comfort, CO₂, premies, toekomst – from `comparison.table`. h2 **"Kosten over 20 jaar"**: cumulative lines A / B / combinatie, assumptions accordion. *[Overseer]* 20-year lines are computed in `comparisons.ts` from fact values with **flat prices** (no invented price-growth %); say so in the assumptions. Plus 1–2 `urgency` rows (03 §5, fact-backed only). Where an option has no fact-backed cost (e.g. dynamisch contract), use `mode="table"` without chart. | lime **"Laat jouw situatie doorrekenen"** | table in HTML (`<table>`, citable), FactNotes | `sections/DataBand mode="table+chart"` + `ui/ComparisonTable` |
| 3 | **Wanneer kies je A / B** | "Which profile am I?" | B (p1) | W | Sticky left: h2 **"Wanneer kies je {A}? Wanneer {B}?"**. Cards alternate A (G grey) / B (D): profile bullets "Je hebt…". *[Overseer]* Last card = a review (tone G) from a family that had this doubt (03 beat 6 social proof). | none | H2s from 02 skeleton | `sections/StackCards` |
| 4 | **Wanneer geen van beide** | Honesty / reverse risk | C | I | Panel: h2 **"Wanneer geen van beide?"** + 2–3 sentences + link to `gezin-kortrijk-geen-batterij-advies` or related honest project. Image per comparison (reuse 07 images). | soft link to project | H2 | `sections/ImagePanel` |
| 5 | **Wat je vaak hoort** | Name & defuse myths | G | W | Statement of the main myth; pills = 2–4 related myths; under it 3-part list per myth: "Wat je hoort → Wat de cijfers zeggen → Wanneer het wél klopt" (from `MYTHS`). *Variant*: DoubtsSection only if row 3 is rendered unpinned (then Doubts = both pins). | none | H2 "Wat je vaak hoort" | `sections/Statement` (+ `MythList`) |
| 6 | **Gerelateerd** | Recirculate | I (rail) | D | 2 other comparisons, the services involved, 1–2 projects, 2–3 kennisbank (01 §5.1). | soft cards | internal links | `sections/Rail kind="mixed"` |
| 7 | **FAQ + bronnen** | Objections | FAQ | W | 5–8 Q's (02 §2.3) + `SourcesList`. | — | FAQPage | `sections/Faq` |
| 8 | **Lead** | Convert | Lead | I | **"Twijfel je nog? Wij rekenen beide scenario's voor jouw woning uit – gratis."** `defaultInteresse` = both slugs. | form | — | `lead/LeadSection` |

Chain: W · D · W · I · W · D · W · I ✓. Pins: 1. Images: 2. Dense/airy: H(dense) B(airy cards) C G(airy) I(dense) ✓.

---

## 5. Hubs

All hubs: typographic hero and the main grid form **one W section** (04 recipe). Word target ≥ 400.

### 5.1 `/diensten` (ItemList)
| # | Section | Goal | Geo | Bg | Content | CTA | SEO | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero + groepsgrid | "What do you offer, what do I need?" | Hero (type) + grid | W | H1 **"Alles wat je woning nodig heeft – en niets meer"**; lead "Vaak minder dan je denkt. We duwen geen product, we rekenen." 3 groups (h2 Opwekken · Verwarmen & koelen · Opslaan & laden), 7 cards (image 4:3, Figtree name, 1-line "zinvol als…", link). | soft per card; hero pill **"Gratis berekening"** | H1/H2, ItemList | `sections/PageHero type` + `ui/HubGrid` |
| 2 | Statement | Reframe: system, not product | G | L | **"We duwen geen product. We rekenen wat jouw woning echt nodig heeft."** | link pill → `/hoe-het-werkt` | H2 "Waarom we rekenen voor we iets voorstellen" | `Statement` |
| 3 | Projecten | Proof | I (rail) | D | 4 projects | "Alle projecten" | — | `Rail` |
| 4 | FAQ | | FAQ | W | 4 Q's | | FAQPage optional | `Faq` |
| 5 | Lead | | Lead | I | **"Liever meteen weten wat het voor jóuw woning betekent?"** | form | | `LeadSection` |

### 5.2 `/vergelijken`
1 Hero + decision cards (W; groups Verwarming / Zonne-energie / Opslag & contract; each card = the doubt as a question "Gasketel of warmtepomp?" + 1-line verdict teaser) → 2 **H·D "Hoe we vergelijken"**: 4 dated key assumptions [`stroomprijsAllIn`, `gasprijsAllIn`, `scopRekenwaarde`, `injectievergoeding`] + "Bronnen & aannames" accordion → 3 FAQ·W → 4 Lead·I. Chain W · D · W · I ✓.

### 5.3 `/projecten`
1 Hero + filter + grid (W; H1 **"Gezinnen zoals jij, facturen zoals je wil"**; Figtree filter chips by product + woningtype, client state only; cards 4:3 with **hoofdgetal "€ X → € Y /maand"**, "Voorbeeldproject" badge; Kortrijk card visually equal) → 2 **J·D** reviews (static, 6) → 3 **FAQ·W** (02 H2 "Hoe we resultaten meten" = FAQ intro paragraph + first item) → 4 Lead·I ("Zo'n berekening voor jouw woning?"). Chain W · D · W · I ✓.

### 5.4 `/blog`
1 Hero + post grid (W; featured post large 16:9 + grid 3-up; author + date + category) → 2 **Rail I·D** "Uit de kennisbank" (3–5) → 3 Lead·I (**"Wat betekent dit voor jouw factuur?"**). No FAQ (02). Chain W · D · I ✓.

### 5.5 `/kennisbank`
1 Hero + 5 category blocks (W; per category h2 + list of articles with their 1-line Kort-antwoord teaser; anchor chips at top) → 2 **G·L** "Elk getal met bron en datum. Laatst gecontroleerd: {asOf}." → 3 FAQ·W → 4 Lead·I. Chain W · L · W · I ✓.

---

## 6. Detail templates

### 6.1 Project `/projecten/[slug]` (≥500 words, Article, no Review schema)
| # | Section | Goal | Geo | Bg | Content | CTA | SEO | Component |
|---|---|---|---|---|---|---|---|---|
| 1 | PageHero | "Who is this family?" | Hero (framed) | I | H1 pattern 02 §2.6 ("Van gasfactuur naar bijna niets in een jaren '70-woning"); chips woningtype · bouwjaar · producten; glass fact card "€ X → € Y /maand" (indicatief); "Voorbeeldproject" badge. | hero pill **"Zo'n berekening voor jouw woning?"** | H1, Article | `PageHero image` |
| 2 | Het verhaal | situation → doubt → what we calculated | Prose (with sticky side-titles) | W | H2 De situatie · De uitdaging · Hun twijfel · Wat we berekenden (mini scenario table incl. "niets doen" and what we advised against). Kortrijk: extra callout h2 "Waarom we geen batterij plaatsten". | none | H2 outline 02 | `sections/Prose` + `ui/ScenarioTable` |
| 3 | Het resultaat | "Prove it" | H (stats) | D | CountUp: factuur vóór/na, zelfverbruik %, terugverdientijd, premie – from `project.results` (PLACEHOLDER, "gemeten over X maanden"). | lime **"Zo'n berekening voor jouw woning?"** | — | `DataBand` |
| 4 | In hun woorden | Emotion | C (quote) | I | Big quote, name + gemeente. | — | H2 "In hun woorden" | `ImagePanel quote` |
| 5 | Galerij | See the install | I (rail, 1:1) | W | 4–8 images `project.gallery`. | — | alt texts | `Rail kind="image"` |
| 6 | Ook interessant | Recirculate | A2 | D | 3 cards: used product(s) → service, related comparison, other project. | soft | internal links | `CardRow photo` |
| 7 | FAQ | | FAQ | W | 4 template Q's (02). | | | `Faq` |
| 8 | Lead | | Lead | I | `defaultInteresse = project.products`. | form | | `LeadSection` |

Chain I · W · D · I · W · D · W · I ✓ (I sections: 3, never adjacent).

### 6.2 Article `/blog/[slug]` & `/kennisbank/[slug]` (≥900 words)
| # | Section | Geo | Bg | Content | CTA | SEO | Component |
|---|---|---|---|---|---|---|---|
| 1 | Hero | Hero (type) | W | Breadcrumb (kennisbank: with category label), category Tag, H1, author (→ `/team#slug`) + "Laatst bijgewerkt", **KortAntwoord**. | none | H1, Article/BlogPosting, BreadcrumbList | `PageHero type` |
| 2 | Body | Prose | W (hairline exception) | Sticky TOC; inline soft CTA card after Kort antwoord ("Wat betekent dit voor jouw factuur?"); H2 questions; `Callout` variants: rekenvoorbeeld, mythe ("Veelgehoord: …"), eerlijkheid ("Wanneer dit voor jou níet interessant is"); 1 mid CTA card after rekenvoorbeeld; `SourcesList`; `AuthorBox`. | inline cards → `#berekening` | 900–1200 words | `Prose`, `Callout`, `InlineCta`, `AuthorBox` |
| 3 | Gerelateerd | I (rail) | D | 2 related articles, 1–2 services, 1 comparison. | soft | links | `Rail mixed` |
| 4 | FAQ | FAQ | W | Kennisbank: 5 Q's (FAQPage). Blog: only if ≥3 FAQs; otherwise omit row 4 (rail D → Lead I still valid). | | FAQPage | `Faq` |
| 5 | Lead | Lead | I | **"Je hebt nu de theorie. Wil je de cijfers voor jouw woning?"** | form | | `LeadSection` |

---

## 7. Company pages

### 7.1 `/hoe-we-werken` (HowTo, ≥700 words)
1 **Hero (type)·W** – H1 **"Van je jaarafrekening naar een installatie die écht opbrengt"** *[Overseer, see 02]*, sub "En nee, je zit nergens aan vast." KortAntwoord-style summary of the 6 steps. CTA **"Start met stap 1"**.
2 **E·D Timeline** – 6 steps (01 §1.1): per step h2, "Wat jij doet / Wat wij doen", duration chip, cost chip ("gratis" for 1–3). Step 6 ends "Start hieronder ↓".
3 **F·W Bento** "Wat als het niet loont?" – stat (D, `adviceAgainstPct` PLACEHOLDER), grey "Je krijgt het zwart op wit, ook als ons advies 'niets doen' is", photo `gen/ingenieur-aan-tafel.jpg`, review tile (process review), wide tile "Garanties & opvolging" (PLACEHOLDER terms) + "Wij vragen je premies aan" [`premieLuchtWaterCat12`].
4 **I·D Rail** team members (→ `/team`).
5 **FAQ·W** (6, 02). 6 **Lead·I** **"Start met stap 1: je gratis berekening."**
Chain W · D · W · D · W · I ✓. Pins 0.

### 7.2 `/over-ons` (AboutPage, ≥700 words)
1 **PageHero·I** (`gen/ingenieur-aan-tafel.jpg`) H1 **"We rekenen eerst. Verkopen komt pas daarna – of niet."**
2 **G·W** pain/myth: **"Je hebt al drie verkopers over de vloer gehad. Elk met een ander verhaal."** + 2 paragraphs story intro.
3 **E·D Timeline** "Waarom we VB-TEC startten" → milestones incl. "Onderzoek naar PVT" (PLACEHOLDER years).
4 **F·W Bento** values: Klant eerst · Eerlijk (stat % afgeraden) · Systeem i.p.v. product · R&D PVT (photo `gen/pvt-dak-detail.jpg`).
5 **I·D Rail** team. 6 **C·I** client story (`fermette-brugge-airco-zonnepanelen` quote, `gen/fermette-airco.jpg`).
7 **FAQ·W** (4). 8 **Lead·I** **"Leer ons kennen via een eerlijke berekening."**
Chain I · W · D · W · D · I · W · I ✓ (I: 3, not adjacent).

### 7.3 `/team` (Person schema, ≥300 words)
1 **Hero (type) + team grid·W** – H1 **"De mensen die bij jou thuis komen rekenen"**; cards portrait 4:5 (PLACEHOLDER silhouettes until real photos; no AI faces), name, rol, certificaten (text tags), "rekende al X installaties", one personal line; `id={slug}` anchors.
2 **I·D Rail** "Artikels van ons team" (blog + kennisbank by author).
3 **FAQ·W** (4). 4 **Lead·I** **"Laat een van onze ingenieurs jouw woning doorrekenen."** Chain W · D · W · I ✓.

### 7.4 `/contact` (ContactPage + LocalBusiness)
1 **Hero (type)·W with form** – H1 **"Vraag je gratis berekening aan"**; desktop: form card (LeadForm `variant="contact"`, id `berekening`) right, left: "Wat er daarna gebeurt" (3 mini-steps), tel/e-mail/adres/werkgebied/openingsuren from `company.ts` (PLACEHOLDER), 1 review. Mobile: form first.
2 **F·D** details band: werkgebied (static SVG map of Vlaanderen, no embed), response-time promise, opening hours, NAP card.
3 **FAQ·W** mini (4). No LeadSection, no sticky mobile CTA. Chain W · D · W ✓.

### 7.5 `/privacy` and 404
- Privacy: **Hero (type)·W** → **Prose·W** (PLACEHOLDER legal text, marked) → **CtaBand (G compact)·D** "Liever meteen rekenen? → Gratis berekening" (links to `/contact#berekening`).
- 404: **Hero (type)·W** "Deze pagina bestaat niet (meer)." + 4 link cards (home, hoe-het-werkt, diensten, kennisbank) → **CtaBand·D**.

---

## 8. Component inventory (build once – foundation builder)

Folder convention: `src/components/ui/*` (primitives), `src/components/motion/*`, `src/components/sections/*` (geometries), `src/components/site/*` (chrome), `src/components/lead/*`. All server components unless marked **(client)**. All sections accept `id?`, `headerTone` is derived from `bg` (`D`/`I` → "dark", `W`/`L` → "light") and written as `data-header-tone`.

### 8.1 Shared types (`src/content/types.ts`)
```ts
type Bg = "W" | "D" | "L" | "I";
type Href = string;                       // from routes helpers, never string-built in components
type ImageRef = { src: string; alt: string; width?: number; height?: number; focal?: string };  // via content/images.ts
type Cta = { label: string; href: Href; variant?: CtaVariant; interesse?: string[] };
type FactKey = import("./facts").FactKey;
type FaqItem = { q: string; a: string; aLong?: string };
type LinkItem = { href: Href; label: string; kind?: "service"|"comparison"|"project"|"article"|"post" };
```

### 8.2 Primitives (`ui/`)
| Component | Props | Notes |
|---|---|---|
| `Section` | `{ bg: Bg; id?; labelledBy?; framed?: boolean; pad?: "flow"|"screen"|"none"; className?; children }` | sets `data-header-tone`, side margins, frame for I |
| `SectionIntro` | `{ eyebrow?: string; title: ReactNode; as?: "h1"|"h2"|"h3"; align?: "split"|"center"; tone?: "light"|"dark"; lead?: ReactNode; aside?: ReactNode; titleId?: string; wordReveal?: boolean }` | 503u eyebrow column; `aside` used for rail arrows |
| `CtaPill` | `{ href; children; variant: "lime"|"hero"|"white"|"ghost-dark"|"ink"; size?: "md"|"sm"; type?: "button"|"submit"; pending?: boolean; prefetch?: boolean }` | arrow circle rotate 45°; `#berekening` hrefs smooth-scroll + focus form heading |
| `TextLink` | `{ href; children; tone?; arrow?: boolean }` | underline sweep |
| `IconCircle` | `{ icon: ComponentType; fill: "pale"|"lime"|"ring"|"glass"; size?: "lg"|"md"|"sm" }` | |
| `Icon` set | one file `ui/icons.tsx` merging hero/products/services/mission icons + new: Pvt, Airco, Inverter, Check, Plus, Info, ChevronLeft/Right, Phone, Mail, Map | stroke style unchanged |
| `Tag` | `{ children; tone?: "grey"|"light"|"ring"|"lime"; href?: Href; size?: "md"|"sm" }` | Figtree for labels |
| `FactNote` | `{ keys: FactKey[]; variant?: "pill"|"footnote"|"inline"; tone? }` | "indicatief · bron: X, stand Y"; `estimate:true` adds "schatting" |
| `FactValue` | `{ k: FactKey; format?: Intl.NumberFormatOptions; withNote?: boolean }` | nl-BE format; only way to print a number |
| `KortAntwoord` | `{ children; label?: string = "Kort antwoord"; factKeys?: FactKey[]; tone? }` | grey #eee card, Lexend label |
| `TrustLine` | `{ items?: string[]; tone? }` | default 3 items from 03 §2.1 |
| `PlaceholderBadge` | `{ label: "Voorbeeldproject"|"Voorbeeldreviews"|string }` | visible until data is real |
| `Breadcrumbs` | `{ items: { label: string; href?: Href }[]; tone? }` | emits BreadcrumbList JSON-LD (skips non-link category) |
| `JsonLd` | `{ data: object | object[] }` | `JSON.stringify(...).replace(/</g,'\\u003c')` |
| `SmartImage` | `{ image: ImageRef | ImageKey; sizes: string; preload?: boolean; quality?: 75|90; ratio?: "16/9"|"4/3"|"3/2"|"1/1"|"4/5"|"16/10"; parallax?: boolean; className? }` | wraps next/image, slate placeholder bg |
| `Accordion` | `{ items: { title: ReactNode; body: ReactNode; id? }[]; tone?; defaultOpen?: number }` | `<details>/<summary>`; used by Faq + "Bekijk aannames" |
| `Callout` | `{ kind: "rekenvoorbeeld"|"mythe"|"eerlijk"|"info"; title?; children }` | Prose only |
| `InlineCta` | `{ title: string; body?: string; cta: Cta }` | small card inside Prose / diagram |
| `AuthorBox` | `{ member: TeamMember; updatedAt: string; compact?: boolean }` | links `/team#slug` |
| `SourcesList` | `{ keys: FactKey[]; title?: string = "Bronnen & aannames" }` | dedupes, lists source + asOf + url |
| `ComparisonTable` | `{ columns: string[]; rows: { label: string; cells: ReactNode[]; factKeys?: FactKey[] }[]; highlightCol?: number; caption: string }` | real `<table>`; ≤900px reflows to cards |
| `ScenarioTable` | `{ scenarios: { name: string; advised: boolean | "afgeraden"; yearly: ReactNode; note?: string }[] }` | project pages |
| `ProjectCard` / `ArticleCard` / `ServiceCard` / `ComparisonCard` / `TeamCard` / `ReviewCard` | `{ item; variant?: "rail"|"grid"|"photo"; tone? }` | one card per content type, reused by Rail/grids |
| Charts: `BarChart`, `LineChart`, `StackedBar`, `StatRow` | `BarChart { bars: { label; value: FactKey | number; series: "base"|"good"|"mid" }[]; unit; max? }` · `LineChart { series: { label; points: number[]; series }[]; xLabels: string[] }` · `StackedBar { rows: { label; segments: { label; value; series }[] }[] }` · `StatRow { stats: { k: FactKey | number; label: string; suffix?; prefix? }[] }` | pure SVG/HTML, animate per 04 H |

### 8.3 Motion (`motion/`, client)
| Component | Props |
|---|---|
| `Reveal` | `{ as?: ElementType; children; threshold?: number = 0.25; stagger?: number; once?: boolean = true; className? }` – sets `data-reveal`, `data-ready`, `data-visible` |
| `WordReveal` | `{ text: string; as?: "h1"|"h2"|"p"; highlight?: string[]; scrub?: boolean; className? }` (server-splits words; client only triggers) |
| `CountUp` (move from mission/) | `{ to: number; decimals?: number; prefix?: string; suffix?: string; delay?: number; duration?: number }` – SSR final value |
| `ScrollProgress` | `{ axis: "x"|"y"; targetRef?; className? }` |
| `StickToBottom`, `HoldAndFade` | existing, unchanged |

### 8.4 Section geometries (`sections/`)
| Component | Geo | Props |
|---|---|---|
| `PageHero` | Hero | `{ variant: "image"|"type"; breadcrumb?: BreadcrumbItem[]; eyebrow?; title: string; lead?: ReactNode; image?: ImageRef; cta?: Cta; secondaryCta?: Cta; trustLine?: boolean; factCard?: { k?: FactKey; title: string; value?: ReactNode; image?: ImageRef }; kortAntwoord?: ReactNode; chips?: string[]; updatedAt?: string; author?: TeamMember; placeholderBadge?: string; children? /* type variant: grid or form */ }` |
| `CardRow` | A1/A2 | `{ skin: "tiles"|"photo"; intro?: IntroProps; items: { title; body?; image?: ImageRef; icon?; href?; tags?: string[]; progress?: boolean }[]; numbered?: boolean; bg: "W"|"D"; cta?: Cta; footer?: ReactNode }` |
| `StackCards` (client for scale/dim) | B | `{ intro: IntroProps; aside?: ReactNode /* KortAntwoord */; cards: { eyebrow?; title; body?; tone: "D"|"G"|"I"; image?: ImageRef; factKeys?: FactKey[]; link?: LinkItem }[]; bg: "W"|"D"; pinned?: boolean = true }` |
| `ImagePanel` | C | `{ image: ImageRef; align: "left"|"right"; eyebrow?; title: string; titleAs?: "h2"|"h3"; body?: ReactNode; cta?: Cta; secondary?: LinkItem; quote?: { text: string; name: string; place: string; meta?: string }; placeholderBadge? }` |
| `StickySplit` (client) | D | `{ intro?: IntroProps; steps: { eyebrow?; title: string; titleAs?: "h2"|"h3"; body: ReactNode; media: { kind: "image"; image: ImageRef } | { kind: "node"; node: ReactNode }; factKeys?: FactKey[]; links?: LinkItem[] }[]; bg: "W"|"D"; id? }` |
| `Timeline` (client for line) | E | `{ intro: IntroProps; steps: { title: string; body: ReactNode; duration?: string; cost?: string; date?: string; image?: ImageRef; whoDoesWhat?: { jij: string; wij: string } }[]; bg: "D"|"W"; cta?: Cta }` |
| `Bento` | F | `{ intro: IntroProps; tiles: ( { kind: "stat"; to: number; suffix?; label; pill?; factKeys? } | { kind: "photo"; image; title; body?; icon? } | { kind: "grey"; title; body?; tags?: string[] } | { kind: "review"; review: Review } | { kind: "wide"|"tall"; title; body; image?; cta? } )[]; bg?: "W"|"D" }` |
| `Statement` | G | `{ eyebrow?; text: string; textAs?: "h2"|"p"; heading?: string /* separate small h2 */; highlight?: string[]; support?: ReactNode; pills?: { label: string; href?: Href; tone?: "grey"|"dark"|"lime" }[]; bg: "W"|"D"|"L"; cta?: Cta; scrub?: boolean; kortAntwoord?: ReactNode; compact?: boolean /* CtaBand */ }` |
| `DataBand` | H | `{ intro: IntroProps; myth?: string; mode: "stats"|"chart"|"table"|"table+chart"; stats?: StatRowProps["stats"]; chart?: { type: "bar"|"line"|"stacked"; props }; table?: ComparisonTableProps; extra?: { title: string; rows: { label; k: FactKey }[] } /* premies */; whenTrue?: string; urgency?: { k: FactKey; label }[]; assumptions: FactKey[]; cta?: Cta }` (bg fixed D) |
| `Rail` (client for arrows/drag) | I | `{ intro: IntroProps; kind: "project"|"article"|"team"|"image"|"mixed"|"room"; items: unknown[]; bg: "W"|"D"; viewAll?: LinkItem; endCard?: Cta }` |
| `ReviewWall` | J | `{ intro: IntroProps; reviews: Review[]; variant: "marquee"|"static"; bg: "W"|"D"; summary?: { score: string; count: string; source: string }; filterProduct?: string }` |
| `Faq` | fixed | `{ eyebrow?: string = "Veelgestelde vragen"; title?: string; items: FaqItem[]; emitSchema?: boolean; relatedLinks?: LinkItem[]; sources?: FactKey[] }` |
| `Prose` | fixed | `{ toc?: { id; label }[]; children; author?: TeamMember; updatedAt?: string; sources?: FactKey[] }` |
| `HouseDiagram` (client) — novel X | X | `{ mode: "teaser"|"full"|"mini"; scenes?: ("dag"|"avond"|"winter"|"piek")[]; initialScene?; highlight?: ServiceSlug[]; hotspots: from content/system.ts; cta?: Cta; id? }` – SVG house, hotspots = buttons with popovers, text alternative always rendered |
| `DayCurve` / `PeakCurve` (client) — service signatures | X | `{ toggles: { key; label }[]; series per toggle (from content); caption; factKeys }` (one generic `CurveExplorer` with two configs) |
| `BatterySizer` (client) | X | `{ profiles: { key; label; result: { kwh?: string; kw?: string; advice: string; noBattery?: boolean } }[]; link?: LinkItem }` |
| `HubGrid` | — | `{ groups: { title: string; items: Card[] }[]; kind }` |
| `ProjectFilterGrid` (client) | — | `{ projects: Project[]; filters: { products: string[]; types: string[] } }` (no URL state) |

### 8.5 Chrome & lead
| Component | Props |
|---|---|
| `site/Header` (client) | `{ initialTone?: "dark"|"light" }` – nav from `content/navigation.ts`, mega panels, hide/show, tone observer |
| `site/MobileMenu` (client) | `{ open; onClose; nav }` |
| `site/MobileStickyCta` (client) | `{ hidden?: boolean }` – hides when `#berekening` in view |
| `site/Footer` | none (data from navigation.ts / company.ts; static year) |
| `site/SkipLink` | none |
| `lead/LeadSection` | `{ bron: string; defaultInteresse?: string[]; heading?: string; subheading?: string; variant?: "full"|"contact"; image?: ImageRef; review?: Review }` |
| `lead/LeadForm` (client, `useActionState`) | `{ bron; defaultInteresse?; variant }` → `submitLead` in `src/lib/lead.ts` |
| `lead/ChoiceChips`, `lead/Field`, `lead/StepIndicator`, `lead/SuccessState` | internal |

### 8.6 Content files needed (beyond 01 §6)
- `content/home.ts` – hero copy, slider slides, pain cards, mission tiles, steps, myth pills, house-teaser captions.
- `content/system.ts` – HouseDiagram hotspots & scenes (per component: label, slug, per-scene text, factKey).
- `content/images.ts` – ImageKey → `{src, alt (nl), ratio}` incl. all `gen/*`.
- `services.ts` extra fields: `heroLead`, `heroFact`, `image`, `painPoints[]`, `dataBand`, `systemSteps[]`, `advisesAgainst[]`, `calculates[]`, `deliverables[]`, `signature: { kind: "curve"|"bento"|"timeline"|"sizer"|"rail"; ... }`, `featuredProject`, `faq[]`, `updatedAt`.
- `comparisons.ts`: `kortAntwoord`, `table`, `scenario20y`, `whenA[]`, `whenB[]`, `whenNeither`, `mythKeys[]`, `image`.
- `site.ts` *[Overseer: replaces company.ts + navigation.ts]*: `isPlaceholder`, NAP, `adviceAgainstPct`, `calculationsCount`, `responseTime`, `leadTimeWeeks?`, guarantees, `navigation` – all PLACEHOLDER.
- Facts **added by Overseer** (2026-11-01): `levensduurOmvormer`, `levensduurGasketel`, `zelfverbruikZonder`, `zelfverbruikMet`, `scopLuchtLucht`, `evVerbruikPer100km`, `kostPer100kmThuisNet`, `kostPer100kmZonOverschot`, `warmtekostAircoPerKwhWarmte`, `warmtekostElektrischPerKwhWarmte`, `terugverdientijdZonnepanelen`. Laden in goedkope/dynamische uren has **no** fact → that bar stays qualitative ("meestal goedkoper, wisselt per uur").

---

## Open issues
- ~~Missing facts listed in §8.6~~ → added by Overseer, except dynamic-hour charging cost (qualitative).
- Only one PVT project exists (Gent) – it serves both `pvt-panelen` and `lucht-water-warmtepomp` stories; recommend adding a second PVT placeholder project.
- Products strip shows 5 tiles + 2 tags until PVT/airco product cut-outs exist.
- Team portraits: placeholders only (no AI faces of "employees").

## Notes from UI/UX

**Hierarchy**
- One H1 per page; the eyebrow is never the heading. In `Statement`, the large visual quote is a `<p>`/`<blockquote>` and the H2 is the plain-language line (screen readers and AEO get the question, eyes get the drama).
- Every section's first 2 seconds must answer "what is this about": the intro row h2 carries the claim; body text only supports it. Avoid two competing headings in one section (DataBand with "Premies" sub-block uses h3-styled h2 below a hairline, visually clearly secondary).
- CTA hierarchy is visual too: only one lime pill visible per viewport where possible; soft CTAs are ink text links or ghost pills. Never two lime pills side by side.
- Numbers: big value + short caption + FactNote, in that order; FactNote never larger than 14px and never hides the number.

**Readability of long text (services, comparisons, pillar, articles)**
- Long-form uses the fixed px Prose scale (19px/1.65, max 68ch) even inside StickySplit steps; never set more than ~120 words in a glass panel or on a photo.
- Chunk every H2 section: answer-first paragraph (40–60 words, bold-free), then max 3–4 short paragraphs or a list. Use `Callout` boxes to break walls of text every ~300 words.
- StickySplit text column: max 46ch, body-lg on desktop; the sticky column must never be taller than `100svh − header`; if a chapter text is longer, it scrolls with the page (no sticky) – builder checks with `max-height` media query.
- Sticky TOC in articles highlights the current H2 (IntersectionObserver), and is a `<nav aria-label="Inhoud">`.
- "Lees meer" expanders are allowed only with content in the DOM (`<details>`), never for the first paragraph.
- Contrast: body text on D uses white or `--c-on-green-2` (≥ 18px); never `#687975` for text below 20px.

**Interaction & scanning**
- Pinned sections must remain readable when the user scrolls fast: content of each card appears by 30% progress, not at the end.
- HouseDiagram: hotspots are real buttons (`aria-expanded`, labelled "Zonnepanelen – uitleg"), keyboard order left→right top→bottom, popovers close with Esc; scene tabs are a `role="tablist"`. The text alternative under the diagram doubles as the mobile experience.
- Rails: arrows + visible partial next card signal scrollability; never rely on drag only. Rail cards ≥ 44px tap targets for their links.
- Filters on /projecten: show result count ("6 projecten"), a "Wis filters" link, and an empty state that suggests a calculation instead of "geen resultaten".

**Form UX (LeadSection)**
- Above the form: one-line expectation ("Duurt minder dan een minuut · 2 stappen"); FACTS_DISCLAIMER small under the heading, not inside the form.
- Step 1 asks only about the home (low-threat), step 2 for contact data – keep that order. Progress label + bar announces with `aria-live="polite"`.
- Chips: whole chip clickable, selected state not by colour only (check icon + weight). "Ik weet het nog niet – adviseer me" is exclusive and visually separated.
- Verbruik: default to the € per month toggle (most people know their voorschot, few know kWh); "Ik weet het niet" as a link-button, not a checkbox.
- Errors: inline on blur after first interaction, summary on submit with links to fields; preserve all values; never clear the form on server error.
- Mobile keyboard types: `inputMode` numeric/tel/email as 03 §6; `enterkeyhint="next"` on step 1 numeric field, `"send"` on the last field.
- Success state: same card height, focus to heading, offer 2 soft links (hoe-het-werkt, projecten) – no new CTA pressure.
- Header CTA and all `#berekening` links: smooth scroll (instant under reduced motion), then move focus to the form heading so keyboard/screen-reader users land in the form.

## Notes from Mobile

General (≤900px): u→px per 04 §6; no pins (B/D/slide-over become plain flow); 20px gutters; check every page at 360 and 390px; sticky bottom CTA (≤56px) appears after one screen and hides near `#berekening`; header 72px.

Per section:
- **Hero (home)**: frame 8px, min-height 100svh minus browser chrome (`svh`); H1 `clamp(42px,11vw,72px)`, max 4 lines; CTA full-width hero pill, ghost CTA becomes a text link beneath; trustline wraps to 2 lines max (hide the third item <380px); HighlightsSlider moves *below* the hero image as a horizontal snap row of 1 card (82vw) – or hidden <420px; bars get 44px hit areas.
- **PageHero (image)**: min-height 78svh → 70svh; breadcrumb truncates middle items with "…"; glass fact card drops under the H1 as a full-width card inside the frame.
- **PageHero (type) + Kort antwoord**: Kort antwoord box full width directly under H1/lead, before any CTA; padding 20px.
- **Products strip (A1)**: 2-column grid (tiles 160px high), last odd tile spans 2; the 2 extra tags as a wrapped row below.
- **StackCards (B)**: intro first, then cards stacked with 16px gap, `height:auto`; on D, alternate card tones still apply; image card image 4:3 on top, text below (not overlaid) for legibility.
- **Mission bento (F)** & all Bento: single column, stat tile first (count-up), photo tile min-height 420px, grey tile auto height; tags wrap.
- **ServicesSection (A2)**: single column cards max 440px centred, 32px gap; slide-over disabled; step 4's "Start hieronder ↓" + lime CTA full-width.
- **Statement (G)**: `clamp(36px,10vw,56px)`, max 3 pills; L-band link pills become a vertical list of full-width ring pills (easier tapping).
- **DataBand (H)**: stats 2×2 (3 stats → 1 + 2); bar charts horizontal (labels left, bars right) to avoid squeezed vertical bars; line chart fits width, legend tags above; tables reflow to one card per row-label (or per option for comparisons: "Gasketel" card, "Warmtepomp" card) – no horizontal scroll tables; "Bekijk aannames" accordion closed by default.
- **ImagePanel (C)**: image 4:5 crop (focal point from `images.ts`), panel becomes a solid deep-green block *below* the image inside the frame (glass over a small photo hurts legibility); quote max 5 lines at 24px.
- **StickySplit (D)**: each step = text then media (media 4:3, not 80svh); progress dots hidden; chapter numbers stay as eyebrows.
- **Timeline (E)**: line at left 20px, all steps right; duration/cost chips wrap under the title; optional photo cards hidden <600px.
- **HouseDiagram (X)**: diagram scales to width (aspect 1:1), hotspots ≥44px; scene tabs become a segmented control above; popovers open as a bottom sheet (with close button and focus trap); the text alternative list is shown expanded below. Teaser mode: no auto-advance on mobile, show "Dag" scene + tabs.
- **Curve explorers / BatterySizer**: toggles as full-width segmented control; curve height 220px; result text below the chart, never in a tooltip.
- **Rail (I)**: cards 82vw, snap start, padding-inline 20px, arrows hidden (swipe) but progress bar visible; end CTA card same size as others.
- **ReviewWall (J)**: single row marquee at 30% slower speed, or static 3 cards + "Meer reviews" button (default for service pages); summary lime card first.
- **FAQ**: question rows min 56px, `+` circle 40px; answers 16px/1.55; related links list and sources below as accordions closed.
- **Prose**: TOC becomes a collapsible "Inhoud" `<details>` under the hero; body 17px/1.6; callouts full width, 20px padding; inline CTA card full width.
- **Lead**: frame 8px; promise text (heading + 3 checks) above the form, image as a 16:9 header strip only (form on a solid card, no overlay over text); one column; buttons full width; "Vorige" as text link above the submit; sticky CTA hidden while in view; keyboard must not cover the active field (`scrollIntoView({block:"center"})` on focus).
- **Contact**: form first, then contact details as tappable rows (tel:, mailto:, maps link), map below.
- **Footer**: columns become accordions except Contact; wordmark 24vw; bottom bar wraps; add bottom padding equal to the sticky CTA height + safe-area.
