const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function createMaintenance(maintenanceData) {
  const response = await fetch(`${apiUrl}/maintenances`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(maintenanceData),
  });

  if (!response.ok) {
    throw new Error("Não foi possível cadastrar a manutenção.");
  }

  return response.json();
}


export async function getMaintenances() {
  const response = await fetch(`${apiUrl}/maintenances`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar as manutenções.");
  }
  return response.json();
}

export async function getMaintenancesByVesselId(vesselId) {
  const response = await fetch(
    `${apiUrl}/vessels/${vesselId}/maintenances`
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar o histórico.");
  }

  return response.json();
}
