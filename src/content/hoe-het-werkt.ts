// /hoe-het-werkt – pillar page copy (02 §2.1, 03 §3.4, 05 §2). Owner: Builder 1.
// Every number comes from facts.ts via v(); the worked example is derived from facts below.
// Profiles/projects referenced are placeholders (projects.ts).

import type { FactKey } from "./facts";
import { fact } from "./facts";
import type { ImageKey } from "./images";
import type { ComparisonSlug, ProjectSlug, ServiceSlug } from "./registry";
import type { FaqItem } from "./types";
import type { SceneKey } from "./system";
import { v } from "./comparisons";

export const UPDATED_AT = "2026-11-01";

export const HERO = {
  eyebrow: "Hoe het werkt",
  title: "Hoe je woning één slim energiesysteem wordt",
  lead: "Zon, warmte, opslag en slim laden – samen. Zo werkt het in jouw huis, dag en nacht, zomer en winter.",
  factTitle: "Zelf verbruikte stroom is veel meer waard dan geïnjecteerde",
  factValue: `${v("stroomprijsAllIn", { scale: 100 })} c tegenover ${v("injectievergoeding")} c per kWh`,
};

export const TRAP = {
  statement: "Panelen op het dak en tóch een hoge factuur? Dan werken je toestellen niet samen.",
  heading: "Waar komt de winst vandaan?",
  kortAntwoord: `De winst komt uit samenwerking. Zonnestroom die je zelf gebruikt, bespaart ${v("stroomprijsAllIn", { scale: 100 })} cent per kWh; injecteren levert maar ${v("injectievergoeding")} cent op. Een warmtepomp, boiler, batterij en laadpaal die op het juiste moment draaien, verhogen je zelfverbruik, houden je maandpiek laag en vervangen dure gas- of brandstofkosten.`,
  support: [
    "Neem een gezin met een mooi dak vol panelen. Overdag is niemand thuis, dus het grootste deel van de stroom gaat voor een paar cent naar het net. 's Avonds draaien de oven, de wasmachine en de laadpaal tegelijk, aan de volle prijs en met een hoge piek. De gasketel verwarmt het huis zoals altijd. Op papier hebben ze zonnepanelen; op de factuur zie je er weinig van.",
    "Dat is de val van losse producten. Elk toestel doet zijn werk, maar niemand kijkt naar het geheel. Een ingenieur die rekent, begint daarom niet bij een product, maar bij je verbruik per uur: wanneer je stroom maakt, wanneer je ze nodig hebt, en welke toestellen kunnen wachten.",
  ],
};

export const DIAGRAM_INTRO = {
  eyebrow: "Het huisdiagram",
  title: "Zie in je eigen huis waar je stroom en warmte naartoe gaan",
  lead: "Kies een moment van de dag en tik op een onderdeel. Je ziet wat het doet, welke energie waarheen stroomt en wat het je oplevert. Onder het diagram staat alles ook in woorden.",
};

