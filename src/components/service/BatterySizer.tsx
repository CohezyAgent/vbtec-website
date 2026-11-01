"use client";

import { useState, type ReactNode } from "react";
import type { SizerProfile } from "@/content/services";
import { BatteryIcon, CheckIcon } from "@/components/ui/icons";
import styles from "./BatterySizer.module.css";

// Signature widget for /diensten/thuisbatterij (05 §3.1): profile chips → indicative advice,
// including the honest outcome "Geen batterij". All results stay in the DOM (hidden when inactive).

export default function BatterySizer({ profiles, notes, link }: { profiles: SizerProfile[]; notes: Record<string, ReactNode>; link?: ReactNode }) {
  const [active, setActive] = useState(profiles[1]?.key ?? profiles[0].key);
  return (
    <div className={styles.wrap}>
      <div className={styles.chips} role="group" aria-label="Welk profiel lijkt het meest op jullie?">
        {profiles.map((p) => (
          <button key={p.key} type="button" className={styles.chip} aria-pressed={p.key === active} onClick={() => setActive(p.key)}>
            <span className={styles.check} aria-hidden="true">
              <CheckIcon />
            </span>
            <span className={styles.chipLabel}>{p.label}</span>
            <span className={styles.chipHint}>{p.hint}</span>
          </button>
        ))}
      </div>
      <div className={styles.results} aria-live="polite">
        {profiles.map((p) => (
          <div key={p.key} hidden={p.key !== active} className={`${styles.result} ${p.result.noBattery ? styles.none : ""}`}>
            <div className={styles.gauge} aria-hidden="true">
              <BatteryIcon className={styles.gaugeIcon} />
              <span className={styles.gaugeFill} data-level={p.result.noBattery ? "0" : p.key} />
            </div>
            <div className={styles.copy}>
              <p className={styles.kicker}>{p.result.noBattery ? "Eerlijk advies" : "Richting van je berekening"}</p>
              <p className={styles.title}>{p.result.title}</p>
              <p className={styles.advice}>{p.result.advice}</p>
              {notes[p.key]}
            </div>
          </div>
        ))}
        {link && <div className={styles.link}>{link}</div>}
      </div>
    </div>
  );
}
