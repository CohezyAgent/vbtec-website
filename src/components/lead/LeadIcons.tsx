// Option-card icons for the multi-step lead form. Same line style as the shared set
// (32px viewBox, ~2px rounded stroke, currentColor).
import type { ComponentType, ReactNode } from "react";
import { AircoIcon, BatteryIcon, CarIcon, FanIcon, InverterIcon, PvtIcon, SolarPanelIcon } from "@/components/ui/icons";

type IconProps = { className?: string };
export type LeadIcon = ComponentType<IconProps>;

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ── Woningtype ──
const OpenIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M7 27V15l9-8 9 8v12Z" />
    <path d="M13.5 27v-6h5v6" />
    <path d="M3 27h26" />
  </Svg>
);
const HalfOpenIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 27V16l7-6.5 6 5.5 6-5.5 7 6.5v11Z" />
    <path d="M16 15v12" />
    <path d="M8 27v-5h4v5M20 27v-5h4v5" />
  </Svg>
);
const RowIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2.5 27V14l4.5-4 4.5 4 4.5-4 4.5 4 4.5-4 4.5 4v13Z" />
    <path d="M11.5 14v13M20.5 14v13" />
    <path d="M5.5 27v-4h3v4M14.5 27v-4h3v4M23.5 27v-4h3v4" />
  </Svg>
);
const ApartmentIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="7" y="4" width="18" height="23" rx="1.5" />
    <path d="M11 9h2M19 9h2M11 14h2M19 14h2M11 19h2M19 19h2" />
    <path d="M14 27v-4h4v4" />
  </Svg>
);
const NewBuildIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 4v23M5 6h20M21 6v5" />
    <path d="M19.5 11h3v2.5h-3Z" />
    <path d="M12 27v-8l6-5 6 5v8" strokeDasharray="2.4 2.4" />
    <path d="M3 27h26" />
  </Svg>
);
const OtherIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="16" cy="16" r="11.5" />
    <circle cx="10.5" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
    <circle cx="21.5" cy="16" r="1" fill="currentColor" />
  </Svg>
);
const UnknownIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="16" cy="16" r="11.5" />
    <path d="M12.5 13a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.3-1.5 2.3v.5" />
    <circle cx="16" cy="22.5" r="0.6" fill="currentColor" />
  </Svg>
);

// ── Bouwjaar ──
const OldHouseIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 27V15l10-9 10 9v12Z" />
    <path d="M21 10.5V5h3v8" />
    <path d="M6 19h20M6 23h20M11 15v4M21 15v4M16 19v4M11 23v4M21 23v4" strokeWidth="1.4" />
  </Svg>
);
const SeventiesIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 15 16 8l12 7" />
    <path d="M7 13.5V27h18V13.5" />
    <rect x="10.5" y="17" width="5" height="4" />
    <path d="M19 27v-8h3.5v8" />
  </Svg>
);
const ModernIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12h14v15H5ZM19 17h8v10h-8" />
    <path d="M9 16h6v5H9Z" />
    <path d="M22 21h2" />
  </Svg>
);
const EcoHouseIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 27V15l9-8 9 8v12Z" />
    <path d="M10 27v-6h8v6" />
    <path d="M22 11c0-4 3-6 7-6 0 4-2 7-6 7" />
    <path d="M22.5 12.5 26 8.5" />
  </Svg>
);

// ── Verwarming ──
const FlameIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M16 28c-5 0-8.5-3.4-8.5-8 0-5.5 5-8 5.5-14 3.5 2.2 5.4 5.5 5.5 9 1-1 1.6-2.4 1.8-4 2.5 2.2 4.2 5.4 4.2 9 0 4.6-3.5 8-8.5 8Z" />
    <path d="M16 28c-2.2 0-3.6-1.5-3.6-3.5 0-2.4 2.2-3.5 3.6-6 1.4 2.5 3.6 3.6 3.6 6 0 2-1.4 3.5-3.6 3.5Z" />
  </Svg>
);
const OilIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <ellipse cx="14" cy="8" rx="8" ry="2.6" />
    <path d="M6 8v16c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V8" />
    <path d="M6 14c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6M6 20c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6" />
    <path d="M27 15s-2.5 3-2.5 4.6a2.5 2.5 0 0 0 5 0C29.5 18 27 15 27 15Z" />
  </Svg>
);
const PlugIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M11 4v6M21 4v6" />
    <path d="M7 10h18v4a9 9 0 0 1-18 0Z" />
    <path d="M16 23v5" />
    <path d="M17.2 13.5 14.5 17.5h3l-2.7 4" strokeWidth="1.6" />
  </Svg>
);
const HeatPumpIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3.5" y="7" width="25" height="18" rx="2.5" />
    <circle cx="13" cy="16" r="5.5" />
    <path d="M13 10.5v11M7.5 16h11" strokeWidth="1.4" />
    <path d="M22 11.5h3M22 15h3M22 18.5h3" />
  </Svg>
);
const LogIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 22.5 24 15M8 27l20-7.5" />
    <ellipse cx="25.5" cy="17.5" rx="2.2" ry="3" transform="rotate(-20 25.5 17.5)" />
    <path d="M16 12c-2.2 0-3.5-1.4-3.5-3.2 0-2.3 2.6-3.1 3-5.8 2 1.3 4 3.4 4 5.8 0 1.8-1.3 3.2-3.5 3.2Z" />
  </Svg>
);

// ── Interesse ──
const AdviceIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v12a2.5 2.5 0 0 1-2.5 2.5H14l-6 5v-5h-.5A2.5 2.5 0 0 1 5 19.5Z" />
    <path d="M13 11a3 3 0 1 1 4.3 2.7c-.8.4-1.3 1-1.3 1.8" />
    <circle cx="16" cy="18.2" r="0.6" fill="currentColor" />
  </Svg>
);

export const WONINGTYPE_ICONS: Record<string, LeadIcon> = {
  "Open bebouwing": OpenIcon,
  Halfopen: HalfOpenIcon,
  Rijwoning: RowIcon,
  Appartement: ApartmentIcon,
  "Nieuwbouw (in opbouw)": NewBuildIcon,
  Andere: OtherIcon,
};

export const BOUWJAAR_ICONS: Record<string, LeadIcon> = {
  "Vóór 1970": OldHouseIcon,
  "1970–1999": SeventiesIcon,
  "2000–2014": ModernIcon,
  "2015 of later": EcoHouseIcon,
  "Weet ik niet": UnknownIcon,
};

export const VERWARMING_ICONS: Record<string, LeadIcon> = {
  Gasketel: FlameIcon,
  Stookolie: OilIcon,
  "Elektrisch (accumulatie/convectoren)": PlugIcon,
  Warmtepomp: HeatPumpIcon,
  "Pellet/hout": LogIcon,
  Andere: OtherIcon,
};

export const INTERESSE_ICONS: Record<string, LeadIcon> = {
  zonnepanelen: SolarPanelIcon,
  "pvt-panelen": PvtIcon,
  thuisbatterij: BatteryIcon,
  "lucht-water-warmtepomp": FanIcon,
  "lucht-lucht-warmtepomp": AircoIcon,
  laadpalen: CarIcon,
  omvormers: InverterIcon,
  advies: AdviceIcon,
};
