import { events, eventTypes } from "../mock/events";

export async function getEvents() {
  return events;
}

export async function getEventById(id) {
  return events.find((event) => event.id === id) || null;
}

export function getEventTypes() {
  return eventTypes;
}