"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function FuelMap({ stations = [], fuel = "benzin95" }) {
  const validStations = stations.filter((s) => s.lat && s.lng && s.prices?.[fuel]?.price);

  const prices = validStations.map((s) => s.prices[fuel].price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <div className="h-[280px] overflow-hidden rounded-[var(--radius-md)]">
      <MapContainer center={[56.2639, 9.5018]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validStations.slice(0, 120).map((station) => {
          const price = station.prices[fuel].price;

          const color = price === min ? "var(--green)" : price === max ? "var(--red)" : "#9ca3af";

          return (
            <CircleMarker
              key={station.stationId}
              center={[station.lat, station.lng]}
              radius={6}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.city}
                <br />
                {price.toFixed(2)} kr
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
