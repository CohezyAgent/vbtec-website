# 99 – Sign-off (final review)

Owner: **Overseer**. Run 2026-11-01. Other agents append only under `## Notes from <agent>`.

## 1. Checks

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run build` (Next 16.4.1, Turbopack, cacheComponents + partialPrefetching) | passes. 57/57 static pages generated, every route prerendered (○ static or ◐ partial prerender), `ƒ Proxy` |
| All 46 `/sitemap.xml` URLs on dev | 46 × 200 |
| Unknown slugs (`/diensten/x`, `/blog/x`, `/projecten/x/y`…) on `next start` | **404** (was a soft 200, see §4). `/onbestaand` 404 |
| Grep `src` for Enerza / lorem / TODO / FIXME | 0 hits |
| English UI strings | none left. "Home" (breadcrumb label) and "Menu" are kept on purpose because both are normal in Flemish UI |
| Browser spot check (Chrome): `/`, `/hoe-het-werkt`, `/diensten/lucht-water-warmtepomp`, `/vergelijken/gasketel-vs-warmtepomp`, `/contact` at 390px and 1440px | 1 H1 each, `lang="nl-BE"`, lead form present, 0 elements running past the viewport, no console errors, no "undefined"/"NaN" in the text. Desktop screenshots of the home hero and the service hero look right |

## 2. Fixes in this pass
- **06 request from Builder 2 (LeadForm chip):** a selected "Ik weet het nog niet – adviseer me" chip had white text on a transparent background, because `.chipAdvies` overrode `.chipOn`. The same problem hit every selected chip inside `.cardFlat`, because `.cardFlat .chip` set a white background. New rule `.chip.chipOn` / `.cardFlat .chip.chipOn` in `src/components/lead/Lead.module.css`.
- **Soft 404:** new `src/proxy.ts`. It builds an allow-list of slugs for diensten, vergelijken, kennisbank, blog and projecten from `content/registry.ts` (which has no imports). An unknown slug is rewritten to a path that matches no route, so the response is a real 404 with `not-found.tsx`. Known slugs are untouched and stay prerendered.

## 3. Route list (46 indexable + 404)
- `/`, `/hoe-het-werkt` (pillar + interactive HouseDiagram), `/diensten`, `/vergelijken`, `/projecten`, `/blog`, `/kennisbank`, `/over-ons`, `/hoe-we-werken`, `/team`, `/contact`, `/privacy`
- `/diensten/` zonnepanelen · pvt-panelen · omvormers · lucht-water-warmtepomp · lucht-lucht-warmtepomp · thuisbatterij · laadpalen
- `/vergelijken/` gasketel-vs-warmtepomp · met-of-zonder-thuisbatterij · met-of-zonder-zonnepanelen · warmtepomp-vs-airco · zonnepanelen-vs-pvt-panelen · vast-vs-dynamisch-energiecontract
- `/kennisbank/` 9 articles (capaciteitstarief, injectietarief/zelfverbruik, dynamisch tarief, SCOP/COP, geschiktheid warmtepomp, PVT-paneel, thuisbatterij-grootte, Mijn VerbouwPremie, EPC/renovatieverplichting)
- `/blog/` 6 posts (loont warmtepomp 2026, einde terugdraaiende teller, capaciteitstarief verlagen, gasketelverbod, waarom wij soms nee zeggen, dynamisch contract)
- `/projecten/` 6 example projects (Gent, Leuven, Antwerpen, Brugge, Hasselt, Kortrijk – the last one advised *against* a battery)
- Technical: `/sitemap.xml`, `/robots.txt` (AI crawlers allowed), `/llms.txt`, `/opengraph-image`, `not-found`, Server Action `app/actions/lead.ts`, `src/proxy.ts`

## 4. Client brief – requirement status

| Requirement | Status |
|---|---|
| Brand VB-TEC, no Enerza | ✔ |
| All copy in Dutch (Flemish), `lang="nl-BE"`, Dutch slugs | ✔ |
| All products (lucht-water, lucht-lucht/airco, zon, PVT incl. R&D, batterij, laadpaal, omvormer) | ✔ 7 service pages + hub |
| USP: engineers, combined optimum, no pushing, honest "no win" | ✔ hero, Mission, /hoe-we-werken, Kortrijk "geen batterij" project, BatterySizer "geen batterij" outcomes, blog "waarom wij soms nee zeggen" |
| Debunk "it no longer pays off" with Flemish facts | ✔ 6 comparison pages, pillar, kennisbank, blog. Capaciteitstarief, end of the terugdraaiende teller, injectie, gas vs. elektriciteit, SCOP/COP, Mijn VerbouwPremie, EPC/renovatieverplichting, gasketel trend and dynamic tariffs are all covered |
| Every number in `src/content/facts.ts` with source + date, shown as indicatief | ✔ (FactNote/"Gebruikte cijfers"). Some assumption facts still have no external source (see §5) |
| "tot ~€0" phrased honestly, with assumptions | ✔ hero asterisk → footnote, Statement/assumption accordions |
| Lead form at the end of every page: Server Action, validation, success state, logs only, single swap point | ✔ `LeadSection` on all pages (form as hero on /contact; CtaBand on /privacy and 404). Swap point is `src/lib/lead.ts` |
| Trust and conversion: reviews, proof, projects, urgency, pain points | ✔ ReviewWall, project rails, pain cards, sticky mobile CTA, header CTA. Reviews and projects carry "Voorbeeld…" badges |
| SEO + AEO: long-form text, FAQ, schema | ✔ see `qa-seo.md`. Every route meets its word minimum, FAQPage JSON-LD matches the visible text, and each template has its schema type. No Review/Person schema for placeholder data |
| Design: high-end, varied geometry and backgrounds, scroll and in-view effects, existing homepage sections kept | ✔ see `qa-uiux.md`. Hero/Products/Mission/Services kept. Mission entrance now runs on in-view `Reveal`. DoubtsSection is kept but not used |
| Mobile | ✔ see `qa-mobile.md` (390/360/1024, menu, sticky CTA, touch targets) |
| Client-centred imagery | ✔ 14 generated photos in `public/images/gen/`. Home Mission and Services step cards still use installer stock (kept on purpose) |
| Next 16 rules (async params in Suspense, generateStaticParams, metadataBase, JSON-LD escaping, `preload`, useActionState, static year) | ✔ |

## 5. Known gaps
- Generated photos: on `/over-ons` and the Kortrijk project the headline sits over a face. This needs a recrop, or goes away with real photos.
- Not tested on a real iOS Safari or a notched device. Reduced motion was checked in code only.
- Analytics events are no-ops (`trackLeadEvent`). DoubtsSection, the 20-year consumption slider and per-template OG images were cut from v1 scope (00 §7).
- Some hub titles (66–69 chars) and two metas (162 chars) are slightly long. They follow the approved spec.
- Missing facts that would sharpen the copy: gas boiler price, airco price, battery lifetime, PVT yield/price, charge point price. The assumption facts (zelfverbruik, airco SCOP, lifetimes, EV consumption) need a source, and `terugdraaiendeTellerEinde` needs checking. `facts.ts` should be recalculated every quarter because gas prices move.
- Keyword volumes have not been checked (check with GSC/DataForSEO after launch).
- `reviews.ts` names the Hasselt couple "Lotte & Bram", the same first names as two placeholder team members. Rename one when real data arrives.
- Open client questions: work area (Vlaanderen only, or Brussel too?), certifications (RESCert), lead time.

## 6. PLACEHOLDER content the client must replace

| File | What |
|---|---|
| `src/lib/routes.ts` (`SITE_URL`), used by `app/layout.tsx` metadataBase, canonicals, OG, sitemap, robots, `public/llms.txt` | Real domain (now `https://www.vb-tec.be`) |
| `src/content/site.ts` | Legal name, phone, e-mail, address, BTW-nr, opening hours, response time, % "afgeraden" (38), number of calculations (1200), guarantees, "geen voorschot vóór akkoord", trust labels/certifications, founding year. Set `isPlaceholder: false` once confirmed (this turns on NAP in the LocalBusiness schema) |
| `src/content/team.ts` | 7 example team members (names, roles, bios, photos). `isPlaceholder` shows the "Voorbeeldteam" badge |
| `src/content/reviews.ts` | All reviews and the summary score. These need a real source and permission. Only after that may Review/AggregateRating schema be emitted |
| `src/content/projects.ts` | 6 example projects (families, cities, numbers, quotes, photos) → replace with real projects and measured figures |
| `src/content/blog.ts`, `src/content/kennisbank.ts` | Authors (they link to the placeholder team), dates. Have an engineer review the content |
| `src/content/services.ts` | Guarantee terms, PVT R&D timeline steps and dates, certification wording (RESCert "voorbeeldtekst"), project stories |
| `src/content/company-pages.ts` | Over-ons story/timeline, hoe-we-werken lead times, team intro, contact copy (pulls NAP from site.ts) |
| `src/content/comparisons.ts` | Example reviews/quotes shown on comparison pages |
| `src/content/faqs.ts` | Work area, response time, terms in the generic FAQs |
| `src/content/images.ts` + `public/images/gen/*` | 14 AI-generated photos. Replace them with real customer photography (with consent). Never present them as real customers |
| `src/content/facts.ts` | Check every value, source and date, especially the assumptions without an external source |
| `src/app/privacy/page.tsx` | Placeholder privacy and cookie text. Needs legal review before publication |
| `src/lib/lead.ts` | `submitLead` only logs. Connect a CRM, e-mail or webhook here (the only place that needs to change) |
| `src/app/contact/_components/ContactDetails.tsx` | Stylised map of the work area. Check it against the real area |

## Notes from other agents
