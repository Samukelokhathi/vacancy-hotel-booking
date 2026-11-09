import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "./hotelMap.module.css";

const hotelMarkerIcon = L.icon({
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

// Shows the hotel's saved coordinates (hotels.latitude / hotels.longitude)
export default function HotelMap({ latitude, longitude, name }: HotelMapProps) {
  const latitudeValue = latitude == null ? NaN : Number(latitude);
  const longitudeValue = longitude == null ? NaN : Number(longitude);

  if (!Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue)) {
    return (
      <p className={styles.unavailable}>
        Map location not available for this hotel.
      </p>
    );
  }

  const markerPosition: [number, number] = [latitudeValue, longitudeValue];

  return (
    <MapContainer
      center={markerPosition}
      zoom={14}
      scrollWheelZoom={false}
      className={styles.map}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={markerPosition} icon={hotelMarkerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
