import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import type { BookingDetails } from "../../models/hotel.types";
import { cancelBooking, fetchMyBookings } from "../../store/bookingSlice";
import { fetchHotels } from "../../store/hotelSlice";
import { useCheckout } from "../../hooks/useCheckout";
import { todayDateKey } from "../../utils/dates";
import BookingCard from "../bookingCard/bookingCard";
import { CalendarIcon } from "../icons/icons";
import styles from "./bookingList.module.css";

// The logged-in user's bookings (GET /bookings/my), split into
// upcoming and past/cancelled. Used by /bookings and the profile page.
export default function BookingList() {
  const dispatch = useDispatch<AppDispatch>();
  const checkout = useCheckout();
  const bookingState = useSelector((state: RootState) => state.bookings);
  const paymentState = useSelector((state: RootState) => state.payments);
  const hotels = useSelector((state: RootState) => state.hotels.hotels);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // cover photos for the cards come from GET /hotels
  useEffect(() => {
    if (hotels.length === 0) dispatch(fetchHotels());
  }, [dispatch, hotels.length]);

  const findCoverImage = (booking: BookingDetails) =>
    hotels.find((hotel) => hotel.id === booking.hotelId)?.coverImage ?? null;

  const todayKey = todayDateKey();
  const bookingsByCheckIn = [...bookingState.myBookings].sort(
    (firstBooking, secondBooking) =>
      firstBooking.checkIn.localeCompare(secondBooking.checkIn),
  );
  const upcomingBookings = bookingsByCheckIn.filter(
    (booking) => booking.status !== "cancelled" && booking.checkOut >= todayKey,
  );
  const pastBookings = bookingsByCheckIn
    .filter((booking) => !upcomingBookings.includes(booking))
    .reverse();

  const errorMessage = bookingState.error ?? paymentState.error;
  const isBusy = bookingState.isLoading || paymentState.isLoading;
  const isFirstLoad =
    bookingState.isLoading && bookingState.myBookings.length === 0;

  const handleCancel = (bookingId: number) => {
    if (window.confirm("Cancel this booking?")) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const renderBookingCards = (bookings: BookingDetails[]) => (
    <div className={styles.cardList}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          busy={isBusy}
          onPay={(bookingId) => checkout(bookingId)}
          onCancel={handleCancel}
          coverImage={findCoverImage(booking)}
        />
      ))}
    </div>
  );

  return (
    <div>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}

      {isFirstLoad && (
        <div className={styles.cardList} aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      )}

      {!isFirstLoad && !errorMessage && bookingsByCheckIn.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <CalendarIcon size={28} strokeWidth={1.6} />
          </span>
          <div>
            <h3>No bookings yet</h3>
            <p>When you book a hotel, it will show up here.</p>
            <Link to="/home" className={styles.emptyButton}>
              Find a hotel
            </Link>
          </div>
        </div>
      )}

      {upcomingBookings.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Upcoming</h2>
          {renderBookingCards(upcomingBookings)}
        </section>
      )}

      {pastBookings.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Past and cancelled</h2>
          {renderBookingCards(pastBookings)}
        </section>
      )}
    </div>
  );
}
