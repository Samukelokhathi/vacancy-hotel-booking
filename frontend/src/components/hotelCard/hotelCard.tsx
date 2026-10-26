import { Link } from "react-router-dom";
import type { Hotel } from "../../models/hotel.types";
import { formatPrice } from "../../utils/format";
import StarRating from "../starRating/starRating";
import styles from "./hotelCard.module.css";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className={styles.card}>
      {hotel.coverImage ? (
        <img className={styles.image} src={hotel.coverImage} alt={hotel.name} />
      ) : (
        <div className={styles.noImage}>No photo yet</div>
      )}

      <div className={styles.body}>
        <h3 className={styles.name}>{hotel.name}</h3>

        <p className={styles.cityRow}>
          {hotel.city}
          <span className={styles.dot}>·</span>
          <StarRating value={hotel.starRating} />
        </p>

        <div className={styles.footer}>
          <p className={styles.price}>
            {formatPrice(hotel.pricePerNight)}
            <span className={styles.perNight}> / night</span>
          </p>

          <Link className={styles.button} to={`/hotels/${hotel.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
