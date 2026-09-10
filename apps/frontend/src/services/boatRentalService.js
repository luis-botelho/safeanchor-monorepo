import { boatRentals } from "../mock/boatRentals";
import { vessels } from "../mock/vessels";

export async function getBoatRentals() {
  return boatRentals.map((rental) => ({
    ...rental,
    vessel: rental.vesselId ? vessels.find((v) => v.id === rental.vesselId) : null,
  }));
}

export async function getBoatRentalById(id) {
  const rental = boatRentals.find((item) => item.id === id);
  if (!rental) return null;
  return {
    ...rental,
    vessel: rental.vesselId ? vessels.find((v) => v.id === rental.vesselId) : null,
  };
}

export async function getOwnerRentals(ownerId) {
  return boatRentals.filter((rental) => rental.ownerId === ownerId);
}

export function createRentalRequest(rentalId, selection) {
  return {
    id: `rental-req-${Date.now()}`,
    rentalId,
    status: "Solicitação enviada",
    ...selection,
  };
}