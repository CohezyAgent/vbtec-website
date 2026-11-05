// PLACEHOLDER – vervang door echte gegevens
// Copy + FAQs for /over-ons, /hoe-we-werken, /team and /contact (owner: Builder 2).
// Company metrics, NAP, response time and guarantees come from site.ts (PLACEHOLDER);
// every energy number comes from facts.ts via the helpers in services.ts.
// Milestones, durations and guarantee terms below are placeholders: confirm with the client.

import { site } from "./site";
import { eur, pct } from "./services";
import type { FaqItem } from "./types";
import type { TimelineStep } from "@/components/sections/Timeline";

// ───────────────────────── /hoe-we-werken ─────────────────────────
export const hoeWeWerken = {
  title: "Hoe we werken: van gratis berekening tot opvolging",
  description:
    "In 6 stappen van gratis berekening naar een installatie die écht opbrengt: plaatsbezoek, scenario's (ook niets doen), premies, installatie en monitoring.",
  h1: "Van je jaarafrekening naar een installatie die écht opbrengt",
  lead: "En nee, je zit nergens aan vast. Zo ziet de weg eruit, van je eerste vraag tot de dag waarop je je eerste lagere factuur krijgt – en daarna.",
  kortAntwoord: `Je vraagt gratis een berekening aan en een ingenieur belt je binnen ${site.responseTime}. Na een plaatsbezoek krijg je een voorstel met scenario's naast elkaar, altijd ook 'niets doen'. Pas als je akkoord gaat, regelen wij premies, installatie en keuring. Daarna volgen we je opbrengst mee op. De eerste drie stappen zijn gratis en vrijblijvend.`,
  timelineIntro: {
    eyebrow: "Zes stappen",
    title: "Wat gebeurt er als je ons contacteert?",
    lead: "Voor elke stap: wat jij doet, wat wij doen, hoe lang het duurt en wat het kost. Geen kleine lettertjes.",
  },
  steps: [
    {
      title: "Gratis berekening",
      titleAs: "h2",
      duration: `Antwoord binnen ${site.responseTime}`,
      cost: "Gratis",
      body: "Je vertelt ons kort hoe je woont: type woning, verwarming, je voorschot of jaarverbruik en wat je overweegt. Een ingenieur – geen callcenter – belt je terug om een paar details te checken en maakt een eerste inschatting.",
      whoDoesWhat: {
        jij: "Het formulier invullen (minder dan een minuut) en je laatste jaarafrekening bij de hand houden.",
        wij: "Je verbruik en woning bekijken, een eerste inschatting maken en een plaatsbezoek voorstellen als dat zinvol is.",
      },
    },
    {
      title: "Plaatsbezoek & meting",
      titleAs: "h2",
      duration: "Eén bezoek bij jou thuis",
      cost: "Gratis",
      body: "We komen langs om te meten wat je niet op papier ziet: de oriëntatie en schaduw op je dak, je meterkast, je radiatoren, de plaats voor een buitenunit of batterij. Met de kwartierwaarden van je digitale meter zien we wanneer je stroom verbruikt.",
      whoDoesWhat: {
        jij: "Ons rondleiden en vertellen wat je belangrijk vindt: comfort, budget, timing, plannen met de woning.",
        wij: "Dak, meterkast en verwarming opmeten, foto's nemen en je meterdata analyseren.",
      },
    },
    {
      title: "Voorstel met scenario's",
      titleAs: "h2",
      duration: "Voorstel na je plaatsbezoek",
      cost: "Gratis",
      body: "Je krijgt geen offerte voor één toestel, maar een rekenblad met scenario's naast elkaar: wat elke combinatie kost, wat ze oplevert, de terugverdientijd en de premies. Altijd met een scenario 'niets doen', zodat je ziet wat wachten je kost. Raden we iets af, dan staat daar waarom.",
      whoDoesWhat: {
        jij: "Rustig vergelijken, vragen stellen en beslissen. Of niet beslissen – ook dat mag.",
        wij: "De scenario's doorrekenen, uitleggen in een gesprek en je vragen eerlijk beantwoorden.",
      },
    },
    {
      title: "Premies & papierwerk",
      titleAs: "h2",
      duration: "Wij regelen het",
      cost: "Inbegrepen",
      body: `Ga je akkoord, dan nemen wij het papierwerk over: de aanvraag van Mijn VerbouwPremie (voor een lucht-water warmtepomp ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")}, afhankelijk van je inkomen), de juiste btw (${pct("btwWarmtepomp")} op een warmtepomp) en de aanmelding bij de netbeheerder.`,
      whoDoesWhat: {
        jij: "Je offerte ondertekenen en een paar documenten bezorgen (bijvoorbeeld je inkomenscategorie).",
        wij: "Premieaanvraag, btw-attest en aanmeldingen voorbereiden en indienen.",
      },
    },
    {
      title: "Installatie",
      titleAs: "h2",
      duration: "Planning in overleg",
      cost: "Volgens offerte",
      body: "Onze eigen ploeg plaatst wat de ingenieur berekende – geen onderaannemer die het plan voor het eerst ziet. We werken netjes, overleggen vooraf waar elk toestel komt en laten de installatie keuren volgens het AREI.",
      whoDoesWhat: {
        jij: "Toegang geven tot je woning op de afgesproken dagen.",
        wij: "Installeren, keuren, indienststellen en je uitleggen hoe alles werkt, inclusief de app.",
      },
    },
    {
      title: "Opvolging & monitoring",
      titleAs: "h2",
      duration: "Doorlopend",
      cost: "Inbegrepen",
      body: "Na de installatie volgen we mee op wat je systeem opbrengt. De eerste winter stellen we je warmtepomp bij, en klopt de opbrengst niet met de berekening, dan zoeken we uit waarom. Klaar om te starten? Stap 1 staat hieronder ↓",
      whoDoesWhat: {
        jij: "Genieten van een lagere factuur, en ons laten weten als iets niet klopt.",
        wij: "Je opbrengst opvolgen, bijsturen waar nodig en bereikbaar blijven voor vragen.",
      },
    },
  ] satisfies TimelineStep[],
  bento: {
    eyebrow: "Eerlijk advies",
    title: "Wat als het niet loont?",
    lead: "Dan zeggen we dat. Een berekening die eindigt met 'doe het nog niet' is voor ons geen mislukte verkoop, maar goed werk.",
    nietsDoen: {
      title: "Zwart op wit, ook als ons advies 'niets doen' is",
      body: "Elk voorstel bevat het scenario 'niets doen': wat je factuur de komende jaren is als je niets verandert. Zo zie je zelf of een investering zin heeft – of niet.",
      tags: ["Scenario 'niets doen'", "Aannames erbij", "Geen voorschot vóór akkoord"],
    },
    photoTitle: "Een ingenieur aan je keukentafel",
    photoBody: "Geen verkoper met een bestelbon, wel iemand die rekent en uitlegt.",
    garanties: {
      title: "Garanties, premies & opvolging",
      body: `${site.guarantees.join(" · ")}. Voor een lucht-water warmtepomp vragen we je premie aan (${eur("premieLuchtWaterCat12")} in inkomenscategorie 1 en 2). Garantietermijnen per toestel staan in je offerte.`,
    },
  },
  /** Round 4: one short line + photo per step (same order as `steps`). */
  stepVisuals: [
    { short: "Vul in een minuut in hoe je woont. Een ingenieur belt je terug.", image: "vbtec-app-smartphone-verbruik" },
    { short: "We meten wat je niet op papier ziet: dak, schaduw, meterkast.", image: "vbtec-dakrij-zonnepanelen-luchtfoto" },
    { short: "Scenario's naast elkaar – altijd ook 'niets doen'.", image: "ingenieur-aan-tafel" },
    { short: "Premie, btw en netbeheerder: wij regelen het papierwerk.", image: "gezin-keuken-factuur" },
    { short: "Onze eigen ploeg plaatst wat de ingenieur berekende.", image: "vbtec-installateurs-panelen" },
    { short: "We volgen je opbrengst op en sturen bij waar nodig.", image: "vbtec-app-tablet" },
  ] as const,
  teamIntro: {
    eyebrow: "Wie je onderweg ontmoet",
    title: "De ingenieurs en vakmensen achter elke stap",
  },
  faqTitle: "Wat kost het en hoe lang duurt het?",
  leadHeading: "Start met stap 1: je gratis berekening.",
  leadSub: "Vertel ons kort hoe je woont. Een ingenieur maakt een berekening op maat, met alle scenario's – ook 'niets doen'. Je zit nergens aan vast.",
  faq: [
    {
      q: "Is de berekening echt gratis en vrijblijvend?",
      a: "Ja. De berekening, het plaatsbezoek en het voorstel met scenario's zijn gratis en verplichten je tot niets. Je betaalt pas iets als je zelf beslist om een offerte te ondertekenen. Ook als je daarna niets laat plaatsen, hou je de berekening en mag je ze gebruiken om te vergelijken.",
    },
    {
      q: "Hoe lang duurt het van aanvraag tot installatie?",
      a: `Een ingenieur belt je binnen ${site.responseTime}. Het plaatsbezoek plannen we in overleg, en kort daarna krijg je je voorstel. De installatie zelf hangt af van de technieken: zonnepanelen zijn vaak op een dag geplaatst, een warmtepomp vraagt meestal iets meer tijd. We geven je een concrete planning bij je offerte.`,
    },
    {
      q: "Regelen jullie de premieaanvraag?",
      a: `Ja. Wij dienen je aanvraag voor Mijn VerbouwPremie in en zorgen voor de juiste btw. Voor een lucht-water warmtepomp gaat het om ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")}, afhankelijk van je inkomenscategorie. Je hoeft enkel een paar documenten te bezorgen.`,
    },
    {
      q: "Wat als de installatie minder oplevert dan berekend?",
      a: "Dan zoeken we uit waarom. We volgen je opbrengst op via monitoring en vergelijken die met de berekening. Ligt het aan de instellingen, dan sturen we bij. Ligt het aan een aanname die niet klopte, dan leggen we je eerlijk uit wat er anders is en wat we eraan kunnen doen.",
    },
    {
      q: "Zijn jullie RESCert-gecertificeerd?",
      a: "Voor de premies van Mijn VerbouwPremie moet een warmtepomp geplaatst of gevalideerd worden door een installateur met het juiste certificaat. We vermelden onze certificaten en erkenningen in je offerte, zodat je ze kan nakijken. (Certificaten worden nog bevestigd – voorbeeldtekst.)",
    },
    {
      q: "Welke gegevens heb ik nodig voor de berekening?",
      a: "Je laatste jaarafrekening is het belangrijkste. Heb je een digitale meter, dan helpen je verbruiksgegevens en je maandpiek uit Mijn Fluvius ons om nauwkeuriger te rekenen. Een paar foto's van je dak, je meterkast en je verwarming zijn mooi meegenomen. Ontbreekt er iets, dan zoeken we het samen uit.",
    },
  ] satisfies FaqItem[],
};

