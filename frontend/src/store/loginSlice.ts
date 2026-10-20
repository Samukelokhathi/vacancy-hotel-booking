import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
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

  // Tracks whether the initial authentication check is complete.
  authChecked: boolean;
}

const initialState: LogInState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Start as false so protected routes wait.
  authChecked: false,
};

// LOGIN THUNK

export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
  "auth/login",

  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>("http://localhost:3000/users");

      const loggedUser = response.data.find(
        (user) =>
          user.email === loginData.email &&
          user.password === loginData.password,
      );

      if (!loggedUser) {
        return rejectWithValue("Invalid email or password");
      }

      // Save logged-in user's ID
      // so we can find this user again
      // after refreshing the page.

      localStorage.setItem("userId", loggedUser.id);

      return loggedUser;
    } catch (error) {
      console.error(error);

      return rejectWithValue("Unable to connect to server");
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
    try {
      // Get the saved user ID from localStorage.
      // Redux is empty after a page refresh.
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return rejectWithValue("No logged-in user");
      }

      // Get the same user from json-server.
      const response = await axios.get<User>(
        `http://localhost:3000/users/${userId}`,
      );

      // Return the restored user to Redux.
      return response.data;
    } catch (error) {
      console.error(error);


      return rejectWithValue("Unable to restore user");
    }
  },
);

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

      // Remove saved user
      localStorage.removeItem("userId");

      // Also remove the saved user object.
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;
        console.log(state.user);

        state.isAuthenticated = true;

        state.error = null;

        // Login has completed.
        state.authChecked = true;

        localStorage.setItem("user", JSON.stringify(action.payload));
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;

        state.user = null;

        state.isAuthenticated = false;

        state.error = action.payload || "Login failed";

        // Login attempt has completed.
        state.authChecked = true;
      });

    // RESTORE USER

    builder

      .addCase(getLoggedInUser.pending, (state) => {
        //Show loading while restoring the user.
        state.isLoading = true;
        state.error = null;

        state.authChecked = false;
      })

      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;

        state.isAuthenticated = true;

        state.error = null;

        //  Authentication check is complete.
        state.authChecked = true;

        // Keep the restored user saved.
        localStorage.setItem("user", JSON.stringify(action.payload));
      })

      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.isLoading = false;

        // Authentication check is complete.
        state.authChecked = true;

       
        state.error = action.payload || "Unable to restore user";
      });

    // ADD SHOPPING LIST

    builder

      .addCase(addShoppingList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(addShoppingList.fulfilled, (state, action) => {
        state.isLoading = false;

        // Updated user contains new list
        state.user = action.payload;

        state.error = null;

        // Keep the updated user saved.
        localStorage.setItem("user", JSON.stringify(action.payload));
      })

      .addCase(addShoppingList.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload || "Failed to create shopping list";
      });

    // DELETE SHOPPING LIST

    builder.addCase(deleteShoppingList.fulfilled, (state, action) => {
      if (state.user) {
        state.user = action.payload;

        // Keep the updated user saved.
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    });
  },
});

export const { logout, authChecked } = Login.actions;

export default Login.reducer;
