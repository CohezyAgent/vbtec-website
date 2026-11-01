# 06 – Components & foundation API (how to use, without reading the code)

Owner: **Foundation**. Other agents: append only under `## Notes from <agent>` at the bottom (request changes there; Foundation files are frozen after phase 1).

Status: phase 1 done – 2026-11-01. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass; `/` renders 200.

---

## 0. Ground rules (read first)

- **Layout already renders**: `<SiteHeader />` (header, mobile menu, mobile sticky CTA), `<main id="inhoud">`, `<Footer />`, Organization + WebSite JSON-LD. **Pages render sections only – no `<main>`, no header/footer.**
- Every page ends with `<LeadSection bron="/route" />` (except `/contact`, `/privacy`, 404 → `CtaBand`). It owns `id="berekening"`. Every CTA to the form uses `href={routes.lead()}` (= `#berekening`); a global handler smooth-scrolls and focuses the form heading, and on a page without the form it routes to `/contact#berekening`.
- **URLs** only via `routes.*` (`src/lib/routes.ts`) or `serviceLink()/comparisonLink()/…` (`src/lib/links.ts`). **Images** only via an `ImageKey` from `src/content/images.ts`. **Numbers** only via `facts.ts` (`FactValue`, `FactNote`, `StatRow`, charts, `factText`).
- **Metadata**: `export const metadata = buildMetadata({ title, description, path })` (`src/lib/seo.ts`); dynamic: `generateMetadata` awaits `params` and returns `buildMetadata(...)`. Root sets `metadataBase`, title template `%s | VB-TEC`, `lang="nl-BE"`. Root sets **no canonical** – always pass `path`.
- **Header tone**: every section must carry `data-header-tone="dark|light"`. All foundation sections do this; for custom blocks wrap in `<Section bg=…>` or set the attribute yourself.
- **Tokens** (`src/app/globals.css`): colours `--c-*`, fonts `--font-sans|ui|label`, scale `--u`/`--ux`/`--side`/`--col-eyebrow`, type `--fs-display|statement|stat|h2|h3|h4|card-title|body-lg|body|eyebrow|small|ui`, spacing `--pad-top|bottom`, `--gap-intro|cards|steps|cta`, `--radius`, motion `--ease-*`/`--dur-*`, glass `--glass-*`. Type/spacing tokens already switch to px below 900px. NB: tokens are resolved at `:root`, so if you override `--u` locally (one-screen section) write sizes as `calc(N * var(--u))` instead of the `--fs-*` tokens.
- Long Dutch words: headings get `overflow-wrap:anywhere; hyphens:auto` below 900px globally.
- Next 16: keep pages non-async, `await params` inside a `<Suspense>` child; `generateStaticParams` ≥1; unknown slug → `notFound()`; no `Date.now()`/`Math.random()` in render.

Import paths: `@/components/ui` (barrel) or file; `@/components/sections` (barrel); `@/components/motion`; `@/components/lead/LeadSection`.

---

## 1. Content & lib (foundation-owned)

