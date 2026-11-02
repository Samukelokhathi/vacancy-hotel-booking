export function resolveImageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const base = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (!base) return normalized;
  return `${base}${normalized}`;
}
