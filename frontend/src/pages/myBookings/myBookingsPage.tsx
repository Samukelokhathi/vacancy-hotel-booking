import BookingList from "../../components/bookingList/bookingList";
import styles from "./myBookingsPage.module.css";

export default function MyBookingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My bookings</h1>
      <BookingList />
    </div>
  );
}
