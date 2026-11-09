import { useState } from "react";
import { Link } from "react-router-dom";
import type { Hotel } from "../../models/hotel.types";
import { formatPrice } from "../../utils/format";
import { resolveImageUrl } from "../../utils/imageUrl";
import FavoriteButton from "../favoriteButton/favoriteButton";
import { BuildingIcon, StarIcon } from "../icons/icons";
import styles from "./hotelCard.module.css";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const coverImageUrl = resolveImageUrl(hotel.coverImage);
  const isTopRated = hotel.starRating >= 5;

  return (
    <article className={styles.card}>
      <Link to={`/hotels/${hotel.id}`} className={styles.cardLink}>
        <div className={styles.media}>
          {coverImageUrl && !imageFailed ? (
            <img
              src={coverImageUrl}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={styles.noImage}>
              <BuildingIcon size={28} />
            </div>
          )}
          {isTopRated && <span className={styles.badge}>Top rated</span>}
        </div>

        <div className={styles.details}>
          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <p className={styles.location}>Hotel in {hotel.city}</p>
          <p className={styles.priceLine}>
            <span>
              <strong>{formatPrice(hotel.pricePerNight)}</strong> night
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={styles.rating}
              aria-label={`${hotel.starRating}-star hotel`}
            >
              <StarIcon size={10} />
              {hotel.starRating}
            </span>
          </p>
        </div>
      </Link>

      <FavoriteButton
        hotelId={hotel.id}
        hotelName={hotel.name}
        variant="overlay"
      />
    </article>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.media} ${styles.shimmer}`} />
      <div className={styles.details}>
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineShort} ${styles.shimmer}`}
        />
      </div>
    </div>
  );
}
