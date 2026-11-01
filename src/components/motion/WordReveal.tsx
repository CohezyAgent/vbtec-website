import { Fragment, type CSSProperties, type ElementType } from "react";
import Reveal from "./Reveal";
import styles from "./motion.module.css";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "blockquote";
  /** Words (or phrases) that get the lime-pale highlight sweep (lime text on dark). */
  highlight?: string[];
  /** Scroll-scrubbed "reading along" (CSS scroll-driven, falls back to on-view). */
  scrub?: boolean;
  tone?: "light" | "dark" | "lime";
  className?: string;
  id?: string;
};

const norm = (w: string) => w.toLowerCase().replace(/[.,!?;:'"‘’“”()…]/g, "");

/**
 * Heading that appears word by word (04 §4.2). Words are split on the server; the
 * client only triggers (Reveal mode="custom"). Natural word order keeps it readable
 * for screen readers and crawlers.
 */
export default function WordReveal({ text, as = "h2", highlight = [], scrub = false, tone = "light", className, id }: Props) {
  const words = text.split(/\s+/).filter(Boolean);
  const hlWords = new Set(highlight.flatMap((h) => h.split(/\s+/).map(norm)));
  const Tag = as as ElementType;
  return (
    <Reveal
      as={Tag}
      mode="custom"
      id={id}
      className={`${className ?? ""} ${scrub ? styles.scrub : ""} ${tone === "dark" ? styles.onDark : tone === "lime" ? styles.onLime : ""}`}
      style={{ "--n": words.length } as CSSProperties}
    >
      {words.map((word, i) => {
        const hl = hlWords.has(norm(word));
        return (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className={`${styles.word} ${hl ? styles.hl : ""}`} style={{ "--w": i } as CSSProperties}>
              {word}
            </span>
          </Fragment>
        );
      })}
    </Reveal>
  );
}
