import type { BookingDetails } from "../../models/hotel.types";
import styles from "./bookingCard.module.css";

interface BookingCardProps {
  booking: BookingDetails;
  busy: boolean;
  onPay: (id: number) => void;
  onCancel: (id: number) => void;
}

export default function BookingCard({
  booking,
  busy,
  onPay,
  onCancel,
}: BookingCardProps) {
  const isCancelled = booking.status === "cancelled";

  return (
    <article className={styles.card}>
      <div>
        <h3>{booking.hotelName}</h3>
        <p className="muted">{booking.roomType}</p>
        <p>
          {booking.checkIn} → {booking.checkOut}
        </p>
        <p className="muted">
          {booking.numberOfRooms} room(s), {booking.guests} guest(s)
        </p>
      </div>

      <div className={styles.side}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[booking.status]}`}>
            {booking.status}
          </span>
          {booking.paid && (
            <span className={`${styles.badge} ${styles.paid}`}>paid</span>
          )}
        </div>

        {!isCancelled && !booking.paid && (
          <button
            className={styles.pay}
            disabled={busy}
            onClick={() => onPay(booking.id)}
          >
            Pay now
          </button>
        )}
        {!isCancelled && !booking.paid && (
          <button
            className={styles.cancel}
            disabled={busy}
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </article>
  );
}
