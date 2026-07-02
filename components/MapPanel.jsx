"use client";

import DashboardPanel from "./DashboardPanel";
// import FuelMap from "./FuelMap";
import dynamic from "next/dynamic";

const FuelMap = dynamic(() => import("./FuelMap"), {
  ssr: false,
});

export default function MapPanel({ stations = [], fuel = "benzin95", setFuel }) {
  return (
    <DashboardPanel
      title="Explore on map"
      action={
        <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]">
          <option value="benzin95">Benzin 95</option>
          <option value="benzin98">Benzin 98</option>
          <option value="diesel">Diesel</option>
          <option value="dieselExtra">Diesel Extra</option>
          <option value="el">El</option>
        </select>
      }
    >
      <FuelMap stations={stations} fuel={fuel} />

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[var(--text-secondary)]">
        <div>
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
          Cheapest
        </div>
        <div>
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--red)]" />
          Most expensive
        </div>
        <div>
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
          Other
        </div>
      </div>
    </DashboardPanel>
  );
}
