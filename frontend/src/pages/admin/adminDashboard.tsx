import { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotels } from "../../store/hotelSlice";
import { api, getErrorMessage } from "../../api/axios";

import ReservationsTable from "../../components/admin/reservations/reservations";
import ManageHotels from "../../components/admin/manageHotels/manageHotels";
import AddHotelModal from "../../components/admin/addHotelModal/addHotelModal";

import type {
  BookingDetails,
  Hotel,
  HotelImage,
} from "../../models/hotel.types";
import styles from "./adminDashboard.module.css";

interface HotelFormState {
  name: string;
  description: string;
  address: string;
  city: string;
  starRating: string;
  pricePerNight: string;
  latitude: string;
  longitude: string;
  facilities: string;
  policies: string;
}

const initialForm: HotelFormState = {
  name: "",
  description: "",
  address: "",
  city: "",
  starRating: "4",
  pricePerNight: "",
  latitude: "",
  longitude: "",
  facilities: "WiFi, Parking, Pool",
  policies: "Check-in 14:00.",
};

async function uploadHotelImages(hotelId: number, files: File[]) {
  if (files.length === 0) return;
  const formData = new FormData();
  formData.append("hotelId", String(hotelId));
  files.forEach((file) => formData.append("images", file));
  await api.post("/hotel-images", formData);
}

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
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [existingImages, setExistingImages] = useState<HotelImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

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

  const loadHotelImages = async (hotelId: number) => {
    try {
      const response = await api.get<HotelImage[]>("/hotel-images", {
        params: { hotelId },
      });
      setExistingImages(response.data);
    } catch (error) {
      console.error("Failed to load hotel images", error);
      setExistingImages([]);
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
    setEditingHotelId(null);
    setForm(initialForm);
    setExistingImages([]);
    setPendingFiles([]);
    setFormError("");
    setMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (hotel: Hotel) => {
    setEditingHotelId(hotel.id);
    setForm({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address || "",
      city: hotel.city,
      starRating: String(hotel.starRating),
      pricePerNight: String(hotel.pricePerNight),
      latitude: hotel.latitude != null ? String(hotel.latitude) : "",
      longitude: hotel.longitude != null ? String(hotel.longitude) : "",
      facilities: Array.isArray(hotel.facilities)
        ? hotel.facilities.join(", ")
        : "",
      policies: hotel.policies || "",
    });
    setPendingFiles([]);
    setFormError("");
    setMessage("");
    setIsModalOpen(true);
    await loadHotelImages(hotel.id);
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

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPendingFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.delete(`/hotel-images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      await dispatch(fetchHotels());
    } catch (error) {
      console.error("Failed to delete hotel image", error);
      setFormError(getErrorMessage(error, "Failed to delete image."));
    }
  };

  const handleSetCover = async (imageId: number) => {
    try {
      await api.patch(`/hotel-images/${imageId}/cover`);
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, isCover: img.id === imageId })),
      );
      await dispatch(fetchHotels());
    } catch (error) {
      console.error("Failed to set cover image", error);
      setFormError(getErrorMessage(error, "Failed to set cover image."));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFormError("");
    setIsSaving(true);

    const latitude = form.latitude.trim() || null;
    const longitude = form.longitude.trim() || null;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      latitude,
      longitude,
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
        await api.put(`/hotels/${editingHotelId}`, payload);
        await uploadHotelImages(editingHotelId, pendingFiles);
        await loadHotelImages(editingHotelId);
        setPendingFiles([]);
        setMessage("Hotel updated successfully.");
      } else {
        const hotelRes = await api.post("/hotels", payload);
        const hotelId = hotelRes.data?.id;

        if (hotelId) {
          await api.post("/rooms", {
            hotelId: Number(hotelId),
            roomType: "Standard Room",
            capacity: 2,
            pricePerNight: Number(form.pricePerNight),
            quantity: 10,
          });

          await uploadHotelImages(Number(hotelId), pendingFiles);
        }
        setMessage("Hotel added successfully.");
      }

      await dispatch(fetchHotels()).unwrap();
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
        setPendingFiles([]);
        setExistingImages([]);
      }, 1000);
    } catch (error) {
      setFormError(getErrorMessage(error, "Error saving hotel data."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.topContainer}>
          <h1>Admin Dashboard</h1>
          <button className={styles.launchBtn} onClick={handleOpenAddModal}>
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
          isEditMode={!!editingHotelId}
          existingImages={existingImages}
          pendingFiles={pendingFiles}
          onChange={handleChange}
          onFilesSelected={handleFilesSelected}
          onRemovePendingFile={handleRemovePendingFile}
          onDeleteImage={handleDeleteImage}
          onSetCover={handleSetCover}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
