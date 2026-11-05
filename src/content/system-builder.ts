// Photo-based system animation (SystemPhoto): photo, anchors, flows and the savings model.
//
// NEW PHOTO? Swap PHOTO below, then re-map the anchors:
//   1. Overlay a 10 % grid on the new image (any editor) and read off where each part sits.
//   2. Every coordinate here is [x %, y %] of the full, uncropped image (0,0 = top left).
//      ANCHORS = where the numbered dot sits. FLOWS = the waypoints a line passes through
//      (smoothed into a curve), from source to destination – direction = particle direction.
//   3. Parts you can't see in the photo (battery, inverter, smart control) are glass badges:
//      put them on a wall near where they'd hang. Keep PHOTO.width/height exact (aspect ratio).
// Everything else (component, page) stays as is.

import { fact } from "./facts";
import { v } from "./comparisons";
import type { ServiceSlug } from "./registry";

export const PHOTO = {
  src: "/images/gen/hero-gezin-woning.jpg",
  width: 1586,
  height: 992,
  alt: "Rijwoning in rode baksteen met zonnepanelen op het dak en een warmtepomp naast de oprit, bij zonsondergang.",
};

export type Pt = readonly [number, number];

export type PartKey = "zon" | "pvt" | "omvormer" | "batterij" | "warmtepomp" | "laadpaal" | "sturing" | "huis" | "net" | "gas";
/** The parts you can add in the builder, in the order they're offered. */
export type AddKey = "zon" | "batterij" | "warmtepomp" | "pvt" | "laadpaal" | "sturing";
export const ADD_ORDER: AddKey[] = ["zon", "batterij", "warmtepomp", "pvt", "laadpaal", "sturing"];

export type Part = {
  key: PartKey;
  label: string;
  /** Short name for the toggle chip. */
  chip?: string;
  /** Where the dot/badge sits on the photo (% of image). */
  at: Pt;
  /** Side the label pill opens to. */
  side: "left" | "right";
  /** Not visible on the photo → glass badge instead of a dot on the device. */
  inside?: boolean;
  does: string;
  boost: string;
  slug?: ServiceSlug;
};

const STROOM = v("stroomprijsAllIn", { scale: 100 });
const INJECTIE = v("injectievergoeding");

export const PARTS: Record<PartKey, Part> = {
  zon: {
    key: "zon",
    label: "Zonnepanelen",
    chip: "Zonnepanelen",
    at: [60, 11],
    side: "left",
    does: "Maken stroom van zonlicht – gratis, zodra het licht is.",
    boost: `Elke kWh die je zelf gebruikt, spaart ${STROOM} cent uit. Injecteren levert maar ${INJECTIE} cent.`,
    slug: "zonnepanelen",
  },
  pvt: {
    key: "pvt",
    label: "PVT-panelen",
    chip: "PVT",
    at: [76.5, 16.5],
    side: "right",
    does: "Maken stroom én warmte uit hetzelfde paneel.",
    boost: "Geven je warmtepomp voorverwarmde bron – hij draait zuiniger, ook in de winter.",
    slug: "pvt-panelen",
  },
  omvormer: {
    key: "omvormer",
    label: "Omvormer",
    at: [46.6, 36],
    side: "left",
    inside: true,
    does: "Verdeelt je zonnestroom: eerst je huis, dan de opslag, pas daarna het net.",
    boost: "Een hybride omvormer stuurt ook je batterij en kan injectie stoppen bij negatieve prijzen.",
    slug: "omvormers",
  },
  batterij: {
    key: "batterij",
    label: "Thuisbatterij",
    chip: "Thuisbatterij",
    at: [46.6, 54],
    side: "left",
    inside: true,
    does: "Bewaart je overschot van overdag.",
    boost: "Je zonnestroom ook 's avonds gebruiken – en lagere pieken op je meter.",
    slug: "thuisbatterij",
  },
  warmtepomp: {
    key: "warmtepomp",
    label: "Warmtepomp",
    chip: "Warmtepomp",
    at: [44.6, 70],
    side: "left",
    does: `Verwarmt huis en water met ${v("scopRekenwaarde")}× minder energie dan elektrisch stoken.`,
    boost: "Samen met zon: verwarmen op eigen stroom. Je gasfactuur valt weg.",
    slug: "lucht-water-warmtepomp",
  },
  laadpaal: {
    key: "laadpaal",
    label: "Laadpaal",
    chip: "Laadpaal",
    at: [14.5, 71],
    side: "right",
    does: "Laadt je wagen thuis, wanneer het jou past.",
    boost: `Slim laden op zonne-overschot: ${v("kostPer100kmZonOverschot", { pre: "€ " })} per 100 km.`,
    slug: "laadpalen",
  },
  sturing: {
    key: "sturing",
    label: "Slimme sturing",
    chip: "Slimme sturing",
    at: [57, 46],
    side: "right",
    inside: true,
    does: "Laat boiler, warmtepomp en wagen draaien wanneer stroom gratis of goedkoop is.",
    boost: `Zelfverbruik tot ${v("zelfverbruikMet")}% en een lagere maandpiek (capaciteitstarief).`,
  },
  huis: {
    key: "huis",
    label: "Je verbruik",
    at: [66, 60],
    side: "right",
    does: "Licht, koken, wassen, verwarmen: alles wat je huis nodig heeft.",
    boost: "Hoe meer daarvan uit eigen zon komt, hoe lager je factuur.",
  },
  net: {
    key: "net",
    label: "Net",
    at: [96, 50],
    side: "left",
    does: "Levert wat je zelf niet maakt, en neemt je overschot af.",
    boost: `Kopen kost ${STROOM} c/kWh, verkopen levert ${INJECTIE} c/kWh.`,
  },
  gas: {
    key: "gas",
    label: "Gasketel",
    at: [82, 68],
    side: "left",
    inside: true,
    does: "Verwarmt je huis en water op gas – vandaag je grootste kost.",
    boost: "Valt weg zodra een warmtepomp het overneemt.",
  },
};

