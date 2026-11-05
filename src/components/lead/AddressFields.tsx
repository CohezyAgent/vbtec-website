"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import type { FieldErrors, LeadField } from "@/lib/lead-schema";
import { AlertIcon, InfoIcon } from "@/components/ui/icons";
import { resolveAddress, suggestAddresses, type AddressSuggestion } from "./address-lookup";
import styles from "./Lead.module.css";

type AdresKey = "straat" | "huisnummer" | "postcode" | "gemeente";
type Adres = Record<AdresKey, string>;

type Props = {
  values: Adres;
  errors: FieldErrors;
  fid: (name: string) => string;
  onChange: (key: AdresKey, value: string) => void;
  /** Fills several fields at once after picking a suggestion. */
  onPick: (patch: Partial<Adres>) => void;
  onBlur: (field: LeadField) => void;
  info?: ReactNode;
};

const DEBOUNCE_MS = 250;

/**
 * "Adres van de woning": straat (combobox with Belgian address suggestions), huisnummer,
 * postcode, gemeente. Picking a suggestion fills all four; typing by hand always works.
 */
export default function AddressFields({ values, errors, fid, onChange, onPick, onBlur, info }: Props) {
  const [items, setItems] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const ctrl = useRef<AbortController | null>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const listId = fid("adres-list");

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      ctrl.current?.abort();
    },
    [],
  );

  const search = (q: string) => {
    window.clearTimeout(timer.current);
    ctrl.current?.abort();
    if (q.trim().length < 3) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(async () => {
      const c = new AbortController();
      ctrl.current = c;
      try {
        const res = await suggestAddresses(q, c.signal);
        if (c.signal.aborted) return;
        setItems(res);
        setActive(-1);
        setOpen(res.length > 0);
      } catch {
        /* aborted by a newer keystroke */
      } finally {
        if (!c.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  const choose = async (s: AddressSuggestion) => {
    setOpen(false);
    setActive(-1);
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    const r = await resolveAddress(s, c.signal);
    onPick({
      straat: r.straat,
      ...(r.huisnummer ? { huisnummer: r.huisnummer } : {}),
      ...(r.postcode ? { postcode: r.postcode } : {}),
      ...(r.gemeente ? { gemeente: r.gemeente } : {}),
    });
    // No house number in the suggestion: that's the next thing to type.
    if (!r.huisnummer && !values.huisnummer) numberRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && items.length) setOpen(true);
      setActive((i) => (items.length ? (i + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1));
    } else if (e.key === "Enter" && open && active >= 0) {
      // Pick instead of submitting the step.
      e.preventDefault();
      void choose(items[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  const err = (f: AdresKey) => errors[f];
  const described = (f: AdresKey, extra?: string) => [extra, err(f) ? fid(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset className={`${styles.fieldset} ${styles.adres}`}>
      <legend className={styles.visuallyHidden}>Adres van de woning</legend>
      <div className={styles.adresGrid}>
        <div className={`${styles.field} ${styles.adresStreet}`}>
          <label htmlFor={fid("straat")} className={styles.label}>
            Straat
          </label>
          <div className={styles.combo}>
            <input
              id={fid("straat")}
              name="straat"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="address-line1"
              placeholder="Begin te typen, bv. Kerkstraat 1 Gent"
              value={values.straat}
              onChange={(e) => {
                onChange("straat", e.target.value);
                search(e.target.value);
              }}
              onKeyDown={onKeyDown}
              onFocus={() => items.length > 0 && values.straat.trim().length >= 3 && setOpen(true)}
              onBlur={() => {
                setOpen(false);
                onBlur("straat");
              }}
              aria-invalid={err("straat") ? true : undefined}
              aria-describedby={described("straat", fid("adres-hint"))}
              className={`${styles.input} ${styles.inputSolo} ${err("straat") ? styles.invalid : ""}`}
            />
            {loading && <span className={styles.comboSpinner} aria-hidden="true" />}
            <ul id={listId} role="listbox" aria-label="Adressuggesties" className={styles.comboList} hidden={!open}>
              {items.map((s, i) => (
                <li
                  key={s.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={styles.comboOption}
                  data-active={i === active || undefined}
                  // mousedown (not click) so the input's blur doesn't close the list first
                  onMouseDown={(e) => {
                    e.preventDefault();
                    void choose(s);
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <PinIcon />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.help} id={fid("adres-hint")}>
            We vullen postcode en gemeente automatisch aan.
          </p>
          <FieldError id={fid("straat-error")} message={err("straat")} />
        </div>

        <SmallField label="Nr." name="huisnummer" fid={fid} value={values.huisnummer} error={err("huisnummer")} inputRef={numberRef} autoComplete="address-line2" placeholder="12" area={styles.adresNr} onChange={(v) => onChange("huisnummer", v)} onBlur={() => onBlur("huisnummer")} described={described("huisnummer")} />
        <SmallField label="Postcode" name="postcode" fid={fid} value={values.postcode} error={err("postcode")} autoComplete="postal-code" inputMode="numeric" maxLength={4} placeholder="9000" area={styles.adresZip} onChange={(v) => onChange("postcode", v)} onBlur={() => onBlur("postcode")} described={described("postcode")} />
        <SmallField label="Gemeente" name="gemeente" fid={fid} value={values.gemeente} error={err("gemeente")} autoComplete="address-level2" placeholder="Gent" area={styles.adresCity} onChange={(v) => onChange("gemeente", v)} onBlur={() => onBlur("gemeente")} described={described("gemeente")} />
      </div>
      <p className={styles.visuallyHidden} role="status" aria-live="polite">
        {open ? `${items.length} adressen gevonden. Gebruik de pijltjestoetsen om te kiezen.` : ""}
      </p>
      {info && (
        <p className={styles.info} role="status">
          <InfoIcon className={styles.errorIcon} />
          {info}
        </p>
      )}
    </fieldset>
  );
}

function SmallField({
  label,
  name,
  fid,
  value,
  error,
  inputRef,
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  onChange,
  onBlur,
  described,
  area,
}: {
  label: string;
  name: AdresKey;
  fid: (n: string) => string;
  value: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  autoComplete: string;
  inputMode?: "numeric";
  maxLength?: number;
  placeholder: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  described?: string;
  area: string;
}) {
  return (
    <div className={`${styles.field} ${area}`}>
      <label htmlFor={fid(name)} className={styles.label}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={fid(name)}
        name={name}
        type="text"
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={described}
        className={`${styles.input} ${styles.inputSolo} ${error ? styles.invalid : ""}`}
      />
      <FieldError id={fid(`${name}-error`)} message={error} />
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.comboPin} aria-hidden="true" focusable="false">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