| File | Exports | Notes |
|---|---|---|
| `content/registry.ts` | `SERVICES`, `COMPARISONS`, `PROJECTS`, `POSTS`, `ARTICLES`, `KENNISBANK_CATEGORIES`, `PAGES`, `SERVICE_GROUPS`, `SERVICE_TAGLINES`, `INTERESSE_OPTIONS`; types `ServiceSlug`, `ComparisonSlug`, `ProjectSlug`, `PostSlug`, `ArticleSlug`, `KennisbankCategory`, `Interesse`; `serviceEntry(slug)`… `categoryTitle(key)` | The slug source of truth. Your content files must use these unions. |
| `content/types.ts` | `Bg`, `Href`, `ImageRef`, `ImageInput` (= `ImageRef \| ImageKey`), `ImageRatio`, `Cta`, `CtaVariant`, `LinkItem`, `FaqItem`/`Faq`, `BreadcrumbItem`, `Block`, `CalloutKind`, `Review`, `TeamMember`, `PainPoint`, `Service`, `Comparison`, `Project`, `ProjectResult`, `Post`, `Article` | Extend with an intersection type in your own file (`type MyService = Service & {…}`). |
| `content/site.ts` | `site` (NAP, `isPlaceholder`, `responseTime`, `adviceAgainstPct`, `calculationsCount`, `guarantees`, `trustLabels`, `copyrightYear`…), `TRUSTLINE`, `navigation`, `footerColumns` | PLACEHOLDER. |
| `content/images.ts` | `getImage(key)`, `resolveImage(input)`, type `ImageKey` | 14 keys from 07 (+ stock keys `step-*`, `product-*`, `slide-*`, `journey-thumb`, `service-solar`, `service-co2`). `step-assessment/-design/-install` have a blurred panel baked into the photo – only use them under a glass panel. |
| `content/reviews.ts` | `reviews` (14), `getReviewsByProduct(slug, min=3)`, `isPlaceholder`, `PLACEHOLDER_LABEL`, `reviewSummary` (null) | Never show a score or platform while placeholder. |
| `content/faqs.ts` | `GENERAL_FAQS`, `getFaqs(["berekening-kost","altijd-iets-verkopen","regio","gegevens","vastzitten","reactietijd","jaarafrekening-nodig"])` | Generic FAQs for any page. |
| `lib/routes.ts` | `routes.home() … routes.service(slug) … routes.lead() (#berekening) … routes.contactLead()`, `SITE_URL`, `LEAD_ANCHOR`, `absoluteUrl(path)` | |
| `lib/links.ts` | `serviceLink`, `comparisonLink`, `projectLink`, `postLink`, `articleLink`, `relatedLinks({services, comparisons, projects, articles, posts})` → `LinkItem[]` | Throws in dev on unknown slugs. |
| `lib/seo.ts` | `buildMetadata({ title, description, path, absoluteTitle?, type?: "article", publishedTime?, modifiedTime?, authors?, section?, noindex? })` | canonical + OG + Twitter. |
| `lib/schema.ts` (= `lib/jsonld.ts`) | `organization()`, `website()`, `localBusiness()`, `breadcrumb(items, path)`, `faqPage(faqs)`, `service({name, description, path})`, `article({type?, headline, description, path, datePublished?, dateModified, image?, author?, authorIsPlaceholder?, about?, section?})`, `howTo({name, description, steps})`, `itemList([{name, path}])`, `aboutPage(path, name)`, `contactPage(path, name)`, `persons(members, isPlaceholder)` | Placeholder-safe (no NAP, no Person, no Review while placeholder). Render with `<JsonLd data={…} />`. |
| `lib/format.ts` | `formatNumber`, `formatEuro` ("€ 1.250"), `formatDate("2026-11-01")` → "1 november 2026", `formatAsOf`, `slugify` | |
| `lib/lead-schema.ts`, `lib/lead.ts`, `app/actions/lead.ts` | validation (03 §6.6), `submitLead` (swap point, logs only), `submitLeadAction` (Server Action) | Builders don't call these directly. |

`/` already emits `localBusiness()`; `/contact` must emit `[localBusiness(), contactPage("/contact","Contact")]`.

---

## 2. Primitives – `src/components/ui`

### Section / Container
```tsx
<Section bg="W" | "D" | "L" | "I" id? labelledBy? ariaLabel? framed? pad?="flow"|"screen"|"none" contained?=true className? innerClassName?>
```
Full-bleed band; sets `data-header-tone` (D/I → dark), side margins (`contained`), paper frame for `I` (put a `SmartImage fill` inside). `Container` = side margins; `<Container narrow>` = 68ch column at the 503u line.

### SectionIntro / Eyebrow / Heading
```tsx
<SectionIntro eyebrow="Herken je dit?" title="Je factuur stijgt. Je verbruik niet." as?="h2" align?="split"|"center"
  tone?="light"|"dark" lead?={…} aside?={…} titleId? wordReveal? highlight?={["stijgt."]} />
<Eyebrow tone?>Onze aanpak</Eyebrow>
<Heading as="h2" size="display"|"statement"|"h2"|"h3"|"h4" tone?>…</Heading>
```
The shared intro row: eyebrow in the 503u column, heading right (max 1140u). Every section component takes `intro: IntroProps` with these same props (tone/titleId are set for you).

