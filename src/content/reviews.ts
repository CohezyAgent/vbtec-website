// PLACEHOLDER – vervang door echte gegevens
// Voorbeeldreviews: verzonnen, niet van echte klanten. Zolang `isPlaceholder` true is:
// geen score, geen platformnaam, geen Review/AggregateRating-schema (00 §2.8–2.9),
// en de UI toont het label "Voorbeeldreviews".

import type { Review } from "./types";
import type { ServiceSlug } from "./registry";

export const isPlaceholder = true;
export const PLACEHOLDER_LABEL = "Voorbeeldreviews";

/** Only filled in once reviews are real and first-party (then shown in ReviewWall summary). */
export const reviewSummary: { score: string; count: string; source: string } | null = null;

export const reviews: Review[] = [
  {
    id: "r01",
    name: "Sarah V.",
    place: "Gent",
    homeType: "Jaren '70-woning",
    products: ["lucht-water-warmtepomp", "pvt-panelen"],
    text: "We dachten dat ons huis te oud was voor een warmtepomp. De ingenieur rekende per kamer uit wat er nodig was: twee radiatoren vervangen en klaar. Geen verkooppraat, gewoon cijfers.",
    date: "2026-03",
    project: "gezinswoning-gent-warmtepomp-pvt",
  },
  {
    id: "r02",
    name: "Pieter D.",
    place: "Kortrijk",
    homeType: "Halfopen woning",
    products: ["zonnepanelen"],
    text: "Ik wilde een batterij, maar ze rekenden voor dat die bij ons niet zou opbrengen. Ze hadden gelijk. Dat ze me iets afraadden, is precies waarom ik ze vertrouw.",
    date: "2026-02",
    project: "gezin-kortrijk-geen-batterij-advies",
  },
  {
    id: "r03",
    name: "An L.",
    place: "Antwerpen",
    homeType: "Rijwoning",
    products: ["zonnepanelen", "thuisbatterij", "omvormers"],
    text: "Klein dak, digitale meter, veel avondverbruik. We kregen drie scenario's naast elkaar, ook eentje met 'niets doen'. Zo kon ik zelf kiezen.",
    date: "2026-05",
    project: "rijwoning-antwerpen-zon-batterij",
  },
  {
    id: "r04",
    name: "Koen & Els",
    place: "Leuven",
    homeType: "Nieuwbouw",
    products: ["lucht-water-warmtepomp", "zonnepanelen", "thuisbatterij", "laadpalen"],
    text: "Voor onze nieuwbouw wilden we alles in één keer goed doen. Eén aanspreekpunt dat alles op elkaar afstemt, van warmtepomp tot laadpaal. Heel duidelijk uitgelegd.",
    date: "2026-01",
    project: "nieuwbouw-leuven-all-electric",
  },
  {
    id: "r05",
    name: "Marc B.",
    place: "Brugge",
    homeType: "Fermette",
    products: ["lucht-lucht-warmtepomp", "zonnepanelen"],
    text: "De stookolieketel draait nu bijna niet meer. De airco verwarmt de leefruimte en in de zomer koelt hij. Ze zeiden eerlijk dat een volledige lucht-water bij ons nog niet nodig was.",
    date: "2026-04",
    project: "fermette-brugge-airco-zonnepanelen",
  },
  {
    id: "r06",
    name: "Lotte & Bram",
    place: "Hasselt",
    homeType: "Halfopen woning",
    products: ["laadpalen", "thuisbatterij"],
    text: "We waren bang dat onze elektrische auto het capaciteitstarief zou opblazen. Nu laadt hij slim, vooral als het goedkoop is. Ze hebben ons ook geholpen met het dynamisch contract.",
    date: "2026-06",
    project: "koppel-hasselt-laadpaal-dynamisch",
  },
  {
    id: "r07",
    name: "Hilde M.",
    place: "Aalst",
    homeType: "Open bebouwing",
    products: ["zonnepanelen", "omvormers"],
    text: "Mijn omvormer gaf om de haverklap een foutcode. Ze kwamen meten, legden uit waarom een hybride omvormer later een batterij mogelijk maakt, en lieten de keuze aan mij.",
    date: "2026-05",
  },
  {
    id: "r08",
    name: "Dries V.",
    place: "Mechelen",
    homeType: "Rijwoning",
    products: ["lucht-lucht-warmtepomp"],
    text: "Snelle, nette plaatsing. Wat ik vooral apprecieerde: ze vertelden vooraf wat het per jaar ongeveer zou kosten, met de aannames erbij. Geen verrassingen.",
    date: "2026-07",
  },
  {
    id: "r09",
    name: "Nathalie G.",
    place: "Roeselare",
    homeType: "Halfopen woning",
    products: ["lucht-water-warmtepomp"],
    text: "Onze gasketel was 19 jaar oud. We twijfelden tussen een nieuwe ketel en een warmtepomp. De berekening maakte het verschil zichtbaar, ook over twintig jaar.",
    date: "2026-03",
  },
  {
    id: "r10",
    name: "Tom S.",
    place: "Sint-Niklaas",
    homeType: "Open bebouwing",
    products: ["pvt-panelen", "lucht-water-warmtepomp"],
    text: "Van PVT had ik nog nooit gehoord. Ze legden geduldig uit hoe het samenwerkt met de warmtepomp en waarom het bij ons dak paste. Technisch, maar begrijpelijk.",
    date: "2026-08",
  },
  {
    id: "r11",
    name: "Ingrid P.",
    place: "Turnhout",
    homeType: "Appartement",
    products: ["lucht-lucht-warmtepomp"],
    text: "Voor een appartement dacht ik dat er weinig mogelijk was. Ze bekeken wat wél kon en zeiden eerlijk dat zonnepanelen bij ons geen optie waren.",
    date: "2026-06",
  },
  {
    id: "r12",
    name: "Wouter & Jana",
    place: "Lier",
    homeType: "Nieuwbouw",
    products: ["thuisbatterij", "zonnepanelen"],
    text: "De opvolging na de installatie is goed: na een paar maanden keken ze samen met ons naar de opbrengst en stelden ze de sturing bij.",
    date: "2026-09",
  },
  {
    id: "r13",
    name: "Eva D.",
    place: "Oudenaarde",
    homeType: "Halfopen woning",
    products: ["laadpalen", "zonnepanelen"],
    text: "Laden op zonne-overschot werkt echt. De ingenieur stelde alles in en liet zien hoe ik het in de app volg.",
    date: "2026-09",
  },
  {
    id: "r14",
    name: "Geert H.",
    place: "Genk",
    homeType: "Open bebouwing",
    products: ["lucht-water-warmtepomp", "zonnepanelen"],
    text: "Ze hebben de premie voor ons aangevraagd. Dat papierwerk had ik zelf nooit zo vlot gedaan.",
    date: "2026-10",
  },
];

/** Reviews mentioning a product; falls back to all reviews when fewer than `min` match. */
export function getReviewsByProduct(slug: ServiceSlug, min = 3): Review[] {
  const matches = reviews.filter((r) => r.products.includes(slug));
  return matches.length >= min ? matches : [...matches, ...reviews.filter((r) => !r.products.includes(slug))];
}
