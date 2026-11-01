"use client";

// HouseDiagram – the whole-home energy system as one SVG (05 §8.4, owner: Builder 1).
//   mode="full"   → scene tabs (Dag · Avond · Winter · Piekmoment), 7 hotspot buttons with a
//                   detail panel (what it does in this scene + € effect + link), animated
//                   flows, and a crawlable text alternative under the diagram.
//   mode="teaser" → 3 scene tabs (auto-advance once on view, desktop only), caption + fact.
//   mode="mini"   → static picture that highlights `highlight` components and their flows
//                   (used by service pages inside StickySplit media).
// Text/data: src/content/system.ts. Every number is a FactValue.

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { FactNote, FactValue } from "@/components/ui/Facts";
import CtaPill from "@/components/ui/CtaPill";
import { ArrowUpRight } from "@/components/ui/icons";
import { useInView } from "@/components/motion/useInView";
import type { Cta } from "@/content/types";
import type { ServiceSlug } from "@/content/registry";
import { FLOW_KIND, FLOW_OWNERS, HOTSPOTS, SCENES, type FlowKey, type Hotspot, type HotspotEffect, type SceneKey } from "@/content/system";
import { routes } from "@/lib/routes";
import styles from "./HouseDiagram.module.css";

export type HouseDiagramProps = {
  mode: "teaser" | "full" | "mini";
  scenes?: SceneKey[];
  initialScene?: SceneKey;
  /** Components that glow (mini) or are pre-selected (full). */
  highlight?: ServiceSlug[];
  /** Teaser/full: CTA under the caption / in the detail panel. */
  cta?: Cta;
  /** Colour scheme; default dark for full, light for teaser/mini. */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

// ───────────────────────── SVG geometry (viewBox 0 0 1000 640) ─────────────────────────
const FLOW_PATHS: Record<FlowKey, string> = {
  "zon-omvormer": "M420 250 C 460 300, 560 300, 588 345",
  "pvt-omvormer": "M640 250 C 628 290, 612 318, 606 345",
  "omvormer-huis": "M598 388 C 588 430, 560 470, 532 494",
  "omvormer-batterij": "M582 380 C 500 405, 380 430, 336 492",
  "omvormer-auto": "M580 384 C 470 425, 270 420, 222 478",
  "omvormer-warmtepomp": "M620 380 C 720 410, 830 455, 858 520",
  "omvormer-airco": "M578 360 C 540 348, 490 346, 462 346",
  "omvormer-net": "M622 352 C 680 340, 740 336, 780 340 L 952 176",
  "batterij-huis": "M346 516 C 400 522, 460 516, 506 504",
  "net-huis": "M952 176 L 780 340 C 700 400, 600 462, 534 500",
  "net-batterij": "M952 176 L 780 340 C 640 430, 420 472, 344 506",
  "net-auto": "M952 176 L 780 340 C 620 440, 330 452, 226 488",
  "net-warmtepomp": "M952 176 C 930 300, 900 440, 872 520",
  "pvt-warmtepomp": "M694 252 C 770 300, 850 380, 866 520",
  "warmtepomp-huis": "M840 552 C 780 566, 650 574, 300 570",
};
const ALL_FLOWS = Object.keys(FLOW_PATHS) as FlowKey[];

/** Where each hotspot's glow ring sits in SVG units (matches pos % in system.ts). */
const GLOW: Record<ServiceSlug, { cx: number; cy: number; r: number }> = {
  zonnepanelen: { cx: 410, cy: 220, r: 92 },
  "pvt-panelen": { cx: 662, cy: 220, r: 92 },
  omvormers: { cx: 600, cy: 365, r: 40 },
  thuisbatterij: { cx: 328, cy: 516, r: 48 },
  laadpalen: { cx: 215, cy: 505, r: 50 },
  "lucht-water-warmtepomp": { cx: 868, cy: 546, r: 58 },
  "lucht-lucht-warmtepomp": { cx: 430, cy: 346, r: 42 },
};

function flowsFor(slugs: ServiceSlug[]): FlowKey[] {
  return ALL_FLOWS.filter((f) => FLOW_OWNERS[f].some((o) => slugs.includes(o)));
}

function House({ activeFlows, lowFlows, glow, focusFlows, tone }: { activeFlows: Set<FlowKey>; lowFlows: Set<FlowKey>; glow: Set<ServiceSlug>; focusFlows: Set<FlowKey> | null; tone: "light" | "dark" }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 1000 640" className={styles.svg} aria-hidden="true" focusable="false" data-tone={tone}>
      <defs>
        <linearGradient id={`${gid}-pv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--hd-panel-a)" />
          <stop offset="1" stopColor="var(--hd-panel-b)" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`}>
          <stop offset="0" stopColor="var(--c-lime)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--c-lime)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sun */}
      <g className={styles.sun}>
        <circle cx="120" cy="110" r="38" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="120" y1="52" x2="120" y2="36" transform={`rotate(${a} 120 110)`} />
        ))}
      </g>
      <g className={styles.moon}>
        <path d="M128 76 a40 40 0 1 0 30 62 a32 32 0 1 1 -30 -62z" />
      </g>

      {/* glow rings behind active components */}
      {[...glow].map((slug) => (
        <circle key={slug} cx={GLOW[slug].cx} cy={GLOW[slug].cy} r={GLOW[slug].r} fill={`url(#${gid}-glow)`} className={styles.glow} />
      ))}

      {/* ground */}
      <line x1="10" y1="580" x2="990" y2="580" className={styles.ground} />

      {/* grid pylon */}
      <g className={styles.line}>
        <path d="M952 176 L 930 580 M952 176 L 974 580 M936 300 L 968 300 M940 420 L 962 420 M934 176 L 970 176" />
        <text x="952" y="160" textAnchor="middle" className={styles.svgLabel}>net</text>
      </g>

      {/* house body */}
      <rect x="280" y="300" width="500" height="280" className={styles.body} />
      <line x1="280" y1="440" x2="780" y2="440" className={styles.thin} />
      {/* roof face */}
      <path d="M250 300 L 360 130 L 700 130 L 810 300 Z" className={styles.roof} />
      {/* PV panels (left) */}
      <g>
        <path d="M352 160 L 500 160 L 492 282 L 286 282 Z" fill={`url(#${gid}-pv)`} className={styles.panel} />
        <path d="M339 201 L 497 201 M321 242 L 494 242 M401 160 L 355 282 M450 160 L 424 282" className={styles.panelGrid} />
      </g>
      {/* PVT panels (right) – stroom + warmte: tube lines */}
      <g>
        <path d="M556 160 L 704 160 L 774 282 L 566 282 Z" fill={`url(#${gid}-pv)`} className={styles.panel} />
        <path d="M558 201 L 728 201 M562 242 L 751 242 M605 160 L 636 282 M655 160 L 706 282" className={styles.panelGrid} />
        <path d="M566 290 L 774 290" className={styles.pvtPipe} />
      </g>

      {/* windows */}
      <rect x="310" y="330" width="56" height="70" rx="4" className={styles.window} />
      <rect x="690" y="330" width="60" height="70" rx="4" className={styles.window} />
      <rect x="600" y="470" width="58" height="110" rx="4" className={styles.door} />

      {/* airco indoor unit */}
      <rect x="398" y="334" width="66" height="22" rx="6" className={styles.device} />
      <path d="M408 364 q 8 8 0 16 M428 364 q 8 8 0 16 M448 364 q 8 8 0 16" className={styles.thin} />
      {/* inverter */}
      <rect x="582" y="340" width="38" height="50" rx="5" className={styles.device} />
      <path d="M592 362 l 8 -8 l 0 8 l 8 -8" className={styles.thin} />
      {/* battery */}
      <rect x="306" y="478" width="44" height="84" rx="6" className={styles.device} />
      <rect x="318" y="470" width="20" height="8" rx="2" className={styles.device} />
      <rect x="314" y="526" width="28" height="28" rx="3" className={styles.batteryFill} />
      {/* household (lamp + table) */}
      <path d="M520 450 L 520 470 M506 470 L 534 470 L 528 482 L 512 482 Z" className={styles.thin} />
      <path d="M470 545 L 560 545 M480 545 L 480 580 M550 545 L 550 580" className={styles.thin} />
      {/* boiler / buffer */}
      <rect x="704" y="470" width="40" height="100" rx="18" className={styles.device} />

      {/* charge point + car */}
      <rect x="206" y="470" width="18" height="110" rx="4" className={styles.device} />
      <rect x="210" y="482" width="10" height="14" rx="2" className={styles.batteryFill} />
      <path d="M40 568 L 46 534 Q 52 516 74 514 L 140 514 Q 160 514 172 532 L 192 542 Q 200 546 200 556 L 200 568 Z" className={styles.car} />
      <circle cx="78" cy="572" r="13" className={styles.wheel} />
      <circle cx="166" cy="572" r="13" className={styles.wheel} />

      {/* heat pump outdoor unit */}
      <rect x="818" y="508" width="100" height="72" rx="8" className={styles.device} />
      <circle cx="850" cy="544" r="22" className={styles.fan} />
      <path d="M850 526 L 850 562 M832 544 L 868 544" className={`${styles.thin} ${styles.fanBlades}`} />
      <path d="M884 524 L 906 524 M884 536 L 906 536 M884 548 L 906 548 M884 560 L 906 560" className={styles.thin} />

      {/* meter */}
      <rect x="770" y="326" width="22" height="28" rx="3" className={styles.device} />

      {/* energy flows */}
      <g>
        {ALL_FLOWS.map((f) => {
          const active = activeFlows.has(f);
          const kind = FLOW_KIND[f];
          const dim = focusFlows ? !focusFlows.has(f) : false;
          return (
            <path
              key={f}
              d={FLOW_PATHS[f]}
              className={`${styles.flow} ${styles[`flow_${kind}`]} ${active ? styles.flowOn : ""} ${lowFlows.has(f) ? styles.flowLow : ""} ${dim ? styles.flowDim : ""}`}
              pathLength={100}
            />
          );
        })}
      </g>
    </svg>
  );
}

