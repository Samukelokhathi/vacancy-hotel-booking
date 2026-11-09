import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "../icons/icons";
import styles from "./hotelRow.module.css";

interface HotelRowProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  children: ReactNode;
}

// A titled, sideways-scrolling row of hotel cards with back/forward arrows
export default function HotelRow({
  title,
  subtitle,
  linkTo,
  children,
}: HotelRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateArrowState = useCallback(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;
    setCanScrollBack(trackElement.scrollLeft > 4);
    setCanScrollForward(
      trackElement.scrollLeft + trackElement.clientWidth <
        trackElement.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    updateArrowState();
    const trackElement = trackRef.current;
    if (!trackElement) return;
    const resizeObserver = new ResizeObserver(updateArrowState);
    resizeObserver.observe(trackElement);
    return () => resizeObserver.disconnect();
  }, [updateArrowState, children]);

  const scrollTrack = (direction: 1 | -1) => {
    const trackElement = trackRef.current;
    if (!trackElement) return;
    trackElement.scrollBy({
      left: direction * trackElement.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.row}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {linkTo ? (
              <Link to={linkTo}>
                {title}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            ) : (
              title
            )}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.arrows}>
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            disabled={!canScrollBack}
            aria-label={`Scroll ${title} back`}
          >
            <ChevronLeft size={12} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(1)}
            disabled={!canScrollForward}
            aria-label={`Scroll ${title} forward`}
          >
            <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef} onScroll={updateArrowState}>
        {children}
      </div>
    </section>
  );
}
