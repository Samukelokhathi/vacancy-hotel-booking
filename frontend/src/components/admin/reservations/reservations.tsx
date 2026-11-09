// src/components/admin/ReservationsTable.tsx
import type { BookingDetails } from "../../../models/hotel.types";
import { formatDate } from "../../../utils/format";
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
              <th>Guest</th>
              <th>Hotel</th>
              <th>Dates</th>
              <th>Status</th>
              <th>
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>
                  <span className={styles.bold}>{res.guestName}</span>
                  {res.guestEmail && (
                    <span className={styles.subtle}>{res.guestEmail}</span>
                  )}
                </td>
                <td>
                  {res.hotelName}
                  <span className={styles.subtle}>{res.roomType}</span>
                </td>
                <td className={styles.nowrap}>
                  {formatDate(res.checkIn)} – {formatDate(res.checkOut)}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[res.status]}`}>
                    {res.status === "pending" && res.paid
                      ? "Paid · pending"
                      : res.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button
                      className={styles.approveBtn}
                      disabled={res.status !== "pending"}
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
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No reservations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
