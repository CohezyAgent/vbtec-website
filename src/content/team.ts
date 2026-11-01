// PLACEHOLDER – vervang door echte gegevens
// Voorbeeldteam: verzonnen namen, rollen en aantallen. Geen echte medewerkers.
// Zolang `isPlaceholder` true is: geen Person-schema (00 §2.8), silhouetten i.p.v. foto's
// (geen AI-gezichten), en blog/kennisbank-artikels krijgen de Organization als auteur in JSON-LD.
// Volgorde = ingenieurs eerst (zij rekenen), daarna installateurs en kantoor.

import type { TeamMember } from "./types";

export const isPlaceholder = true;
export const PLACEHOLDER_LABEL = "Voorbeeldteam";

export type TeamGroup = "ingenieurs" | "installatie" | "kantoor";

export type TeamMemberContent = TeamMember & {
  group: TeamGroup;
  /** Short "what I do at your home" line, shown on /team. */
  atYourHome: string;
};

export const TEAM_GROUPS: { key: TeamGroup; title: string; intro: string }[] = [
  {
    key: "ingenieurs",
    title: "De ingenieurs die rekenen",
    intro: "Zij bekijken je verbruik, je dak en je woning, en rekenen de scenario's uit. Geen verkoopdoelen, wel een rekenblad.",
  },
  {
    key: "installatie",
    title: "De vakmensen die plaatsen",
    intro: "Eigen ploegen die installeren wat de ingenieur berekende, en het netjes opleveren met keuring en uitleg.",
  },
  {
    key: "kantoor",
    title: "Wie alles in goede banen leidt",
    intro: "Planning, premies en opvolging: zodat jij niet achter papierwerk hoeft te lopen.",
  },
];

