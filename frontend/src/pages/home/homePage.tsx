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

  const showSkeletons = isLoading && hotels.length === 0;

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.title}>Find your next stay</h1>
        <p className={styles.subtitle}>
          Browse hand-picked hotels and book in minutes.
        </p>
      </section>

      {error && <p className="error-text">{error}</p>}

      {!isLoading && !error && (
        <p className={styles.count}>
          {hotels.length} hotel{hotels.length === 1 ? "" : "s"} found
        </p>
      )}

      <div className={styles.grid}>
        {showSkeletons &&
          Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}

        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}