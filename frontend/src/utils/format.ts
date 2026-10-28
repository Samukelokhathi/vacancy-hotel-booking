export const formatPrice = (amount: number): string =>
  `R${amount.toLocaleString("en-ZA")}`;

// "2026-11-12" -> "12 Nov 2026" (UTC, so the day never shifts for other time zones)
export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// number of nights between two "YYYY-MM-DD" dates (0 if invalid)
export const countNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const diff =
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
  return diff > 0 ? diff : 0;
};

export const todayString = (): string => new Date().toISOString().slice(0, 10);
