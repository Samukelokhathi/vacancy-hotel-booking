import { useEffect, useState } from "react";
import type { HotelImage } from "../../models/hotel.types";
import { resolveImageUrl } from "../../utils/imageUrl";
import styles from "./photoGallery.module.css";

export default function PhotoGallery({ images }: { images: HotelImage[] }) {
  const [active, setActive] = useState(0);
  const [failedIds, setFailedIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setActive(0);
    setFailedIds({});
  }, [images]);

  if (images.length === 0) {
    return <div className={styles.empty}>No photos yet</div>;
  }

  const safeIndex = Math.min(active, images.length - 1);
  const current = images[safeIndex];
  const currentSrc = resolveImageUrl(current?.url);
  const showMain = Boolean(currentSrc) && !failedIds[current.id];

  const goPrev = () => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainWrap}>
        {showMain ? (
          <img
            className={styles.main}
            src={currentSrc!}
            alt={`Hotel photo ${safeIndex + 1}`}
            loading="lazy"
            onError={() => {
              console.error("Hotel gallery image failed to load", {
                imageId: current.id,
                src: currentSrc,
              });
              setFailedIds((prev) => ({ ...prev, [current.id]: true }));
            }}
          />
        ) : (
          <div className={styles.empty}>No photos yet</div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prev}`}
              onClick={goPrev}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.next}`}
              onClick={goNext}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, index) => {
            const thumbSrc = resolveImageUrl(image.url);
            return (
              <button
                key={image.id}
                type="button"
                className={`${styles.thumbButton} ${
                  index === safeIndex ? styles.activeThumb : ""
                }`}
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
              >
                {thumbSrc && !failedIds[image.id] ? (
                  <img
                    className={styles.thumb}
                    src={thumbSrc}
                    alt=""
                    loading="lazy"
                    onError={() => {
                      console.error("Hotel gallery thumbnail failed to load", {
                        imageId: image.id,
                        src: thumbSrc,
                      });
                      setFailedIds((prev) => ({ ...prev, [image.id]: true }));
                    }}
                  />
                ) : (
                  <div className={styles.thumbFallback}>No photo</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
