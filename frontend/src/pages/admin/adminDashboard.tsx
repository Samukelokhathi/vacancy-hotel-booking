// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import { api, getErrorMessage } from "../../api/axios";

import Navbar from "../../components/";
import Footer from "../../components/admin/Footer";
import ReservationsTable from "../../components/admin/ReservationsTable";
import ManageHotels from "../../components/admin/ManageHotels";
import AddHotelModal from "../../components/admin/AddHotelModal";

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
  const { user, isAuthenticated, authChecked } = useSelector((state: RootState) => state.login);
  const { items: hotelsList } = useSelector((state: RootState) => state.hotels) || { items: [] };

  const [reservations, setReservations] = useState<BookingDetails[]>([]);
  const [form, setForm] = useState<HotelFormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    return <div className={styles.loading}><p>Loading...</p></div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleUpdateStatus = async (id: number, status: "approved" | "cancelled") => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setReservations(prev => prev.map(res => (res.id === id ? { ...res, status } : res)));
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFormError("");
    setIsSaving(true);

    try {
      const hotelRes = await api.post("/hotels", {
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        latitude: null,
        longitude: null,
        starRating: Number(form.starRating),
        pricePerNight: Number(form.pricePerNight),
        facilities: form.facilities.split(",").map(f => f.trim()).filter(Boolean),
        policies: form.policies.trim(),
      });

      const hotelId = hotelRes.data?.id;

      if (hotelId) {
        await api.post("/rooms", {
          hotelId: Number(hotelId),
          roomType: form.roomType.trim(),
          capacity: Number(form.roomCapacity),
          pricePerNight: Number(form.pricePerNight),
          quantity: Number(form.roomQuantity),
        });

        if (form.imageUrl.trim()) {
          await api.post("/hotel-images", {
            hotelId: Number(hotelId),
            url: form.imageUrl.trim(),
          });
        }
      }

      await dispatch(fetchHotels()).unwrap();
      setForm(initialForm);
      setMessage("Hotel added successfully.");
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
      }, 1000);
    } catch (error) {
      setFormError(getErrorMessage(error, "Error adding hotel."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <h1>Admin Dashboard</h1>
        </div>

        <ReservationsTable 
          reservations={reservations} 
          onUpdateStatus={handleUpdateStatus} 
        />

        <div className={styles.bottomGrid}>
          <section className={styles.addTriggerSection}>
            <div className={styles.addCardInner}>
              <h2>Add Hotel</h2>
              <p>Create a new listing</p>
              <button className={styles.launchBtn} onClick={() => setIsModalOpen(true)}>
                + Add Hotel
              </button>
            </div>
          </section>

          <ManageHotels 
            hotelsList={hotelsList as Hotel[]} 
            onDeleteHotel={handleDeleteHotel} 
          />
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <AddHotelModal
          form={form}
          isSaving={isSaving}
          message={message}
          formError={formError}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
