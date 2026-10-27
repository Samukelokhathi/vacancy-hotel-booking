import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import HotelFiltersBar from "../../components/hotelFilters/hotelFilters";
import HotelCard from "../../components/hotelCard/hotelCard";
import {
  filterHotels,
  filtersFromParams,
  filtersToParams,
  type HotelFilters,
} from "../../utils/hotelFilters";
import styles from "./homePage.module.css";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, isLoading, error } = useSelector(
    (state: RootState) => state.hotels,
  );

  const [params, setParams] = useSearchParams();
  const filters = filtersFromParams(params);
  const hasFilters = params.toString() !== "";

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleSearch = (newFilters: HotelFilters) => {
    setParams(filtersToParams(newFilters));
  };

  const filteredHotels = filterHotels(hotels, filters);
  const count = filteredHotels.length;

  const showSkeletons = isLoading && hotels.length === 0;
  const showList = !showSkeletons && !error;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Find your next stay</h1>
        <p className={styles.subtitle}>
          Compare hotels across South Africa and book in a few clicks.
        </p>
      </section>

      <HotelFiltersBar
        key={params.toString()}
        initial={filters}
        onSearch={handleSearch}
      />

      <section className={styles.listing}>
        <h2 className={styles.sectionTitle}>Available hotels</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {isLoading && hotels.length === 0 && (
          <p className={styles.message}>Loading hotels...</p>
        )}

        {showList && (
          <p className={styles.count}>
            {count} {count === 1 ? "hotel" : "hotels"} found
            {hasFilters && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setParams({})}
              >
                Clear filters
              </button>
            )}
          </p>
        )}

        <div className={styles.grid}>
          {showSkeletons &&
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}

          {showList &&
            filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>

        {showList && count === 0 && (
          <p className={styles.message}>No hotels match your filters.</p>
        )}
      </section>
    </div>
  );
}
