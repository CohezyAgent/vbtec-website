import Link from "next/link";
import type { ReactNode } from "react";
import type { IconComponent } from "./icons";
import { CheckIcon } from "./icons";
import styles from "./Bits.module.css";

/** Icon in a circle. pale (on white) · lime (on dark/photo) · ring (on dark) · glass (on photos). */
export function IconCircle({
  icon: Icon,
  fill = "pale",
  size = "md",
  className,
}: {
  icon: IconComponent;
  fill?: "pale" | "lime" | "ring" | "glass";
  size?: "lg" | "md" | "sm";
  className?: string;
}) {
  return (
    <span className={`${styles.iconCircle} ${styles[`fill_${fill}`]} ${styles[`ic_${size}`]} ${className ?? ""}`} aria-hidden="true">
      <Icon className={styles.iconCircleIcon} />
    </span>
  );
}

/** Pill label. grey (on #eee cards) · light (#eee on white) · ring (on dark) · lime. Figtree. */
export function Tag({
  children,
  tone = "light",
  href,
  size = "md",
  className,
}: {
  children: ReactNode;
  tone?: "grey" | "light" | "ring" | "lime";
  href?: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const cls = `${styles.tag} ${styles[`tag_${tone}`]} ${size === "sm" ? styles.tagSm : ""} ${href ? styles.tagLink : ""} ${className ?? ""}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <span className={cls}>{children}</span>;
}

/** Visible "Voorbeeldproject" / "Voorbeeldreviews" badge while data is placeholder. */
export function PlaceholderBadge({ label, tone = "light", className }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={`${styles.badge} ${tone === "dark" ? styles.badgeDark : ""} ${className ?? ""}`} title="Voorbeeldinhoud – nog geen echte klantgegevens">
      {label}
    </span>
  );
}

/** List with lime check circles (promises, deliverables). */
export function CheckList({ items, tone = "light", className }: { items: ReactNode[]; tone?: "light" | "dark"; className?: string }) {
  return (
    <ul className={`${styles.checks} ${tone === "dark" ? styles.checksDark : ""} ${className ?? ""}`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className={styles.check} aria-hidden="true">
            <CheckIcon />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
