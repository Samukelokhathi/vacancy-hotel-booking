import type { ReactNode } from "react";

// small line icons, all drawn inside a 24 x 24 box
const facilityIcons: Record<string, ReactNode> = {
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
const pickFacilityIcon = (facilityName: string): ReactNode => {
  const lowerName = facilityName.toLowerCase();

  if (lowerName.includes("wifi") || lowerName.includes("wi-fi"))
    return facilityIcons.wifi;
  if (lowerName.includes("park")) return facilityIcons.parking;
  if (lowerName.includes("pool")) return facilityIcons.pool;
  if (lowerName.includes("breakfast") || lowerName.includes("coffee"))
    return facilityIcons.breakfast;
  if (lowerName.includes("gym") || lowerName.includes("fitness"))
    return facilityIcons.gym;
  if (lowerName.includes("restaurant") || lowerName.includes("dining"))
    return facilityIcons.restaurant;

  return facilityIcons.check;
};

interface FacilityIconProps {
  facilityName: string;
  size?: number;
}

// The line icon that matches a facility name, e.g. "Free WiFi" -> wifi icon
export default function FacilityIcon({
  facilityName,
  size = 24,
}: FacilityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {pickFacilityIcon(facilityName)}
    </svg>
  );
}
