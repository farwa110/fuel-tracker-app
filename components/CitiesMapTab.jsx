"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import DashboardPanel from "./DashboardPanel";

const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
});

export default function CitiesMapTab({ citiesSummary = [], allStations = [], fuel = "benzin95", setFuel }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [sortBy, setSortBy] = useState("cheapest");
  const [showStations, setShowStations] = useState(false);
  const sortedCities = useMemo(() => {
    const list = [...citiesSummary].filter((city) => city[fuel]);

    if (sortBy === "cheapest") {
      return list.sort((a, b) => a[fuel] - b[fuel]);
    }

    if (sortBy === "expensive") {
      return list.sort((a, b) => b[fuel] - a[fuel]);
    }

    if (sortBy === "stations") {
      return list.sort((a, b) => b.count - a.count);
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [citiesSummary, fuel, sortBy]);

  const prices = sortedCities.map((city) => city[fuel]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const activeCity = selectedCity || sortedCities[0];
  const cityStations = allStations.filter((station) => station.city?.toLowerCase() === activeCity?.name?.toLowerCase() && station.prices?.[fuel]?.price);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
      <DashboardPanel
        title="Explore fuel prices across Denmark"
        subtitle={`${sortedCities.length} cities tracked`}
        action={
          <div className="flex gap-2">
            <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
              <option value="benzin95">Benzin 95</option>
              {/* <option value="benzin98">Benzin 98</option> */}
              <option value="diesel">Diesel</option>
              {/* <option value="dieselExtra">Diesel Extra</option> */}
              {/* <option value="el">El</option> */}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
              <option value="cheapest">Cheapest first</option>
              <option value="expensive">Most expensive</option>
              <option value="stations">Most stations</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        }
      >
        <CityMap cities={sortedCities} fuel={fuel} minPrice={minPrice} maxPrice={maxPrice} selectedCity={activeCity} onSelectCity={setSelectedCity} />

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
          <span>
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
            Cheapest
          </span>

          <span>
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--red)]" />
            Most expensive
          </span>

          <span>
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
            Other cities
          </span>
        </div>
      </DashboardPanel>

      <DashboardPanel title={activeCity?.name || "Select a city"} subtitle="City details">
        {activeCity ? (
          <div>
            <p className="text-4xl font-bold tabular-nums text-[var(--text-primary)]">{activeCity[fuel]?.toFixed(2)} kr</p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">{activeCity.count} stations tracked</p>

            <div className="mt-6 grid gap-3">
              <InfoRow label="Cheapest today" value={minPrice?.toFixed(2) + " kr"} />
              <InfoRow label="Most expensive" value={maxPrice?.toFixed(2) + " kr"} />
              <InfoRow label="Difference" value={(maxPrice - minPrice).toFixed(2) + " kr"} />
            </div>

            {/* <button className="mt-6 w-full rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white">View stations in {activeCity.name}</button> */}
            <button onClick={() => setShowStations(true)} className="mt-6 w-full rounded-xl bg-(--green) px-4 py-3 text-sm font-semibold text-white">
              View stations in {activeCity.name}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">Click a city on the map.</p>
        )}

        {showStations && (
          <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/40 p-4">
            <div className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Stations in {activeCity.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{cityStations.length} stations found</p>
                </div>

                <button onClick={() => setShowStations(false)} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm">
                  ✕
                </button>
              </div>

              <div className="grid gap-3">
                {cityStations.map((station) => {
                  const price = station.prices[fuel].price;

                  return (
                    <div key={station.stationId} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{station.name}</p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{station.address}</p>
                        </div>

                        <p className="font-bold tabular-nums text-[var(--green)]">{price.toFixed(2)} kr</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DashboardPanel>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3 text-sm">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <strong className="text-[var(--text-primary)]">{value}</strong>
    </div>
  );
}
