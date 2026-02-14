export function parsePositiveInt(
  raw: string | number | undefined,
  fallback: number
): number {
  const parsed =
    typeof raw === "number" ? Math.trunc(raw) : Number.parseInt(raw ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseNonNegativeInt(
  raw: string | number | undefined,
  fallback: number
): number {
  const parsed =
    typeof raw === "number" ? Math.trunc(raw) : Number.parseInt(raw ?? "", 10);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
