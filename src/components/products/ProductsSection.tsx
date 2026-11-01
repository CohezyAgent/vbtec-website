import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { routes } from "@/lib/routes";
import { BatteryIcon, CarIcon, FanIcon, PulseIcon, SunIcon } from "./icons";
import styles from "./Products.module.css";

/*
 * Each card is one image (card outline + product, which overlaps the edge),
 * measured on the reference design. The label and icon are drawn on top.
 * w = image width; text = label x; size = label size; icon = icon centre x
 * (reference px). Like the reference, longer labels are set a little smaller.
 */
const products = [
  {
    label: "Zonnepanelen",
    href: routes.service("zonnepanelen"),
    image: "/images/h-solar.jpg",
    alt: "Een zonnepaneel",
    w: 382,
    text: 119,
    size: 25,
    icon: 324,
    Icon: SunIcon,
  },
  {
    label: "Omvormers",
    href: routes.service("omvormers"),
    image: "/images/h-inverter.jpg",
    alt: "Een witte omvormer",
    w: 371,
    text: 137,
    size: 23.8,
    icon: 313,
    Icon: PulseIcon,
  },
  {
    label: "Thuisbatterijen",
    href: routes.service("thuisbatterij"),
    image: "/images/h-battery.jpg",
    alt: "Een witte thuisbatterij",
    w: 371,
    text: 127,
    size: 22,
    icon: 313,
    Icon: BatteryIcon,
  },
  {
    label: "Laadpalen",
    href: routes.service("laadpalen"),
    image: "/images/h-charger.jpg",
    alt: "Een zwarte laadpaal",
    w: 367,
    text: 128,
    size: 25.6,
    icon: 308,
    Icon: CarIcon,
  },
  {
    label: "Warmtepompen",
    href: routes.service("lucht-water-warmtepomp"),
    image: "/images/h-heatpump.jpg",
    alt: "Een buitenunit van een warmtepomp",
    w: 391,
    text: 158,
    size: 18.5,
    icon: 332,
    Icon: FanIcon,
  },
];

// Extra services without a product cut-out yet (05 §0.3-5): shown as tags.
const extra = [
  { label: "PVT-panelen", href: routes.service("pvt-panelen") },
  { label: "Airco (lucht-lucht)", href: routes.service("lucht-lucht-warmtepomp") },
];

export default function ProductsSection() {
  return (
    <section className={styles.section} aria-labelledby="products-heading" data-header-tone="light">
      <ul className={styles.row}>
        {products.map(({ label, href, image, alt, w, text, size, icon, Icon }) => (
          <li
            key={label}
            className={styles.item}
            style={
              { "--w": w, "--text-x": text, "--size": size, "--icon-x": icon } as CSSProperties
            }
          >
            <Link href={href} className={styles.link}>
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 700px) 90vw, 20vw"
                quality={90}
                className={styles.image}
              />
              <span className={styles.label}>{label}</span>
              <span className={styles.iconCircle}>
                <Icon className={styles.icon} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.strip}>
        <h2 id="products-heading" className={styles.stripTitle}>
          Eén systeem, niet één product
        </h2>
        <p className={styles.extra}>
          <span className={styles.extraLabel}>Ook:</span>
          {extra.map((e) => (
            <Link key={e.href} href={e.href} className={styles.extraTag}>
              {e.label}
            </Link>
          ))}
          <Link href={routes.diensten()} className={styles.allLink}>
            Alle diensten
          </Link>
        </p>
      </div>
    </section>
  );
}
