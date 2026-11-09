import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHotelDetails } from "../../store/hotelSlice";
import { countNights, formatPrice, pluralise } from "../../utils/format";
import { formatDateKey } from "../../utils/dates";
import PhotoGallery from "../../components/photoGallery/photoGallery";
import DateRangeCalendar from "../../components/dateRangeCalendar/dateRangeCalendar";
import BookingForm from "../../components/bookingForm/bookingForm";
import FavoriteButton from "../../components/favoriteButton/favoriteButton";
import Modal from "../../components/modal/modal";
import HotelMap from "../../components/hotelMap/hotelMap";
import FacilityIcon from "../../components/facilityIcon/facilityIcon";
import {
  BedIcon,
  BuildingIcon,
  ChevronRight,
  PinIcon,
  ShareIcon,
  StarIcon,
} from "../../components/icons/icons";
import styles from "./hotelDetailsPage.module.css";

const FACILITY_PREVIEW_COUNT = 10;
const DESCRIPTION_CLAMP_LENGTH = 320;

type OpenModal = "description" | "facilities" | null;

export default function HotelDetailsPage() {
  const { id } = useParams();
  const hotelId = Number(id);
  const dispatch = useDispatch<AppDispatch>();
  const { selected, isLoading, error } = useSelector(
    (state: RootState) => state.hotels,
  );

  const [selectedRoomId, setSelectedRoomId] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const closeModal = useCallback(() => setOpenModal(null), []);

  useEffect(() => {
    dispatch(fetchHotelDetails(hotelId));
  }, [dispatch, hotelId]);

  const updateDates = (newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  };

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.messageBox}>
          <h1>We couldn't load this hotel</h1>
          <p>{error}</p>
          <Link to="/home" className={styles.outlineButton}>
            Back to all hotels
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !selected || selected.hotel.id !== hotelId) {
    return (
      <div className={styles.page} aria-busy="true">
        <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />
        <div className={`${styles.gallerySkeleton} ${styles.shimmer}`} />
      </div>
    );
  }

  const { hotel, images, rooms } = selected;
  const facilities = hotel.facilities ?? [];
  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const largestRoomCapacity = rooms.reduce(
    (largest, room) => Math.max(largest, room.capacity),
    0,
  );
  const nights = countNights(checkIn, checkOut);
  const pricePerNight = selectedRoom?.pricePerNight ?? hotel.pricePerNight;
  const listedSince = hotel.createdAt
    ? new Date(hotel.createdAt).toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      })
    : null;

  const hotelFacts = [
    rooms.length > 0 && pluralise(rooms.length, "room type"),
    largestRoomCapacity > 0 && `sleeps up to ${largestRoomCapacity} per room`,
    facilities.length > 0 &&
      pluralise(facilities.length, "facility", "facilities"),
  ].filter(Boolean);

  const shareHotel = async () => {
    const pageUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: hotel.name, url: pageUrl });
      } catch {
        // the share sheet was closed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard access was blocked
    }
  };

  return (
    <div className={styles.page}>
      {/* ---------- title ---------- */}
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{hotel.name}</h1>
        <div className={styles.titleActions}>
          <button
            type="button"
            className={styles.shareButton}
            onClick={shareHotel}
          >
            <ShareIcon size={16} />
            <span>{linkCopied ? "Link copied" : "Share"}</span>
          </button>
          <FavoriteButton
            hotelId={hotel.id}
            hotelName={hotel.name}
            variant="text"
          />
        </div>
      </div>

      <PhotoGallery
        images={images}
        fallbackCoverImage={hotel.coverImage}
        hotelName={hotel.name}
      />

      {/* ---------- body ---------- */}
      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <section className={styles.overview}>
            <h2 className={styles.subtitle}>
              Hotel in {hotel.city}, South Africa
            </h2>
            {hotelFacts.length > 0 && (
              <p className={styles.facts}>{hotelFacts.join(" · ")}</p>
            )}
            <p className={styles.rating}>
              <StarIcon size={14} />
              <strong>{hotel.starRating}-star hotel</strong>
            </p>
          </section>

          <section className={`${styles.section} ${styles.listing}`}>
            <span className={styles.listingIcon}>
              <BuildingIcon size={22} />
            </span>
            <div>
              <p className={styles.listingTitle}>Listed on Vacancy Hotels</p>
              {listedSince && (
                <p className={styles.mutedText}>Since {listedSince}</p>
              )}
            </div>
          </section>

          <section className={`${styles.section} ${styles.addressRow}`}>
            <span className={styles.addressIcon}>
              <PinIcon size={24} strokeWidth={1.6} />
            </span>
            <div>
              <p className={styles.listingTitle}>{hotel.city}</p>
              <p className={styles.mutedText}>{hotel.address}</p>
            </div>
          </section>

          {hotel.description && (
            <section className={styles.section}>
              <p className={styles.description}>{hotel.description}</p>
              {hotel.description.length > DESCRIPTION_CLAMP_LENGTH && (
                <button
                  type="button"
                  className={styles.showMoreButton}
                  onClick={() => setOpenModal("description")}
                >
                  Show more <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              )}
            </section>
          )}

          {rooms.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Where you'll sleep</h2>
              <div className={styles.roomGrid}>
                {rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      className={`${styles.roomCard} ${isSelected ? styles.roomCardSelected : ""}`}
                      onClick={() => setSelectedRoomId(room.id)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.roomIcon}>
                        <BedIcon size={26} strokeWidth={1.5} />
                      </span>
                      <span className={styles.roomType}>{room.roomType}</span>
                      <span className={styles.mutedText}>
                        Sleeps {room.capacity} ·{" "}
                        {pluralise(room.quantity, "room")}
                      </span>
                      <span className={styles.roomPrice}>
                        <strong>{formatPrice(room.pricePerNight)}</strong> night
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {facilities.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What this place offers</h2>
              <ul className={styles.facilityGrid}>
                {facilities.slice(0, FACILITY_PREVIEW_COUNT).map((facility) => (
                  <li key={facility}>
                    <FacilityIcon facilityName={facility} />
                    {facility}
                  </li>
                ))}
              </ul>
              {facilities.length > FACILITY_PREVIEW_COUNT && (
                <button
                  type="button"
                  className={styles.outlineButton}
                  onClick={() => setOpenModal("facilities")}
                >
                  Show all {facilities.length} facilities
                </button>
              )}
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {nights > 0
                ? `${pluralise(nights, "night")} in ${hotel.city}`
                : checkIn
                  ? "Select checkout date"
                  : "Select check-in date"}
            </h2>
            <p className={`${styles.mutedText} ${styles.calendarSubtitle}`}>
              {nights > 0
                ? `${formatDateKey(checkIn)} – ${formatDateKey(checkOut)}`
                : "Add your travel dates for exact pricing"}
            </p>
            <DateRangeCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={updateDates}
            />
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <div className={styles.stickyBookingForm}>
            <BookingForm
              rooms={rooms}
              hotelPricePerNight={hotel.pricePerNight}
              selectedRoomId={selectedRoom?.id ?? 0}
              onRoomChange={setSelectedRoomId}
              checkIn={checkIn}
              checkOut={checkOut}
              onDatesChange={updateDates}
            />
          </div>
        </aside>
      </div>

      {/* ---------- location ---------- */}
      <section className={styles.wideSection}>
        <h2 className={styles.sectionTitle}>Where you'll be</h2>
        <p className={styles.address}>
          {hotel.address}, {hotel.city}, South Africa
        </p>
        <HotelMap
          latitude={hotel.latitude}
          longitude={hotel.longitude}
          name={hotel.name}
        />
      </section>

      {/* ---------- policies ---------- */}
      {hotel.policies && (
        <section className={styles.wideSection}>
          <h2 className={styles.sectionTitle}>House rules</h2>
          <p className={styles.policies}>{hotel.policies}</p>
        </section>
      )}

      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/home">Vacancy Hotels</Link>
        <ChevronRight size={12} strokeWidth={2.5} />
        <Link to={`/home?city=${encodeURIComponent(hotel.city)}`}>
          {hotel.city}
        </Link>
        <ChevronRight size={12} strokeWidth={2.5} />
        <span>{hotel.name}</span>
      </nav>

      {/* ---------- phone booking bar ---------- */}
      <div className={styles.mobileBookingBar}>
        <p>
          <strong>
            {formatPrice(nights > 0 ? pricePerNight * nights : pricePerNight)}
          </strong>{" "}
          {nights > 0 ? `for ${pluralise(nights, "night")}` : "night"}
          {nights > 0 && (
            <small>
              {formatDateKey(checkIn)} – {formatDateKey(checkOut)}
            </small>
          )}
        </p>
        <a href="#booking-form" className={styles.mobileReserveLink}>
          {nights > 0 ? "Reserve" : "Check availability"}
        </a>
      </div>

      {openModal === "description" && (
        <Modal title="About this hotel" onClose={closeModal}>
          <p className={styles.modalText}>{hotel.description}</p>
        </Modal>
      )}
      {openModal === "facilities" && (
        <Modal title="What this place offers" onClose={closeModal}>
          <ul className={styles.facilityList}>
            {facilities.map((facility) => (
              <li key={facility}>
                <FacilityIcon facilityName={facility} />
                {facility}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}
