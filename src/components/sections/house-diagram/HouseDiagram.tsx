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
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { FactNote, FactValue } from "@/components/ui/Facts";
import CtaPill from "@/components/ui/CtaPill";
import { ArrowUpRight } from "@/components/ui/icons";
import { useInView } from "@/components/motion/useInView";
import type { Cta } from "@/content/types";
import type { ServiceSlug } from "@/content/registry";
import {
  FLOW_OWNERS,
  HOTSPOTS,
  SCENES,
  type FlowKey,
  type Hotspot,
  type HotspotEffect,
  type SceneKey,
} from "@/content/system";
import { routes } from "@/lib/routes";
import HouseScene, { ALL_FLOWS } from "./HouseScene";
import LiveStats, { BATTERY_LEVEL } from "./LiveStats";
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

function flowsFor(slugs: ServiceSlug[]): FlowKey[] {
  return ALL_FLOWS.filter((f) => FLOW_OWNERS[f].some((o) => slugs.includes(o)));
}

function EffectLine({
  effect,
  tone,
}: {
  effect: HotspotEffect;
  tone: "light" | "dark";
}) {
  return (
    <div className={styles.effect}>
      <p className={styles.effectRow}>
        <span className={styles.effectLabel}>{effect.label}</span>
        <FactValue
          k={effect.k}
          suffix={effect.suffix}
          className={styles.effectValue}
        />
      </p>
      {effect.compare && (
        <p className={`${styles.effectRow} ${styles.effectCompare}`}>
          <span className={styles.effectLabel}>{effect.compare.label}</span>
          <FactValue
            k={effect.compare.k}
            suffix={effect.compare.suffix}
            className={styles.effectValueMuted}
          />
        </p>
      )}
      <FactNote
        keys={effect.compare ? [effect.k, effect.compare.k] : [effect.k]}
        variant="footnote"
        tone={tone}
      />
    </div>
  );
}

function SceneFact({
  sceneKey,
  tone,
}: {
  sceneKey: SceneKey;
  tone: "light" | "dark";
}) {
  const scene = SCENES.find((s) => s.key === sceneKey)!;
  return (
    <EffectLine
      tone={tone}
      effect={{
        label: scene.fact.label,
        k: scene.fact.k,
        suffix: scene.fact.suffix,
        compare: scene.fact.compare,
      }}
    />
  );
}

