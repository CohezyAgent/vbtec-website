# 04 – Design system, section geometries & motion

> **Status: APPROVED** – Overseer, 2026-11-01. Where this file conflicts with `00-decisions.md`, 00 wins (Overseer edits in this file are marked *[Overseer]*).

Owner: **Design agent**. Other agents: append only under `## Notes from <agent>` at the bottom.

Source of truth for the look: the existing homepage (`src/components/hero`, `products`, `mission`, `services`, `doubts`, `layout`). Everything new must look like it was drawn on the same 1842 px reference canvas by the same hand. When this spec and the existing components disagree on a detail, the **existing component wins**; tell the Design agent in Notes.

Contents: 1 Tokens · 2 Section geometries (A–J + fixed blocks) · 3 Rotation rules + page recipes · 4 Motion · 5 Header, mobile menu, footer, forms · 6 Mobile rules · 7 Imagery & content details.

---

## 1. Design tokens

Put these in `src/app/globals.css` under `:root` (and the font variables on `<html>` from the root layout). Existing component modules may keep their local literals for now; **new** code uses the tokens. When touching an existing module, swap literals for tokens without changing the result.

### 1.1 Colour

```css
:root {
  /* Ink & neutrals */
  --c-ink: #061410;          /* default text on light (hero, body) */
  --c-ink-deep: #030f09;     /* headings in Mission/Doubts, footer background */
  --c-paper: #fdffff;        /* page background, hero frame */
  --c-white: #fff;           /* section background "W", cards, form card */
  --c-grey-100: #eee;        /* light cards (values card), input fill, light pills */
  --c-grey-200: #d9d9d9;     /* tags on grey cards */
  --c-grey-600: #505050;     /* eyebrows & secondary text on white (7.5:1) */
  --c-grey-quote: #9aa59f;   /* decorative quote marks only, never text */

  /* Greens */
  --c-green: #071813;        /* section background "D", stat card */
  --c-green-card: #1c2a24;   /* card / image fallback on D */
  --c-slate: #1d2733;        /* image placeholder behind photos */
  --c-on-green: #fff;
  --c-on-green-2: #b6c6c2;   /* secondary large text on D (stat captions) */
  --c-on-green-3: rgba(255, 255, 255, 0.6); /* eyebrows & small text on D */
  /* NB: #687975 / #6a7c77 (Mission stat label / pill) is 3.8:1 on --c-green:
     allowed only ≥ 20px. New small text on D uses --c-on-green-3. */

  /* Lime (accent) */
  --c-lime: #dbef75;         /* CTA pill, icon circles on dark/image, progress fills, section "L" */
  --c-lime-hover: #e5f78f;
  --c-lime-bright: #dcfe8e;  /* ONLY the hero primary CTA over the photo */
  --c-lime-pale: #dff3b6;    /* icon circles on white */
  --c-lime-pale-hover: #cdee8c;

  /* Functional */
  --c-error: #b3261e;        /* on white */
  --c-error-on-dark: #ffb4a9;/* on D / image */
  --c-focus: var(--c-ink);   /* focus ring on light; var(--c-lime) on dark */

  /* Data series (charts/tables, see geometry H) */
  --c-data-good: var(--c-lime);          /* "met VB-TEC-systeem" */
  --c-data-base: rgba(255,255,255,0.28); /* "gasketel / niets doen" on D */
  --c-data-base-light: #b9c2be;          /* same on white */
  --c-data-mid: #8fb3a6;                 /* third series if ever needed */
}
```

Rules
- Lime is never text on white (contrast fail). Lime text is allowed only on `--c-green` / ink / dark photos.
- On lime fills, text is always `--c-ink` / `#020604`.
- No new hues. "Pain" is expressed with grey/ink and copy, not red. Red only for form errors.

### 1.2 Fonts and their roles

Load all fonts once in `src/app/layout.tsx` with `next/font/google` and put the variables on `<html>`:
- `Figtree({ weight: ["600"], variable: "--font-figtree" })`
- `Lexend({ weight: ["300", "500"], variable: "--font-lexend" })`

(Then remove the per-component `Figtree(...)`/`Lexend(...)` calls in ProductsSection/ServicesSection – same variable names, so their CSS keeps working.)

| Family | Token | Role | Never use for |
|---|---|---|---|
| **Helvetica** (system: `Helvetica, Arial, sans-serif`) | `--font-sans` | The voice. All headings (weight **400**, large), statements, body copy, long-form articles, nav links, eyebrows, stat numbers, footer. Weight 700 only for short UI labels (header CTA pill, hero CTA, logo). | — |
| **Lexend** 300/500 | `--font-ui` = `var(--font-lexend), Helvetica, Arial, sans-serif` | "Interface inside content": text inside glass panels on photos (step cards), in-section CTA pills (500), form labels/inputs/buttons/chips, FAQ question rows (500), step/process titles (500) and their body (300), table headers. | Section headings, long-form body |
| **Figtree** 600 | `--font-label` = `var(--font-figtree), Helvetica, Arial, sans-serif` | Short object labels: product tiles, service names on cards/rails, chart axis/legend labels, filter chips on /projecten, badges like "PVT · R&D". Max ~3 words. | Sentences |

One section uses at most **two** families (Helvetica + one of Lexend/Figtree).

### 1.3 Scale unit

```css
:root {
  --ux: calc(100vw / 1842);                         /* one reference px by width: margins, columns */
  --u: var(--ux);                                   /* default for flowing sections */
  --side: calc(102 * var(--ux));                    /* page side margin */
}
/* One-screen sections (fill 100svh) override locally: */
.screen { --u: min(var(--ux), calc(100svh / 1100)); }   /* hero uses /1176 */
@media (max-width: 900px) { :root { --ux: 1px; --u: 1px; --side: 20px; } }
```

