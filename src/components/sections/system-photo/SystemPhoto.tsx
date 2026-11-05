"use client";

// SystemPhoto – the whole-home energy system drawn over a real house photo.
//   mode="teaser"  → every part on, numbered dots + a short "wat het doet / extra boost" list.
//   mode="builder" → start from "gasketel + net", add parts one by one and see the lines,
//                    the yearly saving and three bars (net, gas, factuur) change.
// Photo, anchors, flows and the savings model: src/content/system-builder.ts.

import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties, type ComponentType } from "react";
import CtaPill from "@/components/ui/CtaPill";
import SmartImage from "@/components/ui/SmartImage";
import {
  ArrowUpRight,
  BatteryIcon,
  BoltIcon,
  CarIcon,
  CheckIcon,
  FanIcon,
  GearCycleIcon,
  HomeIcon,
  InverterIcon,
  PlusIcon,
  PvtIcon,
  SolarPanelIcon,
  type IconProps,
} from "@/components/ui/icons";
import { useInView } from "@/components/motion/useInView";
import type { Cta } from "@/content/types";
import {
  ADD_ORDER,
  ALL_ON,
  BAR_MAX,
  BASELINE,
  BUILDER_COPY,
  FLOWS,
  PARTS,
  PHOTO,
  TEASER_ORDER,
  scenario,
  visibleParts,
  type AddKey,
  type Flow,
  type PartKey,
  type Pt,
} from "@/content/system-builder";
import { routes } from "@/lib/routes";
import styles from "./SystemPhoto.module.css";

export type SystemPhotoProps = {
  mode: "teaser" | "builder";
  cta?: Cta;
  id?: string;
  className?: string;
};

function FlameIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.6.2 1.6 1 2.6 2.1 2.6C12 8 10.6 5.6 12 3Z" />
    </svg>
  );
}

const ICON: Record<PartKey, ComponentType<IconProps>> = {
  zon: SolarPanelIcon,
  pvt: PvtIcon,
  omvormer: InverterIcon,
  batterij: BatteryIcon,
  warmtepomp: FanIcon,
  laadpaal: CarIcon,
  sturing: GearCycleIcon,
  huis: HomeIcon,
  net: BoltIcon,
  gas: FlameIcon,
};

// ───────────────────────── geometry ─────────────────────────
// The SVG uses viewBox 0 0 1000 H with preserveAspectRatio="none" over an uncropped photo,
// so [x %, y %] maps 1:1 onto the image.
const VB_W = 1000;
const VB_H = Math.round((VB_W * PHOTO.height) / PHOTO.width);
const toVb = ([x, y]: Pt): [number, number] => [(x / 100) * VB_W, (y / 100) * VB_H];

/** Catmull-Rom through the waypoints → cubic Bézier path. */
function smoothPath(pts: Pt[]): string {
  const p = pts.map(toVb);
  if (p.length < 2) return "";
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function pathLength(pts: Pt[]): number {
  const p = pts.map(toVb);
  let l = 0;
  for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return l;
}

const GEO = FLOWS.map((f) => ({ ...f, d: smoothPath(f.pts), len: pathLength(f.pts) }));

const PARTICLES: Record<Flow["kind"], number> = { stroom: 3, warmte: 3, net: 2, gas: 2, data: 0 };

function FlowLines({ on, focus }: { on: ReadonlySet<AddKey>; focus: PartKey | null }) {
  return (
    <svg className={styles.svg} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="sp-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {GEO.map((f) => {
        const visible = f.when(on);
        const low = f.low?.(on) ?? false;
        const dim = focus ? !f.parts.includes(focus) : false;
        const dur = Math.max(1.6, f.len / (low ? 90 : 150));
        const n = low ? 1 : PARTICLES[f.kind];
        return (
          <g
            key={f.key}
            className={`${styles.flow} ${styles[`k_${f.kind}`]}`}
            data-on={visible || undefined}
            data-low={low || undefined}
            data-dim={dim || undefined}
          >
            <path d={f.d} className={styles.glow} filter="url(#sp-blur)" />
            <path d={f.d} className={styles.line} pathLength={100} />
            {visible &&
              Array.from({ length: n }, (_, i) => (
                <circle key={i} r={f.kind === "gas" ? 3.4 : 4.2} className={styles.dot}>
                  <animateMotion dur={`${dur}s`} begin={`${(-dur * i) / n}s`} repeatCount="indefinite" path={f.d} rotate="auto" />
                </circle>
              ))}
          </g>
        );
      })}
    </svg>
  );
}

