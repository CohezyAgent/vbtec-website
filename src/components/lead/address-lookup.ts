// Client-side Belgian address suggestions (no key, CORS-enabled, works in the static export).
// 1. Adressenregister Vlaanderen (geo.api.vlaanderen.be) – best for Flanders.
// 2. Photon (OpenStreetMap) as fallback – covers Brussels and Wallonia.
// Any failure returns [] so manual entry always keeps working.

export type AddressSuggestion = {
  id: string;
  label: string;
  straat: string;
  huisnummer?: string;
  postcode?: string;
  gemeente?: string;
  /** Vlaanderen street-only hits ("Kerkstraat, Aalst") have no postcode yet. */
  needsResolve?: boolean;
};

const VL = "https://geo.api.vlaanderen.be/geolocation/v4";
const PHOTON = "https://photon.komoot.io/api/";

// "Kerkstraat 1, 9050 Gent" · "Kerkstraat, 9050 Gent" · "Kerkstraat, Aalst"
const FULL = /^(.+?)\s+(\d[\w/.\- ]*),\s*(\d{4})\s+(.+)$/;
const STREET_ZIP = /^(.+?),\s*(\d{4})\s+(.+)$/;
const STREET_CITY = /^(.+?),\s*(.+)$/;

function parseVlaanderen(label: string): AddressSuggestion | null {
  let m = FULL.exec(label);
  if (m) return { id: `vl:${label}`, label, straat: m[1], huisnummer: m[2].trim(), postcode: m[3], gemeente: m[4] };
  m = STREET_ZIP.exec(label);
  if (m) return { id: `vl:${label}`, label, straat: m[1], postcode: m[2], gemeente: m[3] };
  m = STREET_CITY.exec(label);
  if (m) return { id: `vl:${label}`, label, straat: m[1], gemeente: m[2], needsResolve: true };
  return null;
}

async function fromVlaanderen(q: string, signal: AbortSignal): Promise<AddressSuggestion[]> {
  const res = await fetch(`${VL}/Suggestion?q=${encodeURIComponent(q)}&c=6`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { SuggestionResult?: string[] };
  return (data.SuggestionResult ?? []).map(parseVlaanderen).filter((s): s is AddressSuggestion => s !== null);
}

type PhotonFeature = {
  properties: { countrycode?: string; street?: string; name?: string; osm_key?: string; housenumber?: string; postcode?: string; city?: string; district?: string; county?: string };
};

async function fromPhoton(q: string, signal: AbortSignal): Promise<AddressSuggestion[]> {
  const res = await fetch(`${PHOTON}?q=${encodeURIComponent(q)}&limit=8&bbox=2.5,49.5,6.4,51.5`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { features?: PhotonFeature[] };
  const seen = new Set<string>();
  const out: AddressSuggestion[] = [];
  for (const { properties: p } of data.features ?? []) {
    if (p.countrycode !== "BE") continue;
    const straat = p.street ?? (p.osm_key === "highway" ? p.name : undefined);
    if (!straat) continue;
    const gemeente = p.city ?? p.district ?? p.county;
    const label = `${straat}${p.housenumber ? ` ${p.housenumber}` : ""}, ${[p.postcode, gemeente].filter(Boolean).join(" ")}`;
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ id: `ph:${label}`, label, straat, huisnummer: p.housenumber, postcode: p.postcode, gemeente });
    if (out.length >= 6) break;
  }
  return out;
}

export async function suggestAddresses(q: string, signal: AbortSignal): Promise<AddressSuggestion[]> {
  const query = q.trim();
  if (query.length < 3) return [];
  try {
    const vl = await fromVlaanderen(query, signal);
    if (vl.length > 0) return vl;
  } catch (e) {
    if (signal.aborted) throw e;
  }
  try {
    return await fromPhoton(query, signal);
  } catch (e) {
    if (signal.aborted) throw e;
    return [];
  }
}

/** Adds the postcode to a street-only Vlaanderen hit. Returns the input unchanged on failure. */
export async function resolveAddress(s: AddressSuggestion, signal: AbortSignal): Promise<AddressSuggestion> {
  if (!s.needsResolve) return s;
  try {
    const res = await fetch(`${VL}/Location?q=${encodeURIComponent(s.label)}&c=1`, { signal });
    if (!res.ok) return s;
    const data = (await res.json()) as { LocationResult?: { Zipcode?: string; Municipality?: string; Thoroughfarename?: string }[] };
    const r = data.LocationResult?.[0];
    if (!r) return s;
    return { ...s, straat: r.Thoroughfarename ?? s.straat, postcode: r.Zipcode ?? undefined, gemeente: r.Municipality ?? s.gemeente, needsResolve: false };
  } catch {
    return s;
  }
}
