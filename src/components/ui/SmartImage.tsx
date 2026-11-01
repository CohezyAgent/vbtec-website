import Image from "next/image";
import type { ImageInput, ImageRatio } from "@/content/types";
import { resolveImage } from "@/content/images";
import styles from "./SmartImage.module.css";

type Props = {
  image: ImageInput;
  /** Honest sizes per layout, e.g. "(max-width: 900px) 100vw, 30vw". */
  sizes: string;
  /** Only for the first hero image of a page. */
  preload?: boolean;
  quality?: 75 | 90;
  /** Aspect-ratio box. Omit together with `fill` to fill a positioned parent. */
  ratio?: ImageRatio;
  /** Fill the nearest positioned parent (no ratio box). */
  fill?: boolean;
  /** Slow scroll-linked drift ±6% (CSS scroll-driven; static elsewhere). */
  parallax?: boolean;
  className?: string;
  imgClassName?: string;
  /** Override alt (rare – alt lives in images.ts). */
  alt?: string;
};

/**
 * next/image wrapper (05 §8.2 SmartImage – also exported as `Img`): resolves an ImageKey
 * from content/images.ts, slate placeholder background, object-fit cover + focal point.
 */
export default function SmartImage({ image, sizes, preload, quality = 75, ratio, fill, parallax, className, imgClassName, alt }: Props) {
  const img = resolveImage(image);
  const style = img.focal ? { objectPosition: img.focal } : undefined;
  const pic = (
    <Image
      src={img.src}
      alt={alt ?? img.alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={preload}
      className={`${styles.img} ${parallax ? styles.parallax : ""} ${imgClassName ?? ""}`}
      style={style}
    />
  );
  if (fill && !ratio) {
    return <span className={`${styles.fill} ${className ?? ""}`}>{pic}</span>;
  }
  return (
    <span className={`${styles.box} ${className ?? ""}`} style={{ aspectRatio: (ratio ?? "16/9").replace("/", " / ") }}>
      {pic}
    </span>
  );
}

export { SmartImage as Img };
