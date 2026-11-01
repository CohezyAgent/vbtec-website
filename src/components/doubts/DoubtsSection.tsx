import { Fragment, type CSSProperties } from "react";
import DoubtsScroller from "./DoubtsScroller";
import styles from "./Doubts.module.css";

type Doubt = {
  text: string;
  tone: "light" | "dark" | "lime";
  /** Position inside the section, in % of its width/height. */
  x: number;
  y: number;
  /** Anchor the pill to the right instead of the left (keeps right-side pills on screen). */
  fromRight?: boolean;
  hideOnMobile?: boolean;
  /** Phone position (left %, top %), used below 900px. */
  mobile?: [number, number];
};

const doubts: Doubt[] = [
  { text: "Is dat niet veel te duur?", tone: "light", x: 7, y: 13, mobile: [5, 8] },
  { text: "Verdien ik dat ooit wel terug?", tone: "dark", x: 33, y: 7, mobile: [24, 17] },
  { text: "Mijn dak is vast niet geschikt", tone: "light", x: 9, y: 13, fromRight: true, mobile: [8, 26] },
  { text: "Wat als de subsidie verdwijnt?", tone: "lime", x: 4, y: 27, fromRight: true, hideOnMobile: true },
  { text: "Werken zonnepanelen wel als het bewolkt is?", tone: "light", x: 3, y: 29, hideOnMobile: true },
  { text: "Al dat papierwerk en die vergunningen…", tone: "dark", x: 3, y: 64, fromRight: true, hideOnMobile: true },
  { text: "Wie helpt me als er iets kapot gaat?", tone: "lime", x: 9, y: 70, mobile: [4, 68] },
  { text: "Welke installateur kan ik vertrouwen?", tone: "light", x: 30, y: 85, mobile: [16, 77] },
  { text: "Is die techniek over 2 jaar niet verouderd?", tone: "dark", x: 7, y: 75, fromRight: true, mobile: [4, 86] },
  { text: "Het terugleverbeleid verandert steeds", tone: "light", x: 16, y: 88, fromRight: true, hideOnMobile: true },
];

const HEADING = "Dit is waarom je twijfelt over groene energie.";

export default function DoubtsSection() {
  return (
    <section className={styles.section} aria-labelledby="doubts-heading">
      <DoubtsScroller className={styles.stage}>
        <div className={styles.center}>
          {/* The eyebrow sits above the headline without shifting it, so the headline is exactly centered. */}
          <div className={styles.headingWrap}>
            <p className={styles.eyebrow} data-eyebrow>
              Herkenbaar?
            </p>
            <h2 id="doubts-heading" className={styles.heading}>
              {HEADING.split(" ").map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className={styles.word} data-word>
                    {word}
                  </span>
                </Fragment>
              ))}
            </h2>
          </div>
        </div>

        {/* Hand that flicks the pile of doubts away once they have gathered. */}
        <video
          className={styles.hand}
          src="/videos/hand-flick.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          data-hand
        />

        <ul className={styles.doubts} aria-label="Veelgehoorde twijfels">
          {doubts.map((d, i) => (
            <li
              key={d.text}
              className={[styles.doubt, styles[d.tone], d.hideOnMobile ? styles.desktopOnly : ""].join(" ")}
              data-doubt
              style={
                {
                  "--i": i,
                  "--x": `${d.x}%`,
                  "--y": `${d.y}%`,
                  "--mx": `${d.mobile?.[0] ?? d.x}%`,
                  "--my": `${d.mobile?.[1] ?? d.y}%`,
                  "--float": `${5 + (i % 4)}s`,
                  "--float-delay": `${(i * 0.7) % 3}s`,
                  [d.fromRight ? "right" : "left"]: "var(--x)",
                } as CSSProperties
              }
            >
              <span className={styles.pill}>
                <span className={styles.quote} aria-hidden="true">
                  “
                </span>
                {d.text}
              </span>
            </li>
          ))}
        </ul>
      </DoubtsScroller>
    </section>
  );
}
