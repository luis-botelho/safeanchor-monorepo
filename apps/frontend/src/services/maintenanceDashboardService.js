const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";


export async function getMaintenanceDashboard() {
  const response = await fetch(`${apiUrl}/maintenances/dashboard`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar o dashboard.");
  }

  return response.json();
}