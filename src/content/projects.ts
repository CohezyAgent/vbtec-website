// PLACEHOLDER – vervang door echte gegevens
// Voorbeeldprojecten (Builder 3). Geen echte klanten: voornamen en gezinnen zijn verzonnen, de
// cijfers zijn BEREKEND met de rekenwaarden uit src/content/facts.ts (stand 2026), niet gemeten.
// De UI toont overal het label "Voorbeeldproject". Vervang door echte projecten met gemeten
// cijfers en toestemming van de klant. Nooit Review-schema voor deze data.
//
// Rekenwaarden (facts.ts): stroom all-in 0,30 €/kWh · gas all-in 0,11 €/kWh + € 175 vaste kosten ·
// stookolie 0,15 €/kWh · capaciteitstarief € 56/kW/jaar · injectie 0,04 €/kWh · PV 900 kWh/kWp
// (oost/west 850) · SCOP lucht-water 3,5 (35 °C: 4,2) · SCOP lucht-lucht 3,8 · ketelrendement 0,9 ·
// EV 18 kWh/100 km · PV € 1.300/kWp · batterij € 600/kWh · lucht-water € 11.000.
// Prijzen vlak gehouden (geen prijsstijging verondersteld). Maandbedragen = jaarbedrag / 12, afgerond.

import type { ImageInput, Project, ProjectSlug } from "./types";
import { PROJECTS } from "./registry";

export const isPlaceholder = true;

export type Scenario = {
  name: string;
  /** Investering na premie, of "–". */
  invest: string;
  /** Indicatieve energiefactuur per maand. */
  perMonth: string;
  payback: string;
  verdict: "gekozen" | "afgeraden" | "referentie" | "optie";
  note: string;
};

export type ProjectStat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number };

export type ProjectDetail = Project & {
  /** Short family line for chips/cards: "Gezin met twee kinderen". */
  family: string;
  /** Hero lead (client-centred). */
  lead: string;
  situation: string[];
  challenge: string[];
  doubt: string;
  calculated: string[];
  scenarios: Scenario[];
  /** Kortrijk only: "Waarom we geen batterij plaatsten". */
  whyNot?: { title: string; paragraphs: string[] };
  /** Installed setup with one line each (gallery captions + "Gebruikte technieken"). */
  setup: { title: string; detail: string; image: ImageInput }[];
  stats: ProjectStat[];
  /** Line under the stats band. */
  resultNote: string;
  install: { investering: string; premie: string; duur: string; terugverdientijd: string };
  quote: { text: string; name: string };
  /** Photo behind the "In hun woorden" quote panel (different from the hero). */
  quoteImage: ImageInput;
};

