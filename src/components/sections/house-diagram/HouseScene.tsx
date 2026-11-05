"use client";

// HouseScene – the photo behind HouseDiagram: a realistic cutaway house
// (public/images/gen/systeem-woning.jpg, 1586×992) with an SVG overlay in the same pixel space
// (viewBox 0 0 1586 992): scene treatments (dusk, winter, peak), glowing energy flows and
// particles travelling along them. Hotspot `pos` in src/content/system.ts = % of this photo.
//
// NEW PHOTO? Keep the size in PHOTO exact, then re-map FLOW_PATHS, GLOW, ROOMS, WINDOWS, PANELS,
// BATTERY and METER below to the pixel positions of the parts in the new image.

import Image from "next/image";
import { useId, useSyncExternalStore } from "react";
import type { ServiceSlug } from "@/content/registry";
import { FLOW_KIND, type FlowKey } from "@/content/system";
import styles from "./HouseDiagram.module.css";

export const PHOTO = { src: "/images/gen/systeem-woning.jpg", width: 1586, height: 992 };

// Grid: pylon → electrical box/meter on the right wall.
const GRID = "M1462 367 C 1400 395, 1320 460, 1262 500";
// Floor slab between the storeys (y≈633) – stroom runs along it to the car and heat pump.
export const FLOW_PATHS: Record<FlowKey, string> = {
  "zon-omvormer": "M790 386 C 820 420, 925 418, 935 448 L 937 497",
  "pvt-omvormer": "M968 392 C 968 425, 958 455, 955 497",
  "omvormer-huis": "M952 580 C 948 640, 860 650, 812 700",
  "omvormer-batterij": "M986 530 C 1003 528, 1018 532, 1034 540",
  "omvormer-auto": "M918 572 C 900 625, 860 633, 800 633 L 470 633 C 430 633, 400 680, 392 728",
  "omvormer-warmtepomp": "M986 572 C 1000 625, 1040 633, 1100 633 L 1290 633 C 1330 640, 1375 700, 1388 768",
  "omvormer-airco": "M918 518 C 880 500, 820 489, 784 489",
  "omvormer-net": "M986 512 C 1060 478, 1180 470, 1240 498 C 1320 460, 1400 395, 1462 367",
  "batterij-huis": "M1062 586 C 1062 640, 1000 645, 920 660 C 870 668, 835 685, 818 702",
  "net-huis": `${GRID} C 1225 560, 1130 633, 1040 640 C 930 650, 850 670, 814 702`,
  "net-batterij": `${GRID} C 1200 520, 1130 540, 1090 545`,
  "net-auto": `${GRID} C 1235 600, 1160 633, 1080 633 L 470 633 C 430 633, 400 680, 392 728`,
  "net-warmtepomp": "M1475 380 C 1470 520, 1440 690, 1420 768",
  "pvt-warmtepomp": "M1250 392 C 1262 430, 1300 445, 1305 500 L 1305 700 C 1306 745, 1340 760, 1372 770",
  "warmtepomp-huis": "M1322 820 C 1290 818, 1268 822, 1250 842 C 1200 886, 1000 890, 560 888",
};
export const ALL_FLOWS = Object.keys(FLOW_PATHS) as FlowKey[];

/** Glow behind each component (photo px; matches the hotspot pos % in system.ts). */
const GLOW: Record<ServiceSlug, { cx: number; cy: number; r: number }> = {
  zonnepanelen: { cx: 643, cy: 296, r: 210 },
  "pvt-panelen": { cx: 1088, cy: 298, r: 210 },
  omvormers: { cx: 952, cy: 537, r: 72 },
  thuisbatterij: { cx: 1062, cy: 545, r: 72 },
  laadpalen: { cx: 390, cy: 790, r: 110 },
  "lucht-water-warmtepomp": { cx: 1393, cy: 823, r: 115 },
  "lucht-lucht-warmtepomp": { cx: 750, cy: 488, r: 70 },
};

