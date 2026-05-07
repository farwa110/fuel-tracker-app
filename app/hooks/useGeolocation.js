"use client";

import { useState, useCallback } from "react";

// Usage:
// const { lat, lng, error, status, requestLocation } = useGeolocation();
//
// status: "idle" | "pending" | "granted" | "denied" | "unsupported"

export function useGeolocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | pending | granted | denied | unsupported

  const requestLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setStatus("unsupported");
      setError("Your browser does not support geolocation.");
      return;
    }

    setStatus("pending");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // ── Success ──────────────────────────────────────────────────────────
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setStatus("granted");
      },
      // ── Error ─────────────────────────────────────────────────────────────
      (err) => {
        setStatus("denied");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Showing all stations sorted by price.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location unavailable. Showing all stations sorted by price.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("Could not get location.");
        }
      },
      // ── Options ───────────────────────────────────────────────────────────
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
    );
  }, []);

  return { lat, lng, error, status, requestLocation };
}
