// Small inline SVG icons shared across the site (no styles of their own)
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const createIcon = (iconPaths: ReactNode, filled = false) =>
  function Icon({ size = 16, ...svgProps }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...svgProps}
      >
        {iconPaths}
      </svg>
    );
  };

export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </>,
);

export const MenuIcon = createIcon(<path d="M4 7h16M4 12h16M4 17h16" />);

export const UserIcon = createIcon(
  <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c5.5 0 9 2.7 9 6v2H3v-2c0-3.3 3.5-6 9-6z" />,
  true,
);

export const ChevronLeft = createIcon(<path d="M15 18l-6-6 6-6" />);
export const ChevronRight = createIcon(<path d="M9 18l6-6-6-6" />);
export const ArrowRight = createIcon(<path d="M5 12h14M13 6l6 6-6 6" />);
export const CloseIcon = createIcon(<path d="M6 6l12 12M18 6L6 18" />);

export const StarIcon = createIcon(
  <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />,
  true,
);

export const HeartIcon = createIcon(
  <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.6 0 5.8 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />,
);

export const ShareIcon = createIcon(
  <>
    <path d="M12 3v12" />
    <path d="M7 8l5-5 5 5" />
    <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </>,
);

export const GridIcon = createIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>,
);

export const PinIcon = createIcon(
  <>
    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>,
);

export const BedIcon = createIcon(
  <>
    <path d="M3 18V7" />
    <path d="M21 18v-5a3 3 0 0 0-3-3h-7v8" />
    <path d="M3 14h18" />
    <circle cx="7" cy="11" r="1.6" />
    <path d="M3 18h18" />
  </>,
);

export const BuildingIcon = createIcon(
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
  </>,
);

export const AwardIcon = createIcon(
  <>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7" />
  </>,
);

export const ClockIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);

export const ShieldIcon = createIcon(
  <>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </>,
);

export const CalendarIcon = createIcon(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>,
);

export const GlobeIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
  </>,
);
