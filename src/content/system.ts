// Data for the whole-home HouseDiagram (05 §8.4, owner: Builder 1).
// The photo + flow geometry lives in src/components/sections/house-diagram/HouseScene.tsx
// (hotspot `pos` below = % of that photo);
// this file holds the words, the scenes, which energy flows are active per scene and the
// € effect per component. Every number is a FactKey from facts.ts (never a literal).
// PVT: no yield or price numbers (00 §3) – only "per project berekend".

import { fact, type FactKey } from "./facts";
import { v } from "./comparisons";
import type { ServiceSlug } from "./registry";

export type SceneKey = "dag" | "avond" | "winter" | "piek";

/** Named energy flows; their SVG paths are drawn in HouseDiagram. */
export type FlowKey =
  | "zon-omvormer"
  | "omvormer-huis"
  | "omvormer-batterij"
  | "omvormer-auto"
  | "omvormer-warmtepomp"
  | "omvormer-airco"
  | "omvormer-net"
  | "batterij-huis"
  | "net-huis"
  | "net-batterij"
  | "net-auto"
  | "net-warmtepomp"
  | "pvt-warmtepomp"
  | "pvt-omvormer"
  | "warmtepomp-huis";

export type FlowKind = "stroom" | "warmte" | "net";

export const FLOW_KIND: Record<FlowKey, FlowKind> = {
  "zon-omvormer": "stroom",
  "pvt-omvormer": "stroom",
  "omvormer-huis": "stroom",
  "omvormer-batterij": "stroom",
  "omvormer-auto": "stroom",
  "omvormer-warmtepomp": "stroom",
  "omvormer-airco": "stroom",
  "omvormer-net": "net",
  "batterij-huis": "stroom",
  "net-huis": "net",
  "net-batterij": "net",
  "net-auto": "net",
  "net-warmtepomp": "net",
  "pvt-warmtepomp": "warmte",
  "warmtepomp-huis": "warmte",
};

/** Which component each flow belongs to (for highlighting a hotspot's flows). */
export const FLOW_OWNERS: Record<FlowKey, ServiceSlug[]> = {
  "zon-omvormer": ["zonnepanelen", "omvormers"],
  "pvt-omvormer": ["pvt-panelen", "omvormers"],
  "omvormer-huis": ["omvormers", "zonnepanelen"],
  "omvormer-batterij": ["omvormers", "thuisbatterij"],
  "omvormer-auto": ["omvormers", "laadpalen"],
  "omvormer-warmtepomp": ["omvormers", "lucht-water-warmtepomp"],
  "omvormer-airco": ["omvormers", "lucht-lucht-warmtepomp"],
  "omvormer-net": ["omvormers", "zonnepanelen"],
  "batterij-huis": ["thuisbatterij"],
  "net-huis": [],
  "net-batterij": ["thuisbatterij"],
  "net-auto": ["laadpalen"],
  "net-warmtepomp": ["lucht-water-warmtepomp"],
  "pvt-warmtepomp": ["pvt-panelen", "lucht-water-warmtepomp"],
  "warmtepomp-huis": ["lucht-water-warmtepomp"],
};

export type Scene = {
  key: SceneKey;
  label: string;
  /** Short headline for the scene (teaser + full). */
  title: string;
  /** 1–2 sentence caption (teaser, ~35 words). */
  caption: string;
  /** Fact shown with the scene. */
  fact: { k: FactKey; label: string; suffix?: string; compare?: { k: FactKey; label: string; suffix?: string } };
  flows: FlowKey[];
  /** Flows that carry money out of the house at a low price (shown dimmed/dashed). */
  lowValueFlows?: FlowKey[];
};

