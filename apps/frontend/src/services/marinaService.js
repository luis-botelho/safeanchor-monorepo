import { marinas } from "../mock/marinas";
import { getProviderById } from "./providerService";
import { getEventById } from "./eventService";

export async function getMarinas() {
  return marinas;
}

export async function getMarinaById(id) {
  const marina = marinas.find((item) => item.id === id);

  if (!marina) {
    return null;
  }

  const partnerProviders = (
    await Promise.all(
      (marina.partnerProviderIds || []).map((providerId) =>
        getProviderById(providerId),
      ),
    )
  ).filter(Boolean);

  const events = (
    await Promise.all(
      (marina.eventIds || []).map((eventId) => getEventById(eventId)),
    )
  ).filter(Boolean);

  return {
    ...marina,
    partnerProviders,
    events,
    occupancyPercent: Math.round((marina.occupied / marina.berths) * 100),
    availableBerths: marina.berths - marina.occupied,
  };
}