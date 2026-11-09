import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { verifyPayment } from "../../store/paymentSlice";
import { formatPrice } from "../../utils/format";
import styles from "./paymentVerify.module.css";

export default function PaymentVerifyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [params] = useSearchParams();

  const reference = params.get("reference") ?? params.get("trxref");

  const { verified, error } = useSelector((state: RootState) => state.payments);

  useEffect(() => {
    if (reference) dispatch(verifyPayment(reference));
  }, [dispatch, reference]);

  if (!reference) {
    return (
      <div className={styles.page}>
        <section className={styles.card}>
          <div className={styles.errorIcon}>!</div>
          <h1>Missing payment reference</h1>
          <p className={styles.description}>
            We could not find your payment reference.
          </p>
          <Link to="/bookings" className={styles.button}>
            View my bookings
          </Link>
        </section>
      </div>
    );
  }

  if (verified) {
    return (
      <div className={styles.page}>
        <section className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.eyebrow}>PAYMENT CONFIRMED</p>
          <h1>Payment successful</h1>
          <p className={styles.description}>
            Your payment has been received successfully.
          </p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>Amount paid</span>
              <strong>{formatPrice(verified.amount)}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Booking number</span>
              <strong>#{verified.bookingId}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Payment reference</span>
              <strong className={styles.reference}>{verified.reference}</strong>
            </div>
          </div>

          <Link to="/bookings" className={styles.button}>
            View my bookings
          </Link>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <section className={styles.card}>
          <div className={styles.errorIcon}>!</div>
          <p className={styles.eyebrow}>PAYMENT STATUS</p>
          <h1>Payment not confirmed</h1>
          <p className={styles.errorMessage}>{error}</p>

          <Link to="/bookings" className={styles.button}>
            Back to my bookings
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.loader} />
        <p className={styles.eyebrow}>PLEASE WAIT</p>
        <h1>Confirming your payment</h1>
        <p className={styles.description}>
          We're checking your transaction. Please don't close this page.
        </p>
      </section>
    </div>
  );
}
