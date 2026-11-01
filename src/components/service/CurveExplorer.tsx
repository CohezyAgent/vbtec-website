"use client";

import { useId, useState } from "react";
import styles from "./CurveExplorer.module.css";

// Signature widget for /diensten/zonnepanelen (DayCurve) and /diensten/laadpalen (PeakCurve)
// – 05 §3.1. Profiles are ILLUSTRATIVE shapes (no kWh/kW axis values); the numbers shown
// next to the chart come from facts.ts via the `captions` prop (server-formatted strings).

type Toggle = { key: string; label: string; caption: string };

export type CurveExplorerProps = {
  mode: "day" | "peak";
  toggles: Toggle[];
  /** Accessible summary of what the chart shows. */
  summary: string;
};

const W = 800;
const H = 300;
const PAD = { l: 16, r: 16, t: 24, b: 36 };

// ── Illustrative profiles (relative units) ────────────────────────────────
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const DAY_X = range(49).map((i) => i / 2); // 0..24h, half-hour steps
const bump = (h: number, c: number, w: number, a: number) => a * Math.exp(-((h - c) ** 2) / (2 * w * w));
const sun = (h: number) => (h < 6.5 || h > 20.5 ? 0 : 4.2 * Math.max(0, Math.sin((Math.PI * (h - 6.5)) / 14)) ** 1.6);
const homeBase = (h: number) => 0.35 + bump(h, 7.5, 0.7, 0.9) + bump(h, 18.8, 1.4, 1.7) + bump(h, 21.5, 0.9, 0.6);
const shifted = (h: number) => homeBase(h) + bump(h, 13, 1.6, 1.5); // boiler + warmtepomp at midday

function dayProfiles(key: string) {
  const prod = DAY_X.map(sun);
  const cons = DAY_X.map(key === "zonder" ? homeBase : shifted);
  const direct = cons.map((c, i) => Math.min(c, prod[i]));
  let battery = cons.map(() => 0);
  if (key === "batterij") {
    // Surplus stored during the day, released in the evening (capped).
    const surplus = prod.reduce((a, p, i) => a + Math.max(0, p - cons[i]), 0);
    let store = Math.min(surplus, 9);
    battery = cons.map((c, i) => {
      const h = DAY_X[i];
      const deficit = Math.max(0, c - prod[i]);
      if (h < 16 || store <= 0) return 0;
      const take = Math.min(deficit, store);
      store -= take;
      return take;
    });
  }
  return { x: DAY_X, prod, cons, direct, battery };
}

const PEAK_X = range(33).map((i) => 16 + i / 2); // 16h → 08h next day
const evening = (h: number) => 0.45 + bump(h, 18.7, 0.6, 2.6) + bump(h, 20.4, 0.5, 1.2) + (h > 23 ? -0.15 : 0);
const carDumb = (h: number) => (h >= 18.5 && h <= 22.5 ? 3.6 : 0);
const carSmart = (h: number) => (h >= 23.5 && h <= 30 ? 1.25 : 0);

function peakProfiles(key: string) {
  const base = PEAK_X.map(evening);
  const car = PEAK_X.map(key === "slim" ? carSmart : carDumb);
  const total = base.map((b, i) => b + car[i]);
  return { x: PEAK_X, base, car, total, peak: Math.max(...total) };
}

