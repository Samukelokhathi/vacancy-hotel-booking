import type { ReactNode } from "react";
import styles from "./facilitiesList.module.css";

// small line icons, all drawn inside a 24 x 24 box
const icons: Record<string, ReactNode> = {
  wifi: (
    <>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  pool: (
    <>
      <path d="M2 8c2-2 4 2 6 0s4 2 6 0 4 2 6 0" />
      <path d="M2 13c2-2 4 2 6 0s4 2 6 0 4 2 6 0" />
      <path d="M2 18c2-2 4 2 6 0s4 2 6 0 4 2 6 0" />
    </>
  ),
  breakfast: (
    <>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M17 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 3v2M12 3v2" />
    </>
  ),
  gym: <path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" />,
  restaurant: (
    <>
      <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10" />
      <path d="M17 21V3c-2.5 1.5-3 4-3 7v3h3" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
};

// picks an icon from the facility's name (the admin types the names)
const pickIcon = (name: string): ReactNode => {
  const text = name.toLowerCase();

  if (text.includes("wifi") || text.includes("wi-fi")) return icons.wifi;
  if (text.includes("park")) return icons.parking;
  if (text.includes("pool")) return icons.pool;
  if (text.includes("breakfast") || text.includes("coffee"))
    return icons.breakfast;
  if (text.includes("gym") || text.includes("fitness")) return icons.gym;
  if (text.includes("restaurant") || text.includes("dining"))
    return icons.restaurant;

  return icons.check;
};

export default function FacilitiesList({
  facilities,
}: {
  facilities: string[];
}) {
  if (facilities.length === 0) {
    return <p className={styles.empty}>No facilities listed.</p>;
  }

  return (
    <ul className={styles.grid}>
      {facilities.map((facility) => (
        <li key={facility} className={styles.item}>
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {pickIcon(facility)}
          </svg>
          {facility}
        </li>
      ))}
    </ul>
  );
}
