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
  images?: HotelImage[];
}

export interface HotelImage {
  id: number;
  hotelId: number;
  url: string;
  isCover?: boolean;
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

export interface BookingFormData {
  roomId: number;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  guests: number;
}

export interface BookingDetails extends Booking {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomType: string;
  // not returned by GET /bookings/my yet: add h.id AS "hotelId" to detailsSelect in bookingService.ts
  hotelId?: number;
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
