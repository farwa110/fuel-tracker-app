"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStations, getCheapest, getAverage, filterStations, sortByPrice } from "../lib/api";
import { useGeolocation } from "../hooks/useGeolocation";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371,
    d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r;
  const dLng = (lng2 - lng1) * d2r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Circle K returns "Street, PostalCode, City"
// Q8 returns "Street City PostalCode Danmark"
// This extracts city from both formats
function extractCity(station) {
  if (station.city && station.city !== "Danmark") return station.city;

  const addr = station.address || "";
  if (!addr) return "Ukendt";

  // Circle K format: "Hasseris Bymidte 2, 9000, Aalborg"
  if (addr.includes(",")) {
    const parts = addr.split(",").map((s) => s.trim());
    // Last part is usually the city
    const last = parts[parts.length - 1];
    if (last && !/^\d+$/.test(last) && last !== "Danmark") return last;
  }

  // Q8 format: find word before 4-digit postal code
  const parts = addr.split(" ");
  const postalIndex = parts.findIndex((p) => /^\d{4}$/.test(p));
  if (postalIndex > 0) return parts[postalIndex - 1];

  return "Ukendt";
}

export function useFuelData() {
  const [fuel, setFuel] = useState("benzin95");
  const [query, setQuery] = useState("");
  const geo = useGeolocation();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchAllStations,
  });

  const allStations = data?.stations ?? [];
  const updatedAt = data?.updatedAt ?? null;
  const hasLocation = geo.status === "granted" && geo.lat && geo.lng;

  // ── Filtered + sorted display list ───────────────────────────────────────
  const displayStations = (() => {
    let list = allStations.filter((s) => s.prices?.[fuel]?.price > 0);
    list = filterStations(list, query);

    // if (hasLocation) {
    //   list = list
    //     .map((s) => ({
    //       ...s,
    //       distanceKm: s.lat && s.lng ? haversine(geo.lat, geo.lng, s.lat, s.lng) : 9999,
    //     }))
    //     .sort((a, b) => a.distanceKm - b.distanceKm);
    // } else {
    //   list = sortByPrice(list, fuel);
    // }
    if (hasLocation) {
      list = list
        .map((s) => {
          const stationLat = Number(s.lat ?? s.latitude);
          const stationLng = Number(s.lng ?? s.lon ?? s.longitude);

          if (Number.isNaN(stationLat) || Number.isNaN(stationLng)) {
            return null;
          }

          return {
            ...s,
            distanceKm: haversine(Number(geo.lat), Number(geo.lng), stationLat, stationLng),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      list = sortByPrice(list, fuel);
    }
    return list.slice(0, 40);
  })();

  // ── Hero card ─────────────────────────────────────────────────────────────
  const hero = (() => {
    if (!allStations.length) return null;
    const source = displayStations.length ? displayStations : allStations;
    const cheapest = getCheapest(source, fuel);
    if (!cheapest) return null;
    return {
      price: cheapest.prices[fuel]?.price,
      fuelLabel: cheapest.prices[fuel]?.label ?? fuel,
      stationName: cheapest.name,
      address: cheapest.address,
      distanceKm: cheapest.distanceKm ?? null,
    };
  })();

  // ── Metrics row ───────────────────────────────────────────────────────────
  const metrics = !allStations.length
    ? null
    : {
        benzin: { value: getAverage(allStations, "benzin95"), delta: null },
        diesel: { value: getAverage(allStations, "diesel"), delta: null },
        el: { value: getAverage(allStations, "el"), delta: null },
      };

  // ── Cities summary (for Cities tab) ──────────────────────────────────────
  const citiesSummary = (() => {
    if (!allStations.length) return [];

    const map = {};
    for (const s of allStations) {
      const city = extractCity(s);
      if (!map[city]) map[city] = { name: city, stations: [] };
      map[city].stations.push(s);
    }

    return Object.values(map)
      .map((c) => ({
        name: c.name,
        count: c.stations.length,
        benzin95: getAverage(c.stations, "benzin95"),
        diesel: getAverage(c.stations, "diesel"),
      }))
      .filter((c) => c.benzin95 != null && c.name !== "Ukendt")
      .sort((a, b) => a.benzin95 - b.benzin95)
      .slice(0, 20); // top 20 cities
  })();

  return {
    stations: displayStations,
    allStations,
    metrics,
    hero,
    citiesSummary,
    updatedAt,
    loading: isLoading,
    isFetching,
    isError,
    error: error?.message ?? null,
    fuel,
    setFuel,
    query,
    setQuery,
    geo,
    hasLocation,
  };
}
