import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "./hotelMap.module.css";

const pin = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface HotelMapProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  name: string;
}

export default function HotelMap({ latitude, longitude, name }: HotelMapProps) {
  // DEBUG: Check what values are being passed to the map component
  console.log(
    "[HotelMap Debug] Received props -> latitude:",
    latitude,
    "longitude:",
    longitude,
    "hotel name:",
    name,
  );

  const lat = latitude == null ? NaN : Number(latitude);
  const lng = longitude == null ? NaN : Number(longitude);

  console.log(
    "[HotelMap Debug] Parsed numbers -> lat:",
    lat,
    "lng:",
    lng,
    "Is finite:",
    Number.isFinite(lat) && Number.isFinite(lng),
  );

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn(
      "[HotelMap Debug] Coordinates are invalid or null. Rendering fallback message.",
    );
    return (
      <p className={styles.empty}>Map location not available for this hotel.</p>
    );
  }

  const position: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      className={styles.map}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={pin}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