/** Lit interiors (warm glow at night; the mask in CSS .rooms matches these), windows to the outside, panel faces, meter. */
const ROOMS = [
  { x: 462, y: 440, w: 443, h: 178 },
  { x: 905, y: 440, w: 385, h: 178 },
  { x: 470, y: 650, w: 820, h: 255 },
];
const WINDOWS = [
  { x: 487, y: 472, w: 98, h: 103 },
  { x: 1127, y: 465, w: 80, h: 125 },
  { x: 617, y: 690, w: 138, h: 78 },
];
const PANELS = "M500 208 L 833 208 L 826 385 L 455 385 Z M893 208 L 1230 208 L 1283 388 L 897 388 Z";
const BATTERY = { x: 1036, y: 503, w: 52, h: 84 };
const METER = { cx: 1251, cy: 507 };

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
const FLOW_DUR = Object.fromEntries(ALL_FLOWS.map((f) => [f, Math.max(1.6, pathLength(FLOW_PATHS[f]) / 230)])) as Record<FlowKey, number>;

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
  [90, 60, 2.2], [300, 40, 1.6], [420, 110, 1.8], [560, 50, 1.5], [700, 95, 2], [1000, 40, 1.7], [1120, 110, 1.4],
  [1260, 60, 2.1], [1380, 130, 1.5], [1520, 70, 1.8], [820, 30, 1.3], [180, 150, 1.4], [1450, 30, 1.2],
] as const;
const FLAKES = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 151) % 1586,
  r: 2.2 + ((i * 7) % 5) * 0.7,
  d: 8 + ((i * 13) % 9),
  delay: -((i * 1.37) % 14),
}));

type Props = {
  activeFlows: Set<FlowKey>;
  lowFlows: Set<FlowKey>;
  glow: Set<ServiceSlug>;
  focusFlows: Set<FlowKey> | null;
  tone: "light" | "dark";
  /** Smaller srcset for the mini variant. */
  sizes?: string;
};