// ── SVG helpers ───────────────────────────────────────────────────────────
function scale(xs: number[], maxY: number) {
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const sx = (x: number) => PAD.l + ((x - x0) / (x1 - x0)) * (W - PAD.l - PAD.r);
  const sy = (y: number) => H - PAD.b - (y / maxY) * (H - PAD.t - PAD.b);
  return { sx, sy };
}
const line = (xs: number[], ys: number[], sx: (n: number) => number, sy: (n: number) => number) =>
  xs.map((x, i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(ys[i]).toFixed(1)}`).join("");
const area = (xs: number[], top: number[], bottom: number[], sx: (n: number) => number, sy: (n: number) => number) =>
  `${line(xs, top, sx, sy)}${xs
    .map((x, i) => i)
    .reverse()
    .map((i) => `L${sx(xs[i]).toFixed(1)} ${sy(bottom[i]).toFixed(1)}`)
    .join("")}Z`;

const hourLabel = (h: number) => `${String(Math.round(h) % 24).padStart(2, "0")}u`;

export default function CurveExplorer({ mode, toggles, summary }: CurveExplorerProps) {
  const [active, setActive] = useState(toggles[0]?.key);
  const id = useId();
  const current = toggles.find((t) => t.key === active) ?? toggles[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.toggles} role="group" aria-label={mode === "day" ? "Kies een situatie" : "Kies hoe je laadt"}>
        {toggles.map((t) => (
          <button key={t.key} type="button" className={styles.toggle} aria-pressed={t.key === active} onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <figure className={styles.figure}>
        {mode === "day" ? <DayChart k={current.key} /> : <PeakChart k={current.key} />}
        <figcaption className={styles.legend}>
          {mode === "day" ? (
            <>
              <span className={styles.lgSun}>Productie zonnepanelen</span>
              <span className={styles.lgUse}>Verbruik van je huis</span>
              <span className={styles.lgSelf}>Zelf verbruikt</span>
              <span className={styles.lgBat}>Uit de batterij</span>
            </>
          ) : (
            <>
              <span className={styles.lgUse}>Huis (koken, wassen …)</span>
              <span className={styles.lgCar}>Auto laden</span>
              <span className={styles.lgPeak}>Je maandpiek</span>
            </>
          )}
          <span className={styles.illus}>Illustratief profiel, geen meting</span>
        </figcaption>
      </figure>

      <p className={styles.result} aria-live="polite" id={`${id}-result`}>
        {current.caption}
      </p>
      <p className={styles.srOnly}>{summary}</p>
    </div>
  );
}

function DayChart({ k }: { k: string }) {
  const p = dayProfiles(k);
  const max = Math.max(...p.prod, ...p.cons) * 1.1;
  const { sx, sy } = scale(p.x, max);
  const zero = p.x.map(() => 0);
  const batTop = p.direct.map((d, i) => d + p.battery[i]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
      {[6, 12, 18].map((h) => (
        <g key={h}>
          <line x1={sx(h)} x2={sx(h)} y1={PAD.t} y2={H - PAD.b} className={styles.grid} />
          <text x={sx(h)} y={H - 12} className={styles.axis} textAnchor="middle">
            {hourLabel(h)}
          </text>
        </g>
      ))}
      <path d={area(p.x, p.prod, zero, sx, sy)} className={styles.sunArea} />
      <path key={`self-${k}`} d={area(p.x, p.direct, zero, sx, sy)} className={`${styles.selfArea} ${styles.morph}`} />
      {k === "batterij" && <path d={area(p.x, batTop, p.direct, sx, sy)} className={`${styles.batArea} ${styles.morph}`} />}
      <path d={line(p.x, p.prod, sx, sy)} className={styles.sunLine} />
      <path key={`use-${k}`} d={line(p.x, p.cons, sx, sy)} className={`${styles.useLine} ${styles.draw}`} pathLength={1} />
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className={styles.base} />
    </svg>
  );
}

function PeakChart({ k }: { k: string }) {
  const p = peakProfiles(k);
  const dumbPeak = peakProfiles("gewoon").peak;
  const max = dumbPeak * 1.15;
  const { sx, sy } = scale(p.x, max);
  const zero = p.x.map(() => 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
      {[18, 22, 26, 30].map((h) => (
        <g key={h}>
          <line x1={sx(h)} x2={sx(h)} y1={PAD.t} y2={H - PAD.b} className={styles.grid} />
          <text x={sx(h)} y={H - 12} className={styles.axis} textAnchor="middle">
            {hourLabel(h)}
          </text>
        </g>
      ))}
      <path d={area(p.x, p.base, zero, sx, sy)} className={styles.houseArea} />
      <path key={`car-${k}`} d={area(p.x, p.total, p.base, sx, sy)} className={`${styles.carArea} ${styles.morph}`} />
      <path d={line(p.x, p.total, sx, sy)} className={styles.totalLine} />
      {k !== "gewoon" && <line x1={PAD.l} x2={W - PAD.r} y1={sy(dumbPeak)} y2={sy(dumbPeak)} className={styles.ghostPeak} />}
      <g className={styles.peakGroup} style={{ transform: `translateY(${sy(p.peak) - sy(dumbPeak)}px)` }}>
        <line x1={PAD.l} x2={W - PAD.r} y1={sy(dumbPeak)} y2={sy(dumbPeak)} className={styles.peakLine} />
        <text x={W - PAD.r} y={sy(dumbPeak) - 8} textAnchor="end" className={styles.peakLabel}>
          maandpiek
        </text>
      </g>
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className={styles.base} />
    </svg>
  );
}
