import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { addFavorite, removeFavorite } from "../../store/favoriteSlice";
import { HeartIcon } from "../icons/icons";
import styles from "./favoriteButton.module.css";

interface FavoriteButtonProps {
  hotelId: number;
  hotelName: string;
  // "overlay": heart on top of a photo; "text": heart + "Save" link
  variant: "overlay" | "text";
}

// Saves a hotel to the user's favourites (POST/DELETE /favorites).
// Logged-out users are sent to the login page.
export default function FavoriteButton({
  hotelId,
  hotelName,
  variant,
}: FavoriteButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );
  const isSaved = useSelector((state: RootState) =>
    state.favorites.favoriteHotelIds.includes(hotelId),
  );

  // CHANGED: stopPropagation so the card Link does not open when clicking the heart
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(isSaved ? removeFavorite(hotelId) : addFavorite(hotelId));
  };

  const label = isSaved
    ? `Remove ${hotelName} from favourites`
    : `Save ${hotelName} to favourites`;

  if (variant === "text") {
    return (
      <button
        type="button"
        className={`${styles.textButton} ${isSaved ? styles.saved : ""}`}
        aria-pressed={isSaved}
        aria-label={label}
        onClick={handleClick}
      >
        <HeartIcon size={16} />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.overlayButton} ${isSaved ? styles.saved : ""}`}
      aria-pressed={isSaved}
      aria-label={label}
      onClick={handleClick}
    >
      <HeartIcon size={24} />
    </button>
  );
}