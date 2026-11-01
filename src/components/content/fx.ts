// Builder 3 helper: print a number from src/content/facts.ts inside long-form copy strings
// (blog.ts, kennisbank.ts, projects.ts). Every number in running text goes through here, so
// the value on the page always matches facts.ts. The article's SourcesList shows the source.
import { fact, type FactKey } from "@/content/facts";

const nf = (min: number, max: number) => new Intl.NumberFormat("nl-BE", { minimumFractionDigits: min, maximumFractionDigits: max });

type FxOpts = {
  /** Multiply (e.g. 100 to show €/kWh as cent). */
  scale?: number;
  /** Fraction digits (default 0–2). */
  digits?: number;
  /** Use the central value even when the fact has a range. */
  central?: boolean;
  /** Leave out the "ca." prefix (e.g. after "rond"). */
  bare?: boolean;
};

/** "ca. 51,99–60,53" / "2,5" / "ca. 26–34" (scale 100). */
export function fx(k: FactKey, o: FxOpts = {}): string {
  const f = fact(k);
  const s = o.scale ?? 1;
  const fmt = nf(0, o.digits ?? 2);
  const v = !o.central && f.range ? `${fmt.format(f.range[0] * s)}–${fmt.format(f.range[1] * s)}` : fmt.format(f.value * s);
  return `${f.estimate && !o.bare ? "ca. " : ""}${v}`;
}

/** Euro amount: "€ 1.500" / "ca. € 220–550". */
export function eur(k: FactKey, o: FxOpts = {}): string {
  const f = fact(k);
  const s = o.scale ?? 1;
  const fmt = nf(o.digits ?? 0, o.digits ?? 0);
  const v = !o.central && f.range ? `€ ${fmt.format(f.range[0] * s)}–${fmt.format(f.range[1] * s)}` : `€ ${fmt.format(f.value * s)}`;
  return `${f.estimate && !o.bare ? "ca. " : ""}${v}`;
}

/** Plain year (no grouping), e.g. ETS2 start "2028". */
export function year(k: FactKey): string {
  return String(fact(k).value);
}
