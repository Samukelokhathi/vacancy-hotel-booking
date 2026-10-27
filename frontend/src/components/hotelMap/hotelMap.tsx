import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "./hotelMap.module.css";

// Leaflet's default pin image breaks with Vite, so it's set by hand
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
  latitude: number | null;
  longitude: number | null;
  name: string;
}

export default function HotelMap({ latitude, longitude, name }: HotelMapProps) {
  if (latitude === null || longitude === null) {
    return <p className={styles.empty}>Map location not available for this hotel.</p>;
  }

  const position: [number, number] = [Number(latitude), Number(longitude)];

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