import type { ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import { fact, formatFactValue } from "@/content/facts";
import type { Cta, ImageInput } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import SmartImage from "@/components/ui/SmartImage";
import ComparisonTable, { type ComparisonTableProps } from "@/components/ui/ComparisonTable";
import { FactNote, SourcesList } from "@/components/ui/Facts";
import { BarChart, LineChart, StackedBar, StatRow, type BarChartProps, type LineChartProps, type StackedBarProps, type Stat } from "@/components/ui/charts";
import Reveal from "@/components/motion/Reveal";
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
  /** "Waarom nu?" – fact-backed rows only. */
  urgency?: { k: FactKey; label: string; suffix?: string }[];
  /** Fact keys listed in the "Bekijk aannames" accordion. */
  assumptions: FactKey[];
  /** Extra assumption text (e.g. "Vlakke prijzen, geen prijsstijging verondersteld"). */
  assumptionsNote?: ReactNode;
  cta?: Cta;
  /** Extra content under the chart (e.g. a project link). */
  children?: ReactNode;
  /** Photo card beside the chart; carries the "Wanneer klopt het wél?" line when given. */
  image?: ImageInput;
  id?: string;
};

/**
 * Geometry H – proof & data. Deep-green band with white cards on it (stats, chart, rules),
 * an optional photo card, and the assumptions in a collapsed white drawer (native
 * <details>, so the sources stay in the HTML).
 */
export default function DataBand({ intro, myth, mode, stats, chart, table, extra, whenTrue, urgency, assumptions, assumptionsNote, cta, children, image, id }: DataBandProps) {
  const titleId = id ? `${id}-title` : "databand-title";
  const showChart = (mode === "chart" || mode === "table+chart") && chart;
  const showTable = (mode === "table" || mode === "table+chart") && table;
  const honestOnPhoto = Boolean(image && whenTrue);
  const honest = whenTrue && (
    <>
      <p className={styles.honestLabel}>Wanneer klopt het wél?</p>
      <p className={styles.honestText}>{whenTrue}</p>
    </>
  );
  return (
    <Section bg="D" id={id} labelledBy={titleId}>
      <div className={styles.head}>
        {myth && (
          <p className={styles.myth}>
            <span className={styles.mythLabel}>Wat je vaak hoort:</span> “{myth}”
          </p>
        )}
        <span className={styles.indicatief}>Indicatief</span>
      </div>
      <SectionIntro {...intro} tone="dark" titleId={titleId} />

      {(mode === "stats" || stats) && stats && stats.length > 0 && (
        <div className={`${styles.block} ${styles.card} ${styles.statsCard}`}>
          <StatRow stats={stats} tone="light" />
        </div>
      )}

      {showTable && (
        <Reveal className={`${styles.block} ${styles.card}`}>
          <ComparisonTable {...table} tone="light" />
        </Reveal>
      )}

      {(showChart || image) && (
        <div className={`${styles.block} ${image ? styles.duo : ""}`}>
          {showChart && (
            <Reveal className={styles.card}>
              {chart.title && <h3 className={styles.panelTitle}>{chart.title}</h3>}
              {chart.type === "bar" && <BarChart {...chart.props} tone="light" />}
              {chart.type === "line" && <LineChart {...chart.props} tone="light" />}
              {chart.type === "stacked" && <StackedBar {...chart.props} tone="light" />}
              {children && <div className={styles.cardExtra}>{children}</div>}
            </Reveal>
          )}
          {image && (
            <Reveal className={styles.photo}>
              <SmartImage image={image} fill sizes="(max-width: 900px) 100vw, 40vw" className={styles.photoImg} />
              {honestOnPhoto && <div className={styles.photoGlass}>{honest}</div>}
            </Reveal>
          )}
        </div>
      )}

      {children && !showChart && <div className={styles.block}>{children}</div>}

      {(extra || urgency || (whenTrue && !honestOnPhoto)) && (
        <div className={styles.lower}>
          {extra && (
            <div className={styles.card}>
              <h3 className={styles.subTitle}>{extra.title}</h3>
              <dl className={styles.rows}>
                {extra.rows.map((r) => (
                  <div key={r.label} className={styles.rowItem}>
                    <dt>{r.label}</dt>
                    <dd>
                      {formatFactValue(fact(r.k))}
                      {r.suffix ?? ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <FactNote keys={extra.rows.map((r) => r.k)} variant="footnote" />
            </div>
          )}
          {urgency && urgency.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.subTitle}>Waarom nu?</h3>
              <dl className={styles.rows}>
                {urgency.map((r) => (
                  <div key={r.label} className={styles.rowItem}>
                    <dt>{r.label}</dt>
                    <dd>
                      {formatFactValue(fact(r.k), { useGrouping: false })}
                      {r.suffix ?? ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <FactNote keys={urgency.map((r) => r.k)} variant="footnote" />
            </div>
          )}
          {whenTrue && !honestOnPhoto && <div className={styles.honest}>{honest}</div>}
        </div>
      )}

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
            <CtaPill href={cta.href} variant={cta.variant ?? "lime"}>
              {cta.label}
            </CtaPill>
          </div>
        )}
      </div>
    </Section>
  );
}
