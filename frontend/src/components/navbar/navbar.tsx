import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/loginSlice";
import styles from "./navbar.module.css";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.login,
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className={styles.navbar}>
      <Link to="/home" className={styles.logo}>
        Vacancy Hotels
      </Link>

      <nav className={styles.links}>
        {isAuthenticated ? (
          <>
            <Link to="/bookings">My bookings</Link>
            <span className={styles.greeting}>Hi, {user?.name}</span>
            <button onClick={handleLogout} className={styles.linkButton}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className={styles.cta}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