function SceneTabs({
  list,
  scene,
  setScene,
  tablistLabel,
  idBase,
}: {
  list: SceneKey[];
  scene: SceneKey;
  setScene: (s: SceneKey, user: boolean) => void;
  tablistLabel: string;
  idBase: string;
}) {
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

export default function HouseDiagram({
  mode,
  scenes,
  initialScene,
  highlight,
  cta,
  tone: toneProp,
  id,
  className,
}: HouseDiagramProps) {
  const tone = toneProp ?? (mode === "full" ? "dark" : "light");
  const sceneList: SceneKey[] =
    scenes ??
    (mode === "teaser"
      ? ["dag", "avond", "winter"]
      : ["dag", "avond", "winter", "piek"]);
  const [scene, setSceneState] = useState<SceneKey>(
    initialScene ?? sceneList[0],
  );
  const [selected, setSelected] = useState<ServiceSlug | null>(
    mode === "full" && highlight?.[0] ? highlight[0] : null,
  );
  const [hovered, setHovered] = useState<ServiceSlug | null>(null);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const idBase = useId().replace(/:/g, "");
  const inView = useInView(rootRef, { threshold: 0.45, once: true });
  // Entry animation keys off the stage itself (the full root can be taller than the viewport).
  const stageRef = useRef<HTMLDivElement>(null);
  const entered = useInView(stageRef, { threshold: 0.2, once: true });

  const setScene = useCallback((s: SceneKey, user: boolean) => {
    setSceneState(s);
    if (user) setTouched(true);
  }, []);

  // Teaser: auto-advance once through the scenes when first in view (desktop, motion allowed).
  useEffect(() => {
    if (mode !== "teaser" || !inView || touched) return;
    if (typeof window === "undefined") return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 900px)").matches
    )
      return;
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
        const btn = rootRef.current?.querySelector<HTMLButtonElement>(
          `[data-hotspot="${selected}"]`,
        );
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
        const sf = new Set(
          scenes.flatMap((k) => SCENES.find((s) => s.key === k)!.flows),
        );
        flows = flows.filter((f) => sf.has(f));
      }
      return {
        activeFlows: new Set(flows),
        lowFlows: new Set<FlowKey>(),
        glow: new Set(hl),
        focusFlows: null,
      };
    }
    const active = new Set(sceneData.flows);
    const glowSet = new Set(
      HOTSPOTS.filter((h) => h.activeIn.includes(scene)).map((h) => h.slug),
    );
    const focusSlug = hovered ?? selected;
    const focus = focusSlug
      ? new Set(flowsFor([focusSlug]).filter((f) => active.has(f)))
      : null;
    if (focusSlug) {
      glowSet.clear();
      glowSet.add(focusSlug);
    }
    return {
      activeFlows: active,
      lowFlows: new Set(sceneData.lowValueFlows ?? []),
      glow: glowSet,
      focusFlows: focus,
    };
  }, [mode, highlight, scenes, sceneData, scene, hovered, selected]);

  const rootStyle = { "--hd-battery": BATTERY_LEVEL[scene] } as CSSProperties;
  const ordered = useMemo(
    () =>
      [...HOTSPOTS].sort((a, b) => a.pos[1] - b.pos[1] || a.pos[0] - b.pos[0]),
    [],
  );

  const select = (slug: ServiceSlug) => {
    setTouched(true);
    setSelected((cur) => (cur === slug ? null : slug));
    if (window.matchMedia("(max-width: 900px)").matches) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        }),
      );
    }
  };

  // ───────────── mini ─────────────
  if (mode === "mini") {
    const hl = highlight ?? [];
    const labels = hl
      .map((s) => HOTSPOTS.find((h) => h.slug === s)!)
      .filter(Boolean);
    return (
      <figure
        id={id}
        className={`${styles.root} ${styles.mini} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`}
        data-scene={scenes?.[0] ?? "dag"}
        data-in={entered || undefined}
        style={
          {
            "--hd-battery": BATTERY_LEVEL[scenes?.[0] ?? "dag"],
          } as CSSProperties
        }
      >
        <div
          ref={stageRef}
          className={styles.stage}
          role="img"
          aria-label={`Schema van een woning waarin ${labels.map((l) => l.label.toLowerCase()).join(" en ")} samenwerken met de rest van het energiesysteem.`}
        >
          <HouseScene
            activeFlows={activeFlows}
            lowFlows={lowFlows}
            glow={glow}
            focusFlows={null}
            tone={tone}
          />
          {labels.map((h) => (
            <span
              key={h.slug}
              className={styles.miniTag}
              style={
                { left: `${h.pos[0]}%`, top: `${h.pos[1]}%` } as CSSProperties
              }
            >
              {h.label}
            </span>
          ))}
        </div>
        <figcaption className={styles.miniCaption}>
          {labels.map((h) => h.role).join(" ")}
        </figcaption>
      </figure>
    );
  }

  const stage = (
    <div className={styles.stageWrap}>
      <div
        ref={stageRef}
        className={styles.stage}
        onMouseLeave={() => setHovered(null)}
      >
        <HouseScene
          activeFlows={activeFlows}
          lowFlows={lowFlows}
          glow={glow}
          focusFlows={focusFlows}
          tone={tone}
        />
  
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
                style={
                  { left: `${h.pos[0]}%`, top: `${h.pos[1]}%` } as CSSProperties
                }
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
      <LiveStats scene={scene} />
      <Legend />
    </div>
  );

  // ───────────── teaser ─────────────
  if (mode === "teaser") {
    return (
      <div
        id={id}
        ref={rootRef}
        className={`${styles.root} ${styles.teaser} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`}
        data-scene={scene}
        data-in={entered || undefined}
        style={rootStyle}
      >
        <div className={styles.teaserText}>
          <SceneTabs
            list={sceneList}
            scene={scene}
            setScene={setScene}
            tablistLabel="Kies een moment van de dag"
            idBase={idBase}
          />
          <div
            id={`${idBase}-panel`}
            role="tabpanel"
            aria-labelledby={`${idBase}-tab-${scene}`}
            className={styles.teaserPanel}
            key={scene}
          >
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
    <div
      id={id}
      ref={rootRef}
      className={`${styles.root} ${styles.full} ${tone === "dark" ? styles.dark : styles.light} ${className ?? ""}`}
      data-scene={scene}
      data-in={entered || undefined}
      style={rootStyle}
    >
      <div className={styles.fullTop}>
        <SceneTabs
          list={sceneList}
          scene={scene}
          setScene={setScene}
          tablistLabel="Kies een moment"
          idBase={idBase}
        />
        <p className={styles.hint}>
          Tik of klik op een onderdeel om te zien wat het doet.
        </p>
      </div>
      <div className={styles.fullGrid}>
        {stage}
        <div ref={panelRef} className={styles.side}>
          <div
            id={`${idBase}-panel`}
            role="tabpanel"
            aria-labelledby={`${idBase}-tab-${scene}`}
            className={styles.scenePanel}
          >
            <p className={styles.sceneEyebrow}>{sceneData.label}</p>
            <h3 className={styles.sceneTitle}>{sceneData.title}</h3>
            <p className={styles.sceneCaption}>{sceneData.caption}</p>
            <SceneFact sceneKey={scene} tone={tone} />
          </div>
          <div
            id={`${idBase}-detail`}
            className={styles.detail}
            aria-live="polite"
          >
            {sel ? (
              <HotspotDetail
                h={sel}
                scene={scene}
                tone={tone}
                onClose={() => setSelected(null)}
              />
            ) : (
              <p className={styles.detailEmpty}>
                Kies een onderdeel in de woning: je ziet wat het in dit moment
                doet, en wat het je oplevert.
              </p>
            )}
          </div>
          {cta && (
            <div
              className={`${styles.inlineCta} ${touched ? styles.inlineCtaOn : ""}`}
            >
              <p className={styles.inlineCtaTitle}>
                Wil je dit voor jouw dak en verbruik zien?
              </p>
              <CtaPill
                href={cta.href}
                variant={cta.variant ?? "lime"}
                size="sm"
              >
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

function HotspotDetail({
  h,
  scene,
  tone,
  onClose,
}: {
  h: Hotspot;
  scene: SceneKey;
  tone: "light" | "dark";
  onClose: () => void;
}) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailHead}>
        <h4 className={styles.detailTitle}>{h.label}</h4>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={`Sluit uitleg ${h.label}`}
        >
          ×
        </button>
      </div>
      <p className={styles.detailRole}>{h.role}</p>
      <p className={styles.detailScene}>{h.scenes[scene]}</p>
      {h.effect ? (
        <EffectLine effect={h.effect} tone={tone} />
      ) : (
        <p className={styles.effectText}>{h.effectText}</p>
      )}
      <Link href={routes.service(h.slug)} className={styles.detailLink}>
        Meer over {h.label.toLowerCase()}{" "}
        <ArrowUpRight className={styles.detailLinkIcon} />
      </Link>
    </div>
  );
}

function Legend() {
  return (
    <ul className={styles.legend} aria-hidden="true">
      <li>
        <span className={`${styles.swatch} ${styles.swatchStroom}`} />{" "}
        zonnestroom
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
function TextAlternative({
  tone,
  list,
}: {
  tone: "light" | "dark";
  list: SceneKey[];
}): ReactNode {
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
                    <Link
                      href={routes.service(h.slug)}
                      className={styles.altLink}
                    >
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
        Alle bedragen zijn indicatief.{" "}
        <FactNote
          keys={[
            "stroomprijsAllIn",
            "injectievergoeding",
            "capaciteitstariefPerKw",
          ]}
          variant="inline"
          tone={tone}
        />
      </p>
    </div>
  );
}
