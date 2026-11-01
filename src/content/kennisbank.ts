// PLACEHOLDER – vervang door echte gegevens
// Kennisbank (Builder 3): evergreen uitleg, gegroepeerd per categorie (registry KENNISBANK_CATEGORIES).
// Auteurs = (placeholder) teamleden uit team.ts. Elk getal in de tekst komt via fx()/eur() uit
// src/content/facts.ts; de bronnen staan per artikel in `sources` (SourcesList onderaan).
// Rekenvoorbeelden zijn indicatief en gebruiken de rekenwaarden uit facts.ts (vlakke prijzen).

import type { Article, ArticleSlug, KennisbankCategory } from "./types";
import { ARTICLES } from "./registry";
import { routes } from "@/lib/routes";
import { eur, fx, year } from "@/components/content/fx";

export const isPlaceholder = true;

const LEAD = routes.lead();
const midCta = (title = "Wat betekent dit voor jouw factuur?") =>
  ({ type: "cta", title, body: "Een ingenieur rekent het gratis uit met jouw verbruik, je dak en je contract.", cta: { label: "Gratis berekening", href: LEAD } }) as const;

const articles: Article[] = [
  // ─────────────────────────── Tarieven & factuur ───────────────────────────
  {
    slug: "wat-is-het-capaciteitstarief",
    category: "tarieven",
    title: "Het capaciteitstarief, helder uitgelegd",
    shortTitle: "Wat is het capaciteitstarief?",
    seoTitle: "Wat is het capaciteitstarief en hoe verlaag je het?",
    description:
      "Het capaciteitstarief rekent je gemiddelde maandpiek aan, met minimum 2,5 kW. Zo werkt het, zoveel kost het in 2026 en zo hou je je piek laag.",
    h1: "Het capaciteitstarief, helder uitgelegd",
    author: "sofie-maes",
    publishedAt: "2026-02-10",
    updatedAt: "2026-11-01",
    image: "meter-app-hand",
    excerpt: "Je betaalt niet alleen voor hoeveel stroom je verbruikt, maar ook voor je hoogste kwartier per maand. Zo werkt het en zo hou je die piek laag.",
    kortAntwoord: `Het capaciteitstarief is het deel van je nettarief dat je betaalt voor je gemiddelde maandpiek: het hoogste kwartierverbruik van elke maand, gemiddeld over twaalf maanden. In 2026 kost elke kW ${eur("capaciteitstariefPerKw", { digits: 2 })} per jaar, afhankelijk van je netgebied. Iedereen betaalt minstens voor ${fx("capaciteitstariefMinimumKw")} kW.`,
    body: [
      { type: "h2", text: "Hoe wordt het capaciteitstarief berekend?" },
      {
        type: "p",
        text: `Je digitale meter registreert per kwartier hoeveel vermogen je gemiddeld van het net haalt. Het hoogste kwartier van de maand is je **maandpiek**. Fluvius neemt het gemiddelde van je maandpieken over de laatste twaalf maanden en vermenigvuldigt dat met het tarief van jouw netgebied: ${eur("capaciteitstariefPerKw", { digits: 2 })} per kW per jaar, inclusief btw.`,
      },
      {
        type: "p",
        text: `Ligt je piek lager dan ${fx("capaciteitstariefMinimumKw")} kW, dan betaal je toch voor ${fx("capaciteitstariefMinimumKw")} kW. Dat minimum geldt voor iedereen. Een gemiddeld Vlaams gezin haalt een maandpiek van ${fx("gemiddeldeMaandpiekKw", { central: true })} kW en betaalt daardoor ${eur("capaciteitstariefGemiddeldPerJaar")} per jaar aan capaciteitstarief.`,
      },
      { type: "h2", text: "Wat is mijn maandpiek, en waar zie ik hem?" },
      {
        type: "p",
        text: "Je maandpiek zie je in **Mijn Fluvius**, onder je verbruiksgegevens, of in de app van je energieleverancier. Je ziet er per maand het kwartier met het hoogste vermogen. Vaak is dat een moment waarop meerdere grote verbruikers tegelijk draaiden: oven, kookplaat, droogkast, vaatwasser, een laadpaal of een elektrische boiler.",
      },
      {
        type: "list",
        items: [
          "Een inductiekookplaat op vol vermogen trekt al snel enkele kW.",
          "Een laadpaal op 11 kW is in één kwartier genoeg om je piek te verdubbelen.",
          "Een warmtepomp met een elektrische weerstand die bijspringt op een koude ochtend kan je piek fors optrekken.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Wat kost 1 kW extra piek?",
        text: [
          `Elke kW extra gemiddelde maandpiek kost je ${eur("capaciteitstariefPerKw", { digits: 2 })} per jaar. Laadt je auto elke avond ongestuurd terwijl je kookt, dan kan je gemiddelde piek met 3 à 4 kW stijgen: dat is al snel € 150 à € 250 per jaar, enkel aan capaciteitstarief.`,
          "Met een slimme laadpaal die het vermogen verlaagt zolang de kookplaat aanstaat, verdwijnt het grootste deel van die meerkost.",
        ],
        factKeys: ["capaciteitstariefPerKw"],
      },
      midCta(),
      { type: "h2", text: "Telt mijn warmtepomp of laadpaal mee?" },
      {
        type: "p",
        text: `Ja. Alles wat stroom van het net haalt, telt mee voor je piek. Maar een goed ingestelde warmtepomp draait lang en rustig op laag vermogen, en verhoogt je piek meestal maar 1 à 2 kW. Dat kost ${eur("capaciteitstariefPerKw")} per kW per jaar, veel minder dan wat je op gas bespaart. Het probleem zit vooral bij toestellen die **tegelijk** en **op vol vermogen** draaien.`,
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Door het capaciteitstarief wordt elektrisch verwarmen onbetaalbaar.\"",
        text: "Klopt niet, zolang je slim stuurt. Het capaciteitstarief is een reden om pieken te vermijden, niet om elektrisch verwarmen of laden te vermijden. Wie zijn laadpaal en warmtepomp laat afstemmen op de rest van het huis, merkt er weinig van.",
      },
      { type: "h2", text: "Hoe verlaag ik mijn piek?" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Spreid grote verbruikers.** Laat de droogkast niet draaien terwijl je kookt, en de vaatwasser pas na het eten.",
          "**Laad je auto slim.** Een laadpaal met dynamische vermogensregeling kijkt naar je totale verbruik en laadt trager als het druk is.",
          "**Stel je warmtepomp goed af.** Vermijd dat de elektrische bijverwarming aanspringt na een nachtverlaging.",
          "**Gebruik een thuisbatterij als buffer.** Een batterij kan pieken opvangen, maar loont daar zelden alleen voor. Lees eerst [hoe groot een thuisbatterij moet zijn](/kennisbank/hoe-groot-moet-een-thuisbatterij-zijn).",
          "**Kijk maandelijks naar je piek** in Mijn Fluvius. Wat je meet, kun je bijsturen.",
        ],
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: `Heb je geen laadpaal, warmtepomp of andere grote verbruiker en ligt je piek al rond ${fx("capaciteitstariefMinimumKw")} kW? Dan valt er weinig te winnen: onder het minimum betaal je toch. Investeer dan zeker niet in een batterij om je piek te verlagen.`,
      },
      { type: "h2", text: "Wat betekent dit voor je volgende investering?" },
      {
        type: "p",
        text: "Wie een warmtepomp, laadpaal of batterij overweegt, moet het capaciteitstarief meenemen in de berekening. Niet als reden om het niet te doen, maar om het goed te doen: met sturing die je toestellen op elkaar afstemt. Dat is precies wat we bij elke berekening doen. Lees ook [hoe je je capaciteitstarief concreet verlaagt](/blog/capaciteitstarief-verlagen-zo-doe-je-het).",
      },
    ],
    faq: [
      {
        q: "Hoe wordt het capaciteitstarief berekend?",
        a: `Je digitale meter registreert elk kwartier je vermogen. Het hoogste kwartier per maand is je maandpiek. Fluvius neemt het gemiddelde van je laatste twaalf maandpieken en rekent daarop ${eur("capaciteitstariefPerKw", { digits: 2 })} per kW per jaar aan, met een minimum van ${fx("capaciteitstariefMinimumKw")} kW. Het tarief verschilt per netgebied.`,
      },
      {
        q: "Wat is mijn maandpiek?",
        a: "Je maandpiek is het kwartier in een maand waarin je gemiddeld het meeste vermogen van het net haalde. Je vindt hem in Mijn Fluvius of in de app van je leverancier. Meestal is het een moment waarop koken, wassen, drogen of laden samenvielen. Wie dat moment kent, kan het ook vermijden.",
      },
      {
        q: "Wat kost 1 kW extra?",
        a: `Elke kW extra gemiddelde maandpiek kost je ${eur("capaciteitstariefPerKw", { digits: 2 })} per jaar, inclusief btw, afhankelijk van je netgebied. Een piek die structureel 3 kW hoger ligt door ongestuurd laden, kost je dus al snel een paar honderd euro per jaar. Dat is te vermijden met slimme sturing.`,
      },
      {
        q: "Hoe verlaag ik mijn piek?",
        a: "Spreid grote verbruikers over de dag, laad je auto met een slimme laadpaal die het vermogen afstemt op de rest van je verbruik, en stel je warmtepomp zo in dat de elektrische bijverwarming zelden aanspringt. Een thuisbatterij kan helpen, maar loont zelden enkel voor piekverlaging.",
      },
      {
        q: "Telt mijn warmtepomp mee?",
        a: "Ja, alles wat stroom van het net haalt, telt mee. Maar een goed gedimensioneerde warmtepomp draait lang op laag vermogen en verhoogt je piek meestal maar 1 à 2 kW. De besparing op gas is doorgaans veel groter dan die meerkost, op voorwaarde dat de installatie goed is afgesteld.",
      },
    ],
    sources: ["capaciteitstariefPerKw", "capaciteitstariefMinimumKw", "gemiddeldeMaandpiekKw", "capaciteitstariefGemiddeldPerJaar"],
    relatedArticles: ["dynamisch-tarief-uitgelegd", "hoe-groot-moet-een-thuisbatterij-zijn"],
    relatedServices: ["laadpalen", "thuisbatterij"],
    relatedComparisons: ["vast-vs-dynamisch-energiecontract"],
  },
  {
    slug: "injectietarief-en-zelfverbruik",
    category: "tarieven",
    title: "Wat krijg je voor je zonnestroom, en waarom zelf verbruiken loont",
    shortTitle: "Injectietarief en zelfverbruik",
    seoTitle: "Injectievergoeding en zelfverbruik: wat krijg je nog?",
    description:
      "Voor geïnjecteerde stroom krijg je in 2026 maar enkele centen per kWh. Daarom bepaalt zelfverbruik het rendement van je zonnepanelen. Zo verhoog je het.",
    h1: "Wat krijg je voor je zonnestroom, en waarom zelf verbruiken loont",
    author: "lotte-claes",
    publishedAt: "2026-03-04",
    updatedAt: "2026-11-01",
    image: "rijwoning-zonnepanelen",
    excerpt: "Een kWh die je zelf verbruikt, is zeven keer meer waard dan een kWh die je aan het net geeft. Zo haal je meer uit je panelen.",
    kortAntwoord: `Voor stroom die je op het net zet, krijg je in 2026 een injectievergoeding van ${fx("injectievergoeding")} cent per kWh. Een kWh die je zelf verbruikt, bespaart je de volledige prijs van ${fx("stroomprijsAllIn", { scale: 100 })} cent. Daarom draait het rendement van zonnepanelen vandaag om zelfverbruik, niet om injectie.`,
    body: [
      { type: "h2", text: "Wat is het verschil tussen injectietarief en injectievergoeding?" },
      {
        type: "p",
        text: "Die twee worden vaak door elkaar gebruikt, maar ze betekenen iets anders. De **injectievergoeding** is wat je energieleverancier je betaalt voor elke kWh die je op het net zet. Het **injectietarief** is een nettarief dat de netbeheerder kan aanrekenen voor het gebruik van het net bij injectie. Voor gezinnen draait het in de praktijk vooral om de vergoeding: hoeveel krijg je nog voor je overschot?",
      },
      { type: "h2", text: "Hoeveel krijg ik per geïnjecteerde kWh?" },
      {
        type: "p",
        text: `Met een vast of variabel contract krijg je ${fx("injectievergoeding")} cent per kWh, afhankelijk van je leverancier. Met een dynamisch contract volgt de vergoeding de uurprijs op de markt. Rond de middag op zonnige dagen is die laag, en in ${fx("negatievePrijsUren2025", { bare: true })} uren in 2025 was ze zelfs negatief. Dan kan injecteren je geld kosten.`,
      },
      {
        type: "p",
        text: `Sinds de terugdraaiende teller in Vlaanderen verdwenen is, telt elke geïnjecteerde kWh dus voor een paar cent, terwijl je 's avonds stroom terugkoopt aan ${fx("stroomprijsAllIn", { scale: 100 })} cent per kWh. Dat verschil is de kern van het verhaal.`,
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Hetzelfde dak, twee gezinnen",
        text: [
          `Een installatie van 4 kWp levert in Vlaanderen ${fx("pvOpbrengstPerKwp")} kWh per kWp per jaar, dus rond 3.600 kWh. Gezin A verbruikt daarvan ${fx("zelfverbruikZonder", { central: true, bare: true })} % zelf, gezin B dankzij een warmtepompboiler, timers en slim laden ${fx("zelfverbruikMet", { central: true, bare: true })} %.`,
          "Gezin A bespaart op 1.080 kWh de volle prijs en krijgt voor 2.520 kWh een paar cent. Gezin B bespaart op 2.340 kWh de volle prijs. Bij dezelfde panelen en dezelfde investering verdient gezin B ruim dubbel zoveel terug.",
        ],
        factKeys: ["pvOpbrengstPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "stroomprijsAllIn", "injectievergoeding"],
      },
      midCta("Hoeveel zelfverbruik haal jij?"),
      { type: "h2", text: "Wat is een goed zelfverbruik?" },
      {
        type: "p",
        text: `Zonder sturing of opslag haalt een gezin dat overdag weinig thuis is ${fx("zelfverbruikZonder")} %. Met slimme sturing van een warmtepomp of boiler, laden op overschot en eventueel een batterij is ${fx("zelfverbruikMet")} % haalbaar. Het bovenste deel van die vork vraagt doorgaans een batterij of een elektrische auto die overdag laadt.`,
      },
      { type: "h2", text: "Hoe verhoog ik mijn zelfverbruik?" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Verschuif wat kan.** Wasmachine, droogkast en vaatwasser met een timer rond de middag laten draaien kost niets.",
          "**Maak warm water met zonnestroom.** Een warmtepompboiler of een warmtepomp die overdag het buffervat opwarmt, is een van de goedkoopste 'batterijen'.",
          "**Laad je auto op overschot.** Een slimme laadpaal laadt wanneer je panelen produceren.",
          "**Overweeg een batterij als laatste stap,** niet als eerste. Die loont vooral als de goedkopere stappen al gezet zijn en je 's avonds veel verbruikt.",
          "**Kijk naar je contract.** Met een dynamisch contract kun je vermijden dat je injecteert op momenten met (bijna) negatieve prijzen.",
        ],
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Zonder terugdraaiende teller lonen zonnepanelen niet meer.\"",
        text: `Ze lonen anders. Een installatie kost ${eur("prijsZonnepanelenPerKwp")} per kWp en verdient zich terug in ${fx("terugverdientijdZonnepanelen")} jaar: hoe meer zelfverbruik, hoe sneller. Wie niets kan verschuiven, kiest beter een kleinere installatie.`,
        factKeys: ["prijsZonnepanelenPerKwp", "terugverdientijdZonnepanelen"],
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Ben je overdag nooit thuis, heb je geen warmtepomp, boiler of elektrische auto, en kun je weinig verschuiven? Dan blijft je zelfverbruik laag. Dan rekenen we eerder een kleinere installatie uit, of zeggen we eerlijk dat het voor jou niet de moeite is.",
      },
      { type: "h2", text: "Kan injectie geld kosten?" },
      {
        type: "p",
        text: "Met een vast contract niet: je krijgt een lage, maar positieve vergoeding. Met een dynamisch contract kan het wel, op uren met negatieve marktprijzen. Een goede omvormer of energiebeheerder kan de productie dan afregelen of de stroom naar je boiler, batterij of auto sturen. Lees meer in [hoe een dynamisch contract werkt](/kennisbank/dynamisch-tarief-uitgelegd).",
      },
    ],
    faq: [
      {
        q: "Wat is het verschil tussen injectietarief en -vergoeding?",
        a: "De injectievergoeding is wat je leverancier je betaalt per kWh die je op het net zet. Het injectietarief is een nettarief voor het gebruik van het net bij injectie. Voor een gezin met zonnepanelen telt vooral de vergoeding, en die is sinds het einde van de terugdraaiende teller laag.",
      },
      {
        q: "Hoeveel krijg ik per kWh?",
        a: `Met een vast of variabel contract krijg je in 2026 ${fx("injectievergoeding")} cent per geïnjecteerde kWh, afhankelijk van je leverancier. Met een dynamisch contract volgt de vergoeding de uurprijs en kan ze op zonnige middagen bijna nul of zelfs negatief zijn. Vergelijk dus ook de injectievoorwaarden als je van contract wisselt.`,
      },
      {
        q: "Wat is een goed zelfverbruik?",
        a: `Zonder sturing haalt een gezin dat overdag weinig thuis is ${fx("zelfverbruikZonder")} %. Met een warmtepomp of boiler die overdag draait, slim laden en eventueel een batterij is ${fx("zelfverbruikMet")} % haalbaar. Elke procent extra zelfverbruik verkort de terugverdientijd van je panelen.`,
      },
      {
        q: "Kan injectie geld kosten?",
        a: "Met een vast contract niet. Met een dynamisch contract wel, op uren met negatieve marktprijzen, meestal rond de middag op zonnige dagen. Een slimme omvormer of energiebeheerder kan dan de productie beperken of de stroom naar je boiler, batterij of auto sturen in plaats van naar het net.",
      },
      {
        q: "Hoe verhoog ik zelfverbruik?",
        a: "Laat grote toestellen rond de middag draaien, maak warm water met zonnestroom, laad je auto op overschot en stuur je warmtepomp op de uren dat je panelen produceren. Pas daarna is een thuisbatterij aan de orde. Die volgorde levert de meeste winst per geïnvesteerde euro op.",
      },
    ],
    sources: ["injectievergoeding", "stroomprijsAllIn", "negatievePrijsUren2025", "pvOpbrengstPerKwp", "zelfverbruikZonder", "zelfverbruikMet", "prijsZonnepanelenPerKwp", "terugverdientijdZonnepanelen", "terugdraaiendeTellerEinde"],
    relatedArticles: ["hoe-groot-moet-een-thuisbatterij-zijn", "dynamisch-tarief-uitgelegd"],
    relatedServices: ["zonnepanelen", "thuisbatterij"],
    relatedComparisons: ["met-of-zonder-zonnepanelen"],
  },
  {
    slug: "dynamisch-tarief-uitgelegd",
    category: "tarieven",
    title: "Hoe werkt een dynamisch energiecontract?",
    shortTitle: "Dynamisch tarief uitgelegd",
    seoTitle: "Dynamisch energietarief uitgelegd: wanneer loont het?",
    description:
      "Met een dynamisch contract betaal je per uur de marktprijs. Voor wie met warmtepomp, batterij of EV kan dat besparen. Zo werkt het en dit zijn de risico's.",
    h1: "Hoe werkt een dynamisch energiecontract?",
    author: "sofie-maes",
    publishedAt: "2026-04-15",
    updatedAt: "2026-11-01",
    image: "laadpaal-oprit-avond",
    excerpt: "Elk uur een andere stroomprijs: voor wie kan verschuiven een kans, voor wie dat niet kan een risico. Zo weet je in welke groep je zit.",
    kortAntwoord: `Met een dynamisch contract betaal je voor de energiecomponent elk uur de prijs van de day-aheadmarkt. Op zonnige of winderige uren is stroom goedkoop, soms zelfs negatief (${fx("negatievePrijsUren2025", { bare: true })} uren in 2025). Wie zijn verbruik kan verschuiven met een warmtepomp, batterij of elektrische auto, kan besparen. Wie dat niet kan, loopt risico op dure piekuren.`,
    body: [
      { type: "h2", text: "Hoe wordt de uurprijs bepaald?" },
      {
        type: "p",
        text: "Elke dag rond de middag worden op de Europese day-aheadmarkt de stroomprijzen voor elk uur van de volgende dag vastgelegd. Je leverancier rekent die uurprijs door, plus een vaste opslag. Nettarieven, heffingen en btw komen daar bovenop en zijn niet dynamisch. Je ziet de prijzen van morgen dus al vandaag in de app van je leverancier.",
      },
      {
        type: "p",
        text: `Het verschil tussen goedkope en dure uren kan groot zijn. Op zonnige middagen en winderige nachten zakt de prijs, soms tot onder nul: in 2025 telden we ${fx("negatievePrijsUren2025", { bare: true })} uren met een negatieve stroomprijs. 's Avonds tussen vijf en acht, als iedereen kookt en het donker is, ligt de prijs vaak het hoogst.`,
      },
      { type: "h2", text: "Heb ik een digitale meter nodig?" },
      {
        type: "p",
        text: "Ja. Alleen een digitale meter registreert je verbruik per kwartier, zodat je leverancier per uur kan afrekenen. Sinds de terugdraaiende teller verdwenen is, heeft vrijwel elk Vlaams gezin met zonnepanelen een digitale meter. Zonder zonnepanelen kun je er ook een hebben; check het in Mijn Fluvius.",
      },
      { type: "h2", text: "Wie wint het meest?" },
      {
        type: "list",
        items: [
          "**Gezinnen met een elektrische auto** die 's nachts of op zonnige middagen laden, met een slimme laadpaal.",
          "**Gezinnen met een warmtepomp** die het buffervat of de vloer opwarmt op goedkope uren.",
          "**Gezinnen met een thuisbatterij** die laadt op goedkope uren en de dure avond overbrugt.",
          "**Gezinnen die hun verbruik automatiseren.** Handmatig elke dag de prijzen checken houdt bijna niemand vol.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Wat levert verschuiven op?",
        text: [
          `Een elektrische wagen verbruikt ${fx("evVerbruikPer100km")} kWh per 100 km. Thuis laden aan de gemiddelde all-in prijs kost zo ${eur("kostPer100kmThuisNet", { digits: 2 })} per 100 km. Laden op eigen zonne-overschot kost alleen de gemiste injectievergoeding: ${eur("kostPer100kmZonOverschot", { digits: 2 })} per 100 km.`,
          "Laden op goedkope dynamische uren zit daar meestal tussenin. Hoeveel precies, wisselt per uur en per jaar. Daarom rekenen we het voordeel van een dynamisch contract nooit als vaste besparing in een terugverdientijd.",
        ],
        factKeys: ["evVerbruikPer100km", "kostPer100kmThuisNet", "kostPer100kmZonOverschot"],
      },
      midCta("Past een dynamisch contract bij jouw verbruik?"),
      { type: "h2", text: "Wat met negatieve prijzen?" },
      {
        type: "p",
        text: "Bij een negatieve prijs krijg je geld om stroom af te nemen, en kan injecteren je geld kosten. Dat klinkt mooi, maar het gaat om een beperkt aantal uren per jaar. Het voordeel haal je alleen met automatisatie: een omvormer die de productie afregelt, een batterij of boiler die op dat moment laadt, of een auto die net dan aan de laadpaal hangt.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Verbruik je vooral 's avonds, heb je geen auto, warmtepomp of batterij, en wil je niet dat je factuur van maand tot maand schommelt? Dan is een vast contract vaak rustiger en niet duurder. Een dynamisch contract is een gereedschap, geen besparing op zich.",
      },
      { type: "h2", text: "Hoe automatiseer ik mijn verbruik?" },
      {
        type: "p",
        text: "De meeste moderne laadpalen, hybride omvormers en warmtepompen kunnen prijsinformatie gebruiken, rechtstreeks of via een energiebeheersysteem. Bij een installatie stellen we in welke toestellen op welke uren mogen draaien, met een veiligheidsmarge voor comfort: je huis blijft warm en je auto is 's ochtends geladen. Ondertussen blijft je [maandpiek voor het capaciteitstarief](/kennisbank/wat-is-het-capaciteitstarief) bewaakt, zodat goedkoop laden geen dure piek wordt.",
      },
    ],
    faq: [
      {
        q: "Hoe wordt de uurprijs bepaald?",
        a: "Elke dag worden op de Europese day-aheadmarkt de stroomprijzen voor elk uur van de volgende dag vastgelegd. Je leverancier rekent die uurprijs door met een vaste opslag. Nettarieven, heffingen en btw blijven dezelfde en komen daar bovenop. Je kent de prijzen van morgen dus al vandaag.",
      },
      {
        q: "Heb ik een digitale meter nodig?",
        a: "Ja. Een dynamisch contract werkt alleen met een digitale meter, omdat die je verbruik per kwartier registreert. Vrijwel elk gezin met zonnepanelen heeft er al een sinds het einde van de terugdraaiende teller. In Mijn Fluvius zie je welk type meter je hebt en kun je je verbruiksprofiel bekijken.",
      },
      {
        q: "Wat met negatieve prijzen?",
        a: `In 2025 waren er in België ${fx("negatievePrijsUren2025", { bare: true })} uren met een negatieve stroomprijs, vooral rond de middag op zonnige dagen. Dan word je betaald om af te nemen, en kan injecteren geld kosten. Dat voordeel haal je alleen met automatisatie van omvormer, batterij, boiler of laadpaal.`,
      },
      {
        q: "Wie wint het meest?",
        a: "Gezinnen die een groot deel van hun verbruik kunnen verschuiven: met een elektrische auto, een warmtepomp met buffer of vloerverwarming, of een thuisbatterij. Gezinnen die vooral 's avonds verbruiken en niets kunnen verschuiven, winnen weinig en lopen het risico dat dure uren hun factuur optrekken.",
      },
      {
        q: "Hoe automatiseer ik mijn verbruik?",
        a: "Met toestellen die prijssignalen kunnen gebruiken: een slimme laadpaal, een hybride omvormer met batterij, of een warmtepomp met sturing, eventueel via een energiebeheersysteem. Je stelt één keer in wat wanneer mag draaien, met een comfortmarge. Daarna werkt het vanzelf, en blijft je maandpiek bewaakt.",
      },
    ],
    sources: ["negatievePrijsUren2025", "evVerbruikPer100km", "kostPer100kmThuisNet", "kostPer100kmZonOverschot", "stroomprijsAllIn", "injectievergoeding", "capaciteitstariefPerKw"],
    relatedArticles: ["wat-is-het-capaciteitstarief", "injectietarief-en-zelfverbruik"],
    relatedServices: ["laadpalen", "thuisbatterij"],
    relatedComparisons: ["vast-vs-dynamisch-energiecontract"],
  },

  // ─────────────────────────── Warmtepompen ───────────────────────────
  {
    slug: "scop-en-cop-uitgelegd",
    category: "warmtepompen",
    title: "COP en SCOP: wat zeggen ze over je warmtepomp?",
    shortTitle: "SCOP en COP uitgelegd",
    seoTitle: "SCOP en COP van een warmtepomp uitgelegd",
    description:
      "COP is het rendement op één moment, SCOP over een heel seizoen. Wat is een goede SCOP in Vlaanderen en waarom bepaalt je aanvoertemperatuur alles?",
    h1: "COP en SCOP: wat zeggen ze over je warmtepomp?",
    author: "pieter-de-smet",
    publishedAt: "2026-01-20",
    updatedAt: "2026-11-01",
    image: "warmtepomp-tuin",
    excerpt: "Het getal dat bepaalt of je warmtepomp goedkoper is dan gas. En waarom de temperatuur van je radiatoren er meer toe doet dan het merk.",
    kortAntwoord: `De COP is het rendement van een warmtepomp op één moment, de SCOP het gemiddelde over een heel stookseizoen. Een SCOP van 3,5 betekent: uit 1 kWh stroom haal je gemiddeld 3,5 kWh warmte. Bij 35 °C aanvoer haalt een lucht-water warmtepomp ${fx("scopLuchtWater35")}, bij 55 °C ${fx("scopLuchtWater55")}. Boven ${fx("breakEvenScop", { bare: true })} is ze per kWh warmte goedkoper dan gas.`,
    body: [
      { type: "h2", text: "Wat is het verschil tussen COP en SCOP?" },
      {
        type: "p",
        text: "De **COP** (coefficient of performance) is een momentopname: hoeveel warmte de warmtepomp levert per kWh stroom, bij één bepaalde buitentemperatuur en aanvoertemperatuur. Fabrikanten meten die vaak bij 7 °C buiten. Dat is een mild moment, dus de COP op de brochure oogt mooi.",
      },
      {
        type: "p",
        text: "De **SCOP** (seasonal COP) is het gemiddelde over een heel stookseizoen, met koude en minder koude dagen. Dat is het getal dat je factuur bepaalt. Vergelijk toestellen dus altijd op SCOP, en dan nog bij de aanvoertemperatuur die jouw woning nodig heeft.",
      },
      { type: "h2", text: "Wat is een goede SCOP in Vlaanderen?" },
      {
        type: "p",
        text: `Bij lage-temperatuurafgifte – vloerverwarming of grote radiatoren op 35 °C – haalt een goede lucht-water warmtepomp een SCOP van ${fx("scopLuchtWater35")}. Bij klassieke radiatoren op 55 °C zakt dat naar ${fx("scopLuchtWater55")}. In onze voorbeeldberekeningen gebruiken we ${fx("scopRekenwaarde")} voor een goed ontworpen installatie op 35 à 45 °C. Een lucht-lucht warmtepomp (airco) haalt bij verwarmen ${fx("scopLuchtLucht")}.`,
      },
      {
        type: "table",
        caption: "Indicatieve SCOP per type afgifte (bron: zie onderaan)",
        columns: ["Afgifte", "Aanvoertemperatuur", "SCOP"],
        rows: [
          ["Vloerverwarming", "ca. 35 °C", fx("scopLuchtWater35")],
          ["Lage-temperatuurradiatoren", "ca. 45 °C", `rond ${fx("scopRekenwaarde", { bare: true })}`],
          ["Klassieke radiatoren", "ca. 55 °C", fx("scopLuchtWater55")],
          ["Lucht-lucht (airco)", "–", fx("scopLuchtLucht")],
        ],
      },
      { type: "h2", text: "Waarom daalt de SCOP met radiatoren?" },
      {
        type: "p",
        text: "Een warmtepomp 'pompt' warmte van buiten naar binnen. Hoe groter het temperatuurverschil tussen buitenlucht en het water in je verwarming, hoe harder de compressor moet werken. Elke graad lagere aanvoertemperatuur verhoogt het rendement. Daarom rekenen we bij elke woning eerst uit welke aanvoertemperatuur echt nodig is, per kamer.",
      },
      {
        type: "p",
        text: "Vaak volstaat het om één of twee te kleine radiatoren te vervangen door grotere of lage-temperatuurradiatoren. Dan kan de hele installatie op 45 °C in plaats van 55 °C draaien. Dat is een kleine ingreep met een groot effect op je SCOP, en dus op je factuur.",
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Wat kost 1 kWh warmte?",
        text: [
          `Met gas kost 1 kWh nuttige warmte ${eur("warmtekostGasPerKwhWarmte", { digits: 3 })} (gasprijs ${fx("gasprijsAllIn", { scale: 100, central: true })} cent, ketelrendement ${fx("rendementGascondensatieketel", { scale: 100, central: true, bare: true })} %). Met een warmtepomp op netstroom en SCOP ${fx("scopRekenwaarde", { bare: true })} kost diezelfde kWh ${eur("warmtekostWarmtepompPerKwhWarmte", { digits: 3 })}.`,
          `Het break-evenpunt ligt bij een SCOP van ${fx("breakEvenScop")}. Let op: bij een heel goedkoop gascontract schuift dat punt op. Daarom rekenen we altijd met jouw contract, niet met een gemiddelde.`,
        ],
        factKeys: ["warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte", "breakEvenScop", "gasprijsAllIn", "rendementGascondensatieketel"],
      },
      midCta(),
      { type: "h2", text: "Hoe meet ik de SCOP in de praktijk?" },
      {
        type: "p",
        text: "De meeste moderne warmtepompen tonen in hun app of op het display hoeveel stroom ze verbruikten en hoeveel warmte ze leverden. Deel je de geleverde warmte door het verbruik over een heel stookseizoen, dan heb je je echte SCOP. Na de eerste winter bekijken we die cijfers samen en stellen we de stooklijn bij waar nodig.",
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Een warmtepomp werkt niet als het vriest.\"",
        text: "Een lucht-water warmtepomp blijft werken bij vorst, maar met een lager rendement. Op de koudste dagen zakt de COP, op milde dagen stijgt ze. Daarom telt de SCOP over het hele seizoen, en dimensioneren we op de warmtevraag van jouw woning op een koude dag.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Moet je woning door slechte isolatie en kleine radiatoren op 55 °C of meer verwarmd worden, en heb je een zeer goedkoop vast gascontract? Dan kan de winst klein zijn. Dan adviseren we eerst te isoleren, of een hybride warmtepomp als tussenstap.",
      },
    ],
    faq: [
      {
        q: "Wat is het verschil tussen COP en SCOP?",
        a: "De COP is het rendement van een warmtepomp op één moment, bij één buiten- en aanvoertemperatuur. De SCOP is het gemiddelde over een heel stookseizoen, met koude en milde dagen. Voor je factuur telt de SCOP. Vergelijk toestellen dus op SCOP bij de aanvoertemperatuur die jouw woning nodig heeft.",
      },
      {
        q: "Wat is een goede SCOP?",
        a: `Bij vloerverwarming op 35 °C haalt een goede lucht-water warmtepomp ${fx("scopLuchtWater35")}, bij radiatoren op 55 °C ${fx("scopLuchtWater55")}. Wij rekenen in voorbeelden met ${fx("scopRekenwaarde")} voor een goed ontworpen installatie. Alles boven ongeveer ${fx("breakEvenScop", { bare: true })} is per kWh warmte goedkoper dan gas bij een gemiddeld contract.`,
      },
      {
        q: "Waarom daalt de SCOP met radiatoren?",
        a: "Klassieke radiatoren hebben vaak water van 55 °C of meer nodig. Hoe groter het verschil tussen buitenlucht en aanvoerwater, hoe harder de compressor werkt en hoe lager het rendement. Door één of twee radiatoren te vergroten, kan de hele installatie vaak op 45 °C draaien, met een merkbaar hogere SCOP.",
      },
      {
        q: "Hoe meet ik de SCOP in de praktijk?",
        a: "De meeste warmtepompen tonen in hun app hoeveel stroom ze verbruikten en hoeveel warmte ze leverden. Deel de geleverde warmte door het verbruik over een volledig stookseizoen en je hebt je echte SCOP. Na de eerste winter bekijken we die cijfers samen en stellen we de stooklijn bij.",
      },
      {
        q: "Vanaf welke SCOP is een warmtepomp goedkoper dan gas?",
        a: `Bij een gemiddeld gascontract en de huidige stroomprijs ligt het break-evenpunt rond een SCOP van ${fx("breakEvenScop", { bare: true })}. Bij een zeer goedkoop gascontract schuift dat op naar ongeveer 3,4. Daarom rekenen we altijd met jouw contract en jouw aanvoertemperatuur, niet met een gemiddelde uit een brochure.`,
      },
    ],
    sources: ["scopLuchtWater35", "scopLuchtWater55", "scopRekenwaarde", "scopLuchtLucht", "breakEvenScop", "warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte", "gasprijsAllIn", "stroomprijsAllIn", "rendementGascondensatieketel"],
    relatedArticles: ["is-mijn-woning-geschikt-voor-een-warmtepomp", "wat-is-een-pvt-paneel"],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
  },
  {
    slug: "is-mijn-woning-geschikt-voor-een-warmtepomp",
    category: "warmtepompen",
    title: "Is jouw woning klaar voor een warmtepomp?",
    shortTitle: "Is mijn woning geschikt?",
    seoTitle: "Is mijn woning geschikt voor een warmtepomp?",
    description:
      "Geen vloerverwarming of een oudere woning? Een warmtepomp kan vaak toch. Zo check je isolatie, radiatoren en aanvoertemperatuur – en wanneer hybride beter is.",
    h1: "Is jouw woning klaar voor een warmtepomp?",
    author: "pieter-de-smet",
    publishedAt: "2026-02-24",
    updatedAt: "2026-11-01",
    image: "jaren70-woning",
    excerpt: "Geen nieuwbouw, geen vloerverwarming? Vaak kan een warmtepomp toch. Met de 55 °C-test weet je in één winterweekend meer.",
    kortAntwoord: `Een warmtepomp werkt ook in veel bestaande woningen, ook zonder vloerverwarming. Wat telt, is de aanvoertemperatuur die je woning op een koude dag nodig heeft. Lukt het met 55 °C of minder, dan is een lucht-water warmtepomp meestal haalbaar. Bij 35 °C haalt ze ${fx("scopLuchtWater35")}, bij 55 °C nog ${fx("scopLuchtWater55")}. Is dat niet haalbaar, dan is eerst isoleren of hybride slimmer.`,
    body: [
      { type: "h2", text: "Moet mijn huis perfect geïsoleerd zijn?" },
      {
        type: "p",
        text: "Nee. Een warmtepomp vraagt geen passiefhuis, wel een woning waarvan het warmteverlies onder controle is. Dakisolatie en dubbel glas zijn de belangrijkste stappen; die zitten in veel woningen van na 1970 al. Ongeïsoleerde spouwmuren of een koude kelder zijn geen dealbreaker, maar ze bepalen wel hoe groot de warmtepomp moet zijn en welke temperatuur je radiatoren nodig hebben.",
      },
      {
        type: "p",
        text: "We maken daarom altijd een warmteverliesberekening per kamer. Dan weten we hoeveel vermogen je woning op een koude dag nodig heeft – niet meer, niet minder. Een te grote warmtepomp slaat vaak aan en af en werkt minder efficiënt.",
      },
      { type: "h2", text: "Werkt het met radiatoren?" },
      {
        type: "p",
        text: `Ja, op voorwaarde dat ze groot genoeg zijn. Radiatoren die bij gas op 70 °C werkten, geven op 45 à 55 °C minder warmte af. In veel woningen volstaat het om één of twee radiatoren in de grootste ruimtes te vervangen door grotere of lage-temperatuurmodellen. De rest kan blijven. Hoe lager de aanvoertemperatuur, hoe hoger het rendement: bij 35 °C ${fx("scopLuchtWater35")}, bij 55 °C ${fx("scopLuchtWater55")}.`,
      },
      { type: "h2", text: "Wat is de 55 °C-test?" },
      {
        type: "p",
        text: "Je kunt zelf een eerste indruk krijgen, op een koude winterdag:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Zet de aanvoertemperatuur van je gasketel op 55 °C (of lager). Je installateur of de handleiding toont je hoe.",
          "Laat de ketel zo een paar koude dagen draaien, met je gewone thermostaatinstellingen.",
          "Blijft het overal comfortabel warm? Dan is je woning in principe geschikt voor een lucht-water warmtepomp.",
          "Worden enkele kamers niet warm genoeg? Noteer welke. Daar zitten vaak de radiatoren die vergroot moeten worden.",
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "Een test, geen berekening",
        text: "De 55 °C-test is een handige eerste check, maar vervangt geen warmteverliesberekening. Wij meten bij het plaatsbezoek de ruimtes op en rekenen per kamer uit wat nodig is.",
      },
      midCta("Laat je woning doorrekenen"),
      { type: "h2", text: "Wanneer is hybride beter?" },
      {
        type: "p",
        text: `Een hybride warmtepomp combineert een kleine warmtepomp met een (bestaande) gasketel. De warmtepomp doet het grootste deel van het jaar het werk; op de koudste dagen springt de ketel bij. Sinds ${year("hybrideVerplichtIER")} is minstens een hybride warmtepomp verplicht bij een ingrijpende energetische renovatie. Hybride is zinvol als je woning nog niet klaar is voor volledig elektrisch, maar je wel al het grootste deel van je gasverbruik wil schrappen.`,
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Een warmtepomp werkt alleen in nieuwbouw met vloerverwarming.\"",
        text: "Een lucht-water warmtepomp werkt ook in bestaande woningen, op voorwaarde dat de aanvoertemperatuur zo laag mogelijk blijft. Vaak volstaan enkele grotere radiatoren en wat dak- of glasisolatie.",
        factKeys: ["scopLuchtWater35", "scopLuchtWater55"],
      },
      { type: "h2", text: "Hoeveel vermogen heb ik nodig?" },
      {
        type: "p",
        text: "Dat hangt af van je warmteverlies, niet van de oppervlakte alleen. Twee woningen van 150 m² kunnen een totaal andere warmtevraag hebben. We rekenen het vermogen uit op de ontwerptemperatuur voor jouw regio en houden rekening met sanitair warm water. Zo vermijd je een te grote, dure warmtepomp die bovendien slechter presteert.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Is je woning zeer slecht geïsoleerd – geen dakisolatie, enkel glas – dan is isoleren eerst de beste investering. Een warmtepomp in zo'n woning moet groot en heet draaien, en levert weinig op. Dat zeggen we dan ook, en we rekenen uit welke isolatiestap het meest oplevert.",
      },
    ],
    faq: [
      {
        q: "Moet mijn huis perfect geïsoleerd zijn?",
        a: "Nee. Een warmtepomp vraagt geen passiefhuis. Dakisolatie en dubbel glas zijn de belangrijkste voorwaarden en zitten in veel woningen van na 1970 al. Wat telt, is dat je woning op een koude dag comfortabel blijft met een aanvoertemperatuur van 55 °C of minder. Dat berekenen we per kamer.",
      },
      {
        q: "Werkt het met radiatoren?",
        a: "Ja, als ze groot genoeg zijn om bij een lagere aanvoertemperatuur genoeg warmte af te geven. Vaak volstaat het om één of twee radiatoren in de grootste ruimtes te vervangen. Hoe lager de aanvoertemperatuur, hoe hoger het rendement van de warmtepomp en hoe lager je factuur.",
      },
      {
        q: "Wat is de 55 °C-test?",
        a: "Je zet op een paar koude winterdagen de aanvoertemperatuur van je gasketel op 55 °C en kijkt of alle kamers comfortabel warm blijven. Lukt dat, dan is je woning in principe geschikt voor een lucht-water warmtepomp. Kamers die koud blijven, wijzen op radiatoren die vergroot moeten worden.",
      },
      {
        q: "Wanneer is hybride beter?",
        a: `Als je woning nog niet klaar is voor volledig elektrisch verwarmen, bijvoorbeeld door beperkte isolatie of kleine radiatoren. De warmtepomp doet dan het meeste werk, de gasketel springt bij op de koudste dagen. Bij een ingrijpende energetische renovatie is minstens hybride sinds ${year("hybrideVerplichtIER")} verplicht.`,
      },
      {
        q: "Hoeveel vermogen heb ik nodig?",
        a: "Dat hangt af van het warmteverlies van je woning, niet alleen van de oppervlakte. We maken een warmteverliesberekening per kamer op de ontwerptemperatuur voor jouw regio, inclusief sanitair warm water. Een te grote warmtepomp is duurder én minder efficiënt, dus we dimensioneren zo nauwkeurig mogelijk.",
      },
    ],
    sources: ["scopLuchtWater35", "scopLuchtWater55", "hybrideVerplichtIER", "premieLuchtWaterCat12", "premieHybrideCat12"],
    relatedArticles: ["scop-en-cop-uitgelegd", "mijn-verbouwpremie-voor-energie"],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt"],
  },

  // ─────────────────────────── Zon & PVT ───────────────────────────
  {
    slug: "wat-is-een-pvt-paneel",
    category: "zon-pvt",
    title: "Het PVT-paneel: stroom en warmte in één",
    shortTitle: "Wat is een PVT-paneel?",
    seoTitle: "Wat is een PVT-paneel en hoe werkt het?",
    description:
      "Een PVT-paneel combineert een zonnepaneel met een warmtewisselaar. Zo werkt het, wat het verschil is met PV en een zonneboiler, en wanneer het zin heeft.",
    h1: "Het PVT-paneel: stroom en warmte in één",
    author: "wouter-van-den-bossche",
    publishedAt: "2026-03-18",
    updatedAt: "2026-11-01",
    image: "pvt-dak-detail",
    excerpt: "Een zonnepaneel dat ook warmte oogst. Hoe het werkt, waarom het een warmtepomp helpt, en waarom we de opbrengst per dak uitrekenen.",
    kortAntwoord:
      "Een PVT-paneel is een zonnepaneel (PV) met een warmtewisselaar aan de achterkant. Het maakt stroom én vangt warmte op, die je gebruikt voor sanitair warm water of als bron voor een warmtepomp. Omdat het paneel zo ook gekoeld wordt, presteert het elektrisch beter op warme dagen. Of het voor jou loont, hangt sterk af van je dak en je warmtevraag.",
    body: [
      { type: "h2", text: "Hoe werkt een PVT-paneel?" },
      {
        type: "p",
        text: "PVT staat voor **photovoltaïsch-thermisch**. Aan de voorkant zit een gewoon zonnepaneel dat stroom maakt. Aan de achterkant loopt een vloeistof door een warmtewisselaar. Die vloeistof neemt de warmte op die het paneel anders gewoon kwijt zou zijn, en voert ze af naar een boiler, een buffervat of de verdamper van een warmtepomp.",
      },
      {
        type: "p",
        text: "Zonnepanelen verliezen rendement als ze heet worden. Door de warmte af te voeren, blijft het paneel koeler en maakt het op zonnige zomerdagen meer stroom dan een gelijkaardig gewoon paneel. Je oogst dus twee keer van hetzelfde dak.",
      },
      { type: "h2", text: "Wat is het verschil met een zonneboiler en gewone zonnepanelen?" },
      {
        type: "table",
        caption: "PV, zonneboiler en PVT naast elkaar",
        columns: ["", "Zonnepanelen (PV)", "Zonneboiler", "PVT-paneel"],
        rows: [
          ["Maakt stroom", "ja", "nee", "ja"],
          ["Maakt warmte", "nee", "ja, op hoge temperatuur", "ja, vooral op lage temperatuur"],
          ["Werkt samen met een warmtepomp", "via de stroom", "beperkt", "ja, als bron én via de stroom"],
          ["Dakruimte", "voor stroom", "voor warmte", "voor beide tegelijk"],
        ],
      },
      {
        type: "p",
        text: "Een zonneboiler maakt water van hoge temperatuur, maar geen stroom. Een PVT-paneel levert warmte op lagere temperatuur, en dat is precies wat een warmtepomp graag heeft: hoe warmer de bron, hoe minder hard de compressor moet werken.",
      },
      { type: "h2", text: "Werkt PVT 's nachts of in de winter?" },
      {
        type: "p",
        text: "Stroom maakt een PVT-paneel alleen bij daglicht, net als een gewoon zonnepaneel. Warmte kan het ook opnemen uit de buitenlucht, zelfs 's nachts of op bewolkte dagen, als een warmtepomp de vloeistof onder de buitentemperatuur afkoelt. Sommige systemen gebruiken PVT-panelen zo als (deel)bron voor de warmtepomp. Dat vraagt wel een goed ontwerp: niet elk paneel en niet elke warmtepomp is daarvoor gemaakt.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Waarom we hier geen opbrengstcijfers geven",
        text: "De opbrengst van PVT hangt sterk af van het type paneel, de dakhelling, de warmtepomp en vooral je warmtevraag. Betrouwbare gemiddelde cijfers voor Vlaanderen bestaan nog niet. Daarom rekenen we PVT altijd per project uit, en zijn we voorzichtig in wat we beloven. VB-TEC doet daar ook eigen onderzoek naar.",
      },
      midCta("Is jouw dak geschikt voor PVT?"),
      { type: "h2", text: "Is PVT efficiënter dan gewone zonnepanelen?" },
      {
        type: "p",
        text: "Per vierkante meter dak oogst een PVT-paneel meer energie in totaal, omdat het stroom én warmte levert. Of dat ook meer euro's oplevert, hangt af van wat je met die warmte doet. Wie veel sanitair warm water verbruikt, of een warmtepomp heeft die de warmte kan benutten, haalt er het meeste uit. Wie geen warmtevraag heeft op het moment dat het paneel warmte levert, betaalt voor een capaciteit die hij niet gebruikt.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Heb je een gasketel die nog jaren meegaat, weinig warmwaterverbruik en geen plannen voor een warmtepomp? Dan zijn gewone zonnepanelen vaak de eenvoudigere en goedkopere keuze. PVT is het sterkst in combinatie met een warmtepomp, en dat zeggen we ook als dat niet bij jou past.",
      },
      { type: "h2", text: "Wat met premies?" },
      {
        type: "p",
        text: `Voor PVT-panelen bestaat in Vlaanderen geen aparte premie meer, net zoals voor zonneboilers (premie: ${eur("premieZonneboiler", { bare: true })}). Wordt het PVT-veld gebruikt als bron voor een warmtepomp, dan kijken we per dossier na welke premievoorwaarden voor de warmtepomp gelden. Voor een lucht-water warmtepomp bedraagt de Mijn VerbouwPremie in 2026 ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")}, afhankelijk van je inkomenscategorie. Lees meer in [Mijn VerbouwPremie voor energie](/kennisbank/mijn-verbouwpremie-voor-energie).`,
      },
    ],
    faq: [
      {
        q: "Hoe werkt een PVT-paneel?",
        a: "Een PVT-paneel is een zonnepaneel met een warmtewisselaar aan de achterkant. De voorkant maakt stroom, de achterkant neemt warmte op via een vloeistof. Die warmte gaat naar een boiler, een buffervat of een warmtepomp. Doordat het paneel gekoeld wordt, blijft het elektrisch rendement op warme dagen hoger.",
      },
      {
        q: "Wat is het verschil met een zonneboiler?",
        a: "Een zonneboiler maakt alleen warm water, op hoge temperatuur, en geen stroom. Een PVT-paneel maakt stroom én warmte, maar die warmte heeft meestal een lagere temperatuur. Dat maakt PVT bijzonder geschikt als bron of voorverwarming voor een warmtepomp, en minder als losse vervanger van een zonneboiler.",
      },
      {
        q: "Werkt PVT 's nachts of in de winter?",
        a: "Stroom maakt het alleen bij daglicht. Warmte kan een PVT-paneel ook opnemen uit de buitenlucht, zelfs 's nachts of bij bewolking, als een warmtepomp de vloeistof afkoelt onder de buitentemperatuur. Dat vraagt een systeem dat daarvoor ontworpen is. Daarom ontwerpen we PVT altijd samen met de warmtepomp.",
      },
      {
        q: "Is PVT efficiënter?",
        a: "Per vierkante meter dak oogst PVT meer energie, omdat het stroom én warmte levert. Of het ook financieel beter is, hangt af van wat je met de warmte doet. Met een warmtepomp of een hoog warmwaterverbruik haal je er het meeste uit. Zonder warmtevraag zijn gewone zonnepanelen vaak de betere keuze.",
      },
      {
        q: "Wat met premies?",
        a: "Voor PVT-panelen bestaat geen aparte Vlaamse premie, net zoals voor zonneboilers. Wordt het PVT-veld gebruikt als bron voor een warmtepomp, dan bekijken we per dossier welke premievoorwaarden voor die warmtepomp gelden. Wij zoeken dat voor je uit en vragen de premie voor je aan.",
      },
    ],
    sources: ["premieZonneboiler", "premieLuchtWaterCat12", "premieLuchtWaterCat4", "scopLuchtWater35"],
    relatedArticles: ["scop-en-cop-uitgelegd", "injectietarief-en-zelfverbruik"],
    relatedServices: ["pvt-panelen", "lucht-water-warmtepomp"],
    relatedComparisons: ["zonnepanelen-vs-pvt-panelen"],
    relatedProjects: ["gezinswoning-gent-warmtepomp-pvt"],
  },

  // ─────────────────────────── Opslag & laden ───────────────────────────
  {
    slug: "hoe-groot-moet-een-thuisbatterij-zijn",
    category: "opslag-laden",
    title: "De juiste batterijgrootte voor jouw verbruik",
    shortTitle: "Hoe groot moet een thuisbatterij zijn?",
    seoTitle: "Hoe groot moet een thuisbatterij zijn?",
    description:
      "Te groot is weggegooid geld, te klein levert weinig op. Zo bereken je welke capaciteit (kWh) en welk vermogen (kW) bij jouw verbruik en panelen past.",
    h1: "De juiste batterijgrootte voor jouw verbruik",
    author: "lotte-claes",
    publishedAt: "2026-05-06",
    updatedAt: "2026-11-01",
    image: "thuisbatterij-berging",
    excerpt: "Groter is niet beter. Een batterij moet passen bij wat je panelen overdag overhouden en wat je 's avonds verbruikt.",
    kortAntwoord: `Een thuisbatterij is goed gedimensioneerd als ze op een gewone dag vol raakt met je zonne-overschot en 's avonds en 's nachts leeg raakt door je eigen verbruik. Voor de meeste gezinnen met 4 à 8 kWp panelen komt dat neer op 5 à 10 kWh. Elke kWh kost ${eur("prijsThuisbatterijPerKwh")}, dus te groot is weggegooid geld.`,
    body: [
      { type: "h2", text: "Hoeveel kWh heb ik nodig?" },
      {
        type: "p",
        text: "Kijk naar twee dingen: hoeveel stroom je panelen op een gemiddelde dag **over** hebben, en hoeveel je tussen zonsondergang en zonsopgang **verbruikt**. De kleinste van die twee is ongeveer de nuttige grootte van je batterij. Een batterij die nooit vol raakt, of die 's ochtends nog halfvol is, heb je te groot gekocht.",
      },
      {
        type: "list",
        items: [
          "Je **kwartierwaarden** uit Mijn Fluvius tonen wanneer je injecteert en wanneer je afneemt. Dat is de beste basis.",
          "Kijk niet naar een zonnige junidag, maar naar een gewone lente- of herfstdag. In de winter vult je batterij zich zelden volledig met zonnestroom.",
          "Komt er een warmtepomp of elektrische auto bij? Reken die mee, want ze veranderen je avondverbruik én je overschot.",
        ],
      },
      { type: "h2", text: "Wat is het verschil tussen kWh en kW?" },
      {
        type: "p",
        text: "**kWh** is de capaciteit: hoeveel energie de batterij kan opslaan. **kW** is het vermogen: hoe snel ze kan laden en ontladen. Een batterij van 10 kWh met 3 kW vermogen kan niet tegelijk je oven, kookplaat en droogkast voeden; een deel komt dan nog van het net. Wil je met je batterij ook je [maandpiek voor het capaciteitstarief](/kennisbank/wat-is-het-capaciteitstarief) verlagen, dan telt het vermogen even zwaar als de capaciteit.",
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Twee gezinnen, twee batterijen",
        text: [
          `Gezin A heeft 4 kWp panelen, verbruikt 2.800 kWh per jaar en is overdag niet thuis. Op een gewone dag houdt het een paar kWh over, en verbruikt het 's avonds weinig. Een batterij van 5 kWh raakt zelden vol. Bij ${eur("prijsThuisbatterijPerKwh")} per kWh is de terugverdientijd lang. Zie ons [voorbeeldproject in Kortrijk](/projecten/gezin-kortrijk-geen-batterij-advies).`,
          "Gezin B heeft 8 kWp, een warmtepomp en een elektrische wagen. Het houdt overdag veel over en verbruikt 's avonds veel. Hier raakt een batterij van 10 kWh elke dag vol en weer leeg, en verlaagt ze ook de maandpiek. Zie ons [voorbeeldproject in Leuven](/projecten/nieuwbouw-leuven-all-electric).",
        ],
        factKeys: ["prijsThuisbatterijPerKwh"],
      },
      midCta("Welke batterijgrootte past bij jou?"),
      { type: "h2", text: "Hangt het af van mijn zonnepanelen?" },
      {
        type: "p",
        text: `Ja. Een batterij verdient vooral door zonnestroom te verschuiven: een kWh die je anders aan ${fx("injectievergoeding")} cent zou injecteren, gebruik je 's avonds in plaats van stroom aan ${fx("stroomprijsAllIn", { scale: 100 })} cent te kopen. Hoe meer overschot je panelen hebben, hoe meer je batterij kan verschuiven. Zonder panelen kan een batterij alleen verdienen met een dynamisch contract of door pieken af te vlakken.`,
      },
      { type: "h2", text: "Kan ik later uitbreiden?" },
      {
        type: "p",
        text: "Vaak wel, als je vooraf het juiste systeem kiest: een hybride omvormer die een batterij aankan, en een batterijsysteem met modules die je later kunt bijplaatsen. Omdat batterijprijzen dalen, adviseren we soms bewust om klein te beginnen of de batterij uit te stellen, met een omvormer die er al klaar voor is.",
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Een thuisbatterij verdien je nooit terug.\"",
        text: "Dat hangt volledig af van je profiel. Een batterij wint op drie fronten: meer zelfverbruik, een lagere maandpiek en – met een dynamisch contract – laden op goedkope uren. Zonder die combinatie loont ze vaak niet, en dan zeggen we dat.",
        factKeys: ["capaciteitstariefPerKw", "negatievePrijsUren2025"],
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Kleine zonne-installatie, laag verbruik, overdag niemand thuis, vast contract en geen piekverbruikers? Dan is een batterij vandaag meestal niet rendabel. Een batterij-klare omvormer en slim verschuiven leveren je dan meer op per euro.",
      },
      { type: "h2", text: "Wat kost elke extra kWh?" },
      {
        type: "p",
        text: `Geïnstalleerd kost een thuisbatterij ${eur("prijsThuisbatterijPerKwh")} per kWh capaciteit, afhankelijk van merk, omvormer en installatie. Er is in Vlaanderen geen premie meer voor thuisbatterijen. In een woning ouder dan tien jaar geldt ${fx("btwZonnepanelenBatterij", { bare: true })} % btw. Elke extra kWh moet zichzelf dus terugverdienen: als ze maar een paar keer per jaar volloopt, doet ze dat niet.`,
      },
    ],
    faq: [
      {
        q: "Hoeveel kWh heb ik nodig?",
        a: "Ongeveer zoveel als het kleinste van twee getallen: wat je panelen op een gewone dag overhouden, en wat je tussen zonsondergang en zonsopgang verbruikt. Voor veel gezinnen met 4 à 8 kWp panelen ligt dat tussen 5 en 10 kWh. Je kwartierwaarden uit Mijn Fluvius geven het nauwkeurigste antwoord.",
      },
      {
        q: "Wat is het verschil tussen kWh en kW?",
        a: "kWh is de opslagcapaciteit: hoeveel energie de batterij bevat. kW is het vermogen: hoe snel ze kan laden en ontladen. Voor het verschuiven van zonnestroom telt vooral de capaciteit. Wil je ook je maandpiek voor het capaciteitstarief verlagen, dan moet het vermogen groot genoeg zijn.",
      },
      {
        q: "Hangt het af van mijn zonnepanelen?",
        a: "Ja. Een batterij verdient vooral door zonnestroom die je anders goedkoop injecteert, 's avonds zelf te gebruiken. Hoe meer overschot je panelen hebben, hoe meer de batterij kan verschuiven. Zonder panelen kan ze enkel verdienen met een dynamisch contract of door pieken af te vlakken, en dat loont minder vaak.",
      },
      {
        q: "Kan ik later uitbreiden?",
        a: "Meestal wel, als je kiest voor een hybride omvormer die een batterij aankan en een modulair batterijsysteem. Omdat batterijprijzen dalen, adviseren we soms om klein te beginnen of de batterij uit te stellen. De omvormer staat dan al klaar, zodat bijplaatsen later eenvoudig en goedkoper is.",
      },
      {
        q: "Wat kost elke extra kWh?",
        a: `Geïnstalleerd kost een thuisbatterij ${eur("prijsThuisbatterijPerKwh")} per kWh, afhankelijk van merk en omvormer. Er is geen Vlaamse premie meer voor thuisbatterijen. Elke extra kWh moet zichzelf terugverdienen door regelmatig vol en leeg te lopen. Een kWh die zelden gebruikt wordt, kost meer dan ze oplevert.`,
      },
    ],
    sources: ["prijsThuisbatterijPerKwh", "injectievergoeding", "stroomprijsAllIn", "capaciteitstariefPerKw", "negatievePrijsUren2025", "btwZonnepanelenBatterij"],
    relatedArticles: ["injectietarief-en-zelfverbruik", "wat-is-het-capaciteitstarief"],
    relatedServices: ["thuisbatterij", "omvormers"],
    relatedComparisons: ["met-of-zonder-thuisbatterij"],
    relatedProjects: ["gezin-kortrijk-geen-batterij-advies"],
  },

  // ─────────────────────────── Premies & regelgeving ───────────────────────────
  {
    slug: "mijn-verbouwpremie-voor-energie",
    category: "premies-regels",
    title: "Mijn VerbouwPremie voor energie in 2026",
    shortTitle: "Mijn VerbouwPremie voor energie",
    seoTitle: "Mijn VerbouwPremie 2026: welke premies krijg je nog?",
    description:
      "Welke premie krijg je in 2026 voor een warmtepomp, airco of warmtepompboiler, en wat verdween? Bedragen per inkomenscategorie en zo vraag je ze aan.",
    h1: "Mijn VerbouwPremie voor energie in 2026",
    author: "nathalie-janssens",
    publishedAt: "2026-03-02",
    updatedAt: "2026-11-01",
    image: "gezin-keuken-factuur",
    excerpt: "Minder premies dan vroeger, maar zeker niet nul. Wat je in 2026 nog krijgt voor je warmtepomp, en wat helemaal verdween.",
    kortAntwoord: `Voor een lucht-water warmtepomp krijg je in 2026 nog ${eur("premieLuchtWaterCat12")} (inkomenscategorie 1–2) tot ${eur("premieLuchtWaterCat4")} (categorie 4) Mijn VerbouwPremie, plus ${fx("btwWarmtepomp", { bare: true })} % btw. Voor een lucht-lucht warmtepomp en een warmtepompboiler zijn er kleinere premies. Voor zonnepanelen, thuisbatterijen en zonneboilers is er geen premie meer.`,
    body: [
      { type: "h2", text: "Hoeveel premie krijg ik voor een warmtepomp?" },
      {
        type: "p",
        text: "Het bedrag hangt af van het type warmtepomp en van je **inkomenscategorie**. Sinds 1 maart 2026 kunnen gezinnen in categorie 1 en 2 – de hogere inkomens – enkel nog een premie krijgen voor een warmtepomp of een warmtepompboiler. Voor categorie 3 en 4 liggen de bedragen een stuk hoger.",
      },
      {
        type: "table",
        caption: "Mijn VerbouwPremie 2026 voor warmtepompen (indicatief, zie bronnen)",
        columns: ["Toestel", "Categorie 1–2", "Categorie 3", "Categorie 4"],
        rows: [
          ["Lucht-water warmtepomp", eur("premieLuchtWaterCat12"), eur("premieLuchtWaterCat3"), eur("premieLuchtWaterCat4")],
          ["Hybride warmtepomp", eur("premieHybrideCat12"), "€ 3.000", "€ 4.000"],
          ["Lucht-lucht warmtepomp (airco)", eur("premieLuchtLuchtCat12"), "€ 450", "€ 600"],
          ["Bodem-water warmtepomp", eur("premieBodemWaterCat12"), "€ 6.000", "€ 8.000"],
          ["Warmtepompboiler", eur("premieWarmtepompboilerCat12"), "–", "–"],
        ],
      },
      {
        type: "p",
        text: "De premie is altijd begrensd tot een percentage van je factuur, en de installatie moet uitgevoerd of gevalideerd zijn door een installateur met een RESCert-certificaat. Voor een lucht-lucht warmtepomp met actieve koeling gelden sinds maart 2026 strengere voorwaarden: het toestel moet de enige centrale verwarming zijn.",
      },
      { type: "h2", text: "Welke inkomenscategorie heb ik?" },
      {
        type: "p",
        text: "Je inkomenscategorie hangt af van het belastbaar inkomen van je gezin en je gezinssituatie. Categorie 4 is de laagste inkomensgroep, categorie 1 de hoogste. Op de website van Mijn VerbouwPremie kun je met je eID nagaan in welke categorie je valt. Wij helpen je daarbij tijdens het premiedossier.",
      },
      { type: "h2", text: "Is er nog premie voor zonnepanelen of een batterij?" },
      {
        type: "p",
        text: "Nee. Voor zonnepanelen, thuisbatterijen en zonneboilers bestaat in Vlaanderen geen premie meer; de zonneboilerpremie verdween in juli 2025. Het rendement van die investeringen moet uit zelfverbruik komen. Wat wel blijft: in een woning ouder dan tien jaar betaal je voor zonnepanelen en batterij het verlaagde btw-tarief.",
      },
      {
        type: "callout",
        kind: "mythe",
        title: "\"Er zijn toch geen premies meer, dus het heeft geen zin.\"",
        text: `De premies zijn kleiner geworden, maar niet weg. Een lucht-water warmtepomp krijgt in 2026 ${eur("premieLuchtWaterCat12")} tot ${eur("premieLuchtWaterCat4")} en geniet ${fx("btwWarmtepomp", { bare: true })} % btw. Een nieuwe gasketel betaalt sinds juli 2025 ${fx("btwGasketel", { bare: true })} % btw. Dat verschil alleen is al een premie op zich.`,
        factKeys: ["premieLuchtWaterCat12", "premieLuchtWaterCat4", "btwWarmtepomp", "btwGasketel"],
      },
      midCta("Laat je premies mee uitrekenen"),
      { type: "h2", text: "Hoe vraag ik ze aan, en wanneer?" },
      {
        type: "list",
        ordered: true,
        items: [
          "Laat de installatie uitvoeren door een installateur met RESCert-certificaat.",
          "Wacht op de eindfactuur: de premie vraag je pas aan nadat de werken gefactureerd zijn.",
          "Dien je aanvraag in via het loket van Mijn VerbouwPremie, binnen de termijn die na de eindfactuur geldt.",
          "Voeg de factuur en de gevraagde technische gegevens toe (vermogen, SCOP, certificaat installateur).",
          "Na goedkeuring wordt de premie op je rekening gestort.",
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "Wij doen het papierwerk",
        text: "Bij elke installatie zoeken we uit op welke premies je recht hebt en dienen we het dossier voor je in. Je krijgt vooraf een berekening waarin de premie al verrekend is, met de voorwaarden erbij.",
      },
      { type: "h2", text: "Wat is RESCert?" },
      {
        type: "p",
        text: "RESCert is het certificeringssysteem voor installateurs van hernieuwbare energie. Voor de Mijn VerbouwPremie op een warmtepomp moet de installateur gecertificeerd zijn, of moet de installatie gevalideerd worden door een gecertificeerde installateur. Sinds 1 januari 2026 is een RESCert-certificaat ook verplicht voor nieuwe zonne-installaties tot 5 kWp.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Koop je een warmtepomp alleen voor de premie? Dan is dat geen goed idee. Bij de hogere inkomens dekt de premie maar een klein deel van de investering. De echte winst zit in een lagere factuur, en die rekenen we eerst uit. Premiebedragen veranderen bovendien regelmatig: check altijd de datum.",
      },
    ],
    faq: [
      {
        q: "Hoeveel premie voor een warmtepomp?",
        a: `Voor een lucht-water warmtepomp krijg je in 2026 ${eur("premieLuchtWaterCat12")} in inkomenscategorie 1–2, ${eur("premieLuchtWaterCat3")} in categorie 3 en ${eur("premieLuchtWaterCat4")} in categorie 4, telkens begrensd tot een deel van de factuur. Daarbovenop geldt ${fx("btwWarmtepomp", { bare: true })} % btw. Hybride, lucht-lucht en bodem-water warmtepompen hebben eigen bedragen.`,
      },
      {
        q: "Welke inkomenscategorie heb ik?",
        a: "Dat hangt af van het belastbaar inkomen van je gezin en je gezinssituatie. Categorie 4 is de laagste inkomensgroep en krijgt de hoogste premies, categorie 1 de hoogste inkomensgroep. Via de website van Mijn VerbouwPremie zie je met je eID in welke categorie je valt. Wij helpen je daarmee.",
      },
      {
        q: "Is er nog premie voor zonnepanelen of batterij?",
        a: "Nee. Voor zonnepanelen, thuisbatterijen en zonneboilers bestaat in Vlaanderen geen premie meer. Het rendement moet uit zelfverbruik komen, en dat rekenen we voor je uit. In een woning ouder dan tien jaar geldt wel het verlaagde btw-tarief op zonnepanelen en thuisbatterijen.",
      },
      {
        q: "Hoe vraag ik ze aan en wanneer?",
        a: "Je vraagt de premie aan na de eindfactuur, via het loket van Mijn VerbouwPremie, met de factuur en de technische gegevens van het toestel. De installateur moet RESCert-gecertificeerd zijn. Bij VB-TEC dienen we het dossier voor je in en volgen we het op tot de premie op je rekening staat.",
      },
      {
        q: "Wat is RESCert?",
        a: "RESCert is het Belgische certificeringssysteem voor installateurs van hernieuwbare energie, zoals warmtepompen en zonnepanelen. Voor de premie op een warmtepomp moet de installatie uitgevoerd of gevalideerd zijn door een RESCert-installateur. Sinds 2026 is het certificaat ook verplicht voor nieuwe zonne-installaties tot 5 kWp.",
      },
    ],
    sources: ["premieLuchtWaterCat12", "premieLuchtWaterCat3", "premieLuchtWaterCat4", "premieHybrideCat12", "premieLuchtLuchtCat12", "premieBodemWaterCat12", "premieWarmtepompboilerCat12", "premieZonneboiler", "btwWarmtepomp", "btwGasketel", "btwZonnepanelenBatterij", "prijsZonnepanelenPerKwp"],
    relatedArticles: ["epc-en-renovatieverplichting", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
    relatedServices: ["lucht-water-warmtepomp", "lucht-lucht-warmtepomp"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
  },
  {
    slug: "epc-en-renovatieverplichting",
    category: "premies-regels",
    title: "Een woning gekocht met slecht EPC-label: wat nu?",
    shortTitle: "EPC en renovatieverplichting",
    seoTitle: "Renovatieverplichting en EPC: wat moet je doen?",
    description:
      "Kocht je een woning met EPC-label E of F? Dan moet je binnen 6 jaar label D halen. Zo pak je het slim aan, met de grootste winst per euro.",
    h1: "Een woning gekocht met slecht EPC-label: wat nu?",
    author: "wouter-van-den-bossche",
    publishedAt: "2026-06-10",
    updatedAt: "2026-11-01",
    image: "jaren70-woning",
    excerpt: "Label E of F gekocht? Dan heb je een deadline. Zo haal je label D met de ingrepen die ook je factuur het meest verlagen.",
    kortAntwoord: `Koop je in Vlaanderen een woning met EPC-label E of F, dan moet je volgens de regels van eind 2025 binnen ${fx("renovatieplichtTermijn", { bare: true })} jaar na aankoop minstens label D halen. Check de regels die gelden op jouw aankoopdatum. Slim aangepakt combineer je die verplichting met een lagere energiefactuur: eerst isoleren waar het meest verloren gaat, dan verwarmen met een warmtepomp.`,
    body: [
      { type: "h2", text: "Wat houdt de renovatieverplichting in?" },
      {
        type: "p",
        text: "Wie een woning koopt met een slecht EPC-label – E of F – moet die binnen een bepaalde termijn renoveren tot minstens label D. Dat geldt voor de koper, vanaf de datum van de notariële akte. De verplichting werd eind 2025 versoepeld: de termijn werd verlengd en het geplande verstrengingspad naar label C vanaf 2028 werd geschrapt.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Check je aankoopdatum",
        text: `De regels zijn de voorbije jaren meermaals aangepast. Wat hier staat, volgt de regels van eind 2025: ${fx("renovatieplichtTermijn", { bare: true })} jaar om label D te halen. Welke regels voor jou gelden, hangt af van de datum van je aankoopakte. Kijk dat na bij het Vlaams Energie- en Klimaatagentschap of je notaris.`,
        factKeys: ["renovatieplichtTermijn"],
      },
      { type: "h2", text: "Hoeveel tijd heb ik?" },
      {
        type: "p",
        text: `Volgens de regels van eind 2025 heb je ${fx("renovatieplichtTermijn", { bare: true })} jaar vanaf de aankoop. Dat lijkt lang, maar renovatiewerken vragen planning: offertes, premies, vergunningen en aannemers met een volle agenda. Wie in het eerste jaar een plan maakt, kan de werken spreiden en de premies optimaal benutten.`,
      },
      { type: "h2", text: "Telt een warmtepomp mee voor het EPC?" },
      {
        type: "p",
        text: "Ja. Het EPC-label wordt berekend op het energieverbruik van je woning, en de verwarmingsinstallatie speelt daarin een grote rol. Een warmtepomp verlaagt het berekende primaire energieverbruik sterk ten opzichte van een oude gas- of stookolieketel. Zonnepanelen tellen ook mee. Maar isolatie blijft de basis: zonder isolatie moet een warmtepomp onnodig groot en heet draaien.",
      },
      { type: "h2", text: "Wat is de slimste volgorde?" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Dak isoleren.** Daar gaat in een oude woning het meeste warmte verloren, en het is vaak de goedkoopste winst per euro.",
          "**Ramen en buitenschil** waar het verlies groot is. Niet alles hoeft tegelijk.",
          "**Afgiftesysteem aanpassen.** Grotere of lage-temperatuurradiatoren, of vloerverwarming waar je toch breekt.",
          "**Warmtepomp plaatsen,** gedimensioneerd op de gerenoveerde woning, niet op de oude.",
          "**Zonnepanelen** om een groot deel van de stroom voor die warmtepomp zelf op te wekken.",
        ],
      },
      {
        type: "callout",
        kind: "rekenvoorbeeld",
        title: "Waarom de volgorde telt",
        text: [
          `Wie eerst een warmtepomp plaatst en pas daarna isoleert, heeft na de isolatie een te groot toestel. Wie eerst isoleert, heeft een kleinere warmtepomp nodig die op lagere temperatuur draait. Bij 35 °C haalt een lucht-water warmtepomp ${fx("scopLuchtWater35")}, bij 55 °C ${fx("scopLuchtWater55")}.`,
          `Bovendien betaal je voor een warmtepomp ${fx("btwWarmtepomp", { bare: true })} % btw en kun je, afhankelijk van je inkomen, tot ${eur("premieLuchtWaterCat4")} premie krijgen. Een nieuwe gasketel kost ${fx("btwGasketel", { bare: true })} % btw en zet je voor jaren vast aan gas.`,
        ],
        factKeys: ["scopLuchtWater35", "scopLuchtWater55", "btwWarmtepomp", "btwGasketel", "premieLuchtWaterCat4"],
      },
      midCta("Maak een renovatieplan met cijfers"),
      { type: "h2", text: "Wat als ik het niet haal?" },
      {
        type: "p",
        text: "Haal je label D niet binnen de termijn, dan riskeer je een administratieve boete. Belangrijker: wie de verplichting slim aanpakt, wint er zelf het meest bij. Een woning met label D of beter verbruikt minder, is comfortabeler en is bij verkoop meer waard. De verplichting is dus ook een kans om je factuur structureel te verlagen.",
      },
      {
        type: "callout",
        kind: "eerlijk",
        title: "Wanneer dit voor jou níet interessant is",
        text: "Plan je een grondige verbouwing met nieuwe buitenschil en vloeren? Plaats dan nu nog geen warmtepomp. Die dimensioneren we beter op de gerenoveerde woning. In de tussentijd kan een tijdelijke oplossing of je bestaande ketel volstaan. Dat zeggen we je eerlijk, ook als het betekent dat we nu niets plaatsen.",
      },
    ],
    faq: [
      {
        q: "Wat houdt de renovatieverplichting in?",
        a: `Wie in Vlaanderen een woning koopt met EPC-label E of F, moet die binnen een bepaalde termijn renoveren tot minstens label D. Volgens de regels van eind 2025 is dat ${fx("renovatieplichtTermijn", { bare: true })} jaar na de aankoop. De regels werden meermaals aangepast, dus check welke gelden op de datum van jouw aankoopakte.`,
      },
      {
        q: "Hoeveel tijd heb ik?",
        a: `Volgens de regels van eind 2025 ${fx("renovatieplichtTermijn", { bare: true })} jaar vanaf de notariële akte. Dat lijkt ruim, maar offertes, premies, vergunningen en volle agenda's van aannemers maken een renovatie traag. Wie in het eerste jaar een plan met cijfers maakt, kan de werken spreiden en de premies het best benutten.`,
      },
      {
        q: "Telt een warmtepomp mee voor het EPC?",
        a: "Ja. Het EPC houdt rekening met je verwarmingsinstallatie, en een warmtepomp verlaagt het berekende energieverbruik sterk ten opzichte van een oude gas- of stookolieketel. Zonnepanelen tellen ook mee. Toch blijft isolatie de basis, omdat een warmtepomp in een slecht geïsoleerde woning groot en duur moet zijn.",
      },
      {
        q: "Wat als ik het niet haal?",
        a: "Dan riskeer je een administratieve boete. Maar de grootste reden om het goed te doen, is je eigen factuur: een woning met label D of beter verbruikt minder, is comfortabeler en is meer waard bij verkoop. Een goed plan maakt van de verplichting een investering die zichzelf deels terugbetaalt.",
      },
      {
        q: "Wat is de slimste volgorde?",
        a: "Eerst het dak isoleren, dan de buitenschil waar het verlies groot is, dan het afgiftesysteem aanpassen, en pas daarna een warmtepomp plaatsen die op de gerenoveerde woning is afgestemd. Zonnepanelen sluiten het af. Zo voorkom je een te grote warmtepomp en haal je het meeste uit elke euro.",
      },
    ],
    sources: ["renovatieplichtTermijn", "scopLuchtWater35", "scopLuchtWater55", "btwWarmtepomp", "btwGasketel", "premieLuchtWaterCat4", "hybrideVerplichtIER"],
    relatedArticles: ["mijn-verbouwpremie-voor-energie", "is-mijn-woning-geschikt-voor-een-warmtepomp"],
    relatedServices: ["lucht-water-warmtepomp", "zonnepanelen"],
    relatedComparisons: ["gasketel-vs-warmtepomp"],
  },
];

// Keep registry order (single source of truth for slugs).
export const allArticles: Article[] = ARTICLES.map((r) => articles.find((a) => a.slug === r.slug)).filter((a): a is Article => Boolean(a));

export function getArticle(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: KennisbankCategory): Article[] {
  return allArticles.filter((a) => a.category === category);
}

export function articlesBySlugs(slugs: readonly ArticleSlug[] | undefined): Article[] {
  return (slugs ?? []).map((s) => getArticle(s)).filter((a): a is Article => Boolean(a));
}

/** Latest asOf among all facts cited in the kennisbank ("Laatst gecontroleerd"). */
export const kennisbankCheckedAt = "2026-11-01";
