export type UserRole = "client" | "admin";

export interface User {
  id: number;
  name: string;
  surname: string;
  cellphone: number;
  email: string;
  password: string;
  role: UserRole;
  createdat: Date;
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
  createdAt: Date;
}
export type HotelInput = Omit<Hotel, "id" | "createdBy" | "createdAt">;

export interface Room {
  id: number;
  hotelId: number;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  quantity: number;
  createdAt: Date;
}

export type RoomInput = Omit<Room, "id" | "createdAt">;

export interface HotelImage {
  id: number;
  hotelId: number;
  url: string;
}

export type HotelImageInput = Omit<HotelImage, "id">;

export type BookingStatus = "pending" | "approved" | "cancelled";
export interface Booking {
  id: number;
  userId: number;
  roomId: string;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  guests: number;
  status: BookingStatus;
  paid: boolean;
}

export type BookingInput = Omit<Booking, "id" | "userId" | "status" | "paid">;

export interface BookingDetails extends Booking {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomType: string;
}

export type PaymentStatus = "pending" | "success" | "failed";

export interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
}

export type PaymentInput = Omit<Payment, "id" | "status" | "paidAt">;

// Payment plus guest, hotel and room info, for the admin list
export interface PaymentDetails extends Payment {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomType: string;
}
