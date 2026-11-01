import { MYTHS, type Myth } from "@/content/facts";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import { FactNote } from "@/components/ui/Facts";
import Reveal from "@/components/motion/Reveal";
import styles from "./MythBuster.module.css";

export function getMyths(keys: string[]): Myth[] {
  return keys.map((k) => MYTHS.find((m) => m.key === k)).filter((m): m is Myth => !!m);
}

/**
 * Per myth: "Wat je hoort → Wat de cijfers zeggen → Wanneer het wél klopt" (from MYTHS in
 * facts.ts). Use under a Statement, or standalone via <MythBuster>.
 */
export function MythList({ keys, tone = "light" }: { keys: string[]; tone?: "light" | "dark" }) {
  const myths = getMyths(keys);
  return (
    <Reveal as="ol" mode="group" stagger={150} className={`${styles.list} ${tone === "dark" ? styles.dark : ""}`}>
      {myths.map((m) => (
        <li key={m.key} className={styles.item} data-reveal-item>
          <div className={styles.col}>
            <p className={styles.label}>Wat je hoort</p>
            <p className={styles.myth}>“{m.myth}”</p>
          </div>
          <div className={styles.col}>
            <p className={styles.label}>Wat de cijfers zeggen</p>
            <p className={styles.answer}>{m.answer}</p>
            <FactNote keys={m.facts} variant="footnote" tone={tone} className={styles.note} />
          </div>
          <div className={`${styles.col} ${styles.honest}`}>
            <p className={styles.label}>Wanneer het wél klopt</p>
            <p className={styles.whenTrue}>{m.whenTrue}</p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}

/** Section wrapper: intro + MythList. W (default) or D. */
export default function MythBuster({ intro, keys, bg = "W", id }: { intro: IntroProps; keys: string[]; bg?: "W" | "D"; id?: string }) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "myths-title";
  return (
    <Section bg={bg} id={id} labelledBy={titleId}>
      <SectionIntro {...intro} tone={tone} titleId={titleId} />
      <div className={styles.wrap}>
        <MythList keys={keys} tone={tone} />
      </div>
    </Section>
  );
}
