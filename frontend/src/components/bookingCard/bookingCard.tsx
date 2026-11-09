import { useState } from "react";
import { Link } from "react-router-dom";
import type { BookingDetails } from "../../models/hotel.types";
import {
  countNights,
  formatDate,
  formatPrice,
  pluralise,
} from "../../utils/format";
import { resolveImageUrl } from "../../utils/imageUrl";
import { BuildingIcon } from "../icons/icons";
import styles from "./bookingCard.module.css";

interface BookingCardProps {
  booking: BookingDetails;
  busy: boolean;
  onPay: (bookingId: number) => void;
  onCancel: (bookingId: number) => void;
  coverImage?: string | null;
}

// ONE badge that tells the guest where the booking stands.
// "status" (set by the hotel) and "paid" (set by Paystack) are two separate facts,
// so the badge looks at both
const getStatusBadge = (booking: BookingDetails) => {
  if (booking.status === "cancelled") {
    return { label: "Cancelled", className: styles.cancelled };
  }
  if (booking.status === "approved") {
    return { label: "Confirmed", className: styles.approved };
  }
  if (booking.paid) {
    return { label: "Awaiting approval", className: styles.awaiting };
  }
  return { label: "Pending payment", className: styles.pending };
};

export default function BookingCard({
  booking,
  busy,
  onPay,
  onCancel,
  coverImage,
}: BookingCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const statusBadge = getStatusBadge(booking);
  const isCancelled = booking.status === "cancelled";
  // only unpaid, not-cancelled bookings can be paid for or cancelled by the guest
  const canChange = !isCancelled && !booking.paid;
  const bookingReference = `BK-${String(booking.id).padStart(4, "0")}`;
  const nights = countNights(booking.checkIn, booking.checkOut);
  const coverImageUrl = resolveImageUrl(coverImage);
  const hotelPath = booking.hotelId ? `/hotels/${booking.hotelId}` : null;

  const photo =
    coverImageUrl && !imageFailed ? (
      <img
        src={coverImageUrl}
        alt=""
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    ) : (
      <span className={styles.noImage}>
        <BuildingIcon size={32} />
      </span>
    );

  return (
    <article
      className={`${styles.card} ${isCancelled ? styles.isCancelled : ""}`}
    >
      <div className={styles.content}>
        <span className={`${styles.badge} ${statusBadge.className}`}>
          {statusBadge.label}
        </span>

        <h3 className={styles.hotelName}>
          {hotelPath ? (
            <Link to={hotelPath}>{booking.hotelName}</Link>
          ) : (
            booking.hotelName
          )}
        </h3>
        <p className={styles.reference}>
          {booking.roomType} · {bookingReference}
        </p>

        <div className={styles.details}>
          <div>
            <p className={styles.label}>Check-in</p>
            <p className={styles.value}>{formatDate(booking.checkIn)}</p>
          </div>
          <div>
            <p className={styles.label}>Checkout</p>
            <p className={styles.value}>{formatDate(booking.checkOut)}</p>
          </div>
          <div>
            <p className={styles.label}>Stay</p>
            <p className={styles.value}>
              {pluralise(nights, "night")} ·{" "}
              {pluralise(booking.numberOfRooms, "room")} ·{" "}
              {pluralise(booking.guests, "guest")}
            </p>
          </div>
          <div>
            <p className={styles.label}>Total</p>
            <p className={styles.value}>
              {formatPrice(booking.totalPrice)}
              {/* a small "Paid" tag next to the price, once the payment went through */}
              {booking.paid && <span className={styles.paidTag}>Paid</span>}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          {canChange && (
            <button
              type="button"
              className={styles.payButton}
              disabled={busy}
              onClick={() => onPay(booking.id)}
            >
              Pay now
            </button>
          )}
          {hotelPath && (
            <Link className={styles.viewLink} to={hotelPath}>
              View hotel
            </Link>
          )}
          {canChange && (
            <button
              type="button"
              className={styles.cancelButton}
              disabled={busy}
              onClick={() => onCancel(booking.id)}
            >
              Cancel booking
            </button>
          )}
        </div>

        {booking.paid && !isCancelled && (
          <p className={styles.note}>
            To change or cancel a paid booking, please contact the hotel.
          </p>
        )}
      </div>

      {hotelPath ? (
        <Link
          to={hotelPath}
          className={styles.media}
          tabIndex={-1}
          aria-hidden="true"
        >
          {photo}
        </Link>
      ) : (
        <div className={styles.media} aria-hidden="true">
          {photo}
        </div>
      )}
    </article>
  );
}
