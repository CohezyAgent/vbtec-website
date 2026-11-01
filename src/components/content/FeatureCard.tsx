import Link from "next/link";
import type { ReactNode } from "react";
import type { ImageInput } from "@/content/types";
import SmartImage from "@/components/ui/SmartImage";
import { PlaceholderBadge } from "@/components/ui/Bits";
import styles from "./Hub.module.css";

/** Builder 3 – large featured teaser (photo + dark gradient + big number), used on hubs. */
export default function FeatureCard({
  href,
  image,
  meta,
  title,
  number,
  unit,
  text,
  badge,
  headingAs: Hx = "h3",
}: {
  href: string;
  image: ImageInput;
  meta: ReactNode;
  title: string;
  number?: ReactNode;
  unit?: string;
  text?: string;
  badge?: string;
  headingAs?: "h2" | "h3";
}) {
  return (
    <Link href={href} className={styles.feature}>
      <SmartImage image={image} fill sizes="(max-width: 900px) 100vw, 90vw" className={styles.featureImg} />
      <span className={styles.featureArrow} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={styles.featureInner}>
        <span className={styles.featureMeta}>
          {badge && <PlaceholderBadge label={badge} tone="dark" />}
          {meta}
        </span>
        {number && (
          <span className={styles.featureNumber}>
            {number} {unit && <span className={styles.featureUnit}>{unit}</span>}
          </span>
        )}
        <Hx className={styles.featureTitle}>{title}</Hx>
        {text && <span className={styles.featureText}>{text}</span>}
      </span>
    </Link>
  );
}
