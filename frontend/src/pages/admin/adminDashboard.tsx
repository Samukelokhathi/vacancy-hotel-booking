import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import { api, getErrorMessage } from "../../api/axios";
import styles from "./adminDashboard.module.css";

interface HotelForm {
  name: string;
  city: string;
  description: string;
  pricePerNight: string;
  stars: string;
  imageUrl: string;
}

const initialForm: HotelForm = {
  name: "",
  city: "",
  description: "",
  pricePerNight: "",
  stars: "3",
  imageUrl: "",
};

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.login,
  );

  const [form, setForm] = useState<HotelForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  if (!authChecked) {
    return <p>Checking your account...</p>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFormError("");
    setIsSaving(true);

    try {
      await api.post("/hotels", {
        name: form.name.trim(),
        city: form.city.trim(),
        description: form.description.trim(),
        pricePerNight: Number(form.pricePerNight),
        stars: Number(form.stars),
        imageUrl: form.imageUrl.trim(),
      });

      await dispatch(fetchHotels()).unwrap();
      setForm(initialForm);
      setMessage("Hotel added successfully.");
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to add hotel."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>VACANCY HOTELS</p>
          <h1>Admin dashboard</h1>
          <p>Manage your hotel listings.</p>
        </div>
        <span className={styles.role}>Administrator</span>
      </header>

      <section className={styles.panel}>
        <h2>Add a hotel</h2>
        <p className={styles.help}>
          Enter the hotel details below to create a new listing.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Hotel name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. The Sable House"
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Durban"
              required
            />
          </label>

          <label>
            Price per night
            <input
              name="pricePerNight"
              type="number"
              min="0"
              step="0.01"
              value={form.pricePerNight}
              onChange={handleChange}
              placeholder="1500"
              required
            />
          </label>

          <label>
            Star rating
            <select name="stars" value={form.stars} onChange={handleChange}>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </label>

          <label className={styles.fullWidth}>
            Hotel description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the hotel and its facilities..."
              rows={4}
              required
            />
          </label>

          <label className={styles.fullWidth}>
            Hotel image URL
            <input
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/hotel.jpg"
            />
          </label>

          {formError && (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          )}

          {message && (
            <p className={styles.success} role="status">
              {message}
            </p>
          )}

          <button type="submit" disabled={isSaving} className={styles.submit}>
            {isSaving ? "Adding hotel..." : "Add hotel"}
          </button>
        </form>
      </section>
    </main>
  );
}
