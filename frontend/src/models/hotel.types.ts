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
export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  guests: number;
  status: BookingStatus;
  paid: boolean;
}

// what the form sends
export interface BookingFormData {
  roomId: number;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  guests: number;
}

// Booking plus hotel and room info, from GET /bookings/my
export interface BookingDetails extends Booking {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomType: string;
  hotelId: number;
  totalPrice: number;
}

export interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paidAt: string | null;
}
