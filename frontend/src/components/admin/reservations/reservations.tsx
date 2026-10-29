// src/components/admin/ReservationsTable.tsx
import type { BookingDetails } from "../../../models/hotel.types";
import styles from "./reservations.module.css";

interface ReservationsTableProps {
  reservations: BookingDetails[];
  onUpdateStatus: (id: number, status: "approved" | "cancelled") => void;
}

export default function ReservationsTable({
  reservations,
  onUpdateStatus,
}: ReservationsTableProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Reservations</h2>
        <p>Approve or cancel incoming reservations</p>
      </div>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>GUEST</th>
              <th>HOTEL</th>
              <th>DATES</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className={styles.bold}>{res.guestName}</td>
                <td>{res.hotelName}</td>
                <td>
                  {res.checkIn} — {res.checkOut}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[res.status]}`}>
                    {res.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button
                      className={styles.approveBtn}
                      disabled={res.status === "cancelled"}
                      onClick={() => onUpdateStatus(res.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.cancelBtn}
                      disabled={res.status === "cancelled"}
                      onClick={() => onUpdateStatus(res.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
