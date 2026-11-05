// PLACEHOLDER – vervang door echte gegevens
// Content for the 7 service sales pages (/diensten/[slug]) and the /diensten hub (owner: Builder 2).
// Copy is written for the client's family (je/jij), every number comes from facts.ts via fx()/cent()/eur(),
// and PLACEHOLDER parts (guarantee terms, R&D dates, project stories) are marked as such in the UI.
// Structure per page: docs/spec/05-pages.md §3 · H1/FAQ/meta: 02-seo.md §2.2 · copy rules: 03-cro.md.

import { fact, MYTHS, type FactKey } from "./facts";
import type { ImageKey } from "./images";
import type { ArticleSlug, ComparisonSlug, PostSlug, ProjectSlug, ServiceSlug } from "./registry";
import type { FaqItem, Service } from "./types";
import type { BentoTile } from "@/components/sections/Bento";
import type { TimelineStep } from "@/components/sections/Timeline";
import type { DataBandChart } from "@/components/sections/DataBand";
import type { Stat } from "@/components/ui/charts";
import type { ComparisonTableProps } from "@/components/ui/ComparisonTable";

// ───────────────────────── Number helpers (every number from facts.ts) ─────────────────────────
type FxOptions = {
  /** Multiply the value (e.g. 100 for €/kWh → cent). */
  scale?: number;
  /** Max. fraction digits (default 2). */
  decimals?: number;
  /** Show only the central value, not the range. */
  single?: boolean;
  euro?: boolean;
  suffix?: string;
  /** Drop "ca." (regulatory values: btw %, years). */
  exact?: boolean;
  grouping?: boolean;
};

export function fx(k: FactKey, o: FxOptions = {}): string {
  const f = fact(k);
  const s = o.scale ?? 1;
  const nf = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: o.decimals ?? 2, useGrouping: o.grouping ?? true });
  const n = (x: number) => nf.format(x * s);
  const v = f.range && !o.single ? `${n(f.range[0])}–${n(f.range[1])}` : n(f.value);
  return `${f.estimate && !o.exact ? "ca. " : ""}${o.euro ? "€ " : ""}${v}${o.suffix ?? ""}`;
}
/** Price per kWh in cents ("ca. 30 cent"); facts in €/kWh are scaled, facts already in cent are not. */
export const cent = (k: FactKey, single = true) => fx(k, { scale: fact(k).unit.startsWith("cent") ? 1 : 100, decimals: 1, single, suffix: " cent" });
/** Numeric value in cents (for bar lengths in one unit). */
export const centNum = (k: FactKey) => fact(k).value * (fact(k).unit.startsWith("cent") ? 1 : 100);
/** "€ 1.500" or a range "ca. € 400–800". */
export const eur = (k: FactKey, single = false) => fx(k, { euro: true, decimals: 0, single });
/** "2028" (no grouping, no "ca."). */
export const year = (k: FactKey) => fx(k, { exact: true, grouping: false, single: true });
/** "6%". */
export const pct = (k: FactKey) => fx(k, { exact: true, single: true, suffix: "%" });

// ───────────────────────── Types ─────────────────────────
export type SizerProfile = {
  key: string;
  label: string;
  hint: string;
  result: { title: string; advice: string; noBattery?: boolean; factKeys?: FactKey[] };
};

export type RoomCardData = { room: string; heat: string; cool: string; better: string; image: ImageKey };

export type Signature =
  | { kind: "curve"; curve: "day" | "peak"; eyebrow: string; title: string; lead: string; body: string[]; factKeys: FactKey[]; link: { comparison?: ComparisonSlug; article?: ArticleSlug; label: string } }
  | { kind: "bento"; eyebrow: string; title: string; lead: string; tiles: BentoTile[]; link?: { article?: ArticleSlug; comparison?: ComparisonSlug; label: string } }
  | { kind: "timeline"; eyebrow: string; title: string; lead: string; steps: TimelineStep[] }
  | { kind: "sizer"; eyebrow: string; title: string; lead: string; profiles: SizerProfile[]; link: { article: ArticleSlug; label: string } }
  | { kind: "rail"; eyebrow: string; title: string; lead: string; rooms: RoomCardData[] };

export type SystemStep = {
  /** Partner service highlighted together with this one in the mini diagram. */
  partner?: ServiceSlug;
  eyebrow: string;
  title: string;
  titleAs?: "h2" | "h3";
  body: string[];
  factKeys?: FactKey[];
  image?: ImageKey;
};

export type ServiceContent = Service & {
  /** "een thuisbatterij" – CTA "Bereken of {productPhrase} loont voor jou". */
  productPhrase: string;
  /** Used in H2s: "Wat kost {productName} en wat levert het op?" */
  productName: string;
  serviceType: string;
  /** Hub card: "zinvol als …" (one line). */
  hubLine: string;
  hubImage: ImageKey;
  painTitle: string;
  dataBand: {
    title: string;
    lead?: string;
    mode: "stats" | "chart" | "table" | "table+chart";
    stats?: Stat[];
    chart?: DataBandChart;
    /** FactNote under the chart when bars use converted numbers instead of fact keys. */
    chartFactKeys?: FactKey[];
    table?: ComparisonTableProps;
    extra?: { title: string; rows: { label: string; k: FactKey; suffix?: string }[] };
    urgency?: { k: FactKey; label: string; suffix?: string }[];
    assumptions: FactKey[];
    assumptionsNote?: string;
    whenTrue?: string;
  };
  /** Row 4: first step = "Hoe werkt …?", then the system steps. */
  howItWorks: { title: string; body: string[]; image: ImageKey; factKeys?: FactKey[] };
  systemSteps: SystemStep[];
  advisesAgainstText: string;
  advisesAgainstLink: { project?: ProjectSlug; post?: PostSlug; label: string };
  calculatesLead: string;
  signature: Signature;
  story: { title: string; body: string; image: ImageKey; reviewId: string };
  reviewsTitle: string;
  leadHeading: string;
  complementary: ServiceSlug[];
  sources: FactKey[];
};

const calcImages: ImageKey[] = ["step-assessment", "step-design", "step-install", "step-installation"];
const withCalcImages = (items: { title: string; body: string }[]) => items.map((it, i) => ({ ...it, image: calcImages[i % calcImages.length] }));

const myth = (key: string) => MYTHS.find((m) => m.key === key);

const DELIVERABLES_BASE = ["Plaatsing door onze eigen ploeg", "AREI-keuring", "Indienststelling en uitleg", "Monitoring in een app", "Garantie (termijnen volgen)"];