### CtaPill (= Button = PillLink) / TextLink
```tsx
<CtaPill href={routes.lead()} variant="lime"|"hero"|"white"|"ink"|"ghost-dark" size?="md"|"sm" block?>Gratis berekening</CtaPill>
<CtaPill type="submit" pending={pending} variant="lime">…</CtaPill>      // button mode
<TextLink href={routes.hoeHetWerkt()} tone?="dark" arrow?>Bekijk hoe het werkt</TextLink>
```
Pill + arrow circle rotating 45°. `hero` = split bright-lime pill (hero only). Hash/tel/mailto render `<a>`. Rule: one lime pill per viewport; on W/L use `ink`, on D/I use `lime`.

### Bits
```tsx
<IconCircle icon={SunIcon} fill="pale"|"lime"|"ring"|"glass" size="lg"|"md"|"sm" />
<Tag tone="grey"|"light"|"ring"|"lime" size?="sm" href?>PVT-panelen</Tag>        // Figtree label
<PlaceholderBadge label="Voorbeeldproject" tone?="dark" />
<CheckList items={["…","…"]} tone?="dark" />                                     // lime check bullets
```

### Facts (every number!)
```tsx
<FactValue k="injectievergoeding" suffix=" c/kWh" withNote? format?={{maximumFractionDigits:1}} />  // "ca. 1–5 c/kWh"
<FactNote keys={["stroomprijsAllIn","injectievergoeding"]} variant="pill"|"footnote"|"inline" tone? />
factText("breakEvenScop")                     // plain string for aria/labels
<KortAntwoord factKeys?={[…]} label?="Kort antwoord">40–60 woorden…</KortAntwoord>
<TrustLine tone?="dark" />                    // 3 default items (00 §2.9)
<SourcesList keys={[…]} title?="Bronnen & aannames" />
```
`formatFactValue` shows the range when a fact has one and prefixes "ca." for estimates. Derived facts show source "eigen berekening VB-TEC".

### Breadcrumbs / JsonLd
```tsx
<Breadcrumbs items={[{label:"Home",href:"/"},{label:"Diensten",href:routes.diensten()},{label:"Thuisbatterij"}]} currentPath="/diensten/thuisbatterij" tone? />
<JsonLd data={obj | obj[]} />
```
Breadcrumbs emit BreadcrumbList (items without href are shown but skipped in JSON-LD → kennisbank category). `PageHero` renders breadcrumbs for you.

### SmartImage (= Img)
```tsx
<SmartImage image="pvt-dak-detail" sizes="(max-width: 900px) 100vw, 50vw" ratio?="16/9"|"4/3"|"3/2"|"1/1"|"4/5"|"16/10"|"3/4" fill? preload? quality?={75|90} parallax? className? imgClassName? />
```
`fill` fills the nearest positioned parent; otherwise an aspect-ratio box (default 16/9). `preload` only for the first hero image. `parallax` = CSS scroll-driven drift.

### Accordion
```tsx
<Accordion items={[{ title: "Bekijk aannames", body: <…/> }]} tone?="dark" defaultOpen?={0} headingLevel?="h3" />
```
`<details>/<summary>`; content stays in the DOM.

### Content helpers (inside long text)
```tsx
<Callout kind="rekenvoorbeeld"|"mythe"|"eerlijk"|"info" title? factKeys?>…</Callout>
<InlineCta title="Wat betekent dit voor jouw factuur?" body? cta={{label:"Gratis berekening", href: routes.lead()}} tone? />
<AuthorBox member={teamMember} updatedAt="2026-11-01" compact? />
<UpdatedAt date="2026-11-01" tone? />
```

### ComparisonTable
```tsx
<ComparisonTable caption="Gasketel en warmtepomp naast elkaar" columns={["Gasketel","Warmtepomp"]} highlightCol={1}
  rows={[{ label: "Aankoop", cells: [<FactValue k="…"/>, "…"], factKeys: ["…"] }]} tone?="dark"|"light" rowHeader? />
```
Real `<table>`; ≤900px each row becomes a card with labelled cells.

