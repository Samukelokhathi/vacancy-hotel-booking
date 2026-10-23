import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { createBooking } from "../../store/bookingSlice";
import { startPayment } from "../../store/paymentSlice";
import type { Room } from "../../models/hotel.types";
import type { BookingFormData } from "../../models/hotel.types";
import { formatPrice, countNights } from "../../utils/format";
import Button from "../button/button";
import styles from "./bookingForm.module.css";

export default function BookingForm({ rooms }: { rooms: Room[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );
  const isBooking = useSelector((state: RootState) => state.bookings.isLoading);
  const isPaying = useSelector((state: RootState) => state.payments.isLoading);

  const [form, setForm] = useState<BookingFormData>({
    roomId: rooms[0]?.id ?? 0,
    checkIn: "",
    checkOut: "",
    numberOfRooms: 1,
    guests: 1,
  });
  const [formError, setFormError] = useState("");

  if (rooms.length === 0) {
    return <p className="muted">No rooms available to book yet.</p>;
  }
  if (!isAuthenticated) {
    return (
      <p>
        <Link to="/login">Log in</Link> to book a room.
      </p>
    );
  }

  const room = rooms.find((r) => r.id === form.roomId) ?? rooms[0]!;
  const nights = countNights(form.checkIn, form.checkOut);
  const total = nights * room.pricePerNight * form.numberOfRooms;
  const today = new Date().toISOString().split("T")[0]!;
  const isBusy = isBooking || isPaying;

  // one handler for every field: dates stay text, the rest become numbers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "date" ? value : Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!form.checkIn || !form.checkOut) {
      return setFormError("Select check-in and check-out dates");
    }
    if (form.checkIn < today) {
      return setFormError("Check-in cannot be in the past");
    }
    if (nights === 0) {
      return setFormError("Check-out must be after check-in");
    }
    if (form.numberOfRooms < 1 || form.numberOfRooms > room.quantity) {
      return setFormError(`Only ${room.quantity} room(s) of this type exist`);
    }
    if (form.guests < 1 || form.guests > room.capacity * form.numberOfRooms) {
      return setFormError(
        `This selection sleeps at most ${room.capacity * form.numberOfRooms} guests`,
      );
    }

    try {
      const booking = await dispatch(
        createBooking({ ...form, roomId: room.id }),
      ).unwrap();
      // sends the browser to Paystack
      await dispatch(startPayment(booking.id)).unwrap();
    } catch (error) {
      setFormError(typeof error === "string" ? error : "Something went wrong");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Book your stay</h3>

      <label>
        Room type
        <select name="roomId" value={room.id} onChange={handleChange}>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomType} - {formatPrice(r.pricePerNight)}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.row}>
        <label>
          Check-in
          <input
            type="date"
            name="checkIn"
            min={today}
            value={form.checkIn}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Check-out
          <input
            type="date"
            name="checkOut"
            min={form.checkIn || today}
            value={form.checkOut}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Rooms
          <input
            type="number"
            name="numberOfRooms"
            min={1}
            max={room.quantity}
            value={form.numberOfRooms}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Guests
          <input
            type="number"
            name="guests"
            min={1}
            value={form.guests}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      {nights > 0 && (
        <p className={styles.summary}>
          {nights} night(s) × {form.numberOfRooms} room(s) ={" "}
          <strong>{formatPrice(total)}</strong>
        </p>
      )}

      {formError && <p className="error-text">{formError}</p>}

      <Button type="submit" disabled={isBusy}>
        {isBusy ? "Please wait..." : "Book and pay"}
      </Button>
    </form>
  );
}
