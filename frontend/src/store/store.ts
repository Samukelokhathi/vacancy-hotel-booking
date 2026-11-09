import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import loginReducer from "./loginSlice";
import hotelReducer from "./hotelSlice";
import bookingReducer from "./bookingSlice";
import paymentReducer from "./paymentSlice";
import favoriteReducer from "./favoriteSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    hotels: hotelReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    favorites: favoriteReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