### Cards (for grids and rails)
```tsx
<ProjectCard project={p} variant?="rail"|"grid" tone? />                // photo 4:3, "€ X → € Y /maand", tags, Voorbeeldproject badge
<ArticleCard href title excerpt? eyebrow? image? date? tone? />        // posts, kennisbank, mixed
<ServiceCard slug="thuisbatterij" body? image? tone? />                // Figtree name + tagline
<ComparisonCard slug="gasketel-vs-warmtepomp" verdict? tone? />
<TeamCard member={m} variant?="grid" />                               // id={slug} anchor in grid variant, silhouette if no image
<ReviewCard review={r} tone="grey"|"dark"|"lime"|"white" />
```

### Charts (pure SVG/HTML, animate on view)
```tsx
<BarChart bars={[{label:"Gasketel", value:"warmtekostGasPerKwhWarmte", series:"base"},{label:"Warmtepomp", value:"warmtekostWarmtepompPerKwhWarmte", series:"good"}]} unit=" €/kWh" tone?="dark" caption? />
<LineChart /* = CostChart */ summary="Cumulatieve kost over 20 jaar" xLabels={["0",…,"20"]} series={[{label:"Gasketel", series:"base", points:[…]}, {label:"Warmtepomp", series:"good", points:[…]}]} format?="euro" factKeys? />
<StackedBar rows={[{label:"Vóór", segments:[{label:"Gas", value:"…", series:"base"}]}]} unit? />
<StatRow stats={[{ k:"breakEvenScop", label:"break-even SCOP" }, { k: 38, label:"…", suffix:"%" }]} tone? />
```
Values are a `FactKey` (preferred) or a number (placeholder company metrics / computed series in your content file with the derivation in a comment). Series colours: `good` = lime (systeem), `base` = grey (gasketel / niets doen), `mid`. Horizontal bars at every width (no squeezed columns). LineChart includes a hidden data table for screen readers.

### Icons (`ui/icons.tsx`)
Existing: `ArrowUpRight, SolarLogo, PlayIcon, SunIcon, PulseIcon, BatteryIcon, CarIcon, FanIcon, BoltIcon, GearCycleIcon, TurbineIcon, DocumentCheckIcon, ChartUpIcon, SolarPanelIcon, EyeIcon`. New: `CheckIcon, PlusIcon, InfoIcon, AlertIcon, ChevronLeft/Right/DownIcon, ArrowLeftIcon, ArrowDownIcon, PhoneIcon, MailIcon, MapPinIcon, ClockIcon, QuoteIcon, PvtIcon, AircoIcon, InverterIcon, HomeIcon`. All take `className`.

---

## 3. Motion – `src/components/motion` (client)

```tsx
<Reveal as?="div" mode?="self"|"group"|"wipe"|"custom" stagger?={150} delay?={0} threshold?={0.25} className?>…</Reveal>
```
The one in-view trigger: sets `data-reveal`, `data-ready`, then `data-visible`. `self` = rises/fades; `group` = every descendant with `data-reveal-item` rises with stagger (`--i` set automatically); `wipe` = items clip-wipe up (Mission entrance); `custom` = attributes only, style in your module with `.x[data-ready]:not([data-visible])` / `.x[data-visible]`. Content is never hidden without JS; reduced motion shows everything.

```tsx
<WordReveal /* = RevealText */ text="…" as?="h2"|"h1"|"p"|"blockquote"|"h3" highlight?={["eerlijk."]} scrub? tone?="light"|"dark"|"lime" id? className? />
<CountUp to={38} decimals? prefix? suffix="%" delay?={300} duration?={1400} />   // SSR = final value
<ScrollProgress axis="x"|"y" tone? start? end? />                                 // thin line that fills with scroll
const inView = useInView(ref, { threshold, rootMargin, once })                    // boolean
useScrollProgress(ref, { start: 0.8, end: 0.5, varName: "--progress", onProgress })  // writes CSS var, no re-render
```
`StickToBottom` / `HoldAndFade` (`components/layout`) unchanged.

