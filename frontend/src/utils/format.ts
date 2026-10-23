export const formatPrice = (amount: number): string =>
  `R${amount.toLocaleString("en-ZA")}`;

// number of nights between two "YYYY-MM-DD" dates (0 if invalid)
export const countNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const diff =
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
  return diff > 0 ? diff : 0;
};

export const todayString = (): string => new Date().toISOString().slice(0, 10);