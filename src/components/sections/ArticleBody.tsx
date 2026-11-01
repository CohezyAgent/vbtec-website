import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Block } from "@/content/types";
import { fact, formatFactValue } from "@/content/facts";
import { slugify } from "@/lib/format";
import { faqPage } from "@/lib/schema";
import Accordion from "@/components/ui/Accordion";
import { Callout, InlineCta } from "@/components/ui/Content";
import { FactNote, KortAntwoord } from "@/components/ui/Facts";
import JsonLd from "@/components/ui/JsonLd";
import SmartImage from "@/components/ui/SmartImage";
import type { TocItem } from "./Prose";
import styles from "./Prose.module.css";

/** Inline markup: **bold** and [label](/href). Internal links use next/link. */
export function inline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={k++}>{m[1]}</strong>);
    else if (m[2] && m[3]) {
      const href = m[3];
      parts.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={k++} href={href}>
            {m[2]}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
            {m[2]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}

const headingId = (b: { text: string; id?: string }) => b.id ?? slugify(b.text);

/** TOC entries (every h2) for <Prose toc={…}>. */
export function buildToc(blocks: Block[]): TocItem[] {
  return blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: headingId(b), label: b.text }));
}

/**
 * Renders Block[] content (p, h2, h3, list, callout, stat, quote, image, faq, cta, table,
 * kortAntwoord) inside <Prose>. Inline FAQ blocks emit FAQPage JSON-LD unless `faqSchema={false}`
 * (use false when the page also renders a <Faq> section, to avoid two FAQPage objects).
 */
export default function ArticleBody({ blocks, faqSchema = true }: { blocks: Block[]; faqSchema?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "h2":
            return (
              <h2 key={i} id={headingId(b)}>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={headingId(b)}>
                {b.text}
              </h3>
            );
          case "list": {
            const L = b.ordered ? "ol" : "ul";
            return (
              <L key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </L>
            );
          }
          case "callout":
            return (
              <Callout key={i} kind={b.kind} title={b.title} factKeys={b.factKeys}>
                {(Array.isArray(b.text) ? b.text : [b.text]).map((t, j) => (
                  <p key={j}>{inline(t)}</p>
                ))}
              </Callout>
            );
          case "stat": {
            const f = fact(b.k);
            return (
              <figure key={i} className={styles.stat}>
                <p className={styles.statValue}>
                  {formatFactValue(f, b.format)} <span className={styles.statUnit}>{f.unit}</span>
                </p>
                <figcaption className={styles.statLabel}>{b.label}</figcaption>
                <FactNote keys={[b.k]} variant="footnote" />
              </figure>
            );
          }
          case "quote":
            return (
              <figure key={i} className={styles.quote}>
                <blockquote>
                  <p>{b.text}</p>
                </blockquote>
                {b.cite && <figcaption>{b.cite}</figcaption>}
              </figure>
            );
          case "image":
            return (
              <figure key={i} className={styles.figure}>
                <SmartImage image={b.image} ratio={b.ratio ?? "16/9"} sizes="(max-width: 900px) 100vw, 760px" />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case "faq":
            return (
              <div key={i} className={styles.faq}>
                {b.title && <h2 id={slugify(b.title)}>{b.title}</h2>}
                <Accordion
                  headingLevel="h3"
                  items={b.items.map((f) => ({
                    title: f.q,
                    body: (
                      <>
                        <p>{f.a}</p>
                        {f.aLong && <p>{f.aLong}</p>}
                      </>
                    ),
                  }))}
                />
                {faqSchema && b.items.length >= 3 && <JsonLd data={faqPage(b.items)} />}
              </div>
            );
          case "cta":
            return <InlineCta key={i} title={b.title} body={b.body} cta={b.cta} />;
          case "table":
            return (
              <div key={i} className={styles.tableWrap}>
                <table>
                  <caption>{b.caption}</caption>
                  <thead>
                    <tr>
                      {b.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((cell, ci) =>
                          ci === 0 ? (
                            <th key={ci} scope="row">
                              {inline(cell)}
                            </th>
                          ) : (
                            <td key={ci}>{inline(cell)}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "kortAntwoord":
            return (
              <div key={i} className={styles.kort}>
                <KortAntwoord factKeys={b.factKeys}>{inline(b.text)}</KortAntwoord>
              </div>
            );
        }
      })}
    </>
  );
}
