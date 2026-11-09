import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import styles from "./footer.module.css";

export default function Footer() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.login,
  );
  const isAdmin = user?.role === "admin";

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <nav className={styles.column} aria-label="Explore">
            <h3>Explore</h3>
            <Link to="/home">All hotels</Link>
            <Link to="/home?stars=5">Five-star stays</Link>
            <Link to="/home?stars=4">Four stars and up</Link>
            <Link to="/home?maxPrice=1500">Stays up to R 1 500</Link>
          </nav>

          <nav className={styles.column} aria-label="Account">
            <h3>Account</h3>
            {isAuthenticated ? (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/bookings">My bookings</Link>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register">Sign up</Link>
              </>
            )}
            {isAdmin && <Link to="/admin">Admin dashboard</Link>}
          </nav>
        </div>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Vacancy Hotels
        </p>
      </div>
    </footer>
  );
}