---

## 4. Sections – `src/components/sections`

All take `id?`, set `data-header-tone`, and use `intro: IntroProps` (§2). Section headings are h2; card titles h3.

| Component (alias) | Geo | Usage |
|---|---|---|
| `PageHero` | Hero | see below |
| `CardRow` | A1/A2 | `<CardRow skin="photo"\|"tiles" bg="D"\|"W" intro={…} numbered? items={[{title, body?, image?, icon?, href?, tags?, progress?}]} cta? footer? />` – A2 photo cards with glass panel (Services look) or A1 tiles. |
| `StackCards` (`StickyStack`) | B (pin) | `<StackCards bg="W"\|"D" intro={…} aside={<KortAntwoord>…</KortAntwoord>} pinned?=true cards={[{tone:"D"\|"G"\|"I", eyebrow?, title, body?, image? (for I), factKeys?, link?, footer? (e.g. <ReviewCard/>)}]} />` – sticky intro column, cards slide over each other and dim. Plain list ≤900px. |
| `ImagePanel` | C | `<ImagePanel image="pvt-dak-detail" align="left"\|"right" eyebrow? title titleAs?="h2" body? cta? secondary?={LinkItem} quote?={{text,name,place,meta?}} placeholderBadge? />` – framed photo + glass panel, wipe-in + parallax. |
| `StickySplit` (`SplitScroll`) | D (pin) | `<StickySplit bg="W"\|"D" intro? steps={[{eyebrow?, title, titleAs?, body: <>…</>, media: {kind:"image", image, caption?} \| {kind:"node", node}, factKeys?, links?, id?}]} />` – text sticks per chapter (long text OK, px reading scale). Use `media.kind="node"` for `<HouseDiagram mode="mini"/>`. |
| `Timeline` | E | `<Timeline bg="D"\|"W" intro={…} steps={[{title, body, duration?, cost?, date?, image?, whoDoesWhat?:{jij,wij}, titleAs?}]} cta? />` – line fills with scroll, nodes pop. Use `titleAs="h2"` on /hoe-we-werken. |
| `Bento` | F | `<Bento bg?="W" intro={…} tiles={[{kind:"stat", k? \| to?, suffix?, label, caption?, pill?, icon?, placeholderNote?}, {kind:"photo", image, title, body?, icon?}, {kind:"grey", title, body?, tags?}, {kind:"review", review}, {kind:"wide"\|"tall", title, body, image?, cta?, tone?:"grey"\|"dark"\|"lime"}]} />` – max 5 tiles, Mission entrance (wipe, count-up, pops). |
| `Statement` | G | `<Statement bg="W"\|"D"\|"L" eyebrow? text="…" textAs? heading?="plain h2" highlight? support? pills?={[{label, href?, tone?}]} cta? scrub? kortAntwoord? compact? />` – big centred statement, word reveal (scroll-scrubbed with `scrub`). With `heading`, the big text is a `<p>` and `heading` is the h2. Link pills become full-width list on mobile. |
| `CtaBand` | G compact | `<CtaBand text="Liever meteen rekenen?" cta={{label:"Gratis berekening", href: routes.contactLead()}} bg?="D" />` |
| `DataBand` | H (always D) | `<DataBand intro={…} myth? mode="stats"\|"chart"\|"table"\|"table+chart" stats?={Stat[]} chart?={{type:"bar"\|"line"\|"stacked", title?, props}} table?={ComparisonTableProps} extra?={{title:"Premies, btw en regels", rows:[{label,k,suffix?}]}} whenTrue? urgency?={[{k,label,suffix?}]} assumptions={FactKey[]} assumptionsNote? cta? />` – "Indicatief" pill, "Bekijk aannames" accordion lists sources. Stats render whenever `stats` is passed. |
| `StatsBand` | H | `<StatsBand intro stats assumptions? cta? whenTrue? />` = DataBand mode stats. |
| `Rail` | I | `<Rail bg="W"\|"D" kind?="project"\|"article"\|"team"\|"image"\|"mixed"\|"room" intro={…} items={[<ProjectCard …/>, …]} viewAll?={LinkItem} endCard?={{label, href, body?}} />` – pass pre-rendered cards (any mix). Arrows, drag, arrow keys, progress bar; 82vw cards on mobile. |
| `ProjectsRail` | I | `<ProjectsRail projects={featuredProjects} bg?="D" intro? endCard?=true />` |
| `ReviewWall` (`ReviewsWall`) | J | `<ReviewWall bg="W"\|"D" variant="marquee"\|"static" intro={…} reviews={reviews} filterProduct?="thuisbatterij" initial?={6} />` – shows "Voorbeeldreviews" badge, no score while placeholder. Static = masonry + "Meer reviews" (`<details>`). |
| `Faq` (`FaqSection`) | FAQ (W) | `<Faq items={FaqItem[]} eyebrow?="Veelgestelde vragen" title?="Wat je nog wil weten" lead? emitSchema? relatedLinks?={LinkItem[]} relatedTitle? sources?={FactKey[]} id?="faq" />` – emits FAQPage JSON-LD automatically when ≥3 items. |
| `Prose` | Prose (W) | `<Prose toc?={TocItem[]} author? updatedAt? sources? hairline?>{children}</Prose>` – 68ch column at the 503u line, sticky TOC (active H2 highlighted), mobile "Inhoud" `<details>`. `hairline` for the W-after-W exception. `ProseText` = typography only. |
| `ArticleBody` | – | `<Prose toc={buildToc(blocks)} …><ArticleBody blocks={post.body} faqSchema?={true} /></Prose>` – renders `Block[]`: `p`, `h2` (auto id), `h3`, `list`, `callout`, `stat`, `quote`, `image`, `faq`, `cta`, `table`, `kortAntwoord`. Inline text supports `**bold**` and `[label](/pad)`. Set `faqSchema={false}` if the page also renders `<Faq>`. |
| `MythBuster` / `MythList` | – | `<MythList keys={["warmtepomp-loont-niet","gasketel-houden"]} tone? />` (put under a `Statement` on comparison row 5) or `<MythBuster intro={…} keys={…} bg?="W" />`. Reads `MYTHS` from facts.ts: hoort → cijfers → wanneer het wél klopt. |
| `RelatedLinks` | – | `<RelatedLinks title?="Verder lezen" links={relatedLinks({…})} compact? tone? />` |
| `LeadSection` (`LeadFormSection`) | Lead (I) | see below |

