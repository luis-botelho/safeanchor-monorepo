const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getMaintenances() {
  const response = await fetch(`${apiUrl}/maintenance`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar as manutenções.");
  }
  return response.json();
}
