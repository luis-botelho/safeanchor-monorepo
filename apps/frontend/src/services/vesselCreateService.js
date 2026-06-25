const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function createVessel(vesselData) {
  const response = await fetch(`${apiUrl}/vessels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vesselData),
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel cadastrar a embarcacao.");
  }

  return response.json();
}