import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import type { BookingDetails } from "../../../models/hotel.types";
import { fetchMyBookings } from "../../../store/bookingSlice";
import { formatDate } from "../../../utils/format";
import { ClockIcon } from "../../../components/icons/icons";
import styles from "./notifications.module.css";

// One line per booking, built from GET /bookings/my (status + paid)
const describeBooking = (booking: BookingDetails) => {
  const stayDates = `${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}`;
  if (booking.status === "cancelled") {
    return {
      toneClass: styles.toneCancelled,
      message: `Your booking at ${booking.hotelName} (${stayDates}) was cancelled.`,
    };
  }
  if (booking.status === "approved") {
    return {
      toneClass: styles.toneConfirmed,
      message: `${booking.hotelName} confirmed your stay for ${stayDates}.`,
    };
  }
  if (booking.paid) {
    return {
      toneClass: styles.toneAwaiting,
      message: `Payment received for ${booking.hotelName}. Waiting for the hotel to confirm.`,
    };
  }
  return {
    toneClass: styles.tonePending,
    message: `Your booking at ${booking.hotelName} (${stayDates}) is waiting for payment.`,
  };
};

export default function Notifications() {
  const dispatch = useDispatch<AppDispatch>();
  const { myBookings, isLoading } = useSelector(
    (state: RootState) => state.bookings,
  );

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const newestBookingsFirst = [...myBookings].sort(
    (firstBooking, secondBooking) => secondBooking.id - firstBooking.id,
  );

  if (!isLoading && newestBookingsFirst.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>
          <ClockIcon size={26} strokeWidth={1.8} />
        </span>
        <h3>No updates yet</h3>
        <p>Updates about your bookings will show up here.</p>
      </div>
    );
  }

  return (
    <ul className={styles.notificationList}>
      {newestBookingsFirst.map((booking) => {
        const { toneClass, message } = describeBooking(booking);
        return (
          <li key={booking.id}>
            <span
              className={`${styles.statusDot} ${toneClass}`}
              aria-hidden="true"
            />
            <p>{message}</p>
            {booking.hotelId && (
              <Link to={`/hotels/${booking.hotelId}`}>View</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
