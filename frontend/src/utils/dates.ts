// Local-date helpers working on "YYYY-MM-DD" strings (no time-zone drift).

const padToTwoDigits = (value: number) => String(value).padStart(2, "0");

// monthIndex is 0-based (January = 0), like JavaScript's Date
export const toDateKey = (
  year: number,
  monthIndex: number,
  dayOfMonth: number,
): string =>
  `${year}-${padToTwoDigits(monthIndex + 1)}-${padToTwoDigits(dayOfMonth)}`;

export const todayDateKey = (): string => {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
};

export const parseDateKey = (dateKey: string): Date => {
  const [year, month, dayOfMonth] = dateKey.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, dayOfMonth ?? 1);
};

// "2026-11-13" -> "13 Nov 2026"
export const formatDateKey = (dateKey: string): string =>
  dateKey
    ? parseDateKey(dateKey).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export const formatMonthLabel = (year: number, monthIndex: number): string =>
  new Date(year, monthIndex, 1).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });

// Day numbers for a month grid that starts on Sunday; null = empty cell
export const buildMonthGrid = (
  year: number,
  monthIndex: number,
): (number | null)[] => {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const gridCells: (number | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
    gridCells.push(dayOfMonth);
  }
  while (gridCells.length % 7 !== 0) gridCells.push(null);
  return gridCells;
};
