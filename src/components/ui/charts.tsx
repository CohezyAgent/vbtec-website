import type { CSSProperties, ReactNode } from "react";
import { fact, formatFactValue, type FactKey } from "@/content/facts";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import { formatEuro, formatNumber } from "@/lib/format";
import { FactNote } from "./Facts";
import styles from "./Charts.module.css";

export type Series = "base" | "good" | "mid";
type Tone = "light" | "dark";

const valueOf = (v: FactKey | number) => (typeof v === "number" ? v : fact(v).value);
const keysOf = (vals: (FactKey | number)[]) => vals.filter((v): v is FactKey => typeof v === "string");

// ───────────────────────── BarChart ─────────────────────────
export type BarChartProps = {
  bars: { label: string; value: FactKey | number; display?: string; series: Series; note?: string }[];
  /** Appended to values, e.g. " c/kWh". */
  unit?: string;
  max?: number;
  tone?: Tone;
  caption?: string;
  /** Show a FactNote for the fact keys used (default true). */
  withNote?: boolean;
};

/** Horizontal bars (readable at every width), grow from the baseline on view. */
export function BarChart({ bars, unit = "", max, tone = "dark", caption, withNote = true }: BarChartProps) {
  const top = max ?? Math.max(...bars.map((b) => valueOf(b.value))) * 1.08;
  const keys = keysOf(bars.map((b) => b.value));
  return (
    <figure className={`${styles.figure} ${tone === "light" ? styles.light : ""}`}>
      <Reveal mode="custom" className={styles.bars}>
        {bars.map((b, i) => {
          const v = valueOf(b.value);
          const text = b.display ?? (typeof b.value === "string" ? formatFactValue(fact(b.value)) : formatNumber(v)) + unit;
          return (
            <div key={b.label} className={styles.barRow} style={{ "--i": i } as CSSProperties}>
              <span className={styles.barLabel}>{b.label}</span>
              <span className={styles.barTrack}>
                <span className={`${styles.bar} ${styles[`s_${b.series}`]}`} style={{ "--v": Math.min(1, v / top) } as CSSProperties} />
                <span className={styles.barValue}>{text}</span>
              </span>
              {b.note && <span className={styles.barNote}>{b.note}</span>}
            </div>
          );
        })}
      </Reveal>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      {withNote && keys.length > 0 && <FactNote keys={keys} tone={tone} className={styles.chartNote} />}
    </figure>
  );
}

// ───────────────────────── LineChart (CostChart) ─────────────────────────
export type LineChartProps = {
  series: { label: string; points: number[]; series: Series }[];
  xLabels: string[];
  /** Value formatting: "euro" (default) or "number". */
  format?: "euro" | "number";
  tone?: Tone;
  caption?: string;
  /** Accessible summary of what the chart shows. */
  summary: string;
  factKeys?: FactKey[];
};

