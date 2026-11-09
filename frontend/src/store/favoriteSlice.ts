import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../api/axios";
import type { Hotel } from "../models/hotel.types";
import { logout } from "./loginSlice";

// Backend routes (routes/favoriteRoutes.ts), all need a logged-in user:
// GET /favorites, GET /favorites/ids, POST /favorites, DELETE /favorites/:hotelId

interface FavoriteState {
  favoriteHotelIds: number[];
  favoriteHotels: Hotel[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favoriteHotelIds: [],
  favoriteHotels: [],
  isLoading: false,
  error: null,
};

export const fetchFavoriteIds = createAsyncThunk<
  number[],
  void,
  { rejectValue: string }
>("favorites/fetchIds", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<number[]>("/favorites/ids");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load favorites"));
  }
});

export const fetchFavoriteHotels = createAsyncThunk<
  Hotel[],
  void,
  { rejectValue: string }
>("favorites/fetchHotels", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Hotel[]>("/favorites");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load favorites"));
  }
});

export const addFavorite = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("favorites/add", async (hotelId, { rejectWithValue }) => {
  try {
    await api.post("/favorites", { hotelId });
    return hotelId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to save hotel"));
  }
});

export const removeFavorite = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("favorites/remove", async (hotelId, { rejectWithValue }) => {
  try {
    await api.delete(`/favorites/${hotelId}`);
    return hotelId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to remove hotel"));
  }
});

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.favoriteHotelIds = action.payload;
        state.error = null;
      })
      .addCase(fetchFavoriteIds.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to load favorites";
      })

      .addCase(fetchFavoriteHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteHotels = action.payload;
        state.favoriteHotelIds = action.payload.map((hotel) => hotel.id);
      })
      .addCase(fetchFavoriteHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to load favorites";
      })

      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.favoriteHotelIds.includes(action.payload)) {
          state.favoriteHotelIds.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to save hotel";
      })

      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favoriteHotelIds = state.favoriteHotelIds.filter(
          (hotelId) => hotelId !== action.payload,
        );
        state.favoriteHotels = state.favoriteHotels.filter(
          (hotel) => hotel.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to remove hotel";
      })

      // favourites belong to the logged-in user
      .addCase(logout, () => initialState);
  },
});

export default favoriteSlice.reducer;
