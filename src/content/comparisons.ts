// PLACEHOLDER – vervang door echte gegevens
// (De vergelijkingen zelf zijn echte uitleg; de reviews, projecten en het werkgebied waarnaar
// verwezen wordt zijn voorbeelden. Alle cijfers komen uit facts.ts – indicatief.)
//
// Comparison pages /vergelijken/[slug] (01 §1.2, 02 §2.3, 05 §4). Owner: Builder 1.
// Numbers in copy are interpolated with `v()` from facts.ts – never typed by hand.
// 20-year lines use FLAT prices (00 §2.11): no invented price growth. The derivation of
// every series is written next to it. Where an option has no fact-backed cost (airco
// purchase, PVT, dynamisch contract) the page uses a table (and at most a bar chart).

import { fact, formatFactValue, type FactKey } from "./facts";
import type { ImageKey } from "./images";
import type { ComparisonSlug, ProjectSlug } from "./registry";
import type { Comparison } from "./types";

// ───────────────────────── helpers ─────────────────────────
/** Format a fact for copy: scale (e.g. €/kWh → cent), decimals, no grouping for years. */
export function v(k: FactKey, o: { scale?: number; dec?: number; year?: boolean; pre?: string } = {}): string {
  const f = fact(k);
  const s = o.scale ?? 1;
  const scaled = { ...f, estimate: false, value: f.value * s, range: f.range ? ([f.range[0] * s, f.range[1] * s] as const) : undefined };
  const num = formatFactValue(scaled, { maximumFractionDigits: o.dec ?? 2, useGrouping: o.year ? false : undefined });
  return `${f.estimate ? "ca. " : ""}${o.pre ?? ""}${num}`;
}
/** Rounded euro amount for a computed (derived) value, e.g. "ca. € 2.050". */
const eur = (n: number) => `ca. € ${new Intl.NumberFormat("nl-BE").format(Math.round(n / 10) * 10)}`;
const val = (k: FactKey) => fact(k).value;
const round = (n: number) => Math.round(n);
const years = (n: number) => Array.from({ length: n + 1 }, (_, i) => i);
const cumulative = (n: number, start: number, perYear: (y: number) => number) => {
  let total = start;
  return years(n).map((y) => {
    if (y > 0) total += perYear(y);
    return round(total);
  });
};

// ───────────────────────── types ─────────────────────────
export type ComparisonGroup = "verwarming" | "zon" | "opslag";

export const COMPARISON_GROUPS: { key: ComparisonGroup; title: string; intro: string }[] = [
  { key: "verwarming", title: "Verwarming", intro: "Je ketel vervangen, of je huis anders verwarmen? Hier staan de keuzes die het meest op je jaarfactuur wegen." },
  { key: "zon", title: "Zonne-energie", intro: "Wat haal je nog uit je dak nu de terugdraaiende teller weg is, en wanneer is PVT slimmer dan gewone panelen?" },
  { key: "opslag", title: "Opslag & contract", intro: "Batterij of niet, vast of dynamisch: keuzes die vooral lonen als ze samen met de rest van je installatie bekeken worden." },
];

export type ComparisonChart =
  | {
      kind: "line";
      title: string;
      summary: string;
      caption: string;
      xLabels: string[];
      series: { label: string; series: "base" | "good" | "mid"; points: number[] }[];
      factKeys: FactKey[];
    }
  | {
      kind: "bar";
      title: string;
      caption: string;
      bars: { label: string; value: FactKey; display: string; series: "base" | "good" | "mid" }[];
    };

export type ComparisonPage = Comparison & {
  group: ComparisonGroup;
  /** Hub card: the doubt as a question + 1-line verdict teaser. */
  question: string;
  verdict: string;
  /** Why people doubt (03 beat 2) – shown in the sticky column of the profiles section. */
  doubt: string;
  /** Lead paragraph above the table (DataBand intro). */
  tableIntro: string;
  table: { caption: string; columns: string[]; highlightCol?: number; rows: { label: string; cells: string[]; factKeys?: FactKey[] }[] };
  chart?: ComparisonChart;
  assumptions: FactKey[];
  assumptionsNote: string;
  urgency?: { k: FactKey; label: string; suffix?: string }[];
  whenTitleA: string;
  whenTitleB: string;
  /** Third stack card (photo): the combination / middle road. */
  combo: { title: string; body: string; image: ImageKey };
  /** Review id from reviews.ts for the last stack card. */
  reviewId: string;
  neitherProject?: ProjectSlug;
  neitherLinkLabel?: string;
  /** H2 of the myths section. */
  mythTitle: string;
  sources: FactKey[];
};

// ───────────────────────── scenario maths (flat prices) ─────────────────────────

// Gasketel vs warmtepomp – standaardgezin, 20 jaar.
// Nuttige warmte = gasverbruikGezin × rendementGascondensatieketel (17.000 × 0,9 = 15.300 kWh).
// Gasketel per jaar = 17.000 × gasprijsAllIn (0,11) + gasVasteKosten (175) = € 2.045.
// Warmtepomp per jaar = 15.300 / scopRekenwaarde (3,5) × stroomprijsAllIn (0,30) = ca. € 1.311.
// Warmtepomp start = prijsLuchtWaterWarmtepomp (11.000) − premieLuchtWaterCat12 (1.500) = € 9.500.
// Gasketel start = € 0: conservatief – een nieuwe gasketel kost ook geld, maar daar is geen bron voor.
// ETS2-lijn: + ets2MeerkostGasgezin (laagste schatting, 220) per jaar vanaf 2028 (jaar 3 als jaar 1 = 2026).
const HEAT = val("gasverbruikGezin") * val("rendementGascondensatieketel");
const GAS_YEAR = val("gasverbruikGezin") * val("gasprijsAllIn") + val("gasVasteKosten");
const WP_YEAR = (HEAT / val("scopRekenwaarde")) * val("stroomprijsAllIn");
const WP_START = val("prijsLuchtWaterWarmtepomp") - val("premieLuchtWaterCat12");
const ETS2_YEAR = fact("ets2MeerkostGasgezin").range![0];
const ETS2_FROM = val("ets2Start") - 2026 + 1; // jaarindex waarin ETS2 voor het eerst meetelt
const GAS_SERIES = cumulative(20, 0, () => GAS_YEAR);
const GAS_ETS2_SERIES = cumulative(20, 0, (y) => GAS_YEAR + (y >= ETS2_FROM ? ETS2_YEAR : 0));
const WP_SERIES = cumulative(20, WP_START, () => WP_YEAR);

// Zonnepanelen – voorbeeld 4 kWp, gezin met stroomverbruikGezin (3.500 kWh), 20 jaar.
// Opbrengst = 4 × pvOpbrengstPerKwp (900) = 3.600 kWh. Investering = 4 × prijsZonnepanelenPerKwp (1.300) = € 5.200.
// Zonder panelen: 3.500 × 0,30 = € 1.050/jaar.
// Met panelen, zelfverbruikZonder (30%): zelf 1.080 kWh, kopen 2.420 × 0,30 = 726, injectie 2.520 × 0,04 = 101 → € 625/jaar.
// Met panelen + slim sturen, zelfverbruikMet (65%): zelf 2.340, kopen 1.160 × 0,30 = 348, injectie 1.260 × 0,04 = 50 → € 298/jaar.
// Niet meegerekend: één vervanging van de omvormer (levensduurOmvormer), capaciteitstarief.
const PV_KWP = 4;
const PV_PROD = PV_KWP * val("pvOpbrengstPerKwp");
const USE = val("stroomverbruikGezin");
const PV_START = PV_KWP * val("prijsZonnepanelenPerKwp");
const netCost = (selfShare: number) => {
  const self = Math.min(USE, PV_PROD * selfShare);
  return (USE - self) * val("stroomprijsAllIn") - (PV_PROD - self) * val("injectievergoeding") / 100;
};
const NO_PV_YEAR = USE * val("stroomprijsAllIn");
const PV_LOW_YEAR = netCost(val("zelfverbruikZonder") / 100);
const PV_HIGH_YEAR = netCost(val("zelfverbruikMet") / 100);

// Thuisbatterij – zelfde gezin met 4 kWp, voorbeeldbatterij 5 kWh, 15 jaar (geen vervanging meegerekend).
// Investering = 5 × prijsThuisbatterijPerKwh (600) = € 3.000.
// Zonder batterij: zelfverbruik 30% → € 625/jaar (zie hierboven).
// Met batterij: zelfverbruik 50% (ONDERKANT van zelfverbruikMet: voorzichtig) → kopen 1.700 × 0,30 = 510,
// injectie 1.800 × 0,04 = 72 → € 438/jaar, min 1 kW lagere maandpiek × capaciteitstariefPerKw (56) → ca. € 382/jaar.
const BAT_KWH = 5;
const BAT_START = BAT_KWH * val("prijsThuisbatterijPerKwh");
const BAT_SELF = fact("zelfverbruikMet").range![0] / 100;
const BAT_YEAR = netCost(BAT_SELF) - 1 * val("capaciteitstariefPerKw");

const PV_ASSUMPTION = `Voorbeeldgezin met ${v("stroomverbruikGezin")} kWh stroomverbruik per jaar en een installatie van ${PV_KWP} kWp.`;

