import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import type { Room } from "../../models/hotel.types";
import { createBooking } from "../../store/bookingSlice";
import { useCheckout } from "../../hooks/useCheckout";
import { countNights, formatPrice } from "../../utils/format";
import { todayDateKey } from "../../utils/dates";
import { ShieldIcon } from "../icons/icons";
import styles from "./bookingForm.module.css";

interface BookingFormProps {
  rooms: Room[];
  hotelPricePerNight: number;
  selectedRoomId: number;
  onRoomChange: (roomId: number) => void;
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
}

// Creates the booking (POST /bookings) and then starts Paystack checkout
export default function BookingForm({
  rooms,
  hotelPricePerNight,
  selectedRoomId,
  onRoomChange,
  checkIn,
  checkOut,
  onDatesChange,
}: BookingFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const checkout = useCheckout();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );
  const isBooking = useSelector((state: RootState) => state.bookings.isLoading);
  const isPaying = useSelector((state: RootState) => state.payments.isLoading);

  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [guests, setGuests] = useState(1);
  const [formError, setFormError] = useState("");

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const pricePerNight = selectedRoom?.pricePerNight ?? hotelPricePerNight;
  const nights = countNights(checkIn, checkOut);
  const totalPrice = nights * pricePerNight * numberOfRooms;
  const todayKey = todayDateKey();
  const isBusy = isBooking || isPaying;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!selectedRoom) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      setFormError("Add your check-in and checkout dates");
      return;
    }
    if (checkIn < todayKey) {
      setFormError("Check-in cannot be in the past");
      return;
    }
    if (nights === 0) {
      setFormError("Checkout must be after check-in");
      return;
    }
    if (numberOfRooms < 1 || numberOfRooms > selectedRoom.quantity) {
      setFormError(`Only ${selectedRoom.quantity} room(s) of this type exist`);
      return;
    }
    if (guests < 1 || guests > selectedRoom.capacity * numberOfRooms) {
      setFormError(
        `This selection sleeps at most ${selectedRoom.capacity * numberOfRooms} guests`,
      );
      return;
    }

    try {
      const booking = await dispatch(
        createBooking({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          numberOfRooms,
          guests,
        }),
      ).unwrap();
      await checkout(booking.id); // redirects to Paystack
    } catch (error) {
      setFormError(typeof error === "string" ? error : "Something went wrong");
    }
  };

  const handleCheckInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = event.target.value;
    const keepCheckOut = checkOut && newCheckIn && checkOut > newCheckIn;
    onDatesChange(newCheckIn, keepCheckOut ? checkOut : "");
  };

  const nightsLabel = `${nights} ${nights === 1 ? "night" : "nights"}`;

  return (
    <div className={styles.card} id="booking-form">
      <p className={styles.priceHeading}>
        {nights > 0 ? (
          <>
            <strong>{formatPrice(totalPrice)}</strong> for {nightsLabel}
          </>
        ) : (
          <>
            <strong>{formatPrice(pricePerNight)}</strong> night
          </>
        )}
      </p>

      {rooms.length === 0 ? (
        <p className={styles.note}>No rooms are open for booking yet.</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldBox}>
            <div className={styles.fieldPair}>
              <label className={styles.field}>
                <span>Check-in</span>
                <input
                  type="date"
                  min={todayKey}
                  value={checkIn}
                  onChange={handleCheckInChange}
                />
              </label>
              <label className={`${styles.field} ${styles.fieldRight}`}>
                <span>Checkout</span>
                <input
                  type="date"
                  min={checkIn || todayKey}
                  value={checkOut}
                  onChange={(event) =>
                    onDatesChange(checkIn, event.target.value)
                  }
                />
              </label>
            </div>

            <label className={`${styles.field} ${styles.fieldTop}`}>
              <span>Room</span>
              <select
                value={selectedRoom?.id}
                onChange={(event) => onRoomChange(Number(event.target.value))}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomType} · sleeps {room.capacity} ·{" "}
                    {formatPrice(room.pricePerNight)}
                  </option>
                ))}
              </select>
            </label>

            <div className={`${styles.fieldPair} ${styles.fieldTop}`}>
              <label className={styles.field}>
                <span>Rooms</span>
                <input
                  type="number"
                  min={1}
                  max={selectedRoom?.quantity}
                  value={numberOfRooms}
                  onChange={(event) =>
                    setNumberOfRooms(Math.max(1, Number(event.target.value)))
                  }
                />
              </label>
              <label className={`${styles.field} ${styles.fieldRight}`}>
                <span>Guests</span>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(event) =>
                    setGuests(Math.max(1, Number(event.target.value)))
                  }
                />
              </label>
            </div>
          </div>

          {formError && (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className={styles.reserveButton}
            disabled={isBusy}
          >
            {isBusy
              ? "Please wait…"
              : isAuthenticated
                ? "Reserve"
                : "Log in to reserve"}
          </button>

          <p className={styles.note}>
            <ShieldIcon size={14} /> You'll pay with Paystack on the next step
          </p>

          {nights > 0 && selectedRoom && (
            <div className={styles.summary}>
              <div>
                <span className={styles.underlined}>
                  {formatPrice(pricePerNight)} × {nightsLabel}
                  {numberOfRooms > 1 ? ` × ${numberOfRooms} rooms` : ""}
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.total}>
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
