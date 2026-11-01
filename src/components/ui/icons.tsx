// Shared icon set (05 §8.2). Line style: 1.75–2.2px stroke, rounded caps, currentColor.
// Re-exports the existing homepage icons and adds the new ones.
import type { ComponentType } from "react";

export { ArrowUpRight, SolarLogo, PlayIcon, VbtecMark } from "@/components/hero/icons";
export { SunIcon, PulseIcon, BatteryIcon, CarIcon, FanIcon } from "@/components/products/icons";
export { BoltIcon, GearCycleIcon, TurbineIcon, DocumentCheckIcon, ChartUpIcon } from "@/components/services/icons";
export { SolarPanelIcon, EyeIcon } from "@/components/mission/icons";

export type IconProps = { className?: string };
export type IconComponent = ComponentType<IconProps>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.4v.1" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M14.5 6 8.5 12l6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="currentColor" aria-hidden="true">
      <path d="M0 24V14.4C0 5.9 4.6 1.1 12.6 0l1.1 3.5C9 4.9 7 7.6 6.8 11.2H12V24H0Zm18 0V14.4C18 5.9 22.6 1.1 30.6 0l1.1 3.5C27 4.9 25 7.6 24.8 11.2H30V24H18Z" />
    </svg>
  );
}

/** PVT panel: panel + water drop. */
export function PvtIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 6h15l2.5 12.5H4Z" />
      <path d="M11 6l-1 12.5M17 6l1 12.5M5.2 12.3h17.6" />
      <path d="M25 19.5c0 0 3 3.3 3 5.3a3 3 0 0 1-6 0c0-2 3-5.3 3-5.3Z" />
    </svg>
  );
}

/** Wall-mounted airco unit. */
export function AircoIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="7" width="25" height="10" rx="2.5" />
      <path d="M7 13.5h18" />
      <path d="M10 21c0 1.5-1 2.2-1 3.6M16 21c0 1.5-1 2.2-1 3.6M22 21c0 1.5-1 2.2-1 3.6" />
    </svg>
  );
}

/** Inverter box with sine wave. */
export function InverterIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="3.5" width="20" height="25" rx="3" />
      <path d="M10 16c1.5-4 3-4 4 0s2.5 4 4 0 2.5-4 4 0" />
      <path d="M13 24h6" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={1.8}>
      <path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}
