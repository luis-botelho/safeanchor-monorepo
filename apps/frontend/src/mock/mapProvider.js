// Camada de mapa substituível.
// O SafeAnchor usa hoje um mapa mockado (SVG). Trocar o provider real
// (Google Maps, Mapbox etc.) exige apenas um novo adapter que implemente
// a mesma interface: providerId, providerName, buildMockRoute.

export const mapProvider = {
  providerId: "mock-map-v1",
  providerName: "SafeAnchor Map (mock)",
  swappable: true,
  description:
    "Camada visual de demonstração. Coordenadas simplificadas [x,y] são convertidas pela camada; nenhuma API externa é usada.",
  permissions: "Nenhum dado de geolocalização é enviado para terceiros.",
  buildMockRoute: (waypoints) => waypoints,
};

export function getMapProvider() {
  return mapProvider;
}