- Flowing sections (Mission style): `--u = --ux`.
- Screen sections (Services/Doubts style, anything pinned or `height: 100svh`): `--u = min(--ux, 100svh/1100)`; margins/columns still use `--ux` so edges align across sections.
- **Readability floor**: body text and anything < 24u must be written as `max(<px floor>, calc(N * var(--u)))` (floors below). At 1280 px wide 20.3u is only 14 px.
- Below 900 px every module sets explicit px values (see §6); do not rely on `--u: 1px` producing good sizes by accident.

### 1.4 Type scale

| Token | Desktop (u) | Line-height | Mobile (≤900px) | Use |
|---|---|---|---|---|
| `display` | 102.5u | 1.0 (102u) | `clamp(42px, 11vw, 72px)` / 1 | Page H1 on hero/page-hero only |
| `statement-xl` | 84u, ls −0.01em | 1.05 | `clamp(36px, 10vw, 56px)` | Geometry G big statements |
| `stat` | 101.5u | 1 | 72px (56px if >4 chars) | Count-up numbers |
| `h2` | 51.2u | 64u | `clamp(26px, 6.4vw, 40px)` / 1.25 | Section heading (the "statement" in the intro row) |
| `h3` | 38.2u | 1.2–48u | 28–30px / 1.3 | Card headline, big card text |
| `h4 / lead` | 30.5u | 1.2 | 22px | Stat caption, large lead lines |
| `card-title` | 25.5u | 34u | 18–20px / 1.3 | Card titles, rail items |
| `body-lg` | `max(17px, 25.5u)` | 1.5 (38.5u) | 18px / 1.5 | Card body on photos, intro paragraphs |
| `body` | `max(16px, 20.3u)` | 1.55 | 16px / 1.55 | Default text, list items |
| `eyebrow` | `max(14px, 20.3u)` | 1.2 | 15px | Eyebrow in intro row, colour grey-600 / on-green-3 |
| `small` | `max(13px, 18u)` | 1.4 | 14px | Badges, footnotes, "indicatief" notes |
| `ui` (Lexend 500) | `max(15px, 19.2u)` | 1 | 16px | CTA labels, form buttons |

Headings are weight 400, never bold. No uppercase; sentence case everywhere (Dutch).

**Long-form reading** (blog, kennisbank, privacy, long text blocks in service/comparison pages) uses fixed px, not u: body 19px/1.65 (17px/1.6 mobile), max-width 68ch, H2 34px/1.2 (26px mobile), H3 24px/1.3 (20px), paragraph spacing 1em, lists with 0.4em gaps, links underlined (1px, offset 3px) in ink, hover lime-pale highlight background.

### 1.5 Spacing

| Token | Desktop | Mobile |
|---|---|---|
| side margin | 102u (`--side`) | 20px (hero frame 8px) |
| eyebrow column | 503u wide (intro row) | stacks above, gap 16px |
| section padding, flowing | 142u top / 125u bottom | 72px / 64px |
| section padding, screen | 110u / 90u (70u / 56u if height ≤ 820px) | 72px / 64px |
| intro → content | 56–76u | 40px |
| card grid gap | 25u (tight trio/bento) · 48u (row of steps) | 16px (32px for steps) |
| content → CTA | 44u | 36px |
| stack inside card | 13u / 18u / 35u / 41u (follow Mission) | 12–28px |
| card padding | 38–39u | 28px |

**Intro row** (shared section header, from Mission/Services): `display:flex`; left eyebrow in a fixed 503u column (`--ux`), right the h2 statement (max 1140u or `flex:1`). Every section with a heading uses this, or the centred variant (geometry G). Build it once: `SectionIntro({ eyebrow, title, as?, align? })`.

### 1.6 Radii

- Cards, image frames, panels, mega menu, form card: **22u** (20px mobile; 18px for small hero cards).
- Inner panel inside a card: 22k (card-relative), thumbnails 10u.
- Inputs: single-line **999px** (pills, consistent with nav/CTA); textarea 22u/18px.
- Pills, chips, nav, CTAs: 999px. Icon/arrow buttons: 50%.
- Hero/page-hero frame: section padding 10u 12.5u 14u on `--c-paper`, inner radius 22u (8px / 20px mobile). Reuse this "framed" treatment for full-image sections (geometry C, lead section).

### 1.7 Elevation & glass

Mostly **flat**. Depth comes from overlap, glass and motion, not shadows.

