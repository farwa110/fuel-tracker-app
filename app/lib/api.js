// ── Your Render proxy URL ─────────────────────────────────────────────────────
export const PROXY_URL = "https://fuel-price-proxy.onrender.com";

// ── Fetch all 654 stations ────────────────────────────────────────────────────
export async function fetchAllStations() {
  const res = await fetch(`${PROXY_URL}/prices`);
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
  const json = await res.json();

  // Deduplicate by stationId — Q8 API sometimes returns duplicate IDs
  const seen = new Set();
  const stations = (json.stations ?? []).filter((s) => {
    if (seen.has(s.stationId)) return false;
    seen.add(s.stationId);
    return true;
  });

  return {
    stations,
    updatedAt: json.updatedAt ?? null,
    cached: json.cached ?? false,
  };
}

// ── Get cheapest station for a fuel type ──────────────────────────────────────
export function getCheapest(stations, fuelKey) {
  const list = stations.filter((s) => s.prices?.[fuelKey]?.price > 0);
  if (!list.length) return null;
  return list.reduce((a, b) => (a.prices[fuelKey].price < b.prices[fuelKey].price ? a : b));
}

// ── Get average price for a fuel type ────────────────────────────────────────
export function getAverage(stations, fuelKey) {
  const prices = stations.map((s) => s.prices?.[fuelKey]?.price).filter((p) => p > 0);
  if (!prices.length) return null;
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}

// ── Filter by search query ────────────────────────────────────────────────────
export function filterStations(stations, query) {
  if (!query?.trim()) return stations;
  const q = query.toLowerCase();
  return stations.filter((s) => s.name?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.brand?.toLowerCase().includes(q));
}

// ── Sort by price for a fuel type ─────────────────────────────────────────────
export function sortByPrice(stations, fuelKey) {
  return [...stations].sort((a, b) => (a.prices?.[fuelKey]?.price ?? 999) - (b.prices?.[fuelKey]?.price ?? 999));
}
