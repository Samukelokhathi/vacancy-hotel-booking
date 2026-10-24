import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { startPayment } from "../store/paymentSlice";
export function useCheckout() {
  const dispatch = useDispatch<AppDispatch>();

  // asks the backend for a Paystack link, then sends the browser there
  return async (bookingId: number) => {
    const  url  = await dispatch(startPayment(bookingId)).unwrap();
    window.location.href = url;
  };
}