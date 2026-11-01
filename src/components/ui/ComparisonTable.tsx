import type { ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import { FactNote } from "./Facts";
import styles from "./ComparisonTable.module.css";

export type ComparisonTableProps = {
  /** Column headers for the options, e.g. ["Gasketel", "Warmtepomp"]. */
  columns: string[];
  rows: { label: string; cells: ReactNode[]; factKeys?: FactKey[] }[];
  /** 0-based index into `columns` to highlight (lime header). */
  highlightCol?: number;
  caption: string;
  tone?: "light" | "dark";
  /** Label of the first (row-label) column. */
  rowHeader?: string;
};

/**
 * Real <table> (citable for AEO). ≤900px it reflows to one card per row, each cell
 * labelled with its column (no horizontal scrolling).
 */
export default function ComparisonTable({ columns, rows, highlightCol, caption, tone = "dark", rowHeader = "" }: ComparisonTableProps) {
  const keys = rows.flatMap((r) => r.factKeys ?? []);
  return (
    <div className={`${styles.wrap} ${tone === "light" ? styles.light : ""}`}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.corner}>
              {rowHeader}
            </th>
            {columns.map((c, i) => (
              <th key={c} scope="col" className={i === highlightCol ? styles.hlHead : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.cells.map((cell, i) => (
                <td key={i} data-label={columns[i]} className={i === highlightCol ? styles.hlCell : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {keys.length > 0 && <FactNote keys={keys} tone={tone} className={styles.note} />}
    </div>
  );
}
