import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchFavoriteHotels } from "../../../store/favoriteSlice";
import HotelCard from "../../../components/hotelCard/hotelCard";
import { HeartIcon } from "../../../components/icons/icons";
import styles from "./savedHotels.module.css";

// The user's favourite hotels (GET /favorites)
export default function SavedHotels() {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteHotels, favoriteHotelIds, isLoading, error } = useSelector(
    (state: RootState) => state.favorites,
  );

  useEffect(() => {
    dispatch(fetchFavoriteHotels());
  }, [dispatch]);

  // hide a hotel straight away when its heart is clicked off
  const savedHotels = favoriteHotels.filter((hotel) =>
    favoriteHotelIds.includes(hotel.id),
  );

  if (error) {
    return (
      <p className={styles.errorMessage} role="alert">
        {error}
      </p>
    );
  }

  if (isLoading && savedHotels.length === 0) {
    return <p className={styles.loadingText}>Loading favourites…</p>;
  }

  if (savedHotels.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>
          <HeartIcon size={26} strokeWidth={1.8} />
        </span>
        <h3>No favourites yet</h3>
        <p>Tap the heart on a hotel to save it here.</p>
        <Link to="/home" className={styles.emptyButton}>
          Find a hotel
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.savedCount}>
        {savedHotels.length} saved{" "}
        {savedHotels.length === 1 ? "hotel" : "hotels"}
      </p>
      <div className={styles.hotelGrid}>
        {savedHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
