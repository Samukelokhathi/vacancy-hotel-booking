import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { api } from "../../api/axios";
import type { BookingDetails, Hotel } from "../../models/hotel.types";

import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import MyBookings from "./myBookings/myBookins";
import SavedHotels from "./savedHotels/savedHotels";
import Notifications from "./notifications/notification";

import styles from "./profilePage.module.css";

type TabType = "bookings" | "favorites" | "notifications";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.login);

  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [cellphone, setCellphone] = useState(
    user?.cellphone ? String(user.cellphone) : "",
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [favorites, setFavorites] = useState<Hotel[]>([]);

  // Removed setNotifications here to resolve the unused variable warning
  const [notifications] = useState<string[]>([
    "Your booking at Azure Bay Resort has been confirmed.",
    "Special Promotion: Get 15% off bookings in Cape Town this weekend!",
  ]);

  useEffect(() => {
    if (user?.id) {
      fetchUserBookings();
      fetchUserFavorites();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const response = await api.get("/bookings/my");
      setBookings(response.data);
    } catch (err) {
      console.error("Error loading user bookings ledger:", err);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data);
    } catch (err) {
      console.error("Error loading favorites registry:", err);
    }
  };

  const handleUpdateInformation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage("");
    setSaveError("");
    try {
      await api.put(`/auth/users/${user?.id}`, {
        email: user?.email,
        role: user?.role,
        name: name.trim(),
        surname: surname.trim(),
        cellphone: Number(cellphone) || 0,
      });
      setSaveMessage("Personal information saved successfully.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveError("Failed to update personal credentials.");
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking stay reservation?",
      )
    )
      return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "cancelled" as const } : b,
        ),
      );
    } catch (err) {
      console.error("Cancellation pipeline failure:", err);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.gridContainer}>
        <aside className={styles.leftCardPanel}>
          <div className={styles.avatarRow}>
            <div className={styles.avatarBadge}>
              {name.charAt(0).toUpperCase() || "U"}
              {surname.charAt(0).toUpperCase() || ""}
            </div>
            <div className={styles.avatarMeta}>
              <h2>
                {name} {surname}
              </h2>
              <p>{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateInformation} className={styles.infoForm}>
            <h3>Personal information</h3>

            <Input
              label="FIRST NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="SURNAME"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <Input
              label="PHONE"
              type="tel"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              placeholder="+27 82 555 0142"
              required
            />

            {saveMessage && <p className={styles.successText}>{saveMessage}</p>}
            {saveError && <p className={styles.errorText}>{saveError}</p>}

            <Button type="submit" variant="primary" className={styles.saveBtn}>
              Save
            </Button>
          </form>
        </aside>

        <section className={styles.rightContentArea}>
          <nav className={styles.tabNavigationRow}>
            <button
              className={`${styles.tabBtn} ${activeTab === "bookings" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              My Bookings
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "favorites" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Saved Hotels
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "notifications" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
          </nav>

          <div className={styles.tabPanelBody}>
            {activeTab === "bookings" && (
              <MyBookings
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
              />
            )}

            {activeTab === "favorites" && <SavedHotels favorites={favorites} />}

            {activeTab === "notifications" && (
              <Notifications notifications={notifications} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
