// "use client";

// import { useEffect, useState } from "react";
// // import { useGeolocation } from "@/app/hooks/useGeolocation";

// const API_URL = "http://localhost:5000";

// export default function StationsPage() {
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { lat, lng, error, status, requestLocation } = useGeolocation();

//   async function fetchAllStations() {
//     setLoading(true);
//     const res = await fetch(`${API_URL}/prices`);
//     const data = await res.json();
//     setStations(data.stations || []);
//     setLoading(false);
//   }

//   async function fetchNearbyStations() {
//     if (!lat || !lng) return;

//     setLoading(true);
//     const res = await fetch(`${API_URL}/prices/nearby?lat=${lat}&lng=${lng}&radius=10`);
//     const data = await res.json();
//     setStations(data.stations || []);
//     setLoading(false);
//   }

//   useEffect(() => {
//     fetchAllStations();
//   }, []);

//   useEffect(() => {
//     if (status === "granted" && lat && lng) {
//       fetchNearbyStations();
//     }
//   }, [status, lat, lng]);

//   return (
//     <section>
//       <button onClick={requestLocation}>Find nearest stations</button>

//       {error && <p>{error}</p>}

//       {loading && <p>Loading stations...</p>}

//       <ul>
//         {stations.map((station) => (
//           <li key={station.stationId}>
//             <strong>{station.name}</strong>
//             <p>{station.address}</p>

//             {station.distanceKm != null && <p>{station.distanceKm} km away</p>}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

"use client";

import { useState, useCallback } from "react";

export function useGeolocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  const requestLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setStatus("unsupported");
      setError("Your browser does not support geolocation.");
      return;
    }

    setStatus("pending");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setStatus("granted");
      },
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
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
    );
  }, []);

  return { lat, lng, error, status, requestLocation };
}