export const SCENES: Scene[] = [
  {
    key: "dag",
    label: "Dag",
    title: "Overdag: de zon draait, je huis verbruikt eerst zelf",
    caption:
      "Je panelen voeden eerst je eigen toestellen: de warmtepomp warmt de boiler op, de auto laadt op overschot en de batterij vult zich. Pas wat dan nog over is, gaat naar het net.",
    fact: {
      k: "stroomprijsAllIn",
      label: "Zelf verbruikt bespaart",
      suffix: " €/kWh",
      compare: { k: "injectievergoeding", label: "geïnjecteerd levert", suffix: " c/kWh" },
    },
    flows: ["zon-omvormer", "pvt-omvormer", "omvormer-huis", "omvormer-batterij", "omvormer-auto", "omvormer-warmtepomp", "pvt-warmtepomp", "omvormer-net"],
    lowValueFlows: ["omvormer-net"],
  },
  {
    key: "avond",
    label: "Avond",
    title: "'s Avonds: je eigen zonnestroom uit de batterij",
    caption:
      "Wanneer jullie thuiskomen en koken, haalt je huis de stroom uit de batterij in plaats van ze duur van het net te kopen. De auto wacht met laden tot de goedkoopste nachturen.",
    fact: { k: "zelfverbruikMet", label: "Zelfverbruik met slimme sturing", suffix: " %", compare: { k: "zelfverbruikZonder", label: "zonder", suffix: " %" } },
    flows: ["batterij-huis", "net-auto", "warmtepomp-huis"],
  },
  {
    key: "winter",
    label: "Winter",
    title: "In de winter: de warmtepomp doet het zware werk",
    caption:
      "Weinig zon, veel warmtevraag. De warmtepomp maakt van elke kWh stroom meerdere kWh warmte, PVT-panelen leveren extra bronwarmte, en met een dynamisch tarief draait ze vooral in de goedkope uren.",
    fact: { k: "scopRekenwaarde", label: "Rekenwaarde SCOP: kWh warmte per kWh stroom", suffix: "" },
    flows: ["net-warmtepomp", "pvt-warmtepomp", "warmtepomp-huis", "net-batterij", "zon-omvormer", "omvormer-huis"],
  },
  {
    key: "piek",
    label: "Piekmoment",
    title: "Piekmoment: koken, wassen én laden tegelijk",
    caption:
      "Het capaciteitstarief rekent je hoogste kwartier van de maand aan. Op zo'n moment springt de batterij bij, pauzeert de laadpaal even en schuift de warmtepomp op, zodat je piek laag blijft.",
    fact: { k: "capaciteitstariefPerKw", label: "Elke kW maandpiek kost per jaar", suffix: " €" },
    flows: ["batterij-huis", "net-huis"],
  },
];

export type HotspotEffect = { label: string; k: FactKey; suffix?: string; compare?: { label: string; k: FactKey; suffix?: string } };

export type Hotspot = {
  slug: ServiceSlug;
  label: string;
  /** What it does in the system, in one line. */
  role: string;
  /** What it does in each scene. */
  scenes: Record<SceneKey, string>;
  /** Active (glowing) in which scenes. */
  activeIn: SceneKey[];
  /** € effect – one fact. PVT has none (per project berekend). */
  effect?: HotspotEffect;
  /** Text when there is no fact-backed effect. */
  effectText?: string;
  /** Position of the hotspot in % of the diagram (x, y). */
  pos: [number, number];
};