export const team: TeamMemberContent[] = [
  {
    slug: "wouter-van-den-bossche",
    group: "ingenieurs",
    name: "Wouter Van den Bossche",
    role: "Burgerlijk ingenieur energie · medeoprichter",
    bio: "Wouter rekent al jaren energiesystemen door voor woningen en begon VB-TEC omdat hij te vaak installaties zag die op papier mooi oogden, maar in de praktijk niet samenwerkten. Hij leidt het onderzoek naar PVT-panelen en controleert elke berekening die de deur uitgaat.",
    personalLine: "Ik reken liever drie scenario's te veel uit dan één toestel te veel te verkopen.",
    atYourHome: "Rekent de combinatie van warmtepomp, PVT en zonnepanelen uit en bewaakt de aannames.",
    certifications: ["Ir. energie", "Warmtepomp-ontwerp", "PVT-onderzoek"],
    knowsAbout: ["warmtepompen", "PVT-panelen", "energiesystemen woningen", "capaciteitstarief"],
    installationsCount: 420,
  },
  {
    slug: "lotte-claes",
    group: "ingenieurs",
    name: "Lotte Claes",
    role: "Industrieel ingenieur elektromechanica",
    bio: "Lotte is gespecialiseerd in zonnepanelen, omvormers en thuisbatterijen. Ze werkt met de kwartierwaarden van je digitale meter om te zien wanneer jij stroom verbruikt, en zegt het eerlijk als een batterij bij jou niets oplevert.",
    personalLine: "Je meterdata vertellen meer over je factuur dan elke verkoopbrochure.",
    atYourHome: "Analyseert je meterdata en dimensioneert zonnepanelen, omvormer en batterij.",
    certifications: ["Ing. elektromechanica", "AREI", "Batterij-dimensionering"],
    knowsAbout: ["zonnepanelen", "thuisbatterij", "omvormers", "dynamisch energiecontract", "zelfverbruik"],
    installationsCount: 310,
  },
  {
    slug: "pieter-de-smet",
    group: "ingenieurs",
    name: "Pieter De Smet",
    role: "Ingenieur warmtepompen & HVAC",
    bio: "Pieter maakt de warmteverliesberekening per kamer en checkt of je radiatoren een warmtepomp aankunnen. Hij komt bij jou thuis meten en kijkt ook naar de plaats van de buitenunit, het geluid en de leidingen.",
    personalLine: "Een warmtepomp die te groot is, is net zo slecht als één die te klein is.",
    atYourHome: "Meet je woning op, berekent het warmteverlies per kamer en de nodige aanvoertemperatuur.",
    certifications: ["Ing. HVAC", "Warmteverliesberekening", "Lucht-water & lucht-lucht"],
    knowsAbout: ["lucht-water warmtepomp", "lucht-lucht warmtepomp", "SCOP", "radiatoren", "isolatie"],
    installationsCount: 280,
  },
  {
    slug: "sofie-maes",
    group: "ingenieurs",
    name: "Sofie Maes",
    role: "Energie-ingenieur laadoplossingen & sturing",
    bio: "Sofie zorgt dat je laadpaal, warmtepomp en batterij niet tegelijk aan je net trekken. Ze stelt de slimme sturing in zodat je maandpiek laag blijft en je auto laadt op zonne-overschot of goedkope uren.",
    personalLine: "De goedkoopste kWh is die je op het juiste moment verbruikt.",
    atYourHome: "Ontwerpt de sturing van laadpaal, batterij en warmtepomp rond je maandpiek.",
    certifications: ["Ir. energie", "Slim laden", "Energiebeheer"],
    knowsAbout: ["laadpalen", "capaciteitstarief", "dynamisch tarief", "energiebeheersysteem"],
    installationsCount: 190,
  },
  {
    slug: "jens-peeters",
    group: "installatie",
    name: "Jens Peeters",
    role: "Ploegleider installatie",
    bio: "Jens leidt een van onze eigen installatieploegen. Hij plaatst wat de ingenieur berekende, overlegt vooraf waar elk toestel komt en laat je pas achter als alles werkt en je weet hoe de app werkt.",
    personalLine: "Een nette installatie is er een waar je later niet meer aan denkt.",
    atYourHome: "Plaatst panelen, omvormer, batterij en laadpaal, en levert alles op met uitleg.",
    certifications: ["Elektrotechniek", "Werken op hoogte", "AREI-conforme installatie"],
    knowsAbout: ["zonnepanelen", "thuisbatterij", "laadpalen"],
    installationsCount: 650,
  },
  {
    slug: "bram-wouters",
    group: "installatie",
    name: "Bram Wouters",
    role: "Technieker warmtepompen",
    bio: "Bram installeert en onderhoudt warmtepompen en airco's. Hij regelt de stooklijn zo dat je warmtepomp zo laag mogelijk stookt en blijft na de eerste winter je rendement mee opvolgen.",
    personalLine: "De eerste winter stellen we samen bij, tot je comfort én je verbruik kloppen.",
    atYourHome: "Plaatst en regelt je warmtepomp of airco en stelt de stooklijn af.",
    certifications: ["Koeltechniek", "Warmtepompen", "F-gassen"],
    knowsAbout: ["lucht-water warmtepomp", "lucht-lucht warmtepomp", "onderhoud"],
    installationsCount: 380,
  },
  {
    slug: "nathalie-janssens",
    group: "kantoor",
    name: "Nathalie Janssens",
    role: "Planning & premiedossiers",
    bio: "Nathalie plant je plaatsbezoek en installatie en dient je premieaanvraag in via Mijn VerbouwPremie. Zij is ook wie je belt als je een vraag hebt na de installatie.",
    personalLine: "Papierwerk is mijn werk, zodat het het jouwe niet hoeft te zijn.",
    atYourHome: "Plant je afspraken en regelt je premiedossier en opvolging.",
    certifications: ["Premiedossiers", "Klantopvolging"],
    knowsAbout: ["Mijn VerbouwPremie", "planning", "opvolging"],
  },
];

export function getTeamMember(slug: string): TeamMemberContent | undefined {
  return team.find((m) => m.slug === slug);
}

export function getTeamByGroup(group: TeamGroup): TeamMemberContent[] {
  return team.filter((m) => m.group === group);
}

export const engineers = getTeamByGroup("ingenieurs");
