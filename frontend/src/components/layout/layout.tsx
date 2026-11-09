import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchFavoriteIds } from "../../store/favoriteSlice";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import styles from "./layout.module.css";

// Shared page frame: light theme, navbar with the search bar, footer
export default function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );

  useEffect(() => {
    document.body.classList.add("theme-light");
    return () => document.body.classList.remove("theme-light");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // load the hearts once the user is known
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavoriteIds());
  }, [dispatch, isAuthenticated]);

  return (
    <div className={`explore-theme ${styles.page}`}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
