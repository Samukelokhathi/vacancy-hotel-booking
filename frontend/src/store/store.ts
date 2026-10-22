import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import loginReducer from "./loginSlice";
import hotelReducer from "./hotelSlice";
import bookiReducer from "./bookingSlice";
import paymentReducer from "./paymentSlice";
export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    hotels: hotelReducer,
    bookings: bookiReducer,
    payments: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
