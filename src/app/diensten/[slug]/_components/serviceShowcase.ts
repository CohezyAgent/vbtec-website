// Per-service SplitShowcase (photo + 3 glass stat cards). Every number comes from facts.ts.
import type { ImageKey } from "@/content/images";
import type { ServiceSlug } from "@/content/registry";
import { fact, type FactKey } from "@/content/facts";
import type { ShowcaseStat } from "@/components/sections/SplitShowcase";
import {
  AircoIcon,
  BatteryIcon,
  BoltIcon,
  CarIcon,
  ChartUpIcon,
  DocumentCheckIcon,
  EyeIcon,
  FanIcon,
  InverterIcon,
  PvtIcon,
  SunIcon,
} from "@/components/ui/icons";

type Showcase = { title: string; image: ImageKey; chip: string; stats: ShowcaseStat[] };

const val = (k: FactKey, scale = 1) => fact(k).value * scale;

export const SERVICE_SHOWCASE: Record<ServiceSlug, Showcase> = {
  zonnepanelen: {
    title: "Meer van je eigen zon, minder van het net.",
    image: "rijwoning-zonnepanelen",
    chip: "Indicatief · Vlaams dak",
    stats: [
      { icon: SunIcon, value: val("pvOpbrengstPerKwp"), suffix: " kWh", label: "per kWp per jaar" },
      { icon: BoltIcon, value: val("zelfverbruikMet"), suffix: "%", label: "zelfverbruik met sturing", meter: val("zelfverbruikMet") / 100 },
      { icon: ChartUpIcon, value: val("terugverdientijdZonnepanelen"), suffix: " jaar", label: "terugverdientijd" },
    ],
  },
  "pvt-panelen": {
    title: "Eén dak. Stroom én warmte.",
    image: "pvt-dak-detail",
    chip: "Indicatief · per woning berekend",
    stats: [
      { icon: SunIcon, value: val("pvOpbrengstPerKwp"), suffix: " kWh", label: "stroom per kWp per jaar" },
      { icon: PvtIcon, value: 2, suffix: " in 1", label: "stroom + warmte" },
      { icon: FanIcon, value: val("scopLuchtWater35"), decimals: 1, label: "SCOP bij 35 °C" },
    ],
  },
  "lucht-water-warmtepomp": {
    title: "Van gas naar warmte uit de buitenlucht.",
    image: "warmtepomp-tuin",
    chip: "Indicatief · rekenvoorbeeld",
    stats: [
      { icon: FanIcon, value: val("scopRekenwaarde"), decimals: 1, suffix: "×", label: "warmte uit 1 kWh stroom" },
      { icon: ChartUpIcon, value: val("voorbeeldBesparingWarmtepomp"), prefix: "€ ", label: "besparing per jaar" },
      { icon: DocumentCheckIcon, value: val("premieLuchtWaterCat4"), prefix: "€ ", label: "max. premie" },
    ],
  },
  "lucht-lucht-warmtepomp": {
    title: "Verwarmen én koelen met één toestel.",
    image: "fermette-airco",
    chip: "Indicatief · kost per kWh warmte",
    stats: [
      { icon: AircoIcon, value: val("scopLuchtLucht"), decimals: 1, suffix: "×", label: "warmte uit 1 kWh stroom" },
      { icon: BoltIcon, value: val("warmtekostAircoPerKwhWarmte", 100), decimals: 1, suffix: " c", label: "per kWh warmte met airco" },
      { icon: FanIcon, value: val("warmtekostGasPerKwhWarmte", 100), decimals: 1, suffix: " c", label: "per kWh warmte met gas" },
    ],
  },
  laadpalen: {
    title: "Rijden op je eigen zonnestroom.",
    image: "laadpaal-oprit-avond",
    chip: "Indicatief · per 100 km",
    stats: [
      { icon: SunIcon, value: val("kostPer100kmZonOverschot"), decimals: 2, prefix: "€ ", label: "geladen op je zon" },
      { icon: BoltIcon, value: val("kostPer100kmThuisNet"), decimals: 2, prefix: "€ ", label: "geladen op netstroom" },
      { icon: CarIcon, value: val("evVerbruikPer100km"), suffix: " kWh", label: "verbruik per 100 km" },
    ],
  },
  thuisbatterij: {
    title: "Zonnestroom van overdag, 's avonds gebruiken.",
    image: "thuisbatterij-berging",
    chip: "Indicatief · gemiddeld gezin",
    stats: [
      { icon: SunIcon, value: val("zelfverbruikZonder"), suffix: "%", label: "zelfverbruik zonder", meter: val("zelfverbruikZonder") / 100 },
      { icon: BatteryIcon, value: val("zelfverbruikMet"), suffix: "%", label: "met batterij en sturing", meter: val("zelfverbruikMet") / 100 },
      { icon: ChartUpIcon, value: val("capaciteitstariefPerKw"), prefix: "€ ", label: "per kW piek per jaar" },
    ],
  },
  omvormers: {
    title: "Het hart van je installatie.",
    image: "omvormer-app-klant",
    chip: "Indicatief",
    stats: [
      { icon: InverterIcon, value: val("levensduurOmvormer"), suffix: " jaar", label: "gemiddelde levensduur" },
      { icon: EyeIcon, value: 24, suffix: "/7", label: "monitoring in de app" },
      { icon: BoltIcon, value: val("zelfverbruikMet"), suffix: "%", label: "zelfverbruik met sturing", meter: val("zelfverbruikMet") / 100 },
    ],
  },
};
