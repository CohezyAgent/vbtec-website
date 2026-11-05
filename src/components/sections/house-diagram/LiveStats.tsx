"use client";

// Glass "live" read-outs floating over the HouseDiagram stage. The numbers are an
// illustration of one typical household per scene (labelled as such), not FactValues.

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SceneKey } from "@/content/system";
import { useReducedMotion } from "./HouseScene";
import styles from "./HouseDiagram.module.css";

type Reading = { zon: number; huis: number; batterij: number; net: number; laadt: boolean };

const READINGS: Record<SceneKey, Reading> = {
  dag: { zon: 4.2, huis: 1.1, batterij: 72, net: -1.3, laadt: true },
  avond: { zon: 0, huis: 1.8, batterij: 54, net: 0.2, laadt: false },
  winter: { zon: 0.9, huis: 2.6, batterij: 38, net: 1.9, laadt: true },
  piek: { zon: 0, huis: 4.1, batterij: 31, net: 2.5, laadt: false },
};

/** Battery level (0–1) per scene, also drives the battery cell in the SVG. */
export const BATTERY_LEVEL: Record<SceneKey, number> = {
  dag: 0.72,
  avond: 0.54,
  winter: 0.38,
  piek: 0.31,
};

const nf1 = new Intl.NumberFormat("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 0 });

function useTween(target: Reading, reduced: boolean): Reading {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduced) {
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const e = 1 - (1 - p) ** 3;
      const mix = (k: "zon" | "huis" | "batterij" | "net") => a[k] + (target[k] - a[k]) * e;
      const next = { zon: mix("zon"), huis: mix("huis"), batterij: mix("batterij"), net: mix("net"), laadt: target.laadt };
      from.current = next;
      setShown(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);
  return reduced ? target : shown;
}

function Chip({ icon, label, value, note, tone }: { icon: ReactNode; label: string; value: string; note?: string; tone?: "good" | "warn" }) {
  return (
    <li className={styles.chip} data-tone={tone}>
      <span className={styles.chipIcon}>{icon}</span>
      <span className={styles.chipBody}>
        <span className={styles.chipValue}>{value}</span>
        <span className={styles.chipLabel}>
          {label}
          {note && <span className={styles.chipNote}> · {note}</span>}
        </span>
      </span>
    </li>
  );
}

export default function LiveStats({ scene }: { scene: SceneKey }) {
  const reduced = useReducedMotion();
  const r = useTween(READINGS[scene], reduced);
  const net = Math.abs(r.net) < 0.05 ? 0 : r.net;
  return (
    <div className={styles.stats} aria-hidden="true">
      <ul className={styles.chips}>
        <Chip icon={<SunIcon />} label="Zon" value={`${nf1.format(r.zon)} kW`} tone={r.zon > 0.5 ? "good" : undefined} />
        <Chip icon={<HomeIcon />} label="Verbruik" value={`${nf1.format(r.huis)} kW`} />
        <Chip icon={<BatteryIcon level={r.batterij / 100} />} label="Batterij" note={READINGS[scene].laadt ? "laadt" : "levert"} value={`${nf0.format(r.batterij)}%`} tone="good" />
        <Chip
          icon={<GridIcon />}
          label="Net"
          note={net < 0 ? "injectie" : net > 2.2 ? "piek begrensd" : "afname"}
          value={`${net > 0 ? "+" : net < 0 ? "−" : ""}${nf1.format(Math.abs(net))} kW`}
          tone={net > 2.2 ? "warn" : undefined}
        />
      </ul>
      <p className={styles.statsNote}>Illustratieve waarden</p>
    </div>
  );
}

const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function SunIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function BatteryIcon({ level }: { level: number }) {
  return (
    <svg {...svgProps}>
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M22 11v2" />
      <rect x="4" y="9" width={Math.max(0.5, 13 * level)} height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...svgProps}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}