export type Chapter = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  factKeys: FactKey[];
  links: { kind: "service"; slug: ServiceSlug }[];
  diagram: { highlight: ServiceSlug[]; scenes: SceneKey[] };
  id: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "overdag",
    eyebrow: "Zelfverbruik",
    title: "Overdag: zonnestroom eerst in huis",
    paragraphs: [
      `Tussen ongeveer tien en vier uur maken je panelen het meeste stroom. Elke kWh die je op dat moment zelf gebruikt, hoef je niet aan ${v("stroomprijsAllIn", { scale: 100 })} cent te kopen. Elke kWh die je injecteert, levert maar ${v("injectievergoeding")} cent op. Sinds de terugdraaiende teller verdwenen is, is dat verschil de belangrijkste factor in het rendement van je panelen.`,
      `Een gezin dat overdag weinig thuis is en niets stuurt, verbruikt doorgaans ${v("zelfverbruikZonder")}% van zijn eigen zonnestroom. Met slimme sturing is ${v("zelfverbruikMet")}% haalbaar. Dat doe je niet door zuiniger te leven, maar door verbruik te verschuiven: de boiler of warmtepomp warmt water op rond de middag, de vaatwas en wasmachine starten met een timer, en de auto laadt wanneer de zon schijnt.`,
      "Een hybride omvormer beslist daarbij waar elke kWh naartoe gaat: eerst naar je huis, dan naar de boiler of de batterij, en pas als laatste naar het net. Met een dynamisch contract kan hij injectie zelfs beperken op momenten dat de marktprijs negatief is.",
    ],
    factKeys: ["stroomprijsAllIn", "injectievergoeding", "zelfverbruikZonder", "zelfverbruikMet"],
    links: [
      { kind: "service", slug: "zonnepanelen" },
      { kind: "service", slug: "omvormers" },
    ],
    diagram: { highlight: ["zonnepanelen", "omvormers"], scenes: ["dag"] },
  },
  {
    id: "avond",
    eyebrow: "Opslag & sturing",
    title: "'s Avonds en 's nachts: batterij en slim sturen",
    paragraphs: [
      "Wanneer de zon ondergaat, begint in de meeste gezinnen het grootste verbruik: koken, licht, tv, de wasmachine, de auto aan de laadpaal. Zonder opslag komt die stroom volledig van het net, aan de volle prijs.",
      `Een thuisbatterij vangt het overschot van de middag op en geeft het 's avonds terug. Ze kost vandaag ${v("prijsThuisbatterijPerKwh", { pre: "€ " })} per kWh opslagcapaciteit, en daarom rekenen we altijd eerst uit of er genoeg overschot én genoeg avondverbruik is om haar te vullen en te legen. Is dat niet zo, dan is een batterij een dure doos aan de muur.`,
      "Slim sturen is vaak de goedkopere eerste stap. Een warmtepomp die overdag de vloer en de boiler extra opwarmt, gebruikt 's avonds minder stroom. Een laadpaal die wacht tot na het koken, of tot de goedkoopste nachturen, voorkomt een piek. Wat niet te verschuiven valt, is waar een batterij echt het verschil maakt.",
    ],
    factKeys: ["prijsThuisbatterijPerKwh"],
    links: [
      { kind: "service", slug: "thuisbatterij" },
      { kind: "service", slug: "laadpalen" },
    ],
    diagram: { highlight: ["thuisbatterij", "laadpalen"], scenes: ["avond"] },
  },
  {
    id: "winter",
    eyebrow: "Warmte",
    title: "In de winter: warmtepomp, PVT en dynamisch tarief",
    paragraphs: [
      `In de winter draait alles om warmte. Een lucht-water warmtepomp haalt die uit de buitenlucht en maakt van elke kWh stroom meerdere kWh warmte. Hoeveel precies, hangt vooral af van de temperatuur van het water naar je radiatoren of vloer: bij 35 °C haalt een goed ontworpen warmtepomp een seizoensrendement (SCOP) van ${v("scopLuchtWater35", { dec: 1 })}, bij 55 °C nog ${v("scopLuchtWater55", { dec: 1 })}. Daarom rekenen we de afgiftetemperatuur van elke kamer.`,
      "PVT-panelen geven de warmtepomp een extra voordeel. Ze maken overdag stroom, maar leveren ook warmte als bron, zelfs bij weinig zon en 's nachts. Een warmtepomp die uit een warmere bron put, verbruikt minder stroom per kWh warmte. Weinig installateurs bieden PVT aan; wij onderzoeken het verder en rekenen de opbrengst per woning uit, zonder gemiddelden te beloven.",
      "Een dynamisch contract kan daar nog iets aan toevoegen. Met een buffervat of een goed geïsoleerde vloer kan de warmtepomp haar zwaarste werk in de goedkoopste uren doen. Dat werkt alleen als de sturing automatisch gebeurt; met de hand de uurprijzen volgen houdt niemand vol.",
    ],
    factKeys: ["scopLuchtWater35", "scopLuchtWater55"],
    links: [
      { kind: "service", slug: "lucht-water-warmtepomp" },
      { kind: "service", slug: "pvt-panelen" },
    ],
    diagram: { highlight: ["lucht-water-warmtepomp", "pvt-panelen"], scenes: ["winter"] },
  },
  {
    id: "capaciteitstarief",
    eyebrow: "Pieken",
    title: "Het capaciteitstarief: waarom pieken vermijden telt",
    paragraphs: [
      `Sinds het capaciteitstarief betaal je niet alleen voor hoeveel stroom je gebruikt, maar ook voor je hoogste piek. Fluvius kijkt elke maand naar het kwartier waarin je het meeste vermogen trok, en rekent het gemiddelde van die maandpieken aan: ${v("capaciteitstariefPerKw", { pre: "€ " })} per kW per jaar, afhankelijk van je netgebied. Iedereen betaalt minstens voor ${v("capaciteitstariefMinimumKw")} kW. De gemiddelde Vlaamse maandpiek ligt op ${v("gemiddeldeMaandpiekKw", { dec: 2 })} kW.`,
      "Wie een warmtepomp of laadpaal plaatst zonder sturing, ziet die piek stijgen. Een auto die laadt terwijl de oven en de droogkast draaien, kan je piek met enkele kW verhogen, en dat betaal je het hele jaar. Slim gestuurd stijgt je piek vaak maar een beetje, en soms helemaal niet.",
      "In een goed ontworpen systeem praten de toestellen met elkaar. De laadpaal laadt trager zolang het huis veel verbruikt, de warmtepomp schuift een halfuur op, en de batterij springt bij in het drukste kwartier. Zo betaal je voor energie die je nodig hebt, niet voor een piek die je kon vermijden.",
    ],
    factKeys: ["capaciteitstariefPerKw", "capaciteitstariefMinimumKw", "gemiddeldeMaandpiekKw"],
    links: [
      { kind: "service", slug: "thuisbatterij" },
      { kind: "service", slug: "laadpalen" },
    ],
    diagram: { highlight: ["thuisbatterij", "omvormers"], scenes: ["piek"] },
  },
  {
    id: "auto",
    eyebrow: "Mobiliteit",
    title: "Je auto: de grootste flexibele verbruiker",
    paragraphs: [
      `Een elektrische gezinswagen verbruikt ${v("evVerbruikPer100km")} kWh per 100 km. Thuis laden aan de netprijs kost zo ${v("kostPer100kmThuisNet", { pre: "€ " })} per 100 km. Laad je op eigen zonne-overschot, dan kost het je alleen de injectievergoeding die je misloopt: ${v("kostPer100kmZonOverschot", { pre: "€ " })} per 100 km.`,
      "Dat maakt de auto de grootste flexibele verbruiker in huis. Een gezinswagen staat het grootste deel van de dag stil, en hoeft meestal niet meteen vol. Een slimme laadpaal laadt op zonne-overschot als de auto thuis is, en anders in de goedkoopste nachturen, zonder je maandpiek op te blazen.",
      "Eerlijk is eerlijk: in de winter, of als de auto overdag op het werk staat, laad je weinig op eigen zon. Dan komt het voordeel vooral uit slim plannen en, met een dynamisch contract, uit goedkope uren. We rekenen met hoe jullie de auto echt gebruiken, niet met het ideale scenario.",
    ],
    factKeys: ["evVerbruikPer100km", "kostPer100kmThuisNet", "kostPer100kmZonOverschot"],
    links: [{ kind: "service", slug: "laadpalen" }],
    diagram: { highlight: ["laadpalen", "zonnepanelen"], scenes: ["dag"] },
  },
];

