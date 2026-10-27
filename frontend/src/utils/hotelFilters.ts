import type { Hotel } from "../models/hotel.types";

export interface HotelFilters {
  city: string;
  maxPrice: number; // 0 means any price
  stars: number; // 0 means any rating
}

export const emptyFilters: HotelFilters = { city: "", maxPrice: 0, stars: 0 };

export const priceOptions = [
  { label: "Any price", value: 0 },
  { label: "Up to R 1 000", value: 1000 },
  { label: "Up to R 1 500", value: 1500 },
  { label: "Up to R 2 000", value: 2000 },
  { label: "Up to R 3 000", value: 3000 },
];

export const starOptions = [
  { label: "Any", value: 0 },
  { label: "3 stars and up", value: 3 },
  { label: "4 stars and up", value: 4 },
  { label: "5 stars", value: 5 },
];

// reads the filters from the page address
export const filtersFromParams = (params: URLSearchParams): HotelFilters => ({
  city: params.get("city") ?? "",
  maxPrice: Number(params.get("maxPrice")) || 0,
  stars: Number(params.get("stars")) || 0,
});

// writes the filters into an address, leaving out empty ones
export const filtersToParams = (filters: HotelFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.city.trim()) params.set("city", filters.city.trim());
  if (filters.maxPrice > 0) params.set("maxPrice", String(filters.maxPrice));
  if (filters.stars > 0) params.set("stars", String(filters.stars));
  return params;
};

// keeps only the hotels that match every filter
export const filterHotels = (
  hotels: Hotel[],
  filters: HotelFilters,
): Hotel[] =>
  hotels.filter((hotel) => {
    const matchesCity = hotel.city
      .toLowerCase()
      .includes(filters.city.trim().toLowerCase());
    const matchesPrice =
      filters.maxPrice === 0 || hotel.pricePerNight <= filters.maxPrice;
    const matchesStars = hotel.starRating >= filters.stars;

    return matchesCity && matchesPrice && matchesStars;
  });