const projects: ProjectDetail[] = [
  // ───────────────────────────── Gent ─────────────────────────────
  // Vóór: gas 17.000 kWh × 0,11 = 1.870 + 175 vast = 2.045; stroom 3.500 × 0,30 = 1.050;
  //       capaciteitstarief 4,25 kW × 56 = 238 → 3.333/jaar ≈ € 275/maand (00 §3).
  // Na:   warmte 17.000 × 0,9 = 15.300 kWh; / SCOP 3,5 = 4.371 kWh stroom; totaal 7.871 kWh.
  //       6 kWp PVT elektrisch × 900 = 5.400 kWh; zelfverbruik 50 % = 2.700 kWh.
  //       net 5.171 × 0,30 = 1.551; injectie 2.700 × 0,04 = −108; piek 5 kW × 56 = 280 → 1.723/jaar ≈ € 144/maand.
  //       Nieuwe gasketel: 17.000 × 0,85/0,9 = 16.055 × 0,11 + 175 + 1.050 + 238 = 3.229 ≈ € 269/maand.
//       + batterij 10 kWh: +1.350 kWh zelfverbruik × 0,26 = 351 + 1 kW piek × 56 = 407/jaar → ≈ € 110/maand, ca. 15 jaar.
//       Thermische winst van PVT (voorverwarming sanitair water) bewust NIET meegeteld.
  {
    slug: "gezinswoning-gent-warmtepomp-pvt",
    quoteImage: "warmtepomp-tuin",
    isPlaceholder,
    title: "Gezinswoning in Gent: warmtepomp + PVT",
    shortTitle: "Gezinswoning in Gent",
    seoTitle: "Gezinswoning in Gent: warmtepomp + PVT",
    description:
      "Hoe een gezin in Gent van ca. € 275 naar ca. € 144 per maand ging met een warmtepomp en PVT-panelen. Situatie, berekening en resultaat (indicatief).",
    updatedAt: "2026-11-01",
    h1: "Gezin in Gent: de gasketel eruit, de energiefactuur bijna gehalveerd",
    family: "Gezin met twee kinderen",
    place: "Gent",
    homeType: "Halfopen gezinswoning",
    buildYear: "1974",
    products: ["lucht-water-warmtepomp", "pvt-panelen", "omvormers"],
    headline: { before: "€ 275", after: "€ 144", unit: "/maand" },
    image: "jaren70-woning",
    lead: "Sarah en Jeroen wonen met hun twee kinderen in een halfopen woning uit 1974. Hun gasketel was aan vervanging toe, en ze wilden niet opnieuw twintig jaar aan gas vastzitten.",
    summary:
      "Een jaren '70-woning met radiatoren, een oude gasketel en een dak dat meer kon. We rekenden een lucht-water warmtepomp met PVT-panelen door, en ook wat het zou kosten om gewoon een nieuwe gasketel te plaatsen.",
    situation: [
      "De woning van Sarah en Jeroen is een typische halfopen bebouwing uit 1974: gele baksteen, een schilddak en grote ramen. Het dak werd tien jaar geleden geïsoleerd, de ramen kregen dubbel glas, maar de muren zijn nog grotendeels ongeïsoleerd.",
      "Ze verbruikten ongeveer 17.000 kWh gas per jaar voor verwarming en warm water, en 3.500 kWh stroom. Alles samen betaalden ze zo'n € 275 per maand aan energie. Hun condensatieketel was zestien jaar oud en had de voorbije winter twee keer een technieker nodig.",
    ],
    challenge: [
      "De vraag was niet óf ze iets moesten doen, maar wat. Een nieuwe gasketel kost minder bij aankoop, maar betaalt sinds juli 2025 21 % btw en zet hen voor vijftien à twintig jaar vast aan een energiebron die duurder wordt door de taxshift en, vanaf 2028, de Europese CO₂-prijs.",
      "Tegelijk zaten er in de woning nog klassieke radiatoren. Dat betekent een hogere aanvoertemperatuur en dus een lager rendement voor een warmtepomp. Dat moest eerst eerlijk doorgerekend worden.",
    ],
    doubt:
      "\"Iedereen zei ons: een warmtepomp in een huis van 1974, dat werkt niet. En een buurman had een verkoper over de vloer gehad die vooral een batterij wilde verkopen.\"",
    calculated: [
      "We maten eerst de warmtevraag per ruimte en keken welke radiatoren groot genoeg waren. In de living en de keuken bleken twee radiatoren te klein; die vervingen we door lage-temperatuurradiatoren. Zo kon de warmtepomp op maximaal 45 °C draaien in plaats van 55 °C.",
      "Op het zuidwestdak was plaats voor zes kWp aan PVT-panelen. Die maken stroom én warmen het sanitair water voor. In de berekening hieronder telden we alleen de stroom mee: de thermische winst van PVT rekenen we per project en laten we hier bewust weg, zodat het resultaat eerder te voorzichtig is dan te mooi.",
      "Een thuisbatterij rekenden we ook door. Die leverde bij hun profiel weinig extra op: de warmtepomp en de boiler verbruiken de zonnestroom overdag al. We plaatsten wel een hybride omvormer, zodat een batterij later zonder gedoe bij kan.",
    ],
    scenarios: [
      { name: "Niets doen (oude ketel tot hij stopt)", invest: "–", perMonth: "€ 275", payback: "–", verdict: "referentie", note: "Risico op pech midden in de winter, gas wordt duurder." },
      { name: "Nieuwe gasketel", invest: "per offerte", perMonth: "ca. € 269", payback: "–", verdict: "optie", note: "Lager rendement van de oude ketel weg, maar 21 % btw en 15–20 jaar gas." },
      { name: "Warmtepomp + PVT + hybride omvormer", invest: "per project berekend", perMonth: "ca. € 144", payback: "per project", verdict: "gekozen", note: "Thermische PVT-winst niet meegeteld." },
      { name: "Idem + thuisbatterij 10 kWh", invest: "+ ca. € 6.000", perMonth: "ca. € 110", payback: "ca. 15 jaar voor de batterij", verdict: "afgeraden", note: "Te weinig extra zelfverbruik voor deze investering – nu." },
    ],
    setup: [
      { title: "Lucht-water warmtepomp", detail: "Buitenunit tegen de zijgevel, gestuurd op de uren met zonnestroom.", image: "product-warmtepomp" },
      { title: "PVT-panelen", detail: "Zes kWp op het zuidwestdak: stroom en voorverwarming van het sanitair water.", image: "product-zonnepanelen" },
      { title: "Hybride omvormer", detail: "Batterij-klaar, zodat een thuisbatterij later zonder extra omvormer kan.", image: "product-omvormer" },
      { title: "Twee lage-temperatuurradiatoren", detail: "In living en keuken, zodat de warmtepomp op maximaal 45 °C kan draaien.", image: "slide-panels" },
    ],
    stats: [
      { value: 275, prefix: "€ ", label: "energiefactuur vóór, per maand" },
      { value: 144, prefix: "€ ", label: "energiefactuur na, per maand" },
      { value: 50, suffix: " %", label: "zelfverbruik van hun zonnestroom" },
      { value: 1500, prefix: "€ ", label: "Mijn VerbouwPremie (inkomenscategorie 1–2)" },
    ],
    resultNote:
      "Voorbeeldproject – berekend met de rekenwaarden uit onze bronnenlijst (stroom 30 c/kWh, gas 11 c/kWh, SCOP 3,5), vlakke prijzen, zonder de thermische winst van PVT.",
    install: {
      investering: "De warmtepomp zelf kost geïnstalleerd ca. € 9.500–14.000; PVT-panelen en omvormer worden per project berekend.",
      premie: "€ 1.500 Mijn VerbouwPremie voor de warmtepomp (inkomenscategorie 1–2) en 6 % btw.",
      duur: "Vier werkdagen: twee voor de warmtepomp en de radiatoren, twee voor dak en omvormer.",
      terugverdientijd: "Per project berekend, omdat PVT-prijzen sterk van het dak afhangen.",
    },
    quote: {
      text: "We dachten echt dat ons huis te oud was. De ingenieur liet ons per kamer zien wat nodig was, en waarom een batterij voor ons nog niet loonde. Dat laatste heeft ons overtuigd.",
      name: "Sarah, Gent",
    },
    relatedComparisons: ["gasketel-vs-warmtepomp", "zonnepanelen-vs-pvt-panelen"],
    relatedArticles: ["wat-is-een-pvt-paneel", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
    relatedProjects: ["nieuwbouw-leuven-all-electric", "gezin-kortrijk-geen-batterij-advies"],
  },

  // ───────────────────────────── Leuven ─────────────────────────────
  // Referentie (zelfde woning zonder PV/batterij, ongestuurd laden): warmte 8.000 kWh / SCOP 4,2 = 1.905;
  //   huishouden 3.500; EV 15.000 km × 0,18 = 2.700 → 8.105 kWh × 0,30 = 2.432; piek 6,5 kW × 56 = 364
  //   → 2.796/jaar ≈ € 233/maand.
  // Na: 8 kWp × 900 = 7.200 kWh; zelfverbruik 65 % = 4.680; net 3.425 × 0,30 = 1.028;
  //   injectie 2.520 × 0,04 = −101; piek 4 kW × 56 = 224 → 1.151/jaar ≈ € 96/maand.
  //   Zonder batterij: zelfverbruik 45 % = 3.240; net 4.865 × 0,30 = 1.460; inj −158; piek 5 kW 280 → 1.582 ≈ € 132; 10.400/1.214 ≈ 9 jaar.
//   Investering PV 8 × 1.300 = 10.400 + batterij 10 × 600 = 6.000 = 16.400; besparing 1.645/jaar → ca. 10 jaar.
  {
    slug: "nieuwbouw-leuven-all-electric",
    quoteImage: "laadpaal-oprit-avond",
    isPlaceholder,
    title: "Nieuwbouw in Leuven: all-electric",
    shortTitle: "Nieuwbouw in Leuven",
    seoTitle: "Nieuwbouw in Leuven: all-electric met batterij",
    description:
      "Hoe een jong gezin in Leuven een all-electric nieuwbouw van ca. € 233 naar ca. € 96 per maand bracht: warmtepomp, zonnepanelen, batterij en laadpaal.",
    updatedAt: "2026-11-01",
    h1: "Jong gezin in Leuven: een nieuwbouw zonder gas, en zonder stroomschrik",
    family: "Koppel met baby",
    place: "Leuven",
    homeType: "Nieuwbouw, open bebouwing",
    buildYear: "2025",
    products: ["lucht-water-warmtepomp", "zonnepanelen", "thuisbatterij", "laadpalen"],
    headline: { before: "€ 233", after: "€ 96", unit: "/maand" },
    image: "nieuwbouw-gezin",
    lead: "Els en Koen bouwden in 2025 een nieuwe woning bij Leuven. Gas mocht er niet meer in. Hun vraag: hoe zorgen we dat alles elektrisch niet betekent dat we straks een torenhoge stroomfactuur hebben?",
    summary:
      "Een all-electric nieuwbouw met vloerverwarming, een elektrische wagen en een dak op het zuiden. We rekenden uit hoe groot de panelen en de batterij moesten zijn, en hoe ze hun piek laag houden.",
    situation: [
      "De woning van Els en Koen is een goed geïsoleerde nieuwbouw met vloerverwarming. Sinds 2025 mag een nieuwbouw in Vlaanderen geen gasaansluiting meer krijgen, dus de keuze voor een warmtepomp lag vast. Koen rijdt met een elektrische bedrijfswagen, ongeveer 15.000 km per jaar.",
      "De architect had een warmtepomp voorzien, maar niemand had uitgerekend wat alles samen zou verbruiken, en wanneer. Zonder panelen of sturing zou het gezin ongeveer 8.100 kWh stroom per jaar van het net halen, met pieken tot 6,5 kW als de auto laadt terwijl de oven en de warmtepomp draaien.",
    ],
    challenge: [
      "In een all-electric woning wordt het capaciteitstarief belangrijk: je betaalt voor je gemiddelde maandpiek. Een auto die ongestuurd op volle kracht laadt tijdens het avondeten, kan die piek fors optrekken.",
      "Daarnaast wilden ze weten of een thuisbatterij in een nieuwbouw zinvol is, of een dure gadget. In een woning jonger dan tien jaar betaal je bovendien 21 % btw op panelen en batterij.",
    ],
    doubt: "\"We hoorden overal dat een batterij zich nooit terugbetaalt. Maar ook dat je met een elektrische auto zonder batterij de klos bent door het capaciteitstarief. Wat klopt er nu?\"",
    calculated: [
      "Omdat de vloerverwarming op 35 °C werkt, haalt de warmtepomp hier een hoge SCOP. We rekenden met een warmtevraag van 8.000 kWh per jaar en stemden het vermogen af op de berekening van de architect, niet groter.",
      "Op het zuiddak paste acht kWp aan zonnepanelen. Met een batterij van tien kWh, een laadpaal die laadt op zonne-overschot en 's nachts aan laag vermogen, en een warmtepomp die overdag het buffervat en de vloer opwarmt, komt het zelfverbruik rond 65 %.",
      "De batterij doet hier twee dingen: ze schuift zonnestroom naar de avond én ze houdt de maandpiek rond 4 kW. In dit profiel – hoog verbruik, elektrische wagen, weinig thuis overdag – loont ze wél. Bij een ander gezin kan dat anders uitvallen.",
    ],
    scenarios: [
      { name: "Alleen warmtepomp, ongestuurd laden", invest: "–", perMonth: "ca. € 233", payback: "–", verdict: "referentie", note: "Piek tot 6,5 kW door laden tijdens het koken." },
      { name: "Warmtepomp + 8 kWp zonnepanelen + slimme laadpaal", invest: "ca. € 10.400 (panelen)", perMonth: "ca. € 132", payback: "ca. 9 jaar", verdict: "optie", note: "Al een grote stap, maar 's avonds veel netstroom." },
      { name: "Idem + thuisbatterij 10 kWh", invest: "ca. € 16.400 (panelen + batterij)", perMonth: "ca. € 96", payback: "ca. 10 jaar", verdict: "gekozen", note: "Lagere piek én avondverbruik uit eigen stroom." },
    ],
    setup: [
      { title: "Lucht-water warmtepomp", detail: "Afgestemd op 35 °C vloerverwarming, overdag gestuurd op zonnestroom.", image: "product-warmtepomp" },
      { title: "Acht kWp zonnepanelen", detail: "Volledig zuiddak, zonder schaduw.", image: "product-zonnepanelen" },
      { title: "Thuisbatterij 10 kWh", detail: "Voor de avond én om de maandpiek rond 4 kW te houden.", image: "product-thuisbatterij" },
      { title: "Slimme laadpaal", detail: "Laadt op zonne-overschot, 's nachts op laag vermogen.", image: "product-laadpaal" },
    ],
    stats: [
      { value: 233, prefix: "€ ", label: "zonder panelen en batterij, per maand" },
      { value: 96, prefix: "€ ", label: "met het gekozen systeem, per maand" },
      { value: 65, suffix: " %", label: "zelfverbruik van hun zonnestroom" },
      { value: 4, suffix: " kW", label: "maandpiek in plaats van 6,5 kW" },
    ],
    resultNote: "Voorbeeldproject – vergelijking met dezelfde woning zonder panelen en batterij, berekend met onze rekenwaarden en vlakke prijzen. Geen premie: nieuwbouw.",
    install: {
      investering: "Zonnepanelen en batterij samen ca. € 16.400; de warmtepomp was sowieso nodig en zit niet in de vergelijking. De laadpaal wordt per project geprijsd.",
      premie: "Geen Mijn VerbouwPremie: die is er voor renovatie, niet voor nieuwbouw. In een woning jonger dan tien jaar geldt 21 % btw op panelen en batterij.",
      duur: "Ingepland met de aannemer: drie werkdagen verspreid over de afwerking.",
      terugverdientijd: "Ca. 10 jaar voor panelen en batterij samen, met vlakke prijzen en zonder dynamisch contract.",
    },
    quote: {
      text: "We wilden geen verrassingen na de verhuis. Nu weten we per maand wat we ongeveer betalen, en de auto laadt gewoon op de zon als dat kan.",
      name: "Els, Leuven",
    },
    relatedComparisons: ["met-of-zonder-thuisbatterij", "vast-vs-dynamisch-energiecontract"],
    relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "wat-is-het-capaciteitstarief"],
    relatedProjects: ["koppel-hasselt-laadpaal-dynamisch", "gezinswoning-gent-warmtepomp-pvt"],
  },

  // ───────────────────────────── Antwerpen ─────────────────────────────
  // Vóór (enkel stroom): 4.200 × 0,30 = 1.260; piek 4,5 kW × 56 = 252 → 1.512/jaar ≈ € 126/maand.
  // Na: 3,6 kWp oost/west × 850 = 3.060 kWh; met batterij zelfverbruik 70 % = 2.142;
  //   net 2.058 × 0,30 = 617; injectie 918 × 0,04 = −37; piek 3,5 kW × 56 = 196 → 776/jaar ≈ € 65/maand.
  //   Investering PV 3,6 × 1.300 = 4.680 + batterij 5 × 600 = 3.000 = 7.680; besparing 736/jaar → ca. 10 jaar.
  //   Zonder batterij (zelfverbruik 35 %): net 3.129 × 0,30 = 939; inj 1.989 × 0,04 = −80; piek 4,5 → 252 → 1.111 ≈ € 93/maand.
  {
    slug: "rijwoning-antwerpen-zon-batterij",
    quoteImage: "meter-app-hand",
    isPlaceholder,
    title: "Rijwoning in Antwerpen: zonnepanelen + batterij",
    shortTitle: "Rijwoning in Antwerpen",
    seoTitle: "Rijwoning in Antwerpen: zon + thuisbatterij",
    description:
      "Hoe een gezin in een Antwerpse rijwoning met een klein oost/west-dak hun stroomfactuur van ca. € 126 naar ca. € 65 per maand bracht. Berekening en resultaat.",
    updatedAt: "2026-11-01",
    h1: "Rijwoning in Antwerpen: een klein dak, toch de stroomfactuur gehalveerd",
    family: "Koppel met één kind",
    place: "Antwerpen",
    homeType: "Rijwoning",
    buildYear: "1932",
    products: ["zonnepanelen", "thuisbatterij", "omvormers"],
    headline: { before: "€ 126", after: "€ 65", unit: "/maand stroom" },
    image: "rijwoning-zonnepanelen",
    lead: "An en Joris wonen in een smalle rijwoning in Antwerpen. Een klein dak, oost en west, en een digitale meter die hen elke maand liet zien hoeveel ze 's avonds terugkochten.",
    summary:
      "Weinig dakruimte, een recente gasketel en een gezin dat vooral 's avonds verbruikt. We rekenden uit of panelen met een kleine batterij hier zin hadden – en lieten de gasketel bewust staan.",
    situation: [
      "De rijwoning uit 1932 heeft een achterdak van amper twintig vierkante meter, verdeeld over een oost- en een westhelling. An en Joris werken allebei buitenshuis; hun verbruik zit vooral 's ochtends vroeg en 's avonds. Ze verbruikten zo'n 4.200 kWh stroom per jaar.",
      "Hun condensatieketel is pas zes jaar oud. Die vervangen nu zou betekenen dat ze een goed werkend toestel weggooien. De vraag was dus beperkt: wat kunnen we met dit kleine dak?",
    ],
    challenge: [
      "Zonder terugdraaiende teller krijg je voor geïnjecteerde stroom maar enkele centen per kWh. Een gezin dat overdag niet thuis is, injecteert het grootste deel van zijn zonnestroom en koopt 's avonds duur terug.",
      "Oost/west-panelen leveren per kWp iets minder op dan zuid, maar spreiden hun productie wel beter over de dag: meer 's ochtends en later op de namiddag. Dat bleek hier net een voordeel.",
    ],
    doubt: "\"Een vriend zei dat panelen zonder terugdraaiende teller niet meer lonen, zeker niet op zo'n klein dak. En een batterij? Dat leek ons iets voor mensen met een villa.\"",
    calculated: [
      "We legden hun kwartierwaarden uit Mijn Fluvius naast de verwachte productie van 3,6 kWp oost/west. Zonder batterij zouden ze maar ongeveer een derde van hun zonnestroom zelf gebruiken.",
      "Met een kleine batterij van vijf kWh schuift de middagproductie naar de avond, en zakt de maandpiek. Groter had hier geen zin: het dak levert niet genoeg om een grotere batterij geregeld te vullen.",
      "De warmtepomp hebben we wel meegenomen in het plan, maar later: als de gasketel aan vervanging toe is. De hybride omvormer is daar al op voorzien.",
    ],
    scenarios: [
      { name: "Niets doen", invest: "–", perMonth: "€ 126", payback: "–", verdict: "referentie", note: "Enkel de stroomfactuur; gas blijft gelijk in elk scenario." },
      { name: "3,6 kWp zonnepanelen", invest: "ca. € 4.680", perMonth: "ca. € 93", payback: "ca. 12 jaar", verdict: "optie", note: "Zelfverbruik ca. 35 %, veel injectie." },
      { name: "3,6 kWp + batterij 5 kWh", invest: "ca. € 7.680", perMonth: "ca. € 65", payback: "ca. 10 jaar", verdict: "gekozen", note: "Zelfverbruik ca. 70 %, piek lager." },
      { name: "Gasketel nu vervangen door warmtepomp", invest: "–", perMonth: "–", payback: "–", verdict: "afgeraden", note: "Ketel is pas zes jaar oud: later, als hij aan vervanging toe is." },
    ],
    setup: [
      { title: "Zonnepanelen oost/west", detail: "3,6 kWp, verdeeld over beide dakhellingen.", image: "product-zonnepanelen" },
      { title: "Thuisbatterij 5 kWh", detail: "Klein gehouden: het dak vult ze, groter zou leeg blijven staan.", image: "product-thuisbatterij" },
      { title: "Hybride omvormer", detail: "Klaar voor een warmtepomp-sturing als de gasketel later vervangen wordt.", image: "product-omvormer" },
    ],
    stats: [
      { value: 126, prefix: "€ ", label: "stroomfactuur vóór, per maand" },
      { value: 65, prefix: "€ ", label: "stroomfactuur na, per maand" },
      { value: 70, suffix: " %", label: "zelfverbruik met de batterij" },
      { value: 10, prefix: "ca. ", suffix: " jaar", label: "terugverdientijd (indicatief)" },
    ],
    resultNote: "Voorbeeldproject – enkel de stroomfactuur (gas blijft gelijk), berekend met onze rekenwaarden, oost/west-opbrengst 850 kWh per kWp, vlakke prijzen.",
    install: {
      investering: "Ca. € 7.680: zonnepanelen ca. € 4.680 en batterij ca. € 3.000, aan 6 % btw (woning ouder dan tien jaar).",
      premie: "Geen: voor zonnepanelen en thuisbatterijen bestaat in Vlaanderen geen premie meer.",
      duur: "Twee werkdagen, inclusief keuring.",
      terugverdientijd: "Ca. 10 jaar met vlakke prijzen. Stijgen de stroomprijzen, dan gaat het sneller.",
    },
    quote: {
      text: "Wat ons verraste: ze raadden ons af om onze gasketel nu al te vervangen. Daardoor geloofden we de rest van de berekening ook.",
      name: "Joris, Antwerpen",
    },
    relatedComparisons: ["met-of-zonder-thuisbatterij", "met-of-zonder-zonnepanelen"],
    relatedArticles: ["injectietarief-en-zelfverbruik", "hoe-groot-moet-een-thuisbatterij-zijn"],
    relatedProjects: ["gezin-kortrijk-geen-batterij-advies", "koppel-hasselt-laadpaal-dynamisch"],
  },

  // ───────────────────────────── Brugge ─────────────────────────────
  // Vóór: stookolie 20.000 kWh × 0,15 = 3.000; stroom 3.500 × 0,30 = 1.050; piek 4,25 × 56 = 238 → 4.288 ≈ € 357/maand.
  // Na (hybride): warmtevraag 20.000 × 0,85 (oude ketel) = 17.000 kWh; 60 % via airco = 10.200 / SCOP 3,8 = 2.684 kWh.
  //   Rest stookolie 8.000 kWh × 0,15 = 1.200. PV 6 kWp × 900 = 5.400; verbruik 3.500 + 2.684 = 6.184;
  //   zelfverbruik 40 % = 2.160; net 4.024 × 0,30 = 1.207; injectie 3.240 × 0,04 = −130; piek 5 × 56 = 280
  //   → 1.200 + 1.207 − 130 + 280 = 2.557 ≈ € 213/maand. PV 6 × 1.300 = 7.800.
  {
    slug: "fermette-brugge-airco-zonnepanelen",
    quoteImage: "woonkamer-warm-winter",
    isPlaceholder,
    title: "Fermette in Brugge: airco + zonnepanelen",
    shortTitle: "Fermette in Brugge",
    seoTitle: "Fermette in Brugge: airco + zonnepanelen",
    description:
      "Hoe een koppel in een gerenoveerde fermette bij Brugge van ca. € 357 naar ca. € 213 per maand ging, met airco, zonnepanelen en minder stookolie. Indicatief.",
    updatedAt: "2026-11-01",
    h1: "Koppel in Brugge: de stookolietank bijna overbodig, het comfort hoger",
    family: "Koppel, kinderen het huis uit",
    place: "Brugge",
    homeType: "Gerenoveerde fermette",
    buildYear: "1890",
    products: ["lucht-lucht-warmtepomp", "zonnepanelen"],
    headline: { before: "€ 357", after: "€ 213", unit: "/maand" },
    image: "fermette-airco",
    lead: "Marleen en Marc wonen in een gerenoveerde fermette buiten Brugge. Ze stookten op stookolie, hadden het in de leefruimte nooit echt warm en in de zomer veel te warm onder het dak.",
    summary:
      "Dikke muren, een grote leefruimte, een oude stookolieketel en een groot schuurdak. We kozen bewust een hybride stap: airco voor de leefruimtes, zonnepanelen op de schuur, de stookolieketel als back-up.",
    situation: [
      "De fermette dateert van rond 1890 en werd twintig jaar geleden gerenoveerd: dakisolatie, nieuwe ramen, maar geen vloerisolatie. Ze verbruikten ongeveer 2.000 liter stookolie per jaar en 3.500 kWh stroom. Alles samen kwam dat op zo'n € 357 per maand.",
      "Het koppel leeft vooral in de grote leefkeuken en de zithoek. De slaapkamers boven worden weinig verwarmd, maar zijn in de zomer bloedheet.",
    ],
    challenge: [
      "Een lucht-water warmtepomp voor de hele woning zou hier grote radiatoren of vloerverwarming vragen, met breekwerk in een woning die net mooi gerenoveerd was. Dat wilden ze niet.",
      "Tegelijk is stookolie de duurste manier om te verwarmen, en de ketel was al vijftien jaar oud. Er moest dus iets gebeuren, maar zonder alles open te breken.",
    ],
    doubt: "\"Een airco om mee te verwarmen? We dachten dat dat iets was voor kantoren, en dat het veel stroom zou vreten.\"",
    calculated: [
      "Een lucht-lucht warmtepomp maakt van één kWh stroom drie à vier kWh warmte, en verwarmt precies de ruimtes waar je leeft. We rekenden dat drie binnenunits ongeveer 60 % van de warmte konden leveren: de leefkeuken, de zithoek en de bureauruimte.",
      "Op het schuurdak was ruim plaats voor zes kWp aan zonnepanelen. In de tussenseizoenen en de zomer – als de airco ook koelt – draait die grotendeels op eigen stroom.",
      "De stookolieketel blijft voorlopig voor het sanitair water en de koudste dagen. Over een paar jaar bekijken we samen of een warmtepompboiler de tank helemaal overbodig maakt.",
    ],
    scenarios: [
      { name: "Niets doen (stookolie)", invest: "–", perMonth: "€ 357", payback: "–", verdict: "referentie", note: "Duurste brandstof, ketel vijftien jaar oud." },
      { name: "Lucht-water voor de hele woning", invest: "per offerte", perMonth: "–", payback: "–", verdict: "afgeraden", note: "Vraagt breekwerk voor radiatoren of vloerverwarming. Nu niet." },
      { name: "Airco (3 units) + 6 kWp zonnepanelen, stookolie als back-up", invest: "panelen ca. € 7.800 + airco per project", perMonth: "ca. € 213", payback: "per project", verdict: "gekozen", note: "Ook koeling in de zomer." },
    ],
    setup: [
      { title: "Lucht-lucht warmtepomp", detail: "Eén buitenunit, drie binnenunits in de leefruimtes.", image: "service-co2" },
      { title: "Zes kWp zonnepanelen", detail: "Op het schuurdak, zuidoost.", image: "product-zonnepanelen" },
      { title: "Stookolieketel als back-up", detail: "Voor sanitair water en de koudste dagen, tot hij aan vervanging toe is.", image: "slide-fields" },
    ],
    stats: [
      { value: 357, prefix: "€ ", label: "energiefactuur vóór, per maand" },
      { value: 213, prefix: "€ ", label: "energiefactuur na, per maand" },
      { value: 60, suffix: " %", label: "van de warmte nu via de airco" },
      { value: 40, suffix: " %", label: "zelfverbruik van hun zonnestroom" },
    ],
    resultNote: "Voorbeeldproject – berekend met onze rekenwaarden (stookolie 15 c/kWh, SCOP airco 3,8), vlakke prijzen. Koelcomfort in de zomer niet in euro uitgedrukt.",
    install: {
      investering: "Zonnepanelen ca. € 7.800; de airco met drie binnenunits wordt per project geprijsd.",
      premie: "Geen premie voor de airco: die is sinds maart 2026 alleen mogelijk als het toestel de enige centrale verwarming is. Dat is hier niet zo, en dat zeiden we vooraf.",
      duur: "Drie werkdagen, de binnenunits zonder breekwerk geplaatst.",
      terugverdientijd: "Per project berekend; de besparing ligt rond € 1.700 per jaar (indicatief).",
    },
    quote: {
      text: "Voor het eerst is het in de winter echt warm in de zithoek, en in de zomer kunnen we boven weer slapen. Dat we de stookolieketel mochten houden als back-up, gaf ons rust.",
      name: "Marleen, Brugge",
    },
    relatedComparisons: ["warmtepomp-vs-airco", "gasketel-vs-warmtepomp"],
    relatedArticles: ["scop-en-cop-uitgelegd", "mijn-verbouwpremie-voor-energie"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt", "rijwoning-antwerpen-zon-batterij"],
  },

  // ───────────────────────────── Hasselt ─────────────────────────────
  // Vóór: huishouden 3.000 + EV 20.000 km × 0,18 = 3.600 → 6.600 kWh. Bestaande PV 5 kWp × 900 = 4.500;
  //   zelfverbruik 30 % = 1.350; net 5.250 × 0,30 = 1.575; injectie 3.150 × 0,04 = −126; piek 7,5 kW × 56 = 420
  //   → 1.869/jaar ≈ € 156/maand.
  // Na: slimme laadpaal + batterij 8 kWh: zelfverbruik 70 % = 3.150; net 3.450 × 0,30 = 1.035;
  //   injectie 1.350 × 0,04 = −54; piek 4 kW × 56 = 224 → 1.205/jaar ≈ € 100/maand.
  //   Alleen laadpaal: zelfverbruik 45 % = 2.025; net 4.575 × 0,30 = 1.373; inj −99; piek 4,5 kW 252 → 1.526 ≈ € 127.
//   Batterij marginaal: 1.526 − 1.205 = 321/jaar → 4.800 / 321 ≈ 15 jaar op vaste prijzen (eerlijk gemeld aan klant).
//   Voordeel van het dynamisch contract bewust NIET meegeteld (geen fact). Batterij 8 × 600 = 4.800.
  {
    slug: "koppel-hasselt-laadpaal-dynamisch",
    quoteImage: "thuisbatterij-berging",
    isPlaceholder,
    title: "Koppel in Hasselt: laadpaal + dynamisch contract",
    shortTitle: "Koppel in Hasselt",
    seoTitle: "Koppel in Hasselt: laadpaal + batterij",
    description:
      "Hoe een koppel in Hasselt met elektrische wagen en oude panelen de factuur van ca. € 156 naar ca. € 100 per maand bracht met slimme laadpaal en batterij.",
    updatedAt: "2026-11-01",
    h1: "Koppel in Hasselt: de auto laadt op de zon, de piek bleef laag",
    family: "Koppel, twee wagens",
    place: "Hasselt",
    homeType: "Open bebouwing",
    buildYear: "1998",
    products: ["laadpalen", "thuisbatterij"],
    headline: { before: "€ 156", after: "€ 100", unit: "/maand" },
    image: "laadpaal-oprit-avond",
    lead: "Ann en Bart hebben al sinds 2014 zonnepanelen. Toen de terugdraaiende teller verdween en ze een elektrische auto kochten, zagen ze hun stroomfactuur en hun maandpiek tegelijk de hoogte in gaan.",
    summary:
      "Oude zonnepanelen, een elektrische wagen die aan elf kW laadde wanneer het uitkwam, en een dynamisch contract dat ze nog niet benutten. We rekenden uit wat slimmer laden en een batterij opleveren.",
    situation: [
      "Het koppel heeft vijf kWp aan zonnepanelen uit 2014. Met de terugdraaiende teller betaalden ze jarenlang bijna niets. Sinds de digitale meter injecteren ze overdag het grootste deel van hun zonnestroom, en kopen ze die 's avonds terug aan de volle prijs.",
      "Ann rijdt met een elektrische wagen, zo'n 20.000 km per jaar. De auto laadde aan elf kW zodra ze thuiskwam, net wanneer ook gekookt werd. Hun maandpiek liep op tot 7,5 kW.",
    ],
    challenge: [
      "Een hoge maandpiek kost via het capaciteitstarief elk jaar geld, ook al gebeurt hij maar een paar keer per maand. En elke kWh die ze 's middags injecteren en 's avonds terugkopen, kost hen het verschil tussen een paar cent en dertig cent.",
      "Ze hadden net een dynamisch contract genomen, maar zonder sturing merkten ze er weinig van.",
    ],
    doubt: "\"We dachten: een batterij is te duur, en die laadpaal werkt toch gewoon? Maar onze factuur zei iets anders.\"",
    calculated: [
      "Eerst het goedkoopste: een slimme laadpaal die laadt op zonne-overschot, en anders 's nachts aan laag vermogen. Alleen daardoor zakt de maandpiek al fors.",
      "Daarna de batterij: acht kWh, groot genoeg om de avond te overbruggen met middagstroom. Samen tillen laadpaal en batterij het zelfverbruik van ongeveer 30 % naar ongeveer 70 %.",
      "Eerlijk is eerlijk: op vaste prijzen verdient de batterij zichzelf pas in ongeveer vijftien jaar terug. Dat hebben we zo gezegd. Het koppel koos er bewust toch voor, omdat ze hun dynamisch contract actief willen benutten: de batterij laden op goedkope uren en de dure avonduren overbruggen. Dat extra voordeel wisselt per uur en per jaar, dus steken we het niet in de cijfers.",
    ],
    scenarios: [
      { name: "Niets doen", invest: "–", perMonth: "ca. € 156", payback: "–", verdict: "referentie", note: "Piek tot 7,5 kW, 30 % zelfverbruik." },
      { name: "Alleen slimme laadpaal", invest: "per project", perMonth: "ca. € 127", payback: "–", verdict: "optie", note: "Laden op overschot en 's nachts aan laag vermogen." },
      { name: "Slimme laadpaal + batterij 8 kWh", invest: "batterij ca. € 4.800 + laadpaal", perMonth: "ca. € 100", payback: "ca. 15 jaar voor de batterij (vaste prijzen)", verdict: "gekozen", note: "Bewuste keuze van het koppel, voor hun dynamisch contract." },
    ],
    setup: [
      { title: "Slimme laadpaal", detail: "Laadt op zonne-overschot, en anders 's nachts aan laag vermogen.", image: "product-laadpaal" },
      { title: "Thuisbatterij 8 kWh", detail: "Overbrugt de avond en houdt de maandpiek rond 4 kW.", image: "product-thuisbatterij" },
      { title: "Bestaande zonnepanelen", detail: "Vijf kWp uit 2014, gecontroleerd en behouden.", image: "service-solar" },
    ],
    stats: [
      { value: 156, prefix: "€ ", label: "energiefactuur vóór, per maand" },
      { value: 100, prefix: "€ ", label: "energiefactuur na, per maand" },
      { value: 7.5, decimals: 1, suffix: " kW", label: "maandpiek vóór" },
      { value: 4, suffix: " kW", label: "maandpiek na" },
    ],
    resultNote: "Voorbeeldproject – berekend met onze rekenwaarden en vlakke prijzen, zonder het extra voordeel van het dynamisch contract.",
    install: {
      investering: "De batterij kost ca. € 4.800; de laadpaal wordt per project geprijsd. Hun bestaande panelen bleven liggen.",
      premie: "Geen: voor laadpalen en thuisbatterijen bestaat geen Vlaamse premie voor particulieren.",
      duur: "Eén werkdag.",
      terugverdientijd: "De slimme laadpaal alleen scheelt al ca. € 340 per jaar. De batterij voegt op vaste prijzen ca. € 320 per jaar toe: ca. 15 jaar. Met hun dynamisch contract kan dat korter, maar dat beloven we niet.",
    },
    quote: {
      text: "We dachten dat we vooral een batterij nodig hadden. Het was de combinatie met slim laden die het verschil maakte, en dat hadden we zelf nooit uitgerekend.",
      name: "Bart, Hasselt",
    },
    relatedComparisons: ["vast-vs-dynamisch-energiecontract", "met-of-zonder-thuisbatterij"],
    relatedArticles: ["wat-is-het-capaciteitstarief", "dynamisch-tarief-uitgelegd"],
    relatedProjects: ["nieuwbouw-leuven-all-electric", "rijwoning-antwerpen-zon-batterij"],
  },

  // ───────────────────────────── Kortrijk (eerlijk "nee") ─────────────────────────────
  // Vóór (stroom): 2.800 × 0,30 = 840; piek 3,5 kW × 56 = 196 → 1.036/jaar ≈ € 86/maand.
  // Na: 4 kWp × 900 = 3.600 kWh; zelfverbruik 35 % (timers) = 1.260; net 1.540 × 0,30 = 462;
  //   injectie 2.340 × 0,04 = −94; piek 196 → 564/jaar ≈ € 47/maand. PV 4 × 1.300 = 5.200; besparing 472 → ca. 11 jaar.
  // Batterij 5 kWh (€ 3.000): + ca. 900 kWh zelfverbruik × (0,30 − 0,04) = 234 + piek −0,5 kW × 56 = 28
  //   → 262/jaar → ca. 11–12 jaar voor de batterij alleen → afgeraden (nu). Met batterij: 564 − 262 = 302 ≈ € 25/maand.
  {
    slug: "gezin-kortrijk-geen-batterij-advies",
    quoteImage: "ingenieur-aan-tafel",
    isPlaceholder,
    advisedAgainst: true,
    title: "Gezin in Kortrijk: geen batterij, eerlijk advies",
    shortTitle: "Gezin in Kortrijk",
    seoTitle: "Gezin in Kortrijk: waarom we geen batterij plaatsten",
    description:
      "Een gezin in Kortrijk vroeg zonnepanelen mét batterij. We raadden de batterij eerlijk af. Toch ging hun stroomfactuur van ca. € 86 naar ca. € 47 per maand.",
    updatedAt: "2026-11-01",
    h1: "Gezin in Kortrijk: ze vroegen een batterij, we raadden ze af",
    family: "Gezin met twee kinderen",
    place: "Kortrijk",
    homeType: "Halfopen woning",
    buildYear: "1985",
    products: ["zonnepanelen"],
    headline: { before: "€ 86", after: "€ 47", unit: "/maand stroom" },
    image: "gezin-keuken-factuur",
    lead: "Sanne en Pieter wilden zonnepanelen met een thuisbatterij, \"zoals de buren\". Na de berekening plaatsten we alleen panelen. Hier lees je waarom, met de cijfers erbij.",
    summary:
      "Laag stroomverbruik, overdag niemand thuis, een vast contract en geen elektrische wagen. De panelen loonden, de batterij niet. We zeiden dat, en plaatsten een batterij-klare installatie.",
    situation: [
      "Het gezin woont in een halfopen woning uit 1985 met een gasketel van acht jaar oud. Ze verbruiken weinig stroom: ongeveer 2.800 kWh per jaar. Beide ouders werken buitenshuis, de kinderen zitten overdag op school.",
      "Hun buren hadden net zonnepanelen met een batterij laten plaatsen, en een verkoper had hen al een offerte voor hetzelfde pakket bezorgd.",
    ],
    challenge: [
      "Een batterij verdient zichzelf terug door goedkope eigen stroom te verschuiven naar de avond, door je maandpiek te verlagen, of door te laden op goedkope uren met een dynamisch contract. Bij dit gezin speelde geen van die drie sterk.",
      "Hun verbruik is laag, hun piek ligt al dicht bij het minimum dat iedereen betaalt, en ze hebben een vast contract waar ze tevreden over zijn.",
    ],
    doubt: "\"We gingen ervan uit dat panelen zonder batterij geen zin meer hebben. Dat hoor je toch overal?\"",
    calculated: [
      "We rekenden vier scenario's: niets doen, panelen alleen, panelen met batterij, en panelen met slimme timers voor wasmachine, droogkast en vaatwasser. Dat laatste kost bijna niets en tilt het zelfverbruik al wat op.",
      "Vier kWp panelen op het zuidwestdak verdienen zichzelf in ongeveer elf jaar terug, ook zonder batterij. Een batterij van vijf kWh zou er per jaar maar een paar honderd euro bij doen, terwijl ze ongeveer € 3.000 kost.",
    ],
    whyNot: {
      title: "Waarom we geen batterij plaatsten",
      paragraphs: [
        "De batterij zou zichzelf alleen terugbetalen in ongeveer elf à twaalf jaar – en dat bovenop de panelen. Voor een toestel waarvan de prijs nog daalt, vonden we dat geen verantwoorde investering voor dit gezin, op dit moment.",
        "We plaatsten wel een omvormer die later een batterij aankan. Komt er een elektrische wagen, een warmtepomp of een dynamisch contract bij, dan rekenen we opnieuw. Dan kan het antwoord anders zijn – en dan zeggen we dat ook.",
      ],
    },
    scenarios: [
      { name: "Niets doen", invest: "–", perMonth: "€ 86", payback: "–", verdict: "referentie", note: "Enkel stroom; de gasfactuur blijft gelijk." },
      { name: "4 kWp zonnepanelen + slimme timers", invest: "ca. € 5.200", perMonth: "ca. € 47", payback: "ca. 11 jaar", verdict: "gekozen", note: "Zelfverbruik ca. 35 %." },
      { name: "Idem + batterij 5 kWh", invest: "ca. € 8.200", perMonth: "ca. € 25", payback: "ca. 11–12 jaar voor de batterij alleen", verdict: "afgeraden", note: "Te weinig extra winst voor de meerprijs – nu." },
    ],
    setup: [
      { title: "Zonnepanelen", detail: "Vier kWp op het zuidwestdak.", image: "product-zonnepanelen" },
      { title: "Batterij-klare omvormer", detail: "Zodat een batterij later kan, als hun situatie verandert.", image: "product-omvormer" },
      { title: "Slimme timers", detail: "Wasmachine, droogkast en vaatwasser draaien op de middag.", image: "slide-panels" },
    ],
    stats: [
      { value: 86, prefix: "€ ", label: "stroomfactuur vóór, per maand" },
      { value: 47, prefix: "€ ", label: "stroomfactuur na, per maand" },
      { value: 35, suffix: " %", label: "zelfverbruik zonder batterij" },
      { value: 3000, prefix: "€ ", label: "die ze níet uitgaven aan een batterij" },
    ],
    resultNote: "Voorbeeldproject – enkel de stroomfactuur, berekend met onze rekenwaarden en vlakke prijzen.",
    install: {
      investering: "Ca. € 5.200 voor vier kWp zonnepanelen met omvormer, aan 6 % btw.",
      premie: "Geen: er bestaat geen Vlaamse premie meer voor zonnepanelen.",
      duur: "Eén werkdag.",
      terugverdientijd: "Ca. 11 jaar voor de panelen, met vlakke prijzen. De batterij zou dat niet versnellen.",
    },
    quote: {
      text: "We kwamen voor een batterij en gingen naar huis met een kleinere factuur dan verwacht. Dat iemand ons iets afraadt, hadden we nog nooit meegemaakt.",
      name: "Sanne, Kortrijk",
    },
    relatedComparisons: ["met-of-zonder-thuisbatterij", "met-of-zonder-zonnepanelen"],
    relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "injectietarief-en-zelfverbruik"],
    relatedProjects: ["rijwoning-antwerpen-zon-batterij", "gezinswoning-gent-warmtepomp-pvt"],
    relatedPosts: ["waarom-wij-soms-nee-zeggen"],
  },
];

