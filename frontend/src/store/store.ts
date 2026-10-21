import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import loginReducer from "./loginSlice";
export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
