import type { ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import { fact, formatFactValue } from "@/content/facts";
import type { Cta } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import Accordion from "@/components/ui/Accordion";
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
  id?: string;
};

/** Geometry H – proof & data on deep green: stats, chart and/or table, assumptions. */
export default function DataBand({ intro, myth, mode, stats, chart, table, extra, whenTrue, urgency, assumptions, assumptionsNote, cta, children, id }: DataBandProps) {
  const titleId = id ? `${id}-title` : "databand-title";
  const showChart = (mode === "chart" || mode === "table+chart") && chart;
  const showTable = (mode === "table" || mode === "table+chart") && table;
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
        <div className={styles.block}>
          <StatRow stats={stats} tone="dark" />
        </div>
      )}

      {showTable && (
        <Reveal className={styles.block}>
          <ComparisonTable {...table} tone="dark" />
        </Reveal>
      )}

      {showChart && (
        <Reveal className={`${styles.block} ${styles.panel}`}>
          {chart.title && <h3 className={styles.panelTitle}>{chart.title}</h3>}
          {chart.type === "bar" && <BarChart {...chart.props} tone="dark" />}
          {chart.type === "line" && <LineChart {...chart.props} tone="dark" />}
          {chart.type === "stacked" && <StackedBar {...chart.props} tone="dark" />}
        </Reveal>
      )}

      {children && <div className={styles.block}>{children}</div>}

      {(extra || urgency || whenTrue) && (
        <div className={styles.lower}>
          {extra && (
            <div className={styles.extra}>
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
              <FactNote keys={extra.rows.map((r) => r.k)} tone="dark" variant="footnote" />
            </div>
          )}
          {urgency && urgency.length > 0 && (
            <div className={styles.extra}>
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
              <FactNote keys={urgency.map((r) => r.k)} tone="dark" variant="footnote" />
            </div>
          )}
          {whenTrue && (
            <div className={styles.honest}>
              <p className={styles.honestLabel}>Wanneer klopt het wél?</p>
              <p className={styles.honestText}>{whenTrue}</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.foot}>
        <Accordion
          tone="dark"
          className={styles.assumptions}
          items={[
            {
              title: "Bekijk aannames",
              body: (
                <>
                  {assumptionsNote && <div className={styles.assumptionsNote}>{assumptionsNote}</div>}
                  <SourcesList keys={assumptions} title="Gebruikte cijfers" tone="dark" />
                </>
              ),
            },
          ]}
        />
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
