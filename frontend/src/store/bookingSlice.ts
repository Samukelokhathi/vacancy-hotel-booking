import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../api/axios";
import type {
  Booking,
  BookingDetails,
  BookingInput,
} from "../models/hotel.types";

interface BookingState {
  bookings: BookingDetails[];
  isLoading: boolean;
  error: string | null; 
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

// Pages show errors from the other thunks with .unwrap(), so only the list uses state.error

export const createBooking = createAsyncThunk<
  Booking,
  BookingInput,
  { rejectValue: string }
>("bookings/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<Booking>("/bookings", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to create the booking"));
  }
});

export const fetchMyBookings = createAsyncThunk<
  BookingDetails[],
  void,
  { rejectValue: string }
>("bookings/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<BookingDetails[]>("/bookings/my");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load your bookings"));
  }
});

export const cancelBooking = createAsyncThunk<
  Booking,
  number,
  { rejectValue: string }
>("bookings/cancel", async (id, { rejectWithValue }) => {
  try {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to cancel the booking"));
  }
});

// asks the backend for a Paystack payment link
export const startPayment = createAsyncThunk<
  { url: string },
  number,
  { rejectValue: string }
>("payments/start", async (bookingId, { rejectWithValue }) => {
  try {
    const response = await api.post<{ url: string }>("/payments/checkout", {
      bookingId,
    });
    return { url: response.data.url };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to start the payment"));
  }
});

// after Paystack redirects back: the backend checks with Paystack and marks it paid
export const verifyPayment = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>("payments/verify", async (sessionId, { rejectWithValue }) => {
  try {
    const response = await api.post<Booking>("/payments/verify", { sessionId });
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to verify the payment"));
  }
});

const allThunks = [
  createBooking,
  fetchMyBookings,
  cancelBooking,
  startPayment,
  verifyPayment,
] as const;

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to load your bookings";
      })
      // keeps the list in sync without loading it again
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = state.bookings.find((b) => b.id === action.payload.id);
        if (booking) booking.status = action.payload.status;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        const booking = state.bookings.find((b) => b.id === action.payload.id);
        if (booking) booking.paid = action.payload.paid;
      })
      // loading flag for all five thunks, written once
      .addMatcher(isPending(...allThunks), (state) => {
        state.isLoading = true;
      })
      .addMatcher(isFulfilled(...allThunks), (state) => {
        state.isLoading = false;
      })
      .addMatcher(isRejected(...allThunks), (state) => {
        state.isLoading = false;
      });
  },
});

export default bookingSlice.reducer;