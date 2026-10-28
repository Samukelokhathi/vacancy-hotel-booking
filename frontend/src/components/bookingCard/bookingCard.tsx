import { Link } from "react-router-dom";
import type { BookingDetails } from "../../models/hotel.types";
import { formatDate, formatPrice } from "../../utils/format";
import styles from "./bookingCard.module.css";

interface BookingCardProps {
  booking: BookingDetails;
  busy: boolean;
  onPay: (id: number) => void;
  onCancel: (id: number) => void;
}

// ONE badge that tells the guest where the booking stands.
// "status" (set by the hotel) and "paid" (set by Paystack) are two separate facts,
// so the badge looks at both
const getBadge = (booking: BookingDetails) => {
  if (booking.status === "cancelled") {
    return { label: "Cancelled", style: styles.cancelled };
  }
  if (booking.status === "approved") {
    return { label: "Confirmed", style: styles.approved };
  }
  if (booking.paid) {
    return { label: "Awaiting approval", style: styles.awaiting };
  }
  return { label: "Pending payment", style: styles.pending };
};

export default function BookingCard({
  booking,
  busy,
  onPay,
  onCancel,
}: BookingCardProps) {
  const badge = getBadge(booking);
  const isCancelled = booking.status === "cancelled";
  // only unpaid, not-cancelled bookings can be paid for or cancelled by the guest
  const canChange = !isCancelled && !booking.paid;
  const reference = `BK-${String(booking.id).padStart(4, "0")}`;

  // the grey box with the five facts
  const details = [
    { label: "Check-in", value: formatDate(booking.checkIn) },
    { label: "Check-out", value: formatDate(booking.checkOut) },
    { label: "Rooms", value: String(booking.numberOfRooms) },
    { label: "Guests", value: String(booking.guests) },
    { label: "Price", value: formatPrice(booking.totalPrice) },
  ];

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <h3 className={styles.name}>{booking.hotelName}</h3>
          <p className={styles.reference}>
            {reference} · {booking.roomType}
          </p>
        </div>

        <span className={`${styles.badge} ${badge.style}`}>{badge.label}</span>
      </div>

      <div className={styles.details}>
        {details.map((item) => (
          <div key={item.label}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.value}>
              {item.value}
              {/* a small "Paid" tag next to the price, once the payment went through */}
              {item.label === "Price" && booking.paid && (
                <span className={styles.paidTag}>Paid</span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Link className={styles.viewLink} to={`/hotels/${booking.hotelId}`}>
          View Hotel
        </Link>

        {canChange && (
          <button
            type="button"
            className={styles.pay}
            disabled={busy}
            onClick={() => onPay(booking.id)}
          >
            Pay now
          </button>
        )}
        {canChange && (
          <button
            type="button"
            className={styles.cancel}
            disabled={busy}
            onClick={() => onCancel(booking.id)}
          >
            Cancel Booking
          </button>
        )}
      </div>

      {booking.paid && !isCancelled && (
        <p className={styles.note}>
          To change or cancel a paid booking, please contact the hotel.
        </p>
      )}
    </article>
  );
}