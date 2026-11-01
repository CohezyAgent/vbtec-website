// Lead form fields, options and validation (03 §6.4–6.6).
// Pure functions – shared by the client (step checks, blur) and the Server Action (source of truth).

import { INTERESSE_OPTIONS, type Interesse } from "@/content/registry";
import { site } from "@/content/site";

export const WONINGTYPES = ["Open bebouwing", "Halfopen", "Rijwoning", "Appartement", "Nieuwbouw (in opbouw)", "Andere"] as const;
export const BOUWJAREN = ["Vóór 1970", "1970–1999", "2000–2014", "2015 of later", "Weet ik niet"] as const;
export const VERWARMINGEN = ["Gasketel", "Stookolie", "Elektrisch (accumulatie/convectoren)", "Warmtepomp", "Pellet/hout", "Andere"] as const;
export const VOORKEUREN = ["Telefoon", "E-mail", "Maakt niet uit"] as const;
export const MOMENTEN = ["Voormiddag", "Namiddag", "Na 18 u", "Maakt niet uit"] as const;
export const INTERESSE_VALUES = INTERESSE_OPTIONS.map((o) => o.value);

export type VerbruikType = "eur" | "kwh";
export type LeadVariant = "full" | "contact";

export type LeadValues = {
  woningtype: string;
  bouwjaar: string;
  verwarming: string;
  verbruikType: VerbruikType;
  verbruikWaarde: string;
  verbruikOnbekend: boolean;
  interesse: string[];
  naam: string;
  email: string;
  telefoon: string;
  postcode: string;
  opmerking: string;
  toestemming: boolean;
  voorkeur: string;
  moment: string;
  bron: string;
  variant: LeadVariant;
};

export type LeadField = Exclude<keyof LeadValues, "bron" | "variant" | "verbruikType" | "verbruikOnbekend">;
export type FieldErrors = Partial<Record<LeadField, string>>;

export const STEP1_FIELDS: LeadField[] = ["woningtype", "bouwjaar", "verwarming", "verbruikWaarde", "interesse"];
export const STEP2_FIELDS: LeadField[] = ["naam", "email", "telefoon", "postcode", "opmerking", "toestemming"];

export const MAX_OPMERKING = 1000;

export const ERROR_SUMMARY = "Er ontbreekt nog iets. Kijk even de gemarkeerde velden na.";
export const serverErrorMessage = () =>
  `Er ging iets mis bij het versturen. Je gegevens zijn niet verloren – probeer het opnieuw, of bel ons op ${site.phone}.`;

export function emptyLead(bron: string, variant: LeadVariant, interesse: string[] = []): LeadValues {
  return {
    woningtype: "",
    bouwjaar: "",
    verwarming: "",
    verbruikType: "eur",
    verbruikWaarde: "",
    verbruikOnbekend: false,
    interesse,
    naam: "",
    email: "",
    telefoon: "",
    postcode: "",
    opmerking: "",
    toestemming: false,
    voorkeur: "Maakt niet uit",
    moment: "",
    bron,
    variant,
  };
}

const inList = (v: string, list: readonly string[]) => list.includes(v);

