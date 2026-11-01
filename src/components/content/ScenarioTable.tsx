import type { Scenario } from "@/content/projects";
import styles from "./ScenarioTable.module.css";

const verdictLabel: Record<Scenario["verdict"], string> = {
  gekozen: "Gekozen",
  afgeraden: "Afgeraden",
  referentie: "Vergelijkingspunt",
  optie: "Doorgerekend",
};

/**
 * Builder 3 – the scenarios we laid next to each other for a (placeholder) project, incl.
 * "niets doen" and what we advised against. Real <table>; below 900px each row becomes a card.
 */
export default function ScenarioTable({ scenarios, caption }: { scenarios: Scenario[]; caption: string }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Scenario</th>
            <th scope="col">Investering</th>
            <th scope="col">Factuur per maand</th>
            <th scope="col">Terugverdientijd</th>
            <th scope="col">Ons advies</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => (
            <tr key={s.name} className={styles[s.verdict]}>
              <th scope="row" className={styles.name}>
                {s.name}
                <span className={styles.note}>{s.note}</span>
              </th>
              <td data-label="Investering">{s.invest}</td>
              <td data-label="Factuur per maand" className={styles.money}>
                {s.perMonth}
              </td>
              <td data-label="Terugverdientijd">{s.payback}</td>
              <td data-label="Ons advies">
                <span className={`${styles.verdict} ${styles[`v_${s.verdict}`]}`}>{verdictLabel[s.verdict]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.foot}>Voorbeeldproject · indicatieve bedragen, berekend met vlakke prijzen.</p>
    </div>
  );
}
