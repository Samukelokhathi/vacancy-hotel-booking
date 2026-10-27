import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import styles from "./layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