export type FlowKind = "stroom" | "warmte" | "net" | "gas" | "data";

export type Flow = {
  key: string;
  kind: FlowKind;
  pts: Pt[];
  /** Shown when this returns true for the active set. */
  when: (on: ReadonlySet<AddKey>) => boolean;
  /** Parts this flow belongs to (highlight on hover). */
  parts: PartKey[];
  /** Thinner/slower when true (e.g. little left to inject). */
  low?: (on: ReadonlySet<AddKey>) => boolean;
};

const hasPv = (on: ReadonlySet<AddKey>) => on.has("zon") || on.has("pvt");

export const FLOWS: Flow[] = [
  { key: "zon-omvormer", kind: "stroom", pts: [[60, 15], [54, 22], [48.5, 29], [46.8, 34.5]], when: (on) => on.has("zon"), parts: ["zon", "omvormer"] },
  { key: "pvt-omvormer", kind: "stroom", pts: [[76, 20], [66, 25.5], [53, 30.5], [47.6, 35]], when: (on) => on.has("pvt"), parts: ["pvt", "omvormer"] },
  { key: "pvt-warmtepomp", kind: "warmte", pts: [[78, 20.5], [62, 34], [51, 52], [45.4, 67.5]], when: (on) => on.has("pvt") && on.has("warmtepomp"), parts: ["pvt", "warmtepomp"] },
  { key: "omvormer-huis", kind: "stroom", pts: [[47.6, 37.5], [55, 43], [61.5, 52], [65.6, 58.5]], when: hasPv, parts: ["omvormer", "huis"] },
  { key: "omvormer-batterij", kind: "stroom", pts: [[46.6, 38.5], [46.2, 45], [46.6, 52]], when: (on) => on.has("batterij") && hasPv(on), parts: ["omvormer", "batterij"] },
  { key: "net-batterij", kind: "net", pts: [[95.5, 51], [80, 54], [62, 55.5], [47.8, 54.5]], when: (on) => on.has("batterij") && !hasPv(on), parts: ["net", "batterij"] },
  { key: "batterij-huis", kind: "stroom", pts: [[47.8, 55.5], [56, 58], [65, 60.5]], when: (on) => on.has("batterij"), parts: ["batterij", "huis"] },
  { key: "omvormer-warmtepomp", kind: "stroom", pts: [[45.6, 38.5], [43.2, 50], [43.4, 60], [44.2, 67.5]], when: (on) => on.has("warmtepomp") && hasPv(on), parts: ["omvormer", "warmtepomp"] },
  { key: "net-warmtepomp", kind: "net", pts: [[96, 52], [80, 60], [60, 66], [46.4, 70]], when: (on) => on.has("warmtepomp") && !hasPv(on), parts: ["net", "warmtepomp"] },
  { key: "warmtepomp-huis", kind: "warmte", pts: [[46.4, 71.5], [53, 69], [59, 65], [65.4, 61.5]], when: (on) => on.has("warmtepomp"), parts: ["warmtepomp", "huis"] },
  { key: "omvormer-laadpaal", kind: "stroom", pts: [[45.6, 39.5], [34, 50], [23, 61], [15.4, 69]], when: (on) => on.has("laadpaal") && hasPv(on), parts: ["omvormer", "laadpaal"] },
  { key: "net-laadpaal", kind: "net", pts: [[96, 52], [70, 72], [40, 78], [16, 72.5]], when: (on) => on.has("laadpaal") && !hasPv(on), parts: ["net", "laadpaal"] },
  {
    key: "omvormer-net",
    kind: "stroom",
    pts: [[48, 35], [62, 39], [80, 45], [95.5, 49]],
    when: hasPv,
    parts: ["omvormer", "net"],
    low: (on) => on.has("batterij") || on.has("sturing"),
  },
  {
    key: "net-huis",
    kind: "net",
    pts: [[95.5, 51.5], [86, 56], [75, 59], [67, 60.5]],
    when: () => true,
    parts: ["net", "huis"],
    low: (on) => hasPv(on) && (on.has("batterij") || on.has("sturing")),
  },
  { key: "gas-huis", kind: "gas", pts: [[100, 76], [90, 72], [82, 68.5], [72, 64], [66.5, 61.5]], when: (on) => !on.has("warmtepomp"), parts: ["gas", "huis"] },
  { key: "sturing-batterij", kind: "data", pts: [[56, 47], [52, 51], [47.6, 53.5]], when: (on) => on.has("sturing") && on.has("batterij"), parts: ["sturing", "batterij"] },
  { key: "sturing-warmtepomp", kind: "data", pts: [[56.4, 47.5], [51, 58], [45.4, 69]], when: (on) => on.has("sturing") && on.has("warmtepomp"), parts: ["sturing", "warmtepomp"] },
  { key: "sturing-laadpaal", kind: "data", pts: [[56, 46.5], [38, 56], [15.6, 70.5]], when: (on) => on.has("sturing") && on.has("laadpaal"), parts: ["sturing", "laadpaal"] },
  { key: "sturing-omvormer", kind: "data", pts: [[56, 45.5], [51, 40], [47.6, 37]], when: (on) => on.has("sturing") && hasPv(on), parts: ["sturing", "omvormer"] },
];

