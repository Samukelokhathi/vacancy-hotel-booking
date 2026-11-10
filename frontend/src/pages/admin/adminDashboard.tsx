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
  User,
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

interface ExtraRoomState {
  roomType: string;
  roomQuantity: string;
  roomCapacity: string;
  pricePerNight: string;
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

const emptyExtraRoom: ExtraRoomState = {
  roomType: "",
  roomQuantity: "5",
  roomCapacity: "2",
  pricePerNight: "",
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
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<HotelFormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [existingImages, setExistingImages] = useState<HotelImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [extraRooms, setExtraRooms] = useState<ExtraRoomState[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      dispatch(fetchHotels());
      api
        .get<BookingDetails[]>("/bookings")
        .then((response) => setReservations(response.data))
        .catch((error) => console.error("Failed to fetch bookings:", error));
      api
        .get<User[]>("/auth/users")
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Failed to fetch users:", error));
    }
  }, [dispatch, isAuthenticated, user]);

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
    setExtraRooms([]);
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
    setExtraRooms([]);
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
      setReservations((previousReservations) =>
        previousReservations.map((reservation) =>
          reservation.id === id ? { ...reservation, status } : reservation,
        ),
      );
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm("Delete this reservation permanently?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setReservations((previousReservations) =>
        previousReservations.filter((reservation) => reservation.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert(getErrorMessage(error, "Could not delete reservation."));
    }
  };

  const handleMakeAdmin = async (targetUser: User) => {
    if (targetUser.role === "admin") return;
    if (
      !window.confirm(`Make ${targetUser.name} ${targetUser.surname} an admin?`)
    ) {
      return;
    }
    try {
      await api.put(`/auth/users/${targetUser.id}`, {
        name: targetUser.name,
        surname: targetUser.surname,
        email: targetUser.email,
        cellphone: targetUser.cellphone,
        role: "admin",
      });
      setUsers((previousUsers) =>
        previousUsers.map((listedUser) =>
          listedUser.id === targetUser.id
            ? { ...listedUser, role: "admin" as const }
            : listedUser,
        ),
      );
    } catch (error) {
      alert(getErrorMessage(error, "Could not update user role."));
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert("You cannot delete your own account from here.");
      return;
    }
    if (
      !window.confirm(
        `Delete user ${targetUser.name} ${targetUser.surname} (${targetUser.email})?`,
      )
    ) {
      return;
    }
    try {
      await api.delete(`/auth/users/${targetUser.id}`);
      setUsers((previousUsers) =>
        previousUsers.filter((listedUser) => listedUser.id !== targetUser.id),
      );
    } catch (error) {
      alert(getErrorMessage(error, "Could not delete user."));
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
    setPendingFiles((previousFiles) => [...previousFiles, ...selectedFiles]);
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((currentFiles) =>
      currentFiles.filter((_file, fileIndex) => fileIndex !== index),
    );
  };

  const handleAddExtraRoom = () => {
    setExtraRooms((previousRooms) => [...previousRooms, { ...emptyExtraRoom }]);
  };

  const handleChangeExtraRoom = (
    index: number,
    field: keyof ExtraRoomState,
    value: string,
  ) => {
    setExtraRooms((previousRooms) =>
      previousRooms.map((extraRoom, roomIndex) =>
        roomIndex === index ? { ...extraRoom, [field]: value } : extraRoom,
      ),
    );
  };

  const handleRemoveExtraRoom = (index: number) => {
    setExtraRooms((previousRooms) =>
      previousRooms.filter((_extraRoom, roomIndex) => roomIndex !== index),
    );
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.delete(`/hotel-images/${imageId}`);
      setExistingImages((previousImages) =>
        previousImages.filter((image) => image.id !== imageId),
      );
      await dispatch(fetchHotels()).unwrap();
    } catch (error) {
      setFormError(getErrorMessage(error, "Failed to delete image."));
    }
  };

  const handleSetCover = async (imageId: number) => {
    try {
      await api.patch(`/hotel-images/${imageId}/cover`);
      setExistingImages((previousImages) =>
        previousImages.map((image) => ({
          ...image,
          isCover: image.id === imageId,
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
        .map((facility) => facility.trim())
        .filter(Boolean),
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

    for (const extraRoom of extraRooms) {
      const quantity = Number(extraRoom.roomQuantity);
      const capacity = Number(extraRoom.roomCapacity);
      const roomPrice =
        extraRoom.pricePerNight.trim() === ""
          ? payload.pricePerNight
          : Number(extraRoom.pricePerNight);
      if (
        !extraRoom.roomType.trim() ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !Number.isInteger(capacity) ||
        capacity <= 0 ||
        !Number.isFinite(roomPrice) ||
        roomPrice <= 0
      ) {
        setFormError(
          "Please complete every extra room type (name, rooms, guests, price).",
        );
        return;
      }
    }

    const createExtraRooms = async (hotelId: number) => {
      for (const extraRoom of extraRooms) {
        await api.post("/rooms", {
          hotelId,
          roomType: extraRoom.roomType.trim(),
          capacity: Number(extraRoom.roomCapacity),
          pricePerNight:
            extraRoom.pricePerNight.trim() === ""
              ? payload.pricePerNight
              : Number(extraRoom.pricePerNight),
          quantity: Number(extraRoom.roomQuantity),
        });
      }
    };

    setIsSaving(true);

    try {
      if (editingHotelId) {
        await api.put(`/hotels/${editingHotelId}`, payload);
        await createExtraRooms(editingHotelId);
        await uploadHotelImages(editingHotelId, pendingFiles);
        await loadHotelImages(editingHotelId);
        setPendingFiles([]);
        setExtraRooms([]);
        setMessage("Hotel updated successfully.");
      } else {
        const hotelResponse = await api.post("/hotels", payload);
        const hotelId = Number(hotelResponse.data?.id);

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

        await createExtraRooms(hotelId);
        await uploadHotelImages(hotelId, pendingFiles);
        setMessage("Hotel and images added successfully.");
      }

      await dispatch(fetchHotels()).unwrap();

      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
        setPendingFiles([]);
        setExtraRooms([]);
        setExistingImages([]);
      }, 1000);
    } catch (error) {
      setFormError(getErrorMessage(error, "Error saving hotel data."));
    } finally {
      setIsSaving(false);
    }
  };

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "pending",
  ).length;
  const awaitingCount = reservations.filter(
    (reservation) => reservation.status === "pending" && reservation.paid,
  ).length;
  const confirmedCount = reservations.filter(
    (reservation) => reservation.status === "approved",
  ).length;

  const stats = [
    { label: "Hotels listed", value: hotelsList.length },
    { label: "Pending reservations", value: pendingCount },
    { label: "Paid, awaiting approval", value: awaitingCount },
    { label: "Confirmed stays", value: confirmedCount },
    { label: "Users", value: users.length },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.topContainer}>
          <div>
            <h1>Admin dashboard</h1>
            <p className={styles.welcome}>Welcome back, {user?.name}.</p>
          </div>

          <button className={styles.launchBtn} onClick={handleOpenAddModal}>
            <span aria-hidden="true">+</span> Add hotel
          </button>
        </div>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className={styles.dashboardSplitGrid}>
          <div className={styles.gridLeft}>
            <ReservationsTable
              reservations={reservations}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBooking={handleDeleteBooking}
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

        <section className={styles.usersPanel}>
          <div className={styles.usersHeader}>
            <h2>Users</h2>
            <p className={styles.usersMeta}>{users.length} accounts</p>
          </div>

          {users.length === 0 ? (
            <p className={styles.emptyUsers}>No users found.</p>
          ) : (
            <ul className={styles.usersList}>
              {users.map((listedUser) => (
                <li key={listedUser.id} className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>
                      {listedUser.name} {listedUser.surname}
                      {listedUser.id === user?.id && (
                        <span className={styles.youBadge}>You</span>
                      )}
                    </p>
                    <p className={styles.userEmail}>{listedUser.email}</p>
                    <p className={styles.userRole}>{listedUser.role}</p>
                  </div>
                  <div className={styles.userActions}>
                    {listedUser.role !== "admin" && (
                      <button
                        type="button"
                        className={styles.makeAdminBtn}
                        onClick={() => handleMakeAdmin(listedUser)}
                      >
                        Make admin
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.deleteUserBtn}
                      disabled={listedUser.id === user?.id}
                      onClick={() => handleDeleteUser(listedUser)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {isModalOpen && (
        <AddHotelModal
          form={form}
          isSaving={isSaving}
          message={message}
          formError={formError}
          isEditMode={!!editingHotelId}
          existingImages={existingImages}
          pendingFiles={pendingFiles}
          extraRooms={extraRooms}
          onChange={handleChange}
          onFilesSelected={handleFilesSelected}
          onRemovePendingFile={handleRemovePendingFile}
          onAddExtraRoom={handleAddExtraRoom}
          onChangeExtraRoom={handleChangeExtraRoom}
          onRemoveExtraRoom={handleRemoveExtraRoom}
          onDeleteImage={handleDeleteImage}
          onSetCover={handleSetCover}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
