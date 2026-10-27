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
    (state: RootState) => state.login
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
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
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
      <header className={styles.hero}>
        <div>
          <p className={styles.badge}>STAYWISE ADMIN</p>

          <h1>Admin Dashboard</h1>

          <p>
            Manage reservations, hotel listings and platform
            content.
          </p>
        </div>

        <div className={styles.role}>
          Administrator
        </div>
      </header>

      <section className={styles.panel}>
        <h2>Add Hotel</h2>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <label>
            Hotel Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price Per Night
            <input
              type="number"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stars
            <select
              name="stars"
              value={form.stars}
              onChange={handleChange}
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </label>

          <label className={styles.fullWidth}>
            Description
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.fullWidth}>
            Image URL
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/hotel.jpg"
            />
          </label>

          {formError && (
            <p className={styles.error}>{formError}</p>
          )}

          {message && (
            <p className={styles.success}>{message}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className={styles.submit}
          >
            {isSaving ? "Adding..." : "Add Hotel"}
          </button>
        </form>
      </section>
    </main>
  );
}