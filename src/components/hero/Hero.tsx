import Image from "next/image";
import Link from "next/link";
import HighlightsSlider from "./HighlightsSlider";
import { ArrowUpRight, SolarLogo } from "./icons";
import styles from "./Hero.module.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
];

export default function Hero() {
  return (
    <section className={styles.frame}>
      <div className={styles.hero}>
        <Image
          src="/images/hero-solar.jpg"
          alt="Solar panel field with a red freight train passing behind it"
          fill
          preload
          sizes="100vw"
          quality={90}
          className={styles.bg}
        />

        <header className={styles.header}>
          <Link href="/" className={styles.logo} aria-label="Enerza home">
            <SolarLogo className={styles.logoIcon} />
            <span>Enerza</span>
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className={i === 0 ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
                aria-current={i === 0 ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="#contact" className={styles.ctaGroup}>
            <span className={styles.contactPill}>Contact Us</span>
            <span className={styles.contactArrow}>
              <ArrowUpRight className={styles.arrowIcon} />
            </span>
          </Link>
        </header>

        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.badge}>
              <SolarLogo className={styles.badgeIcon} />
              Power from the Sun
            </p>
            <h1 className={styles.title}>
              Smarter Energy
              <br />
              for Modern Living
            </h1>
            <Link href="#get-started" className={styles.startGroup}>
              <span className={styles.startPill}>Get Started</span>
              <span className={styles.startArrow}>
                <ArrowUpRight className={styles.arrowIcon} />
              </span>
            </Link>
          </div>

          <HighlightsSlider />
        </div>
      </div>
    </section>
  );
}
