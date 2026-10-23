import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { verifyPayment } from "../../store/paymentSlice";
import { formatPrice } from "../../utils/format";

export default function PaymentVerifyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [params] = useSearchParams();
  // Paystack sends the reference back in the URL
  const reference = params.get("reference") ?? params.get("trxref");
  const { verified, error } = useSelector((state: RootState) => state.payments);

  useEffect(() => {
    if (reference) dispatch(verifyPayment(reference));
  }, [dispatch, reference]);

  if (!reference) {
    return <p className="error-text">Missing payment reference.</p>;
  }

  if (verified) {
    return (
      <>
        <h1>Payment successful</h1>
        <p>
          We received {formatPrice(verified.amount)} for booking #
          {verified.bookingId}.
        </p>
        <p className="muted">Reference: {verified.reference}</p>
        <Link to="/bookings">View my bookings</Link>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1>Payment not confirmed</h1>
        <p className="error-text">{error}</p>
        <Link to="/bookings">Back to my bookings</Link>
      </>
    );
  }

  return <p>Confirming your payment...</p>;
}