import type { CSSProperties } from "react";
import { TEAM_GROUPS, type TeamMemberContent } from "@/content/team";
import { Tag } from "@/components/ui/Bits";
import Reveal from "@/components/motion/Reveal";
import styles from "./TeamGrid.module.css";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/** /team grid (05 §7.3): engineers first, portrait 4:5 silhouette (no AI faces), anchor id = slug. */
export default function TeamGrid({ members }: { members: TeamMemberContent[] }) {
  return (
    <div className={styles.wrap}>
      {TEAM_GROUPS.map((g) => {
        const list = members.filter((m) => m.group === g.key);
        if (list.length === 0) return null;
        return (
          <section key={g.key} className={styles.group} aria-labelledby={`team-${g.key}`}>
            <div className={styles.head}>
              <h2 id={`team-${g.key}`} className={styles.groupTitle}>
                {g.title}
              </h2>
              <p className={`${styles.groupIntro} desktop-only`}>{g.intro}</p>
            </div>
            <Reveal as="ul" mode="group" stagger={110} className={`${styles.grid} ${g.key === "ingenieurs" ? styles.gridLead : ""}`}>
              {list.map((m, i) => (
                <li key={m.slug} id={m.slug} className={styles.item} data-reveal-item style={{ "--i": i } as CSSProperties}>
                  <article className={styles.card}>
                    <div className={styles.portrait} aria-hidden="true">
                      <svg viewBox="0 0 100 125" className={styles.silhouette}>
                        <circle cx="50" cy="44" r="20" />
                        <path d="M12 125c2-26 18-42 38-42s36 16 38 42Z" />
                      </svg>
                      <span className={styles.initials}>{initials(m.name)}</span>
                    </div>
                    <div className={styles.body}>
                      <h3 className={styles.name}>{m.name}</h3>
                      <p className={styles.role}>{m.role}</p>
                      {m.personalLine && <p className={styles.quote}>“{m.personalLine}”</p>}
                      <p className={`${styles.home} desktop-only`}>
                        <span className={styles.homeLabel}>Bij jou thuis</span>
                        {m.atYourHome}
                      </p>
                      {m.certifications && (
                        <ul className={`${styles.tags} desktop-only`}>
                          {m.certifications.map((c) => (
                            <li key={c}>
                              <Tag size="sm" tone="light">
                                {c}
                              </Tag>
                            </li>
                          ))}
                        </ul>
                      )}
                      {m.installationsCount && (
                        <p className={styles.count}>
                          Rekende al {new Intl.NumberFormat("nl-BE").format(m.installationsCount)} installaties door <span className={styles.ph}>· voorbeeldcijfer</span>
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
