// Home page copy for the new sections (05 §1, 03 §3.1) – owner: Builder 1.
// Existing sections (Hero, Products, Mission, Services) keep their copy inline in
// src/components/{hero,products,mission,services}. Every number comes from facts.ts via v().
// The household/projects referenced are placeholders (see projects.ts, reviews.ts).

import type { FactKey } from "./facts";
import type { ImageKey } from "./images";
import type { ComparisonSlug } from "./registry";
import type { FaqItem } from "./types";
import { MYTHS } from "./facts";
import { getFaqs } from "./faqs";
import { v } from "./comparisons";

export type PainCard = { tone: "D" | "G" | "I"; eyebrow: string; title: string; body: string; image?: ImageKey; factKeys?: FactKey[] };

export const PAIN = {
  eyebrow: "Herken je dit?",
  title: "Je factuur stijgt.",
  titleMuted: "Je verbruik niet.",
  lead: "Je doet niets verkeerd. De regels veranderden onder je.",
  cards: [
    {
      tone: "I",
      eyebrow: "Je voorschot",
      title: "Je voorschot ging omhoog, je verbruik niet.",
      body: "Lichten uit, thermostaat lager – en toch schrik je van de jaarafrekening.",
      image: "gezin-keuken-factuur",
    },
    {
      tone: "D",
      eyebrow: "Het capaciteitstarief",
      title: "Sinds het capaciteitstarief betaal je ook voor je pieken.",
      body: `Je hoogste kwartier per maand kost een Vlaams gezin gemiddeld ${v("capaciteitstariefGemiddeldPerJaar", { pre: "€ " })} per jaar.`,
      factKeys: ["capaciteitstariefGemiddeldPerJaar"],
    },
    {
      tone: "G",
      eyebrow: "Je zonnepanelen",
      title: "Je panelen draaien, maar je stroom gaat voor een paar cent het net op.",
      body: `Overdag weg voor ${v("injectievergoeding")} cent per kWh, 's avonds terugkopen aan ${v("stroomprijsAllIn", { scale: 100 })} cent.`,
      factKeys: ["injectievergoeding", "stroomprijsAllIn"],
    },
    {
      tone: "D",
      eyebrow: "Je ketel",
      title: "Je ketel is vijftien jaar oud. Weer gas voelt als geld weggooien, een warmtepomp als een gok.",
      body: "Iedereen heeft een mening. Niemand rekende jouw woning door. Wij wel – met een scenario 'niets doen' erbij.",
    },
  ] satisfies PainCard[],
};

const heatMyth = MYTHS.find((m) => m.key === "warmtepomp-loont-niet")!;

export const MYTH = {
  eyebrow: "Wat je vaak hoort",
  quote: "“Een warmtepomp loont niet meer. Hou gewoon je gasketel.”",
  heading: "Klopt dat? Loont het nog? We legden het naast de Vlaamse cijfers.",
  pills: ["Stroom is te duur", "Zonnepanelen lonen niet meer", "Een batterij verdien je nooit terug", "Mijn huis is te oud", "Er zijn geen premies meer"],
};

export const DATA = {
  eyebrow: "De cijfers",
  title: "Wat kost 1 kWh warmte",
  titleMuted: "in Vlaanderen?",
  lead: `Stroom is duurder dan gas, maar een warmtepomp maakt van 1 kWh stroom ${v("scopRekenwaarde", { dec: 1 })} kWh warmte. Wat telt, is de prijs van je warmte.`,
  whenTrue: heatMyth.whenTrue,
};

export const PVT = {
  eyebrow: "PVT-panelen · onderzoek",
  title: "Eén dak, twee opbrengsten: stroom én warm water.",
  body: "Weinig installateurs bieden PVT aan. Wij wel, en we blijven eraan onderzoeken. Een PVT-paneel maakt stroom zoals een gewoon zonnepaneel en geeft tegelijk warmte af aan je warmtepomp. Zo haal je meer uit hetzelfde dak, ook in de winter. De opbrengst rekenen we per woning uit.",
};

export const SYSTEM_TEASER = {
  eyebrow: "Hoe het samenwerkt",
  title: "Je woning als één systeem: zon eerst in huis, de rest slim gestuurd.",
  lead: "Elk toestel alleen doet het goed. Samen vangen ze elkaars overschot op – en daar zit de echte winst.",
};

