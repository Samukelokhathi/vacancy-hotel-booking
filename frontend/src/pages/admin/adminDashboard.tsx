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
  facilities: string;
  policies: string;
  roomType: string;
  roomQuantity: string;
  roomCapacity: string;
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
};

async function uploadHotelImages(hotelId: number, files: File[]) {
  if (files.length === 0) return;

  const formData = new FormData();

  formData.append("hotelId", String(hotelId));

  files.forEach((file) => {
    formData.append("images", file);
  });

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
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const loadHotelImages = async (hotelId: number) => {
    try {
      const response = await api.get<HotelImage[]>("/hotel-images", {
        params: { hotelId },
      });

      setExistingImages(response.data);
    } catch (error) {
      console.error("Failed to load hotel images:", error);
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
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
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
      facilities: Array.isArray(hotel.facilities)
        ? hotel.facilities.join(", ")
        : "",
      policies: hotel.policies || "",
      roomType: "Standard Room",
      roomQuantity: "10",
      roomCapacity: "2",
    });

    setPendingFiles([]);
    setExistingImages([]);
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
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    if (!window.confirm("Delete this hotel?")) return;

    try {
      await api.delete(`/hotels/${id}`);
      await dispatch(fetchHotels()).unwrap();
    } catch (error) {
      console.error("Failed to delete hotel:", error);
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (pendingFiles.length + selectedFiles.length > 12) {
      setFormError("You can upload a maximum of 12 images.");
      return;
    }

    if (selectedFiles.some((file) => file.size > 8 * 1024 * 1024)) {
      setFormError("Each image must be smaller than 8MB.");
      return;
    }

    setFormError("");
    setPendingFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.delete(`/hotel-images/${imageId}`);

      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

      await dispatch(fetchHotels()).unwrap();
    } catch (error) {
      setFormError(getErrorMessage(error, "Failed to delete image."));
    }
  };

  const handleSetCover = async (imageId: number) => {
    try {
      await api.patch(`/hotel-images/${imageId}/cover`);

      setExistingImages((prev) =>
        prev.map((img) => ({
          ...img,
          isCover: img.id === imageId,
        })),
      );

      await dispatch(fetchHotels()).unwrap();
    } catch (error) {
      setFormError(getErrorMessage(error, "Failed to set cover image."));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setFormError("");

    // CHANGED for map: send null lat/long so backend geocodes from address + city
    // (Nominatim in hotelServices.createHotel / updateHotelById)
    const payload = {
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
        .map((item) => item.trim())
        .filter(Boolean),
      // ADDED: default policies so backend never gets an empty string
      policies: form.policies.trim() || "Check-in 14:00.",
    };

    if (
      !payload.name ||
      !payload.description ||
      !payload.address ||
      !payload.city
    ) {
      setFormError(
        "Please complete the hotel name, description, address and city.",
      );
      return;
    }

    if (
      !Number.isInteger(payload.starRating) ||
      payload.starRating < 1 ||
      payload.starRating > 5
    ) {
      setFormError("Please select a valid hotel rating.");
      return;
    }

    if (!Number.isFinite(payload.pricePerNight) || payload.pricePerNight <= 0) {
      setFormError("Please enter a valid price per night.");
      return;
    }

    if (!editingHotelId) {
      if (!form.roomType.trim()) {
        setFormError("Please enter the initial room type.");
        return;
      }

      if (
        !Number.isInteger(Number(form.roomQuantity)) ||
        Number(form.roomQuantity) <= 0
      ) {
        setFormError("Please enter a valid room quantity.");
        return;
      }

      if (
        !Number.isInteger(Number(form.roomCapacity)) ||
        Number(form.roomCapacity) <= 0
      ) {
        setFormError("Please enter a valid room capacity.");
        return;
      }
    }

    setIsSaving(true);

    try {
      if (editingHotelId) {
        await api.put(`/hotels/${editingHotelId}`, payload);

        await uploadHotelImages(editingHotelId, pendingFiles);

        await loadHotelImages(editingHotelId);

        setPendingFiles([]);

        setMessage("Hotel updated successfully.");
      } else {
        const hotelRes = await api.post("/hotels", payload);
        const hotelId = Number(hotelRes.data?.id);

        if (!hotelId || !Number.isFinite(hotelId)) {
          throw new Error("Hotel was created but no hotel ID was returned.");
        }

        await api.post("/rooms", {
          hotelId,
          roomType: form.roomType.trim(),
          capacity: Number(form.roomCapacity),
          pricePerNight: payload.pricePerNight,
          quantity: Number(form.roomQuantity),
        });

        await uploadHotelImages(hotelId, pendingFiles);

        setMessage("Hotel and images added successfully.");
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
