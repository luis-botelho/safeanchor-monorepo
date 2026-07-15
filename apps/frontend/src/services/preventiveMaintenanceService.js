const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function createPreventiveMaintenance(data) {
  const response = await fetch(`${apiUrl}/preventive-maintenances`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      "Não foi possível cadastrar a manutenção preventiva."
    );
  }

  return response.json();
}