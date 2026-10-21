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
      <img src={images[active]?.url} alt="Hotel" className={styles.main} />

      <div className={styles.thumbs}>
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Hotel photo ${index + 1}`}
            onClick={() => setActive(index)}
            className={index === active ? styles.activeThumb : styles.thumb}
          />
        ))}
      </div>
    </div>
  );
}
