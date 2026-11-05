"use client";

// HouseScene – the illustrated SVG behind HouseDiagram (viewBox 0 0 1000 640).
// A framed "cutaway" house under a sky that changes per scene (CSS on [data-scene] of the
// HouseDiagram root), with glowing energy flows and particles travelling along them.
// Component positions match the hotspot `pos` percentages in src/content/system.ts.

import { useId, useSyncExternalStore } from "react";
import type { ServiceSlug } from "@/content/registry";
import { FLOW_KIND, type FlowKey } from "@/content/system";
import styles from "./HouseDiagram.module.css";

export const FLOW_PATHS: Record<FlowKey, string> = {
  "zon-omvormer": "M420 250 C 460 300, 560 300, 588 345",
  "pvt-omvormer": "M640 250 C 628 290, 612 318, 606 345",
  "omvormer-huis": "M598 388 C 588 430, 560 470, 532 494",
  "omvormer-batterij": "M582 380 C 500 405, 380 430, 336 492",
  "omvormer-auto": "M580 384 C 470 425, 270 420, 222 478",
  "omvormer-warmtepomp": "M620 380 C 720 410, 830 455, 858 520",
  "omvormer-airco": "M578 360 C 540 348, 490 346, 462 346",
  "omvormer-net": "M622 352 C 680 340, 740 336, 780 340 L 952 176",
  "batterij-huis": "M346 516 C 400 522, 460 516, 506 504",
  "net-huis": "M952 176 L 780 340 C 700 400, 600 462, 534 500",
  "net-batterij": "M952 176 L 780 340 C 640 430, 420 472, 344 506",
  "net-auto": "M952 176 L 780 340 C 620 440, 330 452, 226 488",
  "net-warmtepomp": "M952 176 C 930 300, 900 440, 872 520",
  "pvt-warmtepomp": "M694 252 C 770 300, 850 380, 866 520",
  "warmtepomp-huis": "M840 552 C 780 566, 650 574, 300 570",
};
export const ALL_FLOWS = Object.keys(FLOW_PATHS) as FlowKey[];

/** Where each hotspot's glow sits in SVG units (matches pos % in system.ts). */
const GLOW: Record<ServiceSlug, { cx: number; cy: number; r: number }> = {
  zonnepanelen: { cx: 410, cy: 220, r: 96 },
  "pvt-panelen": { cx: 662, cy: 220, r: 96 },
  omvormers: { cx: 600, cy: 365, r: 44 },
  thuisbatterij: { cx: 328, cy: 516, r: 54 },
  laadpalen: { cx: 200, cy: 520, r: 70 },
  "lucht-water-warmtepomp": { cx: 868, cy: 546, r: 62 },
  "lucht-lucht-warmtepomp": { cx: 430, cy: 346, r: 46 },
};

/** Rough path length (M / C / L absolute only) → particle speed stays constant per px. */
function pathLength(d: string): number {
  const t = d.match(/[MCL]|-?\d+(?:\.\d+)?/g) ?? [];
  let i = 0;
  let x = 0;
  let y = 0;
  let len = 0;
  let cmd = "M";
  const n = () => Number(t[i++]);
  while (i < t.length) {
    if (/[MCL]/.test(t[i])) cmd = t[i++];
    if (cmd === "M") {
      x = n();
      y = n();
    } else if (cmd === "L") {
      const nx = n();
      const ny = n();
      len += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    } else {
      const p = [x, y, n(), n(), n(), n(), n(), n()];
      let px = x;
      let py = y;
      for (let s = 1; s <= 16; s++) {
        const u = s / 16;
        const a = (1 - u) ** 3;
        const b = 3 * (1 - u) ** 2 * u;
        const c = 3 * (1 - u) * u * u;
        const e = u ** 3;
        const qx = a * p[0] + b * p[2] + c * p[4] + e * p[6];
        const qy = a * p[1] + b * p[3] + c * p[5] + e * p[7];
        len += Math.hypot(qx - px, qy - py);
        px = qx;
        py = qy;
      }
      x = p[6];
      y = p[7];
    }
  }
  return len;
}
const FLOW_DUR = Object.fromEntries(ALL_FLOWS.map((f) => [f, Math.max(1.6, pathLength(FLOW_PATHS[f]) / 150)])) as Record<FlowKey, number>;

