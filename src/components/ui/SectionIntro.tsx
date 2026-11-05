import type { ReactNode } from "react";
import WordReveal from "@/components/motion/WordReveal";
import styles from "./Section.module.css";

export type IntroProps = {
  eyebrow?: string;
  title: ReactNode;
  /** Second part of a two-tone heading, shown muted on its own line (Elexys-style). */
  titleMuted?: ReactNode;
  /** Auto two-tone: split a string title after its first sentence (". ", "? ", ": ", " – "). */
  twoTone?: boolean;
  as?: "h1" | "h2" | "h3";
  /** split = 503u eyebrow column + heading (default); center = centred (geometry G). */
  align?: "split" | "center";
  tone?: "light" | "dark";
  lead?: ReactNode;
  /** Right-aligned extra (rail arrows, a link…). */
  aside?: ReactNode;
  titleId?: string;
  /** Word-by-word reveal; needs `title` to be a string. */
  wordReveal?: boolean;
  highlight?: string[];
  className?: string;
};

/** Small grey label above/left of a heading. */
export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return <p className={`${styles.eyebrow} ${tone === "dark" ? styles.onDark : ""} ${className ?? ""}`}>{children}</p>;
}

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  /** display (H1), statement (G), h2 (section), h3 (card), h4/lead */
  size?: "display" | "statement" | "h2" | "h3" | "h4";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Weight-400 Helvetica heading at a token size (never bold, sentence case). */
export function Heading({ as: Tag = "h2", size = "h2", tone = "light", id, className, children }: HeadingProps) {
  return (
    <Tag id={id} className={`${styles.heading} ${styles[`size_${size}`]} ${tone === "dark" ? styles.onDark : ""} ${className ?? ""}`}>
      {children}
    </Tag>
  );
}

/**
 * The shared intro row (04 §1.5): eyebrow in a fixed 503u column, heading right
 * (max 1140u). `align="center"` for statements.
 */
export default function SectionIntro({
  eyebrow,
  title: titleProp,
  titleMuted: titleMutedProp,
  twoTone,
  as = "h2",
  align = "split",
  tone = "light",
  lead,
  aside,
  titleId,
  wordReveal,
  highlight,
  className,
}: IntroProps) {
  let title = titleProp;
  let titleMuted = titleMutedProp;
  if (twoTone && !titleMuted && typeof titleProp === "string") {
    const m = titleProp.match(/^(.+?[.?:!]|.+? –)\s+(.+)$/);
    if (m) {
      title = m[1];
      titleMuted = m[2];
    }
  }
  const headingClass = `${styles.heading} ${styles.size_h2} ${tone === "dark" ? styles.onDark : ""}`;
  return (
    <div className={`${styles.intro} ${align === "center" ? styles.introCenter : ""} ${className ?? ""}`}>
      {eyebrow ? (
        <p className={`${styles.eyebrow} ${styles.introEyebrow} ${tone === "dark" ? styles.onDark : ""}`}>{eyebrow}</p>
      ) : (
        align === "split" && <span className={styles.introEyebrow} aria-hidden="true" />
      )}
      <div className={styles.introMain}>
        {wordReveal && typeof title === "string" && !titleMuted ? (
          <WordReveal as={as} id={titleId} text={title} highlight={highlight} tone={tone} className={headingClass} />
        ) : (
          (() => {
            const Tag = as;
            return (
              <Tag id={titleId} className={headingClass}>
                {title}
                {titleMuted && (
                  <>
                    {" "}
                    <span className={`${styles.titleMuted} ${tone === "dark" ? styles.onDark : ""}`}>{titleMuted}</span>
                  </>
                )}
              </Tag>
            );
          })()
        )}
        {lead && <div className={`${styles.lead} ${tone === "dark" ? styles.onDark : ""}`}>{lead}</div>}
      </div>
      {aside && <div className={styles.introAside}>{aside}</div>}
    </div>
  );
}
