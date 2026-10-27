import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotelDetails } from "../../store/hotelSlice";
import { formatPrice } from "../../utils/format";
import PhotoGallery from "../../components/photoGallery/photoGallery";
import HotelMap from "../../components/hotelMap/hotelMap";
import ShareButton from "../../components/shareButton/shareButton";
import StarRating from "../../components/starRating/starRating";
import FacilitiesList from "../../components/facilitieslist/facilitieslist";
import BookingForm from "../../components/bookingForm/bookingForm";
import styles from "./hotelDetailsPage.module.css";

export default function HotelDetailsPage() {
  const { id } = useParams();
  const hotelId = Number(id);
  const dispatch = useDispatch<AppDispatch>();
  const { selected, isLoading, error } = useSelector(
    (state: RootState) => state.hotels,
  );

  useEffect(() => {
    dispatch(fetchHotelDetails(hotelId));
  }, [dispatch, hotelId]);

  if (error) return <p className={styles.errorMessage}>{error}</p>;

  // also covers the moment between two hotels, so the old one never flashes
  if (isLoading || !selected || selected.hotel.id !== hotelId) {
    return <p className={styles.message}>Loading hotel...</p>;
  }

  const { hotel, images, rooms } = selected;

  return (
    <div className={styles.layout}>
      {/* LEFT: photos and details */}
      <div className={styles.main}>
        <PhotoGallery images={images} />

        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.name}>{hotel.name}</h1>
            <p className={styles.meta}>
              <StarRating value={hotel.starRating} />
              <span className={styles.address}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {hotel.address}, {hotel.city}
              </span>
            </p>
          </div>

          {/* more buttons (like Save) can go in here later */}
          <div className={styles.actions}>
            <ShareButton title={hotel.name} />
          </div>
        </div>

        {hotel.description && (
          <p className={styles.description}>{hotel.description}</p>
        )}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Facilities</h2>
          <FacilitiesList facilities={hotel.facilities} />
        </section>

        <div className={styles.twoColumns}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Policies</h2>
            <p className={styles.policies}>
              {hotel.policies || "No policies listed."}
            </p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Location</h2>
            <HotelMap
              latitude={hotel.latitude}
              longitude={hotel.longitude}
              name={hotel.name}
            />
          </section>
        </div>
      </div>

      {/* RIGHT: price and booking card */}
      <aside className={styles.sidebar}>
        <p className={styles.price}>
          {formatPrice(hotel.pricePerNight)} <span>/ night</span>
        </p>
        <BookingForm rooms={rooms} />
      </aside>
    </div>
  );
}
