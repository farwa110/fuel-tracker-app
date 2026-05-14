"use client";

import AdviceCard from "./AdviceCard";

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

  const userLat = geo?.lat ?? geo?.latitude;
  const userLng = geo?.lng ?? geo?.longitude;

  const canUseLocation = hasLocation && userLat != null && userLng != null;

  const nearestStations = canUseLocation
    ? allStations
        .map((station) => {
          const stationLat = getStationLat(station);
          const stationLng = getStationLng(station);
          const price = station.prices?.[fuel]?.price;

          if (stationLat == null || stationLng == null || price == null) {
            return null;
          }

          return {
            ...station,
            selectedPrice: price,
            distanceKm: getDistanceKm(userLat, userLng, stationLat, stationLng),
          };
        })
        .filter(Boolean)
        .filter((station) => station.distanceKm < 25)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5)
    : [];
  return (
    <aside
      className="
        w-full rounded-2xl border border-(--border)
        bg-(--surface) p-10
        shadow-(--shadow-sm)
        min-[900px]:sticky min-[900px]:top-20
      "
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-(--text-primary)">Cheapest near you</h2>

        <p className="mt-1 text-sm text-(--text-secondary)">Allow location to see the best nearby fuel options.</p>
      </div>

      {!hasLocation && (
        <button
          onClick={geo.requestLocation}
          className="
  inline-flex items-center gap-2
  rounded-full
  bg-(--accent)
  px-6 py-3
  text-sm font-semibold
  text-(--bg)
  transition-all duration-200
  hover:bg-(--accent-light)
  active:scale-[0.98]
"
        >
          Allow location
        </button>
      )}

      {geo?.error && <p className="mb-4 text-sm text-(--red)">{geo.error}</p>}

      {/* {hasLocation && ( */}
      {canUseLocation && (
        <div className="mb-4 space-y-2">
          {nearestStations.map((station, index) => (
            <div
              key={station.stationId || station.id || station.name}
              className="
                rounded-xl border border-(--border)
                bg-(--bg-secondary) p-6
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">
                    {index + 1}. {station.name}
                  </p>

                  <p className="text-xs text-(--text-secondary)">{station.distanceKm.toFixed(1)} km away</p>
                </div>

                <p className="text-sm font-bold text-(--text-primary)">{station.selectedPrice.toFixed(2)} kr</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <AdviceCard allStations={allStations} stations={nearestStations} fuel={fuel} hasLocation={hasLocation} /> */}
      <AdviceCard allStations={allStations} stations={nearestStations} fuel={fuel} hasLocation={canUseLocation} />
    </aside>
  );
}