/** Which parts show on the photo for an active set. */
export function visibleParts(on: ReadonlySet<AddKey>): PartKey[] {
  const out: PartKey[] = ["huis", "net"];
  if (!on.has("warmtepomp")) out.push("gas");
  if (hasPv(on)) out.push("omvormer");
  for (const k of ADD_ORDER) if (on.has(k)) out.push(k);
  return out;
}

// ───────────────────────── Savings model (indicatief rekenvoorbeeld) ─────────────────────────
// Voorbeeldgezin: 3.500 kWh huishouden + elektrische wagen (15.000 km/jaar, thuis aan het
// stopcontact) + 1.700 m³ gas. Prijzen, rendementen en zelfverbruik komen uit facts.ts; de
// installatiegroottes en de zelfverbruik-stappen per toestel zijn eigen aannames.

const STROOMPRIJS = fact("stroomprijsAllIn").value; // €/kWh
const GASPRIJS = fact("gasprijsAllIn").value; // €/kWh
const INJECTIE_EUR = fact("injectievergoeding").value / 100; // €/kWh
const SCOP = fact("scopRekenwaarde").value;
const PV_PER_KWP = fact("pvOpbrengstPerKwp").value;
const EV_PER_100 = fact("evVerbruikPer100km").value;
const PIEK_PER_KW = fact("capaciteitstariefPerKw").value; // € per kW maandpiek per jaar
const ZELF_ZONDER = fact("zelfverbruikZonder").value / 100;

