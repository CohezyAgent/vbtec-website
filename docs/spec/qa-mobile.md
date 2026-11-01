# QA – Mobile responsiveness

Owner: Mobile responsiveness agent. Other agents append only under "## Notes from <agent>".

## Method
- I tested all 32 routes (12 top-level pages, 7 diensten, 6 vergelijken, 2 kennisbank, 2 projecten, 2 blog, 404) in same-origin iframes at **390px, 360px and 1024px** wide (800px tall), with the page scrolled through so in-view content rendered.
- `html/body { overflow-x: clip }` hides `scrollWidth` overflow, so the check also flagged every element whose box went past the viewport and that had no clipping ancestor.
- I also recorded `position: sticky` elements at mobile width, interactive elements smaller than 40px, and text smaller than 12px.
- Visual checks: home hero, mobile menu (open, accordion, Esc close, scroll lock released), sticky mobile CTA, /contact form at 360px (form shown first, inputs 19px so iOS does not zoom, buttons ≥44px).

## Found → fixed
| Issue | Where | Fix |
|---|---|---|
| Grid columns sized to their widest content (`1fr` or implicit `auto` with nowrap content inside), so pages became 700–1150px wide | `content/Hub.module.css .stack` (/projecten, /blog), `KennisbankBrowser .root/.tools/.category`, `ProjectFilterGrid .root/.bar/.groups`, `Prose .grid` (blog/kennisbank TOC), `HouseDiagram .teaser/.fullGrid/.side` | `grid-template-columns: minmax(0, 1fr)` |
| Filter chip rail grew wider than the page | `ProjectFilterGrid .chips` | `align-self: stretch` so it scrolls inside its own box; chips 44px tall |
| Bar chart value labels kept on one line pushed out of the panel (omvormers, laadpalen) | `ui/Charts.module.css .bars/.barRow/.barValue` | minmax column; value may wrap at ≤700px (15px) |
| Screen-reader data table (sr-only) was 900–1000px wide | `ui/charts.tsx` line chart | table wrapped in a div that carries the sr-only class (a table ignores `width: 1px`) |
| Stat numbers overflowed their columns at 1024 and 360 | `Charts .stats/.statNumber` | `grid-auto-columns: minmax(0,1fr)`; wraps at ≤1200px; `clamp(36px, 11vw, 64px)` at ≤420px |
| Diagram effect values overflowed at 360 | `HouseDiagram .effectValue` | may wrap at ≤900px |
| Home Mission/Services slide-over stayed pinned on mobile (inline `position: sticky`) | `layout/StickToBottom.tsx` | new `StickToBottom.module.css`: sticky only at `min-width: 901px`, `min-height: 600px` and no reduced motion |
| Touch targets under 44px | Footer links (23–30px), breadcrumbs (32px), `Tag` chip links (30px), mobile TOC links (34px), diagram `altSummary` (28px) | Footer: 12px vertical padding at ≤900px. Breadcrumbs: `min-height: 44px` at ≤900px. Tag links: invisible ±8px hit area under `pointer: coarse`. TOC links: 12px vertical padding. Summary: `min-height: 44px` |
| Text below 12px | Diagram `miniTag` at 11px | 12px |

## Checked, no change needed
- No `position: sticky` left at ≤900px on any route, apart from the mobile menu's own CTA row. StackScroller (pinned stack cards) is turned off at ≤900px through `matchMedia`.
- 1024px: once the stat fix was in, no route overflows.
- Header at ≤420px hides the CTA pill as the spec intends (logo + burger only). The sticky mobile CTA covers that case.
- The honeypot field in `Lead` sits off-screen on purpose (`-9999px`), so it is not a bug.

## Open / minor
- Footnote markers (`Facts` `0.8em` ≈ 11.2px) sit just under 12px. I left them because they are superscript markers, not text people read.
- Source links in fact lists and inline text links are 38px tall. I left them because they are inline links inside running text.
- Not tested on real iOS Safari (only Chrome iframes). Safe-area padding was not checked on a notched device.