// ───────────────────────── /over-ons ─────────────────────────
export const overOns = {
  title: "Over VB-TEC: ingenieurs die rekenen, geen verkopers",
  description:
    "VB-TEC is een Vlaams ingenieursbedrijf dat per gezin de optimale energie-installatie berekent. We duwen geen product en zeggen het eerlijk als er geen winst is.",
  h1: "We rekenen eerst. Verkopen komt pas daarna – of niet.",
  lead: "VB-TEC is een Vlaams ingenieursbedrijf. We berekenen voor elk gezin welke combinatie van zon, warmte, opslag en laden de energiefactuur zo dicht mogelijk bij €0 brengt – en zeggen het eerlijk als iets niet loont.",
  statement: "Je hebt al drie verkopers over de vloer gehad. Elk met een ander verhaal.",
  statementHeading: "Klant eerst, ook als het antwoord 'nee' is",
  statementSupport: [
    "De ene wilde je dak vol panelen leggen, de andere zwoer bij een batterij, de derde vond dat je beter je gasketel hield. Allemaal hadden ze één ding gemeen: ze verkochten wat ze in de bestelwagen hadden.",
    "Wij begonnen VB-TEC omdat het anders kan. We zijn ingenieurs. We beginnen niet bij een product, maar bij jouw woning, jouw verbruik en jouw factuur. Pas als de cijfers kloppen, stellen we iets voor. En als ze niet kloppen, zeggen we dat ook.",
  ],
  timelineIntro: {
    eyebrow: "Ons verhaal",
    title: "Waarom we VB-TEC startten",
    lead: "Van een rekenblad op een keukentafel naar een team dat woningen in heel Vlaanderen doorrekent. (Voorbeeldtijdlijn – data volgen.)",
  },
  milestones: [
    {
      date: "Het begin",
      title: "Te veel installaties die niet samenwerkten",
      body: "Als ingenieurs zagen we het keer op keer: panelen die vooral injecteerden, een warmtepomp die de piek opblies, een batterij die nooit vol raakte. Losse producten, goed verkocht, slecht op elkaar afgestemd.",
    },
    {
      date: "De eerste woningen",
      title: "Rekenen voor we iets voorstellen",
      body: "We begonnen met een eenvoudig principe: eerst de woning doorrekenen, met alle scenario's naast elkaar – ook 'niets doen'. Gezinnen waardeerden vooral dat laatste.",
    },
    {
      date: "Onderzoek",
      title: "Onderzoek naar PVT",
      titleAs: "h2",
      body: "Kleine daken, grote warmtevraag: we gingen op zoek naar manieren om meer uit hetzelfde dak te halen. Zo begon ons onderzoek naar PVT-panelen, die stroom én warmte maken. Weinig installateurs bieden ze aan; wij testen, meten en blijven verbeteren.",
    },
    {
      date: "Vandaag",
      title: "Eén team: ingenieurs en eigen installatieploegen",
      body: "Wie bij ons rekent, werkt samen met wie plaatst. Zo komt wat op papier klopt ook op je dak en in je technische ruimte terecht – en volgen we het daarna mee op.",
    },
  ] satisfies TimelineStep[],
  values: {
    eyebrow: "Onze waarden",
    title: "Wat ons anders maakt",
    lead: "Vier dingen waar we niet over onderhandelen – ook niet als het ons een verkoop kost.",
    klant: {
      title: "Klant eerst",
      body: "We kiezen het toestel dat bij jouw woning past, niet het merk met de hoogste marge. Je krijgt altijd een scenario 'niets doen'.",
      tags: ["Merkonafhankelijk", "Scenario 'niets doen'", "Geen voorschot vóór akkoord"],
    },
    pvt: { title: "Onderzoek naar PVT", body: "We blijven investeren in kennis over PVT, omdat het voor sommige woningen echt het verschil maakt." },
    systeem: {
      title: "Systeem in plaats van product",
      body: "Zonnepanelen, warmtepomp, batterij en laadpaal werken pas echt als ze samenwerken. Daarom rekenen we je woning als één geheel – en sturen we alles slim aan, zodat je zoveel mogelijk zelf verbruikt en je piek laag blijft.",
    },
  },
  /** Round 4: the story in three photo rows instead of a statement + timeline. */
  splits: [
    {
      eyebrow: "Ons verhaal",
      title: "Drie verkopers, drie verhalen.",
      titleMuted: "Wij beginnen bij je woning.",
      text: "Geen product uit de bestelwagen: eerst je verbruik, je dak en je factuur. Pas als de cijfers kloppen, stellen we iets voor.",
      points: ["Altijd een scenario 'niets doen'", "Merkonafhankelijk", "Geen voorschot vóór akkoord"],
      image: "vbtec-gezin-zetel",
      chip: { value: "Eerlijk", label: "ook als het antwoord 'nee' is" },
    },
    {
      eyebrow: "Eén team",
      title: "Ingenieurs die rekenen.",
      titleMuted: "Ploegen die plaatsen.",
      text: "Wie je woning doorrekent, werkt samen met wie installeert. Wat op papier klopt, komt zo ook op je dak.",
      image: "vbtec-installateurs-plat-dak",
      chip: { value: "Eigen ploegen", label: "geen onderaannemers" },
    },
    {
      eyebrow: "Onderzoek",
      title: "Meer uit hetzelfde dak.",
      titleMuted: "Daarom testen we PVT.",
      text: "PVT-panelen maken stroom én warmte. Weinig installateurs bieden ze aan – wij meten wat ze echt opleveren.",
      image: "pvt-dak-detail",
    },
  ] as const,
  teamIntro: { eyebrow: "Ons team", title: "Ons team: ingenieurs eerst" },
  storyTitle: "Een fermette in Brugge: koel in de zomer, warm in de winter",
  storyBody: "Ze belden voor zonnepanelen. Ze kregen ook een eerlijk antwoord over de airco die ze al jaren wilden.",
  faqTitle: "Waar we werken – en wat je nog wil weten",
  leadHeading: "Leer ons kennen via een eerlijke berekening.",
  leadSub: "De beste manier om te zien hoe we werken: laat je woning doorrekenen. Gratis, vrijblijvend, en eerlijk – ook als het antwoord 'nog niet' is.",
  faq: [
    {
      q: "Zijn jullie onafhankelijk van merken?",
      a: "Ja. We zijn niet verbonden aan één fabrikant en kiezen per woning het toestel dat het best past bij je verbruik, je dak en je budget. In je voorstel staat waarom we voor een bepaald toestel kiezen, zodat je dat ook kan vergelijken met andere offertes.",
    },
    {
      q: "Waarom ontwikkelen jullie mee aan PVT?",
      a: "Omdat veel Vlaamse woningen een beperkt dak hebben en toch van het gas af willen. PVT-panelen maken stroom én warmte op hetzelfde dakvlak, en kunnen een warmtepomp voeden. Weinig installateurs bieden het aan. Wij testen en meten het, zodat we per woning eerlijk kunnen zeggen of het loont.",
    },
    {
      q: "Wie voert de installatie uit?",
      a: "Onze eigen installatieploegen, die samenwerken met de ingenieur die je woning doorrekende. Zo komt er geen onderaannemer die het plan voor het eerst ziet. Na de installatie volgt hetzelfde team je opbrengst op en stellen we bij waar nodig.",
    },
    {
      q: "Hoe lang bestaan jullie?",
      a: "VB-TEC is een jong ingenieursbedrijf, maar het team rekent al jaren energiesystemen voor woningen door. Op deze pagina vind je ons verhaal en ons team. (Voorbeeldtekst: oprichtingsjaar en historiek worden nog aangevuld.)",
    },
  ] satisfies FaqItem[],
};

