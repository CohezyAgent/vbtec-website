"use client";

import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";
import styles from "./motion.module.css";

type Props = {
  axis?: "x" | "y";
  /** start/end as fractions of the viewport (see useScrollProgress). */
  start?: number;
  end?: number;
  className?: string;
  /** Tone of the track/fill. */
  tone?: "light" | "dark";
};

/** A thin line that fills with scroll progress of its own box (scaleX/scaleY). */
export default function ScrollProgress({ axis = "x", start, end, className, tone = "light" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useScrollProgress(ref, { start, end });
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`${styles.progress} ${axis === "y" ? styles.progressY : styles.progressX} ${tone === "dark" ? styles.progressDark : ""} ${className ?? ""}`}
    >
      <span className={styles.progressFill} />
    </span>
  );
}