export const MODEL = {
  huisKwh: 3500,
  evKm: 15000,
  gasM3: 1700,
  kwhPerM3: 10,
  gasVast: 175,
  rendementKetel: 0.9,
  pvKwp: 6,
  pvtKwp: 2,
  /** PVT-bron: warmtepomp verbruikt zoveel minder stroom. */
  pvtWpWinst: 0.15,
  /** Extra zelfverbruik per toestel (aanname), bovenop ZELF_ZONDER. */
  zelfStap: { batterij: 0.15, warmtepomp: 0.1, laadpaal: 0.08, sturing: 0.07 } as const,
  zelfMax: 0.75,
  /** Lagere maandpiek in kW (aanname): slim laden en sturing/batterij. */
  piekMinder: { laadpaal: 0.5, sturing: 1, batterij: 0.5 } as const,
  /** Hogere maandpiek in kW door de warmtepomp (aanname). */
  piekWarmtepomp: 1,
};

export type Scenario = { netKwh: number; gasM3: number; factuur: number; zelfverbruik: number; productie: number };

export function scenario(on: ReadonlySet<AddKey>): Scenario {
  const m = MODEL;
  const gasKwh = m.gasM3 * m.kwhPerM3;
  const wpKwh = on.has("warmtepomp") ? ((gasKwh * m.rendementKetel) / SCOP) * (on.has("pvt") ? 1 - m.pvtWpWinst : 1) : 0;
  const vraag = m.huisKwh + (m.evKm / 100) * EV_PER_100 + wpKwh;
  const productie = (on.has("zon") ? m.pvKwp * PV_PER_KWP : 0) + (on.has("pvt") ? m.pvtKwp * PV_PER_KWP : 0);
  let frac = ZELF_ZONDER;
  for (const k of Object.keys(m.zelfStap) as (keyof typeof m.zelfStap)[]) if (on.has(k)) frac += m.zelfStap[k];
  frac = Math.min(frac, m.zelfMax);
  const zelf = Math.min(productie * frac, vraag);
  const netKwh = vraag - zelf;
  const injectie = productie - zelf;
  let piek = on.has("warmtepomp") ? m.piekWarmtepomp : 0;
  for (const k of Object.keys(m.piekMinder) as (keyof typeof m.piekMinder)[]) if (on.has(k)) piek -= m.piekMinder[k];
  const gas = on.has("warmtepomp") ? 0 : gasKwh * GASPRIJS + m.gasVast;
  const factuur = netKwh * STROOMPRIJS - injectie * INJECTIE_EUR + gas + piek * PIEK_PER_KW;
  return {
    netKwh: Math.round(netKwh),
    gasM3: on.has("warmtepomp") ? 0 : m.gasM3,
    factuur: Math.round(factuur),
    zelfverbruik: productie ? Math.round((zelf / productie) * 100) : 0,
    productie: Math.round(productie),
  };
}

export const BASELINE = scenario(new Set());

/** Bar scales (max of each bar). */
export const BAR_MAX = { netKwh: 12000, gasM3: MODEL.gasM3, factuur: BASELINE.factuur };

export const BUILDER_INTRO = {
  eyebrow: "Stel je systeem samen",
  title: "Voeg toe wat je wil – en zie wat het je oplevert",
  lead: "Je start bij een gasketel en het net. Klik een toestel aan: je ziet wat het doet, waar de energie heen gaat en hoeveel je factuur zakt.",
};

export const BUILDER_COPY = {
  start: "Vandaag: gasketel + net",
  hint: "Voeg toe en zie wat het doet",
  assumptions: `Indicatief rekenvoorbeeld. Voorbeeldgezin: ${MODEL.huisKwh.toLocaleString("nl-BE")} kWh stroom, een elektrische wagen (${MODEL.evKm.toLocaleString("nl-BE")} km/jaar) en ${MODEL.gasM3.toLocaleString("nl-BE")} m³ gas. ${MODEL.pvKwp} kWp zonnepanelen, ${MODEL.pvtKwp} kWp PVT. Stroom ${STROOM} c/kWh, injectie ${INJECTIE} c/kWh, gas ${v("gasprijsAllIn", { scale: 100 })} c/kWh, SCOP ${v("scopRekenwaarde")}. Zelfverbruik ${v("zelfverbruikZonder")}% zonder sturing; de extra per toestel is onze aanname. Jouw cijfers rekenen we apart uit.`,
};

/** Teaser explainer order (numbered dots on the photo match this list). */
export const TEASER_ORDER: PartKey[] = ["zon", "pvt", "omvormer", "batterij", "warmtepomp", "laadpaal", "sturing"];
export const ALL_ON: ReadonlySet<AddKey> = new Set(ADD_ORDER);
