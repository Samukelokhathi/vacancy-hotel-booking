import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import loginReducer from "./loginSlice";
import hotelReducer from "./hotelSlice"
export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    hotels: hotelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
