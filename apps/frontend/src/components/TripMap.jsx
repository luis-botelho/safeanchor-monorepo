// Mapa de demonstração construído sobre a camada "SafeAnchor Map (mock)".
// A interface é (provider) -> rota. Trocar o provider real não altera os
// dados de waypoints nem o consumo nas telas.

import { getMapProvider } from "../mock/mapProvider";

const KIND_COLOR = {
  start: "#0e8a5f",
  stop: "#0d6efd",
  waypoint: "#ffb020",
  dest: "#e05d34",
  poi: "#9aa0a6",
};

export default function TripMap({
  points = [],
  pois = [],
  label = "Rota simulada",
  height = 320,
  showProviderNote = true,
}) {
  const provider = getMapProvider();
  const sorted = [...points].map((p) => ({ ...p, kind: p.kind || "stop" }));
  const line = sorted
    .map((p) => `${p.coords.x},${p.coords.y}`)
    .join(" ");

  return (
    <div className="trip-map">
      <div className="trip-map__canvas" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="trip-map__svg"
        >
          <defs>
            <linearGradient id="tripSea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dff1fb" />
              <stop offset="100%" stopColor="#bcdcec" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#tripSea)" />
          <path
            d={`M 0 88 Q 20 84 38 78 T 72 60 T 100 34`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
            strokeOpacity="0.8"
          />
          {pois.map((poi) => (
            <circle
              key={poi.id}
              cx={poi.x}
              cy={poi.y}
              r="1.1"
              fill={KIND_COLOR.poi}
              fillOpacity="0.7"
            />
          ))}
          <polyline
            points={line}
            fill="none"
            stroke={KIND_COLOR.dest}
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="2 1"
          />
          {sorted.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.coords.x}
                cy={p.coords.y}
                r={p.kind === "start" ? 2.2 : 1.7}
                fill={KIND_COLOR[p.kind] || KIND_COLOR.stop}
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <text
                x={p.coords.x}
                y={p.coords.y - 3}
                fontSize="2.6"
                fill="#0b2534"
                fontWeight="600"
                textAnchor="middle"
                stroke="#ffffff"
                strokeWidth="0.4"
                paintOrder="stroke"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <span className="trip-map__badge">{label}</span>
      </div>
      {showProviderNote && (
        <div className="trip-map__note">
          <IconInMap />
          {provider.providerId} · camada substituível: {provider.description}
        </div>
      )}
    </div>
  );
}

function IconInMap() {
  return <span className="trip-map__dot" />;
}