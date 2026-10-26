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

  // false until the first token check has finished, so protected pages wait
  authChecked: boolean;
}

const initialState: LogInState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  authChecked: false,
};

// reads the user id from the token, then loads that user from the server
const fetchUser = async (token: string): Promise<User> => {
  const { id } = jwtDecode<{ id: number }>(token);
  const response = await api.get<User>(`/auth/users/${id}`);
  return response.data;
};

// saves the token, then loads the user (normal login and Google login both use it)
const finishLogin = async (token: string): Promise<User> => {
  // saved first, so the axios interceptor can attach it to the next request
  localStorage.setItem("token", token);
  return fetchUser(token);
};

// LOGIN THUNK: email + password
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
  "auth/login",

  async (loginData, { rejectWithValue }) => {
    try {
      // the server checks the password and returns a token
      const response = await api.post<{ message: string; token: string }>(
        "/auth/login",
        {
          email: loginData.email.trim(),
          password: loginData.password,
        },
      );

      return await finishLogin(response.data.token);
    } catch (error) {
      localStorage.removeItem("token");
      // shows the backend's message, e.g. "Invalid email or password"
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

// GOOGLE LOGIN THUNK: sends Google's credential to our server,
// which checks it with Google and answers with our own token
export const googleLogin = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string; token: string }>(
      "/auth/google",
      { credential },
    );

    return await finishLogin(response.data.token);
  } catch (error) {
    localStorage.removeItem("token");
    return rejectWithValue(getErrorMessage(error, "Google sign-in failed"));
  }
});

// GET LOGGED-IN USER
// This runs when the page is refreshed.
export const getLoggedInUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  "auth/getLoggedInUser",

  async (_, { rejectWithValue }) => {
    // the saved token is the source of truth
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

// SHARED REDUCERS: written once, used by login, Google login and restore
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

const loginFailed = (
  state: LogInState,
  action: { payload?: string | undefined },
) => {
  state.isLoading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = action.payload ?? "Login failed";
  state.authChecked = true; // the login attempt has finished
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

      // only the token is stored in the browser
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN (email + password)
      .addCase(login.pending, startLoading)
      .addCase(login.fulfilled, setUser)
      .addCase(login.rejected, loginFailed)

      // LOGIN (Google)
      .addCase(googleLogin.pending, startLoading)
      .addCase(googleLogin.fulfilled, setUser)
      .addCase(googleLogin.rejected, loginFailed)

      // RESTORE USER (page refresh)
      .addCase(getLoggedInUser.pending, (state) => {
        startLoading(state);
        state.authChecked = false;
      })
      .addCase(getLoggedInUser.fulfilled, setUser)
      .addCase(getLoggedInUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // no error message here, or "No logged-in user" would show
        // on the login page for every visitor who simply isn't logged in
        state.authChecked = true;
      });
  },
});

export const { logout, authChecked } = Login.actions;

export default Login.reducer;
