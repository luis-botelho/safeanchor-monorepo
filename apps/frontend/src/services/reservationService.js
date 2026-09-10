import { reservations, reservationStats } from "../mock/reservations";

export async function getReservations() {
  return reservations;
}

export async function getReservationStats() {
  return reservationStats;
}