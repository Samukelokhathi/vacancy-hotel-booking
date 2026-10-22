import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { createBooking } from "../../store/bookingSlice";
import { useCheckout } from "../../hooks/useCheckout";
import type { Room } from "../../models/hotel.types";
import { countNights, formatPrice, todayString } from "../../utils/format";
import Button from "../button/button";
import styles from "./bookingForm.module.css";

export default function BookingForm({ rooms }: { rooms: Room[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const payForBooking = useCheckout();

  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );
  const isLoading = useSelector((state: RootState) => state.bookings.isLoading);

  const [form, setForm] = useState({
    roomId: String(rooms[0]?.id ?? ""),
    checkIn: "",
    checkOut: "",
    numberOfRooms: "1",
    guests: "1",
  });
  const [formError, setFormError] = useState("");

  // one handler for every input (it uses each input's `name`)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (rooms.length === 0) {
    return <p className="muted">No rooms available to book yet.</p>;
  }

  const room = rooms.find((r) => r.id === Number(form.roomId));
  const numberOfRooms = Number(form.numberOfRooms);
  const guests = Number(form.guests);
  const nights = countNights(form.checkIn, form.checkOut);
  const total =
    room && nights > 0 ? nights * room.pricePerNight * numberOfRooms : 0;

  // same rules as the backend, so mistakes show instantly
  const validate = (): string => {
    if (!room) return "Choose a room";
    if (!form.checkIn || !form.checkOut)
      return "Select check-in and check-out dates";
    if (form.checkIn < todayString()) return "Check-in cannot be in the past";
    if (nights < 1) return "Check-out must be after check-in";
    if (numberOfRooms < 1 || numberOfRooms > room.quantity) {
      return `Choose between 1 and ${room.quantity} rooms`;
    }
    if (guests < 1 || guests > room.capacity * numberOfRooms) {
      return `${numberOfRooms} room(s) fit up to ${room.capacity * numberOfRooms} guests`;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    // guests can browse, but must log in to book (they come back here after)
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const problem = validate();
    if (problem || !room) {
      setFormError(problem);
      return;
    }

    let bookingId: number;
    try {
      const booking = await dispatch(
        createBooking({
          roomId: room.id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          numberOfRooms,
          guests,
        }),
      ).unwrap();
      bookingId = booking.id;
    } catch (err) {
      setFormError(String(err)); // e.g. "Not enough rooms available for these dates"
      return;
    }

    try {
      await payForBooking(bookingId); // leaves the site for Stripe
    } catch {
      navigate("/profile"); // booking exists: pay from "My bookings"
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Book your stay</h3>

      <fieldset className={styles.rooms}>
        <legend>Room type</legend>
        {rooms.map((r) => (
          <label key={r.id} className={styles.room}>
            <input
              type="radio"
              name="roomId"
              value={r.id}
              checked={form.roomId === String(r.id)}
              onChange={handleChange}
            />
            <span>
              <strong>{r.roomType}</strong>
              <small>
                Up to {r.capacity} guests · {formatPrice(r.pricePerNight)} /
                night
              </small>
            </span>
          </label>
        ))}
      </fieldset>

      <div className={styles.row}>
        <label>
          Check-in
          <input
            type="date"
            name="checkIn"
            min={todayString()}
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
            min={form.checkIn || todayString()}
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
            max={room?.quantity}
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

      {total > 0 && (
        <p className={styles.total}>
          {nights} night(s) × {numberOfRooms} room(s) ={" "}
          <strong>{formatPrice(total)}</strong>
        </p>
      )}

      {formError && <p className="error-text">{formError}</p>}

      <Button type="submit" disabled={isLoading}>
        {!isAuthenticated
          ? "Log in to book"
          : isLoading
            ? "Please wait..."
            : "Book & pay"}
      </Button>
    </form>
  );
}
