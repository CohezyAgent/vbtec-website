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
  STEP1_FIELDS,
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
import styles from "./Lead.module.css";

type Props = {
  /** Route the lead comes from (hidden field `bron`). */
  bron: string;
  /** Preselected interests (service slugs or "advies"). Never via the URL. */
  defaultInteresse?: string[];
  variant?: LeadVariant;
};

const INITIAL: LeadState = { status: "idle" };

/**
 * Two-step lead form (03 §6). One <form>, one Server Action (useActionState). Step 1 fields
 * stay in the DOM while step 2 is shown. Without JS both steps render with one submit; the
 * server validates everything. Client checks use the same rules as the server.
 */
export default function LeadForm({ bron, defaultInteresse = [], variant = "full" }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fid = (name: string) => `lead-${uid}-${name}`;
  const [state, formAction, pending] = useActionState(submitLeadAction, INITIAL);
  const [values, setValues] = useState<LeadValues>(() => emptyLead(bron, variant, defaultInteresse));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [summary, setSummary] = useState<{ tick: number; formError?: string } | null>(null);
  const [seenState, setSeenState] = useState<LeadState>(state);

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);

  // Adopt a new server result (React's "adjust state when a value changes" pattern).
  if (state !== seenState) {
    setSeenState(state);
    if (state.status === "error") {
      setValues(state.values);
      setErrors(state.fieldErrors);
      const firstField = Object.keys(state.fieldErrors)[0] as LeadField | undefined;
      setStep(firstField && STEP1_FIELDS.includes(firstField) ? 1 : 2);
      setSummary({ tick: state.submissionId, formError: state.formError });
    }
  }

  // Progressive enhancement switch: hides the inactive step only once JS runs.
  useEffect(() => {
    formRef.current?.setAttribute("data-enhanced", "true");
  }, []);

  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    stepHeadingRef.current?.focus({ preventScroll: true });
    // The form is taller than the viewport, so `block: "nearest"` left the new step's heading
    // above the fold after "Volgende stap". Bring the form top in (below the sticky header).
    const form = formRef.current;
    if (form) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        window.scrollBy({ top: top - 96, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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

  const toggleInteresse = (value: string, checked: boolean) => {
    let next: string[];
    if (value === "advies") next = checked ? ["advies"] : [];
    else next = checked ? [...values.interesse.filter((v) => v !== "advies" && v !== value), value] : values.interesse.filter((v) => v !== value);
    set("interesse", next);
  };

  const goNext = () => {
    const errs = validateFields(STEP1_FIELDS, values);
    if (Object.keys(errs).length > 0) {
      setErrors((prev) => ({ ...prev, ...errs }));
      setSummary((s) => ({ tick: (s?.tick ?? 0) + 1 }));
      return;
    }
    setSummary(null);
    stepChanged.current = true;
    setStep(2);
  };

  const goBack = () => {
    stepChanged.current = true;
    setSummary(null);
    setStep(1);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (step === 1) {
      e.preventDefault();
      goNext();
      return;
    }
    const errs = validateLead(values);
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setErrors(errs);
      const first = Object.keys(errs)[0] as LeadField;
      if (STEP1_FIELDS.includes(first)) {
        stepChanged.current = true;
        setStep(1);
      }
      setSummary((s) => ({ tick: (s?.tick ?? 0) + 1 }));
    }
  };

  if (state.status === "success") {
    return <SuccessPanel firstName={state.firstName} headingRef={successRef} />;
  }

  const summaryFields = (Object.keys(errors) as LeadField[]).filter((f) => (step === 1 ? STEP1_FIELDS.includes(f) : true));
  const err = (f: LeadField) => errors[f];
  const describedBy = (f: LeadField, help?: boolean) => [help ? fid(`${f}-help`) : null, err(f) ? fid(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;
  const info = postcodeInfo(values.postcode);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className={styles.form}
      aria-busy={pending || undefined}
      aria-labelledby={fid("title")}
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
          Stap {step} van 2 – {step === 1 ? "Jouw woning" : "Jouw gegevens"}
        </p>
        <span className={styles.progressBar} aria-hidden="true">
          <span className={styles.progressFill} style={{ transform: `scaleX(${step === 1 ? 0.5 : 1})` }} />
        </span>
      </div>

      {summary && (summaryFields.length > 0 || summary.formError) && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} key={summary.tick}>
          <AlertIcon className={styles.summaryIcon} />
          <div>
            <p>{summary.formError ?? ERROR_SUMMARY}</p>
            {summaryFields.length > 0 && (
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

      {/* ───────────── Stap 1 ───────────── */}
      <div className={styles.step} data-active={step === 1 || undefined}>
        <h3 ref={step === 1 ? stepHeadingRef : undefined} tabIndex={-1} className={styles.stepTitle} id={fid("title")}>
          Jouw woning
        </h3>

        <ChoiceGroup
          legend="Wat voor woning heb je?"
          name="woningtype"
          id={fid("woningtype")}
          options={WONINGTYPES}
          value={values.woningtype}
          onChange={(v) => set("woningtype", v)}
          error={err("woningtype")}
          errorId={fid("woningtype-error")}
        />
        <ChoiceGroup
          legend="Wanneer is je woning gebouwd?"
          help="Een schatting volstaat. Bij een grondige renovatie: kies het renovatiejaar."
          helpId={fid("bouwjaar-help")}
          name="bouwjaar"
          id={fid("bouwjaar")}
          options={BOUWJAREN}
          value={values.bouwjaar}
          onChange={(v) => set("bouwjaar", v)}
          error={err("bouwjaar")}
          errorId={fid("bouwjaar-error")}
        />
        <ChoiceGroup
          legend="Hoe verwarm je nu?"
          name="verwarming"
          id={fid("verwarming")}
          options={VERWARMINGEN}
          value={values.verwarming}
          onChange={(v) => set("verwarming", v)}
          error={err("verwarming")}
          errorId={fid("verwarming-error")}
        />

        <fieldset className={styles.fieldset} aria-describedby={describedBy("verbruikWaarde", true)}>
          <legend className={styles.legend}>Hoeveel verbruik je ongeveer?</legend>
          <p className={styles.help} id={fid("verbruikWaarde-help")}>
            Je vindt dit op je jaarafrekening of in de app van je leverancier. Geen idee? Geen probleem – kies &lsquo;Ik weet het niet&rsquo;, we zoeken
            het samen uit.
          </p>
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
            <div className={styles.inline}>
              <div className={`${styles.inputWrap} ${err("verbruikWaarde") ? styles.invalid : ""}`}>
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
                  placeholder={values.verbruikType === "kwh" ? "bv. 3500" : "bv. 180"}
                  value={values.verbruikWaarde}
                  onChange={(e) => set("verbruikWaarde", e.target.value)}
                  onBlur={() => blur("verbruikWaarde")}
                  aria-invalid={err("verbruikWaarde") ? true : undefined}
                  aria-describedby={describedBy("verbruikWaarde", true)}
                  className={styles.input}
                />
                <span className={styles.suffix} aria-hidden="true">
                  {values.verbruikType === "kwh" ? "kWh/jaar" : "€/maand"}
                </span>
              </div>
              <button type="button" className={styles.linkButton} onClick={() => set("verbruikOnbekend", true)}>
                Ik weet het niet
              </button>
            </div>
          )}
          <FieldError id={fid("verbruikWaarde-error")} message={err("verbruikWaarde")} />
        </fieldset>

        <fieldset className={styles.fieldset} id={fid("interesse")} aria-describedby={describedBy("interesse", true)}>
          <legend className={styles.legend}>Waar wil je meer over weten?</legend>
          <p className={styles.help} id={fid("interesse-help")}>
            Kies gerust meerdere. We rekenen ze samen door – soms raden we er ook eentje af.
          </p>
          <div className={styles.chips}>
            {INTERESSE_OPTIONS.map((o) => {
              const checked = values.interesse.includes(o.value);
              return (
                <label key={o.value} className={`${styles.chip} ${checked ? styles.chipOn : ""} ${o.value === "advies" ? styles.chipAdvies : ""}`}>
                  <input
                    type="checkbox"
                    name="interesse"
                    value={o.value}
                    checked={checked}
                    onChange={(e) => toggleInteresse(o.value, e.target.checked)}
                    className={styles.visuallyHidden}
                  />
                  <span className={styles.chipCheck} aria-hidden="true">
                    <CheckIcon />
                  </span>
                  {o.label}
                </label>
              );
            })}
          </div>
          <FieldError id={fid("interesse-error")} message={err("interesse")} />
        </fieldset>

        <div className={`${styles.actions} ${styles.jsOnly}`}>
          <p className={styles.note}>Duurt minder dan een minuut.</p>
          <CtaPill type="button" variant="lime" onClick={goNext} block>
            Volgende stap
          </CtaPill>
        </div>
      </div>

      {/* ───────────── Stap 2 ───────────── */}
      <div className={styles.step} data-active={step === 2 || undefined}>
        <h3 ref={step === 2 ? stepHeadingRef : undefined} tabIndex={-1} className={styles.stepTitle}>
          Jouw gegevens
        </h3>
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
            help="Hier sturen we je berekening naartoe."
            helpId={fid("email-help")}
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
            help="Een ingenieur belt je om een paar details te checken. Geen callcenter, geen verkooppraatjes."
            helpId={fid("telefoon-help")}
            value={values.telefoon}
            onChange={(v) => set("telefoon", v)}
            onBlur={() => blur("telefoon")}
            error={err("telefoon")}
            errorId={fid("telefoon-error")}
          />
          <TextField
            label="Postcode van de woning"
            id={fid("postcode")}
            name="postcode"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={4}
            help="Zo weten we welke netbeheerder en premies bij jou horen."
            helpId={fid("postcode-help")}
            value={values.postcode}
            onChange={(v) => set("postcode", v)}
            onBlur={() => blur("postcode")}
            error={err("postcode")}
            errorId={fid("postcode-error")}
            info={!err("postcode") ? info : undefined}
          />
        </div>

        {variant === "contact" && (
          <div className={styles.grid}>
            <ChoiceGroup
              legend="Hoe mogen we je contacteren?"
              name="voorkeur"
              id={fid("voorkeur")}
              options={VOORKEUREN}
              value={values.voorkeur}
              onChange={(v) => set("voorkeur", v)}
              error={err("voorkeur")}
              errorId={fid("voorkeur-error")}
            />
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

        <div className={styles.field}>
          <label htmlFor={fid("opmerking")} className={styles.label}>
            Wil je nog iets kwijt? <span className={styles.optional}>(optioneel)</span>
          </label>
          <textarea
            id={fid("opmerking")}
            name="opmerking"
            rows={4}
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
      </div>
    </form>
  );
}

// ───────────────────────── Field parts ─────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className={styles.error} id={id}>
      <AlertIcon className={styles.errorIcon} />
      {message}
    </p>
  );
}

function ChoiceGroup({
  legend,
  help,
  helpId,
  name,
  id,
  options,
  value,
  onChange,
  error,
  errorId,
}: {
  legend: string;
  help?: string;
  helpId?: string;
  name: string;
  id: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  errorId: string;
}) {
  return (
    <fieldset className={styles.fieldset} id={id} aria-describedby={[help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined}>
      <legend className={styles.legend}>{legend}</legend>
      {help && (
        <p className={styles.help} id={helpId}>
          {help}
        </p>
      )}
      <div className={`${styles.chips} ${error ? styles.chipsInvalid : ""}`}>
        {options.map((o) => (
          <label key={o} className={`${styles.chip} ${value === o ? styles.chipOn : ""}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className={styles.visuallyHidden} />
            <span className={styles.chipCheck} aria-hidden="true">
              <CheckIcon />
            </span>
            {o}
          </label>
        ))}
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
