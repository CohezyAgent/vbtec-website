"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { submitLeadAction } from "@/app/actions/lead";
import { INTERESSE_OPTIONS } from "@/content/registry";
import { site } from "@/content/site";
import {
  BOUWJAREN,
  emptyLead,
  ERROR_SUMMARY,
  MAX_OPMERKING,
  MOMENTEN,
  postcodeInfo,
  validateField,
  validateFields,
  validateLead,
  VERWARMINGEN,
  VOORKEUREN,
  WONINGTYPES,
  type FieldErrors,
  type LeadField,
  type LeadState,
  type LeadValues,
  type LeadVariant,
} from "@/lib/lead-schema";
import { routes } from "@/lib/routes";
import CtaPill from "@/components/ui/CtaPill";
import { AlertIcon, ArrowLeftIcon, CheckIcon, InfoIcon } from "@/components/ui/icons";
import AddressFields from "./AddressFields";
import { clearPrefill, subscribePrefill, takePrefill, type LeadPrefill } from "./lead-bridge";
import { BOUWJAAR_ICONS, INTERESSE_ICONS, VERWARMING_ICONS, WONINGTYPE_ICONS, type LeadIcon } from "./LeadIcons";
import styles from "./Lead.module.css";

type Props = {
  /** Route the lead comes from (hidden field `bron`). */
  bron: string;
  /** Preselected interests (service slugs or "advies"). Never via the URL. */
  defaultInteresse?: string[];
  variant?: LeadVariant;
};

const INITIAL: LeadState = { status: "idle" };

type StepDef = { key: string; label: string; fields: LeadField[] };

/** One question per screen. The last step holds the submit button. */
function stepsFor(variant: LeadVariant): StepDef[] {
  return [
    { key: "woningtype", label: "Jouw woning", fields: ["woningtype"] },
    { key: "bouwjaar", label: "Bouwjaar", fields: ["bouwjaar"] },
    { key: "verwarming", label: "Verwarming", fields: ["verwarming"] },
    { key: "verbruik", label: "Verbruik", fields: ["verbruikWaarde"] },
    { key: "interesse", label: "Interesse", fields: ["interesse"] },
    { key: "adres", label: "Adres", fields: ["straat", "huisnummer", "postcode", "gemeente"] },
    { key: "gegevens", label: "Jouw gegevens", fields: ["naam", "email", "telefoon", ...(variant === "contact" ? (["voorkeur", "moment"] as LeadField[]) : [])] },
    { key: "afronden", label: "Afronden", fields: ["opmerking", "toestemming"] },
  ];
}

const QUICK_VALUES = { eur: ["100", "150", "200", "300"], kwh: ["2500", "3500", "5000", "8000"] } as const;
const AUTO_ADVANCE_MS = 280;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Multi-step lead form (03 §6): one question per screen, 8 steps. One <form>, one Server
 * Action (useActionState). All steps stay in the DOM; only the active one shows once JS runs.
 * Without JS every step renders with one submit; the server validates everything. Client
 * checks use the same rules as the server.
 */
