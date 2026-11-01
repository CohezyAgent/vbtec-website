"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { navigation, site, type NavItem } from "@/content/site";
import { LEAD_ANCHOR, routes } from "@/lib/routes";
import { ArrowUpRight, ChevronDownIcon, VbtecMark } from "@/components/ui/icons";
import MobileMenu from "./MobileMenu";
import MobileStickyCta from "./MobileStickyCta";
import styles from "./Header.module.css";

export function SiteChromeWithPath() {
  const pathname = usePathname();
  return <SiteChrome pathname={pathname} />;
}

const isActive = (pathname: string, item: NavItem) =>
  item.kind === "link" ? pathname === item.href || pathname.startsWith(`${item.href}/`) : item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

/** Scrolls to the lead form and focuses its heading; falls back to /contact#berekening. */
function useLeadAnchor() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (href !== `#${LEAD_ANCHOR}`) return;
      e.preventDefault();
      const target = document.getElementById(LEAD_ANCHOR);
      if (!target) {
        router.push(routes.contactLead());
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      const heading = document.getElementById(`${LEAD_ANCHOR}-title`);
      window.setTimeout(() => heading?.focus({ preventScroll: true }), reduce ? 0 : 600);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
}

export default function SiteChrome({ pathname }: { pathname: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hoverTimer = useRef<number>(0);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useLeadAnchor();

  // Tone, scrolled & hidden state – written as data attributes (no re-render per scroll).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const probeY = Math.min(80, header.offsetHeight * 0.6);
      const stack = document.elementsFromPoint(window.innerWidth / 2, probeY);
      const section = stack.find((el) => !header.contains(el) && el.closest("[data-header-tone]"))?.closest<HTMLElement>("[data-header-tone]");
      header.dataset.tone = section?.dataset.headerTone === "dark" ? "dark" : "light";
      header.dataset.toned = "true";
      if (y > 24) header.dataset.scrolled = "true";
      else delete header.dataset.scrolled;
      const busy = header.contains(document.activeElement) || header.dataset.panel === "open" || document.body.dataset.menuOpen === "true";
      if (!busy && y > lastY + 4 && y > window.innerHeight * 0.6 + 120) header.dataset.hidden = "true";
      else if (y < lastY - 8 || y < 120 || busy) delete header.dataset.hidden;
      lastY = y;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    // Dynamic routes stream their content in after mount (Suspense): re-probe the tone when
    // the page body changes size, otherwise the header keeps the tone of the fallback
    // (white logo on a white hero).
    const ro = new ResizeObserver(request);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (openPanel) header.dataset.panel = "open";
    else delete header.dataset.panel;
  }, [openPanel]);

  // Close panels on Esc (focus back to trigger) and on outside click.
  useEffect(() => {
    if (!openPanel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const trigger = triggerRefs.current[openPanel];
        setOpenPanel(null);
        trigger?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openPanel]);

  const hoverOpen = (label: string) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenPanel(label), 150);
  };
  const hoverClose = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenPanel(null), 220);
  };
  const onNavBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenPanel(null);
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  }, []);

  const onContact = pathname === routes.contact();

  return (
    <>
      <a href="#inhoud" className={styles.skip}>
        Naar inhoud
      </a>
      <header ref={headerRef} className={styles.header} data-tone="dark" data-menu={menuOpen ? "open" : undefined}>
        <span className={styles.backing} aria-hidden="true" />
        <Link href={routes.home()} className={styles.logo} aria-label={`${site.name} – naar de startpagina`} onClick={() => setOpenPanel(null)}>
          <VbtecMark className={styles.logoIcon} />
          <span className={styles.wordmark}>VBTEC</span>
        </Link>

        <nav className={styles.nav} aria-label="Hoofdmenu" onBlur={onNavBlur}>
          <ul className={styles.navList}>
            {navigation.main.map((item) => {
              const active = isActive(pathname, item);
              if (item.kind === "link") {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={`${styles.navLink} ${active ? styles.navActive : ""}`} aria-current={active ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const open = openPanel === item.label;
              const panelId = `menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <li key={item.label} className={styles.navMenu} onMouseEnter={() => hoverOpen(item.label)} onMouseLeave={hoverClose}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[item.label] = el;
                    }}
                    type="button"
                    className={`${styles.navLink} ${active ? styles.navActive : ""}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenPanel(open ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDownIcon className={styles.chevron} />
                  </button>
                  <div id={panelId} className={`${styles.panel} ${item.columns.length > 1 ? styles.panelWide : ""}`} data-open={open || undefined} hidden={!open}>
                    <div className={styles.panelCols}>
                      {item.columns.map((col) => (
                        <div key={col.title} className={styles.panelCol}>
                          <p className={styles.panelTitle}>{col.title}</p>
                          <ul>
                            {col.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  className={styles.panelLink}
                                  aria-current={pathname === l.href ? "page" : undefined}
                                  onClick={() => setOpenPanel(null)}
                                >
                                  <span className={styles.panelLabel}>{l.label}</span>
                                  {l.description && <span className={styles.panelDesc}>{l.description}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.feature && (
                        <Link href={item.feature.href} className={styles.feature} onClick={() => setOpenPanel(null)}>
                          <span className={styles.featureTitle}>{item.feature.title}</span>
                          <span className={styles.featureBody}>{item.feature.body}</span>
                          <span className={styles.featureCta}>
                            {item.feature.cta} <ArrowUpRight className={styles.featureIcon} />
                          </span>
                        </Link>
                      )}
                    </div>
                    {item.footerLink && (
                      <Link href={item.footerLink.href} className={styles.panelFooter} onClick={() => setOpenPanel(null)}>
                        {item.footerLink.label} <ArrowUpRight className={styles.featureIcon} />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.right}>
          <a href={navigation.cta.href} className={styles.ctaGroup}>
            <span className={styles.ctaPill}>
              <span className={styles.ctaLong}>{navigation.cta.label}</span>
              <span className={styles.ctaShort}>{navigation.cta.shortLabel}</span>
            </span>
            <span className={styles.ctaArrow} aria-hidden="true">
              <ArrowUpRight className={styles.arrowIcon} />
            </span>
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobiel-menu"
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={styles.burgerLines} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
      {!onContact && <MobileStickyCta key={pathname} hidden={menuOpen} />}
    </>
  );
}
