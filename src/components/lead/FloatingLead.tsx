"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { WONINGTYPES } from "@/lib/lead-schema";
import { LEAD_ANCHOR, routes } from "@/lib/routes";
import { sendPrefill } from "./lead-bridge";
import { WONINGTYPE_ICONS } from "./LeadIcons";
import styles from "./FloatingLead.module.css";

const DISMISS_KEY = "vbtec-lead-float";

const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};
const writeDismissed = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* storage blocked: it just stays dismissed for this page view */
  }
};

/** "Nieuwbouw (in opbouw)" → "Nieuwbouw" for the compact chips. */
const short = (o: string) => o.replace(/\s*\(.*\)$/, "");

/**
 * Floating start of the lead form. After a good scroll (and not while #berekening is in view)
 * a small card shows step 1 bottom-left; on ≤900px it is a low bottom sheet that takes the
 * place of the sticky "Gratis berekening" bar. Picking an answer hands it to the full form
 * (lead-bridge) and opens it at step 2. Dismissible for the session.
 */
export default function FloatingLead({ suppressed, onShowChange }: { suppressed?: boolean; onShowChange?: (show: boolean) => void }) {
  const router = useRouter();
  const titleId = useId();
  const [show, setShow] = useState(false);
  // Only affects visibility, which starts hidden on server and client alike: no hydration gap.
  const [dismissed, setDismissed] = useState(() => typeof window !== "undefined" && readDismissed());

  useEffect(() => {
    if (dismissed) return;
    let leadVisible = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = Math.max(1400, window.innerHeight * 2);
      setShow(window.scrollY > threshold && !leadVisible);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const lead = document.getElementById(LEAD_ANCHOR);
    const io = lead
      ? new IntersectionObserver(([e]) => {
          leadVisible = e.isIntersecting;
          request();
        })
      : null;
    if (lead) io?.observe(lead);
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [dismissed]);

  const visible = show && !dismissed && !suppressed;

  useEffect(() => {
    onShowChange?.(visible);
  }, [visible, onShowChange]);

  const close = () => {
    writeDismissed();
    setDismissed(true);
  };

  const pick = (woningtype: string) => {
    close();
    const handled = sendPrefill({ woningtype });
    if (!handled) router.push(routes.contactLead());
  };

  return (
    <aside
      className={styles.float}
      data-show={visible || undefined}
      aria-labelledby={titleId}
      aria-hidden={!visible || undefined}
      inert={!visible}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          Gratis berekening
          <span className={styles.count}>· vraag 1 van 8</span>
        </p>
        <button type="button" className={styles.close} onClick={close} aria-label="Sluiten">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <p id={titleId} className={styles.title}>
        Wat voor woning heb je?
      </p>
      <div className={styles.options} role="group" aria-labelledby={titleId}>
        {WONINGTYPES.map((o) => {
          const Icon = WONINGTYPE_ICONS[o];
          return (
            <button key={o} type="button" className={styles.option} onClick={() => pick(o)}>
              {Icon && <Icon className={styles.icon} />}
              <span>{short(o)}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.note}>Ongeveer een minuut · gratis en vrijblijvend</p>
    </aside>
  );
}
