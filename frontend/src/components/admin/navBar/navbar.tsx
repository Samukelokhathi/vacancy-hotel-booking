// src/components/admin/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { logout } from "../../../store/loginSlice";
import styles from "./navbar.module.css";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.login);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.navbar}>
      <Link to="/home" className={styles.brand}>
        <span className={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b1305" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
          </svg>
        </span>
        <span className={styles.brandName}>StayWise</span>
      </Link>

      <nav className={styles.links}>
        <NavLink to="/home" className={linkClass}>Hotels</NavLink>
        {isAuthenticated && !isAdmin && <NavLink to="/bookings" className={linkClass}>My bookings</NavLink>}
        {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
      </nav>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <span className={styles.greeting}>Hi, {user?.name}</span>
            {isAdmin && <span className={styles.badge}>Admin</span>}
            <button type="button" className={styles.darkButton} onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.darkButton}>Login</Link>
            <Link to="/register" className={styles.signupButton}>Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
