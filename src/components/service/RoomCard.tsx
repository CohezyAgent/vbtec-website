import type { RoomCardData } from "@/content/services";
import SmartImage from "@/components/ui/SmartImage";
import { CheckIcon } from "@/components/ui/icons";
import styles from "./RoomCard.module.css";

/** Rail card for /diensten/lucht-lucht-warmtepomp ("Per ruimte bekeken", 05 §3.1). */
export default function RoomCard({ room, index }: { room: RoomCardData; index: number }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <SmartImage image={room.image} fill sizes="(max-width: 900px) 82vw, 28vw" className={styles.img} />
        <span className={styles.num} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{room.room}</h3>
        <dl className={styles.rows}>
          <div>
            <dt>
              <CheckIcon className={styles.icon} /> Verwarmen
            </dt>
            <dd>{room.heat}</dd>
          </div>
          <div>
            <dt>
              <CheckIcon className={styles.icon} /> Koelen
            </dt>
            <dd>{room.cool}</dd>
          </div>
          <div className={styles.better}>
            <dt>Goed om te weten</dt>
            <dd>{room.better}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
