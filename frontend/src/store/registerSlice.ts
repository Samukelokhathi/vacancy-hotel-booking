import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api/axios";
import type { RegisterUser } from "../models/hotel.type";

interface RegisterState {
    loading: boolean;
    error: string | null;
}

const initialState: RegisterState = { 
    loading: false,
    error: null,
}

export const registerUser = createAsyncThunk<string, RegisterUser, { rejectValue: string }>(
    "register/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post("/register", userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data?.message ?? "Could not reached the server");
            }
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Registration failed";
            });
    }
});

export const { clearError } = registerSlice.actions;
export default registerSlice.reducer;