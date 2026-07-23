const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getInspectionsByVessel(vesselId) {
  const response = await fetch(
    `${apiUrl}/vessels/${vesselId}/inspections`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar inspeções.");
  }

  return response.json();
}