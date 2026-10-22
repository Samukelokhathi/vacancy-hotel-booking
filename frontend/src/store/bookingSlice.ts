import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../api/axios";
import type {
  Booking,
  BookingDetails,
  BookingFormData,
} from "../models/booking.types";

interface BookingState {
  myBookings: BookingDetails[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  myBookings: [],
  isLoading: false,
  error: null,
};

export const createBooking = createAsyncThunk<
  Booking,
  BookingFormData,
  { rejectValue: string }
>("bookings/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<Booking>("/bookings", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to create booking"));
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
    return rejectWithValue(getErrorMessage(error, "Unable to load bookings"));
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
    return rejectWithValue(getErrorMessage(error, "Unable to cancel booking"));
  }
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const booking = state.myBookings.find((b) => b.id === action.payload.id);
        if (booking) booking.status = action.payload.status;
      })
      // pending and rejected are the same for all three thunks
      .addMatcher(
        isPending(createBooking, fetchMyBookings, cancelBooking),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(createBooking, fetchMyBookings, cancelBooking),
        (state, action) => {
          state.isLoading = false;
          state.error =
            (action.payload as string | undefined) ?? "Something went wrong";
        },
      );
  },
});

export default bookingSlice.reducer;