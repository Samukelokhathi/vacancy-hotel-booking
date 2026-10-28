import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { cancelBooking, fetchMyBookings } from "../../store/bookingSlice";
import { useCheckout } from "../../hooks/useCheckout";
import BookingCard from "../../components/bookingCard/bookingCard";
import styles from "./myBookingsPage.module.css";

export default function MyBookingsPage() {
  const checkout = useCheckout();

  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector((state: RootState) => state.bookings);
  const payments = useSelector((state: RootState) => state.payments);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // the error message is shown by the slice, so the catch only stops a console warning
  const handlePay = (id: number) => checkout(id).catch(() => {});

  const handleCancel = (id: number) => {
    if (window.confirm("Cancel this booking?")) dispatch(cancelBooking(id));
  };

  const error = bookings.error ?? payments.error;
  const busy = bookings.isLoading || payments.isLoading;
  const isEmpty = !bookings.isLoading && bookings.myBookings.length === 0;

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>My Bookings</h1>
        <p className={styles.subtitle}>Upcoming and recent stays</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {bookings.isLoading && bookings.myBookings.length === 0 && (
        <p className={styles.message}>Loading bookings...</p>
      )}

      {isEmpty && !error && (
        <p className={styles.message}>
          You have no bookings yet.{" "}
          <Link className={styles.link} to="/home">
            Browse hotels
          </Link>
        </p>
      )}

      <div className={styles.list}>
        {bookings.myBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            busy={busy}
            onPay={handlePay}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}