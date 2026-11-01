type IconProps = { className?: string };

/* Drawn on a 50-unit grid traced from the reference design. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Lightning bolt in a circle */
export function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" {...stroke}>
      <circle cx="25" cy="25" r="18.5" />
      <path d="M27.4 14.2 19.2 26.4h6.2l-2.8 9.4 8.6-12.4h-6.2Z" />
    </svg>
  );
}

/** Gear inside four circular arrows */
export function GearCycleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" {...stroke}>
      <path d="M21.79 6.78A18.5 18.5 0 0 1 40.34 14.65M43.22 21.79A18.5 18.5 0 0 1 35.35 40.34M28.21 43.22A18.5 18.5 0 0 1 9.66 35.35M6.78 28.21A18.5 18.5 0 0 1 14.65 9.66" />
      <path d="M41.12 9.06 40.34 14.65 34.85 13.29M40.94 41.12 35.35 40.34 36.71 34.85M8.88 40.94 9.66 35.35 15.15 36.71M9.06 8.88 14.65 9.66 13.29 15.15" />
      <path
        strokeWidth="2.2"
        d="M31.37 24.37 33.23 22.5 32.58 20.95 29.95 20.94 29.06 20.05 29.05 17.42 27.5 16.77 25.63 18.63 24.37 18.63 22.5 16.77 20.95 17.42 20.94 20.05 20.05 20.94 17.42 20.95 16.77 22.5 18.63 24.37 18.63 25.63 16.77 27.5 17.42 29.05 20.05 29.06 20.94 29.95 20.95 32.58 22.5 33.23 24.37 31.37 25.63 31.37 27.5 33.23 29.05 32.58 29.06 29.95 29.95 29.06 32.58 29.05 33.23 27.5 31.37 25.63Z"
      />
      <circle cx="25" cy="25" r="2.6" strokeWidth="2.2" />
    </svg>
  );
}

/** Wind turbine with motion arcs */
export function TurbineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" {...stroke}>
      <path d="M14.53 10.6A17 17 0 0 0 8.66 28.69M35.47 10.6A17 17 0 0 1 41.34 28.69" />
      <path d="M21.6 6.4h6.8l-1.6 11.2h-3.6Z" />
      <circle cx="25" cy="21.6" r="2.2" />
      <path d="M22.9 23 18.2 26.2" />
      <path d="M27.1 23l4.7 3.2" />
      <path d="M9.6 28.4l7.4-3.2 2.6 5.6-7 2.6a2.2 2.2 0 0 1-2.8-1.2l-1.2-1.8Z" />
      <path d="M40.4 28.4 33 25.2l-2.6 5.6 7 2.6a2.2 2.2 0 0 0 2.8-1.2l1.2-1.8Z" />
      <path d="M25 23.8V42M17.4 42h15.2" />
    </svg>
  );
}

/** Document with a check mark */
export function DocumentCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" {...stroke}>
      <path d="M29 7H15.5a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h19a3 3 0 0 0 3-3V15.5Z" />
      <path d="M29 7v8.5h8.5" />
      <path d="M19 22.5h12M19 28h7" />
      <path d="m19.5 35.5 3.2 3.2 6.8-6.8" />
    </svg>
  );
}

/** Rising line chart */
export function ChartUpIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" {...stroke}>
      <path d="M8 8v31a3 3 0 0 0 3 3h31" />
      <path d="m15 33 8.5-9 6 5.5L41 16" />
      <path d="M33.5 16H41v7.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth={2}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