export default function LeadForm({ bron, defaultInteresse = [], variant = "full" }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fid = (name: string) => `lead-${uid}-${name}`;
  const steps = stepsFor(variant);
  const last = steps.length - 1;
  const stepOf = (f: LeadField) => Math.max(0, steps.findIndex((s) => s.fields.includes(f)));

  const [state, formAction, pending] = useActionState(submitLeadAction, INITIAL);
  const [values, setValues] = useState<LeadValues>(() => emptyLead(bron, variant, defaultInteresse));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [summary, setSummary] = useState<{ tick: number; formError?: string } | null>(null);
  const [seenState, setSeenState] = useState<LeadState>(state);

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);
  const pointerPick = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);

  // Adopt a new server result (React's "adjust state when a value changes" pattern).
  if (state !== seenState) {
    setSeenState(state);
    if (state.status === "error") {
      setValues(state.values);
      setErrors(state.fieldErrors);
      const firstField = Object.keys(state.fieldErrors)[0] as LeadField | undefined;
      setStep(firstField ? stepOf(firstField) : last);
      setDir("back");
      setSummary({ tick: state.submissionId, formError: state.formError });
    }
  }

  // Progressive enhancement switch: hides the inactive steps only once JS runs.
  useEffect(() => {
    formRef.current?.setAttribute("data-enhanced", "true");
    return () => window.clearTimeout(advanceTimer.current);
  }, []);

  // First answer picked in the floating mini form (same page, or carried over via sessionStorage).
  useEffect(() => {
    const apply = (p: LeadPrefill) => {
      if (!(WONINGTYPES as readonly string[]).includes(p.woningtype)) return;
      clearPrefill();
      setValues((v) => ({ ...v, woningtype: p.woningtype }));
      setErrors((errs) => {
        const copy = { ...errs };
        delete copy.woningtype;
        return copy;
      });
      setSummary(null);
      window.clearTimeout(advanceTimer.current);
      stepChanged.current = true;
      setDir("fwd");
      setStep((s) => (s === 0 ? 1 : s));
    };
    const stored = takePrefill();
    if (stored) apply(stored);
    return subscribePrefill(apply);
  }, []);

  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    stepHeadingRef.current?.focus({ preventScroll: true });
    // The form can be taller than the viewport: bring its top in (below the sticky header).
    const form = formRef.current;
    if (form) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        window.scrollBy({ top: top - 96, behavior: reducedMotion() ? "auto" : "smooth" });
      }
    }
  }, [step]);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  const set = <K extends keyof LeadValues>(key: K, value: LeadValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-validate live only when the field already shows an error.
    const target: LeadField = key === "verbruikType" || key === "verbruikOnbekend" ? "verbruikWaarde" : (key as LeadField);
    if (target in errors) {
      const e = validateField(target, next);
      setErrors((errs) => {
        const copy = { ...errs };
        if (e) copy[target] = e;
        else delete copy[target];
        return copy;
      });
    }
    return next;
  };

  /** Several fields at once (address pick); re-validates the ones that show an error. */
  const setMany = (patch: Partial<LeadValues>) => {
    const next = { ...values, ...patch };
    setValues(next);
    setErrors((errs) => {
      const copy = { ...errs };
      for (const k of Object.keys(patch) as LeadField[]) {
        if (!(k in copy)) continue;
        const e = validateField(k, next);
        if (e) copy[k] = e;
        else delete copy[k];
      }
      return copy;
    });
  };

  const blur = (field: LeadField) => {
    const e = validateField(field, values);
    setErrors((errs) => {
      const copy = { ...errs };
      if (e) copy[field] = e;
      else delete copy[field];
      return copy;
    });
  };

  const goTo = (target: number, direction: "fwd" | "back") => {
    window.clearTimeout(advanceTimer.current);
    stepChanged.current = true;
    setDir(direction);
    setStep(target);
  };

  /** Validate the current step (with the given values) and move on. */
  const goNext = (from = step, v = values) => {
    const errs = validateFields(steps[from].fields, v);
    if (Object.keys(errs).length > 0) {
      setErrors((prev) => ({ ...prev, ...errs }));
      setSummary((s) => ({ tick: (s?.tick ?? 0) + 1 }));
      return;
    }
    setSummary(null);
    if (from < last) goTo(from + 1, "fwd");
  };

  const goBack = () => {
    setSummary(null);
    if (step > 0) goTo(step - 1, "back");
  };

  /** Single-choice pick: auto-advance only when picked with a pointer (arrow keys just select). */
  const pick = (key: "woningtype" | "bouwjaar" | "verwarming", value: string, from: number) => {
    const next = set(key, value);
    if (!pointerPick.current) return;
    pointerPick.current = false;
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goNext(from, next), reducedMotion() ? 0 : AUTO_ADVANCE_MS);
  };

  const toggleInteresse = (value: string, checked: boolean) => {
    let next: string[];
    if (value === "advies") next = checked ? ["advies"] : [];
    else next = checked ? [...values.interesse.filter((v) => v !== "advies" && v !== value), value] : values.interesse.filter((v) => v !== value);
    set("interesse", next);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (step < last) {
      // Enter (implicit submission) or "Volgende" on an earlier step.
      e.preventDefault();
      goNext();
      return;
    }
    const errs = validateLead(values);
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setErrors(errs);
      const target = Math.min(...(Object.keys(errs) as LeadField[]).map(stepOf));
      if (target !== step) goTo(target, "back");
      setSummary((s) => ({ tick: (s?.tick ?? 0) + 1 }));
    }
  };

  if (state.status === "success") {
    return <SuccessPanel firstName={state.firstName} headingRef={successRef} />;
  }

  const summaryFields = (Object.keys(errors) as LeadField[]).filter((f) => steps[step].fields.includes(f));
  const err = (f: LeadField) => errors[f];
  const describedBy = (f: LeadField, help?: boolean) => [help ? fid(`${f}-help`) : null, err(f) ? fid(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;
  const info = postcodeInfo(values.postcode);

  const frame = { current: step, dir, total: steps.length, headingRef: stepHeadingRef, titleId: (i: number) => fid(`step-${i}`), onBack: goBack };

  const choiceStep = (i: number, key: "woningtype" | "bouwjaar" | "verwarming", title: string, options: readonly string[], icons: Record<string, LeadIcon>, help?: string) => (
    <StepFrame {...frame} i={i} title={title} help={help}>
      <OptionCards
        type="radio"
        name={key}
        id={fid(key)}
        labelledBy={fid(`step-${i}`)}
        options={options.map((o) => ({ value: o, label: o, Icon: icons[o] }))}
        isChecked={(o) => values[key] === o}
        onChange={(o) => pick(key, o, i)}
        onPointerPick={() => (pointerPick.current = true)}
        error={err(key)}
        errorId={fid(`${key}-error`)}
      />
    </StepFrame>
  );

  const adres = [[values.straat, values.huisnummer].filter(Boolean).join(" "), [values.postcode, values.gemeente].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const recap = [values.woningtype, values.bouwjaar !== "Weet ik niet" ? values.bouwjaar : "", values.verwarming, verbruikLabel(values), adres].filter(Boolean);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className={styles.form}
      aria-busy={pending || undefined}
      aria-labelledby={fid(`step-${step}`)}
    >
      <input type="hidden" name="bron" value={bron} />
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="verbruikOnbekend" value={values.verbruikOnbekend ? "1" : "0"} />

      {/* Honeypot – hidden from people, attractive to bots. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor={fid("website")}>Website</label>
        <input id={fid("website")} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={`${styles.progress} ${styles.jsOnly}`}>
        <p className={styles.progressLabel} aria-live="polite">
          <span>
            Stap {step + 1} van {steps.length}
          </span>
          <span className={styles.progressName}>{steps[step].label}</span>
        </p>
        <ol className={styles.segments} aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.key} className={styles.segment} data-state={i < step ? "done" : i === step ? "current" : undefined} />
          ))}
        </ol>
      </div>

      {summary && (summaryFields.length > 0 || summary.formError) && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} key={summary.tick}>
          <AlertIcon className={styles.summaryIcon} />
          <div>
            <p>{summary.formError ?? ERROR_SUMMARY}</p>
            {summaryFields.length > 1 && (
              <ul>
                {summaryFields.map((f) => (
                  <li key={f}>
                    <a href={`#${fid(f)}`}>{errors[f]}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className={styles.steps}>
        {choiceStep(0, "woningtype", "Wat voor woning heb je?", WONINGTYPES, WONINGTYPE_ICONS)}
        {choiceStep(1, "bouwjaar", "Wanneer is je woning gebouwd?", BOUWJAREN, BOUWJAAR_ICONS, "Een schatting volstaat. Grondig gerenoveerd? Kies het renovatiejaar.")}
        {choiceStep(2, "verwarming", "Hoe verwarm je nu?", VERWARMINGEN, VERWARMING_ICONS)}

        {/* ── Verbruik ── */}
        <StepFrame {...frame} i={3} title="Hoeveel verbruik je ongeveer?" help="Je vindt dit op je jaarafrekening of in de app van je leverancier.">
          <fieldset className={styles.fieldset} aria-labelledby={fid("step-3")} aria-describedby={describedBy("verbruikWaarde")}>
            <div className={styles.toggle} role="radiogroup" aria-label="Eenheid">
              {(
                [
                  ["eur", "€ per maand"],
                  ["kwh", "kWh per jaar"],
                ] as const
              ).map(([v, label]) => (
                <label key={v} className={`${styles.toggleOption} ${values.verbruikType === v ? styles.toggleOn : ""}`}>
                  <input
                    type="radio"
                    name="verbruikType"
                    value={v}
                    checked={values.verbruikType === v}
                    onChange={() => set("verbruikType", v)}
                    className={styles.visuallyHidden}
                  />
                  {label}
                </label>
              ))}
            </div>
            {values.verbruikOnbekend ? (
              <div className={styles.unknown}>
                <p>
                  <CheckIcon className={styles.unknownIcon} /> Geen probleem – we zoeken het samen uit tijdens het eerste telefoontje.
                </p>
                <button type="button" className={styles.linkButton} onClick={() => set("verbruikOnbekend", false)}>
                  Toch invullen
                </button>
                <input type="hidden" name="verbruikWaarde" value="" />
              </div>
            ) : (
              <>
                <div className={`${styles.bigInput} ${err("verbruikWaarde") ? styles.invalid : ""}`}>
                  <span className={styles.bigPrefix} aria-hidden="true">
                    {values.verbruikType === "kwh" ? "kWh" : "€"}
                  </span>
                  <label htmlFor={fid("verbruikWaarde")} className={styles.visuallyHidden}>
                    {values.verbruikType === "kwh" ? "Jaarverbruik in kWh" : "Maandelijks voorschot in euro"}
                  </label>
                  <input
                    id={fid("verbruikWaarde")}
                    name="verbruikWaarde"
                    type="text"
                    inputMode="numeric"
                    enterKeyHint="next"
                    autoComplete="off"
                    placeholder={values.verbruikType === "kwh" ? "3500" : "180"}
                    value={values.verbruikWaarde}
                    onChange={(e) => set("verbruikWaarde", e.target.value)}
                    onBlur={() => values.verbruikWaarde && blur("verbruikWaarde")}
                    aria-invalid={err("verbruikWaarde") ? true : undefined}
                    aria-describedby={describedBy("verbruikWaarde")}
                    className={styles.bigField}
                  />
                  <span className={styles.bigSuffix} aria-hidden="true">
                    {values.verbruikType === "kwh" ? "per jaar" : "per maand"}
                  </span>
                </div>
                <div className={styles.quick}>
                  <span className={styles.quickLabel}>Snel kiezen:</span>
                  {QUICK_VALUES[values.verbruikType].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`${styles.quickChip} ${values.verbruikWaarde === q ? styles.quickOn : ""}`}
                      aria-pressed={values.verbruikWaarde === q}
                      onClick={() => set("verbruikWaarde", q)}
                    >
                      {values.verbruikType === "kwh" ? `${Number(q).toLocaleString("nl-BE")} kWh` : `€ ${q}`}
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.linkButton} onClick={() => set("verbruikOnbekend", true)}>
                  Ik weet het niet
                </button>
              </>
            )}
            <FieldError id={fid("verbruikWaarde-error")} message={err("verbruikWaarde")} />
          </fieldset>
        </StepFrame>

        {/* ── Interesse ── */}
        <StepFrame {...frame} i={4} title="Waar wil je meer over weten?" help="Kies gerust meerdere. We rekenen ze samen door – soms raden we er ook eentje af.">
          <OptionCards
            type="checkbox"
            name="interesse"
            id={fid("interesse")}
            labelledBy={fid("step-4")}
            compact
            options={INTERESSE_OPTIONS.map((o) => ({ value: o.value, label: o.label, Icon: INTERESSE_ICONS[o.value], wide: o.value === "advies" }))}
            isChecked={(o) => values.interesse.includes(o)}
            onChange={(o, checked) => toggleInteresse(o, checked)}
            error={err("interesse")}
            errorId={fid("interesse-error")}
          />
        </StepFrame>

        {/* ── Adres ── */}
        <StepFrame {...frame} i={5} title="Waar staat je woning?" help="Zo kennen we je dak, je netbeheerder en je premies.">
          <AddressFields
            values={{ straat: values.straat, huisnummer: values.huisnummer, postcode: values.postcode, gemeente: values.gemeente }}
            errors={errors}
            fid={fid}
            onChange={(k, v) => set(k, v)}
            onPick={setMany}
            onBlur={blur}
            info={!err("postcode") ? info : undefined}
          />
        </StepFrame>

        {/* ── Gegevens ── */}
        <StepFrame {...frame} i={6} title="Waar mogen we je berekening naartoe sturen?" help="Een ingenieur belt je om een paar details te checken. Geen callcenter, geen verkooppraatjes.">
          <div className={styles.grid}>
            <TextField
              label="Je naam"
              id={fid("naam")}
              name="naam"
              autoComplete="name"
              placeholder="Voor- en achternaam"
              value={values.naam}
              onChange={(v) => set("naam", v)}
              onBlur={() => blur("naam")}
              error={err("naam")}
              errorId={fid("naam-error")}
            />
            <TextField
              label="Je e-mailadres"
              id={fid("email")}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="naam@voorbeeld.be"
              value={values.email}
              onChange={(v) => set("email", v)}
              onBlur={() => blur("email")}
              error={err("email")}
              errorId={fid("email-error")}
            />
            <TextField
              label="Je telefoonnummer"
              id={fid("telefoon")}
              name="telefoon"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="0470 12 34 56"
              value={values.telefoon}
              onChange={(v) => set("telefoon", v)}
              onBlur={() => blur("telefoon")}
              error={err("telefoon")}
              errorId={fid("telefoon-error")}
            />
          </div>

          {variant === "contact" && (
            <div className={styles.grid}>
              <fieldset className={styles.fieldset} id={fid("voorkeur")} aria-describedby={err("voorkeur") ? fid("voorkeur-error") : undefined}>
                <legend className={styles.legend}>Hoe mogen we je contacteren?</legend>
                <div className={styles.chips}>
                  {VOORKEUREN.map((o) => (
                    <label key={o} className={`${styles.chip} ${values.voorkeur === o ? styles.chipOn : ""}`}>
                      <input type="radio" name="voorkeur" value={o} checked={values.voorkeur === o} onChange={() => set("voorkeur", o)} className={styles.visuallyHidden} />
                      {o}
                    </label>
                  ))}
                </div>
                <FieldError id={fid("voorkeur-error")} message={err("voorkeur")} />
              </fieldset>
              <div className={styles.field}>
                <label htmlFor={fid("moment")} className={styles.label}>
                  Wanneer bel je best? <span className={styles.optional}>(optioneel)</span>
                </label>
                <div className={styles.selectWrap}>
                  <select id={fid("moment")} name="moment" value={values.moment} onChange={(e) => set("moment", e.target.value)} className={styles.select}>
                    <option value="">Kies een moment</option>
                    {MOMENTEN.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </StepFrame>

        {/* ── Afronden ── */}
        <StepFrame {...frame} i={7} title="Nog iets dat we moeten weten?">
          {recap.length > 0 && (
            <div className={`${styles.recap} ${styles.jsOnly}`}>
              <p className={styles.recapLabel}>Jouw situatie</p>
              <ul className={styles.recapList}>
                {recap.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <button type="button" className={styles.recapEdit} onClick={() => goTo(0, "back")}>
                Wijzigen
              </button>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor={fid("opmerking")} className={styles.label}>
              Je opmerking <span className={styles.optional}>(optioneel)</span>
            </label>
            <textarea
              id={fid("opmerking")}
              name="opmerking"
              rows={3}
              maxLength={MAX_OPMERKING + 200}
              enterKeyHint="send"
              placeholder={`bv. "Mijn ketel is 18 jaar oud" of "We krijgen binnenkort een elektrische auto."`}
              value={values.opmerking}
              onChange={(e) => set("opmerking", e.target.value)}
              onBlur={() => blur("opmerking")}
              aria-invalid={err("opmerking") ? true : undefined}
              aria-describedby={[fid("opmerking-count"), err("opmerking") ? fid("opmerking-error") : null].filter(Boolean).join(" ")}
              className={`${styles.textarea} ${err("opmerking") ? styles.invalid : ""}`}
            />
            <p className={styles.counter} id={fid("opmerking-count")}>
              {values.opmerking.length} / {MAX_OPMERKING} tekens
            </p>
            <FieldError id={fid("opmerking-error")} message={err("opmerking")} />
          </div>

          <div className={styles.field}>
            <label className={`${styles.consent} ${err("toestemming") ? styles.consentInvalid : ""}`} htmlFor={fid("toestemming")}>
              <input
                id={fid("toestemming")}
                type="checkbox"
                name="toestemming"
                checked={values.toestemming}
                onChange={(e) => set("toestemming", e.target.checked)}
                aria-invalid={err("toestemming") ? true : undefined}
                aria-describedby={err("toestemming") ? fid("toestemming-error") : undefined}
                className={styles.visuallyHidden}
              />
              <span className={styles.box} aria-hidden="true">
                <CheckIcon />
              </span>
              <span>
                Ik ga ermee akkoord dat VB-TEC mijn gegevens gebruikt om mijn berekening te maken en mij hierover te contacteren. Meer info in de{" "}
                <Link href={routes.privacy()}>privacyverklaring</Link>.
              </span>
            </label>
            <FieldError id={fid("toestemming-error")} message={err("toestemming")} />
          </div>

          <div className={styles.actionsFinal}>
            <button type="button" className={`${styles.back} ${styles.jsOnly}`} onClick={goBack}>
              <ArrowLeftIcon className={styles.backIcon} /> Vorige
            </button>
            <CtaPill type="submit" variant="lime" pending={pending} block>
              {pending ? "Even geduld…" : "Vraag mijn gratis berekening aan"}
            </CtaPill>
          </div>
          <p className={styles.privacy}>We delen je gegevens met niemand. Je krijgt geen nieuwsbrief tenzij je daar zelf om vraagt.</p>
        </StepFrame>
      </div>
    </form>
  );
}

function verbruikLabel(v: LeadValues): string {
  if (v.verbruikOnbekend || !v.verbruikWaarde.trim()) return "";
  return v.verbruikType === "kwh" ? `${v.verbruikWaarde.trim()} kWh/jaar` : `€ ${v.verbruikWaarde.trim()}/maand`;
}

/** "Elektrisch (accumulatie/convectoren)" → main "Elektrisch" + sub "accumulatie/convectoren". */
function splitLabel(label: string): [string, string | undefined] {
  const m = /^(.*?)\s*\((.*)\)$/.exec(label);
  return m ? [m[1], m[2]] : [label, undefined];
}

// ───────────────────────── Field parts ─────────────────────────

type FrameProps = {
  i: number;
  current: number;
  dir: "fwd" | "back";
  total: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
  titleId: (i: number) => string;
  onBack: () => void;
  title: string;
  help?: ReactNode;
  children: ReactNode;
};

/** Shared step frame: counter, heading (focus target), optional help, body, nav. */
function StepFrame({ i, current, dir, total, headingRef, titleId, onBack, title, help, children }: FrameProps) {
  const isLast = i === total - 1;
  return (
    <div className={styles.step} data-active={current === i || undefined} data-dir={dir}>
      <div className={styles.stepHead}>
        <p className={styles.stepKicker} aria-hidden="true">
          {String(i + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
        </p>
        <h3 ref={current === i ? headingRef : undefined} tabIndex={-1} className={styles.stepTitle} id={titleId(i)}>
          {title}
        </h3>
        {help && <p className={styles.stepHelp}>{help}</p>}
      </div>
      <div className={styles.stepBody}>{children}</div>
      {!isLast && (
        <div className={`${styles.nav} ${styles.jsOnly}`}>
          {i > 0 ? (
            <button type="button" className={styles.back} onClick={onBack}>
              <ArrowLeftIcon className={styles.backIcon} /> Vorige
            </button>
          ) : (
            <span className={styles.note}>Duurt minder dan een minuut.</span>
          )}
          <CtaPill type="submit" variant="lime" size="sm">
            Volgende
          </CtaPill>
        </div>
      )}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className={styles.error} id={id}>
      <AlertIcon className={styles.errorIcon} />
      {message}
    </p>
  );
}

function OptionCards({
  type,
  name,
  id,
  labelledBy,
  options,
  isChecked,
  onChange,
  onPointerPick,
  error,
  errorId,
  compact,
}: {
  type: "radio" | "checkbox";
  name: string;
  id: string;
  labelledBy: string;
  options: { value: string; label: string; Icon?: LeadIcon; wide?: boolean }[];
  isChecked: (value: string) => boolean;
  onChange: (value: string, checked: boolean) => void;
  onPointerPick?: () => void;
  error?: string;
  errorId: string;
  compact?: boolean;
}) {
  return (
    <fieldset className={styles.fieldset} id={id} aria-labelledby={labelledBy} aria-describedby={error ? errorId : undefined}>
      <div className={`${styles.options} ${compact ? styles.optionsCompact : ""} ${error ? styles.optionsInvalid : ""}`}>
        {options.map(({ value, label, Icon, wide }, i) => {
          const checked = isChecked(value);
          const [main, sub] = splitLabel(label);
          return (
            <label
              key={value}
              className={`${styles.option} ${checked ? styles.optionOn : ""} ${wide ? styles.optionWide : ""}`}
              style={{ ["--i" as string]: i }}
              onPointerDown={onPointerPick}
            >
              <input type={type} name={name} value={value} checked={checked} onChange={(e) => onChange(value, e.target.checked)} className={styles.visuallyHidden} />
              {Icon && (
                <span className={styles.optionIcon} aria-hidden="true">
                  <Icon />
                </span>
              )}
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{main}</span>
                {sub && <span className={styles.optionSub}>{sub}</span>}
              </span>
              <span className={styles.optionCheck} aria-hidden="true">
                <CheckIcon />
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

function TextField({
  label,
  id,
  name,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  help,
  helpId,
  value,
  onChange,
  onBlur,
  error,
  errorId,
  info,
}: {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  maxLength?: number;
  help?: string;
  helpId?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  errorId: string;
  info?: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={[help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined}
        className={`${styles.input} ${styles.inputSolo} ${error ? styles.invalid : ""}`}
      />
      {help && (
        <p className={styles.help} id={helpId}>
          {help}
        </p>
      )}
      <FieldError id={errorId} message={error} />
      {info && (
        <p className={styles.info} role="status">
          <InfoIcon className={styles.errorIcon} />
          {info}
        </p>
      )}
    </div>
  );
}

// ───────────────────────── Success ─────────────────────────

function SuccessPanel({ firstName, headingRef }: { firstName: string; headingRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className={styles.success} role="status">
      <span className={styles.successIcon} aria-hidden="true">
        <CheckIcon />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className={styles.successTitle}>
        Bedankt{firstName ? `, ${firstName}` : ""}! Je aanvraag is goed aangekomen.
      </h3>
      <p className={styles.successText}>
        Een van onze ingenieurs bekijkt je situatie en belt je binnen {site.responseTime}. Zo gaat het verder:
      </p>
      <ol className={styles.successSteps}>
        <li>
          <strong>We bellen je kort</strong> – om een paar details te checken (dak, meter, verbruik).
        </li>
        <li>
          <strong>We rekenen je scenario&rsquo;s uit</strong> – ook het scenario &lsquo;niets doen&rsquo;.
        </li>
        <li>
          <strong>Je krijgt een helder voorstel</strong> – met cijfers, premies en terugverdientijd. Jij beslist, zonder druk.
        </li>
      </ol>
      <p className={styles.tip}>
        <strong>Tip:</strong> leg je laatste jaarafrekening alvast klaar. Heb je een digitale meter? Dan helpen je verbruiksgegevens uit Mijn
        Fluvius ons om nog nauwkeuriger te rekenen.
      </p>
      <ul className={styles.successLinks}>
        <li>
          <Link href={routes.hoeHetWerkt()}>Lees ondertussen hoe het werkt</Link>
        </li>
        <li>
          <Link href={routes.projecten()}>Bekijk projecten van gezinnen zoals jij</Link>
        </li>
      </ul>
    </div>
  );
}

export type { Props as LeadFormProps };