// ───────────── Rekenvoorbeeld (stacked bar) ─────────────
// Voorbeeldgezin, vlakke prijzen (facts.ts):
// VÓÓR (gasketel): gas 17.000 × 0,11 + 175 vast = 2.045 · stroom 3.500 × 0,30 = 1.050 ·
//   capaciteitstarief gemiddeldeMaandpiekKw 4,25 × 56 = 238 → ca. € 3.333/jaar.
// NA (warmtepomp + 6 kWp zon + slimme sturing): warmte 15.300 kWh / SCOP 3,5 = 4.371 kWh;
//   totaal 7.871 kWh; zon 6 × 900 = 5.400 kWh, zelfverbruik 50% (onderkant zelfverbruikMet) = 2.700 kWh;
//   netstroom 5.171 × 0,30 = 1.551 − injectie 2.700 × 0,04 = 108 → 1.443;
//   capaciteitstarief 5 kW × 56 = 280 → ca. € 1.723/jaar. (Gasaansluiting afgesloten.)
const F = (k: FactKey) => fact(k).value;
const GAS = F("gasverbruikGezin") * F("gasprijsAllIn") + F("gasVasteKosten");
const POWER = F("stroomverbruikGezin") * F("stroomprijsAllIn");
const PEAK_BEFORE = F("gemiddeldeMaandpiekKw") * F("capaciteitstariefPerKw");
const HP_KWH = (F("gasverbruikGezin") * F("rendementGascondensatieketel")) / F("scopRekenwaarde");
const PV_KWP_EX = 6;
const PV_KWH = PV_KWP_EX * F("pvOpbrengstPerKwp");
const SELF = PV_KWH * (fact("zelfverbruikMet").range![0] / 100);
const GRID_AFTER = (F("stroomverbruikGezin") + HP_KWH - SELF) * F("stroomprijsAllIn") - (PV_KWH - SELF) * (F("injectievergoeding") / 100);
const PEAK_KW_AFTER = 5;
const PEAK_AFTER = PEAK_KW_AFTER * F("capaciteitstariefPerKw");
const r = (n: number) => Math.round(n);

