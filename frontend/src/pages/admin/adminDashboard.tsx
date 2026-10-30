// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import { api, getErrorMessage } from "../../api/axios";

import ReservationsTable from "../../components/admin/reservations/reservations";
import ManageHotels from "../../components/admin/manageHotels/manageHotels";
import AddHotelModal from "../../components/admin/addHotelModal/addHotelModal";

import type { BookingDetails, Hotel } from "../../models/hotel.types";
import styles from "./adminDashboard.module.css";

interface HotelFormState {
  name: string;
  description: string;
  address: string;
  city: string;
  starRating: string;
  pricePerNight: string;
  facilities: string;
  policies: string;
  roomType: string;
  roomQuantity: string;
  roomCapacity: string;
  imageUrl: string;
}

const initialForm: HotelFormState = {
  name: "",
  description: "",
  address: "",
  city: "",
  starRating: "4",
  pricePerNight: "",
  facilities: "WiFi, Parking, Pool",
  policies: "Check-in 14:00.",
  roomType: "Standard Room",
  roomQuantity: "10",
  roomCapacity: "2",
  imageUrl: "",
};

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.login,
  );
  const { hotels: hotelsList } = useSelector(
    (state: RootState) => state.hotels,
  ) || { hotels: [] };

  const [reservations, setReservations] = useState<BookingDetails[]>([]);
  const [form, setForm] = useState<HotelFormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null); // ADDED: Tracking editing status

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      dispatch(fetchHotels());
      fetchBookings();
    }
  }, [dispatch, isAuthenticated, user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setReservations(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!authChecked) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleOpenAddModal = () => {
    // ADDED: Reset form tracking variables for creation
    setEditingHotelId(null);
    setForm(initialForm);
    setFormError("");
    setMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hotel: Hotel) => {
    // ADDED: Map current data to form for modifying listings
    setEditingHotelId(hotel.id);
    setForm({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address || "",
      city: hotel.city,
      starRating: String(hotel.starRating),
      pricePerNight: String(hotel.pricePerNight),
      facilities: Array.isArray(hotel.facilities)
        ? hotel.facilities.join(", ")
        : "",
      policies: hotel.policies || "",
      roomType: "Standard Room",
      roomQuantity: "10",
      roomCapacity: "2",
      imageUrl: hotel.coverImage || "",
    });
    setFormError("");
    setMessage("");
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (
    id: number,
    status: "approved" | "cancelled",
  ) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status } : res)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await api.delete(`/hotels/${id}`);
      dispatch(fetchHotels());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    validImages?: string[],
  ) => {
    // CHANGED: Added dynamic multiple image upload parameters mapping arrays
    event.preventDefault();
    setMessage("");
    setFormError("");
    setIsSaving(true);

    const payload = {
      // ADDED: Consolidated payload tracking variable parameters
      name: form.name.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      latitude: null,
      longitude: null,
      starRating: Number(form.starRating),
      pricePerNight: Number(form.pricePerNight),
      facilities: form.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      policies: form.policies.trim(),
    };

    try {
      if (editingHotelId) {
        // ADDED: Split update vs write request pipelines logic tracking metrics
        await api.put(`/hotels/${editingHotelId}`, payload);

        if (validImages && validImages.length > 0) {
          // ADDED: Loop and save multiple photos references
          await Promise.all(
            validImages.map((url) =>
              api.post("/hotel-images", { hotelId: editingHotelId, url }),
            ),
          );
        }
        setMessage("Hotel updated successfully.");
      } else {
        const hotelRes = await api.post("/hotels", payload);
        const hotelId = hotelRes.data?.id;

        if (hotelId) {
          await api.post("/rooms", {
            hotelId: Number(hotelId),
            roomType: form.roomType.trim(),
            capacity: Number(form.roomCapacity),
            pricePerNight: Number(form.pricePerNight),
            quantity: Number(form.roomQuantity),
          });

          if (validImages && validImages.length > 0) {
            // CHANGED: Handle sequential iterative mapping loop creations natively from inputs file array
            await Promise.all(
              validImages.map((url) =>
                api.post("/hotel-images", { hotelId: Number(hotelId), url }),
              ),
            );
          }
        }
        setMessage("Hotel added successfully.");
      }

      await dispatch(fetchHotels()).unwrap();
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
      }, 1000);
    } catch (error) {
      setFormError(getErrorMessage(error, "Error saving hotel data.")); // CHANGED: Standard fallback message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.topContainer}>
          <h1>Admin Dashboard</h1>
          <button
            className={styles.launchBtn}
            onClick={handleOpenAddModal} // CHANGED: Use specific open target lifecycle routine trigger
          >
            Add hotel
          </button>
        </div>

        <div className={styles.dashboardSplitGrid}>
          <div className={styles.gridLeft}>
            <ReservationsTable
              reservations={reservations}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          <div className={styles.gridRight}>
            <ManageHotels
              hotelsList={hotelsList as Hotel[]}
              onEditHotel={handleOpenEditModal}
              onDeleteHotel={handleDeleteHotel}
            />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <AddHotelModal
          form={form}
          isSaving={isSaving}
          message={message}
          formError={formError}
          isEditMode={!!editingHotelId} // ADDED: Explicit variable type condition lookup
          onChange={handleChange}
          onSubmit={handleSubmit} // CHANGED: Connected handle submit matching parameters vector rules
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
