import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { emptyFilters, type HotelFilters } from "../utils/hotelFilters";

// The one search shared by every page. The home page copies its address

interface SearchState {
  filters: HotelFilters;
}

const initialState: SearchState = {
  filters: emptyFilters,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchFilters(state, action: PayloadAction<HotelFilters>) {
      state.filters = action.payload;
    },
  },
});

export const { setSearchFilters } = searchSlice.actions;

export default searchSlice.reducer;
