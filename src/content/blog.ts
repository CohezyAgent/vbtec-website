// PLACEHOLDER – vervang door echte gegevens
// Blog (Builder 3): nieuws, mythes en regels die je factuur veranderen. Auteurs = (placeholder)
// teamleden uit team.ts. Elk getal in de tekst komt via fx()/eur() uit src/content/facts.ts;
// bronnen per post in `sources`. Datums zijn vaste strings (geen Date.now()).

import type { Post, PostSlug } from "./types";
import { POSTS } from "./registry";
import { routes } from "@/lib/routes";
import { eur, fx, year } from "@/components/content/fx";

export const isPlaceholder = true;

const LEAD = routes.lead();
const midCta = (title = "Wat betekent dit voor jouw factuur?") =>
  ({ type: "cta", title, body: "Een ingenieur rekent het gratis uit met jouw verbruik en contract – ook het scenario 'niets doen'.", cta: { label: "Gratis berekening", href: LEAD } }) as const;

const posts: Post[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "loont-een-warmtepomp-nog-in-2026",
    title: "Loont een warmtepomp nog in 2026?",
    shortTitle: "Loont een warmtepomp nog?",
    seoTitle: "Loont een warmtepomp nog in 2026? De cijfers",
    description:
      "\"Hou je gasketel maar\" hoor je vaak. We rekenen het na met Vlaamse prijzen, SCOP, premies en de CO₂-taks vanaf 2028. Het antwoord is genuanceerd.",
    h1: "Loont een warmtepomp nog in 2026?",
    category: "Mythes",
    author: "wouter-van-den-bossche",
    publishedAt: "2026-10-06",
    updatedAt: "2026-11-01",
    image: "warmtepomp-tuin",
    excerpt: "\"Stroom is te duur, hou je gasketel.\" We rekenden het na met de Vlaamse prijzen van najaar 2026. Het antwoord: meestal wel, maar niet altijd.",
    kortAntwoord: `Meestal wel. Per kWh warmte kost gas ${eur("warmtekostGasPerKwhWarmte", { digits: 3 })}, een warmtepomp met SCOP ${fx("scopRekenwaarde", { bare: true })} op netstroom ${eur("warmtekostWarmtepompPerKwhWarmte", { digits: 3 })}. Voor een gemiddeld gasgezin scheelt dat ${eur("voorbeeldBesparingWarmtepomp")} per jaar, vóór zonnepanelen en vóór de CO₂-prijs op gas vanaf ${year("ets2Start")}. Bij een slecht geïsoleerde woning en een zeer goedkoop gascontract kan de winst klein zijn.`,
    body: [
      { type: "h2", text: "Wat kost 1 kWh warmte met gas en met een warmtepomp?" },
      {
        type: "p",
        text: `Stroom is per kWh duurder dan gas: ${fx("stroomprijsAllIn", { scale: 100 })} cent tegenover ${fx("gasprijsAllIn", { scale: 100 })} cent bij een gemiddeld contract (najaar 2026). Wie daar stopt met rekenen, besluit dat een warmtepomp niet loont. Maar een gasketel zet 1 kWh gas om in ongeveer ${fx("rendementGascondensatieketel", { scale: 100, central: true, bare: true })} % nuttige warmte, terwijl een warmtepomp van 1 kWh stroom 3 à 4 kWh warmte maakt.`,
      },
      {
        type: "table",
        caption: "Kost per kWh nuttige warmte (indicatief, najaar 2026)",
        columns: ["Verwarming", "Kost per kWh warmte"],
        rows: [
          ["Gas (condensatieketel)", eur("warmtekostGasPerKwhWarmte", { digits: 3 })],
          [`Lucht-water warmtepomp, SCOP ${fx("scopRekenwaarde", { bare: true })}`, eur("warmtekostWarmtepompPerKwhWarmte", { digits: 3 })],
          ["Lucht-lucht warmtepomp (airco)", eur("warmtekostAircoPerKwhWarmte", { digits: 3 })],
          ["Elektrisch vuurtje of convector", eur("warmtekostElektrischPerKwhWarmte", { digits: 2 })],
        ],
      },
      {
        type: "p",
        text: `Het kantelpunt ligt bij een SCOP van ${fx("breakEvenScop")}: daarboven is een warmtepomp per kWh warmte goedkoper dan gas. Een goed ontworpen installatie haalt bij 35 °C ${fx("scopLuchtWater35")} en bij 55 °C nog ${fx("scopLuchtWater55")}. Met eigen zonnestroom, die je anders voor een paar cent injecteert, daalt de kost per kWh warmte voor dat deel nog fors.`,
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Gezin met 4 personen, gasketel",
        text: [
          `Een gemiddeld Vlaams gezin verbruikt ${fx("gasverbruikGezin")} kWh gas en ${fx("stroomverbruikGezin")} kWh stroom per jaar. Vervangt het de gasketel door een goed ontworpen lucht-water warmtepomp, dan bespaart het ${eur("voorbeeldBesparingWarmtepomp")} per jaar, zonder zonnepanelen. De vaste gaskosten van ${eur("gasVasteKosten")} per jaar vallen weg als de gasaansluiting wordt afgesloten.`,
          `Met zonnepanelen of PVT, slimme sturing en eventueel een dynamisch contract ligt de besparing hoger. Zie ons [voorbeeldproject in Gent](/projecten/gezinswoning-gent-warmtepomp-pvt).`,
        ],
        factKeys: ["gasverbruikGezin", "stroomverbruikGezin", "voorbeeldBesparingWarmtepomp", "gasVasteKosten"],
      },
      midCta(),
      { type: "h2", text: "Wat verandert er tot 2029?" },
      {
        type: "p",
        text: "Drie veranderingen werken allemaal in het voordeel van de warmtepomp – en tegen de gasketel:",
      },
      {
        type: "list",
        items: [
          `**De federale taxshift.** De accijns op aardgas stijgt tegen 2029 met € ${fx("accijnsShiftGas2029", { bare: true })} per MWh, die op elektriciteit daalt met € ${fx("accijnsShiftStroom2029", { bare: true })} per MWh. De eerste stap ging in op 1 augustus 2026.`,
          `**De Europese CO₂-prijs op verwarming (ETS2)** start in ${year("ets2Start")}. Voor een gemiddeld gasgezin betekent dat naar schatting ${eur("ets2MeerkostGasgezin")} per jaar extra.`,
          `**Btw.** Een nieuwe gasketel betaalt sinds juli 2025 ${fx("btwGasketel", { bare: true })} % btw, een warmtepomp ${fx("btwWarmtepomp", { bare: true })} % tot en met 2029.`,
        ],
      },
      {
        type: "p",
        text: `Wie vandaag een nieuwe gasketel plaatst, zit daar ${fx("levensduurGasketel")} jaar aan vast – tot ver na al die stijgingen. Gasprijzen zijn bovendien volatiel: een nieuw vast gascontract werd tussen juli en september 2026 voor een gemiddeld gezin ${eur("gasprijsStijgingQ3_2026")} per jaar duurder.`,
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Stroom is veel te duur, een warmtepomp kost je meer.\"",
        text: "Per kWh is stroom duurder, ja. Maar je koopt geen kWh's, je koopt warmte. En per kWh warmte is een goed ontworpen warmtepomp goedkoper dan gas, nog vóór eigen zonnestroom en vóór de CO₂-prijs op gas.",
      },
      { type: "h2", text: "Wanneer loont het níet?" },
      {
        type: "p",
        text: "Er zijn situaties waarin we een warmtepomp vandaag afraden of uitstellen. Dat zeggen we ook:",
      },
      {
        type: "list",
        items: [
          "**Een zeer slecht geïsoleerde woning** met kleine radiatoren die 60 °C of meer nodig heeft. De SCOP zakt dan richting het kantelpunt. Eerst isoleren levert meer op. Lees [of jouw woning geschikt is](/kennisbank/is-mijn-woning-geschikt-voor-een-warmtepomp).",
          "**Een zeer goedkoop vast gascontract.** Bij gas rond 8 cent per kWh schuift het kantelpunt op naar een SCOP van ongeveer 3,4. Dan rekenen we extra nauwkeurig.",
          "**Een jonge gasketel en een grote verbouwing in het vooruitzicht.** Dan is wachten tot na de renovatie verstandiger, zodat de warmtepomp op de nieuwe woning wordt afgestemd.",
        ],
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wat we níet doen",
        text: "We rekenen nooit met een gemiddelde SCOP uit een brochure of met verzonnen prijsstijgingen. In elke berekening zit een scenario 'niets doen' en een scenario 'nieuwe gasketel', met jouw contract en jouw woning.",
      },
      { type: "h2", text: "Wat met premies?" },
      {
        type: "p",
        text: `Een lucht-water warmtepomp krijgt in 2026 nog ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")} Mijn VerbouwPremie, afhankelijk van je inkomenscategorie. Alle bedragen en voorwaarden vind je in [Mijn VerbouwPremie voor energie](/kennisbank/mijn-verbouwpremie-voor-energie). Wil je het hele plaatje naast elkaar zien? Lees [gasketel of warmtepomp](/vergelijken/gasketel-vs-warmtepomp).`,
      },
    ],
    faq: [
      {
        q: "Hoeveel bespaar ik met een warmtepomp?",
        a: `Voor een gemiddeld Vlaams gasgezin ${eur("voorbeeldBesparingWarmtepomp")} per jaar, zonder zonnepanelen en vóór de CO₂-prijs op gas. De bandbreedte komt door je gascontract, je SCOP en je isolatie. Met zonnepanelen, slimme sturing en het wegvallen van de vaste gaskosten ligt de besparing hoger. Wij rekenen het uit voor jouw woning.`,
      },
      {
        q: "Wat met premies?",
        a: `In 2026 krijg je voor een lucht-water warmtepomp ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")} Mijn VerbouwPremie, afhankelijk van je inkomenscategorie, plus ${fx("btwWarmtepomp", { bare: true })} % btw tot en met 2029. Een nieuwe gasketel betaalt ${fx("btwGasketel", { bare: true })} % btw. Wij zoeken je premies uit en dienen het dossier in.`,
      },
      {
        q: "Werkt het in een oud huis?",
        a: "Vaak wel, op voorwaarde dat de aanvoertemperatuur laag genoeg kan. Met dakisolatie, dubbel glas en enkele grotere radiatoren draait een warmtepomp in veel woningen van na 1970 op 45 à 55 °C. Bij een zeer slecht geïsoleerde woning adviseren we eerst te isoleren of een hybride oplossing.",
      },
      {
        q: "Moet ik wachten?",
        a: `Wachten kost je elk jaar het verschil op je factuur, en gas wordt duurder door de taxshift en ETS2 vanaf ${year("ets2Start")}. Wacht vooral niet tot je ketel in januari stilvalt, want dan beslis je onder druk. Plan je wel een grote verbouwing, dan kan wachten tot daarna verstandig zijn.`,
      },
    ],
    sources: ["stroomprijsAllIn", "gasprijsAllIn", "rendementGascondensatieketel", "scopRekenwaarde", "scopLuchtWater35", "scopLuchtWater55", "warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte", "warmtekostAircoPerKwhWarmte", "warmtekostElektrischPerKwhWarmte", "breakEvenScop", "voorbeeldBesparingWarmtepomp", "gasVasteKosten", "accijnsShiftGas2029", "accijnsShiftStroom2029", "ets2Start", "ets2MeerkostGasgezin", "btwGasketel", "btwWarmtepomp", "levensduurGasketel", "gasprijsStijgingQ3_2026", "premieLuchtWaterCat12", "premieLuchtWaterCat4"],
    relatedArticles: ["scop-en-cop-uitgelegd", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
    relatedPosts: ["gasketel-verbod-vlaanderen-wat-betekent-het", "waarom-wij-soms-nee-zeggen"],
    relatedServices: ["lucht-water-warmtepomp", "pvt-panelen"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "einde-terugdraaiende-teller-wat-nu",
    title: "De terugdraaiende teller is weg. Wat nu?",
    shortTitle: "Einde terugdraaiende teller",
    seoTitle: "Einde terugdraaiende teller: wat moet je nu doen?",
    description:
      "De terugdraaiende teller bestaat niet meer. Wat betekent dat voor je zonnepanelen, en hoe haal je er toch het maximum uit? 5 concrete stappen.",
    h1: "De terugdraaiende teller is weg. Wat nu?",
    category: "Tarieven",
    author: "lotte-claes",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-01",
    image: "rijwoning-zonnepanelen",
    excerpt: "Je panelen produceren nog even veel, maar ze leveren minder op. Vijf concrete stappen om dat recht te trekken – zonder meteen een batterij te kopen.",
    kortAntwoord: `De terugdraaiende teller bestaat in Vlaanderen niet meer: wie zonnepanelen heeft, heeft een digitale meter die afname en injectie apart telt. Geïnjecteerde stroom levert ${fx("injectievergoeding")} cent per kWh op, terwijl je voor afgenomen stroom ${fx("stroomprijsAllIn", { scale: 100 })} cent betaalt. Je panelen lonen nog, maar alleen als je meer van je eigen stroom zelf gebruikt.`,
    body: [
      { type: "h2", text: "Wat is er veranderd?" },
      {
        type: "p",
        text: "Met de terugdraaiende teller draaide je meter achteruit als je panelen meer produceerden dan je verbruikte. Je net was in feite een gratis batterij: een kWh die je in juni injecteerde, kon je in december 'terugnemen'. De digitale meter telt afname en injectie apart. Wat je op het net zet, wordt vergoed aan het tarief van je leverancier; wat je afneemt, betaal je aan de volle prijs.",
      },
      {
        type: "p",
        text: "Wie zijn panelen al had vóór de digitale meter, kon een tijd lang een compensatie krijgen voor het verlies van de terugdraaiende teller. Die regeling is afgelopen. Vandaag kan niemand de digitale meter nog uitstellen.",
      },
      { type: "h2", text: "Wat kost het je?" },
      {
        type: "p",
        text: `Het verschil zit in de prijs van een geïnjecteerde tegenover een afgenomen kWh. Een kWh die je overdag injecteert en 's avonds terugkoopt, kost je het verschil tussen ${fx("injectievergoeding")} cent en ${fx("stroomprijsAllIn", { scale: 100 })} cent. Zonder sturing of opslag gebruikt een gezin dat overdag weg is maar ${fx("zelfverbruikZonder")} % van zijn zonnestroom zelf. De rest gaat voor een fractie naar het net.`,
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Een installatie van 5 kWp",
        text: [
          `5 kWp levert ${fx("pvOpbrengstPerKwp")} kWh per kWp, dus ongeveer 4.500 kWh per jaar. Met ${fx("zelfverbruikZonder", { central: true, bare: true })} % zelfverbruik gebruik je 1.350 kWh zelf en injecteer je 3.150 kWh.`,
          `Haal je je zelfverbruik naar ${fx("zelfverbruikMet", { central: true, bare: true })} %, dan gebruik je 2.925 kWh zelf. Die extra 1.575 kWh bespaar je aan de volle prijs in plaats van ze voor een paar cent te injecteren. Dat is al snel een paar honderd euro per jaar, met dezelfde panelen.`,
        ],
        factKeys: ["pvOpbrengstPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding"],
      },
      midCta("Hoeveel haal jij uit je panelen?"),
      { type: "h2", text: "5 manieren om zelfverbruik te verhogen" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Verschuif je huishoudtoestellen.** Wasmachine, droogkast en vaatwasser met een timer rond de middag. Dat kost niets.",
          "**Maak warm water met zonnestroom.** Een warmtepompboiler of een slim gestuurde elektrische boiler is een goedkope 'warmtebatterij'.",
          "**Stuur je warmtepomp op de zon.** Een warmtepomp met buffervat of vloerverwarming kan overdag extra warmte opslaan.",
          "**Laad je auto op overschot.** Een slimme laadpaal laadt wanneer je panelen produceren. Lees [hoe dat samengaat met je capaciteitstarief](/kennisbank/wat-is-het-capaciteitstarief).",
          "**Overweeg pas daarna een thuisbatterij.** Een batterij is de duurste stap en loont vooral als de goedkopere stappen gezet zijn. Lees [hoe groot een batterij moet zijn](/kennisbank/hoe-groot-moet-een-thuisbatterij-zijn).",
        ],
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Zonder terugdraaiende teller zijn zonnepanelen niet meer rendabel.\"",
        text: `Ze lonen anders: door zelfverbruik, niet door injectie. Een nieuwe installatie kost ${eur("prijsZonnepanelenPerKwp")} per kWp en verdient zich terug in ${fx("terugverdientijdZonnepanelen")} jaar: hoe meer zelfverbruik, hoe sneller.`,
        factKeys: ["prijsZonnepanelenPerKwp", "terugverdientijdZonnepanelen"],
      },
      { type: "h2", text: "Loont uitbreiden nog?" },
      {
        type: "p",
        text: "Extra panelen leggen loont alleen als je die extra stroom ook zelf kunt gebruiken. Komt er een warmtepomp of elektrische auto bij, dan stijgt je verbruik en kan uitbreiden zinvol zijn. Heb je al overschot dat je injecteert, dan levert nog meer panelen weinig op. Dan haal je meer uit sturing en verschuiven.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer een batterij níet de oplossing is",
        text: "Een batterij wordt vaak verkocht als het antwoord op het einde van de terugdraaiende teller. Bij een klein dak, laag verbruik en een vast contract is ze dat meestal niet. Zie ons [voorbeeldproject in Kortrijk](/projecten/gezin-kortrijk-geen-batterij-advies), waar we de batterij afraadden.",
      },
    ],
    faq: [
      {
        q: "Verlies ik geld met mijn zonnepanelen?",
        a: "Nee, je panelen besparen nog altijd geld, maar minder dan met de terugdraaiende teller. Elke kWh die je zelf verbruikt, bespaart de volle stroomprijs. Wat je injecteert, levert maar een paar cent op. Hoe meer je zelf verbruikt, hoe meer je panelen opbrengen. Daar valt vaak veel te winnen.",
      },
      {
        q: "Moet ik een batterij kopen?",
        a: "Niet per se. Een batterij is de duurste manier om zelfverbruik te verhogen. Verschuif eerst je huishoudtoestellen, maak warm water met zonnestroom en laad je auto op overschot. Een batterij loont vooral bij een groot overschot, veel avondverbruik, een elektrische auto of een dynamisch contract.",
      },
      {
        q: "Kan ik nog compensatie krijgen?",
        a: "Nee. De compensatieregeling voor wie zijn panelen al had vóór de digitale meter, is afgelopen. Vandaag heeft iedereen met zonnepanelen een digitale meter die afname en injectie apart telt. De winst moet nu uit zelfverbruik komen.",
      },
      {
        q: "Welk contract kies ik?",
        a: "Vergelijk niet alleen de afnameprijs, maar ook de injectievergoeding. Kun je je verbruik automatisch verschuiven met een warmtepomp, batterij of elektrische auto, dan kan een dynamisch contract interessant zijn. Verbruik je vooral 's avonds en kun je weinig verschuiven, dan is een vast contract vaak rustiger.",
      },
    ],
    sources: ["terugdraaiendeTellerEinde", "injectievergoeding", "stroomprijsAllIn", "zelfverbruikZonder", "zelfverbruikMet", "pvOpbrengstPerKwp", "prijsZonnepanelenPerKwp", "terugverdientijdZonnepanelen"],
    relatedArticles: ["injectietarief-en-zelfverbruik", "hoe-groot-moet-een-thuisbatterij-zijn"],
    relatedPosts: ["dynamisch-energiecontract-ja-of-nee", "capaciteitstarief-verlagen-zo-doe-je-het"],
    relatedServices: ["zonnepanelen", "thuisbatterij"],
    relatedComparisons: ["met-of-zonder-zonnepanelen"],
    relatedProjects: ["rijwoning-antwerpen-zon-batterij"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "capaciteitstarief-verlagen-zo-doe-je-het",
    title: "Zo verlaag je je capaciteitstarief",
    shortTitle: "Capaciteitstarief verlagen",
    seoTitle: "Capaciteitstarief verlagen: 6 tips die echt werken",
    description:
      "Elke kW minder maandpiek bespaart ca. €52–61 per jaar. Met slim laden, warmtepompsturing en een batterij hou je je piek laag. Zo pak je het aan.",
    h1: "Zo verlaag je je capaciteitstarief",
    category: "Tarieven",
    author: "sofie-maes",
    publishedAt: "2026-07-14",
    updatedAt: "2026-11-01",
    image: "meter-app-hand",
    excerpt: "Je piek van één kwartier bepaalt een deel van je factuur voor een heel jaar. Zes tips die echt werken, van gratis tot een investering.",
    kortAntwoord: `Je verlaagt je capaciteitstarief door je maandpiek te verlagen: het kwartier waarin je het meeste vermogen van het net haalt. Elke kW minder bespaart ${eur("capaciteitstariefPerKw")} per jaar. De grootste winst zit in niet tegelijk koken, wassen en laden, een slimme laadpaal en een goed afgestelde warmtepomp. Onder ${fx("capaciteitstariefMinimumKw")} kW zakken heeft geen zin.`,
    body: [
      { type: "h2", text: "Hoe lees ik mijn piek af?" },
      {
        type: "p",
        text: "Log in op **Mijn Fluvius** en open je verbruiksgegevens. Je ziet per maand je maandpiek in kW, en vaak ook de dag en het kwartier waarop die viel. Kijk naar de laatste twaalf maanden: het gemiddelde daarvan bepaalt je capaciteitstarief. Valt je piek telkens op hetzelfde tijdstip, bijvoorbeeld rond 18 uur? Dan weet je meteen waar je moet zoeken.",
      },
      {
        type: "p",
        text: `Ter vergelijking: een gemiddeld Vlaams gezin haalt een maandpiek van ${fx("gemiddeldeMaandpiekKw", { central: true })} kW en betaalt ${eur("capaciteitstariefGemiddeldPerJaar")} per jaar aan capaciteitstarief. Lees ook [hoe het capaciteitstarief precies werkt](/kennisbank/wat-is-het-capaciteitstarief).`,
      },
      { type: "h2", text: "6 tips die echt werken" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Spreid je grote verbruikers (gratis).** Kook niet terwijl de droogkast en de vaatwasser draaien. Zet ze op een timer voor later op de avond of de middag.",
          "**Laad je auto slim.** Een laadpaal met dynamische vermogensregeling meet je totale verbruik en laadt trager als je kookt. Laden op 11 kW tijdens het avondeten is de snelste manier om je piek te verdubbelen.",
          "**Stel je warmtepomp goed af.** Vermijd een diepe nachtverlaging waardoor de elektrische bijverwarming 's ochtends aanslaat. Een warmtepomp draait het best lang en rustig.",
          "**Kies toestellen met een lager vermogen** waar dat kan, zoals een warmtepompdroger in plaats van een condensdroger.",
          "**Gebruik een energiebeheersysteem.** Dat stemt laadpaal, warmtepomp, boiler en batterij op elkaar af, zodat ze niet tegelijk vol vermogen trekken.",
          "**Een thuisbatterij als buffer.** Een batterij kan pieken opvangen, maar loont zelden alleen daarvoor. In combinatie met zonnepanelen en een elektrische auto ligt dat anders.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Wat levert het op?",
        text: [
          `Stel: je laadt je auto elke avond ongestuurd tijdens het koken en je gemiddelde maandpiek ligt op 7,5 kW. Met slim laden zakt die naar 4 à 4,5 kW. Dat scheelt ongeveer 3 kW, of ${eur("capaciteitstariefPerKw")} per kW per jaar: samen al snel € 150 à € 180 per jaar.`,
          "Het mooie: de laadpaal moest er toch komen. De slimme functie kost weinig extra en verdient zichzelf zo snel terug. Zie ons [voorbeeldproject in Hasselt](/projecten/koppel-hasselt-laadpaal-dynamisch).",
        ],
        factKeys: ["capaciteitstariefPerKw"],
      },
      midCta("Hoe laag kan jouw piek?"),
      {
        type: "callout",
        kind: "mythe",
        title: "\"Door het capaciteitstarief wordt elektrisch verwarmen en laden onbetaalbaar.\"",
        text: "Slim gestuurd verhoogt een warmtepomp of laadpaal je piek vaak maar 1 à 2 kW. Dat kost een fractie van wat je op gas of brandstof bespaart. Het capaciteitstarief straft pieken, niet elektrificatie.",
        factKeys: ["capaciteitstariefPerKw", "gemiddeldeMaandpiekKw"],
      },
      { type: "h2", text: "Wat levert het op – en wanneer niet?" },
      {
        type: "p",
        text: `Elke kW minder gemiddelde maandpiek levert ${eur("capaciteitstariefPerKw", { digits: 2 })} per jaar op, afhankelijk van je netgebied. Dat is geen fortuin per kW, maar bij een elektrische auto of een warmtepomp gaat het al snel om meerdere kW. En de eerste tips kosten niets.`,
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: `Ligt je piek al rond ${fx("capaciteitstariefMinimumKw")} kW, het minimum dat iedereen betaalt? Dan valt er niets meer te winnen. Koop dan zeker geen batterij om je piek te verlagen: die verdient zich daarmee nooit terug.`,
      },
    ],
    faq: [
      {
        q: "Wat is een normale piek?",
        a: `Een gemiddeld Vlaams gezin haalt een maandpiek van ${fx("gemiddeldeMaandpiekKw", { central: true })} kW. Met een elektrische auto die ongestuurd laadt, kan dat oplopen tot 7 kW of meer. Iedereen betaalt minstens voor ${fx("capaciteitstariefMinimumKw")} kW, ook wie lager piekt. Je eigen piek vind je in Mijn Fluvius.`,
      },
      {
        q: "Helpt een batterij?",
        a: "Een batterij kan pieken opvangen door op drukke momenten bij te springen. Maar alleen voor het capaciteitstarief loont ze zelden: de besparing per kW is daarvoor te klein. In combinatie met zonnepanelen, een elektrische auto of een dynamisch contract kan het wel. Dat rekenen we per gezin uit.",
      },
      {
        q: "Wat met mijn laadpaal?",
        a: "Een laadpaal is vaak de grootste piekmaker. Kies een slimme laadpaal met dynamische vermogensregeling: die meet je totale verbruik en laadt trager als je kookt of wast. Laad bij voorkeur op zonne-overschot of 's nachts aan laag vermogen. Zo blijft je piek laag zonder dat je auto leeg blijft.",
      },
      {
        q: "Hoe zie ik mijn piek?",
        a: "In Mijn Fluvius, bij je verbruiksgegevens, zie je per maand je maandpiek en vaak ook het tijdstip. Ook de app van je energieleverancier of een energiebeheersysteem kan het tonen. Kijk naar het patroon: valt je piek telkens rond etenstijd, dan weet je waar je moet ingrijpen.",
      },
    ],
    sources: ["capaciteitstariefPerKw", "capaciteitstariefMinimumKw", "gemiddeldeMaandpiekKw", "capaciteitstariefGemiddeldPerJaar"],
    relatedArticles: ["wat-is-het-capaciteitstarief", "dynamisch-tarief-uitgelegd"],
    relatedPosts: ["dynamisch-energiecontract-ja-of-nee", "einde-terugdraaiende-teller-wat-nu"],
    relatedServices: ["laadpalen", "thuisbatterij"],
    relatedComparisons: ["vast-vs-dynamisch-energiecontract"],
    relatedProjects: ["koppel-hasselt-laadpaal-dynamisch"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "gasketel-verbod-vlaanderen-wat-betekent-het",
    title: "Mag je je gasketel nog vervangen in Vlaanderen?",
    shortTitle: "Gasketel-verbod in Vlaanderen",
    seoTitle: "Gasketelverbod in Vlaanderen: wat geldt er echt?",
    description:
      "Geen gas meer bij nieuwbouw, 21% btw op een nieuwe gasketel, ETS2 vanaf 2028. Wat geldt nu echt voor jouw woning, en wat zijn geruchten?",
    h1: "Mag je je gasketel nog vervangen in Vlaanderen?",
    category: "Regelgeving",
    author: "wouter-van-den-bossche",
    publishedAt: "2026-08-25",
    updatedAt: "2026-11-01",
    image: "woonkamer-warm-winter",
    excerpt: "Er circuleren veel verhalen over een 'gasketelverbod'. Wat is beslist, wat is aangekondigd, en wat betekent het voor je keuze vandaag?",
    kortAntwoord: `Ja. In een bestaande woning mag je een kapotte gasketel vandaag nog vervangen door een nieuwe condensatieketel. Wel geldt: nieuwbouw krijgt sinds ${year("verbodGasNieuwbouw")} geen gasaansluiting meer, een nieuwe gasketel betaalt sinds juli 2025 ${fx("btwGasketel", { bare: true })} % btw, en vanaf ${year("ets2Start")} komt er een Europese CO₂-prijs op gas. Een ketel die je nu plaatst, gaat ${fx("levensduurGasketel")} jaar mee.`,
    body: [
      { type: "h2", text: "Wat is al beslist?" },
      {
        type: "list",
        items: [
          `**Geen gas in nieuwbouw.** Voor vergunningsaanvragen vanaf 1 januari ${year("verbodGasNieuwbouw")} mag een nieuwbouwwoning of een sloop-heropbouw in Vlaanderen geen aardgasaansluiting meer krijgen.`,
          `**Hybride bij ingrijpende renovatie.** Sinds ${year("hybrideVerplichtIER")} moet je bij een ingrijpende energetische renovatie minstens een hybride warmtepomp plaatsen.`,
          `**21 % btw op een nieuwe gasketel.** Sinds juli 2025 betaal je ${fx("btwGasketel", { bare: true })} % btw op de vervanging van een gasketel, ook in oudere woningen. Een warmtepomp blijft tot en met 2029 aan ${fx("btwWarmtepomp", { bare: true })} %.`,
          `**Duurdere gasaansluiting.** Een nieuwe gasaansluiting in een bestaande woning kost ${eur("kostNieuweGasaansluiting")}; vroeger was dat geplafonneerd op een veel lager bedrag.`,
        ],
      },
      { type: "h2", text: "Wat geldt voor bestaande woningen?" },
      {
        type: "p",
        text: "Voor een bestaande woning met een gasaansluiting is er vandaag **geen verbod** om een kapotte gasketel te vervangen door een nieuwe. Je mag dus, en soms is het ook een redelijke keuze – bijvoorbeeld als je binnen een paar jaar grondig gaat verbouwen. Maar 'mogen' is iets anders dan 'verstandig'. De vraag is wat het je de komende twintig jaar kost.",
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Vanaf 2027 mag je geen gasketel meer plaatsen.\"",
        text: "Een vervangingsverbod voor fossiele ketels in bestaande woningen duikt op in oudere beleidsplannen, maar is vandaag geen beslist recht. Wij noemen het daarom niet als zekerheid. Wat wél vastligt – btw, ETS2, de taxshift en het verbod in nieuwbouw – is al reden genoeg om goed te rekenen.",
      },
      { type: "h2", text: "Wat komt eraan?" },
      {
        type: "list",
        items: [
          `**ETS2 vanaf ${year("ets2Start")}.** De Europese CO₂-prijs op verwarming en vervoer, met een jaar uitgesteld. Voor een gemiddeld gasgezin naar schatting ${eur("ets2MeerkostGasgezin")} per jaar extra.`,
          `**De federale taxshift tot 2029.** De accijns op gas stijgt met € ${fx("accijnsShiftGas2029", { bare: true })} per MWh, die op stroom daalt met € ${fx("accijnsShiftStroom2029", { bare: true })} per MWh.`,
          "**Verdere uitfasering.** Europa en Vlaanderen sturen op minder fossiele verwarming. Hoe en wanneer dat in nieuwe regels voor bestaande woningen vertaald wordt, is nog niet beslist.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Twintig jaar gas, in een notendop",
        text: [
          `Een nieuwe ketel die je vandaag plaatst, gaat ${fx("levensduurGasketel")} jaar mee. Daarbovenop betaal je jaarlijks ${eur("gasVasteKosten")} aan vaste gaskosten, en vanaf ${year("ets2Start")} ${eur("ets2MeerkostGasgezin")} ETS2-meerkost voor een gemiddeld gezin.`,
          `Tegenover een goed ontworpen warmtepomp bespaart een gemiddeld gasgezin vandaag al ${eur("voorbeeldBesparingWarmtepomp")} per jaar, vóór ETS2. Lees [de volledige vergelijking](/vergelijken/gasketel-vs-warmtepomp).`,
        ],
        factKeys: ["levensduurGasketel", "gasVasteKosten", "ets2MeerkostGasgezin", "voorbeeldBesparingWarmtepomp"],
      },
      midCta("Wat kost twintig jaar gas jóu?"),
      { type: "h2", text: "Wat betekent dit voor jouw keuze vandaag?" },
      {
        type: "p",
        text: "Wacht niet tot je ketel in januari stilvalt. Dan beslis je onder tijdsdruk, en wordt het vaak 'gewoon weer een gasketel'. Laat je situatie doorrekenen terwijl je ketel nog werkt: dan kun je kiezen tussen een volledige warmtepomp, een hybride oplossing of – als het echt beter is – een nieuwe gasketel, met de cijfers ernaast.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer een nieuwe gasketel wél verstandig kan zijn",
        text: "Als je binnen een paar jaar grondig gaat verbouwen, kan een tijdelijke oplossing of je bestaande ketel volstaan tot na de renovatie. Dan dimensioneren we de warmtepomp op de nieuwe woning. Dat zeggen we je eerlijk, ook al plaatsen we dan nu niets.",
      },
    ],
    faq: [
      {
        q: "Mag ik mijn kapotte gasketel vervangen?",
        a: "Ja. In een bestaande woning met gasaansluiting mag je een kapotte gasketel vandaag nog vervangen door een nieuwe condensatieketel. Je betaalt wel 21 % btw, en je zit voor vijftien à twintig jaar vast aan gas, terwijl gas duurder wordt door de taxshift en de Europese CO₂-prijs.",
      },
      {
        q: "Geldt het verbod voor mijn huis?",
        a: `Het verbod op een gasaansluiting geldt voor nieuwbouw en sloop-heropbouw met een vergunningsaanvraag vanaf ${year("verbodGasNieuwbouw")}. Voor bestaande woningen is er geen verbod om een gasketel te vervangen. Bij een ingrijpende energetische renovatie moet je wel minstens een hybride warmtepomp plaatsen.`,
      },
      {
        q: "Wat is ETS2?",
        a: `ETS2 is het Europese emissiehandelssysteem voor verwarming en vervoer. Leveranciers van gas en brandstof moeten vanaf ${year("ets2Start")} betalen voor de CO₂ die hun klanten uitstoten, en rekenen dat door. Voor een gemiddeld Vlaams gasgezin betekent dat naar schatting ${eur("ets2MeerkostGasgezin")} per jaar extra.`,
      },
      {
        q: "Wat met stookolie?",
        a: `Stookolie is vandaag een van de duurste manieren om te verwarmen: ${fx("stookoliePrijs", { scale: 100, bare: true })} cent per kWh. Ook stookolie valt onder ETS2. Wie op stookolie stookt, wint vaak het meest bij een warmtepomp of een hybride stap met een airco, zoals in ons voorbeeldproject in Brugge.`,
      },
    ],
    sources: ["verbodGasNieuwbouw", "hybrideVerplichtIER", "btwGasketel", "btwWarmtepomp", "kostNieuweGasaansluiting", "ets2Start", "ets2MeerkostGasgezin", "accijnsShiftGas2029", "accijnsShiftStroom2029", "levensduurGasketel", "gasVasteKosten", "voorbeeldBesparingWarmtepomp", "stookoliePrijs"],
    relatedArticles: ["epc-en-renovatieverplichting", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
    relatedPosts: ["loont-een-warmtepomp-nog-in-2026", "waarom-wij-soms-nee-zeggen"],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
    relatedProjects: ["fermette-brugge-airco-zonnepanelen"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "waarom-wij-soms-nee-zeggen",
    title: "Waarom we soms nee zeggen",
    shortTitle: "Waarom wij soms nee zeggen",
    seoTitle: "Waarom wij soms \"nee\" zeggen tegen een klant",
    description:
      "Niet elke woning heeft baat bij een batterij of warmtepomp. Waarom onze ingenieurs dat eerlijk zeggen, en wat je in de plaats krijgt.",
    h1: "Waarom we soms nee zeggen",
    category: "Onze aanpak",
    author: "lotte-claes",
    publishedAt: "2026-06-30",
    updatedAt: "2026-11-01",
    image: "ingenieur-aan-tafel",
    excerpt: "Een gezin vroeg ons een thuisbatterij. We raadden ze af. Waarom we dat doen, hoe we rekenen, en wat 'klant eerst' in de praktijk betekent.",
    kortAntwoord:
      "Omdat een installatie die niet loont, niemand helpt: jou niet, en ons op termijn ook niet. Onze ingenieurs rekenen elke situatie door met jouw verbruik, je dak en je contract, inclusief een scenario 'niets doen'. Levert een toestel bij jou te weinig op, dan zeggen we dat, en vertellen we wat wél werkt.",
    body: [
      { type: "h2", text: "Een batterij die we afraadden" },
      {
        type: "p",
        text: "Sanne en Pieter uit Kortrijk wilden zonnepanelen met een thuisbatterij, net zoals hun buren. Ze hadden al een offerte voor dat pakket. Toen we hun verbruik bekeken, zagen we een gezin dat weinig stroom verbruikt, overdag niet thuis is, een vast contract heeft en geen elektrische auto. Hun maandpiek lag al dicht bij het minimum dat iedereen betaalt.",
      },
      {
        type: "p",
        text: "De panelen loonden ruim. De batterij niet: ze zou zichzelf pas in ongeveer elf à twaalf jaar terugverdienen, bovenop de panelen, en dat terwijl batterijprijzen nog dalen. Dus raadden we ze af. We plaatsten een omvormer die later een batterij aankan, en spraken af dat we opnieuw rekenen als hun situatie verandert. Het volledige verhaal lees je in het [voorbeeldproject in Kortrijk](/projecten/gezin-kortrijk-geen-batterij-advies).",
      },
      {
        type: "quote",
        text: "We kwamen voor een batterij en gingen naar huis met een kleinere factuur dan verwacht. Dat iemand ons iets afraadt, hadden we nog nooit meegemaakt.",
        cite: "Sanne, Kortrijk (voorbeeldproject)",
      },
      { type: "h2", text: "Hoe we rekenen" },
      {
        type: "p",
        text: "Elke berekening begint bij jouw cijfers: je jaarafrekening, en als je een digitale meter hebt, je kwartierwaarden uit Mijn Fluvius. Daaruit zien we niet alleen hoeveel je verbruikt, maar ook wanneer. Dat 'wanneer' bepaalt of zonnepanelen, een batterij of een slimme laadpaal iets opleveren.",
      },
      {
        type: "list",
        items: [
          "**Altijd een scenario 'niets doen'.** Zo zie je wat wachten je kost, en of er überhaupt iets te winnen valt.",
          "**Altijd meerdere combinaties.** Niet één pakket, maar twee of drie opties naast elkaar, met de investering, de factuur en de terugverdientijd.",
          "**Vlakke prijzen.** We rekenen niet met verzonnen prijsstijgingen om een terugverdientijd mooier te maken.",
          "**Aannames zwart op wit.** Elk getal komt met een bron en een datum, zodat je het kunt nakijken of vergelijken.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Waarom een batterij soms wel en soms niet loont",
        text: [
          `Een batterij verdient op drie manieren: zonnestroom die je anders aan ${fx("injectievergoeding")} cent injecteert, 's avonds zelf gebruiken in plaats van te kopen aan ${fx("stroomprijsAllIn", { scale: 100 })} cent; je maandpiek verlagen (${eur("capaciteitstariefPerKw")} per kW per jaar); en met een dynamisch contract laden op goedkope uren.`,
          `Speelt geen van die drie sterk, dan verdient een batterij van ${eur("prijsThuisbatterijPerKwh")} per kWh zichzelf moeilijk terug. Spelen ze alle drie, zoals in ons [voorbeeldproject in Leuven](/projecten/nieuwbouw-leuven-all-electric), dan wel.`,
        ],
        factKeys: ["injectievergoeding", "stroomprijsAllIn", "capaciteitstariefPerKw", "prijsThuisbatterijPerKwh"],
      },
      midCta("Laat jouw situatie eerlijk doorrekenen"),
      { type: "h2", text: "Wat 'klant eerst' betekent" },
      {
        type: "p",
        text: "Bij VB-TEC rekenen ingenieurs, geen verkopers. Ze worden niet beoordeeld op hoeveel toestellen ze verkopen, maar op of de berekening klopt. Dat klinkt vanzelfsprekend, maar in een markt waar verkopers vaak op commissie werken, is het dat niet.",
      },
      {
        type: "p",
        text: "'Klant eerst' betekent voor ons concreet: we zeggen het als iets niet loont, we raden soms een goedkopere stap aan (eerst isoleren, eerst slim sturen), en we plannen dure toestellen soms bewust later in. Dat kost ons op korte termijn een verkoop. Op lange termijn levert het vertrouwen op – en klanten die ons aanraden bij hun buren.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wat we níet beloven",
        text: "We beloven geen 'gratis energie' en geen nulfactuur. We rekenen uit hoe jouw factuur zo dicht mogelijk bij €0 komt, met jouw woning en jouw contract. Voor sommige gezinnen is dat heel dichtbij, voor anderen is de winst bescheiden. Dat zie je in de berekening, vóór je iets beslist.",
      },
    ],
    faq: [
      {
        q: "Rekenen jullie gratis?",
        a: "Ja. De berekening is gratis en vrijblijvend. Een ingenieur bekijkt je verbruik, je woning en je dak, en rekent de scenario's uit die bij jou passen, inclusief het scenario 'niets doen'. Pas als je zelf beslist om verder te gaan, maken we een offerte op. Je zit nergens aan vast.",
      },
      {
        q: "Wat als ik het toch wil?",
        a: "Dan bespreken we het. Soms zijn er goede redenen die niet in een terugverdientijd passen: comfort, onafhankelijkheid, back-up bij stroomuitval. Dan plaatsen we het, maar je weet vooraf precies wat het oplevert en wat niet. We gaan alleen niet mee in een verhaal dat de cijfers niet ondersteunen.",
      },
      {
        q: "Hoe weet ik dat jullie eerlijk zijn?",
        a: "Omdat je alles kunt nakijken. Elke berekening toont de aannames, de bronnen en de datum van de cijfers. Je krijgt meerdere scenario's naast elkaar, inclusief 'niets doen'. En je mag onze berekening gerust naast die van een andere installateur leggen. Daar zijn we niet bang voor.",
      },
      {
        q: "Wat is het 'niets doen'-scenario?",
        a: "Dat is wat je de komende jaren betaalt als je niets verandert: je huidige factuur, met je huidige toestellen en contract, aan de prijzen van vandaag. Het is het vergelijkingspunt voor elke andere optie. Soms blijkt niets doen, of later iets doen, de verstandigste keuze. Dan zeggen we dat.",
      },
    ],
    sources: ["injectievergoeding", "stroomprijsAllIn", "capaciteitstariefPerKw", "prijsThuisbatterijPerKwh"],
    relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "injectietarief-en-zelfverbruik"],
    relatedPosts: ["loont-een-warmtepomp-nog-in-2026", "einde-terugdraaiende-teller-wat-nu"],
    relatedServices: ["thuisbatterij", "zonnepanelen"],
    relatedComparisons: ["met-of-zonder-thuisbatterij"],
    relatedProjects: ["gezin-kortrijk-geen-batterij-advies"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "dynamisch-energiecontract-ja-of-nee",
    title: "Dynamisch contract: voor wie loont het?",
    shortTitle: "Dynamisch contract: ja of nee?",
    seoTitle: "Dynamisch energiecontract: ja of nee voor jouw gezin?",
    description:
      "Een dynamisch contract kan veel besparen met een warmtepomp, batterij of EV – of net duurder uitvallen. Per profiel uitgelegd, met risico's.",
    h1: "Dynamisch contract: voor wie loont het?",
    category: "Tarieven",
    author: "sofie-maes",
    publishedAt: "2026-10-20",
    updatedAt: "2026-11-01",
    image: "laadpaal-oprit-avond",
    excerpt: "Vier gezinsprofielen, vier antwoorden. Wanneer een dynamisch contract je geld oplevert, en wanneer je beter bij een vast contract blijft.",
    kortAntwoord: `Een dynamisch contract loont vooral voor gezinnen die een groot deel van hun verbruik automatisch kunnen verschuiven naar goedkope uren: met een elektrische auto, een warmtepomp met buffer of een thuisbatterij. In 2025 waren er ${fx("negatievePrijsUren2025", { bare: true })} uren met een negatieve stroomprijs. Wie vooral 's avonds verbruikt en niets kan verschuiven, betaalt met een dynamisch contract eerder meer.`,
    body: [
      { type: "h2", text: "Hoe werkt het?" },
      {
        type: "p",
        text: "Bij een dynamisch contract betaal je voor de energiecomponent per uur de marktprijs van de day-aheadmarkt, plus een vaste opslag van je leverancier. Nettarieven, het capaciteitstarief, heffingen en btw blijven gewoon zoals bij elk ander contract. De uurprijzen van morgen worden vandaag rond de middag bekend. Lees de [volledige uitleg in de kennisbank](/kennisbank/dynamisch-tarief-uitgelegd).",
      },
      { type: "h2", text: "4 profielen" },
      { type: "h3", text: "1. Het gezin met elektrische auto en slimme laadpaal" },
      {
        type: "p",
        text: `Winnaar. Een auto die 's nachts of op zonnige middagen laadt, verschuift duizenden kWh per jaar naar goedkope uren. Een elektrische wagen verbruikt ${fx("evVerbruikPer100km")} kWh per 100 km; thuis laden aan de gemiddelde prijs kost ${eur("kostPer100kmThuisNet", { digits: 2 })} per 100 km, en op goedkope uren meestal minder. Voorwaarde: een slimme laadpaal die het zelf regelt.`,
      },
      { type: "h3", text: "2. Het gezin met warmtepomp en buffer of vloerverwarming" },
      {
        type: "p",
        text: "Vaak winnaar. Een warmtepomp met vloerverwarming of een buffervat kan warmte opslaan op goedkope uren en de dure avondpiek overslaan. Het comfort blijft gelijk, als de sturing goed is ingesteld.",
      },
      { type: "h3", text: "3. Het gezin met zonnepanelen en thuisbatterij" },
      {
        type: "p",
        text: "Kan winnen, maar het hangt af van de sturing. De batterij kan laden op goedkope of negatieve uren en de dure avond overbruggen. Let wel op de injectievergoeding: met een dynamisch contract is die op zonnige middagen laag of negatief. Een goede omvormer stuurt je overschot dan naar de batterij in plaats van naar het net.",
      },
      { type: "h3", text: "4. Het gezin zonder verschuifbaar verbruik" },
      {
        type: "p",
        text: "Meestal geen winnaar. Wie vooral 's ochtends vroeg en 's avonds verbruikt – precies wanneer de prijzen hoog zijn – en niets kan verschuiven, betaalt met een dynamisch contract eerder meer dan met een goed vast contract. En de factuur schommelt meer.",
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Waarom we het voordeel niet vast inrekenen",
        text: [
          `Laden op eigen zonne-overschot kost je ${eur("kostPer100kmZonOverschot", { digits: 2 })} per 100 km, laden aan de gemiddelde all-in prijs ${eur("kostPer100kmThuisNet", { digits: 2 })}. Laden op goedkope dynamische uren zit daar meestal tussen, maar hoeveel precies, hangt af van het uur, het seizoen en het jaar.`,
          "Daarom rekenen we het voordeel van een dynamisch contract nooit als vaste besparing in een terugverdientijd. Wat je extra wint, is mooi meegenomen, geen belofte. Zie ons [voorbeeldproject in Hasselt](/projecten/koppel-hasselt-laadpaal-dynamisch).",
        ],
        factKeys: ["kostPer100kmZonOverschot", "kostPer100kmThuisNet", "evVerbruikPer100km"],
      },
      midCta("Welk contract past bij jouw profiel?"),
      { type: "h2", text: "Risico's" },
      {
        type: "list",
        items: [
          "**Prijspieken.** Op koude, windstille winteravonden kan de uurprijs fors stijgen. Wie dan niet kan uitwijken, betaalt meer.",
          "**Schommelende facturen.** Je maandbedrag is minder voorspelbaar dan bij een vast contract.",
          "**Lage of negatieve injectievergoeding** op zonnige middagen, als je overschot naar het net gaat.",
          "**Een hogere piek.** Als al je toestellen tegelijk op het goedkoopste uur aanslaan, stijgt je maandpiek en dus je [capaciteitstarief](/kennisbank/wat-is-het-capaciteitstarief). Goede sturing spreidt dat.",
        ],
      },
      { type: "h2", text: "Zo automatiseer je" },
      {
        type: "p",
        text: "Handmatig elke dag de prijzen checken en de wasmachine op het juiste uur starten, houdt bijna niemand vol. De winst komt van automatisatie: een slimme laadpaal, een hybride omvormer met batterij of een warmtepomp met sturing, eventueel via een energiebeheersysteem. Je stelt één keer in wat wanneer mag, met een comfortmarge, en daarna werkt het vanzelf.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Geen auto, geen warmtepomp, geen batterij, en je verbruikt vooral 's avonds? Blijf dan bij een goed vast contract. Een dynamisch contract is een gereedschap voor wie kan verschuiven, geen besparing op zich.",
      },
    ],
    faq: [
      {
        q: "Wat gebeurt er bij een prijspiek?",
        a: "Dan betaal je dat uur de hoge marktprijs voor wat je afneemt. Met automatisatie vermijd je de duurste uren: je auto, warmtepomp of batterij wacht tot de prijs zakt. Wie niets kan verschuiven, voelt prijspieken wel in de factuur. Daarom past een dynamisch contract niet bij elk gezin.",
      },
      {
        q: "Heb ik een batterij nodig?",
        a: "Niet per se. Een elektrische auto met slimme laadpaal of een warmtepomp met buffer kan je verbruik ook verschuiven, vaak goedkoper dan een batterij. Een batterij helpt vooral om de dure avonduren te overbruggen. Of ze loont, hangt af van je verbruik en je panelen. Dat rekenen we uit.",
      },
      {
        q: "Hoe vaak mag ik van contract wisselen?",
        a: "In België kun je als particulier je energiecontract op elk moment kosteloos opzeggen, met een opzegtermijn van één maand. Je zit dus niet vast aan een dynamisch contract als het niet bij je blijkt te passen. Vergelijk wel ook de injectievoorwaarden als je zonnepanelen hebt.",
      },
      {
        q: "Wat met negatieve prijzen?",
        a: `In 2025 waren er ${fx("negatievePrijsUren2025", { bare: true })} uren met een negatieve stroomprijs, vooral op zonnige middagen. Dan word je betaald om af te nemen, maar kan injecteren je geld kosten. Met een batterij, boiler of auto die op die momenten laadt, en een omvormer die kan afregelen, haal je er voordeel uit.`,
      },
    ],
    sources: ["negatievePrijsUren2025", "evVerbruikPer100km", "kostPer100kmThuisNet", "kostPer100kmZonOverschot", "injectievergoeding", "capaciteitstariefPerKw"],
    relatedArticles: ["dynamisch-tarief-uitgelegd", "wat-is-het-capaciteitstarief"],
    relatedPosts: ["capaciteitstarief-verlagen-zo-doe-je-het", "einde-terugdraaiende-teller-wat-nu"],
    relatedServices: ["laadpalen", "thuisbatterij"],
    relatedComparisons: ["vast-vs-dynamisch-energiecontract"],
    relatedProjects: ["koppel-hasselt-laadpaal-dynamisch"],
  },
];

// Keep registry order for lookups; the hub sorts by date (newest first).
export const allPosts: Post[] = POSTS.map((r) => posts.find((p) => p.slug === r.slug)).filter((p): p is Post => Boolean(p));

/** Newest first (static string dates compare lexicographically). */
export const postsByDate: Post[] = [...allPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function postsBySlugs(slugs: readonly PostSlug[] | undefined): Post[] {
  return (slugs ?? []).map((s) => getPost(s)).filter((p): p is Post => Boolean(p));
}