// ───────────────────────── /team ─────────────────────────
export const teamPage = {
  title: "Ons team: de ingenieurs en installateurs van VB-TEC",
  description:
    "Maak kennis met de ingenieurs die jouw installatie berekenen en de vakmensen die ze plaatsen. Geen verkopers, wel specialisten.",
  h1: "De mensen die bij jou thuis komen rekenen",
  lead: "Wie rekent jouw installatie uit, en wie komt er bij je thuis? Geen verkopers met een omzetdoel, wel ingenieurs met een rekenblad en vakmensen die plaatsen wat ze berekenden.",
  articlesIntro: {
    eyebrow: "Kennis delen",
    title: "Artikels van ons team",
    lead: "Onze ingenieurs schrijven uit wat ze elke dag uitrekenen: helder, met bronnen en met de nuance erbij.",
  },
  leadHeading: "Laat een van onze ingenieurs jouw woning doorrekenen.",
  faq: [
    {
      q: "Wie komt het plaatsbezoek doen?",
      a: "Een van onze ingenieurs, meestal degene die ook je berekening maakt. Voor een warmtepomp is dat iemand die warmteverliezen berekent, voor zonnepanelen en batterijen iemand die je meterdata analyseert. Zo spreek je met de persoon die je installatie echt uitrekent.",
    },
    {
      q: "Werken jullie met onderaannemers?",
      a: "We installeren met eigen ploegen. Voor heel specifieke werken, zoals dakwerken of grondwerken, kunnen we een vaste partner inschakelen. Dat staat dan duidelijk in je offerte, en onze ingenieur blijft je aanspreekpunt.",
    },
    {
      q: "Welke certificaties hebben jullie?",
      a: "Onze techniekers werken volgens het AREI en hebben de opleidingen die nodig zijn voor warmtepompen en koeltechniek. De certificaten en erkenningen die gelden voor jouw installatie vermelden we in je offerte. (Certificaten worden nog bevestigd – voorbeeldtekst.)",
    },
    {
      q: "Kan ik rechtstreeks met een ingenieur praten?",
      a: `Ja, dat is net de bedoeling. Na je aanvraag belt een ingenieur je binnen ${site.responseTime}. Je hoeft niet eerst langs een verkoper of een callcenter. Heb je na de installatie een vraag, dan kan je ook bij hem of haar terecht.`,
    },
  ] satisfies FaqItem[],
};