// Keep registry order (single source of truth for slugs).
export const allProjects: ProjectDetail[] = PROJECTS.map((r) => projects.find((p) => p.slug === r.slug)).filter((p): p is ProjectDetail => Boolean(p));

export function getProject(slug: string): ProjectDetail | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getProjectsByService(slug: ProjectDetail["products"][number]): ProjectDetail[] {
  return allProjects.filter((p) => p.products.includes(slug));
}

/** Home / hub rails: Gent, Leuven, Kortrijk (honest case), Antwerpen. */
export const featuredProjects: ProjectDetail[] = (
  ["gezinswoning-gent-warmtepomp-pvt", "nieuwbouw-leuven-all-electric", "gezin-kortrijk-geen-batterij-advies", "rijwoning-antwerpen-zon-batterij"] as ProjectSlug[]
)
  .map((s) => getProject(s))
  .filter((p): p is ProjectDetail => Boolean(p));

/** Template FAQ for project pages (02 §2.6): 4 questions, answers built from the project data. */
export function projectFaq(p: ProjectDetail) {
  return [
    {
      q: "Wat kostte de installatie?",
      a: `${p.install.investering} ${p.install.premie} Dit is een voorbeeldproject: de bedragen zijn indicatief en berekend met de prijzen uit onze bronnenlijst.`,
    },
    {
      q: "Hoe lang duurt de terugverdientijd?",
      a: `${p.install.terugverdientijd} Een terugverdientijd hangt sterk af van je verbruik, je contract en de prijsevolutie. Daarom rekenen we hem voor jouw woning uit, met de aannames zwart op wit.`,
    },
    {
      q: "Hoe lang duurde de installatie?",
      a: `${p.install.duur} Vooraf kwam een ingenieur langs voor een plaatsbezoek en metingen, en na de installatie volgen we de opbrengst mee op. Het papierwerk, zoals keuring en eventuele premieaanvraag, nemen wij op ons.`,
    },
    {
      q: "Zou dit ook in mijn woning werken?",
      a: `Misschien, maar misschien ook niet. Geen twee woningen zijn gelijk: dak, isolatie, verbruik en contract bepalen wat loont. Daarom kopiëren we nooit een pakket. We rekenen jouw situatie door, met een scenario 'niets doen' erbij, en zeggen het ook als iets niet loont.`,
    },
  ];
}
