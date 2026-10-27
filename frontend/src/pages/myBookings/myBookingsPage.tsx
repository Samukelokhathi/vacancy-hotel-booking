import { useEffect } from "react";
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

  const handlePay = (id: number) => checkout(id);

  const handleCancel = (id: number) => {
    if (window.confirm("Cancel this booking?")) dispatch(cancelBooking(id));
  };

  const error = bookings.error ?? payments.error;
  const busy = bookings.isLoading || payments.isLoading;

  return (
    <>
      <h1>My bookings</h1>

      {error && <p className="error-text">{error}</p>}
      {bookings.isLoading && bookings.myBookings.length === 0 && (
        <p>Loading bookings...</p>
      )}
      {!bookings.isLoading && bookings.myBookings.length === 0 && !error && (
        <p className="muted">You have no bookings yet.</p>
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
    </>
  );
}
