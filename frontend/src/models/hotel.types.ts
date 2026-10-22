export type UserRole = "client" | "admin";

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
  coverImage?: string | null;
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

export type BookingStatus = "pending" | "approved" | "cancelled";

export interface BookingInput {
  roomId: number;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  guests: number;
}

export interface Booking extends BookingInput {
  id: number;
  userId: number;
  status: BookingStatus;
  paid: boolean;
}

// what GET /bookings/my returns: booking + hotel and room names
export interface BookingDetails extends Booking {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomType: string;
}