function EffectLine({ effect, tone }: { effect: HotspotEffect; tone: "light" | "dark" }) {
  return (
    <div className={styles.effect}>
      <p className={styles.effectRow}>
        <span className={styles.effectLabel}>{effect.label}</span>
        <FactValue k={effect.k} suffix={effect.suffix} className={styles.effectValue} />
      </p>
      {effect.compare && (
        <p className={`${styles.effectRow} ${styles.effectCompare}`}>
          <span className={styles.effectLabel}>{effect.compare.label}</span>
          <FactValue k={effect.compare.k} suffix={effect.compare.suffix} className={styles.effectValueMuted} />
        </p>
      )}
      <FactNote keys={effect.compare ? [effect.k, effect.compare.k] : [effect.k]} variant="footnote" tone={tone} />
    </div>
  );
}

function SceneFact({ sceneKey, tone }: { sceneKey: SceneKey; tone: "light" | "dark" }) {
  const scene = SCENES.find((s) => s.key === sceneKey)!;
  return (
    <EffectLine
      tone={tone}
      effect={{ label: scene.fact.label, k: scene.fact.k, suffix: scene.fact.suffix, compare: scene.fact.compare }}
    />
  );
}

function SceneTabs({ list, scene, setScene, tablistLabel, idBase }: { list: SceneKey[]; scene: SceneKey; setScene: (s: SceneKey, user: boolean) => void; tablistLabel: string; idBase: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % list.length;
    if (e.key === "ArrowLeft") next = (i - 1 + list.length) % list.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = list.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setScene(list[next], true);
      refs.current[next]?.focus();
    }
  };
  return (
    <div role="tablist" aria-label={tablistLabel} className={styles.tabs}>
      {list.map((k, i) => {
        const s = SCENES.find((x) => x.key === k)!;
        const selected = k === scene;
        return (
          <button
            key={k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${k}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            onClick={() => setScene(k, true)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default function HouseDiagram({ mode, scenes, initialScene, highlight, cta, tone: toneProp, id, className }: HouseDiagramProps) {
  const tone = toneProp ?? (mode === "full" ? "dark" : "light");
  const sceneList: SceneKey[] = scenes ?? (mode === "teaser" ? ["dag", "avond", "winter"] : ["dag", "avond", "winter", "piek"]);
  const [scene, setSceneState] = useState<SceneKey>(initialScene ?? sceneList[0]);
  const [selected, setSelected] = useState<ServiceSlug | null>(mode === "full" && highlight?.[0] ? highlight[0] : null);
  const [hovered, setHovered] = useState<ServiceSlug | null>(null);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const idBase = useId().replace(/:/g, "");
  const inView = useInView(rootRef, { threshold: 0.45, once: true });

  const setScene = useCallback((s: SceneKey, user: boolean) => {
    setSceneState(s);
    if (user) setTouched(true);
  }, []);

  // Teaser: auto-advance once through the scenes when first in view (desktop, motion allowed).
  useEffect(() => {
    if (mode !== "teaser" || !inView || touched) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 900px)").matches) return;
    let i = sceneList.indexOf(scene);
    if (i >= sceneList.length - 1) return;
    const t = window.setInterval(() => {
      i += 1;
      setSceneState(sceneList[i]);
      if (i >= sceneList.length - 1) window.clearInterval(t);
    }, 3800);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, inView, touched]);

  // Esc closes the detail panel (full).
  useEffect(() => {
    if (mode !== "full" || !selected) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        const btn = rootRef.current?.querySelector<HTMLButtonElement>(`[data-hotspot="${selected}"]`);
        setSelected(null);
        btn?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, selected]);

  const sceneData = SCENES.find((s) => s.key === scene)!;

  const { activeFlows, lowFlows, glow, focusFlows } = useMemo(() => {
    if (mode === "mini") {
      const hl = highlight ?? [];
      let flows = flowsFor(hl);
      if (scenes && scenes.length) {
        const sf = new Set(scenes.flatMap((k) => SCENES.find((s) => s.key === k)!.flows));
        flows = flows.filter((f) => sf.has(f));
      }
      return { activeFlows: new Set(flows), lowFlows: new Set<FlowKey>(), glow: new Set(hl), focusFlows: null };
    }
    const active = new Set(sceneData.flows);
    const glowSet = new Set(HOTSPOTS.filter((h) => h.activeIn.includes(scene)).map((h) => h.slug));
    const focusSlug = hovered ?? selected;
    const focus = focusSlug ? new Set(flowsFor([focusSlug]).filter((f) => active.has(f))) : null;
    if (focusSlug) {
      glowSet.clear();
      glowSet.add(focusSlug);
    }
    return { activeFlows: active, lowFlows: new Set(sceneData.lowValueFlows ?? []), glow: glowSet, focusFlows: focus };
  }, [mode, highlight, scenes, sceneData, scene, hovered, selected]);

  const ordered = useMemo(() => [...HOTSPOTS].sort((a, b) => a.pos[1] - b.pos[1] || a.pos[0] - b.pos[0]), []);

  const select = (slug: ServiceSlug) => {
    setTouched(true);
    setSelected((cur) => (cur === slug ? null : slug));
    if (window.matchMedia("(max-width: 900px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
    }
  };

  // ───────────── mini ─────────────
  if (mode === "mini") {
    const hl = highlight ?? [];
    const labels = hl.map((s) => HOTSPOTS.find((h) => h.slug === s)!).filter(Boolean);
    return (
      <figure id={id} className={`${styles.root} ${styles.mini} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`}>
        <div className={styles.stage} role="img" aria-label={`Schema van een woning waarin ${labels.map((l) => l.label.toLowerCase()).join(" en ")} samenwerken met de rest van het energiesysteem.`}>
          <House activeFlows={activeFlows} lowFlows={lowFlows} glow={glow} focusFlows={null} tone={tone} />
          {labels.map((h) => (
            <span key={h.slug} className={styles.miniTag} style={{ left: `${h.pos[0]}%`, top: `${h.pos[1]}%` } as CSSProperties}>
              {h.label}
            </span>
          ))}
        </div>
        <figcaption className={styles.miniCaption}>{labels.map((h) => h.role).join(" ")}</figcaption>
      </figure>
    );
  }

  const stage = (
    <div className={styles.stage} onMouseLeave={() => setHovered(null)}>
      <House activeFlows={activeFlows} lowFlows={lowFlows} glow={glow} focusFlows={focusFlows} tone={tone} />
      <Legend />
      {mode === "full" &&
        ordered.map((h) => {
          const isSel = selected === h.slug;
          const isActive = h.activeIn.includes(scene);
          return (
            <button
              key={h.slug}
              type="button"
              data-hotspot={h.slug}
              className={`${styles.hotspot} ${isSel ? styles.hotspotSel : ""} ${isActive ? styles.hotspotActive : ""}`}
              style={{ left: `${h.pos[0]}%`, top: `${h.pos[1]}%` } as CSSProperties}
              aria-expanded={isSel}
              aria-controls={`${idBase}-detail`}
              aria-label={`${h.label} – uitleg`}
              onClick={() => select(h.slug)}
              onMouseEnter={() => setHovered(h.slug)}
              onFocus={() => setHovered(h.slug)}
              onBlur={() => setHovered(null)}
            >
              <span className={styles.hotspotDot} aria-hidden="true" />
              <span className={styles.hotspotLabel} aria-hidden="true">
                {h.label}
              </span>
            </button>
          );
        })}
    </div>
  );

  // ───────────── teaser ─────────────
  if (mode === "teaser") {
    return (
      <div id={id} ref={rootRef} className={`${styles.root} ${styles.teaser} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`} data-scene={scene}>
        <div className={styles.teaserText}>
          <SceneTabs list={sceneList} scene={scene} setScene={setScene} tablistLabel="Kies een moment van de dag" idBase={idBase} />
          <div id={`${idBase}-panel`} role="tabpanel" aria-labelledby={`${idBase}-tab-${scene}`} className={styles.teaserPanel} key={scene}>
            <h3 className={styles.sceneTitle}>{sceneData.title}</h3>
            <p className={styles.sceneCaption}>{sceneData.caption}</p>
            <SceneFact sceneKey={scene} tone={tone} />
          </div>
          {cta && (
            <div className={styles.teaserCta}>
              <CtaPill href={cta.href} variant={cta.variant ?? "ink"}>
                {cta.label}
              </CtaPill>
            </div>
          )}
        </div>
        {stage}
      </div>
    );
  }

  // ───────────── full ─────────────
  const sel = selected ? HOTSPOTS.find((h) => h.slug === selected)! : null;
  return (
    <div id={id} ref={rootRef} className={`${styles.root} ${styles.full} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`} data-scene={scene}>
      <div className={styles.fullTop}>
        <SceneTabs list={sceneList} scene={scene} setScene={setScene} tablistLabel="Kies een moment" idBase={idBase} />
        <p className={styles.hint}>Tik of klik op een onderdeel om te zien wat het doet.</p>
      </div>
      <div className={styles.fullGrid}>
        {stage}
        <div ref={panelRef} className={styles.side}>
          <div id={`${idBase}-panel`} role="tabpanel" aria-labelledby={`${idBase}-tab-${scene}`} className={styles.scenePanel}>
            <p className={styles.sceneEyebrow}>{sceneData.label}</p>
            <h3 className={styles.sceneTitle}>{sceneData.title}</h3>
            <p className={styles.sceneCaption}>{sceneData.caption}</p>
            <SceneFact sceneKey={scene} tone={tone} />
          </div>
          <div id={`${idBase}-detail`} className={styles.detail} aria-live="polite">
            {sel ? (
              <HotspotDetail h={sel} scene={scene} tone={tone} onClose={() => setSelected(null)} />
            ) : (
              <p className={styles.detailEmpty}>Kies een onderdeel in de woning: je ziet wat het in dit moment doet, en wat het je oplevert.</p>
            )}
          </div>
          {cta && (
            <div className={`${styles.inlineCta} ${touched ? styles.inlineCtaOn : ""}`}>
              <p className={styles.inlineCtaTitle}>Wil je dit voor jouw dak en verbruik zien?</p>
              <CtaPill href={cta.href} variant={cta.variant ?? "lime"} size="sm">
                {cta.label}
              </CtaPill>
            </div>
          )}
        </div>
      </div>
      <TextAlternative tone={tone} list={sceneList} />
    </div>
  );
}

function HotspotDetail({ h, scene, tone, onClose }: { h: Hotspot; scene: SceneKey; tone: "light" | "dark"; onClose: () => void }) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailHead}>
        <h4 className={styles.detailTitle}>{h.label}</h4>
        <button type="button" className={styles.close} onClick={onClose} aria-label={`Sluit uitleg ${h.label}`}>
          ×
        </button>
      </div>
      <p className={styles.detailRole}>{h.role}</p>
      <p className={styles.detailScene}>{h.scenes[scene]}</p>
      {h.effect ? <EffectLine effect={h.effect} tone={tone} /> : <p className={styles.effectText}>{h.effectText}</p>}
      <Link href={routes.service(h.slug)} className={styles.detailLink}>
        Meer over {h.label.toLowerCase()} <ArrowUpRight className={styles.detailLinkIcon} />
      </Link>
    </div>
  );
}

function Legend() {
  return (
    <ul className={styles.legend} aria-hidden="true">
      <li>
        <span className={`${styles.swatch} ${styles.swatchStroom}`} /> zonnestroom
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.swatchWarmte}`} /> warmte
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.swatchNet}`} /> net
      </li>
    </ul>
  );
}

/** Crawlable text alternative: per scene, what each active component does (always in DOM). */
function TextAlternative({ tone, list }: { tone: "light" | "dark"; list: SceneKey[] }): ReactNode {
  return (
    <div className={styles.alt}>
      <h3 className={styles.altTitle}>Het huisdiagram in woorden</h3>
      <div className={styles.altGrid}>
        {list.map((k) => {
          const s = SCENES.find((x) => x.key === k)!;
          const comps = HOTSPOTS.filter((h) => h.activeIn.includes(k));
          return (
            <details key={k} className={styles.altItem} open={k === list[0]}>
              <summary className={styles.altSummary}>{s.title}</summary>
              <p className={styles.altCaption}>{s.caption}</p>
              <ul className={styles.altList}>
                {comps.map((h) => (
                  <li key={h.slug}>
                    <Link href={routes.service(h.slug)} className={styles.altLink}>
                      {h.label}
                    </Link>
                    : {h.scenes[k]}
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
      <p className={styles.altNote}>
        Alle bedragen zijn indicatief. <FactNote keys={["stroomprijsAllIn", "injectievergoeding", "capaciteitstariefPerKw"]} variant="inline" tone={tone} />
      </p>
    </div>
  );
}
