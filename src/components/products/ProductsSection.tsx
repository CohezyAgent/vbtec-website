import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Figtree } from "next/font/google";
import { BatteryIcon, CarIcon, FanIcon, PulseIcon, SunIcon } from "./icons";
import styles from "./Products.module.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-figtree",
});

/*
 * Each card is one image (card outline + product, which overlaps the edge),
 * measured on the reference design. The label and icon are drawn on top.
 * w = image width; text = label x; size = label size; icon = icon centre x
 * (reference px). Like the reference, longer labels are set a little smaller.
 */
const products = [
  {
    label: "Zonnepanelen",
    href: "#zonnepanelen",
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
    href: "#omvormers",
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
    href: "#thuisbatterijen",
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
    href: "#laadpalen",
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
    href: "#warmtepompen",
    image: "/images/h-heatpump.jpg",
    alt: "Een buitenunit van een warmtepomp",
    w: 391,
    text: 158,
    size: 18.5,
    icon: 332,
    Icon: FanIcon,
  },
];

export default function ProductsSection() {
  return (
    <section
      className={`${styles.section} ${figtree.variable}`}
      aria-label="Onze producten"
    >
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
              <h3 className={styles.label}>{label}</h3>
              <span className={styles.iconCircle}>
                <Icon className={styles.icon} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
