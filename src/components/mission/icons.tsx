type IconProps = { className?: string };

export function SolarPanelIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M7.2 5h17.6l3 14.5H4.2Z" />
      <path d="M12.6 5 11.4 19.5M19.4 5l1.2 14.5M5.7 12.2h20.6" />
      <path d="M16 19.5v6M11 25.5h10" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5.5 9.5C8.4 6.8 12 5.4 16 5.4s7.6 1.4 10.5 4.1" />
      <path d="M3.5 18c3-4.6 7.3-7 12.5-7s9.5 2.4 12.5 7c-3 4.6-7.3 7-12.5 7s-9.5-2.4-12.5-7Z" />
      <circle cx="16" cy="18" r="3.6" />
    </svg>
  );
}
