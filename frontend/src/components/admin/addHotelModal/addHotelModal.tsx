import type { FormEvent } from "react";
import { Input } from "../../inputs/input";
import Button from "../../button/button";
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
  imageUrl: string;
}

interface AddHotelModalProps {
  form: HotelFormState;
  isSaving: boolean;
  message: string;
  formError: string;
  isEditMode: boolean;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function AddHotelModal({
  form,
  isSaving,
  message,
  formError,
  isEditMode,
  onChange,
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

          {!isEditMode && (
            <>
              <div className={styles.halfWidth}>
                <Input
                  label="INITIAL ROOMS TYPE"
                  name="roomType"
                  value={form.roomType}
                  onChange={onChange}
                  required
                />
              </div>
              <div className={styles.halfWidth}>
                <Input
                  label="ROOMS SUPPLY ALLOCATION"
                  type="number"
                  name="roomQuantity"
                  value={form.roomQuantity}
                  onChange={onChange}
                  required
                />
              </div>
            </>
          )}

          <div className={styles.fullWidth}>
            <Input
              label="HOTEL PHOTO IMAGE URL"
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={onChange}
              placeholder="https://example.com"
              required
            />
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
