"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/app/components/Header";
import TabBar from "@/app/components/TabBar";
import MetricsRow from "@/app/components/MetricsRow";

import FuelPills from "@/app/components/FuelPills";
import StationList from "@/app/components/StationList";
import NearestStationsPanel from "@/app/components/NearestStationsPanel";
import CitiesTab from "@/app/components/CitiesTab";
import HistoryTab from "@/app/components/HistoryTab";
import Sidebar from "@/app/components/Sidebar";

import { useFuelData } from "@/app/hooks/useFuelData";

// ── Location banner ───────────────────────────────────────────────────────────
function LocationBanner({ status, onAllow }) {
  if (status === "granted" || status === "pending") return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--accent-dim)",
        border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        marginBottom: "0.9rem",
        fontSize: 13,
        color: "var(--text-primary)",
      }}
    >
      <span>📍</span>
      <span style={{ flex: 1 }}>{status === "denied" ? "Location denied — showing cheapest stations first" : "Allow location to find the cheapest station near you"}</span>
      {status === "idle" && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onAllow}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Allow
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Favorites tab ─────────────────────────────────────────────────────────────
function FavoritesTab({ allStations, favorites, fuel, onFavToggle }) {
  const favStations = allStations.filter((s) => favorites.has(s.stationId));
  if (!favStations.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)", fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>☆</div>
        No saved stations yet.
        <br />
        Tap ☆ on any station to save it here.
      </motion.div>
    );
  }
  return <StationList stations={favStations} fuel={fuel} loading={false} favorites={favorites} onFavToggle={onFavToggle} hasLocation={false} />;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [activeTab, setActiveTab] = useState("nearby");
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem("fuel-favs") || "[]"));
    } catch {
      return new Set();
    }
  });

  const { stations, allStations, hero, citiesSummary, updatedAt, loading, isFetching, isError, error, fuel, setFuel, query, setQuery, geo, hasLocation } = useFuelData();

  function toggleFav(stationId) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(stationId) ? next.delete(stationId) : next.add(stationId);
      try {
        localStorage.setItem("fuel-favs", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const nearestStationsForMainList = hasLocation
    ? allStations
        .map((station) => {
          const stationLat = Number(station.lat ?? station.latitude);
          const stationLng = Number(station.lng ?? station.lon ?? station.longitude);
          const price = station.prices?.[fuel]?.price;

          if (Number.isNaN(stationLat) || Number.isNaN(stationLng) || !price || !geo?.lat || !geo?.lng) {
            return null;
          }

          return {
            ...station,
            distanceKm: getDistanceKm(Number(geo.lat), Number(geo.lng), stationLat, stationLng),
          };
        })
        .filter(Boolean)
        // .sort((a, b) => {
        //   const priceA = a.prices?.[fuel]?.price ?? Infinity;
        //   const priceB = b.prices?.[fuel]?.price ?? Infinity;

        //   const scoreA = a.distanceKm * 0.7 + priceA * 0.3;
        //   const scoreB = b.distanceKm * 0.7 + priceB * 0.3;

        //   return scoreA - scoreB;
        // })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 40)
    : stations;

  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return (
    <>
      <Sidebar />

      <div className="min-[500px]:lg:ml-[280px]">
        <Header updatedAt={updatedAt} stationCount={allStations.length} isFetching={isFetching} />

        <main className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:p-8 min-[900px]:grid-cols-[1fr_360px]">
          <section>
            {isError && (
              <div
                style={{
                  background: "var(--red-dim)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                  fontSize: 13,
                  color: "var(--red)",
                  marginBottom: "0.9rem",
                }}
              >
                ⚠️ {error} — check your PROXY_URL in <code>lib/api.js</code>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
                {activeTab === "nearby" && (
                  <>
                    <MetricsRow allStations={allStations} fuel={fuel} />

                    <LocationBanner status={geo.status} onAllow={geo.requestLocation} />

                    <FuelPills selected={fuel} onChange={setFuel} />

                    <TabBar
                      activeTab={activeTab}
                      onChange={(tab) => {
                        setActiveTab(tab);
                        setQuery("");
                      }}
                    />

                    {/* <StationList stations={stations} fuel={fuel} loading={loading} query={query} onQueryChange={setQuery} favorites={favorites} onFavToggle={toggleFav} hasLocation={hasLocation} /> */}
                    {/* <StationList stations={nearestStationsForMainList} fuel={fuel} loading={loading} query={query} onQueryChange={setQuery} favorites={favorites} onFavToggle={toggleFav} hasLocation={hasLocation} /> */}
                    <NearestStationsPanel allStations={allStations} fuel={fuel} setFuel={setFuel} geo={geo} hasLocation={hasLocation} />
                  </>
                )}

                {activeTab === "cities" && (
                  <>
                    <TabBar
                      activeTab={activeTab}
                      onChange={(tab) => {
                        setActiveTab(tab);
                        setQuery("");
                      }}
                    />

                    <CitiesTab citiesSummary={citiesSummary} loading={loading} />
                  </>
                )}

                {activeTab === "history" && (
                  <>
                    {/* <TabBar
                      activeTab={activeTab}
                      onChange={(tab) => {
                        setActiveTab(tab);
                        setQuery("");
                      }}
                    /> */}

                    <HistoryTab />
                  </>
                )}

                {activeTab === "favorites" && (
                  <>
                    <TabBar
                      activeTab={activeTab}
                      onChange={(tab) => {
                        setActiveTab(tab);
                        setQuery("");
                      }}
                    />

                    <FavoritesTab allStations={allStations} favorites={favorites} fuel={fuel} onFavToggle={toggleFav} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* <NearestStationsPanel allStations={allStations} /> */}
          {/* <NearestStationsPanel allStations={allStations} fuel={fuel} setFuel={setFuel} geo={geo} hasLocation={hasLocation} /> */}
          <StationList stations={nearestStationsForMainList} fuel={fuel} loading={loading} query={query} onQueryChange={setQuery} favorites={favorites} onFavToggle={toggleFav} hasLocation={hasLocation} />
        </main>
      </div>
    </>
  );
}