export const HOTSPOTS: Hotspot[] = [
  {
    slug: "zonnepanelen",
    label: "Zonnepanelen",
    role: "Maken stroom van je eigen dak. Hun waarde hangt af van hoeveel je er zelf van gebruikt.",
    scenes: {
      dag: "Op volle kracht. Elke kWh die je huis, warmtepomp, batterij of auto meteen gebruikt, hoef je niet aan de volle prijs te kopen.",
      avond: "Ze liggen stil. Wat ze overdag in de batterij stopten, gebruik je nu.",
      winter: "Ze leveren minder, maar nog altijd een deel van de stroom voor je warmtepomp op zonnige winterdagen.",
      piek: "Een piek valt vaak 's avonds. Panelen alleen helpen dan niet: daar is sturing of opslag voor nodig.",
    },
    activeIn: ["dag", "winter"],
    effect: {
      label: "Zelf verbruikt bespaart",
      k: "stroomprijsAllIn",
      suffix: " €/kWh",
      compare: { label: "geïnjecteerd krijg je", k: "injectievergoeding", suffix: " c/kWh" },
    },
    pos: [40.5, 29.7],
  },
  {
    slug: "pvt-panelen",
    label: "PVT-panelen",
    role: "Maken stroom én warmte van hetzelfde dak. Die warmte dient als bron voor je warmtepomp.",
    scenes: {
      dag: "Ze maken stroom zoals gewone panelen en geven tegelijk warmte af aan je warmtepomp of boiler. Door die koeling werkt het paneel bovendien efficiënter.",
      avond: "Ook zonder zon halen ze nog warmte uit de buitenlucht. Die gaat naar de warmtepomp als bronwarmte.",
      winter: "Hier ligt hun sterkte: ze geven de warmtepomp een warmere bron dan de koude buitenlucht, zodat ze minder stroom per kWh warmte verbruikt.",
      piek: "Geen directe rol in je piek, wel een zuinigere warmtepomp en dus minder kW nodig.",
    },
    activeIn: ["dag", "winter"],
    effectText: "Opbrengst per project berekend. Hangt af van je dak, je warmtepomp en je warmwaterverbruik.",
    pos: [68.6, 30],
  },
  {
    slug: "omvormers",
    label: "Omvormer",
    role: "Het hart van je installatie: zet zonnestroom om en beslist waar elke kWh naartoe gaat.",
    scenes: {
      dag: "Een hybride omvormer stuurt de zonnestroom eerst naar je huis, dan naar de batterij en pas als laatste naar het net.",
      avond: "Ze haalt stroom uit de batterij en zet die om voor je stopcontacten.",
      winter: "Ze laadt de batterij in de goedkope uren als je een dynamisch contract hebt.",
      piek: "Ze ziet je verbruik stijgen en laat de batterij meteen bijspringen.",
    },
    activeIn: ["dag", "avond", "winter", "piek"],
    effect: { label: "Gebruikelijke levensduur", k: "levensduurOmvormer", suffix: " jaar" },
    pos: [60, 54.1],
  },
  {
    slug: "thuisbatterij",
    label: "Thuisbatterij",
    role: "Bewaart zonnestroom van de middag voor de avond en vlakt je pieken af.",
    scenes: {
      dag: "Ze vult zich met het overschot dat je anders voor een paar cent zou injecteren.",
      avond: "Ze levert de stroom voor koken, licht en tv. Zo koop je 's avonds minder dure netstroom.",
      winter: "Met een dynamisch contract laadt ze in de goedkoopste uren van het net en levert ze in de dure uren.",
      piek: "Ze springt bij zodra je verbruik piekt, zodat je maandpiek en dus je capaciteitstarief laag blijven.",
    },
    activeIn: ["dag", "avond", "winter", "piek"],
    effect: { label: "Per kW lagere maandpiek bespaar je per jaar", k: "capaciteitstariefPerKw", suffix: " €" },
    pos: [67, 55],
  },
  {
    slug: "laadpalen",
    label: "Laadpaal",
    role: "Laadt je auto slim: op zonne-overschot of in de goedkope uren, zonder je piek op te blazen.",
    scenes: {
      dag: "Staat de auto thuis, dan laadt hij op het zonne-overschot. Dat is de goedkoopste stroom die er bestaat.",
      avond: "Hij wacht tot de nacht of tot de goedkoopste uren, in plaats van te laden terwijl jullie koken.",
      winter: "Minder zon, dus vooral laden in de goedkope nachturen.",
      piek: "Hij pauzeert of laadt trager zolang de oven en de wasmachine draaien.",
    },
    activeIn: ["dag", "avond"],
    effect: {
      label: "100 km op zonne-overschot",
      k: "kostPer100kmZonOverschot",
      suffix: " €",
      compare: { label: "aan de netprijs", k: "kostPer100kmThuisNet", suffix: " €" },
    },
    pos: [24.6, 79],
  },
  {
    slug: "lucht-water-warmtepomp",
    label: "Lucht-water warmtepomp",
    role: "Vervangt je gasketel en maakt van 1 kWh stroom meerdere kWh warmte voor verwarming en warm water.",
    scenes: {
      dag: "Ze warmt de boiler en de vloer op met zonnestroom, zodat je die warmte 's avonds niet met netstroom moet maken.",
      avond: "De warmte die overdag in de boiler en de vloer werd opgeslagen, houdt het huis warm.",
      winter: "Ze draait het meest, bij voorkeur in de goedkope uren en met PVT als warmere bron.",
      piek: "Ze schuift haar zware momenten op, weg van het moment waarop jullie koken en laden.",
    },
    activeIn: ["dag", "avond", "winter"],
    effect: {
      label: "1 kWh warmte met warmtepomp",
      k: "warmtekostWarmtepompPerKwhWarmte",
      suffix: " €",
      compare: { label: "met gas", k: "warmtekostGasPerKwhWarmte", suffix: " €" },
    },
    pos: [87.8, 83],
  },
  {
    slug: "lucht-lucht-warmtepomp",
    label: "Lucht-lucht warmtepomp (airco)",
    role: "Verwarmt en koelt per ruimte, veel zuiniger dan een elektrisch vuurtje.",
    scenes: {
      dag: "In de zomer koelt ze je living of zolder, net wanneer je panelen het meest opbrengen.",
      avond: "In het tussenseizoen verwarmt ze snel de leefruimte zonder de centrale verwarming op te starten.",
      winter: "Ze ondersteunt in de ruimtes waar je het meest leeft, of verwarmt de zolder waar geen radiator hangt.",
      piek: "Slim ingesteld vermijdt ze de momenten waarop alles tegelijk draait.",
    },
    activeIn: ["dag"],
    effect: {
      label: "1 kWh warmte met airco",
      k: "warmtekostAircoPerKwhWarmte",
      suffix: " €",
      compare: { label: "elektrisch vuurtje", k: "warmtekostElektrischPerKwhWarmte", suffix: " €" },
    },
    pos: [47.3, 49.2],
  },
];

