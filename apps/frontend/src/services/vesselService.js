import { vessels, vesselStatusMeta } from "../mock/vessels";

export async function getVessels() {
  return {
    vessels,
    source: "mock",
    error: false,
  };
}

export async function getFleetVessels() {
  return vessels.filter(
    (item) => !item.ownerType || item.ownerType === "OWNER",
  );
}

export async function getVesselsByOwner(ownerId) {
  return vessels.filter((item) => item.ownerId === ownerId);
}

export async function getVesselById(id) {
  const vessel = vessels.find((item) => item.id === id);

  return {
    vessel,
    source: "mock",
    error: false,
  };
}

export async function getVessel(id) {
  const result = await getVesselById(id);
  return result.vessel;
}

export function getVesselStatus(status) {
  return vesselStatusMeta[status] || { label: status, tone: "neutral" };
}

// Mocks preservados para compatibilidade com telas anteriores.
export async function createVessel() {
  return null;
}
export async function updateVessel() {
  return null;
}
export async function deleteVessel() {
  return true;
}