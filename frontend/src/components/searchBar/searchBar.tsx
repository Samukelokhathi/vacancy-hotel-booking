import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setSearchFilters } from "../../store/searchSlice";
import {
  filtersToParams,
  priceOptions,
  starOptions,
  type HotelFilters,
} from "../../utils/hotelFilters";
import { SearchIcon } from "../icons/icons";
import styles from "./searchBar.module.css";

interface SearchFormProps {
  initialFilters: HotelFilters;
}

function SearchForm({ initialFilters }: SearchFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [name]: name === "city" ? value : Number(value),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setSearchFilters(draftFilters));
    const queryString = filtersToParams(draftFilters).toString();
    navigate(queryString ? `/home?${queryString}` : "/home");
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
      <label className={styles.segment}>
        <span className={styles.segmentLabel}>Where</span>
        <input
          name="city"
          type="text"
          placeholder="Search destinations"
          value={draftFilters.city}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      <span className={styles.divider} aria-hidden="true" />

      <label className={styles.segment}>
        <span className={styles.segmentLabel}>Price</span>
        <select
          name="maxPrice"
          value={draftFilters.maxPrice}
          onChange={handleChange}
        >
          {priceOptions.map((priceOption) => (
            <option key={priceOption.value} value={priceOption.value}>
              {priceOption.label}
            </option>
          ))}
        </select>
      </label>

      <span className={styles.divider} aria-hidden="true" />

      <label className={styles.segment}>
        <span className={styles.segmentLabel}>Stars</span>
        <select name="stars" value={draftFilters.stars} onChange={handleChange}>
          {starOptions.map((starOption) => (
            <option key={starOption.value} value={starOption.value}>
              {starOption.value === 0 ? "Any rating" : starOption.label}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className={styles.searchButton} aria-label="Search">
        <SearchIcon size={16} strokeWidth={3} />
        <span className={styles.searchButtonText}>Search</span>
      </button>
    </form>
  );
}

// The same search bar on every page. It shows the current search
// (from the store) and always sends the user to /home with the filters.
export default function SearchBar() {
  const activeFilters = useSelector((state: RootState) => state.search.filters);

  // remount the form when the active search changes so the fields follow it
  return (
    <SearchForm
      key={JSON.stringify(activeFilters)}
      initialFilters={activeFilters}
    />
  );
}
