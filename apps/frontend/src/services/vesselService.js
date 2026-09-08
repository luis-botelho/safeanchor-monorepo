import { apiFetch } from "./api";

const fallbackVessels = [
  createVessel({
    id: 1,
    name: "Sea Explorer",
    type: "Lancha",
    status: "Ativa",
  }),
];

//create vessel 

export async function createVessel(vesselData) {
  return apiFetch("/vessels", {
    method: "POST",
    body: JSON.stringify(vesselData),
  });
}

//Get vessels 
export async function getVessels() {
  try {
    const data = await apiFetch("/vessels");

    return {
      vessels: data,
      source: "api",
      error: false,
    };
  } catch (error) {
    if (error.status === 401) {
      throw error;
    }

    return {
      vessels: fallbackVessels,
      source: "fallback",
      error: true,
    };
  }
}

//Get vessel by id
export async function getVesselById(id) {
  try {
    const data = await apiFetch(`/vessels/${id}`);

    return {
      vessel: data,
      source: "api",
      error: false,
    };
  } catch (error) {
    if (error.status === 401) {
      throw error;
    }

    const vessel = fallbackVessels.find(
      (vessel) => vessel.id === Number(id)
    );

    return {
      vessel,
      source: "fallback",
      error: false,
    };
  }
}

//Update vessel 
export async function updateVessel(id, vesselData) {
  return apiFetch(`/vessels/${id}`, {
    method: "PUT",
    body: JSON.stringify(vesselData),
  });
}

//Delete 
export async function deleteVessel(id) {
  await apiFetch(`/vessels/${id}`, {
    method: "DELETE",
  });

  return true;
}