// ───────────────────────── the six comparisons ─────────────────────────
export const comparisons: ComparisonPage[] = [
  // ════════════════════════ 1. Gasketel vs warmtepomp ════════════════════════
  {
    slug: "gasketel-vs-warmtepomp",
    group: "verwarming",
    title: "Gasketel of warmtepomp in 2026? Eerlijke vergelijking",
    shortTitle: "Gasketel of warmtepomp?",
    description:
      "Is een warmtepomp vandaag nog voordeliger dan je gasketel? Vergelijk kosten per kWh warmte, premies, btw en de CO₂-taks vanaf 2028 – met Vlaamse cijfers.",
    updatedAt: "2026-11-01",
    h1: "Gasketel of warmtepomp: wat kost jouw warmte echt?",
    question: "Gasketel of warmtepomp?",
    verdict: "Meestal wint de warmtepomp per kWh warmte, op voorwaarde dat je afgiftetemperatuur laag genoeg is.",
    doubt:
      "Je hoort het overal: stroom is te duur, een warmtepomp werkt niet in een oud huis, hou je ketel. Tegelijk lees je over de CO₂-taks, een duurdere gasketel en premies die veranderen. Geen wonder dat je twijfelt. Het eerlijke antwoord verschilt per woning, en het begint bij twee vragen: hoe warm moet je water naar je radiatoren, en wat betaal je vandaag voor je gas?",
    lead: "Je ketel is aan vervanging toe, of je wil gewoon weten of je nog goed zit. Dit is de eerlijke rekensom, met de Vlaamse prijzen van vandaag.",
    kortAntwoord: `In de meeste Vlaamse woningen is een goed ontworpen warmtepomp vandaag goedkoper in gebruik dan een gasketel: ${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} cent per kWh warmte tegenover ${v("warmtekostGasPerKwhWarmte", { scale: 100, dec: 1 })} cent met gas. Het hangt wel af van je radiatoren, je isolatie en je gascontract. Daarom rekenen we het voor jouw woning uit.`,
    interesse: ["lucht-water-warmtepomp"],
    options: ["Gasketel", "Warmtepomp"],
    tableIntro:
      "Per kWh warmte is de warmtepomp goedkoper zodra ze een seizoensrendement (SCOP) boven het break-evenpunt haalt. De aankoop is duurder, maar de premie, de lagere btw en de wegvallende vaste gaskosten maken het verschil kleiner dan je denkt.",
    table: {
      caption: "Gasketel en lucht-water warmtepomp naast elkaar (standaardgezin, indicatief)",
      columns: ["Nieuwe gasketel", "Lucht-water warmtepomp"],
      highlightCol: 1,
      rows: [
        { label: "Aankoop", cells: ["Goedkoper dan een warmtepomp; prijs volgens offerte", `${v("prijsLuchtWaterWarmtepomp", { pre: "€ " })} (ca. 8 kW, zonder afgiftesysteem)`], factKeys: ["prijsLuchtWaterWarmtepomp"] },
        { label: "Premie (Mijn VerbouwPremie)", cells: ["Geen", `${v("premieLuchtWaterCat12", { pre: "€ " })} (cat. 1–2) tot ${v("premieLuchtWaterCat4", { pre: "€ " })} (cat. 4)`], factKeys: ["premieLuchtWaterCat12", "premieLuchtWaterCat4"] },
        { label: "Btw", cells: [`${v("btwGasketel")}%`, `${v("btwWarmtepomp")}% (t.e.m. 2029)`], factKeys: ["btwGasketel", "btwWarmtepomp"] },
        { label: "Kost per kWh warmte", cells: [`${v("warmtekostGasPerKwhWarmte", { scale: 100, dec: 1 })} c`, `${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} c (op netstroom)`], factKeys: ["warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte"] },
        { label: "Energiekost per jaar (voorbeeld)", cells: [`${eur(GAS_YEAR)} incl. vaste gaskosten`, eur(WP_YEAR)], factKeys: ["gasverbruikGezin", "gasprijsAllIn", "gasVasteKosten", "scopRekenwaarde", "stroomprijsAllIn"] },
        { label: "Vaste kosten aansluiting", cells: [`${v("gasVasteKosten")} € per jaar`, "Vallen weg als je de gasmeter laat afsluiten"], factKeys: ["gasVasteKosten"] },
        { label: "Levensduur", cells: [`${v("levensduurGasketel")} jaar`, "Vergelijkbaar, mits jaarlijks onderhoud"], factKeys: ["levensduurGasketel"] },
        { label: "CO₂ per jaar", cells: ["Hoog: je verbrandt aardgas in huis", `${v("co2BesparingWarmtepomp", { dec: 1 })} ton minder`], factKeys: ["co2BesparingWarmtepomp"] },
        { label: "Comfort", cells: ["Snel warm, hoge temperaturen", "Constante, zachte warmte; kan ook licht koelen"] },
        { label: "Toekomst", cells: [`Duurder door de accijnsverschuiving en ETS2 vanaf ${v("ets2Start", { year: true })}`, "Kan draaien op je eigen zonnestroom"], factKeys: ["ets2Start", "accijnsShiftGas2029"] },
      ],
    },
    chart: {
      kind: "line",
      title: "Kosten over 20 jaar (cumulatief, indicatief)",
      summary: "Cumulatieve kosten over 20 jaar voor een standaardgezin: gasketel, gasketel met ETS2 vanaf 2028 en lucht-water warmtepomp na premie.",
      caption:
        "De warmtepomp start hoger door de aankoop, maar wordt elk jaar goedkoper dan gas. Met de laagste schatting voor ETS2 vanaf 2028 komt het kantelpunt nog vroeger. Een nieuwe gasketel rekenen we gratis: zo is de vergelijking in het voordeel van gas.",
      xLabels: years(20).map((y) => (y === 0 ? "start" : `jaar ${y}`)),
      series: [
        { label: "Gasketel (vlakke prijzen)", series: "base", points: GAS_SERIES },
        { label: "Gasketel + ETS2 vanaf 2028 (lage schatting)", series: "mid", points: GAS_ETS2_SERIES },
        { label: "Warmtepomp (na premie cat. 1–2)", series: "good", points: WP_SERIES },
      ],
      factKeys: ["gasverbruikGezin", "gasprijsAllIn", "gasVasteKosten", "scopRekenwaarde", "stroomprijsAllIn", "prijsLuchtWaterWarmtepomp", "premieLuchtWaterCat12", "ets2MeerkostGasgezin"],
    },
    assumptions: [
      "gasverbruikGezin",
      "rendementGascondensatieketel",
      "gasprijsAllIn",
      "gasVasteKosten",
      "stroomprijsAllIn",
      "scopRekenwaarde",
      "prijsLuchtWaterWarmtepomp",
      "premieLuchtWaterCat12",
      "ets2MeerkostGasgezin",
      "breakEvenScop",
    ],
    assumptionsNote:
      "Vlakke prijzen: we veronderstellen géén prijsstijging of -daling over 20 jaar. Geen aankoopprijs voor de gasketel (in het voordeel van gas), geen eigen zonnestroom (in het nadeel van de warmtepomp), geen onderhoud aan beide kanten. Het gascontract weegt zwaar: bij een heel goedkoop gascontract schuift het break-evenpunt op.",
    urgency: [
      { k: "ets2Start", label: "Europese CO₂-prijs op gas (ETS2) vanaf" },
      { k: "verbodGasNieuwbouw", label: "Geen gasaansluiting meer bij nieuwbouw sinds" },
      { k: "btwGasketel", label: "Btw op een nieuwe gasketel", suffix: "%" },
    ],
    whenTitleA: "Wanneer is een nieuwe gasketel (nog) verdedigbaar?",
    whenA: [
      "Je ketel is jong en werkt goed: vervangen alleen om te vervangen loont zelden.",
      "Je plant binnen enkele jaren een grondige renovatie, met isolatie en nieuwe afgifte. Dan kies je je warmtepomp beter na die werken.",
      "Je woning is erg slecht geïsoleerd en heeft kleine radiatoren die 60 °C of meer nodig hebben, en isoleren is nu geen optie.",
      "Je hebt een uitzonderlijk goedkoop vast gascontract voor nog lange tijd.",
    ],
    whenTitleB: "Wanneer kies je voor een warmtepomp?",
    whenB: [
      "Je ketel is aan vervanging toe of valt regelmatig uit, en je wil niet nog 15 tot 20 jaar aan gas vastzitten.",
      "Je woning heeft vloerverwarming, of radiatoren die je huis warm krijgen bij 45 à 55 °C.",
      "Je hebt zonnepanelen of plant ze: dan draait je warmtepomp voor een deel op je eigen stroom.",
      "Je valt in inkomenscategorie 3 of 4 en krijgt een hogere premie, of je woning moet na aankoop een beter EPC-label halen.",
    ],
    combo: {
      title: "De middenweg: hybride, of eerst isoleren",
      body: "Een hybride warmtepomp laat je gasketel enkel nog bijspringen op de koudste dagen. Bij een ingrijpende renovatie is minstens hybride zelfs verplicht. Soms is ons advies: eerst het dak isoleren of enkele radiatoren vervangen, en daarna pas de warmtepomp. Dat staat dan zo in je berekening.",
      image: "warmtepomp-tuin",
    },
    reviewId: "r09",
    whenNeither:
      "Soms is geen van beide de juiste stap. Als je woning veel warmte verliest, levert isoleren per euro meer op dan eender welk toestel. En wie een jonge ketel heeft die goed werkt, kan beter eerst investeren in zonnepanelen met slimme sturing en de warmtepomp plannen tegen de volgende vervanging. We zeggen het je als dat zo is.",
    neitherProject: "gezin-kortrijk-geen-batterij-advies",
    neitherLinkLabel: "Lees hoe we in Kortrijk een investering afraadden",
    image: "warmtepomp-tuin",
    mythKeys: ["warmtepomp-loont-niet", "gasketel-houden", "warmtepomp-enkel-nieuwbouw"],
    mythTitle: "Wat je vaak hoort over warmtepompen en gasketels",
    faq: [
      {
        q: "Is een warmtepomp goedkoper dan een gasketel?",
        a: `Per kWh warmte meestal wel. Zolang je warmtepomp een SCOP boven ${v("breakEvenScop", { dec: 1 })} haalt, is warmte uit stroom goedkoper dan uit gas bij een gemiddeld contract. Een goed ontworpen installatie haalt ${v("scopLuchtWater35", { dec: 1 })} bij vloerverwarming en ${v("scopLuchtWater55", { dec: 1 })} bij radiatoren op 55 °C.`,
        aLong:
          "Het break-evenpunt schuift wel op met je gasprijs. Met een heel goedkoop gascontract moet de warmtepomp een hogere SCOP halen om goedkoper te zijn. Daarom rekenen we altijd met jouw contract en jouw afgiftetemperatuur.",
      },
      {
        q: "Hoeveel bespaar ik per jaar met een warmtepomp?",
        a: `In ons rekenvoorbeeld voor een gemiddeld gasgezin is dat ${v("voorbeeldBesparingWarmtepomp", { pre: "€ " })} per jaar, zonder zonnepanelen. De bandbreedte is groot: je gascontract, je isolatie en de aanvoertemperatuur bepalen waar je uitkomt. Met eigen zonnestroom, slimme sturing en een dynamisch tarief wordt de besparing groter.`,
      },
      {
        q: "Mag ik in Vlaanderen nog een gasketel plaatsen?",
        a: `In een bestaande woning mag je een kapotte gasketel vandaag nog vervangen door een nieuwe condensatieketel. Bij nieuwbouw en sloop-heropbouw mag sinds ${v("verbodGasNieuwbouw", { year: true })} geen nieuwe gasaansluiting meer. Een nieuwe gasketel betaal je wel aan ${v("btwGasketel")}% btw, terwijl een warmtepomp ${v("btwWarmtepomp")}% btw krijgt.`,
        aLong: "Over een algemeen verbod op het vervangen van gasketels in bestaande woningen circuleren plannen, maar dat is nog niet beslist. We vermelden het pas als het in de regelgeving staat.",
      },
      {
        q: "Wat is ETS2 en wat betekent het voor gas?",
        a: `ETS2 is de Europese CO₂-prijs op brandstoffen voor verwarming en vervoer. Ze start naar verwachting in ${v("ets2Start", { year: true })}. Voor een gemiddeld gasgezin schat men de meerkost op ${v("ets2MeerkostGasgezin", { pre: "€ " })} per jaar. Een ketel die je vandaag plaatst, draait daar nog vele jaren in mee.`,
      },
      {
        q: "Is een hybride warmtepomp een goed tussenstation?",
        a: `Soms wel. Een hybride warmtepomp doet het meeste werk en laat de gasketel enkel bijspringen op de koudste dagen. Dat is interessant als je woning nog niet klaar is voor volledig elektrisch. De premie is wel lager: ${v("premieHybrideCat12", { pre: "€ " })} in categorie 1 en 2, en je behoudt de vaste gaskosten.`,
      },
      {
        q: "Hoeveel btw betaal ik op een warmtepomp?",
        a: `Op een volledig elektrische warmtepomp betaal je ${v("btwWarmtepomp")}% btw, ook in woningen jonger dan tien jaar, tot en met 2029. Op een nieuwe gasketel betaal je sinds juli 2025 ${v("btwGasketel")}%. Dat verschil maakt de aankoop van een warmtepomp in verhouding goedkoper dan vroeger.`,
      },
      {
        q: "Wat als stroom duurder wordt?",
        a: "Dan stijgt ook je warmtekost, maar minder dan je zou denken: elke kWh stroom wordt meerdere kWh warmte. Met eigen zonnepanelen, een slimme sturing of een dynamisch tarief vang je een deel op. En gas wordt door de accijnsverschuiving en de Europese CO₂-prijs eerder duurder dan goedkoper.",
      },
      {
        q: "Hoeveel CO₂ bespaar ik met een warmtepomp?",
        a: `Voor een standaardgezin dat van gas overstapt, rekenen we op ${v("co2BesparingWarmtepomp", { dec: 1 })} ton CO₂ minder per jaar met de huidige Belgische stroommix. Draait je warmtepomp voor een deel op eigen zonnestroom, dan wordt de besparing nog groter.`,
      },
    ],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp", "pvt-panelen"],
    relatedComparisons: ["warmtepomp-vs-airco", "vast-vs-dynamisch-energiecontract"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt", "gezin-kortrijk-geen-batterij-advies"],
    relatedArticles: ["scop-en-cop-uitgelegd", "is-mijn-woning-geschikt-voor-een-warmtepomp", "mijn-verbouwpremie-voor-energie"],
    relatedPosts: ["loont-een-warmtepomp-nog-in-2026"],
    sources: [
      "warmtekostGasPerKwhWarmte",
      "warmtekostWarmtepompPerKwhWarmte",
      "breakEvenScop",
      "scopLuchtWater35",
      "scopLuchtWater55",
      "voorbeeldBesparingWarmtepomp",
      "premieLuchtWaterCat12",
      "premieLuchtWaterCat4",
      "premieHybrideCat12",
      "btwWarmtepomp",
      "btwGasketel",
      "verbodGasNieuwbouw",
      "ets2Start",
      "ets2MeerkostGasgezin",
      "co2BesparingWarmtepomp",
      "levensduurGasketel",
    ],
  },

  // ════════════════════════ 2. Met of zonder thuisbatterij ════════════════════════
  {
    slug: "met-of-zonder-thuisbatterij",
    group: "opslag",
    title: "Thuisbatterij: met of zonder? Zo reken je het uit",
    shortTitle: "Met of zonder thuisbatterij?",
    description:
      "Loont een thuisbatterij nu de terugdraaiende teller weg is en het capaciteitstarief er is? Wanneer wel, wanneer niet – eerlijk berekend met Vlaamse cijfers.",
    updatedAt: "2026-11-01",
    h1: "Met of zonder thuisbatterij?",
    question: "Met of zonder thuisbatterij?",
    verdict: "Het hangt af van je avondverbruik, je panelen en je contract. Vaak loont slim sturen eerst meer.",
    doubt:
      "Een batterij voelt als de logische volgende stap na zonnepanelen. Verkopers noemen ze onmisbaar, de buurman zegt dat je ze nooit terugverdient. Beide hebben soms gelijk. Wat telt, is hoeveel zonnestroom jij overdag over hebt, hoeveel je 's avonds verbruikt, hoe hoog je pieken zijn en welk contract je hebt. Die vier dingen bepalen of een batterij geld verdient of geld kost.",
    lead: "Je panelen produceren overdag, jij verbruikt 's avonds. Een batterij lijkt de logische oplossing. Soms is ze dat, soms niet.",
    kortAntwoord: `Een thuisbatterij loont als ze op meerdere fronten tegelijk werkt: meer zelfverbruik, een lagere maandpiek voor het capaciteitstarief en laden in goedkope uren met een dynamisch contract. Met een kleine installatie, weinig avondverbruik en een vast contract verdien je een batterij van ${v("prijsThuisbatterijPerKwh", { pre: "€ " })} per kWh vaak niet terug. Dan zeggen we dat.`,
    interesse: ["thuisbatterij", "zonnepanelen"],
    options: ["Zonder batterij", "Met batterij"],
    tableIntro:
      "Een batterij verdient geld op drie manieren: zonnestroom bewaren in plaats van ze voor enkele centen te injecteren, je maandpiek afvlakken en goedkoop laden in de goedkoopste uren. Hoe meer van die drie bij jou spelen, hoe sneller ze zich terugbetaalt.",
    table: {
      caption: "Zonnepanelen zonder en met thuisbatterij (voorbeeldgezin, indicatief)",
      columns: ["Zonder batterij", "Met batterij"],
      highlightCol: 1,
      rows: [
        { label: "Aankoop", cells: ["€ 0 extra", `${v("prijsThuisbatterijPerKwh", { pre: "€ " })} per kWh opslag`], factKeys: ["prijsThuisbatterijPerKwh"] },
        { label: "Premie", cells: ["–", "Geen premie meer in Vlaanderen"], factKeys: ["prijsThuisbatterijPerKwh"] },
        { label: "Btw (woning > 10 jaar)", cells: ["–", `${v("btwZonnepanelenBatterij")}%`], factKeys: ["btwZonnepanelenBatterij"] },
        { label: "Zelfverbruik zonnestroom", cells: [`${v("zelfverbruikZonder")}%`, `${v("zelfverbruikMet")}% (met slimme sturing)`], factKeys: ["zelfverbruikZonder", "zelfverbruikMet"] },
        { label: "Waarde van een kWh", cells: [`Geïnjecteerd: ${v("injectievergoeding")} c`, `Zelf verbruikt: ${v("stroomprijsAllIn", { scale: 100 })} c`], factKeys: ["injectievergoeding", "stroomprijsAllIn"] },
        { label: "Capaciteitstarief", cells: ["Je piek is wat hij is", `Lagere piek: ${v("capaciteitstariefPerKw", { pre: "€ " })} per kW per jaar minder`], factKeys: ["capaciteitstariefPerKw"] },
        { label: "Dynamisch contract", cells: ["Weinig voordeel", `Laden op goedkope of negatieve uren (${v("negatievePrijsUren2025")} negatieve uren in 2025)`], factKeys: ["negatievePrijsUren2025"] },
        { label: "Back-up bij stroompanne", cells: ["Nee", "Enkel met een geschikte omvormer en noodstroomkring"] },
        { label: "Toekomst", cells: ["Later toevoegen blijft mogelijk", "Batterijprijzen dalen nog: timing telt"], factKeys: ["prijsThuisbatterijPerKwh"] },
      ],
    },
    chart: {
      kind: "line",
      title: "Kosten over 15 jaar (cumulatief, indicatief)",
      summary: `Cumulatieve stroomkost over 15 jaar voor een gezin met ${PV_KWP} kWp zonnepanelen, zonder en met een thuisbatterij van ${BAT_KWH} kWh.`,
      caption: `Met een voorzichtige aanname (zelfverbruik van ${v("zelfverbruikZonder")} naar ${Math.round(BAT_SELF * 100)}% en 1 kW lagere maandpiek) haalt de batterij het pas laat in. Met een laadpaal, warmtepomp of dynamisch contract kan dat sneller gaan, maar dat rekenen we per woning.`,
      xLabels: years(15).map((y) => (y === 0 ? "start" : `jaar ${y}`)),
      series: [
        { label: "Zonder batterij", series: "base", points: cumulative(15, 0, () => PV_LOW_YEAR) },
        { label: `Met batterij ${BAT_KWH} kWh`, series: "good", points: cumulative(15, BAT_START, () => BAT_YEAR) },
      ],
      factKeys: ["stroomverbruikGezin", "pvOpbrengstPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding", "prijsThuisbatterijPerKwh", "capaciteitstariefPerKw"],
    },
    assumptions: ["stroomverbruikGezin", "pvOpbrengstPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding", "prijsThuisbatterijPerKwh", "capaciteitstariefPerKw"],
    assumptionsNote: `${PV_ASSUMPTION} Voorbeeldbatterij van ${BAT_KWH} kWh. Vlakke prijzen, geen vervanging of degradatie van de batterij, geen dynamisch contract, 1 kW lagere maandpiek. Het zelfverbruik met batterij staat bewust aan de onderkant van de bandbreedte.`,
    urgency: [
      { k: "negatievePrijsUren2025", label: "Uren met negatieve stroomprijs in 2025" },
      { k: "capaciteitstariefPerKw", label: "Elke kW maandpiek kost per jaar", suffix: " €" },
    ],
    whenTitleA: "Wanneer laat je de batterij (nog) achterwege?",
    whenA: [
      "Je installatie is klein en je verbruikt overdag al het grootste deel van je zonnestroom.",
      "Je verbruik 's avonds is laag: weinig koken, geen warmtepomp, geen elektrische auto.",
      "Je hebt een vast contract en geen piekverbruikers die je capaciteitstarief opdrijven.",
      "Je kan je verbruik nog verschuiven naar de middag: boiler, vaatwas en wasmachine op zonnestroom kosten veel minder dan een batterij.",
    ],
    whenTitleB: "Wanneer loont een thuisbatterij wel?",
    whenB: [
      "Je produceert overdag veel meer dan je verbruikt en jullie zijn vooral 's avonds thuis.",
      "Je hebt een warmtepomp, een elektrische auto of een inductiekookplaat die samen hoge pieken maken.",
      "Je hebt of neemt een dynamisch contract en wil laden in de goedkoopste uren.",
      "Je omvormer is aan vervanging toe: dan neem je meteen een hybride omvormer die met een batterij kan samenwerken.",
    ],
    combo: {
      title: "Eerst slim sturen, later misschien een batterij",
      body: "Vaak rekenen we eerst een goedkopere stap uit: de boiler of warmtepomp laten draaien op zonne-overschot, de auto overdag laden en een omvormer kiezen die batterij-klaar is. Zo stijgt je zelfverbruik meteen. De batterij plannen we in wanneer ze bij jouw verbruik echt opbrengt, of wanneer de prijs verder gedaald is.",
      image: "thuisbatterij-berging",
    },
    reviewId: "r02",
    whenNeither:
      "Zonder zonnepanelen, zonder dynamisch contract en zonder grote pieken heeft een batterij weinig om te doen. Dan is ze een dure doos aan de muur. In zo'n geval rekenen we eerst uit wat zonnepanelen of het verschuiven van je verbruik opleveren. In Kortrijk raadden we een gezin om die reden een batterij af.",
    neitherProject: "gezin-kortrijk-geen-batterij-advies",
    neitherLinkLabel: "Bekijk waarom we in Kortrijk géén batterij plaatsten",
    image: "thuisbatterij-berging",
    mythKeys: ["batterij-loont-nooit", "capaciteitstarief-straf"],
    mythTitle: "Wat je vaak hoort over thuisbatterijen",
    faq: [
      {
        q: "Loont een batterij als ik weinig overdag verbruik?",
        a: "Juist dan heeft een batterij het meeste te doen: ze bewaart het overschot van de middag voor de avond. Maar of ze ook loont, hangt af van hoeveel overschot er is en hoeveel je 's avonds verbruikt. Met een kleine installatie of een laag avondverbruik blijft er te weinig over om de batterij terug te verdienen.",
      },
      {
        q: "Hoeveel verhoogt een batterij mijn zelfverbruik?",
        a: `Zonder sturing ligt het zelfverbruik van een gezin dat overdag weinig thuis is, op ${v("zelfverbruikZonder")}%. Met slimme sturing en eventueel een batterij is ${v("zelfverbruikMet")}% haalbaar. De bovenkant van die bandbreedte haal je meestal enkel met een batterij of een elektrische auto die overdag laadt.`,
      },
      {
        q: "Hoeveel bespaar ik op het capaciteitstarief?",
        a: `Elke kW die je maandpiek lager ligt, scheelt ${v("capaciteitstariefPerKw", { pre: "€ " })} per jaar, afhankelijk van je netgebied. Iedereen betaalt minstens voor ${v("capaciteitstariefMinimumKw")} kW. Een batterij die bijspringt tijdens het koken of laden, kan je piek één tot enkele kW verlagen, als je piek nu hoger ligt dan dat minimum.`,
      },
      {
        q: "Wat is de terugverdientijd van een thuisbatterij?",
        a: "Dat verschilt sterk per gezin. In ons voorzichtige rekenvoorbeeld zonder dynamisch contract duurt het meer dan tien jaar. Met een warmtepomp, een elektrische auto en een dynamisch tarief kan het beduidend sneller. Een eerlijke terugverdientijd kunnen we pas geven als we jouw verbruik per kwartier bekijken.",
      },
      {
        q: "Moet ik wachten tot batterijen goedkoper worden?",
        a: `Batterijen worden inderdaad goedkoper: vandaag ${v("prijsThuisbatterijPerKwh", { pre: "€ " })} per kWh geïnstalleerd, en dalend. Daarom plannen we ze soms bewust later in. Wat je wel nu kan doen: een omvormer kiezen die batterij-klaar is en je verbruik slim verschuiven. Dan is het later een kleine stap.`,
      },
      {
        q: "Batterij, of liever een warmtepompboiler of slim laden?",
        a: "Vaak levert verschuiven meer op per euro dan opslaan. Een warmtepompboiler of een laadpaal die op zonne-overschot laadt, gebruikt je zonnestroom zonder dure opslag. Een batterij is dan de laatste stap, voor het verbruik dat je echt niet kan verschuiven.",
      },
    ],
    relatedServices: ["thuisbatterij", "zonnepanelen", "omvormers"],
    relatedComparisons: ["met-of-zonder-zonnepanelen", "vast-vs-dynamisch-energiecontract"],
    relatedProjects: ["gezin-kortrijk-geen-batterij-advies", "rijwoning-antwerpen-zon-batterij"],
    relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "wat-is-het-capaciteitstarief", "dynamisch-tarief-uitgelegd"],
    relatedPosts: ["capaciteitstarief-verlagen-zo-doe-je-het"],
    sources: [
      "prijsThuisbatterijPerKwh",
      "btwZonnepanelenBatterij",
      "zelfverbruikZonder",
      "zelfverbruikMet",
      "injectievergoeding",
      "stroomprijsAllIn",
      "capaciteitstariefPerKw",
      "capaciteitstariefMinimumKw",
      "negatievePrijsUren2025",
    ],
  },

  // ════════════════════════ 3. Met of zonder zonnepanelen ════════════════════════
  {
    slug: "met-of-zonder-zonnepanelen",
    group: "zon",
    title: "Zonnepanelen nog rendabel zonder terugdraaiende teller?",
    shortTitle: "Met of zonder zonnepanelen?",
    description:
      "Zonder terugdraaiende teller en met lage injectievergoeding: lonen zonnepanelen nog? We tonen wanneer wel, wanneer niet, met Vlaamse prijzen en opbrengst.",
    updatedAt: "2026-11-01",
    h1: "Zonnepanelen: met of zonder, en hoeveel?",
    question: "Met of zonder zonnepanelen?",
    verdict: "Ja, maar anders dan vroeger: het rendement zit in wat je zelf verbruikt, niet in wat je injecteert.",
    doubt:
      "Sinds de terugdraaiende teller weg is, lees je dat zonnepanelen niet meer lonen. Tegelijk liggen er meer panelen op Vlaamse daken dan ooit. Allebei klopt een beetje: wie alles injecteert, verdient weinig. Wie zijn eigen stroom gebruikt, verdient zijn panelen nog altijd terug. De vraag is dus niet óf je panelen legt, maar hoeveel, en wat je ermee doet.",
    lead: "De terugdraaiende teller is weg en voor geïnjecteerde stroom krijg je bijna niets. Toch kunnen zonnepanelen nog altijd goed renderen, als je ze slim inzet.",
    kortAntwoord: `Ja, zonnepanelen kunnen in Vlaanderen nog altijd rendabel zijn, maar het rendement komt uit zelfverbruik. Een zelf verbruikte kWh bespaart ${v("stroomprijsAllIn", { scale: 100 })} cent, een geïnjecteerde levert ${v("injectievergoeding")} cent op. Met slimme sturing verdien je een installatie terug in ${v("terugverdientijdZonnepanelen")} jaar; met weinig zelfverbruik duurt het langer.`,
    interesse: ["zonnepanelen"],
    options: ["Zonder zonnepanelen", "Met zonnepanelen"],
    tableIntro:
      "Zonnepanelen zijn goedkoper geworden en leveren nog evenveel op als vroeger. Wat veranderde, is wat een kWh waard is. Wie zijn stroom zelf gebruikt, wint veel. Wie alles injecteert, wint weinig.",
    table: {
      caption: "Zonder en met zonnepanelen (voorbeeldgezin, indicatief)",
      columns: ["Zonder panelen", "Met panelen"],
      highlightCol: 1,
      rows: [
        { label: "Aankoop", cells: ["€ 0", `${v("prijsZonnepanelenPerKwp", { pre: "€ " })} per kWp (incl. omvormer)`], factKeys: ["prijsZonnepanelenPerKwp"] },
        { label: "Opbrengst", cells: ["–", `${v("pvOpbrengstPerKwp")} kWh per kWp per jaar`], factKeys: ["pvOpbrengstPerKwp"] },
        { label: "Premie", cells: ["–", "Geen premie meer; wel lagere btw in oudere woningen"] },
        { label: "Btw (woning > 10 jaar)", cells: ["–", `${v("btwZonnepanelenBatterij")}%`], factKeys: ["btwZonnepanelenBatterij"] },
        { label: "Waarde zelf verbruikte kWh", cells: [`Je betaalt ${v("stroomprijsAllIn", { scale: 100 })} c per kWh`, `Je bespaart ${v("stroomprijsAllIn", { scale: 100 })} c per kWh`], factKeys: ["stroomprijsAllIn"] },
        { label: "Waarde geïnjecteerde kWh", cells: ["–", `${v("injectievergoeding")} c (afhankelijk van je leverancier)`], factKeys: ["injectievergoeding"] },
        { label: "Zelfverbruik", cells: ["–", `${v("zelfverbruikZonder")}% zonder sturing, ${v("zelfverbruikMet")}% met sturing`], factKeys: ["zelfverbruikZonder", "zelfverbruikMet"] },
        { label: "Terugverdientijd", cells: ["–", `${v("terugverdientijdZonnepanelen")} jaar`], factKeys: ["terugverdientijdZonnepanelen"] },
        { label: "Onderhoud", cells: ["–", `Omvormer gaat ${v("levensduurOmvormer")} jaar mee, panelen 25+ jaar`], factKeys: ["levensduurOmvormer"] },
        { label: "Voorwaarde", cells: ["–", "RESCert-installateur verplicht voor nieuwe installaties tot 5 kWp"], factKeys: ["prijsZonnepanelenPerKwp"] },
      ],
    },
    chart: {
      kind: "line",
      title: "Kosten over 20 jaar (cumulatief, indicatief)",
      summary: `Cumulatieve stroomkost over 20 jaar voor een gezin zonder panelen, met ${PV_KWP} kWp zonder sturing, en met ${PV_KWP} kWp en slimme sturing.`,
      caption:
        "Ook zonder sturing betalen de panelen zich terug, maar traag. Wie de boiler, de warmtepomp, de vaatwas of de auto op de middag laat draaien, verdient ze ongeveer twee keer zo snel terug.",
      xLabels: years(20).map((y) => (y === 0 ? "start" : `jaar ${y}`)),
      series: [
        { label: "Zonder panelen", series: "base", points: cumulative(20, 0, () => NO_PV_YEAR) },
        { label: `${PV_KWP} kWp, zonder sturing`, series: "mid", points: cumulative(20, PV_START, () => PV_LOW_YEAR) },
        { label: `${PV_KWP} kWp + slim sturen`, series: "good", points: cumulative(20, PV_START, () => PV_HIGH_YEAR) },
      ],
      factKeys: ["stroomverbruikGezin", "pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding"],
    },
    assumptions: ["stroomverbruikGezin", "pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding", "levensduurOmvormer", "terugverdientijdZonnepanelen"],
    assumptionsNote: `${PV_ASSUMPTION} Vlakke prijzen, geen vervanging van de omvormer meegerekend (die komt er in 20 jaar doorgaans één keer bij), geen effect op het capaciteitstarief, geen degradatie van de panelen.`,
    urgency: [
      { k: "stroomprijsAllIn", label: "Wat je per gekochte kWh betaalt", suffix: " €" },
      { k: "injectievergoeding", label: "Wat je per geïnjecteerde kWh krijgt", suffix: " c" },
    ],
    whenTitleA: "Wanneer wacht je beter, of kies je kleiner?",
    whenA: [
      "Je dak ligt grotendeels in de schaduw, of is te klein om iets zinvols te leggen.",
      "Je verbruikt overdag bijna niets en kan niets naar de middag verschuiven.",
      "Je dak moet binnen enkele jaren vernieuwd worden: leg de panelen dan na de dakwerken.",
      "Je verhuist binnenkort en de terugverdientijd valt buiten je woonperiode.",
    ],
    whenTitleB: "Wanneer zijn zonnepanelen een goede investering?",
    whenB: [
      "Je hebt een onbeschaduwd dak op het zuiden, oosten of westen.",
      "Er is overdag verbruik: thuiswerk, een warmtepomp, een boiler of een elektrische auto.",
      "Je plant een warmtepomp of laadpaal: dan stijgt je verbruik en wordt elke eigen kWh meer waard.",
      "Je woning is ouder dan tien jaar en je betaalt het verlaagde btw-tarief.",
    ],
    combo: {
      title: "Panelen als fundament van een systeem",
      body: "Zonnepanelen alleen doen het vandaag minder goed dan vroeger. Gekoppeld aan een warmtepomp, een boiler die op zonne-overschot draait of een laadpaal, worden ze het goedkoopste stuk van je hele installatie. Daarom berekenen we het aantal panelen op je verbruik van morgen, niet enkel op dat van vandaag.",
      image: "rijwoning-zonnepanelen",
    },
    reviewId: "r07",
    whenNeither:
      "Wie een sterk beschaduwd dak heeft, of een dak dat binnenkort vernieuwd moet worden, kan beter even wachten. Ook als je bijna niets verbruikt overdag en niets kan verschuiven, rekenen we liever een kleinere installatie uit dan een vol dak. In Kortrijk adviseerden we zonnepanelen, maar bewust zonder batterij.",
    neitherProject: "gezin-kortrijk-geen-batterij-advies",
    neitherLinkLabel: "Bekijk het project in Kortrijk",
    image: "rijwoning-zonnepanelen",
    mythKeys: ["zonnepanelen-zonder-teller", "premies-weg"],
    mythTitle: "Wat je vaak hoort over zonnepanelen",
    faq: [
      {
        q: "Zijn zonnepanelen nog rendabel?",
        a: `Ja, als je een groot deel van je stroom zelf verbruikt. Een installatie kost ${v("prijsZonnepanelenPerKwp", { pre: "€ " })} per kWp en levert ${v("pvOpbrengstPerKwp")} kWh per kWp per jaar. Met slimme sturing verdien je ze terug in ${v("terugverdientijdZonnepanelen")} jaar. Panelen gaan 25 jaar of langer mee.`,
      },
      {
        q: "Wat is zelfverbruik en hoe verhoog ik het?",
        a: "Zelfverbruik is het deel van je zonnestroom dat je meteen zelf gebruikt in plaats van het aan het net te geven. Je verhoogt het door verbruik naar de middag te verschuiven: de boiler of warmtepomp op zonne-overschot, de vaatwas en wasmachine met een timer, en de auto overdag laden.",
      },
      {
        q: "Wat als ik moet betalen voor injectie met een dynamisch contract?",
        a: `Met een dynamisch contract kan injecteren op momenten met een negatieve stroomprijs geld kosten. In 2025 waren er ${v("negatievePrijsUren2025")} zulke uren, vooral rond de middag. Een omvormer die injectie kan beperken, of verbruik dat dan aanslaat, voorkomt dat je moet bijbetalen.`,
      },
      {
        q: "Hoeveel panelen zijn optimaal zonder terugdraaiende teller?",
        a: "Niet zoveel mogelijk, maar zoveel als je zinvol zelf kan verbruiken, nu en binnen enkele jaren. Plan je een warmtepomp of een elektrische auto, dan mag de installatie groter. Anders rekenen we liever iets kleiner, zodat je niet betaalt voor panelen die vooral injecteren.",
      },
      {
        q: "Wat is de terugverdientijd van zonnepanelen?",
        a: `In ons rekenvoorbeeld ${v("terugverdientijdZonnepanelen")} jaar: hoe meer zelfverbruik, hoe korter. Dat is zonder prijsstijgingen gerekend en zonder effect op het capaciteitstarief. Je eigen terugverdientijd hangt af van je dak, je verbruik en je contract.`,
      },
      {
        q: "Moet ik mijn bestaande panelen uitbreiden?",
        a: "Alleen als je verbruik gestegen is of gaat stijgen, bijvoorbeeld door een warmtepomp of een elektrische auto. Bekijk ook je omvormer: is die oud of te klein, dan combineer je een uitbreiding best met een nieuwe, batterij-klare omvormer.",
      },
    ],
    relatedServices: ["zonnepanelen", "omvormers", "thuisbatterij"],
    relatedComparisons: ["zonnepanelen-vs-pvt-panelen", "met-of-zonder-thuisbatterij"],
    relatedProjects: ["rijwoning-antwerpen-zon-batterij", "gezin-kortrijk-geen-batterij-advies"],
    relatedArticles: ["injectietarief-en-zelfverbruik", "wat-is-het-capaciteitstarief"],
    relatedPosts: ["einde-terugdraaiende-teller-wat-nu"],
    sources: [
      "prijsZonnepanelenPerKwp",
      "pvOpbrengstPerKwp",
      "btwZonnepanelenBatterij",
      "stroomprijsAllIn",
      "injectievergoeding",
      "zelfverbruikZonder",
      "zelfverbruikMet",
      "terugverdientijdZonnepanelen",
      "levensduurOmvormer",
      "negatievePrijsUren2025",
    ],
  },

  // ════════════════════════ 4. Warmtepomp vs airco ════════════════════════
  {
    slug: "warmtepomp-vs-airco",
    group: "verwarming",
    title: "Lucht-water of lucht-lucht warmtepomp (airco)?",
    shortTitle: "Warmtepomp of airco?",
    description:
      "Lucht-water of lucht-lucht: wat past bij jouw woning? Vergelijk comfort, kosten, warm water en premies – en ontdek wanneer een combinatie het slimst is.",
    updatedAt: "2026-11-01",
    h1: "Lucht-water of airco: welke warmtepomp past bij jou?",
    question: "Lucht-water of airco?",
    verdict: "Lucht-water verwarmt het hele huis en je water; airco is sterk per ruimte. Vaak is een combinatie het slimst.",
    doubt:
      "Een airco is goedkoper, een lucht-water warmtepomp is 'de echte'. Of toch niet? Veel mensen weten niet dat een airco ook een warmtepomp is, en dat ze in de juiste woning prima kan verwarmen. Andersom is een lucht-water warmtepomp niet altijd nodig. Het hangt af van je woning, je kamers en of je ook je warm water anders wil maken.",
    lead: "Beide zijn warmtepompen en beide verwarmen veel zuiniger dan gas of elektrische vuurtjes. Maar ze doen niet hetzelfde werk.",
    kortAntwoord: `Een lucht-water warmtepomp vervangt je centrale verwarming en maakt ook warm water: de keuze voor een hele woning. Een lucht-lucht warmtepomp (airco) verwarmt en koelt per ruimte en is goedkoper in aankoop. Per kWh warmte zijn beide zuinig: ${v("warmtekostAircoPerKwhWarmte", { scale: 100, dec: 1 })} tot ${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} cent, tegenover ${v("warmtekostElektrischPerKwhWarmte", { scale: 100 })} cent elektrisch.`,
    interesse: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp"],
    options: ["Lucht-water warmtepomp", "Lucht-lucht warmtepomp (airco)"],
    tableIntro:
      "Beide toestellen halen warmte uit de buitenlucht. Het verschil zit in hoe ze die warmte afgeven: via water naar je radiatoren, vloer en boiler, of via lucht rechtstreeks in de kamer.",
    table: {
      caption: "Lucht-water en lucht-lucht warmtepomp naast elkaar (indicatief)",
      columns: ["Lucht-water", "Lucht-lucht (airco)"],
      rows: [
        { label: "Wat het verwarmt", cells: ["De hele woning via radiatoren of vloerverwarming", "Eén of enkele ruimtes via binnenunits"] },
        { label: "Sanitair warm water", cells: ["Ja, via een boiler", "Nee, daar heb je een aparte oplossing voor nodig"] },
        { label: "Koelen", cells: ["Beperkt (vooral via vloerverwarming)", "Ja, volwaardig"] },
        { label: "Aankoop", cells: [`${v("prijsLuchtWaterWarmtepomp", { pre: "€ " })} (zonder afgiftesysteem)`, "Lager, afhankelijk van het aantal binnenunits"], factKeys: ["prijsLuchtWaterWarmtepomp"] },
        { label: "Rendement (SCOP)", cells: [`${v("scopLuchtWater35", { dec: 1 })} bij 35 °C, ${v("scopLuchtWater55", { dec: 1 })} bij 55 °C`, `${v("scopLuchtLucht", { dec: 1 })}`], factKeys: ["scopLuchtWater35", "scopLuchtWater55", "scopLuchtLucht"] },
        { label: "Kost per kWh warmte", cells: [`${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} c`, `${v("warmtekostAircoPerKwhWarmte", { scale: 100, dec: 1 })} c`], factKeys: ["warmtekostWarmtepompPerKwhWarmte", "warmtekostAircoPerKwhWarmte"] },
        { label: "Premie (cat. 1–2)", cells: [`${v("premieLuchtWaterCat12", { pre: "€ " })}`, `${v("premieLuchtLuchtCat12", { pre: "€ " })}, met voorwaarden`], factKeys: ["premieLuchtWaterCat12", "premieLuchtLuchtCat12"] },
        { label: "Btw", cells: [`${v("btwWarmtepomp")}%`, "Afhankelijk van woning en toestel"], factKeys: ["btwWarmtepomp"] },
        { label: "Ideaal voor", cells: ["Je gasketel of stookolieketel vervangen", "Leefruimte, zolder, veranda, tussenseizoen"] },
      ],
    },
    chart: {
      kind: "bar",
      title: "Wat kost 1 kWh warmte? (indicatief)",
      caption: "Beide warmtepompen verwarmen veel goedkoper dan elektrische verwarming en, bij een gemiddeld gascontract, ook goedkoper dan gas.",
      bars: [
        { label: "Elektrisch vuurtje of convector", value: "warmtekostElektrischPerKwhWarmte", display: `${v("warmtekostElektrischPerKwhWarmte", { scale: 100 })} c/kWh`, series: "base" },
        { label: "Gasketel", value: "warmtekostGasPerKwhWarmte", display: `${v("warmtekostGasPerKwhWarmte", { scale: 100, dec: 1 })} c/kWh`, series: "mid" },
        { label: "Lucht-water warmtepomp", value: "warmtekostWarmtepompPerKwhWarmte", display: `${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} c/kWh`, series: "good" },
        { label: "Lucht-lucht warmtepomp (airco)", value: "warmtekostAircoPerKwhWarmte", display: `${v("warmtekostAircoPerKwhWarmte", { scale: 100, dec: 1 })} c/kWh`, series: "good" },
      ],
    },
    assumptions: ["stroomprijsAllIn", "gasprijsAllIn", "scopRekenwaarde", "scopLuchtLucht", "warmtekostElektrischPerKwhWarmte", "warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte", "warmtekostAircoPerKwhWarmte"],
    assumptionsNote:
      "We tonen hier geen kostencurve over 20 jaar, omdat de aankoopprijs van een airco sterk afhangt van het aantal binnenunits en we daar geen betrouwbare bron voor hebben. De kost per kWh warmte rekent met netstroom; op eigen zonnestroom is ze lager.",
    urgency: [
      { k: "premieLuchtLuchtCat12", label: "Premie airco, categorie 1–2 (met voorwaarden)", suffix: " €" },
      { k: "premieLuchtWaterCat12", label: "Premie lucht-water, categorie 1–2", suffix: " €" },
    ],
    whenTitleA: "Wanneer kies je een lucht-water warmtepomp?",
    whenA: [
      "Je wil je gas- of stookolieketel volledig vervangen, voor verwarming én warm water.",
      "Je hebt vloerverwarming of radiatoren in de meeste kamers.",
      "Je woning heeft veel aparte kamers die allemaal warm moeten zijn.",
      "Je wil de hoogste premie en het verlaagde btw-tarief voor een warmtepomp.",
    ],
    whenTitleB: "Wanneer kies je een airco (lucht-lucht)?",
    whenB: [
      "Je wil vooral je leefruimte snel en zuinig verwarmen, en in de zomer koelen.",
      "Je zolder, veranda of bureau heeft geen of een te zwakke radiator.",
      "Je verwarmt nu met elektrische vuurtjes of convectoren: dan bespaar je meteen fors.",
      "Je woning is goed geïsoleerd en compact, met een open leefruimte.",
    ],
    combo: {
      title: "Allebei: centraal verwarmen, per ruimte bijsturen",
      body: "In veel woningen rekenen we een lucht-water warmtepomp voor de basis en een airco voor de leefruimte of de zolder. De airco vangt de koudste dagen en de zomerhitte op, zodat de lucht-water warmtepomp kleiner en op een lagere temperatuur kan werken. Dat verhoogt het rendement van allebei.",
      image: "fermette-airco",
    },
    reviewId: "r05",
    whenNeither:
      "Is je woning heel slecht geïsoleerd, dan verwarmt geen enkele warmtepomp ze zuinig. Dan is isoleren de eerste stap. En heb je een recente, goed werkende ketel, dan kan een airco voor de leefruimte voorlopig volstaan, met de grote overstap pas bij de volgende vervanging.",
    neitherProject: "fermette-brugge-airco-zonnepanelen",
    neitherLinkLabel: "Bekijk de fermette in Brugge",
    image: "fermette-airco",
    mythKeys: ["airco-geen-verwarming", "warmtepomp-enkel-nieuwbouw"],
    mythTitle: "Wat je vaak hoort over airco en warmtepompen",
    faq: [
      {
        q: "Kan een airco een warmtepomp vervangen?",
        a: "Een airco ís een warmtepomp, maar een lucht-lucht exemplaar. Ze verwarmt per ruimte en maakt geen sanitair warm water. In een compacte, goed geïsoleerde woning kan ze de hoofdverwarming zijn; in een huis met veel aparte kamers is een lucht-water warmtepomp meestal de betere keuze.",
      },
      {
        q: "Wat is goedkoper in aankoop en gebruik?",
        a: `Een airco is meestal goedkoper in aankoop, zeker voor één of twee ruimtes. In gebruik liggen ze dicht bij elkaar: ${v("warmtekostAircoPerKwhWarmte", { scale: 100, dec: 1 })} cent per kWh warmte voor een airco tegenover ${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} cent voor een lucht-water warmtepomp op netstroom.`,
      },
      {
        q: "Welke premie krijg ik voor elk?",
        a: `In inkomenscategorie 1 en 2 krijg je ${v("premieLuchtWaterCat12", { pre: "€ " })} voor een lucht-water warmtepomp en ${v("premieLuchtLuchtCat12", { pre: "€ " })} voor een lucht-lucht warmtepomp. Voor die laatste gelden sinds maart 2026 strengere voorwaarden als ze ook actief koelt. Voor hogere categorieën liggen de bedragen hoger.`,
        aLong: "We kijken je premie na in je berekening en vragen ze voor je aan.",
      },
      {
        q: "Kan ik beide combineren?",
        a: "Ja, en dat is vaak slim. Een lucht-water warmtepomp verwarmt de woning en het water op een lage temperatuur, een airco springt bij in de leefruimte en koelt in de zomer. Zo werkt elk toestel waar het het best in is.",
      },
      {
        q: "Wat met sanitair warm water?",
        a: "Een lucht-water warmtepomp maakt ook je warm water, via een boiler. Een airco doet dat niet. Kies je alleen voor een airco, dan heb je voor warm water een aparte oplossing nodig, zoals een warmtepompboiler.",
      },
      {
        q: "Welke is stiller?",
        a: "Beide hebben een buitenunit die geluid maakt, en een goede plaatsing is belangrijker dan het type. Bij een airco hoor je ook de binnenunit zachtjes blazen. We berekenen de plaatsing zo dat jij en je buren er geen last van hebben.",
      },
    ],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp", "zonnepanelen"],
    relatedComparisons: ["gasketel-vs-warmtepomp", "zonnepanelen-vs-pvt-panelen"],
    relatedProjects: ["fermette-brugge-airco-zonnepanelen", "gezinswoning-gent-warmtepomp-pvt"],
    relatedArticles: ["scop-en-cop-uitgelegd", "is-mijn-woning-geschikt-voor-een-warmtepomp", "mijn-verbouwpremie-voor-energie"],
    relatedPosts: ["loont-een-warmtepomp-nog-in-2026"],
    sources: [
      "prijsLuchtWaterWarmtepomp",
      "scopLuchtWater35",
      "scopLuchtWater55",
      "scopLuchtLucht",
      "warmtekostWarmtepompPerKwhWarmte",
      "warmtekostAircoPerKwhWarmte",
      "warmtekostElektrischPerKwhWarmte",
      "warmtekostGasPerKwhWarmte",
      "premieLuchtWaterCat12",
      "premieLuchtLuchtCat12",
      "btwWarmtepomp",
    ],
  },

  // ════════════════════════ 5. Zonnepanelen vs PVT ════════════════════════
  {
    slug: "zonnepanelen-vs-pvt-panelen",
    group: "zon",
    title: "PVT-panelen of gewone zonnepanelen?",
    shortTitle: "Zonnepanelen of PVT-panelen?",
    description:
      "PVT maakt stroom én warmte van hetzelfde dak. Wanneer is dat slimmer dan gewone zonnepanelen of een zonneboiler? Eerlijke vergelijking door ingenieurs.",
    updatedAt: "2026-11-01",
    h1: "Zonnepanelen of PVT: wat haal je meer uit je dak?",
    question: "Zonnepanelen of PVT?",
    verdict: "PVT loont vooral samen met een warmtepomp en een beperkt dak. Zonder warmtepomp zijn gewone panelen meestal logischer.",
    doubt:
      "PVT klinkt als het beste van twee werelden: stroom én warmte van hetzelfde dak. Toch bieden maar weinig installateurs het aan, en op internet vind je nauwelijks eerlijke cijfers. Dat maakt het lastig om te weten of het voor jou iets is. Het korte antwoord: PVT is geen vervanger van gewone panelen, maar een slimme partner voor een warmtepomp.",
    lead: "Een PVT-paneel maakt stroom en warmte tegelijk. Weinig installateurs bieden het aan. Wij wel, en we blijven eraan onderzoeken. Maar het is niet voor elk dak de beste keuze.",
    kortAntwoord:
      "Een PVT-paneel combineert een zonnepaneel met een warmtewisselaar: het maakt stroom én warmte van hetzelfde dak. Dat loont vooral als je een warmtepomp hebt die die warmte als bron gebruikt, en als je dak te klein is voor panelen én een zonneboiler. Zonder warmtepomp zijn gewone zonnepanelen meestal de eenvoudigere keuze. De opbrengst rekenen we per project uit.",
    interesse: ["pvt-panelen", "zonnepanelen"],
    options: ["Gewone zonnepanelen", "PVT-panelen"],
    tableIntro:
      "Voor PVT tonen we bewust geen opbrengst- of prijsgemiddelden: die hangen te sterk af van je dak, je warmtepomp en je warmwaterverbruik. Wat wel vaststaat, is wat elk paneel doet.",
    table: {
      caption: "Gewone zonnepanelen, PVT-panelen en een zonneboiler naast elkaar",
      columns: ["Zonnepanelen (PV)", "PVT-panelen", "Zonneboiler"],
      highlightCol: 1,
      rows: [
        { label: "Stroom", cells: ["Ja", "Ja", "Nee"] },
        { label: "Warmte", cells: ["Nee", "Ja", "Ja"] },
        { label: "Bronwarmte voor een warmtepomp", cells: ["Nee", "Ja, ook 's nachts en in de winter", "Nee"] },
        { label: "Opbrengst", cells: [`${v("pvOpbrengstPerKwp")} kWh per kWp per jaar`, "Per project berekend", "Per project berekend"], factKeys: ["pvOpbrengstPerKwp"] },
        { label: "Prijs", cells: [`${v("prijsZonnepanelenPerKwp", { pre: "€ " })} per kWp`, "Hoger dan PV; per project berekend", "Per project berekend"], factKeys: ["prijsZonnepanelenPerKwp"] },
        { label: "Premie", cells: ["Geen", "Geen aparte premie", "Geen premie meer sinds juli 2025"], factKeys: ["premieZonneboiler"] },
        { label: "Dakruimte", cells: ["Alleen stroom", "Stroom en warmte op dezelfde plek", "Alleen warmte"] },
        { label: "Complexiteit", cells: ["Eenvoudig", "Hydraulisch ontwerp nodig, samen met de warmtepomp", "Gemiddeld"] },
        { label: "Beste match", cells: ["Elke woning met een geschikt dak", "Woning met lucht-water of brine-water warmtepomp", "Woning met veel warmwaterverbruik zonder warmtepomp"] },
      ],
    },
    assumptions: ["pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "premieZonneboiler", "scopLuchtWater35", "scopLuchtWater55"],
    assumptionsNote:
      "Geen grafiek voor PVT: er bestaan geen betrouwbare publieke gemiddelden voor de opbrengst en de prijs van PVT in Vlaanderen. We rekenen elk PVT-project apart door, met jouw dak, je warmtepomp en je verbruik.",
    urgency: [{ k: "premieZonneboiler", label: "Premie voor zonneboiler of PVT", suffix: " €" }],
    whenTitleA: "Wanneer kies je gewone zonnepanelen?",
    whenA: [
      "Je hebt (nog) geen warmtepomp en plant er ook geen.",
      "Je dak is ruim genoeg om alles te leggen wat je zinvol kan verbruiken.",
      "Je wil de eenvoudigste en goedkoopste installatie per kWh stroom.",
      "Je warmwaterverbruik is laag.",
    ],
    whenTitleB: "Wanneer kies je PVT-panelen?",
    whenB: [
      "Je hebt of plant een warmtepomp die de warmte van de panelen als bron kan gebruiken.",
      "Je dak is beperkt en je wil er zoveel mogelijk energie uit halen.",
      "Je wil de buitenunit van een lucht-water warmtepomp vermijden of beperken.",
      "Je gezin gebruikt veel warm water, ook in de winter.",
    ],
    combo: {
      title: "PV en PVT op hetzelfde dak",
      body: "Het hoeft niet allemaal PVT te zijn. Vaak rekenen we een combinatie: een deel PVT-panelen als warmtebron voor de warmtepomp, en gewone zonnepanelen voor de rest van het dak. Zo krijg je de voordelen van PVT zonder het hele dak duurder te maken.",
      image: "pvt-dak-detail",
    },
    reviewId: "r10",
    whenNeither:
      "Ligt je dak grotendeels in de schaduw, of moet het binnenkort vernieuwd worden, dan is geen van beide vandaag de juiste keuze. En wie geen warmtepomp heeft en weinig stroom verbruikt overdag, haalt meer uit een kleine PV-installatie met slimme sturing dan uit PVT.",
    neitherProject: "gezinswoning-gent-warmtepomp-pvt",
    neitherLinkLabel: "Bekijk de PVT-woning in Gent",
    image: "pvt-dak-detail",
    mythKeys: ["zonnepanelen-zonder-teller", "premies-weg"],
    mythTitle: "Wat je vaak hoort over panelen op je dak",
    faq: [
      {
        q: "Wat is het verschil tussen PV en PVT?",
        a: "Een gewoon zonnepaneel (PV) maakt alleen stroom. Een PVT-paneel heeft achteraan een warmtewisselaar waar een vloeistof door stroomt: het maakt stroom én warmte. Die warmte gaat naar je warmtepomp of boiler. Door die koeling werkt het paneel bovendien wat efficiënter op warme dagen.",
      },
      {
        q: "Is PVT duurder?",
        a: "Ja, een PVT-paneel kost meer dan een gewoon zonnepaneel, en het hydraulische deel vraagt extra ontwerp. Daar staat tegenover dat je twee opbrengsten van hetzelfde dak haalt. Of dat bij jou opweegt, rekenen we per project uit.",
      },
      {
        q: "Levert een PVT-paneel minder stroom?",
        a: "Niet noodzakelijk. Omdat het paneel gekoeld wordt door de vloeistof, kan het op warme dagen zelfs iets efficiënter werken dan een gewoon paneel. Hoeveel het precies oplevert, hangt af van het type paneel en hoe de warmte afgevoerd wordt.",
      },
      {
        q: "Wanneer heeft PVT zin?",
        a: "Vooral wanneer je een warmtepomp hebt of plant die de warmte als bron kan gebruiken, en wanneer je dak te klein is voor zowel panelen als een zonneboiler. Zonder warmtepomp is het voordeel vaak te klein om de meerprijs te verantwoorden.",
      },
      {
        q: "PVT of zonneboiler?",
        a: "Een zonneboiler maakt alleen warm water en levert geen stroom. Een PVT-paneel doet beide. Voor de zonneboiler bestaat sinds juli 2025 geen premie meer. Heb je een warmtepomp, dan is PVT meestal de interessantere keuze omdat de warmte ook in de winter nog bruikbaar is als bron.",
      },
    ],
    relatedServices: ["pvt-panelen", "zonnepanelen", "lucht-water-warmtepomp"],
    relatedComparisons: ["met-of-zonder-zonnepanelen", "gasketel-vs-warmtepomp"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt"],
    relatedArticles: ["wat-is-een-pvt-paneel", "scop-en-cop-uitgelegd"],
    relatedPosts: ["einde-terugdraaiende-teller-wat-nu"],
    sources: ["pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "premieZonneboiler", "scopLuchtWater35", "scopLuchtWater55"],
  },

  // ════════════════════════ 6. Vast vs dynamisch contract ════════════════════════
  {
    slug: "vast-vs-dynamisch-energiecontract",
    group: "opslag",
    title: "Vast of dynamisch energiecontract: wat past bij jou?",
    shortTitle: "Vast of dynamisch contract?",
    description:
      "Met een warmtepomp, batterij of elektrische auto kan een dynamisch tarief flink besparen – of net niet. Zo kies je het juiste contract voor jouw profiel.",
    updatedAt: "2026-11-01",
    h1: "Vast of dynamisch: welk contract past bij jouw woning?",
    question: "Vast of dynamisch contract?",
    verdict: "Dynamisch loont wie verbruik kan verschuiven: met een batterij, warmtepomp of EV. Anders is vast rustiger.",
    doubt:
      "Je leest over mensen die gratis laden op een zonnige zondag, en over anderen die na een koude week een veel hogere factuur kregen. Een dynamisch contract is geen goed of slecht product: het vergroot wat je installatie al kan. Met toestellen die kunnen wachten op goedkope uren, wint het. Zonder, is het vooral onzeker.",
    lead: "Met een dynamisch contract betaal je per uur de marktprijs. Dat is een kans als je toestellen slim kan laten draaien, en een risico als dat niet lukt.",
    kortAntwoord: `Een dynamisch contract loont vooral als je een groot deel van je verbruik kan verschuiven naar goedkope uren: met een thuisbatterij, een warmtepomp met buffer of een elektrische auto die slim laadt. In 2025 waren er ${v("negatievePrijsUren2025")} uren met een negatieve stroomprijs. Zonder sturing en met veel avondverbruik is een vast contract voorspelbaarder.`,
    interesse: ["thuisbatterij", "laadpalen"],
    options: ["Vast of variabel contract", "Dynamisch contract"],
    tableIntro:
      "Een dynamisch contract is geen toestel en heeft geen aankoopprijs, maar wel een heel ander risicoprofiel. Daarom vergelijken we hier niet in euro over twintig jaar, maar in wat het van je vraagt en wat het je kan geven.",
    table: {
      caption: "Vast en dynamisch energiecontract naast elkaar",
      columns: ["Vast of variabel", "Dynamisch"],
      rows: [
        { label: "Prijs per kWh", cells: [`Vast voor de looptijd (gemiddeld ${v("stroomprijsAllIn", { scale: 100 })} c all-in)`, "Verandert elk uur met de marktprijs"], factKeys: ["stroomprijsAllIn"] },
        { label: "Voorspelbaarheid", cells: ["Hoog", "Laag: dure uren kunnen fors duurder zijn"] },
        { label: "Goedkope en negatieve uren", cells: ["Geen voordeel", `Wel: ${v("negatievePrijsUren2025")} negatieve uren in 2025`], factKeys: ["negatievePrijsUren2025"] },
        { label: "Injectie", cells: [`Vaste vergoeding (${v("injectievergoeding")} c)`, "Volgt de marktprijs; op negatieve uren kan injectie geld kosten"], factKeys: ["injectievergoeding"] },
        { label: "Nodig", cells: ["Niets", "Digitale meter, en liefst sturing van batterij, warmtepomp of laadpaal"] },
        { label: "Capaciteitstarief", cells: ["Telt even zwaar", `Telt even zwaar: alles in hetzelfde goedkope uur laden, kan je piek verhogen (${v("capaciteitstariefPerKw", { pre: "€ " })} per kW per jaar)`], factKeys: ["capaciteitstariefPerKw"] },
        { label: "Ideaal voor", cells: ["Gezinnen zonder flexibele toestellen", "Gezinnen met batterij, warmtepomp met buffer of elektrische auto"] },
        { label: "Opzeggen", cells: ["Volgens contractvoorwaarden", "Volgens contractvoorwaarden; overstappen is in Vlaanderen kosteloos voor gezinnen"] },
      ],
    },
    assumptions: ["stroomprijsAllIn", "injectievergoeding", "negatievePrijsUren2025", "capaciteitstariefPerKw"],
    assumptionsNote:
      "Geen kostengrafiek: wat een dynamisch contract oplevert, hangt volledig af van wanneer jij verbruikt en welke toestellen je kan sturen. Daar bestaat geen betrouwbaar gemiddelde voor. We rekenen het met jouw kwartierdata uit.",
    urgency: [{ k: "negatievePrijsUren2025", label: "Uren met negatieve stroomprijs in 2025" }],
    whenTitleA: "Wanneer blijf je beter bij een vast contract?",
    whenA: [
      "Je verbruikt vooral 's avonds en kan weinig verschuiven.",
      "Je hebt geen batterij, warmtepomp of elektrische auto die je slim kan sturen.",
      "Je wil precies weten wat je volgende maand betaalt.",
      "Je hebt zonnepanelen zonder omvormer die injectie kan beperken.",
    ],
    whenTitleB: "Wanneer loont een dynamisch contract?",
    whenB: [
      "Je hebt een thuisbatterij die kan laden in de goedkoopste uren en leveren in de duurste.",
      "Je warmtepomp heeft een buffer of boiler en kan haar zware werk naar goedkope uren schuiven.",
      "Je elektrische auto staat 's nachts thuis en laadt via een slimme laadpaal.",
      "Je wil je installatie automatisch laten sturen, zonder er elke dag naar om te kijken.",
    ],
    combo: {
      title: "Dynamisch, maar automatisch",
      body: "Een dynamisch contract werkt pas echt als je toestellen zelf reageren op de prijs. Daarom berekenen we het contract altijd samen met de sturing: welke toestellen kunnen schuiven, hoeveel kWh is dat per dag, en wat levert dat op na het capaciteitstarief. Lukt dat niet, dan raden we vast aan.",
      image: "laadpaal-oprit-avond",
    },
    reviewId: "r06",
    whenNeither:
      "Het contract is maar een deel van de rekening. Wie geen flexibele toestellen heeft, wint meer met zonnepanelen en een warmtepomp dan met het slimste contract. Kies je contract dus ná je installatie, niet ervoor. In Hasselt rekenden we het contract pas uit toen de laadpaal en de batterij vastlagen.",
    neitherProject: "koppel-hasselt-laadpaal-dynamisch",
    neitherLinkLabel: "Bekijk het koppel in Hasselt",
    image: "laadpaal-oprit-avond",
    mythKeys: ["capaciteitstarief-straf", "batterij-loont-nooit"],
    mythTitle: "Wat je vaak hoort over dynamische contracten",
    faq: [
      {
        q: "Wat is een dynamisch energiecontract?",
        a: "Met een dynamisch contract betaal je voor elke kWh de marktprijs van dat uur, plus vaste toeslagen en nettarieven. De prijzen voor de volgende dag zijn de dag ervoor bekend. Zo kan je je verbruik plannen in de goedkope uren, liefst automatisch.",
      },
      {
        q: "Voor wie loont een dynamisch contract?",
        a: "Vooral voor gezinnen die verbruik kunnen verschuiven: met een thuisbatterij, een warmtepomp met buffer of een elektrische auto die slim laadt. Wie vooral 's avonds verbruikt en niets kan sturen, betaalt met een dynamisch contract soms meer dan met een vast contract.",
      },
      {
        q: "Wat zijn negatieve stroomprijzen?",
        a: `Op zonnige, winderige momenten is er soms meer stroom dan vraag, en zakt de marktprijs onder nul. In 2025 gebeurde dat ${v("negatievePrijsUren2025")} uur, vooral rond de middag. Met een dynamisch contract kan je dan goedkoop laden, maar injecteren kan je op zo'n moment geld kosten.`,
      },
      {
        q: "Heb ik een digitale meter nodig?",
        a: "Ja. Een dynamisch contract rekent per uur of per kwartier af, en dat kan alleen met een digitale meter. In Vlaanderen heeft intussen bijna elk gezin er een. Via de klantenzone van je netbeheerder zie je je verbruik per kwartier.",
      },
      {
        q: "Wat is het risico van een dynamisch contract?",
        a: "Dat je net verbruikt in de dure uren: tijdens een koude, windstille winteravond kan de prijs sterk oplopen. Zonder batterij of sturing betaal je dat volle pond. Daarom adviseren we dynamisch alleen samen met automatische sturing, en met een realistische blik op je avondverbruik.",
      },
      {
        q: "Kan ik later terug naar een vast contract?",
        a: "Ja. Gezinnen kunnen in Vlaanderen kosteloos van energiecontract veranderen, met een opzegtermijn van een maand. Je zit dus niet vast aan een dynamisch contract als het bij jou minder goed uitvalt dan verwacht.",
      },
    ],
    relatedServices: ["thuisbatterij", "laadpalen", "lucht-water-warmtepomp"],
    relatedComparisons: ["met-of-zonder-thuisbatterij", "met-of-zonder-zonnepanelen"],
    relatedProjects: ["koppel-hasselt-laadpaal-dynamisch", "gezin-kortrijk-geen-batterij-advies"],
    relatedArticles: ["dynamisch-tarief-uitgelegd", "wat-is-het-capaciteitstarief"],
    relatedPosts: ["dynamisch-energiecontract-ja-of-nee"],
    sources: ["stroomprijsAllIn", "injectievergoeding", "negatievePrijsUren2025", "capaciteitstariefPerKw"],
  },
];

export function getComparison(slug: string): ComparisonPage | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getComparisonsByGroup(group: ComparisonGroup): ComparisonPage[] {
  return comparisons.filter((c) => c.group === group);
}

export const comparisonSlugs: ComparisonSlug[] = comparisons.map((c) => c.slug);
