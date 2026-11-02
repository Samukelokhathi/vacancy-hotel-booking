import { useState } from "react";
import { Link } from "react-router-dom";
import type { Hotel } from "../../models/hotel.types";
import { formatPrice } from "../../utils/format";
import { resolveImageUrl } from "../../utils/imageUrl";
import StarRating from "../starRating/starRating";
import styles from "./hotelCard.module.css";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = resolveImageUrl(hotel.coverImage);
  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <article className={styles.card}>
      {showImage ? (
        <img
          className={styles.image}
          src={imageSrc!}
          alt={hotel.name}
          loading="lazy"
          onError={() => {
            console.error("Hotel card image failed to load", {
              hotelId: hotel.id,
              src: imageSrc,
            });
            setImageFailed(true);
          }}
        />
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