// ───────────────────────── 1. Lucht-water warmtepomp ─────────────────────────
const luchtWater: ServiceContent = {
  slug: "lucht-water-warmtepomp",
  title: "Lucht-water warmtepomp",
  shortTitle: "Lucht-water warmtepomp",
  seoTitle: "Lucht-water warmtepomp: jouw gasketel eruit, berekend",
  description:
    "Kan jouw woning met een warmtepomp verwarmd worden en wat kost dat per jaar vs gas? We rekenen het uit, met Mijn VerbouwPremie en 6% btw.",
  updatedAt: "2026-11-01",
  h1: "Warm wonen zonder gasfactuur",
  productPhrase: "een warmtepomp",
  productName: "een lucht-water warmtepomp",
  serviceType: "Plaatsing lucht-water warmtepomp",
  hubLine: "Zinvol als je gasketel aan vervanging toe is of je van het gas af wil.",
  hubImage: "vbtec-warmtepomp-buitenunit",
  heroLead:
    "Je gasketel is aan vervanging toe. Wat als je volgende 'ketel' uit elke kWh stroom een veelvoud aan warmte haalt – en je gasfactuur gewoon verdwijnt?",
  image: "vbtec-architectwoning-warmtepomp",
  heroFact: {
    k: "warmtekostWarmtepompPerKwhWarmte",
    value: cent("warmtekostWarmtepompPerKwhWarmte"),
    title: `per kWh warmte met een warmtepomp, tegenover ${cent("warmtekostGasPerKwhWarmte")} met gas`,
  },
  kortAntwoord: `In de meeste Vlaamse woningen loont een lucht-water warmtepomp vandaag. Met een SCOP van ${fx("scopRekenwaarde")} kost een kWh warmte ${cent("warmtekostWarmtepompPerKwhWarmte")}, tegenover ${cent("warmtekostGasPerKwhWarmte")} met gas. Je krijgt ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")} Mijn VerbouwPremie, afhankelijk van je inkomen, en betaalt ${pct("btwWarmtepomp")} btw. Is je woning slecht geïsoleerd, dan rekenen we eerst of isoleren of hybride slimmer is.`,
  painTitle: "Je wil van het gas af, maar niet blind",
  painPoints: [
    {
      eyebrow: "Je ketel",
      title: "Je ketel draait al langer dan je wil toegeven.",
      body: "Elke winter hoop je dat hij nog één seizoen volhoudt. Valt hij in januari stil, dan beslis je onder druk – en wordt het vaak weer een gasketel, gewoon omdat dat het snelst kan.",
      tone: "D",
    },
    {
      eyebrow: "Weer gas?",
      title: "Een nieuwe gasketel voelt als geld weggooien.",
      body: `Sinds juli 2025 betaal je ${pct("btwGasketel")} btw op een nieuwe gasketel, en vanaf ${year("ets2Start")} komt er een Europese CO₂-prijs op gas bij. Een ketel die je vandaag plaatst, hangt er ${fx("levensduurGasketel", { suffix: " jaar" })}.`,
      tone: "G",
      factKeys: ["btwGasketel", "ets2Start", "levensduurGasketel"],
    },
    {
      eyebrow: "De twijfel",
      title: "Een warmtepomp voelt als een gok.",
      body: "De buurman zweert erbij, je schoonbroer zegt dat het in een oud huis nooit werkt. Wie moet je geloven? Niet de verkoper die aan je keukentafel al een bestelbon klaar heeft.",
      tone: "I",
      image: "gezin-keuken-factuur",
    },
  ],
  mythKey: "warmtepomp-loont-niet",
  dataBand: {
    title: "Wat kost een lucht-water warmtepomp en wat levert het op?",
    lead: `Een warmtepomp verbruikt stroom, en stroom is per kWh duurder dan gas. Maar omdat ze uit 1 kWh stroom meerdere kWh warmte haalt, betaal je per kWh wármte minder. Een toestel voor een gemiddelde gezinswoning kost ${eur("prijsLuchtWaterWarmtepomp")} geplaatst, zonder aanpassingen aan je radiatoren.`,
    mode: "chart",
    chart: {
      type: "bar",
      title: "Wat kost 1 kWh warmte?",
      props: {
        bars: [
          { label: "Gasketel", value: "warmtekostGasPerKwhWarmte", display: cent("warmtekostGasPerKwhWarmte"), series: "base" },
          { label: "Lucht-water warmtepomp", value: "warmtekostWarmtepompPerKwhWarmte", display: cent("warmtekostWarmtepompPerKwhWarmte"), series: "good" },
        ],
        caption: "Per kWh nuttige warmte, op netstroom en zonder zonnepanelen. Met eigen zonnestroom zakt de kost van dat deel nog verder.",
      },
    },
    stats: [
      { k: "breakEvenScop", label: "SCOP waarboven je per kWh warmte goedkoper stookt dan met gas" },
      { k: "voorbeeldBesparingWarmtepomp", label: "rekenvoorbeeld: besparing per jaar t.o.v. een gasketel", prefix: "€ " },
      { k: "co2BesparingWarmtepomp", label: "minder CO₂ per jaar in het rekenvoorbeeld", suffix: " ton" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Mijn VerbouwPremie, inkomenscategorie 1 en 2", k: "premieLuchtWaterCat12", suffix: " €" },
        { label: "Mijn VerbouwPremie, inkomenscategorie 3", k: "premieLuchtWaterCat3", suffix: " €" },
        { label: "Mijn VerbouwPremie, inkomenscategorie 4", k: "premieLuchtWaterCat4", suffix: " €" },
        { label: "Btw op een warmtepomp (t.e.m. 2029)", k: "btwWarmtepomp", suffix: "%" },
        { label: "Btw op een nieuwe gasketel", k: "btwGasketel", suffix: "%" },
      ],
    },
    urgency: [
      { k: "ets2Start", label: "Europese CO₂-prijs op gas en stookolie (ETS2) vanaf" },
      { k: "verbodGasNieuwbouw", label: "Geen gasaansluiting meer bij nieuwbouw sinds" },
    ],
    assumptions: ["gasprijsAllIn", "stroomprijsAllIn", "rendementGascondensatieketel", "scopRekenwaarde", "gasverbruikGezin", "prijsLuchtWaterWarmtepomp"],
    assumptionsNote: "Rekenvoorbeeld voor een gezin met een standaard gasverbruik, vlakke energieprijzen (geen prijsstijging verondersteld) en een goed ontworpen installatie. Jouw woning kan beter of slechter uitkomen: daarom rekenen we per kamer.",
    whenTrue: myth("warmtepomp-loont-niet")?.whenTrue,
  },
  howItWorks: {
    title: "Hoe werkt een lucht-water warmtepomp?",
    body: [
      "Een lucht-water warmtepomp werkt als een omgekeerde koelkast. De buitenunit haalt warmte uit de buitenlucht – ook als het vriest – en een compressor brengt die warmte op een hogere temperatuur. Via een warmtewisselaar gaat ze naar het water in je vloerverwarming of radiatoren, en naar een boiler voor sanitair warm water.",
      `Hoe lager de temperatuur van het water dat naar je radiatoren gaat, hoe zuiniger de warmtepomp draait. Bij vloerverwarming haalt een goed toestel een SCOP rond ${fx("scopLuchtWater35", { single: true })}; met klassieke radiatoren die heel warm water vragen eerder ${fx("scopLuchtWater55", { single: true })}. Dat verschil is precies waarom we jouw woning eerst doorrekenen.`,
      "Je hebt geen schoorsteen, geen gasaansluiting en geen jaarlijkse ketelkeuring meer nodig. Wat overblijft, is een buitenunit in de tuin of tegen de gevel en een binnenunit met boiler, vaak op de plek van je oude ketel.",
    ],
    image: "vbtec-warmtepomp-buitenunit",
    factKeys: ["scopLuchtWater35", "scopLuchtWater55"],
  },
  systemSteps: [
    {
      partner: "pvt-panelen",
      eyebrow: "Met PVT-panelen",
      title: "Hoe past een warmtepomp in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        "Een warmtepomp werkt beter naarmate de warmte die ze 'oppompt' al wat warmer is. PVT-panelen maken stroom én warmte op hetzelfde dak; die warmte kan als bron dienen voor je warmtepomp. Zo haal je meer uit een dak dat je toch al gebruikt.",
        "PVT is niet voor elke woning de juiste keuze. We berekenen per project of het verschil de meerprijs waard is.",
      ],
    },
    {
      partner: "zonnepanelen",
      eyebrow: "Met zonnepanelen",
      title: "Je warmtepomp op je eigen zonnestroom",
      body: [
        `Zonder terugdraaiende teller is elke kWh die je zelf verbruikt veel meer waard dan een kWh die je injecteert: ${cent("stroomprijsAllIn")} tegenover ${cent("injectievergoeding")}. Een warmtepomp die overdag je boiler opwarmt en je huis een graadje voorverwarmt, maakt van overschot geld.`,
        "We stellen de sturing zo in dat de warmtepomp vooral draait als de zon schijnt, zonder dat je comfort inlevert.",
      ],
      factKeys: ["stroomprijsAllIn", "injectievergoeding"],
    },
    {
      partner: "thuisbatterij",
      eyebrow: "Met slimme sturing",
      title: "Geen extra piek op je capaciteitstarief",
      body: [
        `Het capaciteitstarief rekent je gemiddelde maandpiek aan, aan ${eur("capaciteitstariefPerKw")} per kW per jaar. Een warmtepomp die slim gestuurd wordt en niet tegelijk met je oven en droogkast opstart, verhoogt die piek nauwelijks.`,
        "We rekenen de impact op jouw piek mee uit, en stellen de sturing zo in dat ze laag blijft.",
      ],
      factKeys: ["capaciteitstariefPerKw"],
    },
  ],
  advisesAgainst: [
    "Dak en muren nog niet geïsoleerd",
    "Kleine radiatoren die heel warm water vragen",
    "Jonge gasketel en een grote verbouwing op komst",
    "Geen goede plek voor de buitenunit",
  ],
  advisesAgainstText:
    "In die gevallen rekenen we eerst wat isoleren of een paar grotere radiatoren opleveren, of stellen we een hybride warmtepomp voor als tussenstap. Je krijgt het zwart op wit – ook als ons advies 'nog even wachten' is.",
  advisesAgainstLink: { post: "waarom-wij-soms-nee-zeggen", label: "Waarom we soms nee zeggen" },
  calculatesLead: "Geen vuistregels, wel jouw woning: elke kamer, elke radiator, jouw verbruik.",
  calculates: withCalcImages([
    { title: "Warmteverlies per kamer", body: "We berekenen hoeveel warmte elke ruimte verliest, zodat je warmtepomp niet te groot en niet te klein is." },
    { title: "Radiatorcheck & aanvoertemperatuur", body: "Welke radiatoren volstaan, welke moeten groter? En met welke watertemperatuur blijft je huis comfortabel?" },
    { title: "SCOP in jouw woning", body: "Het rendement hangt af van je afgiftesysteem. We rekenen met jouw temperatuur, niet met de folder." },
    { title: "Impact op je capaciteitstarief", body: "We kijken hoe de warmtepomp je maandpiek beïnvloedt en hoe slimme sturing die laag houdt." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Stooklijn afgesteld op je woning", "Premieaanvraag Mijn VerbouwPremie"],
  signature: {
    kind: "bento",
    eyebrow: "Klaar voor een warmtepomp?",
    title: "Is jouw woning klaar voor een warmtepomp?",
    lead: "Vloerverwarming is mooi meegenomen, maar geen voorwaarde. Deze vier dingen bepalen of het bij jou loont.",
    tiles: [
      { kind: "stat", k: "scopLuchtWater35", label: "SCOP bij lage temperatuur (vloerverwarming, grote radiatoren)", decimals: 1, factKeys: ["scopLuchtWater35"] },
      {
        kind: "grey",
        title: "Radiatoren & isolatie",
        body: "Dakisolatie, dubbel glas en een paar grotere of lage-temperatuurradiatoren in de leefruimtes: vaak is dat al genoeg om met een warmtepomp comfortabel te verwarmen.",
        tags: ["Dakisolatie", "Dubbel glas", "LT-radiatoren", "Kierdicht"],
      },
      { kind: "photo", image: "vbtec-warmtepomp-tuin-unit", title: "Buitenunit in de tuin", body: "We kiezen samen een plek met weinig geluidshinder voor jou en je buren." },
      { kind: "stat", k: "scopLuchtWater55", label: "SCOP bij hoge temperatuur (klassieke radiatoren)", decimals: 1, factKeys: ["scopLuchtWater55"] },
      {
        kind: "wide",
        title: "Hybride als tussenstap",
        body: `Is je woning nog niet klaar? Een hybride warmtepomp laat je gasketel enkel bijspringen op de koudste dagen. Bij een ingrijpende energetische renovatie is minstens hybride trouwens verplicht sinds ${year("hybrideVerplichtIER")}, en ook hybride krijgt een premie (${eur("premieHybrideCat12")} in categorie 1 en 2).`,
        tone: "grey",
      },
    ],
    link: { article: "is-mijn-woning-geschikt-voor-een-warmtepomp", label: "Lees: is mijn woning geschikt voor een warmtepomp?" },
  },
  featuredProject: "gezinswoning-gent-warmtepomp-pvt",
  story: {
    title: "Een jaren '70-woning in Gent, zonder gasfactuur",
    body: "Te oud voor een warmtepomp, dachten ze. Na de berekening per kamer bleek: twee radiatoren vervangen en PVT op het dak.",
    image: "jaren70-woning",
    reviewId: "r01",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun warmtepomp",
  leadHeading: "Bereken of een warmtepomp loont in jouw woning.",
  complementary: ["pvt-panelen", "zonnepanelen"],
  relatedServices: ["pvt-panelen", "zonnepanelen", "lucht-lucht-warmtepomp"],
  relatedComparisons: ["gasketel-vs-warmtepomp", "warmtepomp-vs-airco"],
  relatedArticles: ["scop-en-cop-uitgelegd", "is-mijn-woning-geschikt-voor-een-warmtepomp", "mijn-verbouwpremie-voor-energie"],
  relatedPosts: ["loont-een-warmtepomp-nog-in-2026"],
  relatedProjects: ["gezinswoning-gent-warmtepomp-pvt", "nieuwbouw-leuven-all-electric"],
  interesse: ["lucht-water-warmtepomp"],
  sources: [
    "warmtekostGasPerKwhWarmte",
    "warmtekostWarmtepompPerKwhWarmte",
    "breakEvenScop",
    "scopLuchtWater35",
    "scopLuchtWater55",
    "premieLuchtWaterCat12",
    "premieLuchtWaterCat3",
    "premieLuchtWaterCat4",
    "btwWarmtepomp",
    "btwGasketel",
    "verbodGasNieuwbouw",
    "ets2Start",
    "voorbeeldBesparingWarmtepomp",
  ],
  faq: [
    {
      q: "Loont een warmtepomp tegenover een gasketel?",
      a: `In de meeste woningen wel. Per kWh warmte betaal je met een warmtepomp ${cent("warmtekostWarmtepompPerKwhWarmte")}, met gas ${cent("warmtekostGasPerKwhWarmte")}. In ons rekenvoorbeeld bespaart een gezin ${eur("voorbeeldBesparingWarmtepomp")} per jaar, nog zonder zonnepanelen. Hoeveel het bij jou is, hangt af van je isolatie, radiatoren en gascontract.`,
      aLong: `De break-even ligt bij een SCOP van ${fx("breakEvenScop")}: daarboven stook je goedkoper dan met gas. Heb je een heel goedkoop gascontract, dan schuift dat punt op – daarom rekenen we altijd met jouw contract.`,
    },
    {
      q: "Werkt een warmtepomp met gewone radiatoren?",
      a: `Vaak wel. Met klassieke radiatoren die warm water van 55 °C vragen, haalt een warmtepomp nog een SCOP rond ${fx("scopLuchtWater55", { single: true })}. Door enkele radiatoren te vergroten of te vervangen door lage-temperatuurradiatoren zakt die temperatuur en stijgt het rendement. We berekenen per kamer welke radiatoren volstaan.`,
    },
    {
      q: "Wat is een goede SCOP?",
      a: `De SCOP is het rendement over een heel stookseizoen. Boven ${fx("breakEvenScop")} verwarm je per kWh goedkoper dan met gas. Een goed ontworpen installatie met vloerverwarming haalt ${fx("scopLuchtWater35")}. Belangrijker dan het getal in de folder is de temperatuur waarmee jouw woning toekomt.`,
    },
    {
      q: "Hoeveel premie krijg ik in 2026?",
      a: `Voor een lucht-water warmtepomp krijg je via Mijn VerbouwPremie ${eur("premieLuchtWaterCat12")} in inkomenscategorie 1 en 2, ${eur("premieLuchtWaterCat3")} in categorie 3 en ${eur("premieLuchtWaterCat4")} in categorie 4. Daarbovenop betaal je ${pct("btwWarmtepomp")} btw in plaats van het gewone tarief. Wij vragen de premie voor je aan.`,
      aLong: "Premiebedragen en voorwaarden worden regelmatig aangepast. De bedragen hier zijn de stand van maart 2026; we controleren ze opnieuw op het moment van je offerte.",
    },
    {
      q: "Hoeveel stroom verbruikt een warmtepomp per jaar?",
      a: `Dat hangt af van je warmtevraag. Vuistregel: deel de warmte die je nu met gas maakt door de SCOP. Een gezin dat ${fx("gasverbruikGezin")} kWh gas verbruikt, heeft met een SCOP van ${fx("scopRekenwaarde")} ongeveer een kwart tot een derde daarvan aan stroom nodig. Wij rekenen het exact voor jouw woning.`,
    },
    {
      q: "Maakt een warmtepomp lawaai?",
      a: "Moderne buitenunits zijn stil, maar niet geruisloos. Het geluid hangt af van het toestel, de plaats en de ondergrond. Daarom kiezen we bij het plaatsbezoek samen een plek met weinig weerkaatsing, op trillingsdempers en op voldoende afstand van slaapkamers en buren.",
    },
    {
      q: "Moet mijn woning perfect geïsoleerd zijn?",
      a: "Nee. Dakisolatie en dubbel glas maken wel een groot verschil. Veel woningen van na de jaren zeventig kunnen met een paar aanpassingen aan de radiatoren al prima met een warmtepomp. Is je woning echt slecht geïsoleerd, dan raden we eerst isoleren of een hybride warmtepomp aan.",
    },
    {
      q: "Mag ik mijn gasketel nog vervangen door een nieuwe?",
      a: `Ja, in een bestaande woning mag je vandaag een kapotte gasketel nog vervangen. Bij nieuwbouw is een gasaansluiting sinds ${year("verbodGasNieuwbouw")} niet meer toegelaten. Een nieuwe gasketel betaalt wel ${pct("btwGasketel")} btw en vanaf ${year("ets2Start")} komt er een CO₂-prijs op gas bij.`,
      aLong: "Over een algemeen verbod om bestaande gasketels te vervangen zijn plannen aangekondigd, maar niets is beslist. We baseren ons advies enkel op wat vandaag geldt.",
    },
  ],
};

// ───────────────────────── 2. Thuisbatterij ─────────────────────────
const thuisbatterij: ServiceContent = {
  slug: "thuisbatterij",
  title: "Thuisbatterij",
  shortTitle: "Thuisbatterij",
  seoTitle: "Thuisbatterij: loont ze voor jou? Eerlijk doorgerekend",
  description:
    "Een thuisbatterij loont niet voor iedereen. We rekenen met jouw verbruik, piek en contract of ze zich terugverdient – en zeggen het eerlijk als dat niet zo is.",
  updatedAt: "2026-11-01",
  h1: "Een thuisbatterij, alleen als ze jou iets oplevert",
  productPhrase: "een thuisbatterij",
  productName: "een thuisbatterij",
  serviceType: "Plaatsing thuisbatterij",
  hubLine: "Zinvol als je 's avonds veel verbruikt, een EV hebt of een dynamisch contract.",
  hubImage: "thuisbatterij-berging",
  heroLead: "Je panelen produceren overdag. Jij verbruikt 's avonds. Een batterij kan dat gat dichten – maar alleen als de cijfers voor jóuw gezin kloppen.",
  image: "thuisbatterij-berging",
  heroFact: {
    k: "prijsThuisbatterijPerKwh",
    value: eur("prijsThuisbatterijPerKwh"),
    title: "per kWh opslag, geplaatst – en de prijzen dalen",
  },
  kortAntwoord: `Een thuisbatterij loont als ze op drie fronten werkt: je zonnestroom 's avonds zelf gebruiken (${cent("stroomprijsAllIn")} in plaats van ${cent("injectievergoeding")} per kWh), je maandpiek voor het capaciteitstarief verlagen en goedkoop laden met een dynamisch contract. Bij een kleine installatie, laag avondverbruik en een vast contract loont ze vaak niet. Dan zeggen we dat.`,
  painTitle: "Je zonnestroom gaat weg voor een paar cent",
  painPoints: [
    {
      eyebrow: "Overdag",
      title: "Je panelen draaien, maar jij bent niet thuis.",
      body: `Je stroom gaat het net op voor ${cent("injectievergoeding", false)} per kWh. 's Avonds koop je dezelfde kWh terug aan ${cent("stroomprijsAllIn", false)}. Dat voelt verkeerd – en dat is het ook.`,
      tone: "D",
      factKeys: ["injectievergoeding", "stroomprijsAllIn"],
    },
    {
      eyebrow: "Je piek",
      title: "Sinds het capaciteitstarief betaal je ook voor je pieken.",
      body: `Koken, wassen en de auto inpluggen rond zes uur: dat ene kwartier bepaalt mee je factuur. Een gemiddeld gezin betaalt ${eur("capaciteitstariefGemiddeldPerJaar")} per jaar aan capaciteitstarief.`,
      tone: "G",
      factKeys: ["capaciteitstariefGemiddeldPerJaar"],
    },
    {
      eyebrow: "De twijfel",
      title: "Iedereen verkoopt batterijen. Niemand rekent.",
      body: "De ene zegt dat je ze nooit terugverdient, de andere wil je er morgen één leveren. Wat je echt wil weten: loont ze voor jóuw verbruik, of niet?",
      tone: "I",
      image: "gezin-keuken-factuur",
    },
  ],
  mythKey: "batterij-loont-nooit",
  dataBand: {
    title: "Wat kost een thuisbatterij en wat levert ze op?",
    lead: `Een batterij verdient zichzelf niet terug met één truc, maar met drie. Hoeveel elk van die drie bij jou oplevert, hangt af van je verbruik, je panelen en je contract. Er is geen premie voor een thuisbatterij; in woningen ouder dan 10 jaar betaal je wel ${pct("btwZonnepanelenBatterij")} btw.`,
    mode: "chart",
    chart: {
      type: "bar",
      title: "Drie manieren waarop een batterij kan opbrengen",
      props: {
        bars: [
          { label: "Geïnjecteerde kWh (zonder batterij)", value: centNum("injectievergoeding"), display: `${cent("injectievergoeding")} per kWh`, series: "base" },
          { label: "Zelf verbruikte kWh (met batterij)", value: centNum("stroomprijsAllIn"), display: `${cent("stroomprijsAllIn")} per kWh`, series: "good" },
        ],
        caption: `1 · Zelfverbruik: elke kWh die je 's avonds uit je batterij haalt, hoef je niet aan de netprijs te kopen. 2 · Lagere piek: elke kW minder maandpiek bespaart ${eur("capaciteitstariefPerKw")} per jaar. 3 · Goedkope uren: met een dynamisch contract laad je op momenten dat stroom bijna niets of zelfs minder dan niets kost.`,
      },
    },
    chartFactKeys: ["injectievergoeding", "stroomprijsAllIn"],
    stats: [
      { k: "prijsThuisbatterijPerKwh", label: "prijs per kWh opslagcapaciteit, geplaatst", prefix: "€ " },
      { k: "capaciteitstariefPerKw", label: "besparing per kW lagere maandpiek, per jaar", prefix: "€ " },
      { k: "negatievePrijsUren2025", label: "uren met een negatieve stroomprijs in 2025" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Btw op een batterij in een woning ouder dan 10 jaar", k: "btwZonnepanelenBatterij", suffix: "%" },
        { label: "Minimaal aangerekende maandpiek", k: "capaciteitstariefMinimumKw", suffix: " kW" },
        { label: "Vergoeding voor geïnjecteerde stroom", k: "injectievergoeding", suffix: " c/kWh" },
      ],
    },
    assumptions: ["prijsThuisbatterijPerKwh", "injectievergoeding", "stroomprijsAllIn", "capaciteitstariefPerKw", "negatievePrijsUren2025", "capaciteitstariefMinimumKw"],
    assumptionsNote: `Er bestaat in Vlaanderen geen premie voor thuisbatterijen. De minimale maandpiek van ${fx("capaciteitstariefMinimumKw")} kW betaal je sowieso: lager pieken dan dat levert niets meer op – ook dat rekenen we mee.`,
    whenTrue: myth("batterij-loont-nooit")?.whenTrue,
  },
  howItWorks: {
    title: "Hoe werkt een thuisbatterij?",
    body: [
      "Een thuisbatterij slaat stroom op die je panelen overdag te veel maken, en geeft die terug zodra je huis meer vraagt dan de zon levert. In plaats van je overschot voor een paar cent te injecteren, gebruik je het 's avonds zelf.",
      "Twee getallen bepalen wat een batterij kan: de capaciteit in kWh (hoeveel energie ze bewaart) en het vermogen in kW (hoe snel ze die kan leveren). Voor zelfverbruik telt vooral de capaciteit; om je piek af te vlakken telt vooral het vermogen.",
      "Een batterij heeft een omvormer nodig die ermee kan praten. Heb je al panelen, dan kijken we eerst of je bestaande omvormer volstaat of dat een hybride omvormer slimmer is.",
    ],
    image: "thuisbatterij-berging",
  },
  systemSteps: [
    {
      partner: "zonnepanelen",
      eyebrow: "Met zonnepanelen",
      title: "Hoe past een thuisbatterij in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        `Zonder panelen heeft een batterij weinig om op te slaan. Met panelen verhoog je je zelfverbruik van ${fx("zelfverbruikZonder", { suffix: "%" })} naar ${fx("zelfverbruikMet", { suffix: "%" })} wanneer je ook slim stuurt. De batterij vult dat aan, maar is zelden de eerste stap: vaak levert slim sturen van je boiler of warmtepomp evenveel op voor minder geld.`,
      ],
      factKeys: ["zelfverbruikZonder", "zelfverbruikMet"],
    },
    {
      partner: "omvormers",
      eyebrow: "Met een hybride omvormer",
      title: "De omvormer bepaalt wat je batterij kan",
      body: [
        "Een hybride omvormer stuurt panelen én batterij en kan je injectie beperken als de stroomprijs negatief is. Plaats je nu panelen en later pas een batterij, dan kies je beter vandaag al een omvormer die er klaar voor is.",
      ],
    },
    {
      partner: "laadpalen",
      eyebrow: "Met een laadpaal",
      title: "Je auto laden zonder je piek op te blazen",
      body: [
        `Een laadpaal is de grootste piekverbruiker in huis. Een batterij kan die piek opvangen, maar slim laden doet dat vaak goedkoper. We rekenen beide uit, met jouw rijgedrag, tegen ${eur("capaciteitstariefPerKw")} per kW per jaar.`,
      ],
      factKeys: ["capaciteitstariefPerKw"],
    },
  ],
  advisesAgainst: ["Weinig avondverbruik", "Klein zonnesysteem zonder overschot", "Vast contract zonder piekprobleem", "Je omvormer is niet batterij-klaar"],
  advisesAgainstText:
    "In die gevallen verdient een batterij zich vandaag zelden terug. We tonen je dan wat wél loont – slim sturen, een warmtepompboiler of later een batterij, als de prijzen verder gedaald zijn.",
  advisesAgainstLink: { project: "gezin-kortrijk-geen-batterij-advies", label: "Lees waarom we in Kortrijk géén batterij plaatsten" },
  calculatesLead: "We rekenen met de kwartierwaarden van je digitale meter, niet met een gemiddeld gezin.",
  calculates: withCalcImages([
    { title: "Jouw avond- en nachtverbruik", body: "Uit je meterdata halen we hoeveel stroom je verbruikt wanneer de zon niet schijnt. Dat bepaalt de nuttige capaciteit." },
    { title: "Je maandpiek en wat ze kost", body: "We zien welke pieken je capaciteitstarief bepalen en hoeveel een batterij daarvan kan afvlakken." },
    { title: "Contract: vast of dynamisch", body: "Met een dynamisch contract kan een batterij ook op goedkope uren laden. We rekenen beide contracten door." },
    { title: "Terugverdientijd met en zonder", body: "Je krijgt het scenario met én zonder batterij naast elkaar, inclusief 'niets doen'." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Sturing op piek en dynamisch tarief"],
  signature: {
    kind: "sizer",
    eyebrow: "Welke grootte?",
    title: "Welke batterij past bij jou – of geen?",
    lead: "Kies het profiel dat het meest op jullie lijkt. Je ziet meteen in welke richting de berekening gaat. Te groot is weggegooid geld, te klein levert weinig op.",
    profiles: [
      {
        key: "klein",
        label: "Weinig avondverbruik",
        hint: "Overdag vaak thuis, geen elektrische auto, geen warmtepomp",
        result: {
          title: "Waarschijnlijk geen batterij",
          advice:
            "Je verbruikt al veel zonnestroom zelf. Een batterij heeft dan weinig om te verschuiven en verdient zich traag terug. Slim sturen van je boiler of wasmachine levert meer op per euro.",
          noBattery: true,
        },
      },
      {
        key: "gemiddeld",
        label: "Gemiddeld avondverbruik",
        hint: "Overdag weg, 's avonds koken, wassen en tv",
        result: {
          title: "Een batterij op maat van je avond",
          advice:
            "Vuistregel: dek je avond- en nachtverbruik op een zonnige dag, niet je hele dag. Zo raakt de batterij elke dag vol én leeg. We leiden de exacte capaciteit af uit je meterdata.",
          factKeys: ["prijsThuisbatterijPerKwh"],
        },
      },
      {
        key: "groot",
        label: "Groot avondverbruik + EV of warmtepomp",
        hint: "Elektrische auto, warmtepomp of een dynamisch contract",
        result: {
          title: "Batterij met voldoende vermogen",
          advice:
            "Hier telt niet alleen de capaciteit, maar ook het vermogen: de batterij moet je piek kunnen opvangen als auto en warmtepomp tegelijk vragen. Met een dynamisch contract kan ze ook op goedkope uren laden.",
          factKeys: ["capaciteitstariefPerKw", "negatievePrijsUren2025"],
        },
      },
      {
        key: "geen-panelen",
        label: "Nog geen zonnepanelen",
        hint: "Je denkt aan een batterij om goedkoop te laden",
        result: {
          title: "Eerst panelen of een slim contract",
          advice:
            "Zonder panelen kan een batterij enkel winst maken op prijsverschillen tussen uren. Dat kan, maar het is zelden de beste eerste stap. We rekenen eerst wat panelen of een dynamisch contract jou opleveren.",
          noBattery: true,
        },
      },
    ],
    link: { article: "hoe-groot-moet-een-thuisbatterij-zijn", label: "Lees: hoe groot moet een thuisbatterij zijn?" },
  },
  featuredProject: "gezin-kortrijk-geen-batterij-advies",
  story: {
    title: "In Kortrijk raadden we de batterij af",
    body: "Ze wilden een batterij. De berekening toonde dat die bij hun verbruik niet zou opbrengen. Wat ze wél deden, verlaagde hun factuur meer.",
    image: "gezin-keuken-factuur",
    reviewId: "r02",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun thuisbatterij",
  leadHeading: "Bereken of een thuisbatterij loont in jouw woning.",
  complementary: ["zonnepanelen", "omvormers", "laadpalen"],
  relatedServices: ["zonnepanelen", "omvormers", "laadpalen"],
  relatedComparisons: ["met-of-zonder-thuisbatterij", "vast-vs-dynamisch-energiecontract"],
  relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "wat-is-het-capaciteitstarief", "dynamisch-tarief-uitgelegd"],
  relatedPosts: ["waarom-wij-soms-nee-zeggen"],
  relatedProjects: ["rijwoning-antwerpen-zon-batterij", "gezin-kortrijk-geen-batterij-advies"],
  interesse: ["thuisbatterij"],
  sources: ["prijsThuisbatterijPerKwh", "injectievergoeding", "stroomprijsAllIn", "capaciteitstariefPerKw", "capaciteitstariefGemiddeldPerJaar", "negatievePrijsUren2025", "btwZonnepanelenBatterij", "zelfverbruikZonder", "zelfverbruikMet"],
  faq: [
    {
      q: "Loont een thuisbatterij in 2026?",
      a: `Soms wel, soms niet. Een batterij loont als ze tegelijk je zelfverbruik verhoogt, je maandpiek verlaagt en – met een dynamisch contract – op goedkope uren laadt. Met batterijprijzen van ${eur("prijsThuisbatterijPerKwh")} per kWh en een injectievergoeding van ${cent("injectievergoeding", false)} hangt het volledig af van jouw profiel.`,
    },
    {
      q: "Hoe groot moet mijn thuisbatterij zijn?",
      a: "Zo groot als je avond- en nachtverbruik op een zonnige dag, niet groter. Een batterij die nooit vol raakt of nooit leeg gaat, is weggegooid geld. We leiden de juiste capaciteit (kWh) en het juiste vermogen (kW) af uit de kwartierwaarden van je digitale meter.",
    },
    {
      q: "Verlaagt een batterij mijn capaciteitstarief?",
      a: `Ja, als ze slim gestuurd wordt. Elke kW die je maandpiek lager ligt, bespaart ${eur("capaciteitstariefPerKw")} per jaar. Onder de minimale piek van ${fx("capaciteitstariefMinimumKw")} kW zakken levert niets meer op. Vaak doet slim sturen van laadpaal en warmtepomp hetzelfde, goedkoper.`,
    },
    {
      q: "Wat kost een thuisbatterij?",
      a: `Een thuisbatterij kost geplaatst ${eur("prijsThuisbatterijPerKwh")} per kWh opslagcapaciteit, afhankelijk van merk, omvormer en installatie. De prijzen dalen snel. Soms is het daarom slimmer om nu een batterij-klare omvormer te plaatsen en de batterij pas later toe te voegen.`,
    },
    {
      q: "Is er een premie voor thuisbatterijen?",
      a: `Nee. In Vlaanderen bestaat er geen premie meer voor een thuisbatterij. In een woning ouder dan 10 jaar betaal je wel ${pct("btwZonnepanelenBatterij")} btw. Het rendement moet dus volledig uit zelfverbruik, een lagere piek en slim laden komen – en dat rekenen we eerlijk uit.`,
    },
    {
      q: "Werkt een batterij met een dynamisch contract?",
      a: `Ja, en dan kan ze extra opbrengen. Met een dynamisch contract betaal je per uur de marktprijs. In 2025 was die ${fx("negatievePrijsUren2025")} uur negatief. Een slim gestuurde batterij laadt dan goedkoop en ontlaadt als stroom duur is. Het risico: je factuur schommelt meer.`,
    },
    {
      q: "Hoe lang gaat een thuisbatterij mee?",
      a: "Een goede thuisbatterij gaat doorgaans meer dan tien jaar mee, maar verliest geleidelijk wat capaciteit. Hoe lang precies, hangt af van het type, het aantal laadcycli en de temperatuur van de ruimte. We kiezen een toestel met een garantie die past bij je terugverdientijd.",
    },
  ],
};

// ───────────────────────── 3. Zonnepanelen ─────────────────────────
const zonnepanelen: ServiceContent = {
  slug: "zonnepanelen",
  title: "Zonnepanelen",
  shortTitle: "Zonnepanelen",
  seoTitle: "Zonnepanelen: nog rendabel in 2026? Eerlijk berekend",
  description:
    "Zonder terugdraaiende teller draait alles om zelfverbruik. We berekenen hoeveel panelen jouw gezin echt nodig heeft en wat ze opleveren. Gratis en eerlijk.",
  updatedAt: "2026-11-01",
  h1: "Zonnepanelen die renderen, ook zonder terugdraaiende teller",
  productPhrase: "zonnepanelen",
  productName: "zonnepanelen",
  serviceType: "Plaatsing zonnepanelen",
  hubLine: "Zinvol als je overdag stroom kan gebruiken – of dat kan leren.",
  hubImage: "vbtec-woning-zonnepanelen-dakkapellen",
  heroLead: "De terugdraaiende teller is weg. Je buren zeggen dat panelen niet meer lonen. Wij zeggen: ze lonen anders – als je je eigen stroom zelf gebruikt.",
  image: "vbtec-woning-zonnepanelen-oprit",
  heroFact: {
    k: "pvOpbrengstPerKwp",
    value: fx("pvOpbrengstPerKwp", { single: true }),
    title: "kWh per jaar per kWp in Vlaanderen – stroom die je zelf kan gebruiken",
  },
  kortAntwoord: `Ja, zonnepanelen zijn in 2026 nog rendabel, maar anders dan vroeger. Een zelf verbruikte kWh bespaart je ${cent("stroomprijsAllIn")}, een geïnjecteerde levert ${cent("injectievergoeding")} op. Wie zonnestroom combineert met een warmtepomp, boiler, batterij of slim laden, verdient een installatie van ${eur("prijsZonnepanelenPerKwp")} per kWp terug in ${fx("terugverdientijdZonnepanelen", { suffix: " jaar" })}.`,
  painTitle: "Je panelen draaien, je factuur blijft",
  painPoints: [
    {
      eyebrow: "De teller",
      title: "De terugdraaiende teller is weg, en je voelt het.",
      body: `Wat je overdag te veel maakt, gaat het net op voor ${cent("injectievergoeding", false)} per kWh. 's Avonds koop je terug aan ${cent("stroomprijsAllIn", false)}. Dezelfde panelen brengen ineens veel minder op.`,
      tone: "D",
      factKeys: ["injectievergoeding", "stroomprijsAllIn"],
    },
    {
      eyebrow: "Overdag",
      title: "Je bent overdag niet thuis.",
      body: `Een gezin dat overdag weg is, verbruikt zonder sturing maar ${fx("zelfverbruikZonder", { suffix: "%" })} van zijn eigen zonnestroom. De rest geef je bijna weg.`,
      tone: "G",
      factKeys: ["zelfverbruikZonder"],
    },
    {
      eyebrow: "De twijfel",
      title: "Meer panelen of net minder?",
      body: "De ene installateur legt je dak vol, de andere zegt dat het niet meer loont. Het juiste aantal hangt af van wanneer jij stroom verbruikt – en dat vraagt bijna niemand.",
      tone: "I",
      image: "gezin-keuken-factuur",
    },
  ],
  mythKey: "zonnepanelen-zonder-teller",
  dataBand: {
    title: "Wat kosten zonnepanelen en wat leveren ze op?",
    lead: `Zonnepanelen kosten ${eur("prijsZonnepanelenPerKwp")} per kWp, inclusief omvormer en plaatsing, en leveren in Vlaanderen ${fx("pvOpbrengstPerKwp")} kWh per kWp per jaar. Wat die kWh waard is, hangt af van wat je ermee doet.`,
    mode: "chart",
    chart: {
      type: "bar",
      title: "Wat is 1 kWh zonnestroom waard?",
      props: {
        bars: [
          { label: "Geïnjecteerd op het net", value: centNum("injectievergoeding"), display: cent("injectievergoeding"), series: "base" },
          { label: "Zelf verbruikt", value: centNum("stroomprijsAllIn"), display: cent("stroomprijsAllIn"), series: "good" },
        ],
        caption: "Een kWh die je zelf gebruikt, hoef je niet aan de netprijs te kopen. Daarom draait het rendement van zonnepanelen vandaag om zelfverbruik.",
      },
    },
    chartFactKeys: ["injectievergoeding", "stroomprijsAllIn"],
    stats: [
      { k: "pvOpbrengstPerKwp", label: "kWh per kWp per jaar in Vlaanderen" },
      { k: "prijsZonnepanelenPerKwp", label: "prijs per kWp, geplaatst incl. omvormer", prefix: "€ " },
      { k: "terugverdientijdZonnepanelen", label: "terugverdientijd in het rekenvoorbeeld", suffix: " jaar" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Btw in een woning ouder dan 10 jaar", k: "btwZonnepanelenBatterij", suffix: "%" },
        { label: "Zelfverbruik zonder sturing", k: "zelfverbruikZonder", suffix: "%" },
        { label: "Zelfverbruik met slimme sturing", k: "zelfverbruikMet", suffix: "%" },
      ],
    },
    assumptions: ["pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "stroomprijsAllIn", "injectievergoeding", "zelfverbruikZonder", "zelfverbruikMet", "terugverdientijdZonnepanelen", "terugdraaiendeTellerEinde"],
    assumptionsNote: "Terugverdientijd zonder prijsstijgingen en zonder effect op het capaciteitstarief: hoe meer zelfverbruik, hoe korter. Er is geen premie meer voor zonnepanelen.",
    whenTrue: myth("zonnepanelen-zonder-teller")?.whenTrue,
  },
  howItWorks: {
    title: "Hoe werken zonnepanelen?",
    body: [
      "Zonnepanelen zetten licht om in gelijkstroom. Een omvormer maakt daar wisselstroom van die je huis kan gebruiken. Wat je op dat moment niet verbruikt, gaat via je digitale meter naar het net.",
      `In Vlaanderen levert elke kWp ${fx("pvOpbrengstPerKwp")} kWh per jaar, afhankelijk van richting, helling en schaduw. Een oost-west dak levert iets minder per paneel, maar spreidt de productie beter over de dag – vaak net handig voor je zelfverbruik.`,
      "Het juiste aantal panelen is niet 'zo veel mogelijk'. Het is zoveel als jij – nu en straks met warmtepomp of elektrische auto – zelf kan gebruiken, plus een marge die nog iets opbrengt.",
    ],
    image: "vbtec-installateurs-panelen",
    factKeys: ["pvOpbrengstPerKwp"],
  },
  systemSteps: [
    {
      partner: "omvormers",
      eyebrow: "Met de juiste omvormer",
      title: "Hoe passen zonnepanelen in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        "De omvormer is het hart van je installatie. Kies je vandaag een hybride omvormer, dan kan je later zonder gedoe een batterij toevoegen, en kan je injectie beperken op momenten dat de stroomprijs negatief is.",
      ],
    },
    {
      partner: "thuisbatterij",
      eyebrow: "Met een thuisbatterij",
      title: "Je zonnestroom bewaren voor 's avonds",
      body: [
        `Een batterij verschuift je overschot naar de avond. Samen met slim sturen haal je je zelfverbruik naar ${fx("zelfverbruikMet", { suffix: "%" })}. Maar een batterij loont niet altijd: we rekenen ze apart door, zodat je ziet wat ze bij jou toevoegt.`,
      ],
      factKeys: ["zelfverbruikMet"],
    },
    {
      partner: "pvt-panelen",
      eyebrow: "Of PVT-panelen",
      title: "Stroom én warmte van hetzelfde dak",
      body: [
        "Wil je ook van het gas af? Dan kan een deel van je dak PVT-panelen krijgen: die maken stroom én warmte voor een warmtepomp. We rekenen per project of dat bij jou zin heeft.",
      ],
    },
  ],
  advisesAgainst: ["Veel schaduw op het dak", "Dak dat binnen enkele jaren vernieuwd moet worden", "Nauwelijks verbruik overdag en niets verschuifbaar", "Al een installatie die je verbruik dekt"],
  advisesAgainstText:
    "Dan rekenen we een kleinere installatie, eerst een nieuw dak, of gewoon niets. Want een paneel dat vooral injecteert, verdient zich vandaag traag terug.",
  advisesAgainstLink: { project: "gezin-kortrijk-geen-batterij-advies", label: "Bekijk een project waar we iets afraadden" },
  calculatesLead: "Hoeveel panelen jij nodig hebt, hangt af van wanneer je stroom gebruikt – niet van hoe groot je dak is.",
  calculates: withCalcImages([
    { title: "Jouw dak: richting, helling, schaduw", body: "We bekijken je dak per vlak en rekenen de opbrengst per paneel, ook voor oost-west." },
    { title: "Jouw verbruiksprofiel", body: "Met je meterdata zien we wanneer je stroom gebruikt, en dus hoeveel zonnestroom je zelf kan verbruiken." },
    { title: "Het optimale aantal panelen", body: "Meer panelen is niet altijd beter. We zoeken het punt waarop een extra paneel nog genoeg oplevert." },
    { title: "Zelfverbruik verhogen", body: "Boiler, warmtepomp, wasmachine of auto: we kijken wat je slim kan verschuiven naar de zonnige uren." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Aanmelding bij de netbeheerder"],
  signature: {
    kind: "curve",
    curve: "day",
    eyebrow: "Jouw dag",
    title: "Waar gaat jouw zonnestroom naartoe?",
    lead: "Kijk hoe je zonnestroom over een zonnige dag verdeeld wordt. De gele curve is wat je panelen maken, de lijn wat je huis vraagt. Het groene vlak is wat je zelf gebruikt – en dat wil je zo groot mogelijk.",
    body: [
      "Zonder sturing gaat het grootste deel van je middagpiek het net op. Laat je je boiler en warmtepomp opwarmen als de zon schijnt, dan groeit het groene vlak. Een batterij schuift de rest door naar de avond.",
      "Dit is een illustratief profiel, geen meting. Bij de berekening gebruiken we de kwartierwaarden van jouw meter.",
    ],
    factKeys: ["zelfverbruikZonder", "zelfverbruikMet"],
    link: { comparison: "met-of-zonder-zonnepanelen", label: "Met of zonder zonnepanelen? De eerlijke vergelijking" },
  },
  featuredProject: "rijwoning-antwerpen-zon-batterij",
  story: {
    title: "Een rijwoning in Antwerpen met een klein dak",
    body: "Weinig dak, veel avondverbruik. Ze kregen drie scenario's naast elkaar – ook eentje met 'niets doen' – en kozen zelf.",
    image: "rijwoning-zonnepanelen",
    reviewId: "r03",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun zonnepanelen",
  leadHeading: "Bereken of zonnepanelen lonen in jouw woning.",
  complementary: ["omvormers", "thuisbatterij", "pvt-panelen"],
  relatedServices: ["omvormers", "thuisbatterij", "pvt-panelen"],
  relatedComparisons: ["met-of-zonder-zonnepanelen", "zonnepanelen-vs-pvt-panelen"],
  relatedArticles: ["injectietarief-en-zelfverbruik", "wat-is-het-capaciteitstarief"],
  relatedPosts: ["einde-terugdraaiende-teller-wat-nu"],
  relatedProjects: ["rijwoning-antwerpen-zon-batterij", "gezin-kortrijk-geen-batterij-advies"],
  interesse: ["zonnepanelen"],
  sources: ["stroomprijsAllIn", "injectievergoeding", "pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "terugverdientijdZonnepanelen", "zelfverbruikZonder", "zelfverbruikMet", "btwZonnepanelenBatterij", "terugdraaiendeTellerEinde", "negatievePrijsUren2025"],
  faq: [
    {
      q: "Zijn zonnepanelen nog rendabel in 2026?",
      a: `Ja, als je een groot deel van je zonnestroom zelf verbruikt. Een zelf gebruikte kWh bespaart ${cent("stroomprijsAllIn")}, een geïnjecteerde levert ${cent("injectievergoeding")} op. Met een installatie van ${eur("prijsZonnepanelenPerKwp")} per kWp kom je in ons rekenvoorbeeld op een terugverdientijd van ${fx("terugverdientijdZonnepanelen", { suffix: " jaar" })}.`,
    },
    {
      q: "Hoeveel kWh levert 1 kWp op in Vlaanderen?",
      a: `Gemiddeld ${fx("pvOpbrengstPerKwp")} kWh per kWp per jaar. Een zuidgericht dak met een helling van ongeveer 35 graden en zonder schaduw zit aan de bovenkant; oost-west iets lager, maar met een vlakkere productie over de dag. We rekenen met jouw dak, niet met een gemiddelde.`,
    },
    {
      q: "Hoeveel zonnepanelen heb ik nodig?",
      a: "Zoveel als je zelf kan gebruiken, nu en in de komende jaren. Plan je een warmtepomp of elektrische auto, dan rekenen we die mee. Zonder terugdraaiende teller is een dak volleggen 'omdat het kan' zelden de beste keuze; we zoeken het punt waarop een extra paneel nog loont.",
    },
    {
      q: "Wat krijg ik voor stroom die ik op het net zet?",
      a: `Je energieleverancier betaalt je een injectievergoeding van ${cent("injectievergoeding", false)} per kWh, afhankelijk van je contract. Met een dynamisch contract kan injecteren op momenten met een negatieve stroomprijs je zelfs geld kosten. Daarom is zelf verbruiken zoveel meer waard.`,
    },
    {
      q: "Is er nog een premie voor zonnepanelen?",
      a: `Nee, er is in Vlaanderen geen premie meer voor zonnepanelen. In een woning ouder dan 10 jaar betaal je wel ${pct("btwZonnepanelenBatterij")} btw op de installatie. Het rendement komt dus volledig uit je eigen verbruik – en dat is precies wat we voor jou uitrekenen.`,
    },
    {
      q: "Wat is de terugverdientijd van zonnepanelen?",
      a: `In ons rekenvoorbeeld ${fx("terugverdientijdZonnepanelen", { suffix: " jaar" })}: hoe meer je zelf verbruikt, hoe sneller. Bij een zelfverbruik van ${fx("zelfverbruikZonder", { single: true, suffix: "%" })} duurt het langer, bij ${fx("zelfverbruikMet", { single: true, suffix: "%" })} een stuk korter. Je krijgt de terugverdientijd voor jouw situatie zwart op wit.`,
    },
    {
      q: "Werken panelen op een oost-west dak?",
      a: "Ja. Een oost-west dak levert per paneel iets minder dan een zuiddak, maar verspreidt de productie over de ochtend en de late namiddag. Dat valt vaak beter samen met je verbruik, waardoor je meer zelf gebruikt. Bij de berekening nemen we elk dakvlak apart mee.",
    },
  ],
};

// ───────────────────────── 4. PVT-panelen ─────────────────────────
const pvt: ServiceContent = {
  slug: "pvt-panelen",
  title: "PVT-panelen",
  shortTitle: "PVT-panelen",
  seoTitle: "PVT-panelen: stroom én warm water van hetzelfde dak",
  description:
    "Een PVT-paneel maakt stroom én warmte. Gekoppeld aan een warmtepomp haal je meer uit je dak. Ontdek wanneer PVT loont – berekend door onze ingenieurs.",
  updatedAt: "2026-11-01",
  h1: "Eén dak, twee opbrengsten: stroom en warmte",
  productPhrase: "PVT-panelen",
  productName: "PVT-panelen",
  serviceType: "Plaatsing PVT-panelen (hybride zonnepanelen)",
  hubLine: "Zinvol als je van het gas af wil en je dak dubbel wil laten werken.",
  hubImage: "pvt-dak-detail",
  heroLead: "Je wil van het gas af en je dak is maar zo groot. Wat als hetzelfde paneel zowel je stroom als de warmte voor je warmtepomp levert?",
  image: "pvt-dak-detail",
  heroFact: {
    title: "Weinig installateurs bieden PVT aan. Wij wel – en we blijven eraan onderzoeken.",
    value: "Stroom + warmte",
  },
  kortAntwoord:
    "Een PVT-paneel is een zonnepaneel met een warmtewisselaar aan de achterkant: het maakt stroom én warmte. Die warmte dient als bron voor een warmtepomp of voor sanitair warm water, en de koeling helpt het paneel zelf. PVT heeft vooral zin als je een warmtepomp plaatst en je dak beperkt is. Opbrengst en prijs berekenen we per project.",
  painTitle: "Je dak moet alles doen, en het is maar zo groot",
  painPoints: [
    {
      eyebrow: "Je dak",
      title: "Panelen óf een zonneboiler. Niet allebei.",
      body: "Wie stroom en warm water uit de zon wil, moest kiezen: welk deel van het dak voor panelen, welk voor de boiler. Op een gewone rijwoning schiet daar niet veel van over.",
      tone: "D",
    },
    {
      eyebrow: "Je warmtepomp",
      title: "Een warmtepomp op buitenlucht werkt het hardst als het het koudst is.",
      body: "Net in de winter, wanneer je de meeste warmte nodig hebt, is de buitenlucht het koudst. Een betere warmtebron maakt dan een groot verschil voor je rendement.",
      tone: "G",
    },
    {
      eyebrow: "De twijfel",
      title: "Niemand weet er iets van.",
      body: "Je vraagt drie installateurs naar PVT en krijgt drie keer een schouderophaal. Dat ligt niet aan jou: weinig installateurs bieden het aan. Wij wel.",
      tone: "I",
      image: "pvt-dak-detail",
    },
  ],
  dataBand: {
    title: "Wat kost PVT en wat levert het op?",
    lead: "Een PVT-installatie kost meer dan gewone panelen, en de opbrengst hangt sterk af van hoe je de warmte gebruikt. Daarom geven we geen folderwaarden: we berekenen opbrengst en prijs per project. Wat we wel eerlijk kunnen tonen: wat elk systeem doet.",
    mode: "table",
    table: {
      caption: "Gewone zonnepanelen, PVT-panelen en een zonneboiler naast elkaar",
      columns: ["Zonnepanelen (PV)", "PVT-panelen", "Zonneboiler"],
      highlightCol: 1,
      rows: [
        { label: "Maakt stroom", cells: ["Ja", "Ja", "Nee"] },
        { label: "Maakt warmte", cells: ["Nee", "Ja", "Ja"] },
        { label: "Bron voor een warmtepomp", cells: ["Nee", "Ja", "Nee"] },
        { label: "Dakruimte", cells: ["Eén functie per paneel", "Twee functies per paneel", "Eén functie per collector"] },
        { label: "Opbrengst & prijs", cells: ["Per project berekend", "Per project berekend", "Per project berekend"] },
        { label: "Premie (Mijn VerbouwPremie)", cells: ["Geen", "Geen aparte premie", `${eur("premieZonneboiler", true)} (afgeschaft)`], factKeys: ["premieZonneboiler"] },
      ],
    },
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Btw op zonnepanelen in een woning ouder dan 10 jaar", k: "btwZonnepanelenBatterij", suffix: "%" },
        { label: "Premie lucht-water warmtepomp, categorie 1 en 2", k: "premieLuchtWaterCat12", suffix: " €" },
      ],
    },
    assumptions: ["premieZonneboiler", "btwZonnepanelenBatterij", "premieLuchtWaterCat12", "pvOpbrengstPerKwp"],
    assumptionsNote: "Voor PVT bestaan geen betrouwbare algemene opbrengstcijfers voor Vlaamse woningen. We geven daarom bewust geen rendement of prijs per paneel: dat rekenen we per project, met jouw dak en jouw warmtevraag.",
    whenTrue: "PVT loont niet als je geen warmtepomp of warmtevraag hebt die de warmte kan opnemen. Dan zijn gewone zonnepanelen goedkoper en even goed.",
  },
  howItWorks: {
    title: "Hoe werkt een PVT-paneel?",
    body: [
      "PVT staat voor photovoltaïsch-thermisch. Aan de voorkant is het een gewoon zonnepaneel dat stroom maakt. Aan de achterkant loopt een warmtewisselaar met vloeistof die de warmte van het paneel opneemt – ook van de omgevingslucht, en zelfs 's nachts of op bewolkte dagen een beetje.",
      "Die warmte gaat naar een warmtepomp, die er warm water en verwarming van maakt. Omdat de bron warmer is dan de winterlucht, hoeft de warmtepomp minder hard te werken. En omdat het paneel gekoeld wordt, levert het op warme dagen zelfs wat meer stroom.",
      "Een PVT-systeem vraagt meer ontwerp dan gewone panelen: de grootte van het veld, de warmtepomp en de buffer moeten op elkaar afgestemd zijn. Precies daarom zijn er zo weinig installateurs die het aanbieden.",
    ],
    image: "pvt-dak-detail",
  },
  systemSteps: [
    {
      partner: "lucht-water-warmtepomp",
      eyebrow: "Met een warmtepomp",
      title: "PVT als bron voor een warmtepomp",
      titleAs: "h2",
      body: [
        "Het grootste voordeel van PVT krijg je in combinatie met een warmtepomp. De panelen leveren de warmtebron, de warmtepomp brengt ze op temperatuur voor je verwarming en je douche. Je haalt zo stroom én warmte van hetzelfde dak.",
        "Of dat bij jou meer oplevert dan een gewone lucht-water warmtepomp met zonnepanelen, berekenen we per project. Soms is het antwoord nee – dan zeggen we dat.",
      ],
    },
    {
      partner: "omvormers",
      eyebrow: "In je energiesysteem",
      title: "Hoe past PVT in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        "De stroom van je PVT-panelen gaat via een omvormer naar je huis, net als bij gewone panelen. Je kan PVT combineren met gewone zonnepanelen op een ander deel van het dak, en later een batterij toevoegen via een hybride omvormer.",
      ],
    },
    {
      eyebrow: "Eerlijk antwoord",
      title: "Waarom zo weinig installateurs PVT aanbieden",
      titleAs: "h2",
      body: [
        "PVT is geen product dat je uit een catalogus plukt en op een dak schroeft. Het vraagt een warmtetechnisch ontwerp, kennis van warmtepompen én van zonnestroom, en een installateur die beide werelden durft te combineren. De meeste bedrijven doen het ene of het andere.",
        "Wij zijn een ingenieursbedrijf: we rekenen elk systeem als geheel door. Daarom bieden we PVT aan, en blijven we eraan onderzoeken. Niet omdat het overal de beste keuze is, maar omdat het voor sommige woningen echt het verschil maakt.",
      ],
      image: "ingenieur-aan-tafel",
    },
  ],
  advisesAgainst: ["Geen warmtepomp of warmtevraag gepland", "Dak met veel schaduw", "Kleine warmtevraag (zeer goed geïsoleerde woning)", "Je wil enkel stroom"],
  advisesAgainstText:
    "In die gevallen zijn gewone zonnepanelen, eventueel met een warmtepompboiler, goedkoper en even goed. PVT is een prachtige techniek, maar alleen waar ze echt iets toevoegt.",
  advisesAgainstLink: { post: "waarom-wij-soms-nee-zeggen", label: "Waarom we soms nee zeggen" },
  calculatesLead: "Voor PVT rekenen we stroom én warmte tegelijk – dat is het hele punt.",
  calculates: withCalcImages([
    { title: "Jouw warmtevraag", body: "Hoeveel warmte heeft je woning nodig voor verwarming en sanitair warm water, per seizoen?" },
    { title: "Grootte van het PVT-veld", body: "Hoeveel PVT-panelen zijn nodig als bron voor je warmtepomp, en welk deel van je dak blijft gewone PV?" },
    { title: "Warmtepomp en buffer", body: "We stemmen de warmtepomp, de buffer en de sturing af op de panelen, zodat ze samen optimaal draaien." },
    { title: "PVT tegenover alternatieven", body: "Je krijgt PVT naast een lucht-water warmtepomp met gewone panelen. Zo zie je of de meerprijs loont." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Warmtetechnisch ontwerp", "Opvolging van stroom- én warmteopbrengst"],
  signature: {
    kind: "timeline",
    eyebrow: "Onderzoek & ontwikkeling",
    title: "Ons onderzoek naar PVT",
    lead: "PVT is voor ons geen catalogusproduct. We testen, meten en verbeteren – en wat we leren, gaat naar de volgende woning. Hieronder de stappen tot nu toe (voorbeeldtijdlijn, data volgen).",
    steps: [
      {
        date: "Stap 1",
        title: "De vraag: hoe halen we meer uit een klein dak?",
        body: "Bij rijwoningen en kleine daken botsten we telkens op hetzelfde: te weinig plaats voor panelen én een warmtebron. PVT bleek het antwoord te kunnen zijn.",
      },
      {
        date: "Stap 2",
        title: "Testopstelling en metingen",
        body: "We plaatsten PVT-panelen in een testopstelling en maten stroom en warmte apart, in alle seizoenen. Zo leerden we waar de theorie en de praktijk uit elkaar lopen.",
      },
      {
        date: "Stap 3",
        title: "Eerste woningen met PVT en warmtepomp",
        body: "In samenwerking met gezinnen die het aandurfden, koppelden we PVT aan een warmtepomp. Elke installatie volgen we op met monitoring.",
      },
      {
        date: "Vandaag",
        title: "Een rekenmodel per woning",
        body: "Met wat we gemeten hebben, rekenen we voor elke woning of PVT meer oplevert dan de klassieke combinatie. Het onderzoek loopt door.",
      },
    ],
  },
  featuredProject: "gezinswoning-gent-warmtepomp-pvt",
  story: {
    title: "PVT en warmtepomp in een jaren '70-woning",
    body: "Op een dak dat te klein leek voor panelen én een warmtebron, maakt PVT nu stroom en de warmte voor de warmtepomp.",
    image: "jaren70-woning",
    reviewId: "r01",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun PVT-installatie",
  leadHeading: "Bereken of PVT-panelen lonen op jouw dak.",
  complementary: ["lucht-water-warmtepomp", "omvormers"],
  relatedServices: ["lucht-water-warmtepomp", "zonnepanelen", "omvormers"],
  relatedComparisons: ["zonnepanelen-vs-pvt-panelen", "gasketel-vs-warmtepomp"],
  relatedArticles: ["wat-is-een-pvt-paneel", "scop-en-cop-uitgelegd"],
  relatedPosts: ["loont-een-warmtepomp-nog-in-2026"],
  relatedProjects: ["gezinswoning-gent-warmtepomp-pvt"],
  interesse: ["pvt-panelen"],
  sources: ["premieZonneboiler", "btwZonnepanelenBatterij", "premieLuchtWaterCat12", "pvOpbrengstPerKwp"],
  faq: [
    {
      q: "Wat is een PVT-paneel?",
      a: "Een PVT-paneel is een zonnepaneel dat stroom maakt en tegelijk warmte opvangt via een warmtewisselaar aan de achterkant. Die warmte kan dienen als bron voor een warmtepomp of voor sanitair warm water. Zo levert één dakvlak twee soorten energie in plaats van één.",
    },
    {
      q: "Is PVT beter dan gewone zonnepanelen?",
      a: "Niet altijd. PVT is duurder en vooral zinvol als je de warmte kan gebruiken, meestal via een warmtepomp. Wil je enkel stroom, dan zijn gewone panelen goedkoper. Plaats je een warmtepomp en is je dak beperkt, dan kan PVT meer opleveren. We rekenen beide uit.",
    },
    {
      q: "Kan een PVT-paneel een warmtepomp voeden?",
      a: "Ja. De warmte uit de PVT-panelen dient als bron voor een warmtepomp, in plaats van of naast de buitenlucht. Omdat die bron vaak warmer is dan de winterlucht, hoeft de warmtepomp minder hard te werken. Het systeem moet daarvoor wel als geheel ontworpen worden.",
    },
    {
      q: "Hoeveel warm water levert PVT?",
      a: "Dat hangt af van het aantal panelen, je dak, het seizoen en hoe de warmte gebruikt wordt. Algemene cijfers zouden je misleiden, daarom geven we die niet. We berekenen de opbrengst per project, met jouw warmtevraag en jouw dak, en volgen ze na de installatie op.",
    },
    {
      q: "Is er een premie voor PVT?",
      a: `Er is geen aparte premie meer voor PVT-panelen of zonneboilers: de zonneboilerpremie bedraagt vandaag ${eur("premieZonneboiler", true)}. Gebruik je PVT als bron voor een warmtepomp, dan kan de warmtepomp onder voorwaarden wel een Mijn VerbouwPremie krijgen. We bekijken dat per dossier.`,
    },
    {
      q: "Voor welke woningen is PVT geschikt?",
      a: "Vooral voor woningen die een warmtepomp krijgen en een beperkt dak hebben, zoals rijwoningen en halfopen woningen. Ook waar een buitenunit moeilijk te plaatsen is, kan PVT een oplossing zijn. Bij veel schaduw of zonder warmtevraag raden we het af.",
    },
  ],
};

// ───────────────────────── 5. Omvormers ─────────────────────────
const omvormers: ServiceContent = {
  slug: "omvormers",
  title: "Omvormers",
  shortTitle: "Omvormers",
  seoTitle: "Omvormer vervangen of hybride omvormer nodig?",
  description:
    "Je omvormer bepaalt hoeveel je zonnepanelen opbrengen en of je later een batterij kan koppelen. We rekenen welke omvormer bij jouw installatie past.",
  updatedAt: "2026-11-01",
  h1: "Het hart van je zonne-installatie, klaar voor morgen",
  productPhrase: "een nieuwe omvormer",
  productName: "een omvormer",
  serviceType: "Vervanging en plaatsing omvormers",
  hubLine: "Zinvol als je omvormer ouder wordt of je later een batterij wil.",
  hubImage: "omvormer-app-klant",
  heroLead: "Je panelen liggen er al jaren. Maar de doos in je garage die alles omzet, gaat minder lang mee. Is die van jou klaar voor wat je nog wil?",
  image: "omvormer-app-klant",
  heroFact: {
    k: "levensduurOmvormer",
    value: fx("levensduurOmvormer", { suffix: " jaar" }),
    title: "gaat een omvormer gemiddeld mee – je panelen veel langer",
  },
  kortAntwoord: `Een omvormer zet de gelijkstroom van je panelen om in stroom voor je huis en gaat ${fx("levensduurOmvormer", { suffix: " jaar" })} mee, korter dan je panelen. Bij vervanging is een hybride omvormer vaak slim: die kan later een thuisbatterij sturen en je injectie beperken bij negatieve stroomprijzen. We rekenen welke omvormer bij jouw panelen en plannen past.`,
  painTitle: "Je omvormer veroudert in stilte",
  painPoints: [
    {
      eyebrow: "Ouderdom",
      title: "Je panelen gaan decennia mee. Je omvormer niet.",
      body: `Een omvormer gaat ${fx("levensduurOmvormer", { suffix: " jaar" })} mee. Lag je installatie er voor de digitale meter, dan is de kans groot dat de jouwe aan het einde van zijn leven zit.`,
      tone: "D",
      factKeys: ["levensduurOmvormer"],
    },
    {
      eyebrow: "Stille verliezen",
      title: "Een foutcode die je niet ziet, kost elke dag geld.",
      body: "Als je omvormer uitvalt, maken je panelen niets meer – en vaak merk je dat pas weken later, op je factuur. Wie zijn opbrengst niet opvolgt, verliest ongemerkt.",
      tone: "G",
    },
    {
      eyebrow: "Morgen",
      title: "Je wil later een batterij, maar je omvormer kan dat niet.",
      body: "Een oude string-omvormer praat niet met een batterij. Wie nu vervangt zonder vooruit te kijken, koopt over een paar jaar een tweede toestel.",
      tone: "I",
      image: "omvormer-app-klant",
    },
  ],
  dataBand: {
    title: "Wat kost een omvormer en wat levert het op?",
    lead: "Een omvormer levert zelf geen stroom, maar bepaalt wel hoeveel je panelen opbrengen én wat je er later mee kan. De keuze heeft dus gevolgen voor jaren.",
    mode: "chart",
    chart: {
      type: "bar",
      title: "Wat kan je omvormer?",
      props: {
        bars: [
          { label: "String-omvormer", value: 1, display: "stroom omzetten", series: "base" },
          { label: "Hybride omvormer", value: 3, display: "omzetten + batterij + injectie beperken", series: "good" },
        ],
        withNote: false,
        caption: "Een hybride omvormer stuurt ook een thuisbatterij en kan injectie beperken op momenten met een negatieve stroomprijs. Micro-omvormers per paneel zijn een derde optie bij schaduw of complexe daken.",
      },
    },
    stats: [
      { k: "levensduurOmvormer", label: "levensduur van een omvormer", suffix: " jaar" },
      { k: "negatievePrijsUren2025", label: "uren met een negatieve stroomprijs in 2025" },
      { k: "btwZonnepanelenBatterij", label: "btw in een woning ouder dan 10 jaar", suffix: "%" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Btw bij vervanging in een woning ouder dan 10 jaar", k: "btwZonnepanelenBatterij", suffix: "%" },
        { label: "Vergoeding voor geïnjecteerde stroom", k: "injectievergoeding", suffix: " c/kWh" },
      ],
    },
    assumptions: ["levensduurOmvormer", "negatievePrijsUren2025", "btwZonnepanelenBatterij", "injectievergoeding"],
    assumptionsNote: "De balk hierboven is geen meting maar een vergelijking van functies. Prijzen van omvormers verschillen sterk per vermogen en merk; je krijgt ze in je voorstel.",
    whenTrue: "Werkt je omvormer nog goed en plan je geen batterij, dan hoef je hem niet preventief te vervangen. We zeggen je dan gewoon: laat hem draaien en volg je opbrengst op.",
  },
  howItWorks: {
    title: "Hoe werkt een omvormer?",
    body: [
      "Zonnepanelen maken gelijkstroom. Je huis en het net werken op wisselstroom. De omvormer zet het een om in het ander, en zoekt ondertussen voortdurend het punt waarop je panelen het meeste vermogen leveren.",
      "Er zijn drie soorten. Een string-omvormer verwerkt een hele rij panelen tegelijk: eenvoudig en betaalbaar. Micro-omvormers zitten onder elk paneel, handig bij schaduw of daken met veel richtingen. Een hybride omvormer kan daarnaast een thuisbatterij laden en ontladen.",
      "Moderne omvormers worden gestuurd: ze kunnen injectie beperken als stroom op dat moment een negatieve prijs heeft, en geven je in een app per dag weer wat je panelen opbrengen.",
    ],
    image: "vbtec-app-smartphone-verbruik",
  },
  systemSteps: [
    {
      partner: "zonnepanelen",
      eyebrow: "Met je zonnepanelen",
      title: "Hoe past een omvormer in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        "De omvormer moet passen bij het vermogen en de opstelling van je panelen. Te klein en je verliest productie op zonnige middagen; te groot en hij werkt inefficiënt. Bij een uitbreiding van je installatie rekenen we dat opnieuw door.",
      ],
    },
    {
      partner: "thuisbatterij",
      eyebrow: "Met een thuisbatterij",
      title: "Batterij-klaar, ook als je nu nog geen batterij wil",
      body: [
        "Batterijprijzen dalen. Soms is het slimmer om vandaag een hybride omvormer te plaatsen en de batterij pas later toe te voegen. Dan hoef je niets opnieuw te doen als het moment daar is.",
      ],
    },
  ],
  advisesAgainst: ["Je omvormer werkt nog en je plant geen batterij", "Je installatie is klein en recent", "Een herstelling volstaat"],
  advisesAgainstText:
    "Een omvormer vervangen omdat het kan, is geld uitgeven zonder opbrengst. We bekijken eerst of herstellen of gewoon laten draaien de slimste keuze is.",
  advisesAgainstLink: { post: "waarom-wij-soms-nee-zeggen", label: "Waarom we soms nee zeggen" },
  calculatesLead: "We kijken niet alleen naar je omvormer, maar naar wat je installatie de komende tien jaar moet kunnen.",
  calculates: withCalcImages([
    { title: "Staat van je huidige omvormer", body: "Leeftijd, foutcodes en opbrengst vergeleken met wat je panelen zouden moeten leveren." },
    { title: "Het juiste vermogen", body: "Afgestemd op je panelen, je dak en eventuele uitbreidingen, zonder verlies op zonnige dagen." },
    { title: "String, hybride of micro", body: "Welk type past bij jouw dak, schaduw en plannen met een batterij?" },
    { title: "Injectie en sturing", body: "Hoe je omvormer injectie kan beperken bij negatieve prijzen en je zelfverbruik kan verhogen." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Afvoer van je oude omvormer"],
  signature: {
    kind: "bento",
    eyebrow: "Aan vervanging toe?",
    title: "Is je omvormer aan vervanging toe?",
    lead: "Vier signalen dat het tijd is om je omvormer te laten nakijken – en wat je dan kiest.",
    tiles: [
      { kind: "stat", k: "levensduurOmvormer", label: "jaar: zo lang gaat een omvormer doorgaans mee", factKeys: ["levensduurOmvormer"] },
      {
        kind: "grey",
        title: "4 signalen",
        body: "Een foutcode of rood lampje. Een opbrengst die jaar na jaar daalt. Een omvormer die niet met een batterij kan praten. Lawaai of veel warmte in je garage.",
        tags: ["Foutcode", "Opbrengst daalt", "Niet batterij-klaar", "Lawaai of warmte"],
      },
      { kind: "photo", image: "omvormer-app-klant", title: "Je opbrengst in een app", body: "Een nieuwe omvormer toont per dag wat je panelen maken, zodat je een probleem meteen ziet." },
      {
        kind: "wide",
        title: "String, hybride of micro?",
        body: "Eén dakvlak zonder schaduw? Een string-omvormer volstaat. Batterij gepland of dynamisch contract? Kies hybride. Veel schaduw of dakvlakken in alle richtingen? Dan zijn micro-omvormers het overwegen waard. We rekenen het voor je dak.",
        tone: "dark",
      },
    ],
    link: { comparison: "met-of-zonder-thuisbatterij", label: "Met of zonder thuisbatterij? De eerlijke vergelijking" },
  },
  featuredProject: "rijwoning-antwerpen-zon-batterij",
  story: {
    title: "Een nieuwe omvormer, klaar voor de batterij",
    body: "In deze Antwerpse rijwoning kwam er een hybride omvormer: vandaag stuurt hij de panelen, morgen ook de batterij.",
    image: "omvormer-app-klant",
    reviewId: "r07",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun nieuwe omvormer",
  leadHeading: "Bereken welke omvormer bij jouw installatie past.",
  complementary: ["zonnepanelen", "thuisbatterij"],
  relatedServices: ["zonnepanelen", "thuisbatterij"],
  relatedComparisons: ["met-of-zonder-thuisbatterij"],
  relatedArticles: ["injectietarief-en-zelfverbruik", "hoe-groot-moet-een-thuisbatterij-zijn"],
  relatedPosts: ["einde-terugdraaiende-teller-wat-nu"],
  relatedProjects: ["rijwoning-antwerpen-zon-batterij"],
  interesse: ["omvormers"],
  sources: ["levensduurOmvormer", "negatievePrijsUren2025", "btwZonnepanelenBatterij", "injectievergoeding"],
  faq: [
    {
      q: "Hoe lang gaat een omvormer mee?",
      a: `Een omvormer gaat ${fx("levensduurOmvormer", { suffix: " jaar" })} mee. Zonnepanelen gaan veel langer mee, dus de meeste installaties krijgen minstens één keer een nieuwe omvormer. Hoe lang de jouwe het volhoudt, hangt af van het merk, de belasting en de plaats: in een koele, droge ruimte gaan ze langer mee.`,
    },
    {
      q: "Hoe weet ik of mijn omvormer kapot is?",
      a: "Kijk naar de lampjes of het scherm: een rood lampje of foutcode is een duidelijk signaal. Minder duidelijk is een opbrengst die geleidelijk daalt. Vergelijk je productie met vorig jaar of met je app. Twijfel je, dan lezen we op afstand of ter plaatse je omvormer uit.",
    },
    {
      q: "Wat is een hybride omvormer?",
      a: "Een hybride omvormer zet niet alleen de stroom van je panelen om, maar kan ook een thuisbatterij laden en ontladen. Hij beslist wanneer stroom naar je huis, je batterij of het net gaat. Plan je ooit een batterij, dan is een hybride omvormer bij vervanging bijna altijd slim.",
    },
    {
      q: "Moet ik mijn omvormer vervangen voor een thuisbatterij?",
      a: "Niet altijd. Sommige batterijen hebben een eigen omvormer en werken naast je bestaande installatie. Is je huidige omvormer oud of niet compatibel, dan is een hybride omvormer vaak de betere en goedkopere oplossing. We bekijken welk scenario bij jouw installatie het meeste oplevert.",
    },
    {
      q: "String-omvormer of micro-omvormers?",
      a: "Een string-omvormer is eenvoudig en betaalbaar als al je panelen op één vlak zonder schaduw liggen. Micro-omvormers per paneel zijn duurder, maar halen meer uit daken met schaduw of veel richtingen, en tonen de opbrengst per paneel. We kiezen op basis van jouw dak.",
    },
    {
      q: "Kan een omvormer injectie beperken bij negatieve prijzen?",
      a: `Ja, moderne omvormers kunnen hun injectie terugschroeven als de stroomprijs negatief is. Met een dynamisch contract kan dat geld besparen: in 2025 waren er ${fx("negatievePrijsUren2025")} uren met een negatieve prijs, vooral rond de middag. Je stroom gaat dan liever naar je boiler, batterij of auto.`,
    },
  ],
};

// ───────────────────────── 6. Laadpalen ─────────────────────────
const laadpalen: ServiceContent = {
  slug: "laadpalen",
  title: "Laadpalen",
  shortTitle: "Laadpalen",
  seoTitle: "Laadpaal thuis: slim laden op zon en goedkope uren",
  description:
    "Laad je elektrische auto thuis op zonnestroom of goedkope uren zonder je capaciteitstarief op te blazen. We berekenen de slimste laadoplossing voor jouw gezin.",
  updatedAt: "2026-11-01",
  h1: "Je auto laden op zon, niet op je piek",
  productPhrase: "een laadpaal",
  productName: "een laadpaal",
  serviceType: "Plaatsing slimme laadpaal",
  hubLine: "Zinvol als je elektrisch rijdt of dat binnenkort gaat doen.",
  hubImage: "vbtec-laadpaal-oprit-auto",
  heroLead: "Je wil elektrisch rijden, maar vreest dat laden thuis je capaciteitstarief opblaast. Dat hoeft niet – als je laadpaal weet wanneer hij moet laden.",
  image: "vbtec-laadpaal-oprit-auto",
  heroFact: {
    k: "kostPer100kmZonOverschot",
    value: fx("kostPer100kmZonOverschot", { euro: true, single: true }),
    title: `per 100 km op eigen zonne-overschot, tegenover ${fx("kostPer100kmThuisNet", { euro: true, single: true })} aan de netprijs`,
  },
  kortAntwoord: `Thuis laden aan de netprijs kost ${fx("kostPer100kmThuisNet", { euro: true, single: true })} per 100 km; op je eigen zonne-overschot ${fx("kostPer100kmZonOverschot", { euro: true, single: true })}. Een slimme laadpaal laadt op zonnestroom of goedkope uren en houdt je maandpiek laag, want elke kW extra piek kost ${eur("capaciteitstariefPerKw")} per jaar. We rekenen welke laadpaal en sturing bij jouw rijgedrag passen.`,
  painTitle: "Elektrisch rijden, zonder schrik voor je factuur",
  painPoints: [
    {
      eyebrow: "Je piek",
      title: "Je auto inpluggen om zes uur is de duurste gewoonte in huis.",
      body: `Koken, wassen én laden tegelijk: dat kwartier bepaalt je maandpiek. En elke kW extra piek kost ${eur("capaciteitstariefPerKw")} per jaar aan capaciteitstarief.`,
      tone: "D",
      factKeys: ["capaciteitstariefPerKw"],
    },
    {
      eyebrow: "Je zon",
      title: "Je panelen injecteren terwijl je auto op de oprit staat.",
      body: `Overdag gaat je zonnestroom voor ${cent("injectievergoeding", false)} het net op. Diezelfde stroom had je auto kunnen laden voor bijna niets.`,
      tone: "G",
      factKeys: ["injectievergoeding"],
    },
    {
      eyebrow: "De keuze",
      title: "Welke laadpaal? Welk contract? Welke aansluiting?",
      body: "Eén- of driefasig, 7 of 11 kW, met of zonder MID-meter voor je werkgever. Iedereen verkoopt een paal. Bijna niemand kijkt naar je hele installatie.",
      tone: "I",
      image: "vbtec-auto-laden-hand",
    },
  ],
  mythKey: "capaciteitstarief-straf",
  dataBand: {
    title: "Wat kost een laadpaal en wat levert het op?",
    lead: `Een elektrische gezinswagen verbruikt ${fx("evVerbruikPer100km")} kWh per 100 km. Wat die kWh je kost, hangt af van wanneer je laadt: aan de netprijs, op je eigen zonne-overschot, of in de goedkope uren van een dynamisch contract.`,
    mode: "chart",
    chart: {
      type: "bar",
      title: "Wat kost 100 km thuis laden?",
      props: {
        bars: [
          { label: "Aan de all-in netprijs", value: "kostPer100kmThuisNet", display: fx("kostPer100kmThuisNet", { euro: true, single: true }), series: "base" },
          { label: "In goedkope uren (dynamisch)", value: 2.5, display: "meestal goedkoper, wisselt per uur", series: "mid", note: "Geen vast cijfer: de prijs verschilt per uur en per dag." },
          { label: "Op eigen zonne-overschot", value: "kostPer100kmZonOverschot", display: fx("kostPer100kmZonOverschot", { euro: true, single: true }), series: "good" },
        ],
        caption: "Op zonne-overschot betaal je enkel de injectievergoeding die je misloopt. In de winter laad je minder op zon, dan helpen goedkope uren.",
      },
    },
    stats: [
      { k: "capaciteitstariefPerKw", label: "kost per kW maandpiek, per jaar", prefix: "€ " },
      { k: "gemiddeldeMaandpiekKw", label: "gemiddelde maandpiek van een Vlaams gezin", suffix: " kW" },
      { k: "evVerbruikPer100km", label: "verbruik van een elektrische gezinswagen", suffix: " kWh/100 km" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Minimaal aangerekende maandpiek", k: "capaciteitstariefMinimumKw", suffix: " kW" },
        { label: "Capaciteitstarief per kW, per jaar", k: "capaciteitstariefPerKw", suffix: " €" },
      ],
    },
    assumptions: ["kostPer100kmThuisNet", "kostPer100kmZonOverschot", "evVerbruikPer100km", "stroomprijsAllIn", "injectievergoeding", "capaciteitstariefPerKw", "gemiddeldeMaandpiekKw"],
    assumptionsNote: "Laden in goedkope uren met een dynamisch contract heeft geen vast cijfer: de balk is illustratief. Er is geen Vlaamse premie voor een laadpaal thuis; regels voor bedrijfswagens verschillen per werkgever.",
    whenTrue: myth("capaciteitstarief-straf")?.whenTrue,
  },
  howItWorks: {
    title: "Hoe werkt een slimme laadpaal?",
    body: [
      "Een laadpaal is meer dan een stopcontact aan de muur. Een slimme laadpaal meet hoeveel stroom je huis op dat moment verbruikt en past het laadvermogen daaraan aan. Zo laad je nooit zo hard dat je zekeringen springen of je maandpiek de hoogte in gaat.",
      "Met zonnepanelen kan de laadpaal enkel laden op overschot: zodra je panelen meer maken dan je huis gebruikt, gaat het verschil naar je auto. Met een dynamisch contract kan hij wachten tot de goedkope uren van de nacht.",
      "Rijd je met een bedrijfswagen, dan heb je vaak een MID-gecertificeerde meter nodig zodat je werkgever het thuisladen correct kan terugbetalen. We plaatsen die mee.",
    ],
    image: "vbtec-laadpaal-gebruik",
  },
  systemSteps: [
    {
      partner: "zonnepanelen",
      eyebrow: "Met zonnepanelen",
      title: "Hoe past een laadpaal in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        `Je auto is de grootste flexibele verbruiker in huis. Laden op zonne-overschot kost ${fx("kostPer100kmZonOverschot", { euro: true, single: true })} per 100 km – en het verhoogt meteen het zelfverbruik van je panelen.`,
      ],
      factKeys: ["kostPer100kmZonOverschot"],
    },
    {
      partner: "thuisbatterij",
      eyebrow: "Met een thuisbatterij",
      title: "Batterij of slim laden?",
      body: [
        "Een batterij kan je auto 's avonds bijladen zonder piek. Maar slim laden op het juiste moment doet vaak hetzelfde, zonder batterij. We rekenen beide uit, met jouw rijgedrag.",
      ],
    },
  ],
  advisesAgainst: ["Je rijdt weinig en laadt vooral op het werk", "Je parkeert niet op eigen terrein", "Je huisaansluiting moet eerst verzwaard worden en dat loont niet"],
  advisesAgainstText:
    "Dan is een gewone, veilige laadoplossing of laden op het werk soms slimmer. Een dure slimme paal die je zelden gebruikt, verdient zich niet terug.",
  advisesAgainstLink: { post: "waarom-wij-soms-nee-zeggen", label: "Waarom we soms nee zeggen" },
  calculatesLead: "We kijken niet naar de paal, maar naar je auto, je dak en je piek samen.",
  calculates: withCalcImages([
    { title: "Jouw rijgedrag", body: "Hoeveel kilometer, wanneer je thuis bent en hoe vaak je moet laden: dat bepaalt de beste laadstrategie." },
    { title: "Je aansluiting en je piek", body: "Eén- of driefasig, je zekeringen en je huidige maandpiek: we rekenen hoeveel ruimte er is." },
    { title: "Laden op zon en goedkope uren", body: "Hoeveel kan je op overschot laden, en wat brengen goedkope uren op met een dynamisch contract?" },
    { title: "Bedrijfswagen en terugbetaling", body: "Heb je een MID-meter nodig voor je werkgever? We nemen het mee in het voorstel." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Dynamische vermogenssturing", "MID-meter indien nodig"],
  signature: {
    kind: "curve",
    curve: "peak",
    eyebrow: "Jouw avond",
    title: "Laden zonder je piek op te blazen",
    lead: "Zo ziet een gewone weekavond eruit: koken, wassen, en de auto die thuiskomt. Schakel tussen gewoon laden en slim laden en kijk wat er met je maandpiek gebeurt.",
    body: [
      "Bij gewoon laden komt je auto bovenop je kookpiek: je maandpiek schiet omhoog. Slim laden wacht tot de keuken stil is, of verdeelt het laden over de nacht. Je auto is 's ochtends even vol, je piek blijft laag.",
      "Dit is een illustratief profiel. Bij de berekening gebruiken we je eigen meterdata.",
    ],
    factKeys: ["capaciteitstariefPerKw"],
    link: { article: "wat-is-het-capaciteitstarief", label: "Lees: wat is het capaciteitstarief?" },
  },
  featuredProject: "koppel-hasselt-laadpaal-dynamisch",
  story: {
    title: "Een koppel in Hasselt laadt 's nachts en op de zon",
    body: "Met een slimme laadpaal en een dynamisch contract laden ze op de goedkoopste uren, zonder dat hun maandpiek stijgt.",
    image: "laadpaal-oprit-avond",
    reviewId: "r06",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun laadpaal",
  leadHeading: "Bereken welke laadoplossing loont voor jouw gezin.",
  complementary: ["zonnepanelen", "thuisbatterij"],
  relatedServices: ["zonnepanelen", "thuisbatterij"],
  relatedComparisons: ["vast-vs-dynamisch-energiecontract"],
  relatedArticles: ["wat-is-het-capaciteitstarief", "dynamisch-tarief-uitgelegd"],
  relatedPosts: ["capaciteitstarief-verlagen-zo-doe-je-het"],
  relatedProjects: ["koppel-hasselt-laadpaal-dynamisch", "nieuwbouw-leuven-all-electric"],
  interesse: ["laadpalen"],
  sources: ["kostPer100kmThuisNet", "kostPer100kmZonOverschot", "evVerbruikPer100km", "capaciteitstariefPerKw", "capaciteitstariefMinimumKw", "gemiddeldeMaandpiekKw", "injectievergoeding", "stroomprijsAllIn"],
  faq: [
    {
      q: "Wat kost thuis laden per 100 km?",
      a: `Aan de all-in netprijs kost 100 km thuis laden ${fx("kostPer100kmThuisNet", { euro: true, single: true })}, bij een verbruik van ${fx("evVerbruikPer100km")} kWh per 100 km. Laad je op je eigen zonne-overschot, dan betaal je enkel de gemiste injectievergoeding: ${fx("kostPer100kmZonOverschot", { euro: true, single: true })} per 100 km.`,
    },
    {
      q: "Verhoogt een laadpaal mijn capaciteitstarief?",
      a: `Alleen als je laadt op hetzelfde moment als andere grote verbruikers. Elke kW extra maandpiek kost ${eur("capaciteitstariefPerKw")} per jaar. Een slimme laadpaal past zijn vermogen aan aan wat je huis verbruikt, zodat je piek nauwelijks stijgt.`,
    },
    {
      q: "Kan ik laden met mijn zonnepanelen?",
      a: "Ja. Een slimme laadpaal kan enkel laden op het overschot van je panelen, of een minimum laden en de rest aanvullen met zonnestroom. In de zomer haal je zo een groot deel van je kilometers van je dak. In de winter vullen goedkope uren aan.",
    },
    {
      q: "Heb ik een driefasige aansluiting nodig?",
      a: "Niet per se. Met een eenfasige aansluiting laad je trager, maar voor de meeste gezinnen die 's nachts thuis zijn is dat ruim voldoende. Driefasig laadt sneller, maar vraagt meer aandacht voor je piek. We rekenen wat bij jouw rijgedrag en aansluiting past.",
    },
    {
      q: "Hoe werkt terugbetaling voor een bedrijfswagen?",
      a: "Veel werkgevers betalen het thuisladen van een bedrijfswagen terug op basis van de geladen kWh. Daarvoor is meestal een MID-gecertificeerde meter nodig, zodat het verbruik correct en controleerbaar gemeten wordt. Vraag de regels na bij je werkgever; wij plaatsen de juiste meter mee.",
    },
    {
      q: "Werkt een laadpaal met een dynamisch tarief?",
      a: `Ja, en dat is vaak een sterke combinatie. Met een dynamisch contract betaal je per uur de marktprijs, en een slimme laadpaal laadt dan op de goedkoopste uren. In 2025 waren er zelfs ${fx("negatievePrijsUren2025")} uren met een negatieve prijs. Je factuur schommelt wel meer.`,
    },
  ],
};

// ───────────────────────── 7. Lucht-lucht warmtepomp (airco) ─────────────────────────
const luchtLucht: ServiceContent = {
  slug: "lucht-lucht-warmtepomp",
  title: "Lucht-lucht warmtepomp (airco)",
  shortTitle: "Lucht-lucht warmtepomp (airco)",
  seoTitle: "Airco als verwarming: lucht-lucht warmtepomp",
  description:
    "Verwarmen én koelen met één toestel, tot 3 à 4 keer efficiënter dan elektrisch stoken. Ontdek voor welke ruimtes een lucht-lucht warmtepomp loont.",
  updatedAt: "2026-11-01",
  h1: "Warm in de winter, koel in de zomer – per ruimte",
  productPhrase: "een airco",
  productName: "een lucht-lucht warmtepomp",
  serviceType: "Plaatsing lucht-lucht warmtepomp (airco)",
  hubLine: "Zinvol voor een zolder, veranda of leefruimte die je apart wil verwarmen en koelen.",
  hubImage: "fermette-airco",
  heroLead: "De zolder is in de zomer onleefbaar, de veranda in de winter te koud, en het elektrisch vuurtje vreet stroom. Eén toestel kan beide oplossen – per ruimte.",
  image: "fermette-airco",
  heroFact: {
    k: "warmtekostAircoPerKwhWarmte",
    value: cent("warmtekostAircoPerKwhWarmte"),
    title: `per kWh warmte met een airco, tegenover ${cent("warmtekostElektrischPerKwhWarmte")} met een elektrisch vuurtje`,
  },
  kortAntwoord: `Ja, een lucht-lucht warmtepomp (airco) verwarmt efficiënt: met een SCOP van ${fx("scopLuchtLucht")} kost een kWh warmte ${cent("warmtekostAircoPerKwhWarmte")}, tegenover ${cent("warmtekostElektrischPerKwhWarmte")} met elektrische verwarming. Ze koelt ook in de zomer. Ze maakt geen sanitair warm water en verwarmt per ruimte, dus voor een volledige woning combineer je ze vaak met een andere oplossing.`,
  painTitle: "Eén ruimte die nooit goed is",
  painPoints: [
    {
      eyebrow: "De zomer",
      title: "Je zolder of slaapkamer is in de zomer niet om uit te houden.",
      body: "Hittegolven worden langer en vaker. Een mobiele airco met een slang uit het raam maakt vooral lawaai en verbruikt veel. Je slaapt er toch slecht.",
      tone: "D",
    },
    {
      eyebrow: "De winter",
      title: "Het elektrisch vuurtje draait, en je factuur ook.",
      body: `Een elektrisch vuurtje of convector maakt van 1 kWh stroom 1 kWh warmte: ${cent("warmtekostElektrischPerKwhWarmte")} per kWh warmte. Voor een bureau of veranda die je dagelijks gebruikt, loopt dat snel op.`,
      tone: "G",
      factKeys: ["warmtekostElektrischPerKwhWarmte"],
    },
    {
      eyebrow: "De twijfel",
      title: "Een airco is toch om te koelen?",
      body: "Dat hoor je vaak. Maar een moderne airco is gewoon een warmtepomp die ook in omgekeerde richting werkt. De vraag is: voor welke ruimtes loont het bij jou?",
      tone: "I",
      image: "fermette-airco",
    },
  ],
  mythKey: "airco-geen-verwarming",
  dataBand: {
    title: "Wat kost een airco en wat levert het op?",
    lead: "Een lucht-lucht warmtepomp haalt warmte uit de buitenlucht en blaast ze rechtstreeks de kamer in. Daardoor maakt ze van elke kWh stroom meerdere kWh warmte – een groot verschil met elektrisch stoken.",
    mode: "chart",
    chart: {
      type: "bar",
      title: "Verwarmen per kWh: airco vs elektrische radiator",
      props: {
        bars: [
          { label: "Elektrisch vuurtje of convector", value: "warmtekostElektrischPerKwhWarmte", display: cent("warmtekostElektrischPerKwhWarmte"), series: "base" },
          { label: "Lucht-lucht warmtepomp (airco)", value: "warmtekostAircoPerKwhWarmte", display: cent("warmtekostAircoPerKwhWarmte"), series: "good" },
        ],
        caption: "Kost per kWh warmte op netstroom. Met eigen zonnestroom zakt de kost voor dat deel nog verder.",
      },
    },
    stats: [
      { k: "scopLuchtLucht", label: "SCOP van een lucht-lucht warmtepomp (verwarmen)" },
      { k: "premieLuchtLuchtCat12", label: "Mijn VerbouwPremie, categorie 1 en 2 (met voorwaarden)", prefix: "€ " },
      { k: "scopRekenwaarde", label: "SCOP-rekenwaarde lucht-water, ter vergelijking" },
    ],
    extra: {
      title: "Premies, btw en regels",
      rows: [
        { label: "Mijn VerbouwPremie lucht-lucht, categorie 1 en 2", k: "premieLuchtLuchtCat12", suffix: " €" },
        { label: "Btw op een warmtepomp (t.e.m. 2029)", k: "btwWarmtepomp", suffix: "%" },
      ],
    },
    assumptions: ["warmtekostAircoPerKwhWarmte", "warmtekostElektrischPerKwhWarmte", "scopLuchtLucht", "stroomprijsAllIn", "premieLuchtLuchtCat12"],
    assumptionsNote: "De premie voor een lucht-lucht warmtepomp met actieve koeling geldt sinds maart 2026 enkel onder voorwaarden (onder meer als het toestel de enige centrale verwarming is). We controleren dat voor jouw dossier.",
    whenTrue: myth("airco-geen-verwarming")?.whenTrue,
  },
  howItWorks: {
    title: "Hoe werkt een lucht-lucht warmtepomp?",
    body: [
      "Een lucht-lucht warmtepomp bestaat uit een buitenunit en één of meer binnenunits aan de muur of in het plafond. In de winter haalt de buitenunit warmte uit de lucht en blaast de binnenunit warme lucht in de kamer. In de zomer werkt het omgekeerd: dan haalt ze de warmte uit je kamer.",
      "Met één buitenunit en één binnenunit (mono-split) verwarm en koel je één ruimte. Met een multi-split hangen er meerdere binnenunits aan één buitenunit, voor bijvoorbeeld de leefruimte en twee slaapkamers.",
      "Een airco maakt geen sanitair warm water en verdeelt de warmte niet via radiatoren. Voor een volledige woning combineer je ze daarom vaak met een lucht-water warmtepomp of een warmtepompboiler.",
    ],
    image: "fermette-airco",
  },
  systemSteps: [
    {
      partner: "zonnepanelen",
      eyebrow: "Met zonnepanelen",
      title: "Hoe past een airco in jouw energiesysteem?",
      titleAs: "h2",
      body: [
        "Koelen doe je vooral als de zon schijnt – precies wanneer je panelen het meeste maken. Een airco is dus een ideale verbruiker van je eigen zonnestroom. En in het tussenseizoen verwarm je overdag grotendeels op je dak.",
      ],
    },
    {
      partner: "lucht-water-warmtepomp",
      eyebrow: "Of lucht-water",
      title: "Wanneer lucht-water beter is",
      body: [
        "Wil je je hele woning verwarmen, ook de badkamer en de slaapkamers, en wil je sanitair warm water? Dan is een lucht-water warmtepomp meestal de betere keuze. Een airco kan dan aanvullen in ruimtes die je ook wil koelen.",
      ],
    },
  ],
  advisesAgainst: ["Je wil je hele woning met veel aparte kamers verwarmen", "Je zoekt ook sanitair warm water", "Geen plaats voor een buitenunit", "Je wil enkel een paar dagen per jaar koelen"],
  advisesAgainstText:
    "Dan is een lucht-water warmtepomp, een warmtepompboiler of gewoon goede zonwering vaak slimmer. Een airco die het verkeerde probleem oplost, is geen goede investering.",
  advisesAgainstLink: { post: "waarom-wij-soms-nee-zeggen", label: "Waarom we soms nee zeggen" },
  calculatesLead: "We rekenen per ruimte, niet per toestel.",
  calculates: withCalcImages([
    { title: "Warmte- en koelvraag per ruimte", body: "Hoeveel vermogen elke ruimte nodig heeft, rekening houdend met ramen, oriëntatie en isolatie." },
    { title: "Mono- of multi-split", body: "Eén toestel per ruimte, of meerdere binnenunits op één buitenunit? We kiezen wat het stilst en zuinigst is." },
    { title: "Plaatsing en geluid", body: "Waar de binnenunit het comfortabelst blaast en waar de buitenunit niemand stoort." },
    { title: "Combinatie met je verwarming", body: "Hoe de airco je bestaande verwarming aanvult, en wanneer lucht-water de betere keuze is." },
  ]),
  deliverables: [...DELIVERABLES_BASE, "Plaatsing door gecertificeerde koeltechnici", "Premieaanvraag indien van toepassing"],
  signature: {
    kind: "rail",
    eyebrow: "Per ruimte bekeken",
    title: "Welke ruimte heb jij in gedachten?",
    lead: "Een airco loont niet overal even veel. Zo kijken onze ingenieurs naar de ruimtes waar gezinnen ons het vaakst over bellen.",
    rooms: [
      {
        room: "Woonkamer",
        heat: "Verwarmt snel en zuinig in het tussenseizoen; je hoofdverwarming kan lager.",
        cool: "Houdt je leefruimte aangenaam tijdens hittegolven.",
        better: "Lucht-water is beter als je ook vloerverwarming of radiatoren in de hele woning wil.",
        image: "fermette-airco",
      },
      {
        room: "Slaapkamer",
        heat: "Weinig verwarming nodig; een kleine binnenunit volstaat.",
        cool: "Hier zit vaak de grootste winst: beter slapen in de zomer.",
        better: "Kies een stil toestel met nachtstand – daar letten we op bij de plaatsing.",
        image: "nieuwbouw-gezin",
      },
      {
        room: "Zolderbureau",
        heat: "Ideaal: je verwarmt enkel de ruimte waar je werkt, enkel wanneer je er bent.",
        cool: "Onder het dak loopt de temperatuur in de zomer snel op; een airco maakt het werkbaar.",
        better: "Eerst dakisolatie nakijken: dat bespaart in beide seizoenen.",
        image: "rijwoning-zonnepanelen",
      },
      {
        room: "Veranda",
        heat: "Maakt een koude veranda ook in de winter bruikbaar, zonder elektrisch vuurtje.",
        cool: "Veel glas betekent veel zon: koelen houdt ze leefbaar.",
        better: "Bij heel veel glas eerst zonwering of beter glas: anders vecht je airco tegen de zon.",
        image: "woonkamer-warm-winter",
      },
    ],
  },
  featuredProject: "fermette-brugge-airco-zonnepanelen",
  story: {
    title: "Een fermette in Brugge, koel in de zomer",
    body: "Dikke muren, kleine ramen, en toch te warm onder het dak. Een multi-split op hun eigen zonnestroom loste beide seizoenen op.",
    image: "fermette-airco",
    reviewId: "r05",
  },
  reviewsTitle: "Wat gezinnen zeggen over hun airco",
  leadHeading: "Bereken of een airco loont voor jouw ruimtes.",
  complementary: ["zonnepanelen", "lucht-water-warmtepomp"],
  relatedServices: ["zonnepanelen", "lucht-water-warmtepomp"],
  relatedComparisons: ["warmtepomp-vs-airco", "gasketel-vs-warmtepomp"],
  relatedArticles: ["scop-en-cop-uitgelegd", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
  relatedPosts: ["loont-een-warmtepomp-nog-in-2026"],
  relatedProjects: ["fermette-brugge-airco-zonnepanelen"],
  interesse: ["lucht-lucht-warmtepomp"],
  sources: ["warmtekostAircoPerKwhWarmte", "warmtekostElektrischPerKwhWarmte", "scopLuchtLucht", "premieLuchtLuchtCat12", "stroomprijsAllIn", "btwWarmtepomp"],
  faq: [
    {
      q: "Kan je met een airco efficiënt verwarmen?",
      a: `Ja. Een lucht-lucht warmtepomp haalt een SCOP van ${fx("scopLuchtLucht")}: uit 1 kWh stroom maakt ze meerdere kWh warmte. Per kWh warmte betaal je ${cent("warmtekostAircoPerKwhWarmte")}, tegenover ${cent("warmtekostElektrischPerKwhWarmte")} met een elektrisch vuurtje. Ze is vooral sterk in leefruimtes en het tussenseizoen.`,
    },
    {
      q: "Wat kost verwarmen met airco per jaar?",
      a: `Dat hangt af van de grootte van de ruimte, de isolatie en hoe vaak je ze gebruikt. Per kWh warmte reken je ${cent("warmtekostAircoPerKwhWarmte")} op netstroom, minder met eigen zonnestroom. We berekenen de warmtevraag per ruimte en zetten de jaarkost naast je huidige verwarming.`,
    },
    {
      q: "Is er een premie voor een airco?",
      a: `Ja, onder voorwaarden. Mijn VerbouwPremie geeft ${eur("premieLuchtLuchtCat12")} in inkomenscategorie 1 en 2 voor een lucht-lucht warmtepomp. Sinds maart 2026 geldt die premie voor toestellen met actieve koeling enkel als ze de enige centrale verwarming zijn. We kijken na of jij in aanmerking komt.`,
    },
    {
      q: "Kan een airco mijn hele woning verwarmen?",
      a: "In een kleine, goed geïsoleerde woning met een open plan soms wel. In een woning met veel aparte kamers en een badkamer meestal niet: een airco verwarmt per ruimte en maakt geen sanitair warm water. Dan is een lucht-water warmtepomp beter, eventueel aangevuld met een airco.",
    },
    {
      q: "Mono-split of multi-split?",
      a: "Een mono-split is één buitenunit met één binnenunit: ideaal voor één ruimte. Een multi-split verbindt meerdere binnenunits met één buitenunit, handig als je drie ruimtes wil verwarmen en koelen met één toestel buiten. We kiezen op basis van je ruimtes, de afstanden en het geluid.",
    },
    {
      q: "Werkt een airco op zonnepanelen?",
      a: "Ja, en dat past goed. Koelen doe je vooral als de zon schijnt, dus net wanneer je panelen het meeste stroom maken. Ook in het voorjaar en het najaar verwarm je overdag grotendeels op zonnestroom. Zo verhoog je het zelfverbruik van je installatie.",
    },
  ],
};

// ───────────────────────── Exports ─────────────────────────
/** Order = priority from 00 §5 (also used for generateStaticParams). */
export const services: ServiceContent[] = [luchtWater, thuisbatterij, zonnepanelen, pvt, omvormers, laadpalen, luchtLucht];

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

// ───────────────────────── /diensten hub ─────────────────────────
export const dienstenHub = {
  title: "Diensten: warmtepomp, zonnepanelen, PVT, batterij & laadpaal",
  description:
    "Zeven technieken, één doel: jouw woning zo zuinig mogelijk. Ontdek wat elke oplossing doet en laat onze ingenieurs berekenen wat jij echt nodig hebt.",
  h1: "Alles wat je woning nodig heeft – en niets meer",
  lead: "Vaak minder dan je denkt. We duwen geen product, we rekenen. Hieronder vind je de zeven bouwstenen waarmee we jouw energiesysteem samenstellen – en voor elk ervan wanneer het zinvol is, en wanneer niet.",
  groupIntros: {
    opwekken: "Stroom en warmte van je eigen dak. Zonder terugdraaiende teller draait alles om zelf verbruiken – en om een omvormer die klaar is voor wat komt.",
    verwarmen: "Van het gas af, zonder in te leveren op comfort. Lucht-water voor je hele woning, lucht-lucht voor de ruimtes die je ook wil koelen.",
    opslaan: "Je zonnestroom bewaren voor 's avonds en je auto laden zonder je maandpiek op te blazen. Alleen als het bij jouw verbruik iets oplevert.",
  } as Record<"opwekken" | "verwarmen" | "opslaan", string>,
  statement: "We duwen geen product. We rekenen wat jouw woning echt nodig heeft.",
  statementHeading: "Waarom we rekenen voor we iets voorstellen",
  statementSupport:
    "Een warmtepomp zonder zonnepanelen, panelen zonder sturing, een batterij die nooit vol raakt: losse producten werken vaak tegen elkaar. Onze ingenieurs rekenen je woning als één systeem door – met alle scenario's naast elkaar, ook 'niets doen'. Zo kies je zelf, met cijfers in plaats van verkooppraat.",
  leadHeading: "Liever meteen weten wat het voor jóuw woning betekent?",
  faq: [
    {
      q: "Welke combinatie levert het meest op?",
      a: "Dat hangt af van je woning, je verbruik en je dak. Voor veel gezinnen met een gasketel levert een warmtepomp met zonnepanelen het meeste op, met slimme sturing om zoveel mogelijk zelf te verbruiken. Een batterij of laadpaal komt erbij als je profiel dat vraagt. We rekenen het voor jouw woning uit.",
    },
    {
      q: "Kan ik in fases investeren?",
      a: "Ja, en vaak is dat zelfs slim. We tekenen dan een stappenplan: bijvoorbeeld eerst zonnepanelen met een batterij-klare omvormer, daarna een warmtepomp wanneer je ketel aan vervanging toe is, en later een batterij als de prijzen verder dalen. Zo hoeft er nooit iets opnieuw te gebeuren.",
    },
    {
      q: "Installeren jullie ook bij bestaande installaties?",
      a: "Ja. Heb je al zonnepanelen, een warmtepomp of een laadpaal van een andere installateur, dan rekenen we je bestaande installatie mee en bouwen we erop verder. Soms is een nieuwe omvormer of slimmere sturing genoeg om er veel meer uit te halen.",
    },
    {
      q: "Welke premies bestaan er nog?",
      a: `Voor een lucht-water warmtepomp krijg je via Mijn VerbouwPremie ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")}, afhankelijk van je inkomenscategorie, en ${pct("btwWarmtepomp")} btw. Ook hybride en lucht-lucht warmtepompen krijgen onder voorwaarden een premie. Zonnepanelen, batterijen en zonneboilers krijgen geen premie meer.`,
      aLong: "Wij vragen je premies aan als onderdeel van de installatie. Bedragen en voorwaarden controleren we op het moment van je offerte.",
    },
  ] as FaqItem[],
};