### PageHero
```tsx
// image variant (services, projects, hoe-het-werkt, over-ons) – dark header, 78svh frame
<PageHero variant="image" path={routes.service(slug)}
  breadcrumb={[{label:"Home",href:"/"},{label:"Diensten",href:routes.diensten()},{label:"Thuisbatterij"}]}
  title={service.h1} lead={service.heroLead} image={service.image}
  cta={{label:"Bereken of een thuisbatterij loont voor jou", href: routes.lead()}}
  secondaryCta={{label:"Hoe past het in je systeem?", href:"#systeem"}}
  trustLine factCard={{ k:"prijsThuisbatterijPerKwh", title:"…", image? }} updatedAt={service.updatedAt}
  chips? placeholderBadge?="Voorbeeldproject" eyebrow? />

// type variant (hubs, comparisons, articles, team, contact, privacy) – light header, white
<PageHero variant="type" path="/vergelijken/…" breadcrumb={…} eyebrow? title lead?
  kortAntwoord={comparison.kortAntwoord} kortAntwoordFacts?={[…]} author?={member} updatedAt?
  cta? secondaryCta? trustLine? chips?>
  {/* optional: hub grid or contact form, rendered inside the same W section */}
</PageHero>
```
Holds the page's only `<h1 id="page-title">` and emits BreadcrumbList.

