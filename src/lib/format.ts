// nl-BE formatting helpers. Numbers shown on the site come from facts.ts (use FactValue);
// these helpers are for formatting only.

const nf = (opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat("nl-BE", opts);

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return nf({ maximumFractionDigits: 2, ...opts }).format(n);
}

/** "€ 1.250" (Belgian style: symbol, space, dot thousands). */
export function formatEuro(n: number, decimals = 0): string {
  return `€ ${nf({ minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)}`;
}

const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const MONTHS_SHORT = ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."];

/** "2026-11-01" → "1 november 2026"; "2026-11" → "november 2026". Static strings only. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!m) return String(y);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
}

/** "2026-01" → "jan. 2026" (FactNote style). */
export function formatAsOf(asOf: string): string {
  const [y, m] = asOf.split("-").map(Number);
  return m ? `${MONTHS_SHORT[m - 1]} ${y}` : String(y);
}

/** URL-safe id from a Dutch heading ("Wat kost één kWh?" → "wat-kost-een-kwh"). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
