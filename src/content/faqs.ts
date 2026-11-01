// PLACEHOLDER – vervang door echte gegevens (werkgebied, reactietermijn en voorwaarden bevestigen met klant)
// Generic FAQs reused across pages (00 §4). `a` = 40–60 words, answer-first (02 §0.3);
// it is used verbatim in FAQPage JSON-LD. Pick with getFaqs(["berekening-kost", …]).

import type { FaqItem } from "./types";
import { site } from "./site";

export const GENERAL_FAQS = {
  "berekening-kost": {
    q: "Wat kost een berekening bij VB-TEC?",
    a: "Niets. De berekening is gratis en vrijblijvend. Een ingenieur bekijkt je verbruik, je woning en je dak, en rekent de scenario's uit die bij jou passen – ook het scenario 'niets doen'. Pas als je zelf beslist om verder te gaan, maken we een offerte op.",
    aLong:
      "We vragen geen voorschot voor een berekening en je zit nergens aan vast. Je krijgt de cijfers zwart op wit, met de aannames erbij, zodat je ze ook kan vergelijken met andere voorstellen.",
  },
  "altijd-iets-verkopen": {
    q: "Verkopen jullie altijd een product?",
    a: "Nee. We rekenen eerst, en als een toestel bij jou niet loont, zeggen we dat. In elke berekening zit een scenario 'niets doen', zodat je ziet wat wachten je kost. Soms is ons advies: eerst isoleren, of later pas een batterij.",
  },
  regio: {
    q: "In welke regio werken jullie?",
    a: `We werken in ${site.areaServed}, met eigen installatieploegen. Woon je net over de taalgrens of in Brussel? Vraag dan gerust je berekening aan: we bellen je eerst om te bekijken of we je goed kunnen helpen voor we iets plannen.`,
  },
  gegevens: {
    q: "Wat doen jullie met mijn gegevens?",
    a: "We gebruiken je gegevens alleen om je berekening te maken en je daarover te contacteren. We delen ze met niemand en je krijgt geen nieuwsbrief tenzij je daar zelf om vraagt. In onze privacyverklaring lees je precies welke gegevens we bewaren en hoe lang.",
  },
  vastzitten: {
    q: "Zit ik ergens aan vast als ik een berekening aanvraag?",
    a: "Nee. Een berekening aanvragen verplicht je tot niets. Je krijgt een helder voorstel met cijfers, premies en terugverdientijd, en jij beslist of en wanneer je verder gaat. Je hoeft niets te betalen voor je akkoord gaat met een offerte.",
  },
  reactietijd: {
    q: "Hoe snel hoor ik iets na mijn aanvraag?",
    a: `Een van onze ingenieurs bekijkt je aanvraag en belt je binnen ${site.responseTime}. Hij of zij checkt kort een paar details, zoals je dak, je meter en je verbruik. Daarna rekenen we je scenario's uit en krijg je een voorstel dat je rustig kan bekijken.`,
  },
  "jaarafrekening-nodig": {
    q: "Wat heb ik nodig voor een goede berekening?",
    a: "Je laatste jaarafrekening is het belangrijkste. Heb je een digitale meter, dan helpen je verbruiksgegevens uit Mijn Fluvius ons om nog nauwkeuriger te rekenen. Weet je je verbruik niet? Geen probleem: we zoeken het samen uit tijdens het eerste telefoontje.",
  },
} as const satisfies Record<string, FaqItem>;

export type GeneralFaqKey = keyof typeof GENERAL_FAQS;

export function getFaqs(keys: GeneralFaqKey[]): FaqItem[] {
  return keys.map((k) => GENERAL_FAQS[k]);
}
