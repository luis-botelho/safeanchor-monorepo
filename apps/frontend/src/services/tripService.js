import { trips, vesselSpecs, crewRoles, readinessSections, floatPlan } from "../mock/trips";
import { destinations } from "../mock/destinations";
import { vessels } from "../mock/vessels";

export async function getTrips() {
  return trips;
}

export async function getTripById(id) {
  const trip = trips.find((item) => item.id === id);
  return trip ? { ...trip } : null;
}

export async function getVesselTrips(vesselId) {
  return trips.filter((trip) => trip.vesselId === vesselId);
}

export function getDestinationById(id) {
  return destinations.find((item) => item.id === id) || null;
}

export async function getVesselProfile(vesselId) {
  const spec = vesselSpecs[vesselId] || null;
  const vessel = vessels.find((item) => item.id === vesselId) || null;
  return {
    spec,
    vessel,
    des: vessel ? `${vessel.name} · ${vessel.length} pés` : "Embarcação",
  };
}

export async function getCrewRoles() {
  return crewRoles;
}

export async function getReadiness() {
  return readinessSections;
}

export async function getFloatPlan() {
  return floatPlan;
}

const legDistances = {
  "dst-angra|dst-ilha-grande": 12,
  "dst-ilha-grande|dst-paraty": 24,
  "dst-paraty|dst-trindade": 46,
  "dst-angra|dst-paraty": 36,
  "dst-ilha-grande|dst-trindade": 70,
  "start|dst-angra": 112,
  "dst-angra|start": 112,
};

// Constrói o itinerário base a partir dos destinos escolhidos no planner.
export function buildItinerary(stops, vesselId) {
  const spec = vesselSpecs[vesselId];
  const plan = [];

  stops.forEach((stopId, index) => {
    const dest = getDestinationById(stopId);
    if (!dest) return;

    const previous = index === 0 ? "start" : stops[index - 1];
    const distance =
      legDistances[`${previous}|${stopId}`] ||
      (index === 0 ? 112 : 25 + index * 10);

    const hours = spec ? (distance / spec.cruiseSpeedKt) : 4;
    const hh = Math.max(1, Math.round(hours * 2) / 2);

    plan.push({
      day: index + 1,
      title:
        index === 0
          ? `Saída → ${dest.name}`
          : `${plan[index - 1]?.stop || "Origem"} → ${dest.name}`,
      start: index === 0 ? "05:30" : "07:00",
      distance: `${distance} nm`,
      eta: `${hh}h`,
      stop: dest.name,
      marina:
        dest.marina?.registered
          ? dest.marina.name
          : `${dest.marina?.name || "Cais local"} (fundeio)`,
      activities: dest.pois
        .filter((poi) => ["Praias", "Trilhas", "Mergulho", "Passeios"].includes(poi.category))
        .slice(0, 2)
        .map((poi) => poi.name),
      restaurants: dest.pois.filter((poi) => poi.category === "Restaurantes").slice(0, 2).map((p) => p.name),
      lodging: [dest.marina?.registered ? dest.marina.name : "Fundeio / pousada local"],
      services: dest.pois
        .filter((poi) => ["Combustível", "Mercados", "Farmácias"].includes(poi.category))
        .slice(0, 2)
        .map((p) => p.name),
      notes: dest.marina?.registered
        ? "Marina conectada — reserva de vaga disponível."
        : "Marina não cadastrada — solicitação de contato disponível.",
    });
  });

  return plan;
}

export function createTrip(payload) {
  const newTrip = {
    id: `trip-${Date.now()}`,
    ownerId: "usr-luis",
    status: "Planejada",
    statusTone: "info",
    shares: 0,
    views: 0,
    communityPostId: null,
    requests: [],
    aiSuggestion:
      "Sua rota foi revisada pela IA: aproveitamento de mar agitado e marinas com vaga para você, com as paradas essenciais mantidas.",
    ...payload,
  };

  trips.unshift(newTrip);

  return newTrip;
}