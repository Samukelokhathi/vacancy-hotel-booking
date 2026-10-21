export default function StarRating({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} style={{ color: "#f59e0b" }}>
      {"★".repeat(value)}
      {"☆".repeat(5 - value)}
    </span>
  );
}
