import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../api/axios";
import type { Payment } from "../models/hotel.types";

interface PaymentState {
  verified: Payment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  verified: null,
  isLoading: false,
  error: null,
};

// asks the server for a Paystack link, then sends the browser to it
export const startPayment = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("payments/start", async (bookingId, { rejectWithValue }) => {
  try {
    const response = await api.post<{ authorizationUrl: string }>(
      "/payments/initialize",
      { bookingId },
    );
    window.location.href = response.data.authorizationUrl;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to start the payment"));
  }
});

// runs on the page Paystack sends the customer back to
export const verifyPayment = createAsyncThunk<
  Payment,
  string,
  { rejectValue: string }
>("payments/verify", async (reference, { rejectWithValue }) => {
  try {
    const response = await api.post<Payment>("/payments/verify", { reference });
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to verify the payment"));
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // startPayment stays "loading" on purpose: the browser is leaving the page
      .addCase(startPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to start the payment";
      })

      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verified = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verified = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to verify the payment";
      });
  },
});

export default paymentSlice.reducer;