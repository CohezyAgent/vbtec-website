"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { navigation, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { ArrowUpRight, MailIcon, PhoneIcon, PlusIcon } from "@/components/ui/icons";
import styles from "./MobileMenu.module.css";

type Props = { open: boolean; onClose: () => void; pathname: string };

/**
 * Full-screen mobile menu (≤900px): deep green, accordions, sticky CTA row.
 * Focus trap, Esc to close, body scroll lock; closes on any link click.
 */
export default function MobileMenu({ open, onClose, pathname }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    body.dataset.menuOpen = "true";
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])') ?? []).filter(
        (el) => el.offsetParent !== null,
      );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      // The burger (outside the panel) is part of the trap so the menu can be closed.
      const burger = document.querySelector<HTMLElement>('[aria-controls="mobiel-menu"]');
      const all = burger ? [burger, ...els] : els;
      if (all.length === 0) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!all.includes(document.activeElement as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      delete body.dataset.menuOpen;
    };
  }, [open, onClose]);

  const isCurrent = (href: string) => pathname === href;
  let index = 0;
  const stagger = () => ({ "--m": index++ }) as CSSProperties;

  return (
    <div
      ref={ref}
      id="mobiel-menu"
      className={styles.overlay}
      data-open={open || undefined}
      hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <nav className={styles.inner} aria-label="Mobiel menu">
        <ul className={styles.list}>
          {navigation.main.map((item) =>
            item.kind === "link" ? (
              <li key={item.label} className={styles.item} style={stagger()}>
                <Link href={item.href} className={styles.top} onClick={onClose} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {isCurrent(item.href) && <span className={styles.dot} aria-hidden="true" />}
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label} className={styles.item} style={stagger()}>
                <details className={styles.acc}>
                  <summary className={styles.top}>
                    {item.match.some((m) => pathname.startsWith(m)) && <span className={styles.dot} aria-hidden="true" />}
                    {item.label}
                    <span className={styles.plus} aria-hidden="true">
                      <PlusIcon />
                    </span>
                  </summary>
                  <ul className={styles.sub}>
                    {item.columns.flatMap((c) => c.links).map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={styles.subLink} onClick={onClose} aria-current={isCurrent(l.href) ? "page" : undefined}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                    {item.footerLink && (
                      <li>
                        <Link href={item.footerLink.href} className={`${styles.subLink} ${styles.subAll}`} onClick={onClose}>
                          {item.footerLink.label}
                        </Link>
                      </li>
                    )}
                  </ul>
                </details>
              </li>
            ),
          )}
          <li className={styles.item} style={stagger()}>
            <Link href={routes.contact()} className={styles.top} onClick={onClose} aria-current={isCurrent(routes.contact()) ? "page" : undefined}>
              {isCurrent(routes.contact()) && <span className={styles.dot} aria-hidden="true" />}
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.bottom}>
        <a href={navigation.cta.href} className={styles.cta} onClick={onClose}>
          <span>{navigation.cta.label}</span>
          <span className={styles.ctaCircle} aria-hidden="true">
            <ArrowUpRight />
          </span>
        </a>
        <div className={styles.contactRow}>
          <a href={site.phoneHref} className={styles.ring}>
            <PhoneIcon className={styles.ringIcon} /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className={styles.ring}>
            <MailIcon className={styles.ringIcon} /> E-mail
          </a>
        </div>
      </div>
    </div>
  );
}