export function getScene(key: SceneKey): Scene {
  return SCENES.find((s) => s.key === key)!;
}
export function getHotspot(slug: ServiceSlug): Hotspot {
  return HOTSPOTS.find((h) => h.slug === slug)!;
}

// ───────────────────────── "Stel je systeem samen" (full mode) ─────────────────────────
// Toggle components on the photo and see an indicative yearly bill. Voorbeeldgezin: 3.500 kWh
// huishouden + elektrische wagen (15.000 km/jaar) + 1.700 m³ gas. Prijzen, rendementen en
// zelfverbruik komen uit facts.ts; installatiegroottes en de stappen per toestel zijn aannames.

export type AddKey = "zon" | "batterij" | "warmtepomp" | "pvt" | "laadpaal" | "sturing";
export const ADD_ORDER: AddKey[] = ["zon", "batterij", "warmtepomp", "pvt", "laadpaal", "sturing"];

const STROOM = v("stroomprijsAllIn", { scale: 100 });
const INJECTIE = v("injectievergoeding");

export const ADD_ITEMS: Record<AddKey, { label: string; slug: ServiceSlug; boost: string }> = {
  zon: { label: "Zonnepanelen", slug: "zonnepanelen", boost: `Eigen stroom kost niets: elke kWh die je zelf gebruikt spaart ${STROOM} cent.` },
  batterij: { label: "Thuisbatterij", slug: "thuisbatterij", boost: "Je zonnestroom ook 's avonds gebruiken – en lagere pieken." },
  warmtepomp: { label: "Warmtepomp", slug: "lucht-water-warmtepomp", boost: "Je gasfactuur valt weg. Met zon verwarm je op eigen stroom." },
  pvt: { label: "PVT-panelen", slug: "pvt-panelen", boost: "Stroom én warmte: je warmtepomp draait zuiniger." },
  laadpaal: { label: "Laadpaal", slug: "laadpalen", boost: `Laden op zonne-overschot: ${v("kostPer100kmZonOverschot", { pre: "€ " })} per 100 km.` },
  sturing: { label: "Slimme sturing", slug: "omvormers", boost: `Toestellen draaien op je overschot: zelfverbruik tot ${v("zelfverbruikMet")}%.` },
};

/** Flows that run for a built set (stroom from the panels when there are panels, else from the net). */
export function builderFlows(on: ReadonlySet<AddKey>): FlowKey[] {
  const pv = on.has("zon") || on.has("pvt");
  const f: FlowKey[] = ["net-huis"];
  if (on.has("zon")) f.push("zon-omvormer");
  if (on.has("pvt")) f.push("pvt-omvormer");
  if (pv) f.push("omvormer-huis", "omvormer-net");
  if (on.has("batterij")) f.push(pv ? "omvormer-batterij" : "net-batterij", "batterij-huis");
  if (on.has("warmtepomp")) f.push(pv ? "omvormer-warmtepomp" : "net-warmtepomp", "warmtepomp-huis");
  if (on.has("pvt") && on.has("warmtepomp")) f.push("pvt-warmtepomp");
  if (on.has("laadpaal")) f.push(pv ? "omvormer-auto" : "net-auto");
  return f;
}

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

export type Scenario = { netKwh: number; gasM3: number; factuur: number };

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
  return { netKwh: Math.round(netKwh), gasM3: on.has("warmtepomp") ? 0 : m.gasM3, factuur: Math.round(factuur) };
}

export const BASELINE = scenario(new Set());
/** Bar scales (max of each bar). */
export const BAR_MAX = { netKwh: 12000, gasM3: MODEL.gasM3, factuur: BASELINE.factuur };

export const BUILDER_NOTE = `Indicatief rekenvoorbeeld: gezin met ${MODEL.huisKwh.toLocaleString("nl-BE")} kWh stroom, een elektrische wagen (${MODEL.evKm.toLocaleString("nl-BE")} km/jaar) en ${MODEL.gasM3.toLocaleString("nl-BE")} m³ gas; ${MODEL.pvKwp} kWp panelen, ${MODEL.pvtKwp} kWp PVT. Stroom ${STROOM} c/kWh, injectie ${INJECTIE} c/kWh, SCOP ${v("scopRekenwaarde")}. De extra winst per toestel is onze aanname – jouw cijfers rekenen we apart uit.`;