export const EXAMPLE = {
  eyebrow: "Rekenvoorbeeld",
  title: "Wat betekent dit in euro? Een rekenvoorbeeld",
  lead: `Een voorbeeldgezin met een gasketel, ${v("gasverbruikGezin")} kWh gas en ${v("stroomverbruikGezin")} kWh stroom per jaar. Na de overstap: een lucht-water warmtepomp, ${PV_KWP_EX} kWp zonnepanelen en slimme sturing. Vier hefbomen maken het verschil.`,
  rows: [
    {
      label: "Vóór: gasketel",
      segments: [
        { label: "Gas (incl. vaste kosten)", value: r(GAS), series: "base" as const },
        { label: "Stroom", value: r(POWER), series: "mid" as const },
        { label: "Capaciteitstarief", value: r(PEAK_BEFORE), series: "mid" as const },
      ],
    },
    {
      label: "Na: warmtepomp + zon + sturing",
      segments: [
        { label: "Netstroom min injectie", value: r(GRID_AFTER), series: "good" as const },
        { label: "Capaciteitstarief", value: r(PEAK_AFTER), series: "mid" as const },
      ],
    },
  ],
  caption: `Indicatief, vlakke prijzen. Zonder investering en premies: die staan in je persoonlijke berekening. Het capaciteitstarief stijgt in dit voorbeeld licht, naar ${PEAK_KW_AFTER} kW, omdat de warmtepomp meer vermogen vraagt; met een batterij kan het lager.`,
  assumptions: [
    "gasverbruikGezin",
    "stroomverbruikGezin",
    "gasprijsAllIn",
    "gasVasteKosten",
    "stroomprijsAllIn",
    "rendementGascondensatieketel",
    "scopRekenwaarde",
    "pvOpbrengstPerKwp",
    "zelfverbruikMet",
    "injectievergoeding",
    "capaciteitstariefPerKw",
    "gemiddeldeMaandpiekKw",
  ] as FactKey[],
  assumptionsNote: `Vlakke prijzen, geen prijsstijging verondersteld. ${PV_KWP_EX} kWp zonnepanelen, zelfverbruik ${Math.round((SELF / PV_KWH) * 100)}% (de onderkant van wat met sturing haalbaar is), maandpiek na de overstap ${PEAK_KW_AFTER} kW. Investering, premies en onderhoud zitten niet in deze jaarkost.`,
  whenTrue:
    "Niet elk huis haalt dit. Met een kleine of beschaduwde dakoppervlakte, een slecht geïsoleerde woning of een zeer goedkoop gascontract is de winst kleiner. Dat zie je in je eigen berekening, met een scenario 'niets doen' ernaast.",
};

