import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../api/axios";

export interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpData extends RegisterFormData {
  isLoading: boolean;
  error: string | null;
}

const initialState: SignUpData = {
  name: "",
  surname: "",
  email: "",
  cellphone: "",
  password: "",
  confirmPassword: "",

  isLoading: false,
  error: null,
};

export interface SignUpData extends RegisterFormData {
  isLoading: boolean;
  error: string | null;
}

// thunk

export const registerUser = createAsyncThunk<
  string,
  RegisterFormData,
  { rejectValue: string }
>(
  "signup/create",

  async (userData, { rejectWithValue }) => {
    if (userData.password !== userData.confirmPassword) {
      return rejectWithValue("Passwords do not match");
    }

    if (!/^\d{10}$/.test(userData.cellphone)) {
      return rejectWithValue(
        "Cellphone number must be 10 digits, e.g. 0712345678",
      );
    }
    try {
      const response = await api.post<{ message: string }>("/auth/register", {
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        email: userData.email.trim(),
        cellphone: userData.cellphone.trim(),
        password: userData.password,
      });

      return response.data.message;
    } catch (error) {
      // CHANGED: shows the backend's message (e.g. "Email is already in use")
      return rejectWithValue(
        getErrorMessage(error, "Unable to create account"),
      );
    }
  },
);

const SignUpSlice = createSlice({
  name: "signup",

  initialState,

  reducers: {
    // CHANGED: one reducer replaces setName, setSurname, setNumber,
    // setEmail, setPassword and setConfirmPassword
    setField(
      state,
      action: PayloadAction<{ field: keyof RegisterFormData; value: string }>,
    ) {
      state[action.payload.field] = action.payload.value;
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
        state.isLoading = false; // CHANGED: was true, so the button stayed disabled
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Signup failed";
      });
  },
});

export const { setField, resetForm } = SignUpSlice.actions;

export default SignUpSlice.reducer;