export const SMART_SPLIT = {
  badge: "Slim gestuurd",
  title: "Eerst je eigen zon. Dan pas het net.",
  lead: "Wij laten warmtepomp, boiler, batterij en auto draaien op je eigen zonnestroom. Zo betaal je minder en verdien je je installatie sneller terug.",
  points: ["Panelen en omvormer op maat van je dak", "Warmtepomp die draait als de zon schijnt", "Een batterij enkel als ze loont", "Alles live in één app"],
  chip: "Voorbeelddag in juni · 6 kWp",
};

export const PROJECTS_BENTO = {
  eyebrow: "Projecten",
  title: "Gezinnen zoals jij. Hun factuur vóór en na.",
  body: "Elke woning is anders. Zo rekenden we het uit voor vier gezinnen – en zo ziet hun factuur er nu uit.",
  side: {
    title: "Ook als het niet loont, zeggen we het.",
    body: "In Kortrijk raadden we de batterij af. Het gezin kreeg panelen, en een eerlijk antwoord.",
    caption: "Ingenieurs, geen verkopers",
  },
  note: "Voorbeeldprojecten · indicatieve cijfers, berekend met Vlaamse rekenwaarden 2026",
};

export const PROJECTS_INTRO = {
  eyebrow: "Projecten",
  title: "Gezinnen zoals jij. Hun factuur vóór en na.",
};

export const REVIEWS_INTRO = {
  eyebrow: "Reviews",
  title: "Wat gezinnen zeggen",
  titleMuted: "na hun berekening.",
};

export const DOUBT = {
  eyebrow: "Twijfel je nog?",
  text: "Gasketel of warmtepomp? Met of zonder batterij? We vergelijken het eerlijk.",
  comparisons: ["gasketel-vs-warmtepomp", "met-of-zonder-thuisbatterij", "met-of-zonder-zonnepanelen", "vast-vs-dynamisch-energiecontract"] satisfies ComparisonSlug[],
};

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Loont een warmtepomp nog in 2026?",
    a: `In de meeste woningen wel. Per kWh warmte betaal je met een goed ontworpen warmtepomp ${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} cent, met gas ${v("warmtekostGasPerKwhWarmte", { scale: 100, dec: 1 })} cent. Vanaf een seizoensrendement (SCOP) van ${v("breakEvenScop", { dec: 1 })} wint de warmtepomp. Je radiatoren, isolatie en gascontract bepalen hoeveel.`,
    aLong: `Een nieuwe gasketel betaal je bovendien aan ${v("btwGasketel")}% btw, een warmtepomp aan ${v("btwWarmtepomp")}%, en vanaf ${v("ets2Start", { year: true })} komt er een Europese CO₂-prijs op gas. In een slecht geïsoleerde woning met kleine radiatoren raden we soms eerst isoleren of een hybride aan.`,
  },
  {
    q: "Zijn zonnepanelen nog rendabel zonder terugdraaiende teller?",
    a: `Ja, als je een groot deel van je zonnestroom zelf verbruikt. Een zelf verbruikte kWh bespaart ${v("stroomprijsAllIn", { scale: 100 })} cent, een geïnjecteerde levert ${v("injectievergoeding")} cent op. Met slimme sturing van boiler, warmtepomp of auto verdien je een installatie terug in ${v("terugverdientijdZonnepanelen")} jaar.`,
  },
  {
    q: "Kan mijn energiefactuur echt naar €0?",
    a: "Soms komt ze in de buurt, maar we beloven het niet. Met zonnepanelen, een warmtepomp en slimme sturing kan een gezin zijn netto energiekost over een jaar sterk verlagen, tot ~€0 in gunstige gevallen. Netkosten, het capaciteitstarief en de winter blijven. Je berekening toont eerlijk waar jij uitkomt.",
    aLong: "Een factuur van €0 vraagt een goed dak, een woning die weinig warmte verliest en een verbruik dat je kan verschuiven. Daarom spreken we altijd van 'zo dicht mogelijk bij €0' en rekenen we het met jouw cijfers.",
  },
  ...getFaqs(["berekening-kost", "altijd-iets-verkopen", "regio"]),
];

export const LEAD_HEADING = "Wat kan jouw woning besparen? We rekenen het voor je uit.";