// ───────────────────────── /contact ─────────────────────────
export const contactPage = {
  title: "Contact: vraag je gratis energieberekening aan",
  description: `Vraag vrijblijvend een berekening aan voor warmtepomp, zonnepanelen, PVT, batterij of laadpaal. We antwoorden binnen ${site.responseTime}.`,
  h1: "Vraag je gratis berekening aan",
  lead: `Een ingenieur bekijkt je situatie en belt je binnen ${site.responseTime}. Vrijblijvend – en eerlijk, ook als het niet loont.`,
  formHeading: "Vertel ons kort hoe je woont",
  nextSteps: [
    { title: "We bellen je terug", body: `Binnen ${site.responseTime} belt een ingenieur – geen callcenter – om een paar details te checken.` },
    { title: "We rekenen je woning door", body: "Na een plaatsbezoek krijg je scenario's naast elkaar, ook 'niets doen'." },
    { title: "Jij beslist", body: "Rustig, zonder druk. Je zit nergens aan vast en betaalt niets vóór je akkoord." },
  ],
  details: {
    eyebrow: "Contactgegevens",
    title: "Waar je ons vindt en wanneer we bereikbaar zijn",
    lead: "Liever eerst even bellen of mailen? Dat kan ook. We werken in heel Vlaanderen met eigen installatieploegen.",
    areaTitle: "Werkgebied: heel Vlaanderen",
    areaBody: "We rekenen en installeren in alle Vlaamse provincies. Woon je in Brussel of net over de taalgrens? Vraag gerust je berekening aan: we bellen je eerst om te bekijken of we je goed kunnen helpen.",
    responseTitle: `Antwoord binnen ${site.responseTime}`,
  },
  faqTitle: "Voor je op verzenden klikt",
  faqExtra: [
    {
      q: "Moet ik al weten wat ik wil?",
      a: "Nee. Kies gerust 'Ik weet het nog niet – adviseer me'. Veel gezinnen beginnen met een vraag als 'mijn ketel is oud' of 'mijn factuur is te hoog'. Precies daarvoor rekenen we: we zoeken uit welke combinatie bij jouw woning past, en of er iets is dat je beter niet doet.",
    },
    {
      q: "Werken jullie in mijn gemeente?",
      a: `We werken in ${site.areaServed}, in alle provincies, met eigen installatieploegen. Woon je in Brussel of net over de taalgrens, vraag dan toch je berekening aan: we bellen je eerst om te bekijken of we je goed kunnen helpen voor we een plaatsbezoek plannen.`,
    },
  ] satisfies FaqItem[],
};
