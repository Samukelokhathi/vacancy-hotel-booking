import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import HotelCard from "../../components/hotelCard/hotelCard";
import styles from "./homePage.module.css";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, isLoading, error } = useSelector(
    (state: RootState) => state.hotels,
  );

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  return (
    <>
      <h1>Find your next stay</h1>
      <p className="muted">Browse available hotels.</p>

      {isLoading && <p>Loading hotels...</p>}
      {error && <p className="error-text">{error}</p>}
      {!isLoading && !error && hotels.length === 0 && (
        <p className="muted">No hotels available yet.</p>
      )}

      <div className={styles.grid}>
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}
