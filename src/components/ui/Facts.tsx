import type { ReactNode } from "react";
import { fact, formatFactValue, type Fact, type FactKey } from "@/content/facts";
import { TRUSTLINE } from "@/content/site";
import { formatAsOf } from "@/lib/format";
import { InfoIcon } from "./icons";
import styles from "./Facts.module.css";

/** Short source name for notes; derived facts ("Afgeleid: …") show "eigen berekening VB-TEC". */
export const shortSource = (f: Fact) => (/^afgeleid/i.test(f.source) ? "eigen berekening VB-TEC" : f.source.split(" – ")[0].split(" (")[0]);

function uniqueFacts(keys: readonly FactKey[]): Fact[] {
  return [...new Set(keys)].map((k) => fact(k));
}

/**
 * "indicatief · bron: X, stand jan. 2026" (04 §1.8). Every number from facts.ts gets one.
 * pill (default, small rounded) · footnote (small text line) · inline (in running text).
 */
export function FactNote({
  keys,
  variant = "pill",
  tone = "light",
  className,
}: {
  keys: readonly FactKey[];
  variant?: "pill" | "footnote" | "inline";
  tone?: "light" | "dark";
  className?: string;
}) {
  const facts = uniqueFacts(keys);
  if (facts.length === 0) return null;
  const estimate = facts.some((f) => f.estimate);
  const latest = facts.map((f) => f.asOf).sort().at(-1)!;
  const sources = [...new Map(facts.map((f) => [shortSource(f), f])).values()];
  const Tag = variant === "inline" ? "span" : "p";
  return (
    <Tag className={`${styles.note} ${styles[`note_${variant}`]} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}>
      {variant === "pill" && <InfoIcon className={styles.noteIcon} />}
      <span>
        indicatief{estimate ? " (schatting)" : ""} · bron:{" "}
        {sources.map((f, i) => (
          <span key={f.key}>
            {i > 0 && ", "}
            <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.noteLink}>
              {shortSource(f)}
            </a>
          </span>
        ))}
        , stand {formatAsOf(latest)}
      </span>
    </Tag>
  );
}

/**
 * The only way to print a number from facts.ts (nl-BE). Shows a range when the fact has
 * one, prefixes "ca." for estimates. `withNote` appends an inline FactNote.
 */
export function FactValue({
  k,
  format,
  prefix,
  suffix,
  withNote,
  className,
}: {
  k: FactKey;
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  withNote?: boolean;
  className?: string;
}) {
  const f = fact(k);
  return (
    <span className={className}>
      {prefix}
      {formatFactValue(f, format)}
      {suffix}
      {withNote && (
        <>
          {" "}
          <FactNote keys={[k]} variant="inline" />
        </>
      )}
    </span>
  );
}

/** Plain-string value (for aria-labels, chart labels…). */
export function factText(k: FactKey, format?: Intl.NumberFormatOptions): string {
  return formatFactValue(fact(k), format);
}

/** "Kort antwoord" box (02 §0.2, AEO): grey card, Lexend label, 40–60 words. */
export function KortAntwoord({
  children,
  label = "Kort antwoord",
  factKeys,
  tone = "light",
  className,
}: {
  children: ReactNode;
  label?: string;
  factKeys?: FactKey[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <aside className={`${styles.kort} ${tone === "dark" ? styles.kortDark : ""} ${className ?? ""}`} aria-label={label}>
      <p className={styles.kortLabel}>{label}</p>
      <div className={styles.kortBody}>{children}</div>
      {factKeys && factKeys.length > 0 && <FactNote keys={factKeys} variant="footnote" tone={tone} className={styles.kortNote} />}
    </aside>
  );
}

/** "Gratis en vrijblijvend · Berekend door een ingenieur · Eerlijk, ook als het niet loont" */
export function TrustLine({ items = TRUSTLINE, tone = "light", className }: { items?: readonly string[]; tone?: "light" | "dark"; className?: string }) {
  return (
    <ul className={`${styles.trust} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** "Bronnen & aannames": dedupes keys, lists label, source (link), stand and note. */
export function SourcesList({ keys, title = "Bronnen & aannames", tone = "light", className }: { keys: readonly FactKey[]; title?: string; tone?: "light" | "dark"; className?: string }) {
  const facts = uniqueFacts(keys);
  if (facts.length === 0) return null;
  return (
    <div className={`${styles.sources} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}>
      <h3 className={styles.sourcesTitle}>{title}</h3>
      <ol className={styles.sourcesList}>
        {facts.map((f) => (
          <li key={f.key}>
            <span className={styles.sourcesLabel}>
              {f.label}: {formatFactValue(f)} {f.unit}
            </span>{" "}
            –{" "}
            <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer">
              {f.source}
            </a>
            , stand {formatAsOf(f.asOf)}
            {f.estimate ? " (schatting)" : ""}.{f.note ? ` ${f.note}` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
