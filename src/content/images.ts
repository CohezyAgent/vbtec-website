// PLACEHOLDER – vervang door echte gegevens
// Image registry (docs/spec/07-images.md, 00 §2.13). Builders never hard-code image paths:
// use an ImageKey with <SmartImage image="key" />, or getImage("key").
// The 07 keys now point to AI-generated placeholder photos in /images/gen/ (not real
// customers). Swap to real customer photography (with consent) = edit `src`, `alt`,
// `width`, `height` here only.

import type { ImageRef } from "./types";

export const isPlaceholder = true;

const IMAGES = {
  // ── 07 keys (generated placeholder photography in /images/gen/) ─────────────────────────
  "hero-gezin-woning": {
    src: "/images/gen/hero-gezin-woning.jpg",
    alt: "Gezin wandelt naar hun gerenoveerde halfopen woning met zonnepanelen en een warmtepomp",
    width: 1586,
    height: 992,
    focal: "60% 50%",
  },
  "gezin-keuken-factuur": {
    src: "/images/gen/gezin-keuken-factuur.jpg",
    alt: "Koppel aan de keukentafel bekijkt hun energiefactuur",
    width: 1448,
    height: 1086,
  },
  "ingenieur-aan-tafel": {
    src: "/images/gen/ingenieur-aan-tafel.jpg",
    alt: "Ingenieur legt een ouder koppel aan hun eettafel uit hoe hun energiesysteem werkt",
    width: 1536,
    height: 1024,
  },
  "pvt-dak-detail": {
    src: "/images/gen/pvt-dak-detail.jpg",
    alt: "PVT-panelen op een hellend pannendak met leidingen langs de bovenrand",
    width: 1672,
    height: 941,
  },
  "woonkamer-warm-winter": {
    src: "/images/gen/woonkamer-warm-winter.jpg",
    alt: "Warme woonkamer op een winteravond, kinderen puzzelen op de vloer",
    width: 1672,
    height: 941,
    focal: "70% 50%",
  },
  "jaren70-woning": {
    src: "/images/gen/jaren70-woning.jpg",
    alt: "Gerenoveerde jaren '70-woning met PVT-panelen en een warmtepomp naast de zijgevel",
    width: 1672,
    height: 941,
  },
  "meter-app-hand": {
    src: "/images/gen/meter-app-hand.jpg",
    alt: "Hand met smartphone voor een digitale meter met een verbruiksgrafiek",
    width: 1122,
    height: 1402,
  },
  "laadpaal-oprit-avond": {
    src: "/images/gen/laadpaal-oprit-avond.jpg",
    alt: "Elektrische auto laadt op de oprit van een bakstenen woning bij valavond",
    width: 1672,
    height: 941,
  },
  "thuisbatterij-berging": {
    src: "/images/gen/thuisbatterij-berging.jpg",
    alt: "Opgeruimde berging met een thuisbatterij aan de muur, vader en kind sorteren de was",
    width: 1672,
    height: 941,
  },
  "rijwoning-zonnepanelen": {
    src: "/images/gen/rijwoning-zonnepanelen.jpg",
    alt: "Straat met Antwerpse rijwoningen, één woning heeft zonnepanelen op het dak",
    width: 1672,
    height: 941,
  },
  "nieuwbouw-gezin": {
    src: "/images/gen/nieuwbouw-gezin.jpg",
    alt: "Jong koppel met baby in hun lichte nieuwbouwwoning bij Leuven",
    width: 1536,
    height: 1024,
  },
  "warmtepomp-tuin": {
    src: "/images/gen/warmtepomp-tuin.jpg",
    alt: "Witte buitenunit van een warmtepomp tegen een bakstenen muur in een Vlaamse tuin",
    width: 1672,
    height: 941,
  },
  "fermette-airco": {
    src: "/images/gen/fermette-airco.jpg",
    alt: "Gerenoveerde fermette met een wandunit van een airco, ouder koppel leest in de zetel",
    width: 1672,
    height: 941,
  },
  "omvormer-app-klant": {
    src: "/images/gen/omvormer-app-klant.jpg",
    alt: "Technieker bij een omvormer in de garage terwijl de bewoner de app bekijkt",
    width: 1448,
    height: 1086,
  },

  // ── Existing stock (products strip, process steps) ───────────────────────
  // NB: step-assessment/-design/-install have a blurred glass panel baked into the photo:
  // only use them under a glass panel (Services / CardRow skin "photo").
  "step-assessment": { src: "/images/step-assessment.jpg", alt: "Een ingenieur met helm meet een terrein op", width: 424, height: 644 },
  "step-design": { src: "/images/step-design.jpg", alt: "Twee mensen met een helm bespreken een zonnepaneel", width: 424, height: 644 },
  "step-installation": { src: "/images/step-installation.jpg", alt: "Een installateur met valbeveiliging plaatst zonnepanelen op een dak", width: 848, height: 1288 },
  "step-install": { src: "/images/step-install.jpg", alt: "Een technieker controleert een omvormer onder zonnepanelen", width: 424, height: 644 },
  "product-zonnepanelen": { src: "/images/h-solar.jpg", alt: "Een zonnepaneel", width: 764, height: 434 },
  "product-omvormer": { src: "/images/h-inverter.jpg", alt: "Een witte omvormer", width: 742, height: 434 },
  "product-thuisbatterij": { src: "/images/h-battery.jpg", alt: "Een witte thuisbatterij", width: 742, height: 434 },
  "product-laadpaal": { src: "/images/h-charger.jpg", alt: "Een zwarte laadpaal", width: 734, height: 434 },
  "product-warmtepomp": { src: "/images/h-heatpump.jpg", alt: "Een buitenunit van een warmtepomp", width: 782, height: 434 },
  "journey-thumb": { src: "/images/journey-thumb.jpg", alt: "Twee mensen met een helm in gesprek bij zonnepanelen", width: 193, height: 171 },
  "slide-panels": { src: "/images/slide-panels.jpg", alt: "Rijen zonnepanelen in de zon", width: 386, height: 342 },
  "slide-fields": { src: "/images/slide-fields.jpg", alt: "Groene velden achter een rij zonnepanelen", width: 386, height: 342 },
  "service-solar": { src: "/images/service-solar.jpg", alt: "Zonnepanelen op een dak", width: 371, height: 471 },
  "service-co2": { src: "/images/service-co2.jpg", alt: "Natuurlandschap met open lucht", width: 371, height: 471 },

  // ── Real VB-TEC photography (from vbtec.be, public/images/vbtec/) ─────────────────────
  "vbtec-woning-zonnepanelen-oprit": { src: "/images/vbtec/woning-zonnepanelen-oprit.jpg", alt: "Bakstenen woning met zwarte zonnepanelen, de bestelwagen van VB-TEC op de oprit", width: 1600, height: 1200, focal: "50% 40%" },
  "vbtec-woning-zonnepanelen-dakkapellen": { src: "/images/vbtec/woning-zonnepanelen-dakkapellen.jpg", alt: "Gerenoveerde woning met een volledig dak zonnepanelen rond drie dakvensters", width: 2000, height: 934 },
  "vbtec-woning-zonnepanelen-landelijk": { src: "/images/vbtec/woning-zonnepanelen-landelijk.jpg", alt: "Landelijke woning met zonnepanelen op het zuiddak", width: 2000, height: 934 },
  "vbtec-woning-zonnepanelen-garage": { src: "/images/vbtec/woning-zonnepanelen-garage.jpg", alt: "Nieuwbouwwoning met garage en zonnepanelen op het dak", width: 1600, height: 747 },
  "vbtec-woning-zonnepanelen-veld": { src: "/images/vbtec/woning-zonnepanelen-veld.jpg", alt: "Vrijstaande woning aan de velden met zonnepanelen", width: 1600, height: 747 },
  "vbtec-woning-zonnepanelen-tuin": { src: "/images/vbtec/woning-zonnepanelen-tuin.jpg", alt: "Moderne woning met zonnepanelen, gezien vanuit de tuin", width: 899, height: 1599 },
  "vbtec-hoeve-zonnepanelen": { src: "/images/vbtec/hoeve-zonnepanelen.jpg", alt: "Gerenoveerde hoeve met zonnepanelen op het pannendak", width: 1600, height: 747 },
  "vbtec-rijwoning-zonnepanelen-gevel": { src: "/images/vbtec/rijwoning-zonnepanelen-gevel.jpg", alt: "Rijwoning met zonnepanelen op het dak", width: 934, height: 2000, focal: "50% 30%" },
  "vbtec-dakrij-zonnepanelen-luchtfoto": { src: "/images/vbtec/dakrij-zonnepanelen-luchtfoto.jpg", alt: "Luchtfoto van een rij woningen met zonnepanelen", width: 1600, height: 1200 },
  "vbtec-installateurs-plat-dak": { src: "/images/vbtec/installateurs-plat-dak.jpg", alt: "Twee installateurs van VB-TEC leggen zonnepanelen op een plat dak", width: 2000, height: 1333 },
  "vbtec-installateurs-panelen": { src: "/images/vbtec/installateurs-panelen.jpg", alt: "Installateurs met helm en valbeveiliging werken aan zonnepanelen", width: 2000, height: 1333 },
  "vbtec-warmtepomp-buitenunit": { src: "/images/vbtec/warmtepomp-buitenunit.jpg", alt: "Buitenunit van een lucht-water warmtepomp naast een moderne woning", width: 1253, height: 834 },
  "vbtec-warmtepomp-tuin-unit": { src: "/images/vbtec/warmtepomp-tuin-unit.jpg", alt: "Buitenunit van een warmtepomp tegen een witte tuinmuur", width: 2000, height: 2000, focal: "60% 60%" },
  "vbtec-warmtepomp-architectuur": { src: "/images/vbtec/warmtepomp-architectuur.jpg", alt: "Warmtepomp-buitenunit onder een moderne architectuurwoning", width: 1280, height: 1920 },
  "vbtec-architectwoning-warmtepomp": { src: "/images/vbtec/architectwoning-warmtepomp.jpg", alt: "Moderne architectuurwoning met een warmtepomp in de tuin", width: 1920, height: 1440, focal: "62% 82%" },
  "vbtec-laadpaal-gebruik": { src: "/images/vbtec/laadpaal-gebruik.jpg", alt: "Bewoonster start het laden met een laadpas aan de laadpaal", width: 1920, height: 1280, focal: "60% 50%" },
  "vbtec-laadpaal-oprit-auto": { src: "/images/vbtec/laadpaal-oprit-auto.jpg", alt: "Elektrische auto aan de laadkabel op de oprit van een moderne woning", width: 1920, height: 1280 },
  "vbtec-auto-laden-hand": { src: "/images/vbtec/auto-laden-hand.jpg", alt: "Hand steekt de laadstekker in een elektrische auto", width: 1920, height: 1280 },
  "vbtec-auto-laadkabel": { src: "/images/vbtec/auto-laadkabel.jpg", alt: "Laadkabel in de laadpoort van een elektrische auto", width: 2000, height: 1331 },
  "vbtec-gezin-zetel": { src: "/images/vbtec/gezin-zetel.jpg", alt: "Jong gezin met baby in de zetel", width: 1920, height: 1280 },
  "vbtec-gezin-woonkamer-zon": { src: "/images/vbtec/gezin-woonkamer-zon.jpg", alt: "Gezin ontspant in een zonnige woonkamer, kind tekent op de vloer", width: 2000, height: 1334 },
  "vbtec-ontspannen-thuis": { src: "/images/vbtec/ontspannen-thuis.jpg", alt: "Bewoonster ontspant in de zetel met haar hond", width: 2000, height: 1331 },
  "vbtec-app-tablet": { src: "/images/vbtec/app-tablet.jpg", alt: "Bewoner bekijkt de energie-app op een tablet", width: 1280, height: 1920 },
  "vbtec-app-smartphone-verbruik": { src: "/images/vbtec/app-smartphone-verbruik.jpg", alt: "Smartphone met het verbruik en de opbrengst van de zonnepanelen", width: 1920, height: 1280 },
  "vbtec-thermostaat-wand": { src: "/images/vbtec/thermostaat-wand.jpg", alt: "Slimme thermostaat aan de muur, ingesteld op 21 graden", width: 2000, height: 1333 },
} as const satisfies Record<string, ImageRef>;

export type ImageKey = keyof typeof IMAGES;

export function getImage(key: ImageKey): ImageRef {
  return IMAGES[key];
}

export function resolveImage(image: ImageRef | ImageKey): ImageRef {
  return typeof image === "string" ? IMAGES[image] : image;
}
