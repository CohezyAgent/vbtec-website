import type { CSSProperties, ElementType, ReactNode } from "react";
import type { Bg } from "@/content/types";
import styles from "./Section.module.css";

export type SectionProps = {
  bg: Bg;
  id?: string;
  /** id of the heading that labels this section. */
  labelledBy?: string;
  ariaLabel?: string;
  /** Paper frame with 22u radius (default true for bg "I"). */
  framed?: boolean;
  /** flow = 142u/125u, screen = 110u/90u, none = 0. */
  pad?: "flow" | "screen" | "none";
  /** Wrap children in a side-margin Container (default true). */
  contained?: boolean;
  as?: ElementType;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const bgClass: Record<Bg, string> = { W: styles.bgW, D: styles.bgD, L: styles.bgL, I: styles.bgI };

/** Header tone derived from the background (05 §8): D/I → dark, W/L → light. */
export const toneOf = (bg: Bg) => (bg === "D" || bg === "I" ? "dark" : "light");

/**
 * Full-bleed section with background, padding and `data-header-tone` (read by the header).
 * bg "I" renders the paper frame + rounded inner panel; put an image inside with SmartImage `fill`.
 */
export default function Section({
  bg,
  id,
  labelledBy,
  ariaLabel,
  framed,
  pad = "flow",
  contained = true,
  as: Tag = "section",
  className,
  innerClassName,
  style,
  children,
}: SectionProps) {
  const isFramed = framed ?? bg === "I";
  const padClass = pad === "flow" ? styles.padFlow : pad === "screen" ? styles.padScreen : "";
  const content = contained && !isFramed ? <div className={`${styles.container} ${innerClassName ?? ""}`}>{children}</div> : children;
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      data-header-tone={toneOf(bg)}
      data-bg={bg}
      className={`${styles.section} ${bgClass[bg]} ${isFramed ? styles.framed : padClass} ${className ?? ""}`}
      style={style}
    >
      {isFramed ? (
        <div className={`${styles.frameInner} ${padClass} ${innerClassName ?? ""}`}>
          {contained ? <div className={styles.container}>{children}</div> : children}
        </div>
      ) : (
        content
      )}
    </Tag>
  );
}

/** Side margins (--side) wrapper. `narrow` = long-form column aligned to the 503u line. */
export function Container({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={`${styles.container} ${narrow ? styles.narrow : ""} ${className ?? ""}`}>{children}</div>;
}
