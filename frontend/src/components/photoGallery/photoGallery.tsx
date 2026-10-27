import { useState } from "react";
import type { HotelImage } from "../../models/hotel.types";
import styles from "./photoGallery.module.css";

export default function PhotoGallery({ images }: { images: HotelImage[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className={styles.empty}>No photos yet</div>;
  }

  return (
    <div>
      <img
        className={styles.main}
        src={images[active]?.url}
        alt={`Hotel photo ${active + 1}`}
      />

      <div className={styles.thumbs}>
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`${styles.thumbButton} ${
              index === active ? styles.activeThumb : ""
            }`}
            onClick={() => setActive(index)}
            aria-label={`Show photo ${index + 1}`}
          >
            <img className={styles.thumb} src={image.url} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}