import Link from "next/link";
import type { ReactNode } from "react";
import type { CtaVariant } from "@/content/types";
import { ArrowUpRight } from "./icons";
import styles from "./Cta.module.css";

type Common = {
  children: ReactNode;
  /** lime (in-section) · hero (split pill + circle) · white · ink · ghost-dark */
  variant?: CtaVariant;
  size?: "md" | "sm";
  className?: string;
  /** Full width on mobile (default true for submit buttons). */
  block?: boolean;
};

type LinkProps = Common & { href: string; prefetch?: boolean; type?: never; pending?: never; disabled?: never; onClick?: never };
type ButtonProps = Common & {
  href?: never;
  type: "button" | "submit";
  pending?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  prefetch?: never;
};

/**
 * The pill + arrow-circle CTA (04 §1.8). The circle rotates 45° on hover of the whole pill.
 * Hash links (e.g. "#berekening") render a plain <a>; the global LeadAnchor handler smooth-
 * scrolls and focuses the form heading. Renders a <button> when `type` is given.
 */
export default function CtaPill(props: LinkProps | ButtonProps) {
  const { children, variant = "lime", size = "md", className, block } = props;
  const cls = `${styles.pill} ${styles[variant.replace("-", "_")]} ${size === "sm" ? styles.sm : ""} ${block ? styles.block : ""} ${className ?? ""}`;
  const inner =
    variant === "hero" ? (
      <>
        <span className={styles.heroLabel}>{children}</span>
        <span className={styles.heroCircle} aria-hidden="true">
          <ArrowUpRight className={styles.arrow} />
        </span>
      </>
    ) : (
      <>
        <span className={styles.label}>{children}</span>
        <span className={styles.circle} aria-hidden="true">
          <ArrowUpRight className={styles.arrow} />
        </span>
      </>
    );

  if (props.type) {
    return (
      <button
        type={props.type}
        className={cls}
        disabled={props.disabled || props.pending}
        aria-busy={props.pending || undefined}
        data-pending={props.pending || undefined}
        onClick={props.onClick}
      >
        {inner}
      </button>
    );
  }
  const { href, prefetch } = props;
  if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetch} className={cls}>
      {inner}
    </Link>
  );
}

/** Ink text link with an underline sweep; optional arrow. */
export function TextLink({
  href,
  children,
  tone = "light",
  arrow = true,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  arrow?: boolean;
  className?: string;
}) {
  const cls = `${styles.textLink} ${tone === "dark" ? styles.textLinkDark : ""} ${className ?? ""}`;
  const inner = (
    <>
      <span className={styles.textLinkLabel}>{children}</span>
      {arrow && <ArrowUpRight className={styles.textLinkArrow} />}
    </>
  );
  if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
