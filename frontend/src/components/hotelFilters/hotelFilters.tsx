import { useState } from "react";
import {
  priceOptions,
  starOptions,
  type HotelFilters,
} from "../../utils/hotelFilters";
import styles from "./hotelFilters.module.css";

interface HotelFiltersBarProps {
  initial: HotelFilters;
  onSearch: (filters: HotelFilters) => void;
}

export default function HotelFiltersBar({
  initial,
  onSearch,
}: HotelFiltersBarProps) {
  // what the visitor has chosen so far (applied only when they press Search)
  const [draft, setDraft] = useState<HotelFilters>(initial);

  // one handler for all three fields: the city stays text, the rest become numbers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: name === "city" ? value : Number(value) });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(draft);
  };

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="city">
          City
        </label>
        <input
          className={styles.input}
          id="city"
          name="city"
          type="text"
          placeholder="e.g. Cape Town"
          value={draft.city}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="maxPrice">
          Max price / night
        </label>
        <select
          className={styles.select}
          id="maxPrice"
          name="maxPrice"
          value={draft.maxPrice}
          onChange={handleChange}
        >
          {priceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="stars">
          Stars
        </label>
        <select
          className={styles.select}
          id="stars"
          name="stars"
          value={draft.stars}
          onChange={handleChange}
        >
          {starOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.button} type="submit">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        Search
      </button>
    </form>
  );
}