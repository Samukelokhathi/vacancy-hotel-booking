import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { api, getErrorMessage } from "../api/axios";
import type { User } from "../models/hotel.types";

// LOGIN DATA
export interface LoginData {
  email: string;
  password: string;
}

// AUTH STATE
interface LogInState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  authChecked: boolean;
}

const initialState: LogInState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  authChecked: false,
};

const fetchUser = async (token: string): Promise<User> => {
  const { id } = jwtDecode<{ id: number }>(token);
  const response = await api.get<User>(`/auth/users/${id}`);
  return response.data;
};

// LOGIN THUNK
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
  "auth/login",

  async (loginData, { rejectWithValue }) => {
    try {
      // CHANGED: the server checks the password and returns a token
      const response = await api.post<{ message: string; token: string }>(
        "/auth/login",
        {
          email: loginData.email.trim(),
          password: loginData.password,
        },
      );

      // saved first, so the interceptor can attach it to the next request
      localStorage.setItem("token", response.data.token);

      return await fetchUser(response.data.token);
    } catch (error) {
      localStorage.removeItem("token");
      // shows the backend's message, e.g. "Invalid email or password"
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

// GET LOGGED-IN USER
// This runs when the page is refreshed.
export const getLoggedInUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  "auth/getLoggedInUser",

  async (_, { rejectWithValue }) => {
    // CHANGED: the saved token is the source of truth (no more userId / user)
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No logged-in user");
    }

    try {
      return await fetchUser(token);
    } catch (error) {
      // expired or invalid token
      localStorage.removeItem("token");
      return rejectWithValue(getErrorMessage(error, "Unable to restore user"));
    }
  },
);

// NEW: shared reducers, so login and restore don't repeat the same lines
const startLoading = (state: LogInState) => {
  state.isLoading = true;
  state.error = null;
};

const setUser = (state: LogInState, action: PayloadAction<User>) => {
  state.isLoading = false;
  state.user = action.payload;
  state.isAuthenticated = true;
  state.error = null;
  state.authChecked = true;
};

// AUTH SLICE
const Login = createSlice({
  name: "login",

  initialState,

  reducers: {
    // Mark authentication check as complete.
    authChecked(state) {
      state.authChecked = true;
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // CHANGED: only the token is stored now
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, startLoading) // CHANGED
      .addCase(login.fulfilled, setUser) // CHANGED

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Login failed";
        state.authChecked = true; // Login attempt has completed.
      })

      // RESTORE USER
      .addCase(getLoggedInUser.pending, (state) => {
        startLoading(state); // CHANGED
        state.authChecked = false;
      })
      .addCase(getLoggedInUser.fulfilled, setUser) // CHANGED

      .addCase(getLoggedInUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // CHANGED: no error message here, or "No logged-in user" would show
        // on the login page for every visitor who simply isn't logged in
        state.authChecked = true;
      });
  },
});

export const { logout, authChecked } = Login.actions;

export default Login.reducer;
