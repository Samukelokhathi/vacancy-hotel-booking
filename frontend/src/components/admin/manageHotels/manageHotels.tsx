// src/components/admin/ManageHotels.tsx
import type { Hotel } from "../../../models/hotel.types";
import styles from "./manageHotels.module.css";

interface ManageHotelsProps {
  hotelsList: Hotel[];
  onDeleteHotel: (id: number) => void;
}

export default function ManageHotels({
  hotelsList,
  onDeleteHotel,
}: ManageHotelsProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Manage Hotels</h2>
        <p>{hotelsList?.length || 0} listings</p>
      </div>
      <div className={styles.hotelsList}>
        {hotelsList?.map((hotel) => (
          <div key={hotel.id} className={styles.hotelRow}>
            <div className={styles.hotelLeft}>
              <img
                src={hotel.coverImage || "https://unsplash.com"}
                alt=""
                className={styles.thumb}
              />
              <div className={styles.hotelInfo}>
                <h3>{hotel.name}</h3>
                <div className={styles.metaRow}>
                  <span>{hotel.city}</span>
                  <span className={styles.stars}>
                    {"★".repeat(hotel.starRating || 3)}
                  </span>
                  <span>R {hotel.pricePerNight}</span>
                </div>
              </div>
            </div>
            <div className={styles.rowButtons}>
              <button className={styles.editRowBtn}>Edit</button>
              <button
                className={styles.deleteRowBtn}
                onClick={() => onDeleteHotel(hotel.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
