import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { api } from "../../api/axios";
import { getLoggedInUser } from "../../store/loginSlice";

import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import BookingList from "../../components/bookingList/bookingList";
import SavedHotels from "./savedHotels/savedHotels";
import Notifications from "./notifications/notifications";
import { ShieldIcon } from "../../components/icons/icons";

import styles from "./profilePage.module.css";

type ProfileTab = "bookings" | "favorites" | "notifications";

const PROFILE_TABS: [ProfileTab, string][] = [
  ["bookings", "Bookings"],
  ["favorites", "Favourites"],
  ["notifications", "Notifications"],
];

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.login);

  const [activeTab, setActiveTab] = useState<ProfileTab>("bookings");
  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [cellphone, setCellphone] = useState(
    user?.cellphone ? String(user.cellphone) : "",
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // PUT /auth/users/:id, then reload the user so the navbar shows the new name
  const handleUpdateInformation = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveMessage("");
    setSaveError("");
    setIsSaving(true);
    try {
      await api.put(`/auth/users/${user?.id}`, {
        email: user?.email,
        role: user?.role,
        name: name.trim(),
        surname: surname.trim(),
        cellphone: Number(cellphone) || 0,
      });
      dispatch(getLoggedInUser());
      setSaveMessage("Your details have been saved.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveError("We couldn't save your details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase() || "U";
  const memberSince = user?.createdat
    ? new Date(user.createdat).toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Profile</h1>

      <div className={styles.columns}>
        <aside className={styles.sideColumn}>
          <div className={styles.identityCard}>
            <div className={styles.avatar}>{initials}</div>
            <h2 className={styles.fullName}>
              {name} {surname}
            </h2>
            <p className={styles.role}>
              {user?.role === "admin" ? "Admin" : "Guest"}
            </p>
            {memberSince && (
              <p className={styles.memberSince}>Member since {memberSince}</p>
            )}
          </div>

          <div className={styles.emailCard}>
            <h3>
              <ShieldIcon size={18} strokeWidth={1.8} /> Email address
            </h3>
            <p>{user?.email}</p>
          </div>

          <form
            onSubmit={handleUpdateInformation}
            className={styles.detailsForm}
          >
            <h3>Personal information</h3>

            <Input
              id="profile-name"
              label="First name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              id="profile-surname"
              label="Surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
              required
            />
            <Input
              id="profile-phone"
              label="Phone"
              type="tel"
              value={cellphone}
              onChange={(event) => setCellphone(event.target.value)}
              required
            />

            {saveMessage && (
              <p className={styles.successMessage} role="status">
                {saveMessage}
              </p>
            )}
            {saveError && (
              <p className={styles.errorMessage} role="alert">
                {saveError}
              </p>
            )}

            <Button type="submit" variant="secondary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </form>
        </aside>

        <section className={styles.mainColumn}>
          <nav className={styles.tabs} role="tablist">
            {PROFILE_TABS.map(([tabKey, tabLabel]) => (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={activeTab === tabKey}
                className={activeTab === tabKey ? styles.activeTab : ""}
                onClick={() => setActiveTab(tabKey)}
              >
                {tabLabel}
              </button>
            ))}
          </nav>

          {activeTab === "bookings" && <BookingList />}
          {activeTab === "favorites" && <SavedHotels />}
          {activeTab === "notifications" && <Notifications />}
        </section>
      </div>
    </div>
  );
}
