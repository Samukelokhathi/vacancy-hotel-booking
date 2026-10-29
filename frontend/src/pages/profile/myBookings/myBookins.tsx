import type { BookingDetails } from "../../../models/hotel.types";
import Button from "../../../components/button/button";
import styles from "../profilePage.module.css";

interface MyBookingsProps {
  bookings: BookingDetails[];
  onCancelBooking: (id: number) => void;
}

export default function MyBookings({
  bookings,
  onCancelBooking,
}: MyBookingsProps) {
  return (
    <div className={styles.bookingsVerticalStack}>
      <h3 className={styles.subTitleHeading}>My Bookings</h3>
      <p className={styles.subTitleMeta}>Upcoming and recent stays</p>

      {bookings.map((booking) => (
        <div key={booking.id} className={styles.bookingCardItem}>
          <div className={styles.bookingCardHeader}>
            <div>
              <h4>{booking.hotelName}</h4>
              <span className={styles.bookingReference}>BK-{booking.id}</span>
            </div>
            <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
              {booking.status}
            </span>
          </div>

          <div className={styles.bookingGridMetrics}>
            <div>
              <span className={styles.metricLabel}>Check-in</span>
              <span className={styles.metricValue}>{booking.checkIn}</span>
            </div>
            <div>
              <span className={styles.metricLabel}>Check-out</span>
              <span className={styles.metricValue}>{booking.checkOut}</span>
            </div>
            <div>
              <span className={styles.metricLabel}>Rooms</span>
              <span className={styles.metricValue}>
                {booking.numberOfRooms}
              </span>
            </div>
            <div>
              <span className={styles.metricLabel}>Guests</span>
              <span className={styles.metricValue}>{booking.guests}</span>
            </div>
            <div>
              <span className={styles.metricLabel}>Price</span>
              <span className={styles.metricValue}>
                R {booking.totalPrice || booking.id * 1200}
              </span>
            </div>
          </div>

          <div className={styles.bookingActionButtonsRow}>
            <Button variant="secondary" className={styles.secondaryActionBtn}>
              View Booking
            </Button>
            <Button variant="secondary" className={styles.secondaryActionBtn}>
              Modify Booking
            </Button>
            <Button
              variant="danger"
              className={styles.dangerActionBtn}
              disabled={booking.status === "cancelled"}
              onClick={() => onCancelBooking(booking.id)}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      ))}

      {bookings.length === 0 && (
        <p className={styles.emptyStateFallback}>
          You have no reservation parameters logged yet.
        </p>
      )}
    </div>
  );
}