### LeadSection (end of every page)
```tsx
<LeadSection bron={routes.service("thuisbatterij")} defaultInteresse={["thuisbatterij"]}
  heading?="Bereken of een thuisbatterij loont in jouw woning." subheading? image?="woonkamer-warm-winter" review? />
// contact page (form card only, put it inside PageHero type children):
<LeadSection bron="/contact" variant="contact" />
```
Two steps (woning → gegevens) in one `<form>`, `useActionState` + Server Action, server validation (03 §6.6), honeypot, error summary (`role=alert`, focus), inline errors (`aria-invalid`/`aria-describedby`), € per maand default, "Ik weet het niet", exclusive "advies" chip, Wallonia postcode info, success panel with focus. Works without JS (both steps visible). Default heading/promises = 03 §6.2. `defaultInteresse`: service slugs and/or `"advies"`; comparisons pass `comparison.interesse`. Never put `?interesse=` in a URL.

---

## 5. Chrome – `src/components/site` (already in the layout)

- `SiteHeader` → `SiteChrome` (client, inside `<Suspense>` for `usePathname`): logo, centred glass nav pill with dropdown/mega panels (Diensten 3 columns + feature tile, Vergelijken, Kennis, Over ons), CTA "Gratis berekening" → `#berekening`. Tone follows the section under it (`data-header-tone`), floating glass bar after 24px, hides on scroll down / shows on scroll up, active item by pathname (`aria-current`), Esc/outside click closes panels. Skip link "Naar inhoud" → `#inhoud`.
- `MobileMenu` (≤900px): full-screen deep green, accordions, contact row, focus trap, Esc, scroll lock, closes on link click.
- `MobileStickyCta`: after one screen, hidden while `#berekening` is visible, hidden on `/contact`.
- `Footer`: promise + CTA, 4 link columns (+ Contact), text-only trust labels, `FACTS_DISCLAIMER`, static year, giant wordmark sweep. Mobile accordions.

Home (`/`) currently: Hero → Products → Mission/Services slide-over → LeadSection (+ LocalBusiness JSON-LD). Hero/Products/Mission/Services are rebranded to Dutch (copy inline – **Builder 1** may move it to `content/home.ts`) and Mission's entrance now runs on `Reveal` (in view) instead of `[data-hold-fade]`; `CountUp` moved to `components/motion`.

---

## 6. Deviations & open points

- Component names follow 05 §8; the brief's names exist as aliases (`Button`/`PillLink` = `CtaPill`, `RevealText` = `WordReveal`, `Img` = `SmartImage`, `StickyStack` = `StackCards`, `SplitScroll` = `StickySplit`, `LeadFormSection` = `LeadSection`, `FaqSection` = `Faq`, `ReviewsWall` = `ReviewWall`, `CostChart` = `LineChart`, `ProjectsRail`, `StatsBand`). `lib/jsonld.ts` re-exports `lib/schema.ts`.
- `ScenarioTable` is left to Builder 3 (`components/content/**`, per 00 §4). `HubGrid` → Builder 2.
- No phone link in the desktop header (no room next to the 6-item nav); phone sits in the mobile menu, LeadSection and footer.
- Header CTA pill hides ≤420px (burger + sticky CTA cover it), per 04 §6.
- Hero slider auto-advance slowed from 2s to 4s (Dutch titles are longer) and stops under reduced motion.
- Placeholder images: several 07 keys share the same stock photo; alt texts describe what is actually shown.
- StackCards scale/dim uses a small rAF scroll script (no CSS scroll timeline needed). Rail slide-in and word-reveal `scrub` use CSS scroll-driven animations where supported, static elsewhere.

## Notes from other agents

### Notes from Builder 2
- Requests (Foundation, `lead/LeadForm`): when `defaultInteresse={["advies"]}` is passed, the selected exclusive "Ik weet het nog niet – adviseer me" chip renders its check but the label is invisible (light text on light bg). I no longer preselect "advies" anywhere; please check the selected style of that chip.
- Info: Builder 2 number helpers live in `src/content/services.ts` (`fx`, `cent`, `centNum`, `eur`, `year`, `pct`). `cent()` handles both €/kWh facts and facts already in cent (`injectievergoeding`) – BarChart bars that mix those units must use `centNum()` + a separate `<FactNote>` (DataBand `children`).
