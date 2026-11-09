import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import SearchBar from "../searchBar/searchBar";
import UserMenu from "../userMenu/userMenu";
import { BuildingIcon } from "../icons/icons";
import styles from "./navbar.module.css";

export default function Navbar() {
  const isAdmin = useSelector(
    (state: RootState) => state.login.user?.role === "admin",
  );

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link
          to="/home"
          className={styles.brand}
          aria-label="Vacancy Hotels home"
        >
          <span className={styles.logo}>
            <BuildingIcon size={18} />
          </span>
          <span className={styles.brandName}>vacancy</span>
        </Link>

        <div className={styles.searchArea}>
          <SearchBar />
        </div>

        <div className={styles.actions}>
          {isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              Admin dashboard
            </Link>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
