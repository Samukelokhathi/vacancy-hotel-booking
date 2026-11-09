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
  facilities: string;
  policies: string;
  roomType: string;
  roomQuantity: string;
  roomCapacity: string;
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
      <div
        className={styles.modalContent}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Edit hotel" : "Add a hotel"}</h2>

          <button
            type="button"
            className={styles.closeModal}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <Input
              label="Hotel name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div className={styles.halfWidth}>
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={onChange}
              required
            />
          </div>

          <div className={styles.halfWidth}>
            <Input
              label="Street address"
              name="address"
              value={form.address}
              onChange={onChange}
              required
            />
          </div>

          <div className={styles.halfWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Stars</label>

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
              label="Price per night (R)"
              type="number"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={onChange}
              min={1}
              required
            />
          </div>

          {!isEditMode && (
            <>
              <div className={styles.halfWidth}>
                <Input
                  label="First room type"
                  name="roomType"
                  value={form.roomType}
                  onChange={onChange}
                  required
                />
              </div>

              <div className={styles.halfWidth}>
                <Input
                  label="Number of rooms"
                  type="number"
                  name="roomQuantity"
                  value={form.roomQuantity}
                  onChange={onChange}
                  min={1}
                  required
                />
              </div>

              <div className={styles.halfWidth}>
                <Input
                  label="Guests per room"
                  type="number"
                  name="roomCapacity"
                  value={form.roomCapacity}
                  onChange={onChange}
                  min={1}
                  required
                />
              </div>
            </>
          )}

          <div className={styles.fullWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Hotel photos</label>

              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.fileInput}
                onChange={(event) => {
                  onFilesSelected(event.target.files);
                  event.target.value = "";
                }}
              />

              <small>Maximum 12 images, 8MB per image.</small>
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
                          alt="Hotel"
                          className={styles.preview}
                          loading="lazy"
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
                      alt={file.name}
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
              label="Facilities (comma-separated)"
              name="facilities"
              value={form.facilities}
              onChange={onChange}
            />
          </div>

          <div className={styles.fullWidth}>
            <Input
              label="Policies"
              name="policies"
              value={form.policies}
              onChange={onChange}
            />
          </div>

          <div className={styles.fullWidth}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Description</label>

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
                  ? "Save changes"
                  : "Create listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
