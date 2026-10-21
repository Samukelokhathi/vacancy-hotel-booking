export type UserRole = "client" | "admin"; // NEW


export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  cellphone: string | number;
  password: string;
  role: UserRole;
  createdat: string; 
}


export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  starRating: number;
  pricePerNight: number;
  facilities: string[];
  policies: string;
  createdBy: number | null;
  createdAt: string;
  coverImage?: string | null; // only on the list response
}

export interface HotelImage {
  id: number;
  hotelId: number;
  url: string;
}

export interface Room {
  id: number;
  hotelId: number;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  quantity: number;
  createdAt: string;
}