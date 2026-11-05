import type { CSSProperties, ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import { fact, formatFactValue } from "@/content/facts";
import type { Cta, ImageInput } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import SmartImage from "@/components/ui/SmartImage";
import ComparisonTable, { type ComparisonTableProps } from "@/components/ui/ComparisonTable";
import { FactNote, SourcesList } from "@/components/ui/Facts";
import { LineChart, StackedBar, type BarChartProps, type LineChartProps, type StackedBarProps, type Stat } from "@/components/ui/charts";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import { formatNumber } from "@/lib/format";
import styles from "./DataBand.module.css";

export type DataBandChart =
  | { type: "bar"; title?: string; props: BarChartProps }
  | { type: "line"; title?: string; props: LineChartProps }
  | { type: "stacked"; title?: string; props: StackedBarProps };

export type DataBandProps = {
  intro: IntroProps;
  /** "Wat je vaak hoort: '…'" line above the intro. */
  myth?: string;
  mode: "stats" | "chart" | "table" | "table+chart";
  stats?: Stat[];
  chart?: DataBandChart;
  table?: ComparisonTableProps;
  /** Sub-block, e.g. { title: "Premies, btw en regels", rows: [{ label, k }] }. */
  extra?: { title: string; rows: { label: string; k: FactKey; suffix?: string }[] };
  /** Honesty line: when the myth IS (partly) true. */
  whenTrue?: string;
  /** "Waarom nu?" – fact-backed rows only (years), shown as a timeline. */
  urgency?: { k: FactKey; label: string; suffix?: string }[];
  /** Fact keys listed in the "Bekijk aannames" drawer. */
  assumptions: FactKey[];
  /** Extra assumption text (e.g. "Vlakke prijzen, geen prijsstijging verondersteld"). */
  assumptionsNote?: ReactNode;
  cta?: Cta;
  /** Extra content under the chart (e.g. a FactNote or project link). */
  children?: ReactNode;
  /** Photo card next to the hero chart; carries the first stat. */
  image?: ImageInput;
  id?: string;
};

/** Topic-neutral default: following your energy in the app. Pass `image` for a fitting photo. */
const DEFAULT_IMAGE: ImageInput = {
  src: "/images/vbtec/app-smartphone-verbruik.jpg",
  alt: "Verbruik en opbrengst volgen in de app op een smartphone",
  width: 1920,
  height: 1280,
};

const valueOf = (v: FactKey | number) => (typeof v === "number" ? v : fact(v).value);

// ───────────────────────── Stat value (count-up, range-aware) ─────────────────────────
function StatValue({ s }: { s: Stat }) {
  if (s.display) return <>{s.display}</>;
  const f = typeof s.k === "string" ? fact(s.k) : null;
  if (f?.range) {
    return (
      <>
        {f.estimate && <span className={styles.ca}>ca.</span>}
        {s.prefix}
        {formatFactValue({ ...f, estimate: false })}
        {s.suffix}
      </>
    );
  }
  const to = f ? f.value : (s.k as number);
  const decimals = s.decimals ?? (Number.isInteger(to) ? 0 : Math.min(2, String(to).split(".")[1]?.length ?? 1));
  return (
    <>
      {f?.estimate && <span className={styles.ca}>ca.</span>}
      <CountUp to={to} decimals={decimals} prefix={s.prefix} suffix={s.suffix} />
    </>
  );
}

const statKey = (s: Stat): FactKey | null => (typeof s.k === "string" ? s.k : null);

/** Rough printed length of a stat, so long ranges ("€ 51,99–60,53") can run a size smaller. */
function statLength(s: Stat): number {
  if (typeof s.display === "string") return s.display.length;
  const f = typeof s.k === "string" ? fact(s.k) : null;
  const core = f ? formatFactValue({ ...f, estimate: false }) : String(s.k);
  return `${s.prefix ?? ""}${core}${s.suffix ?? ""}`.length;
}
const sizeOf = (s: Stat) => (statLength(s) > 11 ? "xs" : statLength(s) > 8 ? "s" : undefined);

// ───────────────────────── Hero comparison (bar charts) ─────────────────────────
function HeroBars({ title, props, children }: { title?: string; props: BarChartProps; children?: ReactNode }) {
  const { bars, unit = "", max, caption, withNote = true } = props;
  const values = bars.map((b) => valueOf(b.value));
  const top = max ?? Math.max(...values) * 1.04;
  const keys = bars.map((b) => b.value).filter((v): v is FactKey => typeof v === "string");
  const base = bars.find((b) => b.series === "base");
  const good = bars.find((b) => b.series === "good");
  let delta: string | null = null;
  if (base && good) {
    const vb = valueOf(base.value);
    const vg = valueOf(good.value);
    if (vg < vb && vb > 0) delta = `${Math.round((1 - vg / vb) * 100)}% goedkoper`;
    else if (vb > 0 && vg > vb) delta = `${formatNumber(Math.round((vg / vb) * 10) / 10)}× meer`;
  }
  return (
    <figure className={styles.heroFigure}>
      <div className={styles.heroHead}>
        {title && <figcaption className={styles.heroTitle}>{title}</figcaption>}
        {delta && <span className={styles.delta}>{delta}</span>}
      </div>
      <Reveal mode="custom" className={styles.heroBars}>
        {bars.map((b, i) => {
          const v = values[i];
          const text = b.display ?? (typeof b.value === "string" ? formatFactValue(fact(b.value)) : formatNumber(v)) + unit;
          return (
            <div key={b.label} className={`${styles.heroRow} ${styles[`hs_${b.series}`]}`} style={{ "--i": i, "--v": Math.min(1, v / top) } as CSSProperties}>
              <div className={styles.heroRowHead}>
                <span className={styles.heroLabel}>{b.label}</span>
                <span className={styles.heroValue}>{text}</span>
              </div>
              <span className={styles.heroTrack} aria-hidden="true">
                <span className={styles.heroFill} />
              </span>
              {b.note && <span className={styles.heroNote}>{b.note}</span>}
            </div>
          );
        })}
      </Reveal>
      {caption && <p className={styles.heroCaption}>{caption}</p>}
      {withNote && keys.length > 0 && <FactNote keys={keys} tone="dark" variant="footnote" className={styles.heroFact} />}
      {children && <div className={styles.heroExtra}>{children}</div>}
    </figure>
  );
}

// ───────────────────────── Lower bento packing ─────────────────────────
type Tile = { key: string; span: number; node: ReactNode };

/** Greedy 12-column packing: when a row is full, its leftover columns are shared out evenly. */
function pack(tiles: Tile[]): (Tile & { cols: number })[] {
  const rows: Tile[][] = [];
  let row: Tile[] = [];
  let used = 0;
  for (const t of tiles) {
    if (used + t.span > 12 && row.length) {
      rows.push(row);
      row = [];
      used = 0;
    }
    row.push(t);
    used += t.span;
  }
  if (row.length) rows.push(row);
  return rows.flatMap((r) => {
    const total = r.reduce((a, t) => a + t.span, 0);
    let left = 12;
    return r.map((t, i) => {
      const cols = i === r.length - 1 ? left : Math.round((t.span / total) * 12);
      left -= cols;
      return { ...t, cols };
    });
  });
}

/** Decorative accent stroke under a number (flat on purpose: it must not suggest a trend). */
const SPARK = "M2 19 L 118 19";

/**
 * Geometry H – proof & data, editorial bento on paper: a dark hero comparison card, a
 * real VB-TEC photo carrying the key number, varied stat cards, a receipt for premies/btw,
 * a timeline for "Waarom nu?", a lilac honesty note, and the assumptions in a drawer
 * (native <details>, so every source stays in the HTML).
 */
export default function DataBand({ intro, myth, mode, stats, chart, table, extra, whenTrue, urgency, assumptions, assumptionsNote, cta, children, image, id }: DataBandProps) {
  const titleId = id ? `${id}-title` : "databand-title";
  const showChart = (mode === "chart" || mode === "table+chart") && chart;
  const showTable = (mode === "table" || mode === "table+chart") && table;
  const photo = image ?? DEFAULT_IMAGE;
  const allStats = stats ?? [];
  const [photoStat, ...restStats] = allStats;
  const hasHeroChart = Boolean(showChart);

  const heroChart = showChart && (
    <Reveal className={`${styles.card} ${styles.hero}`}>
      {chart.type === "bar" ? (
        <HeroBars title={chart.title} props={chart.props}>
          {children}
        </HeroBars>
      ) : (
        <div className={styles.heroFigure}>
          {chart.title && <p className={styles.heroTitle}>{chart.title}</p>}
          {chart.type === "line" && <LineChart {...chart.props} tone="dark" />}
          {chart.type === "stacked" && <StackedBar {...chart.props} tone="dark" />}
          {children && <div className={styles.heroExtra}>{children}</div>}
        </div>
      )}
    </Reveal>
  );

  const photoCard = (
    <Reveal className={`${styles.card} ${styles.photo}`}>
      <SmartImage image={photo} fill sizes="(max-width: 900px) 100vw, 40vw" className={styles.photoImg} />
      {photoStat && (
        <div className={styles.photoStat}>
          <p className={styles.photoNumber} data-size={sizeOf(photoStat)}>
            <StatValue s={photoStat} />
          </p>
          <p className={styles.photoLabel}>{photoStat.label}</p>
          {statKey(photoStat) && <FactNote keys={[statKey(photoStat)!]} variant="footnote" tone="dark" className={styles.photoFact} />}
        </div>
      )}
    </Reveal>
  );

  const tiles: Tile[] = [];
  if (!hasHeroChart) tiles.push({ key: "photo", span: 5, node: photoCard });
  restStats.forEach((s, i) => {
    const variant = i % 2 === 0 ? styles.statSpark : styles.statMint;
    const k = statKey(s);
    tiles.push({
      key: `stat-${i}`,
      span: 4,
      node: (
        <Reveal className={`${styles.card} ${styles.stat} ${variant}`} delay={120 * (i + 1)}>
          <p className={styles.statNumber} data-size={sizeOf(s)}>
            <StatValue s={s} />
          </p>
          {i % 2 === 0 ? (
            <svg className={styles.spark} viewBox="0 0 120 38" aria-hidden="true" focusable="false">
              <path d={SPARK} pathLength={1} className={styles.sparkLine} />
              <circle cx="118" cy="19" r="4" className={styles.sparkDot} />
            </svg>
          ) : (
            <span className={styles.statRing} aria-hidden="true" />
          )}
          <p className={styles.statLabel}>{s.label}</p>
          {k && <FactNote keys={[k]} variant="footnote" className={styles.statFact} />}
        </Reveal>
      ),
    });
  });
  if (whenTrue) {
    tiles.push({
      key: "honest",
      span: 4,
      node: (
        <Reveal className={`${styles.card} ${styles.honest}`}>
          <span className={styles.honestMark} aria-hidden="true">
            “
          </span>
          <p className={styles.honestLabel}>Wanneer klopt het wél?</p>
          <p className={styles.honestText}>{whenTrue}</p>
        </Reveal>
      ),
    });
  }
  if (extra) {
    tiles.push({
      key: "receipt",
      span: 7,
      node: (
        <Reveal className={`${styles.card} ${styles.receipt}`}>
          <div className={styles.receiptHead}>
            <h3 className={styles.subTitle}>{extra.title}</h3>
            <span className={styles.receiptTag}>Vlaanderen · 2026</span>
          </div>
          <dl className={styles.receiptRows}>
            {extra.rows.map((r) => (
              <div key={r.label} className={styles.receiptRow}>
                <dt>{r.label}</dt>
                <span className={styles.leader} aria-hidden="true" />
                <dd>
                  {formatFactValue(fact(r.k))}
                  {r.suffix ?? ""}
                </dd>
              </div>
            ))}
          </dl>
          <FactNote keys={extra.rows.map((r) => r.k)} variant="footnote" className={styles.receiptFact} />
        </Reveal>
      ),
    });
  }
  if (urgency && urgency.length > 0) {
    const sorted = [...urgency].sort((a, b) => fact(a.k).value - fact(b.k).value);
    tiles.push({
      key: "timeline",
      span: 5,
      node: (
        <Reveal className={`${styles.card} ${styles.timeline}`}>
          <h3 className={styles.subTitle}>Waarom nu?</h3>
          <ol className={styles.tl}>
            {sorted.map((r, i) => (
              <li key={r.label} className={styles.tlItem} style={{ "--i": i } as CSSProperties}>
                <span className={styles.tlDot} aria-hidden="true" />
                <span className={styles.tlYear}>
                  {formatFactValue(fact(r.k), { useGrouping: false })}
                  {r.suffix ?? ""}
                </span>
                <span className={styles.tlLabel}>{r.label}</span>
              </li>
            ))}
          </ol>
          <FactNote keys={urgency.map((r) => r.k)} variant="footnote" tone="dark" className={styles.tlFact} />
        </Reveal>
      ),
    });
  }
  const packed = pack(tiles);

  return (
    <Section bg="W" id={id} labelledBy={titleId} className={styles.section}>
      <div className={styles.head}>
        {myth && (
          <p className={styles.myth}>
            <span className={styles.mythLabel}>Wat je vaak hoort</span>
            <span className={styles.mythText}>“{myth}”</span>
          </p>
        )}
        <span className={styles.indicatief}>Indicatief</span>
      </div>
      <SectionIntro {...intro} titleId={titleId} />

      <div className={styles.bento}>
        {hasHeroChart && (
          <>
            <div className={styles.cHero}>{heroChart}</div>
            <div className={styles.cPhoto}>{photoCard}</div>
          </>
        )}
        {showTable && (
          <Reveal className={`${styles.card} ${styles.tableCard} ${styles.cFull}`}>
            <ComparisonTable {...table} tone="light" />
          </Reveal>
        )}
        {children && !showChart && <div className={styles.cFull}>{children}</div>}
        {packed.map((t) => (
          <div key={t.key} className={styles.cell} data-wide={t.cols >= 8 || undefined} style={{ "--cols": t.cols } as CSSProperties}>
            {t.node}
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <details className={styles.assumptions}>
          <summary className={styles.assumptionsToggle}>
            <span className={styles.assumptionsIcon} aria-hidden="true">
              i
            </span>
            Bekijk aannames &amp; bronnen
            <span className={styles.assumptionsCount}>{assumptions.length}</span>
            <span className={styles.chevron} aria-hidden="true" />
          </summary>
          <div className={styles.assumptionsPanel}>
            {assumptionsNote && <div className={styles.assumptionsNote}>{assumptionsNote}</div>}
            <SourcesList keys={assumptions} title="Gebruikte cijfers" />
          </div>
        </details>
        {cta && (
          <div className={styles.cta}>
            <CtaPill href={cta.href} variant={cta.variant === "lime" || !cta.variant ? "ink" : cta.variant}>
              {cta.label}
            </CtaPill>
          </div>
        )}
      </div>
    </Section>
  );
}