export const PROFILES = {
  eyebrow: "Niet elk huis heeft alles nodig",
  title: "Waarom we nooit één product duwen",
  lead: "Drie woningen, drie verschillende antwoorden. De combinatie hangt af van je dak, je isolatie, je verbruik en je plannen.",
  items: [
    {
      title: "Rijwoning met een klein dak",
      body: "Zonnepanelen en een omvormer die batterij-klaar is, plus slim sturen van boiler en wasmachine. Een batterij? Misschien, als het avondverbruik hoog genoeg is.",
      image: "rijwoning-zonnepanelen" as ImageKey,
      tags: ["Zonnepanelen", "Omvormer", "Batterij: misschien"],
      project: "rijwoning-antwerpen-zon-batterij" as ProjectSlug,
    },
    {
      title: "Jaren '70-woning met gasketel",
      body: "Eerst de radiatoren en het dak bekijken, dan een lucht-water warmtepomp met PVT-panelen als warmtebron en stroombron. De gasaansluiting kan eruit.",
      image: "jaren70-woning" as ImageKey,
      tags: ["Warmtepomp", "PVT-panelen", "Omvormer"],
      project: "gezinswoning-gent-warmtepomp-pvt" as ProjectSlug,
    },
    {
      title: "Nieuwbouw, all-electric",
      body: "Geen gas meer toegelaten, dus meteen goed: warmtepomp, zonnepanelen, laadpaal en een batterij die de pieken van koken en laden opvangt.",
      image: "nieuwbouw-gezin" as ImageKey,
      tags: ["Warmtepomp", "Zonnepanelen", "Laadpaal", "Batterij"],
      project: "nieuwbouw-leuven-all-electric" as ProjectSlug,
    },
  ],
};

export const HONEST = {
  eyebrow: "Eerlijk advies",
  text: "We rekenen eerst. Is er geen winst, dan zeggen we dat.",
  comparisons: ["gasketel-vs-warmtepomp", "met-of-zonder-thuisbatterij", "vast-vs-dynamisch-energiecontract"] satisfies ComparisonSlug[],
};

export const STORY_PROJECT: ProjectSlug = "nieuwbouw-leuven-all-electric";

export const FAQ: FaqItem[] = [
  {
    q: "Waarom is zelfverbruik belangrijker dan injectie?",
    a: `Omdat een zelf verbruikte kWh je ${v("stroomprijsAllIn", { scale: 100 })} cent bespaart, terwijl een geïnjecteerde kWh maar ${v("injectievergoeding")} cent oplevert. Sinds de terugdraaiende teller weg is, bepaalt het deel dat je zelf gebruikt het rendement van je panelen. Daarom sturen we verbruik naar de uren waarop de zon schijnt.`,
  },
  {
    q: "Heb ik een batterij nodig als ik een warmtepomp heb?",
    a: "Niet altijd. Een warmtepomp met een boiler of een goed geïsoleerde vloer kan zelf al veel zonnestroom opslaan als warmte. Een batterij wordt interessant als je daarnaast veel avondverbruik hebt, een elektrische auto, of een dynamisch contract. We rekenen het met en zonder uit.",
  },
  {
    q: "Kan een warmtepomp op zonnestroom draaien in de winter?",
    a: "Deels. In de winter leveren zonnepanelen veel minder, terwijl de warmtepomp het meest draait. Op zonnige winterdagen dekt je eigen stroom een stuk van het verbruik; de rest komt van het net. Daarom tellen in de winter vooral een hoge SCOP, een lage aanvoertemperatuur en slim plannen in goedkope uren.",
  },
  {
    q: "Wat is het verschil tussen PV en PVT in zo'n systeem?",
    a: "Gewone zonnepanelen (PV) maken alleen stroom. PVT-panelen maken stroom én warmte, die je warmtepomp als bron gebruikt. In een systeem met een warmtepomp kan PVT zo het rendement verhogen, ook in de winter. Zonder warmtepomp zijn gewone panelen meestal de logischere keuze.",
  },
  {
    q: "Verhoogt een warmtepomp of laadpaal mijn capaciteitstarief?",
    a: `Dat kan, als ze ongestuurd draaien terwijl ook andere toestellen veel vragen. Elke kW extra maandpiek kost ${v("capaciteitstariefPerKw", { pre: "€ " })} per jaar. Met slimme sturing stijgt je piek vaak maar een beetje: de laadpaal wacht, de warmtepomp schuift op en een eventuele batterij springt bij.`,
  },
  {
    q: "Heb ik een dynamisch contract nodig?",
    a: "Nee, het is een extra hefboom, geen voorwaarde. Een dynamisch contract loont vooral als je toestellen automatisch kunnen reageren op de uurprijs: een batterij, een warmtepomp met buffer of een elektrische auto. Zonder sturing kies je beter een vast contract. We rekenen beide voor je uit.",
  },
];

export const LEAD_HEADING = "Welke combinatie past bij jouw woning? We rekenen het uit.";