/** Round up to a "nice" axis maximum (1, 2, 2.5, 5 × 10^n) so ticks read cleanly. */
function niceMax(v: number): number {
  if (!(v > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * p;
}

const W = 1000;
const H = 460;
const PAD = { l: 92, r: 24, t: 20, b: 48 };

/** Cumulative cost lines (20-year), drawn via stroke-dashoffset on view. Pure SVG. */
export function LineChart({ series, xLabels, format = "euro", tone = "dark", caption, summary, factKeys }: LineChartProps) {
  const n = Math.max(...series.map((s) => s.points.length));
  const maxY = niceMax(Math.max(...series.flatMap((s) => s.points)) * 1.02);
  const x = (i: number) => PAD.l + (i / Math.max(1, n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - v / maxY) * (H - PAD.t - PAD.b);
  const fmt = (v: number) => (format === "euro" ? formatEuro(Math.round(v)) : formatNumber(v));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxY);
  const labelEvery = Math.ceil(xLabels.length / 6);
  return (
    <figure className={`${styles.figure} ${tone === "light" ? styles.light : ""}`}>
      <ul className={styles.legend}>
        {series.map((s) => (
          <li key={s.label}>
            <span className={`${styles.swatch} ${styles[`s_${s.series}`]}`} aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>
      <Reveal mode="custom" className={styles.lineWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={summary}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className={styles.grid} />
              <text x={PAD.l - 12} y={y(t) + 5} textAnchor="end" className={styles.axis}>
                {fmt(t)}
              </text>
            </g>
          ))}
          {xLabels.map((l, i) =>
            i % labelEvery === 0 || i === xLabels.length - 1 ? (
              <text key={l + i} x={x(i)} y={H - 14} textAnchor="middle" className={styles.axis}>
                {l}
              </text>
            ) : null,
          )}
          {series.map((s, si) => {
            const d = s.points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
            const last = s.points.length - 1;
            return (
              <g key={s.label} style={{ "--i": si } as CSSProperties}>
                <path d={d} pathLength={1} className={`${styles.line} ${styles[`l_${s.series}`]}`} />
                <circle cx={x(last)} cy={y(s.points[last])} r={7} className={`${styles.dot} ${styles[`d_${s.series}`]}`} />
              </g>
            );
          })}
        </svg>
      </Reveal>
      <div className={styles.srTable}>
        <table>
          <caption>{summary}</caption>
          <thead>
            <tr>
              <th scope="col">Jaar</th>
              {series.map((s) => (
                <th key={s.label} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {xLabels.map((l, i) => (
              <tr key={l + i}>
                <th scope="row">{l}</th>
                {series.map((s) => (
                  <td key={s.label}>{s.points[i] !== undefined ? fmt(s.points[i]) : "–"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      {factKeys && factKeys.length > 0 && <FactNote keys={factKeys} tone={tone} className={styles.chartNote} />}
    </figure>
  );
}

/** Alias: the 20-year cost chart. */
export const CostChart = LineChart;

// ───────────────────────── StackedBar ─────────────────────────
export type StackedBarProps = {
  rows: { label: string; segments: { label: string; value: FactKey | number; series: Series }[]; total?: string }[];
  unit?: string;
  tone?: Tone;
  caption?: string;
};

/** Horizontal stacked bars, e.g. "voorbeeldgezin vóór / na". */
export function StackedBar({ rows, unit = "", tone = "dark", caption }: StackedBarProps) {
  const totals = rows.map((r) => r.segments.reduce((a, s) => a + valueOf(s.value), 0));
  const max = Math.max(...totals) || 1;
  const keys = keysOf(rows.flatMap((r) => r.segments.map((s) => s.value)));
  return (
    <figure className={`${styles.figure} ${tone === "light" ? styles.light : ""}`}>
      <Reveal mode="custom" className={styles.bars}>
        {rows.map((r, ri) => (
          <div key={r.label} className={styles.barRow} style={{ "--i": ri } as CSSProperties}>
            <span className={styles.barLabel}>{r.label}</span>
            <span className={styles.barTrack}>
              <span className={styles.stack} style={{ "--v": totals[ri] / max } as CSSProperties}>
                {r.segments.map((s) => (
                  <span
                    key={s.label}
                    className={`${styles.segment} ${styles[`s_${s.series}`]}`}
                    style={{ flexGrow: valueOf(s.value) }}
                    title={`${s.label}: ${formatNumber(valueOf(s.value))}${unit}`}
                  >
                    <span className={styles.segmentLabel}>{s.label}</span>
                  </span>
                ))}
              </span>
              <span className={styles.barValue}>{r.total ?? `${formatNumber(totals[ri])}${unit}`}</span>
            </span>
          </div>
        ))}
      </Reveal>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      {keys.length > 0 && <FactNote keys={keys} tone={tone} className={styles.chartNote} />}
    </figure>
  );
}

// ───────────────────────── StatRow ─────────────────────────
export type Stat = {
  /** Fact key (preferred) or a plain number (placeholder company metrics only). */
  k: FactKey | number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Replace the number with custom text (e.g. "6% vs 21%"). */
  display?: ReactNode;
};
export type StatRowProps = { stats: Stat[]; tone?: Tone; withNotes?: boolean };

/** 3–4 big numbers separated by hairlines; count-up on view; FactNote under each. */
export function StatRow({ stats, tone = "dark", withNotes = true }: StatRowProps) {
  // Long values ("€ 300–900", "€ 51,99–60,53") do not fit their column at full stat size:
  // scale the whole row together (so the numbers keep one rhythm) from the longest value.
  // Capacity = characters that fit one column at full size on the 1842 reference canvas.
  const longest = Math.max(
    ...stats.map((s) => {
      if (typeof s.display === "string") return s.display.length;
      const f = typeof s.k === "string" ? fact(s.k) : null;
      if (f?.range) return `${s.prefix ?? ""}${formatFactValue({ ...f, estimate: false })}${s.suffix ?? ""}`.length;
      return `${s.prefix ?? ""}${f ? f.value : s.k}${s.suffix ?? ""}`.length;
    }),
  );
  const capacity = stats.length >= 4 ? 6 : stats.length === 3 ? 8 : 12;
  const scale = Math.max(0.5, Math.min(1, capacity / longest));
  return (
    <Reveal
      mode="group"
      stagger={150}
      className={`${styles.stats} ${tone === "light" ? styles.light : ""}`}
      style={scale < 1 ? ({ "--stat-scale": scale.toFixed(2) } as CSSProperties) : undefined}
    >
      {stats.map((s, i) => {
        const f = typeof s.k === "string" ? fact(s.k) : null;
        const decimals = s.decimals ?? (f ? (Number.isInteger(f.value) ? 0 : String(f.value).split(".")[1]?.length ?? 1) : 0);
        return (
          <div key={i} className={styles.stat} data-reveal-item>
            <p className={styles.statNumber}>
              {s.display ??
                (f?.range ? (
                  <>
                    {f.estimate ? <span className={styles.ca}>ca. </span> : null}
                    {s.prefix}
                    {formatFactValue({ ...f, estimate: false })}
                    {s.suffix}
                  </>
                ) : (
                  <>
                    {f?.estimate ? <span className={styles.ca}>ca. </span> : null}
                    <CountUp to={f ? f.value : (s.k as number)} decimals={Math.min(decimals, 2)} prefix={s.prefix} suffix={s.suffix} />
                  </>
                ))}
            </p>
            <p className={styles.statLabel}>{s.label}</p>
            {withNotes && f && <FactNote keys={[f.key as FactKey]} variant="footnote" tone={tone} className={styles.statNote} />}
          </div>
        );
      })}
    </Reveal>
  );
}
