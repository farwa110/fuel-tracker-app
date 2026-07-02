"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const cityCoords = {
  Skanderborg: [56.034, 9.931],
  Tinglev: [54.936, 9.252],
  "Nørre Snede": [55.96, 9.39],
  Vinderup: [56.48, 8.78],
  Rødby: [54.69, 11.39],
  Tølløse: [55.61, 11.77],
  Rødding: [55.36, 9.06],
  Assens: [55.27, 9.9],
  Skovlunde: [55.72, 12.4],
  Gudhjem: [55.21, 14.97],
  Østermarie: [55.14, 15.0],
  Åbenrå: [55.04, 9.42],
  Virklund: [56.13, 9.55],
  kyst: [55.95, 11.85],
  Dronninglund: [57.16, 10.29],
  Videbæk: [56.09, 8.63],
  Augustenborg: [54.95, 9.87],
  Rønnede: [55.26, 12.02],
  sj: [55.46, 11.75],
  Års: [56.8, 9.52],
};

export default function CityMap({ cities = [], fuel, minPrice, maxPrice, selectedCity, onSelectCity }) {
  return (
    <div className="h-[560px] overflow-hidden rounded-[var(--radius-md)]">
      <MapContainer center={[56.2, 10.3]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {cities.map((city) => {
          const coords = cityCoords[city.name];
          if (!coords) return null;

          const price = city[fuel];
          const isMin = price === minPrice;
          const isMax = price === maxPrice;
          const isSelected = selectedCity?.name === city.name;

          const color = isMin ? "var(--green)" : isMax ? "var(--red)" : "#9ca3af";

          return (
            <CircleMarker
              key={city.name}
              center={coords}
              radius={isSelected ? 11 : isMin || isMax ? 9 : 6}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.9,
                weight: isSelected ? 4 : 2,
              }}
              eventHandlers={{
                click: () => onSelectCity(city),
              }}
            >
              <Popup>
                <strong>{city.name}</strong>
                <br />
                {price.toFixed(2)} kr
                <br />
                {city.count} stations
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