export default function HouseScene({ activeFlows, lowFlows, glow, focusFlows, tone, sizes = "(max-width: 900px) 100vw, 60vw" }: Props) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const u = (n: string) => `url(#${gid}-${n})`;
  const reduced = useReducedMotion();
  const cls = (f: FlowKey) =>
    `${styles[`flow_${FLOW_KIND[f]}`]} ${activeFlows.has(f) ? styles.flowOn : ""} ${lowFlows.has(f) ? styles.flowLow : ""} ${focusFlows && !focusFlows.has(f) ? styles.flowDim : ""}`;

  return (
    <div className={styles.scene} data-tone={tone}>
      <Image src={PHOTO.src} alt="" fill sizes={sizes} quality={90} className={styles.photo} />
      {/* Avond/piek: the photo darkens under a dusk tint; a masked copy keeps the rooms lit. */}
      <div className={styles.tint} />
      <div className={styles.rooms}>
        <Image src={PHOTO.src} alt="" fill sizes={sizes} quality={90} className={styles.roomsPhoto} />
      </div>
      <svg viewBox={`0 0 ${PHOTO.width} ${PHOTO.height}`} className={styles.svg} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${gid}-warm`}>
            <stop offset="0" stopColor="#ffc26b" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gid}-moonHalo`}>
            <stop offset="0" stopColor="#efd9ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#efd9ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gid}-sunBloom`}>
            <stop offset="0" stopColor="#fff8d8" stopOpacity="0.85" />
            <stop offset="0.4" stopColor="#ffe6a0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffe6a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gid}-sweep`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gid}-batt`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfbf9" />
            <stop offset="1" stopColor="#dedfdb" />
          </linearGradient>
          <linearGradient id={`${gid}-cell`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#22a68f" />
            <stop offset="1" stopColor="#7fe3c9" />
          </linearGradient>
          {(["stroom", "warmte", "net"] as const).map((k) => (
            <radialGradient key={k} id={`${gid}-p-${k}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor={`var(--hd-${k})`} />
              <stop offset="1" stopColor={`var(--hd-${k})`} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id={`${gid}-focus`}>
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#7fe3c9" stopOpacity="0.28" />
            <stop offset="1" stopColor="#7fe3c9" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${gid}-panels`}>
            <path d={PANELS} />
          </clipPath>
          <filter id={`${gid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={`${gid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2b2116" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── scene treatments ── */}
        <g className={styles.sunBloom}>
          <circle cx="222" cy="160" r="170" fill={u("sunBloom")} />
        </g>
        <g className={styles.sweepWrap} clipPath={u("panels")}>
          <rect x="-260" y="180" width="200" height="240" fill={u("sweep")} className={styles.sweep} />
        </g>

        <g className={styles.nightWindows}>
          {WINDOWS.map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#141c3c" opacity="0.72" />
          ))}
        </g>
        <g className={styles.lights}>
          {ROOMS.map((r, i) => (
            <ellipse key={i} cx={r.x + r.w / 2} cy={r.y + r.h * 0.55} rx={r.w * 0.62} ry={r.h * 0.75} fill={u("warm")} />
          ))}
          {WINDOWS.map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="4" fill="#ffcf85" opacity="0.38" filter={u("blur")} />
          ))}
        </g>
        <g className={styles.stars}>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} style={{ animationDelay: `${(i % 5) * 0.6}s` }} />
          ))}
        </g>
        <g className={styles.moon}>
          <circle cx="1180" cy="110" r="90" fill={u("moonHalo")} />
          <path d="M1192 72 a42 42 0 1 0 30 70 a34 34 0 1 1 -30 -70z" fill="#f4ecff" />
        </g>
        <rect width={PHOTO.width} height={PHOTO.height} fill="#dfeaf5" className={styles.frost} />
        <g className={styles.snow}>
          {FLAKES.map((f, i) => (
            <circle key={i} cx={f.x} cy={-12} r={f.r} style={{ animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
          ))}
        </g>

        {/* Wall battery next to the inverter (drawn – not in the photo). Level = --hd-battery. */}
        <g className={styles.battery} filter={u("shadow")}>
          <rect x={BATTERY.x} y={BATTERY.y} width={BATTERY.w} height={BATTERY.h} rx="7" fill={u("batt")} stroke="rgba(0,0,0,0.12)" />
          <rect x={BATTERY.x + 36} y={BATTERY.y + 12} width="7" height={BATTERY.h - 24} rx="3.5" fill="rgba(5,35,29,0.12)" />
          <rect x={BATTERY.x + 36} y={BATTERY.y + 12} width="7" height={BATTERY.h - 24} rx="3.5" fill={u("cell")} className={styles.batteryLevel} />
          <path d={`M${BATTERY.x + 18} ${BATTERY.y + 32} l -7 14 h 7 l -5 14 l 12 -18 h -7 l 5 -10 z`} fill="#22a68f" className={styles.bolt} />
        </g>

        {/* ── focus glow ── */}
        {[...glow].map((slug) => (
          <g key={slug} className={styles.glow}>
            <circle cx={GLOW[slug].cx} cy={GLOW[slug].cy} r={GLOW[slug].r} fill={u("focus")} />
            {focusFlows && <circle cx={GLOW[slug].cx} cy={GLOW[slug].cy} r={GLOW[slug].r * 0.62} className={styles.glowRing} />}
          </g>
        ))}

        {/* ── energy flows ── */}
        <g filter={u("blur")}>
          {ALL_FLOWS.map((f) => (
            <path key={f} d={FLOW_PATHS[f]} className={`${styles.flowGlow} ${cls(f)}`} />
          ))}
        </g>
        <g>
          {ALL_FLOWS.map((f) => (
            <path key={f} d={FLOW_PATHS[f]} pathLength={100} className={`${styles.flow} ${cls(f)}`} />
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
                      <circle key={i} r={low ? 9 : 12} fill={u(`p-${FLOW_KIND[f]}`)}>
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
          <circle cx={METER.cx} cy={METER.cy} r="34" className={styles.peakRing} />
          <circle cx={METER.cx} cy={METER.cy} r="34" className={`${styles.peakRing} ${styles.peakRing2}`} />
        </g>
      </svg>
    </div>
  );
}
