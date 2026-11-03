import type { FormEvent } from "react";
import { Input } from "../../inputs/input";
import Button from "../../button/button";
import type { HotelImage } from "../../../models/hotel.types";
import { resolveImageUrl } from "../../../utils/imageUrl";
import styles from "./addHotelModal.module.css";

interface HotelFormState {
  name: string;
  description: string;
  address: string;
  city: string;
  starRating: string;
  pricePerNight: string;
  latitude: string;
  longitude: string;
  facilities: string;
  policies: string;
}

interface AddHotelModalProps {
  form: HotelFormState;
  isSaving: boolean;
  message: string;
  formError: string;
  isEditMode: boolean;
  existingImages: HotelImage[];
  pendingFiles: File[];
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFilesSelected: (files: FileList | null) => void;
  onRemovePendingFile: (index: number) => void;
  onDeleteImage: (imageId: number) => void;
  onSetCover: (imageId: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function AddHotelModal({
  form,
  isSaving,
  message,
  formError,
  isEditMode,
  existingImages,
  pendingFiles,
  onChange,
  onFilesSelected,
  onRemovePendingFile,
  onDeleteImage,
  onSetCover,
  onSubmit,
  onClose,
}: AddHotelModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit Hotel Listing" : "Add Hotel Listing"}</h2>
          <button className={styles.closeModal} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <Input
              label="HOTEL NAME"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.halfWidth}>
            <Input
              label="CITY"
              name="city"
              value={form.city}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.halfWidth}>
            <Input
              label="STREET ADDRESS"
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="e.g. 42 Beach Road"
              required
            />
          </div>
          <div className={styles.halfWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>STARS</label>
              <select
                name="starRating"
                value={form.starRating}
                onChange={onChange}
                className={styles.select}
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>
          <div className={styles.halfWidth}>
            <Input
              label="PRICE / NIGHT (R)"
              type="number"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.halfWidth}>
            <Input
              label="LATITUDE (OPTIONAL)"
              name="latitude"
              value={form.latitude}
              onChange={onChange}
              placeholder="e.g. -26.2041"
            />
          </div>
          <div className={styles.halfWidth}>
            <Input
              label="LONGITUDE (OPTIONAL)"
              name="longitude"
              value={form.longitude}
              onChange={onChange}
              placeholder="e.g. 28.0473"
            />
          </div>

          <div className={styles.fullWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>HOTEL PHOTOS</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.fileInput}
                onChange={(event) => onFilesSelected(event.target.files)}
              />
            </div>

            {existingImages.length > 0 && (
              <div className={styles.imageGrid}>
                {existingImages.map((image) => {
                  const src = resolveImageUrl(image.url);
                  return (
                    <div key={image.id} className={styles.imageCard}>
                      {src ? (
                        <img
                          src={src}
                          alt=""
                          className={styles.preview}
                          loading="lazy"
                          onError={() => {
                            console.error(
                              "Admin edit image preview failed to load",
                              { imageId: image.id, src },
                            );
                          }}
                        />
                      ) : (
                        <div className={styles.previewFallback}>No photo</div>
                      )}
                      <div className={styles.imageActions}>
                        <button
                          type="button"
                          className={styles.coverBtn}
                          disabled={image.isCover}
                          onClick={() => onSetCover(image.id)}
                        >
                          {image.isCover ? "Cover" : "Set cover"}
                        </button>
                        <button
                          type="button"
                          className={styles.deleteImgBtn}
                          onClick={() => onDeleteImage(image.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className={styles.imageGrid}>
                {pendingFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className={styles.imageCard}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className={styles.preview}
                    />
                    <div className={styles.imageActions}>
                      <button
                        type="button"
                        className={styles.deleteImgBtn}
                        onClick={() => onRemovePendingFile(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.fullWidth}>
            <Input
              label="FACILITIES (COMMA-SEPARATED)"
              name="facilities"
              value={form.facilities}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.fullWidth}>
            <Input
              label="POLICIES"
              name="policies"
              value={form.policies}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.fullWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>DESCRIPTION SUMMARY</label>
              <textarea
                rows={3}
                name="description"
                value={form.description}
                onChange={onChange}
                className={styles.textarea}
                required
              />
            </div>
          </div>

          {formError && <p className={styles.error}>{formError}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.fullWidth}>
            <Button
              type="submit"
              disabled={isSaving}
              className={styles.submitBtn}
            >
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Hotel listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
