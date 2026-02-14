export type QueryValue = string | number | null | undefined;

export function buildQueryString(params: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const normalizedValue = String(value).trim();
    if (normalizedValue.length === 0) {
      return;
    }

    searchParams.set(key, normalizedValue);
  });

  return searchParams.toString();
}
