import { Link } from "react-router-dom";
import type { Hotel } from "../../models/hotel.types";
// import { formatPrice } from "../../utils/format";
import StarRating from "../starRating/starRating";
import styles from "./hotelCard.module.css";

export const formatPrice = (amount: number): string =>
  `R${amount.toLocaleString("en-ZA")}`;

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className={styles.card}>
      {hotel.coverImage ? (
        <img src={hotel.coverImage} alt={hotel.name} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>No photo yet</div>
      )}

      <div className={styles.body}>
        <h3>{hotel.name}</h3>
        <p className="muted">{hotel.city}</p>
        <StarRating value={hotel.starRating} />

        <div className={styles.footer}>
          <p className={styles.price}>
            {formatPrice(hotel.pricePerNight)} <span>/ night</span>
          </p>
          <Link to={`/hotels/${hotel.id}`} className={styles.button}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
