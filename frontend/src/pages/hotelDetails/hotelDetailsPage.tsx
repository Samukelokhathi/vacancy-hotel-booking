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
import styles from "./hotelDetailsPage.module.css";
import BookingForm from "../../components/bookingForm/bookingForm";

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

  if (error) return <p className="error-text">{error}</p>;

  // also covers the moment between two hotels, so the old one never flashes
  if (isLoading || !selected || selected.hotel.id !== hotelId) {
    return <p>Loading hotel...</p>;
  }

  const { hotel, images, rooms } = selected;

  return (
    <>
      <PhotoGallery images={images} />

      <div className={styles.layout}>
        <section>
          <h1>{hotel.name}</h1>
          <StarRating value={hotel.starRating} />
          <p className="muted">
            {hotel.address}, {hotel.city}
          </p>
          <p>{hotel.description}</p>

          <h2>Facilities</h2>
          {hotel.facilities.length === 0 ? (
            <p className="muted">No facilities listed.</p>
          ) : (
            <ul className={styles.chips}>
              {hotel.facilities.map((facility) => (
                <li key={facility}>{facility}</li>
              ))}
            </ul>
          )}

          <h2>Policies</h2>
          <p className={styles.policies}>
            {hotel.policies || "No policies listed."}
          </p>

          <h2>Location</h2>
          <HotelMap
            latitude={hotel.latitude}
            longitude={hotel.longitude}
            name={hotel.name}
          />
        </section>

        <aside className={styles.sidebar}>
          <p className={styles.price}>
            {formatPrice(hotel.pricePerNight)} <span>/ night</span>
          </p>
          <ShareButton title={hotel.name} />

          <h3>Rooms</h3>
          {rooms.length === 0 ? (
            <p className="muted">No rooms listed yet.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className={styles.room}>
                <strong>{room.roomType}</strong>
                <span className="muted">Up to {room.capacity} guests</span>
                <span>{formatPrice(room.pricePerNight)} / night</span>
              </div>
            ))
          )}
          <BookingForm rooms={rooms} />
        </aside>
      </div>
    </>
  );
}
