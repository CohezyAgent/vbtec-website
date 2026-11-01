type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...stroke}>
      <circle cx="16" cy="16" r="5.6" strokeWidth="2.6" />
      <path d="M16 3.5v3M16 25.5v3M3.5 16h3M25.5 16h3M7.2 7.2l2.1 2.1M22.7 22.7l2.1 2.1M7.2 24.8l2.1-2.1M22.7 9.3l2.1-2.1" />
    </svg>
  );
}

export function PulseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...stroke}>
      <path d="M3 16.5h6l2-4 3 11 3.5-17 3 13 1.8-3H29" />
    </svg>
  );
}

export function BatteryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...stroke}>
      <rect x="9.5" y="6.5" width="13" height="21" rx="2" />
      <path d="M13 3.8h6" strokeWidth="2.6" />
      <path d="M17.2 11.5 13.8 17.4h4.4l-3.4 5.9" />
    </svg>
  );
}

export function CarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...stroke}>
      <path d="M4 20.5v-3.2c0-1 .7-1.8 1.7-2L8.5 14.6l2.6-3.9A2.5 2.5 0 0 1 13.2 9.6h5.4a2.5 2.5 0 0 1 2 1l3 4 2.7.6c1 .2 1.7 1 1.7 2v3.3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <circle cx="10" cy="22" r="2.3" fill="#dff3b6" />
      <circle cx="22.5" cy="22" r="2.3" fill="#dff3b6" />
      <path d="M8.8 14.6h15.8" />
      <path d="M26 4.5l-1.6 2.8h2.6L25.4 10" strokeWidth="1.8" />
    </svg>
  );
}

export function FanIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <g fill="currentColor">
        <path d="M16 14c-1.6-3-1.8-7.4.8-8.8 2.8-1.4 5.8 1.6 4.6 4.6-.8 2-3 3.4-5.4 4.2Z" />
        <path d="M18 16c3-1.6 7.4-1.8 8.8.8 1.4 2.8-1.6 5.8-4.6 4.6-2-.8-3.4-3-4.2-5.4Z" />
        <path d="M16 18c1.6 3 1.8 7.4-.8 8.8-2.8 1.4-5.8-1.6-4.6-4.6.8-2 3-3.4 5.4-4.2Z" />
        <path d="M14 16c-3 1.6-7.4 1.8-8.8-.8-1.4-2.8 1.6-5.8 4.6-4.6 2 .8 3.4 3 4.2 5.4Z" />
        <circle cx="16" cy="16" r="2" />
      </g>
    </svg>
  );
}
