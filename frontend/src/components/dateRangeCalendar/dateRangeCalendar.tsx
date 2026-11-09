import { useState } from "react";
import {
  buildMonthGrid,
  formatMonthLabel,
  parseDateKey,
  toDateKey,
  todayDateKey,
} from "../../utils/dates";
import { ChevronLeft, ChevronRight } from "../icons/icons";
import styles from "./dateRangeCalendar.module.css";

interface DateRangeCalendarProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// Two-month calendar for picking check-in and checkout dates
export default function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
}: DateRangeCalendarProps) {
  const todayKey = todayDateKey();
  const startDate = parseDateKey(checkIn || todayKey);
  const [visibleMonth, setVisibleMonth] = useState({
    year: startDate.getFullYear(),
    monthIndex: startDate.getMonth(),
  });

  const todayDate = parseDateKey(todayKey);
  const isShowingCurrentMonth =
    visibleMonth.year === todayDate.getFullYear() &&
    visibleMonth.monthIndex === todayDate.getMonth();

  const shiftVisibleMonth = (monthOffset: number) =>
    setVisibleMonth((currentMonth) => {
      const shiftedDate = new Date(
        currentMonth.year,
        currentMonth.monthIndex + monthOffset,
        1,
      );
      return {
        year: shiftedDate.getFullYear(),
        monthIndex: shiftedDate.getMonth(),
      };
    });

  const selectDate = (dateKey: string) => {
    // first click (or a fresh start) sets check-in; second click sets checkout
    if (!checkIn || checkOut || dateKey <= checkIn) onChange(dateKey, "");
    else onChange(checkIn, dateKey);
  };

  const monthsToShow = [0, 1].map((monthOffset) => {
    const monthDate = new Date(
      visibleMonth.year,
      visibleMonth.monthIndex + monthOffset,
      1,
    );
    return { year: monthDate.getFullYear(), monthIndex: monthDate.getMonth() };
  });

  return (
    <div>
      <div className={styles.months}>
        {monthsToShow.map(({ year, monthIndex }, position) => (
          <div key={`${year}-${monthIndex}`} className={styles.month}>
            <div className={styles.monthHeader}>
              {position === 0 ? (
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => shiftVisibleMonth(-1)}
                  disabled={isShowingCurrentMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
              ) : (
                <span className={styles.navSpacer} />
              )}
              <h3>{formatMonthLabel(year, monthIndex)}</h3>
              <button
                type="button"
                className={`${styles.navButton} ${position === 0 ? styles.navButtonMobileOnly : ""}`}
                onClick={() => shiftVisibleMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className={styles.dayGrid} role="grid">
              {WEEKDAY_LETTERS.map((weekdayLetter, weekdayIndex) => (
                <span
                  key={weekdayIndex}
                  className={styles.weekday}
                  aria-hidden="true"
                >
                  {weekdayLetter}
                </span>
              ))}

              {buildMonthGrid(year, monthIndex).map((dayOfMonth, cellIndex) => {
                if (dayOfMonth === null) {
                  return <span key={`blank-${cellIndex}`} />;
                }
                const dateKey = toDateKey(year, monthIndex, dayOfMonth);
                const isPast = dateKey < todayKey;
                const isCheckIn = dateKey === checkIn;
                const isCheckOut = dateKey === checkOut;
                const isInRange =
                  !!checkIn &&
                  !!checkOut &&
                  dateKey > checkIn &&
                  dateKey < checkOut;
                const dayClassName = [
                  styles.day,
                  isPast && styles.pastDay,
                  isInRange && styles.inRange,
                  (isCheckIn || isCheckOut) && styles.selectedDay,
                  isCheckIn && checkOut && styles.rangeStart,
                  isCheckOut && styles.rangeEnd,
                  dateKey === todayKey && styles.today,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={dateKey}
                    type="button"
                    className={dayClassName}
                    disabled={isPast}
                    aria-pressed={isCheckIn || isCheckOut}
                    aria-label={parseDateKey(dateKey).toDateString()}
                    onClick={() => selectDate(dateKey)}
                  >
                    <span>{dayOfMonth}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange("", "")}
          disabled={!checkIn && !checkOut}
        >
          Clear dates
        </button>
      </div>
    </div>
  );
}
