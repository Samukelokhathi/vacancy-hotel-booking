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
        <div>
          <span className={styles.logo}>Vacancy Hotels</span>
          <p className={styles.text}>
            Compare hotels across South Africa and book in a few clicks.
          </p>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Explore</h4>
          <Link to="/home" className={styles.link}>
            Hotels
          </Link>
        </div>

        {/* the links change with the visitor, like the navbar */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Account</h4>
          {!isAuthenticated && (
            <>
              <Link to="/login" className={styles.link}>
                Log in
              </Link>
              <Link to="/register" className={styles.link}>
                Sign up
              </Link>
            </>
          )}
          {isAuthenticated && !isAdmin && (
            <Link to="/bookings" className={styles.link}>
              My bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={styles.link}>
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <p className={styles.copy}>
        &copy; {new Date().getFullYear()} Vacancy Hotels. All rights reserved.
      </p>
    </footer>
  );
}