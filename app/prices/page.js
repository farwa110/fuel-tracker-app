"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/app/components/Header";
import MetricsRow from "@/app/components/MetricsRow";
import FuelPills from "@/app/components/FuelPills";
import StationList from "@/app/components/StationList";
import NearestStationsPanel from "@/app/components/NearestStationsPanel";
import CitiesTab from "@/app/components/CitiesTab";
import HistoryTab from "@/app/components/HistoryTab";
import Sidebar from "@/app/components/Sidebar";

import { useFuelData } from "@/app/hooks/useFuelData";

function FavoritesTab({ allStations, favorites, fuel, onFavToggle }) {
  const favStations = allStations.filter((s) => favorites.has(s.stationId));

  if (!favStations.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "var(--text-secondary)",
          fontSize: 14,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>☆</div>
        No saved stations yet.
        <br />
        Tap ☆ on any station to save it here.
      </motion.div>
    );
  }

  return <StationList stations={favStations} fuel={fuel} loading={false} favorites={favorites} onFavToggle={onFavToggle} hasLocation={false} />;
}

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

  const { stations, allStations, citiesSummary, updatedAt, loading, isFetching, isError, error, fuel, setFuel, query, setQuery, geo, hasLocation } = useFuelData();

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

  const filteredStations = stations.filter((station) => {
    const search = query.toLowerCase();

    return station.name?.toLowerCase().includes(search) || station.brand?.toLowerCase().includes(search) || station.city?.toLowerCase().includes(search) || station.address?.toLowerCase().includes(search);
  });

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setQuery("");
        }}
        updatedAt={updatedAt}
      />

      <div className="lg:ml-60">
        <Header updatedAt={updatedAt} stationCount={allStations.length} isFetching={isFetching} />

        {/* <main className="relative min-h-screen overflow-hidden bg-(--bg)"> */}
        <main className="relative min-h-screen overflow-hidden bg-(--bg)">
          {/* subtle SVG background */}
          {/* <div className="pointer-events-none absolute inset-0 bg-[url('/fuel-tracker-topographic-bg.svg')] bg-cover bg-center bg-no-repeat opacity-[0.035]" /> */}
          <div className="pointer-events-none absolute inset-0 bg-[url('/fuel-tracker-topographic-bg.svg')] bg-cover bg-center bg-no-repeat opacity-[0.08]" />
          {/* soft dark layer for dashboard depth */}
          {/* <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_92%,transparent)]" /> */}

          <div className="relative z-10 grid grid-cols-1 gap-6 p-4 pt-16 sm:p-6 sm:pt-18 lg:p-8 lg:pt-20 min-[900px]:grid-cols-[1fr_360px]">
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
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  {activeTab === "nearby" && (
                    <>
                      <MetricsRow allStations={allStations} fuel={fuel} />

                      <FuelPills selected={fuel} onChange={setFuel} />

                      <NearestStationsPanel allStations={allStations} fuel={fuel} setFuel={setFuel} geo={geo} hasLocation={hasLocation} />
                    </>
                  )}

                  {activeTab === "cities" && <CitiesTab citiesSummary={citiesSummary} loading={loading} />}

                  {activeTab === "history" && <HistoryTab />}

                  {activeTab === "favorites" && <FavoritesTab allStations={allStations} favorites={favorites} fuel={fuel} onFavToggle={toggleFav} />}
                </motion.div>
              </AnimatePresence>
            </section>

            <StationList stations={filteredStations} fuel={fuel} loading={loading} query={query} onQueryChange={setQuery} favorites={favorites} onFavToggle={toggleFav} hasLocation={false} />
          </div>
        </main>
      </div>
    </>
  );
}
