export type CityResult = {
  id: string;
  label: string;
};

type NominatimItem = {
  place_id?: number | string;
  category?: string;
  type?: string;
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
};

const CITY_TYPES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "municipality",
  "suburb",
  "neighbourhood",
]);

function isCityResult(item: NominatimItem): boolean {
  if (item.category === "place" && item.type && CITY_TYPES.has(item.type)) return true;
  if (item.category === "boundary" && item.type === "administrative") {
    const a = item.address ?? {};
    return Boolean(a.city || a.town || a.village || a.municipality);
  }
  return false;
}

function formatLabel(item: NominatimItem): string {
  const a = item.address ?? {};
  const city =
    a.city || a.town || a.village || a.municipality || a.hamlet || a.suburb || item.name;
  const state = a.state || a.region;
  const country = a.country;
  return [city, state, country].filter(Boolean).join(", ");
}

export async function searchCities(
  query: string,
  signal?: AbortSignal,
): Promise<CityResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(q)}` +
    `&format=jsonv2&limit=8&addressdetails=1&accept-language=en`;

  try {
    const res = await fetch(url, {
      signal,
      headers: {
        "User-Agent": "LuckyNumbersApp/0.1 (entertainment app)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    const raw = (await res.json()) as NominatimItem[];
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const results: CityResult[] = [];
    for (const item of raw) {
      if (!isCityResult(item)) continue;
      const label = formatLabel(item);
      if (!label || seen.has(label)) continue;
      seen.add(label);
      results.push({ id: String(item.place_id ?? results.length), label });
    }
    return results;
  } catch {
    return [];
  }
}
