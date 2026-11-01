type IconProps = { className?: string };

/** VB-TEC brand mark: leaf with big rounding top-left and bottom-right. Lilac (#EFD9FF) on
 * dark, primary green on light; set it with `color`. */
export function VbtecMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 92" aria-hidden="true">
      <path d="M40 0H92a8 8 0 0 1 8 8v44a40 40 0 0 1-40 40H8a8 8 0 0 1-8-8V40A40 40 0 0 1 40 0Z" fill="currentColor" />
    </svg>
  );
}

export function SolarLogo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 30 34" fill="currentColor" aria-hidden="true">
      <path d="M9.4 13.4a5.6 5.6 0 0 1 11.2 0Z" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M15 1.2v2.4M7.3 4.6l1.3 1.4M22.7 4.6l-1.3 1.4M3.9 11.7h2M24.1 11.7h2" />
      </g>
      <g stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round">
        <path d="M5 15.6h9.2v8.2H3.1Z" />
        <path d="M15.8 15.6H25l1.9 8.2H15.8Z" />
        <path d="M2.8 25.4h11.4v8H1Z" />
        <path d="M15.8 25.4h11.4l1.8 8H15.8Z" />
      </g>
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6.5 17.5 17 7M8.5 6.5H17.5V15.5" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="currentColor" />
      <path d="M14.5 11.8v12.4c0 .8.9 1.3 1.6.8l9-6.2a1 1 0 0 0 0-1.6l-9-6.2c-.7-.5-1.6 0-1.6.8Z" fill="#fff" />
    </svg>
  );
}
