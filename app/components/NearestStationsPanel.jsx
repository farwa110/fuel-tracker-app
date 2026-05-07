"use client";

import AdviceCard from "./AdviceCard";

const FUEL_OPTIONS = [
  { id: "benzin95", label: "Benzin" },
  { id: "diesel", label: "Diesel" },
  { id: "el", label: "EL" },
];

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStationLat(station) {
  return station.lat ?? station.latitude;
}

function getStationLng(station) {
  return station.lng ?? station.lon ?? station.longitude;
}

export default function NearestStationsPanel({ allStations = [], fuel, setFuel, geo, hasLocation }) {
  console.log("geo", geo);
  console.log("first station", allStations[0]);

  const nearestStations = hasLocation
    ? allStations
        .map((station) => {
          const stationLat = station.lat ?? station.latitude;

          const stationLng = station.lng ?? station.lon ?? station.longitude;

          const price = station.prices?.[fuel]?.price;

          if (!stationLat || !stationLng || !price) {
            return null;
          }

          return {
            ...station,
            selectedPrice: price,

            distanceKm: getDistanceKm(geo.lat, geo.lng, stationLat, stationLng),
          };
        })
        .filter(Boolean)

        // IMPORTANT:
        // first find nearby stations only
        // .filter((station) => station.distanceKm < 25)
        .sort((a, b) => {
          const scoreA = a.distanceKm * 0.7 + a.selectedPrice * 0.3;
          const scoreB = b.distanceKm * 0.7 + b.selectedPrice * 0.3;

          return scoreA - scoreB;
        })
        .slice(0, 5)
    : // then sort by price INSIDE nearby area

      [];
  return (
    <aside
      className="
        w-full rounded-2xl border border-[var(--border)]
        bg-[var(--surface)] p-4
        shadow-[var(--shadow-sm)]
        min-[900px]:sticky min-[900px]:top-20
      "
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Cheapest near you</h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">Allow location to see the best nearby fuel options.</p>
      </div>

      <div className="mb-4 flex rounded-full bg-[var(--bg-secondary)] p-1">
        {FUEL_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => setFuel(option.id)}
            className={`
              flex-1 rounded-full px-3 py-2 text-sm font-medium transition
              ${fuel === option.id ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!hasLocation && (
        <button
          onClick={geo.requestLocation}
          className="
            mb-4 w-full rounded-full
            bg-[var(--accent)] px-4 py-3
            text-sm font-semibold text-white
            transition hover:opacity-90
          "
        >
          Allow location
        </button>
      )}

      {geo?.error && <p className="mb-4 text-sm text-[var(--red)]">{geo.error}</p>}

      {hasLocation && (
        <div className="mb-4 space-y-2">
          {nearestStations.map((station, index) => (
            <div
              key={station.stationId || station.id || station.name}
              className="
                rounded-xl border border-[var(--border)]
                bg-[var(--bg-secondary)] p-3
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {index + 1}. {station.name}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)]">{station.distanceKm.toFixed(1)} km away</p>
                </div>

                <p className="text-sm font-bold text-[var(--text-primary)]">{station.selectedPrice.toFixed(2)} kr</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdviceCard allStations={allStations} stations={nearestStations} fuel={fuel} hasLocation={hasLocation} />
    </aside>
  );
}
