import type { Hotel } from "../../../models/hotel.types";
import styles from "./manageHotels.module.css";

interface ManageHotelsProps {
  hotelsList: Hotel[];
  onEditHotel: (hotel: Hotel) => void;
  onDeleteHotel: (id: number) => void;
}

export default function ManageHotels({
  hotelsList,
  onEditHotel,
  onDeleteHotel,
}: ManageHotelsProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>Manage Hotels</h2>
        <p className={styles.sub}>
          {hotelsList?.length || 0} listings available
        </p>
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
              <button
                className={styles.editRowBtn}
                onClick={() => onEditHotel(hotel)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit
              </button>
              <button
                className={styles.deleteRowBtn}
                onClick={() => onDeleteHotel(hotel.id)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
