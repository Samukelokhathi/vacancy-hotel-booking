// src/components/admin/Footer.tsx
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2026 StayWise. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