// Reduced-motion as an external store: the server snapshot renders without particles.
const mq = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(mq).matches, () => true);
}

// Deterministic decoration.
const STARS = [
  [60, 40, 1.6], [180, 70, 1.2], [260, 30, 1.8], [330, 92, 1.1], [420, 46, 1.5], [505, 22, 1.2], [560, 84, 1.7],
  [640, 40, 1.1], [720, 70, 1.6], [790, 28, 1.3], [860, 96, 1.2], [905, 48, 1.8], [470, 110, 1], [230, 118, 1.3],
] as const;
const FLAKES = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 97) % 1000,
  r: 1.6 + ((i * 7) % 5) * 0.5,
  d: 7 + ((i * 13) % 9),
  delay: -((i * 1.37) % 12),
}));

type Props = {
  activeFlows: Set<FlowKey>;
  lowFlows: Set<FlowKey>;
  glow: Set<ServiceSlug>;
  focusFlows: Set<FlowKey> | null;
  tone: "light" | "dark";
};

export default function HouseScene({ activeFlows, lowFlows, glow, focusFlows, tone }: Props) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const u = (n: string) => `url(#${gid}-${n})`;
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 1000 640" className={styles.svg} aria-hidden="true" focusable="false" data-tone={tone}>
      <defs>
        <clipPath id={`${gid}-card`}>
          <rect width="1000" height="640" rx="30" />
        </clipPath>
        <clipPath id={`${gid}-panels`}>
          <path d="M352 160 L 500 160 L 492 282 L 286 282 Z M556 160 L 704 160 L 774 282 L 566 282 Z" />
        </clipPath>

        {/* skies */}
        <linearGradient id={`${gid}-skyDag`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3c4" />
          <stop offset="0.55" stopColor="#d6f0e8" />
          <stop offset="1" stopColor="#f4fbf8" />
        </linearGradient>
        <linearGradient id={`${gid}-skyAvond`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3c" />
          <stop offset="0.5" stopColor="#4a3a72" />
          <stop offset="0.85" stopColor="#c98a9a" />
          <stop offset="1" stopColor="#f0b58a" />
        </linearGradient>
        <linearGradient id={`${gid}-skyWinter`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb6c9" />
          <stop offset="0.6" stopColor="#dce6ee" />
          <stop offset="1" stopColor="#f2f6f9" />
        </linearGradient>
        <linearGradient id={`${gid}-skyPiek`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1420" />
          <stop offset="0.4" stopColor="#3b1838" />
          <stop offset="0.72" stopColor="#a3404a" />
          <stop offset="1" stopColor="#e07a5f" />
        </linearGradient>

        <radialGradient id={`${gid}-sunHalo`}>
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffe08a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-sunCore`} cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="1" stopColor="#ffd25a" />
        </radialGradient>
        <radialGradient id={`${gid}-moonHalo`}>
          <stop offset="0" stopColor="#efd9ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#efd9ff" stopOpacity="0" />
        </radialGradient>

        {/* landscape */}
        <linearGradient id={`${gid}-hillFar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d6c8" />
          <stop offset="1" stopColor="#cfe8df" />
        </linearGradient>
        <linearGradient id={`${gid}-hillNear`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fbfa9" />
          <stop offset="1" stopColor="#a6d3c3" />
        </linearGradient>
        <linearGradient id={`${gid}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa58c" />
          <stop offset="1" stopColor="#3f8a72" />
        </linearGradient>
        <radialGradient id={`${gid}-shadow`}>
          <stop offset="0" stopColor="#05231d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#05231d" stopOpacity="0" />
        </radialGradient>

        {/* house */}
        <linearGradient id={`${gid}-wall`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6ece9" />
        </linearGradient>
        <linearGradient id={`${gid}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d6d1" />
          <stop offset="1" stopColor="#b3c4be" />
        </linearGradient>
        <linearGradient id={`${gid}-interior`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f2ea" />
          <stop offset="1" stopColor="#ece4d8" />
        </linearGradient>
        <linearGradient id={`${gid}-warm`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9f4a" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`${gid}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f4a45" />
          <stop offset="1" stopColor="#16302b" />
        </linearGradient>
        <linearGradient id={`${gid}-pv`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#2a6f8c" />
          <stop offset="0.5" stopColor="#123f57" />
          <stop offset="1" stopColor="#0a2a3c" />
        </linearGradient>
        <linearGradient id={`${gid}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e3f3f6" />
          <stop offset="1" stopColor="#9cc6d2" />
        </linearGradient>
        <linearGradient id={`${gid}-door`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f6b5a" />
          <stop offset="1" stopColor="#0b4a3f" />
        </linearGradient>
        <linearGradient id={`${gid}-device`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e9e7" />
        </linearGradient>
        <linearGradient id={`${gid}-cell`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#22a68f" />
          <stop offset="1" stopColor="#7fe3c9" />
        </linearGradient>
        <linearGradient id={`${gid}-car`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a8a74" />
          <stop offset="1" stopColor="#0b4a3f" />
        </linearGradient>
        <linearGradient id={`${gid}-tank`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a6a" />
          <stop offset="1" stopColor="#ffd2a8" />
        </linearGradient>

        {/* flows */}
        <radialGradient id={`${gid}-p-stroom`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="var(--hd-stroom)" />
          <stop offset="1" stopColor="var(--hd-stroom)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-p-warmte`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="var(--hd-warmte)" />
          <stop offset="1" stopColor="var(--hd-warmte)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-p-net`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="var(--hd-net)" />
          <stop offset="1" stopColor="var(--hd-net)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-focus`}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#7fe3c9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7fe3c9" stopOpacity="0" />
        </radialGradient>

        <filter id={`${gid}-soft`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#05231d" floodOpacity="0.2" />
        </filter>
        <filter id={`${gid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${gid}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <g clipPath={u("card")} className={styles.scene}>
        {/* ── sky ── */}
        <rect width="1000" height="640" fill={u("skyDag")} className={`${styles.sky} ${styles.skyDag}`} />
        <rect width="1000" height="640" fill={u("skyAvond")} className={`${styles.sky} ${styles.skyAvond}`} />
        <rect width="1000" height="640" fill={u("skyWinter")} className={`${styles.sky} ${styles.skyWinter}`} />
        <rect width="1000" height="640" fill={u("skyPiek")} className={`${styles.sky} ${styles.skyPiek}`} />

        <g className={styles.stars}>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} style={{ animationDelay: `${(i % 5) * 0.7}s` }} />
          ))}
        </g>

        <g className={styles.moon}>
          <circle cx="150" cy="104" r="80" fill={u("moonHalo")} />
          <path d="M158 70 a40 40 0 1 0 30 62 a32 32 0 1 1 -30 -62z" fill="#f4ecff" />
        </g>
        <g className={styles.sun}>
          <circle cx="150" cy="110" r="120" fill={u("sunHalo")} className={styles.sunHalo} />
          <circle cx="150" cy="110" r="34" fill={u("sunCore")} />
        </g>

        <g className={styles.clouds}>
          <path className={styles.cloudA} d="M560 92 q 10 -26 38 -20 q 14 -22 42 -10 q 28 -6 30 20 q 22 4 16 22 h -138 q -12 -6 12 -12 z" />
          <path className={styles.cloudB} d="M300 150 q 8 -20 30 -16 q 12 -18 34 -8 q 22 -4 24 16 q 18 4 12 18 h -110 q -10 -5 10 -10 z" />
        </g>

        {/* ── landscape ── */}
        <path d="M0 470 C 120 420, 230 440, 330 455 S 560 400, 700 430 S 900 410, 1000 440 L 1000 640 L 0 640 Z" fill={u("hillFar")} />
        <path d="M0 520 C 140 488, 260 508, 380 515 S 640 480, 780 500 S 930 492, 1000 505 L 1000 640 L 0 640 Z" fill={u("hillNear")} />
        <rect x="0" y="578" width="1000" height="62" fill={u("ground")} />
        <rect x="0" y="578" width="1000" height="2" fill="#ffffff" opacity="0.25" />

        {/* tree behind the car */}
        <g className={styles.tree}>
          <rect x="116" y="430" width="8" height="90" rx="3" fill="#3d5a4f" />
          <circle cx="120" cy="420" r="44" fill="#2f8a6f" />
          <circle cx="98" cy="440" r="30" fill="#3a9a7d" />
          <circle cx="142" cy="404" r="26" fill="#4fb08f" opacity="0.9" />
        </g>

        {/* grid pylon + wire */}
        <g className={styles.pylon}>
          <path d="M952 176 L 930 580 M952 176 L 974 580 M936 300 L 968 300 M940 420 L 962 420 M934 176 L 970 176 M938 300 L 962 420 M966 300 L 942 420 M944 190 L 960 300" />
          <path d="M792 338 L 940 180" className={styles.wire} />
        </g>

        {/* ── house ── */}
        <ellipse cx="540" cy="582" rx="330" ry="22" fill={u("shadow")} />
        <g className={styles.house}>
          <path d="M780 300 L 802 288 L 802 568 L 780 580 Z" fill={u("side")} />
          <rect x="280" y="300" width="500" height="280" fill={u("wall")} />
          <rect x="296" y="316" width="468" height="248" fill={u("interior")} />
          <rect x="296" y="316" width="468" height="248" fill={u("warm")} className={styles.interiorWarm} />
          <rect x="296" y="436" width="468" height="9" fill="#d7dfdb" />
          <rect x="296" y="560" width="468" height="6" fill="#d7dfdb" />
          {/* skirting + wall seams for depth */}
          <path d="M296 316 L 764 316" stroke="#05231d" strokeOpacity="0.08" strokeWidth="6" />

          {/* roof */}
          <path d="M700 130 L 724 118 L 834 290 L 810 300 Z" fill="#132925" />
          <rect x="520" y="96" width="26" height="50" rx="2" fill="#2b4540" />
          <rect x="516" y="92" width="34" height="8" rx="2" fill="#1d3531" />
          <path d="M250 300 L 360 130 L 700 130 L 810 300 Z" fill={u("roof")} />
          <path d="M360 130 L 700 130" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
          <rect x="240" y="296" width="580" height="10" rx="4" fill="#0d221f" />
          <path d="M366 136 L 694 136 L 694 148 L 360 148 Z" fill="#ffffff" className={styles.roofSnow} />
          <path d="M244 296 L 816 296 L 816 300 L 244 300 Z" fill="#ffffff" className={styles.roofSnow} />

          {/* PV (left) + PVT (right) */}
          <g>
            <path d="M352 160 L 500 160 L 492 282 L 286 282 Z" fill={u("pv")} stroke="#9fb9bd" strokeWidth="2" />
            <path d="M556 160 L 704 160 L 774 282 L 566 282 Z" fill={u("pv")} stroke="#9fb9bd" strokeWidth="2" />
            <path
              d="M339 201 L 497 201 M321 242 L 494 242 M401 160 L 355 282 M450 160 L 424 282 M558 201 L 728 201 M562 242 L 751 242 M605 160 L 636 282 M655 160 L 706 282"
              className={styles.panelGrid}
            />
            <g clipPath={u("panels")}>
              <rect x="-160" y="120" width="140" height="200" fill={u("sweep")} className={styles.sweep} />
            </g>
            <path d="M566 290 L 774 290" className={styles.pvtPipe} />
          </g>

          {/* windows + door */}
          <rect x="310" y="330" width="56" height="70" rx="5" fill={u("glass")} stroke="#ffffff" strokeWidth="3" />
          <rect x="690" y="330" width="60" height="70" rx="5" fill={u("glass")} stroke="#ffffff" strokeWidth="3" />
          <path d="M318 340 L 340 340 L 322 360 Z M698 340 L 722 340 L 702 362 Z" fill="#ffffff" opacity="0.55" />
          <rect x="600" y="470" width="58" height="110" rx="5" fill={u("door")} />
          <circle cx="648" cy="526" r="3" fill="#efd9ff" />

          {/* household: lamp + table + sofa */}
          <path d="M520 445 L 520 468" stroke="#3d5a4f" strokeWidth="2" />
          <path d="M506 468 L 534 468 L 528 482 L 512 482 Z" fill="#0f6b5a" />
          <path d="M470 545 L 560 545" stroke="#7a5a3e" strokeWidth="5" strokeLinecap="round" />
          <path d="M480 545 L 480 562 M550 545 L 550 562" stroke="#7a5a3e" strokeWidth="3" />
        </g>

        {/* ── devices ── */}
        <g filter={u("soft")}>
          {/* airco indoor unit */}
          <rect x="398" y="334" width="66" height="22" rx="7" fill={u("device")} />
          <path d="M404 350 L 458 350" stroke="#9fb3ad" strokeWidth="2" strokeLinecap="round" />
          {/* inverter */}
          <rect x="582" y="340" width="38" height="50" rx="6" fill={u("device")} />
          <rect x="589" y="348" width="24" height="12" rx="2" fill="#0e2a25" />
          <circle cx="601" cy="378" r="3" className={styles.led} />
          {/* battery */}
          <rect x="304" y="474" width="48" height="90" rx="9" fill={u("device")} />
          <rect x="313" y="486" width="30" height="68" rx="5" fill="#0e2a25" />
          <rect x="315" y="488" width="26" height="64" rx="4" fill={u("cell")} className={styles.batteryLevel} />
          <path d="M330 502 l -6 12 h 6 l -4 12 l 10 -15 h -6 l 4 -9 z" fill="#ffffff" className={styles.bolt} />
          {/* boiler */}
          <rect x="704" y="470" width="40" height="92" rx="18" fill={u("device")} />
          <rect x="716" y="486" width="16" height="62" rx="8" fill={u("tank")} className={styles.tank} />
          {/* charge point + cable */}
          <rect x="206" y="470" width="20" height="108" rx="5" fill="#0e2a25" />
          <rect x="210" y="482" width="12" height="16" rx="3" className={styles.chargeLed} />
          <path d="M216 512 C 214 540, 200 548, 192 544" stroke="#0e2a25" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* car */}
          <path
            d="M36 566 L 42 534 Q 50 514 76 512 L 138 512 Q 160 512 174 530 L 194 540 Q 204 545 204 556 L 204 566 Z"
            fill={u("car")}
          />
          <path d="M66 530 Q 72 520 86 519 L 132 519 Q 146 519 156 530 Z" fill="#cfe9ec" opacity="0.9" />
          <path d="M108 519 L 108 530" stroke="#0b4a3f" strokeWidth="3" />
          <rect x="190" y="546" width="12" height="5" rx="2" fill="#fff6c8" />
          <circle cx="78" cy="568" r="14" fill="#0e1f1c" />
          <circle cx="78" cy="568" r="6" fill="#b9c7c3" />
          <circle cx="166" cy="568" r="14" fill="#0e1f1c" />
          <circle cx="166" cy="568" r="6" fill="#b9c7c3" />
          {/* heat pump outdoor unit */}
          <rect x="816" y="506" width="104" height="74" rx="10" fill={u("device")} />
          <circle cx="852" cy="543" r="25" fill="#0e2a25" />
          <g className={styles.fanBlades}>
            <path d="M852 543 C 852 528, 860 522, 866 526 C 862 534, 858 540, 852 543 Z M852 543 C 866 548, 868 558, 862 562 C 856 556, 852 550, 852 543 Z M852 543 C 840 552, 832 548, 832 540 C 840 540, 846 541, 852 543 Z" fill="#9fb3ad" />
          </g>
          <circle cx="852" cy="543" r="4" fill="#d7dfdb" />
          <path d="M886 522 L 908 522 M886 534 L 908 534 M886 546 L 908 546 M886 558 L 908 558" stroke="#b3c4be" strokeWidth="3" strokeLinecap="round" />
          {/* meter */}
          <rect x="770" y="324" width="24" height="30" rx="4" fill={u("device")} />
          <rect x="774" y="330" width="16" height="7" rx="1" fill="#0e2a25" />
        </g>

        {/* ── night / frost light ── */}
        <path
          d="M0 0 H1000 V640 H0 Z M296 316 H764 V564 H296 Z"
          fillRule="evenodd"
          fill="#0a1430"
          className={styles.night}
        />
        <rect width="1000" height="640" fill="#e8f0f6" className={styles.frost} />

        <g className={styles.lights}>
          <rect x="304" y="324" width="68" height="82" rx="12" fill="#ffc46b" opacity="0.55" filter={u("bloom")} />
          <rect x="684" y="324" width="72" height="82" rx="12" fill="#ffc46b" opacity="0.55" filter={u("bloom")} />
          <rect x="310" y="330" width="56" height="70" rx="5" fill="#ffd68f" />
          <rect x="690" y="330" width="60" height="70" rx="5" fill="#ffd68f" />
          <path d="M512 482 L 528 482 L 566 560 L 474 560 Z" fill="#ffd68f" opacity="0.35" />
        </g>

        <g className={styles.snow}>
          {FLAKES.map((f, i) => (
            <circle key={i} cx={f.x} cy={-10} r={f.r} style={{ animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
          ))}
        </g>

        {/* ── focus glow ── */}
        {[...glow].map((slug) => (
          <g key={slug} className={styles.glow}>
            <circle cx={GLOW[slug].cx} cy={GLOW[slug].cy} r={GLOW[slug].r} fill={u("focus")} />
            {focusFlows && <circle cx={GLOW[slug].cx} cy={GLOW[slug].cy} r={GLOW[slug].r * 0.72} className={styles.glowRing} />}
          </g>
        ))}

        {/* ── energy flows ── */}
        <g filter={u("blur")}>
          {ALL_FLOWS.map((f) => (
            <path
              key={f}
              d={FLOW_PATHS[f]}
              className={`${styles.flowGlow} ${styles[`flow_${FLOW_KIND[f]}`]} ${activeFlows.has(f) ? styles.flowOn : ""} ${lowFlows.has(f) ? styles.flowLow : ""} ${focusFlows && !focusFlows.has(f) ? styles.flowDim : ""}`}
            />
          ))}
        </g>
        <g>
          {ALL_FLOWS.map((f) => (
            <path
              key={f}
              d={FLOW_PATHS[f]}
              pathLength={100}
              className={`${styles.flow} ${styles[`flow_${FLOW_KIND[f]}`]} ${activeFlows.has(f) ? styles.flowOn : ""} ${lowFlows.has(f) ? styles.flowLow : ""} ${focusFlows && !focusFlows.has(f) ? styles.flowDim : ""}`}
            />
          ))}
        </g>
        {!reduced && (
          <g className={styles.particles}>
            {ALL_FLOWS.filter((f) => activeFlows.has(f)).map((f) => {
              const low = lowFlows.has(f);
              const dim = focusFlows ? !focusFlows.has(f) : false;
              const count = low ? 1 : 3;
              const dur = FLOW_DUR[f] * (low ? 1.7 : 1);
              return (
                <g key={f} opacity={dim ? 0.15 : low ? 0.6 : 1} className={styles.particleGroup}>
                  {Array.from({ length: count }, (_, i) => {
                    const begin = `-${((dur * i) / count).toFixed(2)}s`;
                    return (
                      <circle key={i} r={low ? 6 : 8} fill={u(`p-${FLOW_KIND[f]}`)}>
                        <animateMotion dur={`${dur.toFixed(2)}s`} begin={begin} repeatCount="indefinite" path={FLOW_PATHS[f]} />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={`${dur.toFixed(2)}s`} begin={begin} repeatCount="indefinite" />
                      </circle>
                    );
                  })}
                </g>
              );
            })}
          </g>
        )}

        {/* peak alert at the meter */}
        <g className={styles.peak}>
          <circle cx="782" cy="339" r="26" className={styles.peakRing} />
          <circle cx="782" cy="339" r="26" className={`${styles.peakRing} ${styles.peakRing2}`} />
        </g>

        <text x="952" y="160" textAnchor="middle" className={styles.svgLabel}>
          net
        </text>
      </g>
      <rect x="0.75" y="0.75" width="998.5" height="638.5" rx="29.5" className={styles.cardEdge} />
    </svg>
  );
}