function Marker({
  k,
  n,
  on,
  showLabel,
  active,
  onEnter,
  onLeave,
}: {
  k: PartKey;
  n?: number;
  on: boolean;
  showLabel: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const p = PARTS[k];
  const Icon = ICON[k];
  return (
    <span
      className={`${styles.marker} ${p.inside ? styles.markerInside : ""} ${p.side === "left" ? styles.markerLeft : ""}`}
      style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%` } as CSSProperties}
      data-on={on || undefined}
      data-active={active || undefined}
      data-kind={k}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className={styles.pin}>
        {n ? <span className={styles.pinNum}>{n}</span> : <Icon className={styles.pinIcon} />}
      </span>
      {showLabel && (
        <span className={styles.tag}>
          {p.label}
          {p.inside && <em> · binnen</em>}
        </span>
      )}
    </span>
  );
}

const eur = (n: number) => `€ ${Math.round(n).toLocaleString("nl-BE")}`;
const num = (n: number) => Math.round(n).toLocaleString("nl-BE");

function Bar({ label, value, max, unit, tone }: { label: string; value: number; max: number; unit: string; tone: "net" | "gas" | "eur" }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className={styles.bar} data-tone={tone}>
      <div className={styles.barHead}>
        <span>{label}</span>
        <strong>
          {unit === "€" ? eur(value) : `${num(value)} ${unit}`}
        </strong>
      </div>
      <span className={styles.barTrack} aria-hidden="true">
        <span className={styles.barFill} style={{ transform: `scaleX(${pct})` }} />
      </span>
    </div>
  );
}

export default function SystemPhoto({ mode, cta, id, className }: SystemPhotoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { threshold: 0.25, once: true });
  const [focus, setFocus] = useState<PartKey | null>(null);
  const [on, setOn] = useState<ReadonlySet<AddKey>>(() => (mode === "teaser" ? ALL_ON : new Set()));
  const [last, setLast] = useState<AddKey | null>(null);

  const current = useMemo(() => scenario(on), [on]);
  const visible = useMemo(() => new Set(visibleParts(on)), [on]);

  const stepGain = useMemo(() => {
    if (!last || !on.has(last)) return null;
    const without = new Set(on);
    without.delete(last);
    return scenario(without).factuur - current.factuur;
  }, [last, on, current]);

  const toggle = (k: AddKey) => {
    const adding = !on.has(k);
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
    setLast(adding ? k : null);
  };

  const stage = (
    <div className={styles.stage} onMouseLeave={() => setFocus(null)}>
      {/* Photo, lines and dots share one box in the photo's own aspect ratio, so they stay
          aligned when the stage crops it (teaser) – see .canvas in the CSS. */}
      <div className={styles.canvas}>
        <SmartImage
          image={{ src: PHOTO.src, alt: PHOTO.alt, width: PHOTO.width, height: PHOTO.height }}
          fill
          sizes={mode === "teaser" ? "(max-width: 900px) 100vw, 90vw" : "(max-width: 900px) 100vw, 64vw"}
          quality={90}
          className={styles.photo}
        />
        <span className={styles.shade} aria-hidden="true" />
        <FlowLines on={on} focus={focus} />
        <div className={styles.markers} aria-hidden="true">
          {(mode === "teaser" ? ([...TEASER_ORDER, "huis", "net"] as PartKey[]) : (Object.keys(PARTS) as PartKey[])).map((k) => {
            const n = mode === "teaser" ? TEASER_ORDER.indexOf(k) + 1 || undefined : undefined;
            return (
              <Marker
                key={k}
                k={k}
                n={n}
                on={visible.has(k)}
                showLabel={mode === "builder" || !n}
                active={focus === k || (mode === "builder" && last === k)}
                onEnter={() => setFocus(k)}
                onLeave={() => setFocus(null)}
              />
            );
          })}
        </div>
      </div>
      <ul className={styles.legend} aria-hidden="true">
        <li data-k="stroom">Zonnestroom</li>
        <li data-k="warmte">Warmte</li>
        <li data-k="net">Net</li>
        {!on.has("warmtepomp") && <li data-k="gas">Gas</li>}
      </ul>
    </div>
  );

  // ───────────── teaser ─────────────
  if (mode === "teaser") {
    return (
      <div id={id} ref={rootRef} className={`${styles.root} ${styles.teaser} ${className ?? ""}`} data-inview={inView || undefined}>
        <figure className={styles.figure}>
          {stage}
          <figcaption className={styles.srOnly}>{PHOTO.alt} Lijnen tonen hoe zonnestroom, warmte en netstroom door de woning gaan.</figcaption>
        </figure>
        <ol className={styles.list}>
          {TEASER_ORDER.map((k, i) => {
            const p = PARTS[k];
            const Icon = ICON[k];
            return (
              <li
                key={k}
                className={styles.item}
                data-active={focus === k || undefined}
                onMouseEnter={() => setFocus(k)}
                onMouseLeave={() => setFocus(null)}
              >
                <div className={styles.itemHead}>
                  <span className={styles.itemNum} aria-hidden="true">
                    {i + 1}
                  </span>
                  <Icon className={styles.itemIcon} />
                </div>
                <p className={styles.itemTitle}>
                  {p.slug ? (
                    <Link href={routes.service(p.slug)} onFocus={() => setFocus(k)} onBlur={() => setFocus(null)}>
                      {p.label}
                    </Link>
                  ) : (
                    p.label
                  )}
                </p>
                <p className={styles.itemDoes}>{p.does}</p>
                <p className={styles.itemBoost}>
                  <span>Extra boost</span> {p.boost}
                </p>
              </li>
            );
          })}
          {cta && (
            <li className={`${styles.item} ${styles.itemCta}`}>
              <p className={styles.itemCtaTitle}>Wat levert het jouw woning op?</p>
              <p className={styles.itemDoes}>Voeg toestellen toe en zie je factuur zakken.</p>
              <CtaPill href={cta.href} variant={cta.variant ?? "ink"} size="sm">
                {cta.label}
              </CtaPill>
            </li>
          )}
        </ol>
      </div>
    );
  }

  // ───────────── builder ─────────────
  const lastPart = last ? PARTS[last] : null;
  const saved = BASELINE.factuur - current.factuur;
  return (
    <div id={id} ref={rootRef} className={`${styles.root} ${styles.builder} ${className ?? ""}`} data-inview={inView || undefined}>
      <div className={styles.chips} role="group" aria-label={BUILDER_COPY.hint}>
        <span className={styles.chipBase}>
          <FlameIcon className={styles.chipIcon} />
          {BUILDER_COPY.start}
        </span>
        {ADD_ORDER.map((k) => {
          const p = PARTS[k];
          const Icon = ICON[k];
          const pressed = on.has(k);
          return (
            <button key={k} type="button" className={styles.chip} aria-pressed={pressed} onClick={() => toggle(k)} onMouseEnter={() => setFocus(k)} onMouseLeave={() => setFocus(null)}>
              <Icon className={styles.chipIcon} />
              {p.chip ?? p.label}
              <span className={styles.chipMark} aria-hidden="true">
                {pressed ? <CheckIcon /> : <PlusIcon />}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.builderGrid}>
        <figure className={styles.figure}>
          {stage}
          <figcaption className={styles.srOnly}>{PHOTO.alt}</figcaption>
        </figure>

        <aside className={styles.panel}>
          <div className={styles.saving} aria-live="polite">
            <p className={styles.savingLabel}>{saved > 0 ? "Je bespaart per jaar" : "Je factuur vandaag"}</p>
            <p className={styles.savingValue} key={saved}>
              {saved > 0 ? eur(saved) : eur(BASELINE.factuur)}
            </p>
            {stepGain !== null && lastPart && (
              <p className={styles.step} key={`${last}-${stepGain}`}>
                <span className={styles.stepGain} data-neg={stepGain < 0 || undefined}>
                  {stepGain >= 0 ? "+" : "−"}
                  {eur(Math.abs(stepGain))}
                </span>{" "}
                door {lastPart.label.toLowerCase()}
              </p>
            )}
          </div>

          <div className={styles.what} key={last ?? "start"}>
            {lastPart ? (
              <>
                <p className={styles.whatTitle}>{lastPart.label}</p>
                <p className={styles.whatDoes}>{lastPart.does}</p>
                <p className={styles.itemBoost}>
                  <span>Extra boost</span> {lastPart.boost}
                </p>
                {lastPart.slug && (
                  <Link href={routes.service(lastPart.slug)} className={styles.whatLink}>
                    Meer over {lastPart.label.toLowerCase()} <ArrowUpRight className={styles.whatLinkIcon} />
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className={styles.whatTitle}>Vandaag</p>
                <p className={styles.whatDoes}>Je koopt alle stroom van het net en verwarmt op gas. {BUILDER_COPY.hint}.</p>
              </>
            )}
          </div>

          <div className={styles.bars}>
            <Bar label="Stroom van het net" value={current.netKwh} max={BAR_MAX.netKwh} unit="kWh" tone="net" />
            <Bar label="Gas" value={current.gasM3} max={BAR_MAX.gasM3} unit="m³" tone="gas" />
            <Bar label="Energiefactuur" value={current.factuur} max={BAR_MAX.factuur} unit="€" tone="eur" />
            {current.productie > 0 && (
              <p className={styles.selfUse}>
                Eigen productie {num(current.productie)} kWh · {current.zelfverbruik}% zelf verbruikt
              </p>
            )}
          </div>

          {cta && (
            <CtaPill href={cta.href} variant={cta.variant ?? "lime"} size="sm">
              {cta.label}
            </CtaPill>
          )}
        </aside>
      </div>

      <p className={styles.note}>{BUILDER_COPY.assumptions}</p>

      <details className={styles.alt}>
        <summary>Alle onderdelen in woorden</summary>
        <ul>
          {(["gas", "net", ...TEASER_ORDER] as PartKey[]).map((k) => (
            <li key={k}>
              <strong>{PARTS[k].label}:</strong> {PARTS[k].does} <em>Extra boost:</em> {PARTS[k].boost}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