export function validateField(field: LeadField, v: LeadValues): string | undefined {
  switch (field) {
    case "woningtype":
      return inList(v.woningtype, WONINGTYPES) ? undefined : "Kies wat voor woning je hebt.";
    case "bouwjaar":
      return inList(v.bouwjaar, BOUWJAREN) ? undefined : "Kies ongeveer wanneer je woning gebouwd is (of 'Weet ik niet').";
    case "verwarming":
      return inList(v.verwarming, VERWARMINGEN) ? undefined : "Vertel ons hoe je nu verwarmt.";
    case "verbruikWaarde": {
      if (v.verbruikOnbekend) return undefined;
      const raw = v.verbruikWaarde.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
      if (v.verbruikType === "kwh") {
        if (!raw) return "Vul je jaarverbruik in, of kies 'Ik weet het niet'.";
        const n = Number(raw);
        if (!Number.isFinite(n) || !Number.isInteger(n)) return "Vul je jaarverbruik in kWh in (bv. 3500).";
        if (n < 500) return "Dat lijkt ons wat weinig. Vul je jaarverbruik in kWh in (bv. 3500).";
        if (n > 50000) return "Dat lijkt ons wat veel. Vul je jaarverbruik in kWh in (bv. 3500).";
        return undefined;
      }
      if (!raw) return "Vul je maandelijks voorschot in, of kies 'Ik weet het niet'.";
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 10 || n > 2000) return "Vul je maandbedrag in euro in (bv. 180).";
      return undefined;
    }
    case "interesse":
      return v.interesse.length > 0 && v.interesse.every((i) => INTERESSE_VALUES.includes(i as Interesse))
        ? undefined
        : "Kies minstens één onderwerp – of 'Ik weet het nog niet'.";
    case "naam": {
      const n = v.naam.trim();
      return n.length >= 2 && n.length <= 100 ? undefined : "Vul je naam in.";
    }
    case "email": {
      const e = v.email.trim();
      if (!e) return "Vul je e-mailadres in.";
      if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return "Dit e-mailadres lijkt niet te kloppen. Kijk het even na.";
      return undefined;
    }
    case "telefoon": {
      const t = v.telefoon.replace(/[\s./\-()]/g, "");
      if (!t) return "Vul je telefoonnummer in, dan kan een ingenieur je bellen.";
      const be = /^(\+32|0032|0)[1-9]\d{7,8}$/.test(t);
      const foreign = /^(\+|00)(31|33|49|352)\d{8,12}$/.test(t);
      return be || foreign ? undefined : "Dit nummer lijkt niet te kloppen. Bv. 0470 12 34 56.";
    }
    case "postcode": {
      const p = v.postcode.trim();
      if (!p) return "Vul de postcode van je woning in.";
      return /^[1-9]\d{3}$/.test(p) ? undefined : "Een Belgische postcode heeft 4 cijfers.";
    }
    case "opmerking":
      return v.opmerking.length > MAX_OPMERKING ? "Je opmerking is te lang (max. 1000 tekens)." : undefined;
    case "toestemming":
      return v.toestemming ? undefined : "We hebben je toestemming nodig om je berekening te kunnen maken.";
    case "voorkeur":
      return !v.voorkeur || inList(v.voorkeur, VOORKEUREN) ? undefined : "Kies hoe we je mogen contacteren.";
    case "moment":
      return !v.moment || inList(v.moment, MOMENTEN) ? undefined : "Kies een moment.";
  }
}

export function validateFields(fields: LeadField[], v: LeadValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of fields) {
    const e = validateField(f, v);
    if (e) errors[f] = e;
  }
  return errors;
}

export function validateLead(v: LeadValues): FieldErrors {
  const extra: LeadField[] = v.variant === "contact" ? ["voorkeur", "moment"] : [];
  return validateFields([...STEP1_FIELDS, ...STEP2_FIELDS, ...extra], v);
}

/** Info (not an error) for postcodes outside Flanders (03 §6.6). */
export function postcodeInfo(postcode: string): string | undefined {
  const p = Number(postcode.trim());
  if (!/^[1-9]\d{3}$/.test(postcode.trim())) return undefined;
  if ((p >= 1300 && p <= 1499) || (p >= 4000 && p <= 7999)) {
    return "We werken vooral in Vlaanderen en Brussel. We bekijken je aanvraag zeker, maar bellen je eerst om te checken of we je kunnen helpen.";
  }
  return undefined;
}

export function firstName(naam: string): string {
  return naam.trim().split(/\s+/)[0] ?? "";
}

/** Read a FormData into LeadValues (server). */
export function leadFromFormData(fd: FormData): LeadValues {
  const s = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  const variant: LeadVariant = s("variant") === "contact" ? "contact" : "full";
  return {
    woningtype: s("woningtype"),
    bouwjaar: s("bouwjaar"),
    verwarming: s("verwarming"),
    verbruikType: s("verbruikType") === "kwh" ? "kwh" : "eur",
    verbruikWaarde: s("verbruikWaarde"),
    verbruikOnbekend: s("verbruikOnbekend") === "1",
    interesse: fd.getAll("interesse").filter((x): x is string => typeof x === "string"),
    naam: s("naam"),
    email: s("email"),
    telefoon: s("telefoon"),
    postcode: s("postcode"),
    opmerking: s("opmerking"),
    toestemming: s("toestemming") === "on" || s("toestemming") === "1",
    voorkeur: s("voorkeur"),
    moment: s("moment"),
    bron: s("bron").slice(0, 200),
    variant,
  };
}

export type LeadState =
  | { status: "idle" }
  | { status: "error"; fieldErrors: FieldErrors; values: LeadValues; formError?: string; submissionId: number }
  | { status: "success"; firstName: string };
