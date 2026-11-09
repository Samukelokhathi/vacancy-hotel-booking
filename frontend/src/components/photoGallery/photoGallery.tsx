import { useState } from "react";
import type { HotelImage } from "../../models/hotel.types";
import { resolveImageUrl } from "../../utils/imageUrl";
import Modal from "../modal/modal";
import { BuildingIcon, GridIcon } from "../icons/icons";
import styles from "./photoGallery.module.css";

interface PhotoGalleryProps {
  images: HotelImage[];
  fallbackCoverImage?: string | null;
  hotelName: string;
}

// One large photo + up to four small ones, with a "Show all photos" view
export default function PhotoGallery({
  images,
  fallbackCoverImage,
  hotelName,
}: PhotoGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImageUrls, setFailedImageUrls] = useState<string[]>([]);

  // cover first; fall back to the hotel's cover image if there is no gallery
  const imagesCoverFirst = [...images].sort(
    (firstImage, secondImage) =>
      Number(!!secondImage.isCover) - Number(!!firstImage.isCover),
  );
  const imageUrls = imagesCoverFirst
    .map((image) => resolveImageUrl(image.url))
    .filter(
      (imageUrl): imageUrl is string =>
        Boolean(imageUrl) && !failedImageUrls.includes(imageUrl as string),
    );
  const coverImageUrl = resolveImageUrl(fallbackCoverImage);
  if (
    imageUrls.length === 0 &&
    coverImageUrl &&
    !failedImageUrls.includes(coverImageUrl)
  ) {
    imageUrls.push(coverImageUrl);
  }

  const markImageFailed = (imageUrl: string) =>
    setFailedImageUrls((currentUrls) => [...currentUrls, imageUrl]);

  if (imageUrls.length === 0) {
    return (
      <div className={styles.noPhotos}>
        <BuildingIcon size={36} />
        <span>No photos yet</span>
      </div>
    );
  }

  const visibleImageUrls = imageUrls.slice(0, 5);
  const layoutClass =
    visibleImageUrls.length >= 5
      ? styles.fiveUp
      : visibleImageUrls.length >= 3
        ? styles.threeUp
        : styles.singlePhoto;
  const tileImageUrls =
    visibleImageUrls.length === 2
      ? visibleImageUrls.slice(0, 1)
      : visibleImageUrls;

  return (
    <>
      <div className={`${styles.mosaic} ${layoutClass}`}>
        {tileImageUrls.map((imageUrl, imageIndex) => (
          <button
            key={imageUrl}
            type="button"
            className={styles.photoTile}
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`Open photo ${imageIndex + 1} of ${imageUrls.length}`}
          >
            <img
              src={imageUrl}
              alt={imageIndex === 0 ? hotelName : ""}
              loading={imageIndex === 0 ? "eager" : "lazy"}
              onError={() => markImageFailed(imageUrl)}
            />
          </button>
        ))}

        {imageUrls.length > 1 && (
          <button
            type="button"
            className={styles.showAllButton}
            onClick={() => setIsLightboxOpen(true)}
          >
            <GridIcon size={14} />
            Show all photos
          </button>
        )}
      </div>

      {isLightboxOpen && (
        <Modal
          title={`${hotelName} · ${imageUrls.length} photos`}
          onClose={() => setIsLightboxOpen(false)}
          fullScreen
        >
          <div className={styles.lightbox}>
            {imageUrls.map((imageUrl, imageIndex) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`${hotelName} photo ${imageIndex + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
