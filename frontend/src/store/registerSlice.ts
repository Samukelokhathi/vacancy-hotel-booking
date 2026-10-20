import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { RegisterUser } from "../models/hotel.types";

export interface SignUpData {
  name: string;
  surname: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: SignUpData = {
  name: "",
  surname: "",
  email: "",
  number: "",
  password: "",
  confirmPassword: "",

  isLoading: false,
  error: null,
};

// thunk

export const registerUser = createAsyncThunk<
  RegisterUser,
  SignUpData,
  { rejectValue: string }
>(
  "signup/create",

  async (userData, { rejectWithValue }) => {
    try {
      // 1. Check if passwords match

      if (userData.password !== userData.confirmPassword) {
        return rejectWithValue("Passwords do not match");
      }

      // 2. Check if email already exists

      const existingUsers = await axios.get<RegisterUser[]>(
        "http://localhost:3000/users",
        {
          params: {
            email: userData.email,
          },
        },
      );

      if (existingUsers.data.length > 0) {
        return rejectWithValue("Email is already registered");
      }

      // 3. Create user

      const response = await axios.post<RegisterUser>(
        "http://localhost:3000/users",
        {
          name: userData.name,
          surname: userData.surname,
          number: userData.number,
          email: userData.email,
          password: userData.password,
          lists: [],
        },
      );

      console.log("User created:", response.data);

      // 4. Return created user

      return response.data;
    } catch (error) {
      console.error("Signup error:", error);

      return rejectWithValue("Unable to create account");
    }
  },
);

const SignUpSlice = createSlice({
  name: "signup",

  initialState,

  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setSurname(state, action: PayloadAction<string>) {
      state.surname = action.payload;
    },
    setNumber(state, action: PayloadAction<string>) {
      state.number = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setConfirmPassword(state, action: PayloadAction<string>) {
      state.confirmPassword = action.payload;
    },

    resetForm(state) {
      Object.assign(state, initialState);
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = (action.payload as string) || "Signup failed";
      });
  },
});

export const {
  setName,
  setSurname,
  setNumber,
  setEmail,
  setPassword,
  setConfirmPassword,
  resetForm,
} = SignUpSlice.actions;

export default SignUpSlice.reducer;
