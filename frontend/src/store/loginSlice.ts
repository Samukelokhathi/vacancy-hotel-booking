import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { api, getErrorMessage } from "../api/axios";

export type UserRole = "client" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

interface TokenPayload extends AuthUser {
  exp: number; // expiry time in seconds, added by jwt.sign
}

interface Session {
  token: string;
  user: AuthUser;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

// turns a token into a session, or null if it is broken or expired
const readToken = (token: string | null): Session | null => {
  if (!token) return null;
  try {
    const { id, email, role, exp } = jwtDecode<TokenPayload>(token);
    if (exp * 1000 < Date.now()) return null;
    return { token, user: { id, email, role } };
  } catch {
    return null;
  }
};

// on page load: restore the saved login, and drop a stale token
const saved = readToken(localStorage.getItem("token"));
if (!saved) localStorage.removeItem("token");

const initialState: LoginState = {
  token: saved?.token ?? null,
  user: saved?.user ?? null,
  isLoading: false,
  error: null,
};

// thunk: sends the credentials to POST /auth/login
export const loginUser = createAsyncThunk<
  Session,
  LoginCredentials,
  { rejectValue: string }
>("login/create", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string; token: string }>(
      "/auth/login",
      {
        email: credentials.email.trim(),
        password: credentials.password,
      },
    );

    const session = readToken(response.data.token);
    if (!session) return rejectWithValue("Received an invalid token");

    localStorage.setItem("token", session.token);
    return session;
  } catch (error) {
    // shows the backend's message, e.g. "Invalid email or password"
    return rejectWithValue(getErrorMessage(error, "Unable to log in"));
  }
});

const loginSlice = createSlice({
  name: "login",

  initialState,

  reducers: {
    // clears the session (localStorage is cleared here to keep things simple)
    logout(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;