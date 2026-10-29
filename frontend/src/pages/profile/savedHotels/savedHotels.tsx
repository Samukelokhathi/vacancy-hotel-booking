import type { Hotel } from "../../../models/hotel.types";
import styles from "../profilePage.module.css";

interface SavedHotelsProps {
  favorites: Hotel[];
}

export default function SavedHotels({ favorites }: SavedHotelsProps) {
  return (
    <div className={styles.favoritesFlexContainer}>
      <h3 className={styles.subTitleHeading}>Saved Hotels</h3>
      <div className={styles.favoritesGrid}>
        {favorites.map((hotel) => (
          <div key={hotel.id} className={styles.favCardRow}>
            <img src={hotel.coverImage || "https://unsplash.com"} alt="" />
            <div>
              <h4>{hotel.name}</h4>
              <p>
                {hotel.city} • R {hotel.pricePerNight} / night
              </p>
            </div>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className={styles.emptyStateFallback}>
            No hotels pinned to your favorites collections yet.
          </p>
        )}
      </div>
    </div>
  );
}