```css
:root {
  --shadow-pill: 0 calc(10 * var(--u)) calc(30 * var(--u)) rgba(3, 15, 9, 0.08); /* floating pills, popovers */
  --shadow-lift: 0 calc(24 * var(--u)) calc(60 * var(--u)) rgba(3, 15, 9, 0.12); /* form card over image, mega menu */

  /* Glass on photos (step panels, image cards) */
  --glass-photo-bg: rgba(255, 255, 255, 0.1);
  --glass-photo-ring: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
  --glass-photo-blur: blur(14px) saturate(1.1);

  /* Glass for nav / header on dark */
  --glass-dark-bg: rgba(24, 34, 32, 0.38);
  --glass-dark-border: 1px solid rgba(255, 255, 255, 0.16);
  --glass-dark-blur: blur(10px);

  /* Glass for header on light (new) */
  --glass-light-bg: rgba(253, 255, 255, 0.72);
  --glass-light-border: 1px solid rgba(6, 20, 16, 0.08);
  --glass-light-blur: blur(16px) saturate(1.2);

  /* Hairlines */
  --ring-on-dark: inset 0 0 0 1.5px rgba(255, 255, 255, 0.24);
  --ring-on-dark-strong: inset 0 0 0 1.5px rgba(255, 255, 255, 0.4);
  --hairline-light: 1px solid rgba(6, 20, 16, 0.1);
}
```
Always pair `backdrop-filter` with `-webkit-backdrop-filter`. Glass only over photos or the dark green — never glass over white (it's invisible).

### 1.8 Shared components (build once, reuse everywhere)

- `CtaPill` — variants: `lime` (in-section, Lexend 500, lime pill with ink circle + lime arrow, Services `.cta`), `hero` (split pill + separate circle, Helvetica 700, Hero `.startGroup`), `white` (header contact), `ghost-dark` (1.5px white ring, white text). Arrow circle rotates 45° on hover of the whole link (`transition: transform .2s`). Height 66u / 56px mobile.
- `IconCircle` — 79u (60px) / 62u / 72k; fills: `pale` (lime-pale on white), `lime` (on dark/photo), `ring` (on-dark ring, transparent), `glass` (on photos).
- `Tag` — 56u (40px) pill, grey-200 on grey cards, `#eee` on white, ring-on-dark on D.
- `FactNote` — small pill/footnote "indicatief · bron: VREG, 2026" (small text, grey-600 or on-green-3, `ⓘ` icon). Every number from `facts.ts` rendered with a FactNote or a numbered footnote.
- `Reveal`, `WordReveal`, `CountUp`, `ScrollProgress` — see §4.

---

## 2. Section geometries

Each geometry = one reusable section component under `src/components/sections/` (suggested names in brackets). Content comes from props/data. "Bg" = allowed backgrounds: **W** white `#fff`, **D** deep green `#071813`, **I** full/framed image, **L** lime `#dbef75`, **G** grey `#eee` (only for inner cards, not section backgrounds).

Existing homepage mapping: Hero = **Page hero (fixed)** · ProductsSection = **A1 tile strip** · MissionSection = **F bento trio** · ServicesSection = **A2 photo card row** · DoubtsSection = **G pinned variant**.

### A. Horizontal card row  `[CardRow]`
- **Visual**: intro row, then 3–5 equal cards side by side across the content width. Two skins: **A1 tile strip** (Products: small 217k-high image tiles, Figtree label + pale-lime icon circle, no intro, sits as a strip right under a hero) and **A2 photo cards** (Services: tall 424×644 cards, photo + bottom glass panel with lime icon circle, Lexend title/body, numbered; optional lime progress bar under each card).
- **Bg**: A1 W only. A2 D (default) or W.
- **Motion**: staggered in-view rise (opacity + 24px translate, 180ms stagger), progress bars fill lime 250ms after their card. Hover: image lifts 4u (A1) / panel brightens.
- **Mobile**: A1 wraps (≤1100) then single column; A2 single column, max 440px wide, 32px gap.
- **Use**: products, process steps (4), "wat we berekenen" (4), service benefits.

### B. Sticky stacked cards  `[StackCards]` (pinned – counts toward max 2)
- **Visual**: left column (503u + gap) holds the intro row content and stays sticky; right side shows full-width-of-column cards (radius 22u, height ~70svh) that each `position: sticky; top: calc(110u + i * 18u)` so every next card slides over the previous one and the previous ones peek out above as 18u slivers (echoes the hero's ghost-card stack). Each card scales down to 0.94 and dims (overlay 30%) as the next covers it.
- **Bg**: section W with cards alternating D / G(#eee) / image; or section D with cards in `--c-green-card` + photo.
- **Motion**: scroll-linked scale/dim of covered cards (`animation-timeline: view()` with JS fallback); card content reveals once (Reveal).
- **Mobile**: no sticky; plain vertical list, 16px gap, cards `height:auto`.
- **Use**: pain points ("Je factuur stijgt…", "Je teller draait niet meer terug…", "Capaciteitstarief…"), myths → facts, 3–5 scenarios on comparison pages.

### C. Full-bleed image with glass panel  `[ImagePanel]`
- **Visual**: framed photo (same frame as hero: paper margin 12.5u, radius 22u, height 100svh or 900u) of a family/home; one glass panel (`--glass-photo-*`, radius 22u, ~588u wide, padding 39u) anchored bottom-left or bottom-right (alternate per use) with eyebrow, h3, body-lg, CTA. Optional single quote variant (big Helvetica quote, name + town in small).
- **Bg**: I. Image gets a bottom gradient `rgba(6,20,16,0)→0.55` behind the panel for contrast.
- **Motion**: frame clip-path wipe in from inset(8% round 22u) → inset(0); image settles scale 1.12 → 1 (1.8s); slow parallax ±6% inside the frame while in view; panel rises after 0.4s.
- **Mobile**: frame 8px margin, min-height 85svh, panel becomes full-width bottom block (16px inset).
- **Use**: emotional break, client story, "VB-TEC zegt ook nee" honesty moment, project teaser.

### D. Split sticky text + scrolling media  `[StickySplit]` (pinned – counts)
- **Visual**: two columns. Left (≈ 40%, starts at the 503u eyebrow column edge): sticky text block that changes per step — eyebrow `01 / 04`, h3, body, small FactNote; right (≈ 52%): a vertical stack of tall rounded media (photos, diagrams, mini-charts), 22u radius, 48u gap, each ~80svh. The active step = the media most in view; the left text cross-fades (words blur in like Mission).
- **Bg**: W or D.
- **Motion**: active-step swap (opacity/blur 0.5s), media clip wipe as each enters, thin progress dots on the left edge.
- **Mobile**: no sticky: each media item followed by its text (text first, then image).
- **Use**: "Hoe het werkt" chapters (zon → warmte → opslag → laden → sturing), service page "hoe past dit in je systeem", R&D story for PVT.

### E. Vertical timeline with progress line  `[Timeline]`
- **Visual**: centred or left-offset vertical hairline (2px, white 14% on D / ink 10% on W) with a lime (on D) or ink (on W) fill that grows with scroll (`scaleY` from top). Nodes = 22u circles that fill when the line reaches them. Each step: number (Figtree), Lexend 500 title, Lexend 300 body, duration chip ("± 1 week"), optional small photo card on the opposite side (alternating left/right on desktop).
- **Bg**: D (preferred) or W.
- **Motion**: line fill scroll-linked; steps Reveal (slide 30u from the line side); node pop with back-ease.
- **Mobile**: line on the left at 20px, all steps to its right.
- **Use**: /hoe-we-werken process (6 steps), regulation timeline (terugdraaiende teller 2021 → capaciteitstarief 2023 → … gasketel-trends), project "van gasketel naar 0 €" story.

### F. Bento grid  `[Bento]`
- **Visual**: Mission's trio grown into a 12-col grid: mix of one stat card (D, count-up number, goal pill), one photo card (image + glass icon circle + bottom text), one grey card (#eee, big text + tags), plus optional wide card (span 8) or tall card (row span 2). Max 5 tiles. Gap 25u, radius 22u, tile height 566u (or 270u half-height).
- **Bg**: W (tiles bring the D/grey/image contrast). Rarely D with tiles in `--c-green-card` and one lime tile.
- **Motion**: Mission entrance: eyebrow slides 30u, statement words blur in (40ms stagger), tiles clip-wipe up (inset 100% → 0, 1.1s, 150ms stagger), photo settles from scale 1.2, icon circles spin in, tags pop (90ms).
- **Mobile**: single column, tiles min-height 420px (photo 480px).
- **Use**: why VB-TEC (ingenieurs, eerlijk, klant eerst, R&D), project key results, company facts on /over-ons.

### G. Big statement with word reveal  `[Statement]`
- **Visual**: centred heading (`statement-xl`, max 980u), eyebrow above, generous whitespace (≥ 70svh section). Optional one supporting line below and up to 6 floating "doubt" pills (Doubts style: grey / D / lime pills with Georgia quote marks). The pinned scroll-scrubbed version is the existing DoubtsSection; the **default** version is not pinned: words reveal on view.
- **Bg**: W (default) or D; L allowed here (the one lime section of a page).
- **Motion**: words reveal one by one (opacity + 0.55em rise + 10px blur → 0; 40ms stagger) — on view, or scroll-scrubbed (`animation-timeline: view()` range `entry 20% cover 50%`) for a "reading along" effect. Key word(s) can get a lime-pale highlight swept in left→right (background-size 0→100%, 0.8s) on W, lime text on D.
- **Mobile**: `clamp(36px,10vw,56px)`, pills hidden or max 3.
- **Use**: myth headline ("'Een warmtepomp loont niet meer.' Echt?"), honesty statement, chapter openers.

### H. Data / chart band  `[DataBand]`
- **Visual**: D background. Intro row (eyebrow on-green-3, h2 white) then either (a) 3–4 big stats in a row separated by vertical hairlines (`stat` size, white; caption on-green-2; FactNote under each), or (b) one wide chart panel (radius 22u, bg `--c-green-card`, padding 39u): stacked/side-by-side bars or 20-year cumulative cost lines — series `--c-data-base` (gasketel / niets doen) vs `--c-data-good` lime (systeem). Legend as tags (Figtree). Below: assumptions toggle "Bekijk aannames" (accordion) listing inputs from `facts.ts` + date. Always a visible "Indicatief" pill top-right.
- **Bg**: D only (rule: proof/data lives on dark green).
- **Motion**: count-up (1.4s, ease-out cubic, 0.3s delay), bars grow from baseline (scaleY, 0.9s, 120ms stagger), line charts draw via `stroke-dashoffset` (1.4s ease-in-out). Static SVG/HTML, no chart library needed.
- **Mobile**: stats 2×2 grid (or stacked); chart becomes horizontally fitted (no overflow), labels 13px.
- **Use**: gas vs WP cost per year, battery payback, capaciteitstarief effect, injection vs self-consumption.

### I. Horizontal scroll rail  `[Rail]`
- **Visual**: intro row with prev/next round buttons (61u circles, white on D / ink ring on W) aligned right; below, a row of cards that bleeds off the right edge (starts at `--side`, ends at viewport edge). Card width ~520u, image top 60% + text below, or full-photo card with glass panel. Native `overflow-x: auto` + `scroll-snap-type: x mandatory`, hidden scrollbar, `scroll-padding-inline: var(--side)`. A thin progress bar (3px, lime on D / ink on W) shows rail position.
- **Bg**: W or D. (Scroll-jacked "vertical → horizontal" pinning is allowed only if it's one of the 2 pins and never ≤900px; default is native swipe/drag rail.)
- **Motion**: cards Reveal with 120ms stagger on first view; hover lifts image 4u; drag cursor on desktop (pointer events), keyboard arrows on focused rail.
- **Mobile**: same rail, cards 82vw, padding-inline 20px, snap start.
- **Use**: projects, blog/kennisbank teasers, related comparisons, team members.

### J. Review wall / marquee  `[ReviewWall]`
- **Visual**: two rows of review cards moving in opposite directions (marquee), cards radius 22u: `#eee` cards with ink text, every 4th card D with white text, one lime card max (score summary "4,9/5 · 120+ reviews" — PLACEHOLDER label visible). Card: Georgia quote mark (from Doubts), quote in body-lg Helvetica, name + gemeente + installed products as Figtree tags. Edges fade with a mask gradient. Alternative static variant: masonry wall (3 columns) with a "Toon meer" button.
- **Bg**: W (default) or D.
- **Motion**: CSS marquee 60s/row linear infinite, `animation-play-state: paused` on hover/focus-within and when off-screen; reduced motion → static masonry (no animation).
- **Mobile**: one row only, 30% slower; or static stacked list of 3 + "Meer reviews".
- **Use**: home, service pages, /projecten. Reviews are PLACEHOLDER: show a small "Voorbeeldreviews" note until real; never emit Review schema (see 01-sitemap).

### Fixed blocks (not part of the rotation, fixed position on pages)

- **Page hero** `[PageHero]` – first section of every non-home page. Two variants:
  - *Framed image hero* (services, projects, hoe-het-werkt, over-ons): same frame as homepage Hero, height 78svh (home stays 100svh), breadcrumb top-left under header in white small text, display H1 bottom-left, one-line lead, CTA hero pill, optional glass fact card bottom-right (like HighlightsSlider card: thumbnail + one key number). Header in dark mode.
  - *Typographic hero* (hubs, vergelijken, blog, kennisbank, team, contact, privacy): W background, breadcrumb, eyebrow + display H1 (max 1300u) left aligned at the 503u column, lead paragraph and "Kort antwoord" box (comparisons/kennisbank: grey `#eee` card, radius 22u, padding 39u, label "Kort antwoord" in Lexend 500) — header in light mode.
- **FAQ** `[Faq]` – W. Intro row (eyebrow "Veelgestelde vragen", h2). Right column (aligned at 503u column) list of accordion rows: hairline separators, question Lexend 500 `card-title` size, `+` in a 46u circle (`#eee`) rotating to `×` (45°), answer body Helvetica, open with grid-rows 0fr→1fr 0.4s. Use `<details>/<summary>` (content in DOM for AEO). Counts as W for rotation.
- **Lead section** `[LeadSection]` id `berekening` – always last before footer. Framed image (family at home / house exterior at dusk) with the form card (white, radius 22u, `--shadow-lift`, padding 48u, width 760u) on the right and a short promise left in white (display-ish h2 – *[Overseer]* **copy comes from 03 §6.2** (default heading "Wat kan jouw woning besparen? We rekenen het voor je uit.", 4 checkmarks) or the page-specific heading from 05. Background = framed image with deep-green overlay (05 §0.3-1). Bookends the hero. Counts as I.
- **Article body** `[Prose]` – long-form reading layout (blog/kennisbank): W, 68ch column offset to the 503u line, sticky table of contents in the eyebrow column (desktop), author card (team) + "Laatst bijgewerkt" at top, FactNotes inline as numbered footnotes.

---

## 3. Rotation rules

### 3.1 Background rotation
1. **Never the same background twice in a row.** Exceptions: (1a) a *strip* (A1 tile strip, breadcrumb bar, logo/label strip ≤ 40svh without its own heading) belongs to the section above it; (1b) Article body + FAQ may both be W if separated by a 1px hairline and 142u space.
2. **Never the same geometry twice in a row**, and the same geometry at most twice per page.
3. **Lime (L) as a section background at most once per page**, and only for G (statement) or a compact CTA/stat band; never for long text. Lime as accent (CTA pills, icon circles, progress fills, highlight sweeps) is fine everywhere.
4. **Proof and data live on D**: geometry H always D; stat-heavy F tiles and review score use D tiles. Emotional/client stories live on I; explanations on W.
5. Image sections (I) never back-to-back, and at most 3 per page (incl. page hero and lead section).
6. Rhythm: alternate *dense* (cards/grids/data) and *airy* (statement/image) sections; after two dense sections, insert an airy one.
7. Transitions between W and D may use the existing **slide-over** (`StickToBottom` + next section `z-index:1`) — max one per page, counts as a pin, desktop only. Otherwise sections meet edge to edge (no gaps, curves or diagonal dividers). W and D sections run full-bleed; only I sections use the paper frame (12.5u margin, 22u radius).
8. Every page ends: … → FAQ (W) → Lead (I) → Footer (ink). So the section before the FAQ must not be W (if a page has no FAQ, the section before Lead must not be I).
9. The page's first section counts in the rotation (framed hero = I, typographic hero = W).

### 3.2 Page recipes (valid starting points for builders)

*[Overseer]* **Superseded by 05-pages.md** for every page that 05 specifies (all of them). Keep this table only as rotation examples; builders build the 05 sequences.

Notation: `Geometry·Bg`. (p) = pinned. All rows satisfy rules 1–9; when changing a recipe, re-check them.

| Page | Sequence |
|---|---|
| Home | Hero·I → Products A1·W(strip) → Mission F·W → Services A2·D (slide-over, p1) → Myth statement G·W → Data H·D (gas vs warmtepomp vs systeem) → "Hoe het samenwerkt" D·W (p2, links /hoe-het-werkt) → Client story C·I → Projects rail I·W → Reviews J·D → FAQ·W → Lead·I |
| Service page | PageHero·I → Pain points B·W (p1) → Payback/cost H·D → "Hoe past dit in je systeem" D·W (p2) → "Wat wij berekenen" A2·D → Projects rail I·W → Reviews J·D → FAQ·W → Lead·I |
| Comparison | Typographic hero + Kort antwoord·W → Table + 20-jaar chart H·D → Scenarios B·W (p1) → "Wanneer NIET" C·I → Statement G·W *or* DoubtsSection (p2) → Related rail I·D → FAQ·W → Lead·I |
| Hoe het werkt | PageHero·I → Interactive house diagram (custom block)·W → Chapters D·D (p1) → Statement G·L (the page's one lime) → Data H·D → FAQ·W → Lead·I |
| Hoe we werken | Typographic hero·W → Timeline E·D → Promise bento F·W → Team rail I·D → FAQ·W → Lead·I |
| Over ons | PageHero·I → Honesty statement G·W → Story timeline E·D → Values bento F·W → Team rail I·D → Client story C·I → FAQ·W → Lead·I |
| Project | PageHero (family + glass fact card)·I → Situation Prose·W → Results voor/na H·D → Client quote C·I → Gallery rail I·W → Other projects A2·D → Lead·I |
| Blog / kennisbank article | Typographic hero·W → Prose·W (exception 3.1-1b, hairline) → Related rail I·D → FAQ·W → Lead·I |
| Hubs (diensten, vergelijken, projecten, blog, kennisbank, team) | Typographic hero + main grid as one W section → G·L *or* H·D → (if G·L: rail I·D) → FAQ·W → Lead·I |
| Contact | Typographic hero·W with the form as main content (no LeadSection) → details/map band F·D → FAQ·W |
| 404 / privacy | Typographic hero·W → (privacy: Prose·W) → compact CTA band G·D |

---

## 4. Motion vocabulary

### 4.1 Tokens
```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);     /* default for movement */
  --ease-wipe: cubic-bezier(0.76, 0, 0.24, 1);    /* clip-path wipes */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);   /* bars, progress fills */
  --ease-back: cubic-bezier(0.34, 1.56, 0.64, 1); /* pops: icons, tags, nodes */
  --dur-hover: 0.2s;   --dur-pop: 0.4s;   --dur-reveal: 0.8s;
  --dur-wipe: 1.1s;    --dur-settle: 1.8s; --dur-count: 1.4s;
}
```
Staggers: words 40ms · cards 150–180ms · tags/chips 90ms · menu items 40ms · rail cards 120ms. Total entrance of one section ≤ 2.2s.

### 4.2 Vocabulary

| Name | What | Spec |
|---|---|---|
| **In-view reveal** | Element rises & fades in once | opacity 0→1 (0.8s ease) + translateY(24px→0) (0.8s `--ease-out`). Trigger: IntersectionObserver threshold 0.25 (rootMargin `0px 0px -10% 0px`), unobserve after first hit. |
| **Word reveal** | Heading appears word by word | each word `inline-block`, from opacity 0, translateY(0.55em), blur(10px); 0.6s/0.8s/0.7s; delay `0.15s + i*40ms`. Words wrapped server-side (no client JS needed except the trigger). Screen readers: put the full text in `aria-label` on the heading or keep words in natural order (they are). |
| **Count-up** | Number counts to its value | from 0, 1.4s, ease-out cubic, delay 0.3–0.9s; formatted with `nl-BE` (`€ 1.250`, `3,8`). SSR renders the **final** value (SEO + no-JS); JS resets to 0 only when the element is below the fold at mount. |
| **Clip-path wipe** | Card/image uncovers bottom→top | `clip-path: inset(100% 0 0 0 round 22u)` → `inset(0 round 22u)` + translateY(70u→0), 1.1s `--ease-wipe`; image inside settles scale 1.2→1 over 1.8s. |
| **Sticky progress** | Line/bar fills with scroll | `transform: scaleX/scaleY(progress)` driven by `animation-timeline: view()`/`scroll()` in `@supports`, else rAF reading `getBoundingClientRect` (passive scroll listener, one rAF per frame). |
| **Parallax** | Image drifts inside its frame | translateY ±6% (max 8%) of the image only, never text; image is 112% tall so no edges show. Scroll-linked. |
| **Highlight sweep** | Key words get a marker | `background: linear-gradient(var(--c-lime-pale),var(--c-lime-pale)) no-repeat 0 85% / 0% 40%` → `100% 40%`, 0.8s `--ease-inout`, after the word reveal. |
| **Pop** | Icons, tags, nodes | scale(0.6 or 0) → 1 with `--ease-back` 0.6–0.7s; icons also rotate −120°→0. |
| **Slide-over** | Next section covers a held one | `StickToBottom` (existing). |
| **Hover** | CTA arrow circle rotate 45°, image lift −4u, card bg tint; all 0.2–0.4s; only under `@media (hover: hover)`. |

### 4.3 Implementation rules
- **One shared trigger**: `src/components/motion/Reveal.tsx` (client) sets `data-ready` on mount and `data-visible` on its children/itself when in view (generalised `StepsReveal`). CSS hides content **only under `[data-ready]:not([data-visible])`** so that without JS (and for crawlers) everything is visible. Hidden states have no transition; visible states carry the transition (pattern from Mission).
- **Mission fix**: replace the `[data-hold-fade]` selectors in `Mission.module.css` with `[data-reveal][data-ready]:not([data-visible])` / `[data-reveal][data-visible]`, wrap MissionSection's content in `<Reveal>`; `CountUp` should look for `closest('[data-reveal]')` (or own IO) instead of `[data-hold-fade]`. HoldAndFade stays only for the Doubts→next section combo.
- Animate only `transform`, `opacity`, `filter` (small blur), `clip-path`. Never animate layout (height/top/width) except the FAQ `grid-template-rows` trick.
- Scroll-linked effects: prefer CSS scroll-driven animations inside `@supports (animation-timeline: view())`; JS fallback with a single rAF per frame and passive listeners. No scroll-jacking libraries; no smooth-scroll hijack.
- **Pinned sections: max 2 per page** (B, D, scroll-jacked I, the Doubts section and a slide-over each count). Pin length ≤ 300svh each (DoubtsSection at 420svh is the only exception and counts as both pins if used).
- **No pinning at ≤ 900px** (`position: sticky` stacks become plain flow; slide-over off). Also no pinning when viewport height < 600px.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no reveal transitions (content visible immediately; at most a 0.2s opacity fade), no word reveal, count-up shows final value, no parallax, no pinning (sticky → static, tall sections `height:auto`), marquee becomes static masonry, hero slider stops auto-advance (keep manual bars), videos don't autoplay (poster image). Hover arrow rotation may stay.
- Don't start more than one big entrance at once: if two sections are in view on load, the lower one waits for its own trigger.
- No `Math.random()`/`Date.now()` in render; jitter via deterministic functions (see `pileJitter`).

---

## 5. Header, mobile menu, footer, forms

### 5.1 Header `[site/Header]`
Geometry copied from the Hero header (logo left 94u, centred glass pill nav 57u high, CTA pill + arrow right 90u). `position: fixed; inset: 0 0 auto; height: 122u` (72px mobile), `z-index: 50`. On home the Hero's inline header is replaced by this header, positioned so it lands exactly where the inline one was (account for hero frame padding 10u/12.5u).

States (data attributes on `<header>`):
- `data-tone="dark"` – over hero/framed image/D: transparent bar, white logo, nav pill = `--glass-dark-*`, active item white pill with ink text, contact pill white.
- `data-tone="light"` – over W: transparent bar, ink logo, nav pill `--glass-light-*` with ink links, active item ink pill with white text, contact pill ink with white text (arrow circle ink).
- `data-scrolled` (scrollY > 24px): bar gets a backing — after leaving the first section the logo + CTA also sit on glass: whole header becomes a floating rounded bar (inset 12u, radius 999px, glass of current tone, height 76u) — compact, premium, not a full-width white strip.
- `data-hidden` – hides (translateY(−110%), 0.4s `--ease-out`) when scrolling down > 120px past the hero; reappears on any scroll up of ≥ 8px. Never hidden while a menu is open or focus is inside.
- Tone detection: each section sets `data-header-tone="dark|light"`; one IntersectionObserver with `rootMargin: "0px 0px -95% 0px"` (a line at the top) picks the tone of the section under the header. Tone change crossfades colors 0.3s.
- Mega panel (Diensten/Vergelijken/Kennis/Over ons): opens on hover-intent (150ms) and click/Enter; drops 12u below the nav pill, width 1100u, radius 22u, `--glass-light-*` but 92% opaque + `--shadow-lift`, 3 columns (Figtree labels + one-line Helvetica descriptions in grey-600) + feature tile (photo card with glass panel "Alles samen? Hoe het werkt"). Opens with opacity + translateY(−8u) 0.25s. Esc closes, focus returns to trigger.
- Skip link "Naar inhoud" as first focusable element.

### 5.2 Mobile menu (≤ 900px)
- Bar: logo (26px) · compact CTA "Berekening" (46px pill) · burger: 46px circle, glass of current tone, two 18px lines that morph into × (0.3s).
- Overlay: full-screen `--c-green`, white text; opens with clip-path circle from the burger position (0.6s `--ease-wipe`; reduced motion: fade). Items Helvetica 400 32px, line-height 1.15, separated by `rgba(255,255,255,.12)` hairlines, staggered reveal 40ms. Accordions: chevron/plus in 40px ring circle rotating 45°; sub-items 18px on-green-2 with Figtree labels for service names. Active page: lime dot before label.
- Bottom (sticky inside overlay): full-width lime CTA pill (56px) "Gratis berekening" + row with tel/e-mail as ring pills. Body scroll lock, focus trap, Esc & route change close.

### 5.3 Footer `[site/Footer]`
- Background `--c-ink-deep` (#030f09), white text, side margins `--side`, top padding 142u.
- Top band: promise "Ingenieurs die rekenen, geen verkopers die duwen." at `h2` size left (max 1140u) + lime CTA pill right.
- Columns (5, from 01-sitemap §3) with column titles in on-green-3 `eyebrow` style, links Helvetica `body` white, hover: lime underline sweep. Contact column uses Lexend 300 for data rows.
- Trust row: text-only quality labels as ring tags (PLACEHOLDER) + review badge (PLACEHOLDER).
- **Wordmark**: giant "VB-TEC" Helvetica 700 spanning the content width (≈ 23vw, letter-spacing −0.04em, line-height 0.8), color `rgba(255,255,255,0.06)` with a lime-clip reveal (background-clip:text gradient sweeps once on view) – bottom edge sits flush with the page bottom, cropped by ~10%.
- Bottom bar: small text on-green-3: © 2026 VB-TEC · Privacy · Sitemap · disclaimer "Alle cijfers zijn indicatief; je persoonlijke berekening is bindend." Static year.
- Mobile: columns become accordions except Contact; wordmark 24vw.

### 5.4 Forms (lead form & contact form)
- Container: white card, radius 22u (20px), padding 48u (24px), `--shadow-lift` when over an image; on W pages inside a grey `#eee` card without shadow.
- Fields: Lexend 300 input text `max(16px, 19u)` (≥16px always → no iOS zoom); label above in Lexend 500 15px ink; helper text 14px grey-600.
  - Single-line input: height 64u (56px), radius 999px, padding 0 28u, background `#eee`, no border; hover background `#e6e8e5`; focus background white + `box-shadow: 0 0 0 2px var(--c-ink)` (+ outer 6px lime-pale glow).
  - Textarea: radius 22u, min-height 140px.
  - Select: same pill, custom chevron.
  - Choice chips (interesse, woningtype, verwarming nu): toggle pills 48px tall, `#eee` → selected `--c-green` with white text + lime check icon; real checkboxes/radios visually hidden but focusable (focus ring around chip).
  - Grid: 2 columns desktop (naam | e-mail; telefoon | postcode), 1 column ≤ 600px; gap 16px.
- Validation: server action returns field errors; show under field in `--c-error` 14px with icon, field gets `aria-invalid` + `aria-describedby`, 2px error ring. Error summary at top (role="alert") on submit failure, focus moves to it.
- Submit: lime `CtaPill` full-width on mobile, Lexend 500 "Vraag mijn gratis berekening aan". Pending (`useActionState` pending): label "Even geduld…", arrow circle spins (1s linear) — reduced motion: no spin; button disabled + `aria-busy`.
- Success state replaces the form in place (same card height, crossfade 0.4s): 79u lime icon circle with check (pop), h3 per 03 §6.7 ("Bedankt, {voornaam}! Je aanvraag is goed aangekomen.") *[Overseer]*, 3 numbered next steps in Lexend 300, small note on response time (PLACEHOLDER). Focus moves to the success heading.
- Privacy line under the button: small grey-600 text + link to /privacy. No pre-checked marketing consent.
- On D backgrounds (if ever): inputs `rgba(255,255,255,.08)` with ring-on-dark, focus ring lime, errors `--c-error-on-dark`.

---

## 6. Mobile & responsive rules

- **Breakpoints**: `900px` (main switch: u → px, stacks, no pinning), `1100px` (tile strips wrap), `600px` (single column grids, form 1 col), `420px` (hide secondary header pill). Short desktops: `(min-width: 901px) and (max-height: 820px)` tighten vertical spacing.
- **px fallback below 900px**: every module that uses `--u` writes an explicit `@media (max-width: 900px)` block with px values from §1.4/§1.5 (pattern from Mission/Services). Use `height: auto; min-height: …` instead of fixed heights; `100svh` only as `min-height`.
- **Touch targets ≥ 44×44px** (nav buttons, rail arrows, accordions, chips, slider bars — give the hero bars a 44px tall hit area with the 4px visual line inside, footer links with 12px vertical padding).
- **No horizontal overflow**: `html, body { overflow-x: clip; }` as safety net, but fix causes: decorative elements wider than the viewport go inside `overflow: clip` wrappers; rails scroll inside their own container; long Dutch words (`thuisbatterijinstallatie`, `capaciteitstarief`) get `overflow-wrap: anywhere; hyphens: auto` (`lang="nl-BE"` enables hyphenation) in headings ≤ 900px; tables scroll inside a wrapper with a visible fade edge or reflow to cards. Test at 360px and 390px.
- Hover-only effects inside `@media (hover: hover)`; nothing essential hidden behind hover (mega menu items also reachable by tap).
- Mobile sequence keeps the same background rotation; pinned geometries turn into flowing stacks automatically, so check that two stacked lists of cards don't end up looking identical back to back.
- Images: `sizes` honest per layout (`(max-width: 900px) 100vw, 30vw` etc.), `preload` only the first hero image, quality 75 default / 90 for hero & large photos.
- Safe areas: header/menu use `env(safe-area-inset-*)` padding.

---

## 7. Imagery & content details

- **Client-centred imagery**: families at the kitchen table, kids in a warm living room, a Flemish brick terraced house / fermette / '70s villa with panels on the roof, a hand holding an energy bill or the digital meter app, an EV charging in a driveway at dusk. Installers/engineers appear only as helpers *with* the client (explaining at the table, on site with the homeowner) — max 1 in 4 images. Existing stock (`step-*`, `vision-team`, `hero-solar`) can stay as placeholders; new image slots should be named by subject (`/images/gezin-keuken.jpg`) and listed in a `src/content/images.ts` map with alt text in Dutch.
- Photos: natural light, warm but not orange, slightly desaturated greens to sit with `#071813`. No third-party brand logos on equipment. *[Overseer]* Generated placeholder photos per 07 are allowed (families/homes, natural style); they are never captioned as a real customer or as a named team member, and team portraits stay silhouettes until real.
- **Icons**: existing line style (1.75–2px stroke, rounded caps) inside circles; one icon per card max.
- **Numbers**: always from `facts.ts`, Belgian formatting (`€ 1.250`, `3,8 kWh`, `22%`), followed by FactNote. "€0" phrasing: "tot ~€ 0 per jaar*" with the asterisk visibly resolved near the number.
- Tone in UI microcopy: jij-vorm, short, honest ("We rekenen het eerst uit. Is er geen winst, dan zeggen we dat.").

## Open issues
- Real photography (families/homes) needed; current images are generic solar stock.
- Helvetica is not present on Windows/Android (falls back to Arial) – accepted, matches existing homepage.
- `#687975` labels in Mission are below AA for small text; keep (≥20u) but don't reuse.

## Notes from other agents
