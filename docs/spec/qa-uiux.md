# QA – UI/UX (desktop review)

Owner: UI/UX agent. Other agents append only under "## Notes from <agent>".

## How I tested
- All 46 sitemap routes plus the 404 page, in Chrome. I used a real 1492×710 viewport and a same-origin iframe at 1440×900, and scrolled each page fully so the in-view content rendered.
- A script crawled every internal link, `#anchor` target and `<img>`/`srcset`. All returned 200 and every anchor exists. All 27 external source links return 200 (the only miss is the placeholder `https://www.vb-tec.be` domain).
- A text scan (scripts stripped) found no "Enerza", lorem, English UI words, `undefined`/`NaN`, or stray spaces before punctuation. Every page has exactly one H1 and every image has `alt`.
- Overflow check: on all 46 routes at 1440, no element runs past the viewport and no text box is clipped.
- Header tone check on all 46 routes: the header now matches the section under it. Pill contrast check on all 46 routes: no CTA label is the same colour as its pill.
- Lead form on `/`:
  - Submitting step 1 empty gives a summary with links to the fields, and each chip group is marked.
  - Step 2 empty: summary plus inline errors.
  - A bad email (`test@voorbeeld`) is caught both on blur and on submit.
  - Valid test data shows the success state (the lead is only logged locally).
  - The honeypot and server-side `validateLead` are in place.
- No console errors or hydration warnings.

## Found → fixed
| Issue | Fix |
|---|---|
| 14 generated photos in `public/images/gen/` were not wired (the registry still pointed to stock) | `src/content/images.ts`: every 07 key now uses its `/images/gen/*.jpg` file with real width/height. `alt` is set to the intended text and `altFinal` is dropped. |
| `/diensten` hub showed cropped product tiles for 5 services and photos for 2 | `services.ts` `hubImage` now uses the client-centred photo for all 7 |
| White text on the real photos was hard to read (StackCards photo card, Mission photo tile, ImagePanel glass, CardRow photo panels, PageHero/Hero headline) | Darker overlays: left and bottom gradients on the heroes and the stack card, a bottom gradient on the Mission tile, tinted glass `rgba(6,20,16,.42–.5)` on the ImagePanel and CardRow panels |
| StatRow numbers overflowed and collided at 1440 (`€ 300–900ca. 6% vs 21%` on home; `€ 51,99–60,53` wrapped after "€" on `/hoe-het-werkt`) | `charts.tsx`: each row gets one `--stat-scale` based on its longest value and column count, so the row keeps one rhythm |
| "ca. ca." in many places (home FAQ, `/hoe-het-werkt`), plus "ongeveer ca." and "rond ca." | Copy no longer writes "ca." before `v()`, because `v()` already adds it for estimates (`home.ts`, `hoe-het-werkt.ts`, `comparisons.ts`) |
| Article inline CTA ("Gratis berekening") had dark text on a dark pill in every blog and kennisbank article | `Prose.module.css`: the prose link style now skips `aside` (the CTA card) |
| On dynamic routes (`/vergelijken/*`, `/blog/*`, `/projecten/*`…) the header stayed in dark tone over a white hero, so the logo was invisible. Light pages also flashed white before hydration. | `SiteChrome`: a ResizeObserver re-checks the tone when streamed content arrives. `Header.module.css`: before hydration, a `:has()` rule takes the tone from the first `<main>` section. |
| Lead form: after "Volgende stap" the step 2 heading was above the fold (`block:"nearest"` on a form taller than the viewport) | Scrolls so the top of the form sits under the header (instant under reduced motion) |
| Multi-paragraph Statement copy was centred (`/hoe-het-werkt` "Waar komt de winst vandaan?") | Left-aligned at 700u when there is more than one paragraph |
| Orphan words in H2s (e.g. "…vóór en / na.") | Global `:where(h1–h4){text-wrap:balance}` and `:where(p,li,blockquote){text-wrap:pretty}`, zero specificity |
| Mission photo tile text unreadable on the new photo | `.visionCard::after` gradient; text at z-index 1 |

## Checked, OK
- Section rotation alternates W/D/L/image on every template, and the geometries vary (stack, bento, slide-over, data band, image panel, house diagram, rail, wall, lime band, FAQ, lead).
- CTA wording follows 03 §2.1. One lime pill per viewport. The header CTA scrolls to the form and focuses the form heading.
- Reduced motion: every animated module has a `prefers-reduced-motion` branch (spot-checked in code).
- Project filters show a count and "Wis filters" and filter correctly.

## Open / minor (not changed)
- `/over-ons` and the Kortrijk project hero: the headline sits over a face in the generated photo. That will be fixed by a recrop or by the real photo.
- Home: the "Ingenieurs, geen verkopers" Mission photo and the Services stock step cards (helmets, solar farm) are still installer-centred stock. This is kept on purpose per 07 ("existing stock stays for ServicesSection").
- Reduced motion was not emulated in the browser (the tool has no media emulation). It was verified in code only.
- Window resizing was locked at 1492×710 in this Chrome. The 1440×900 checks ran in an iframe.
