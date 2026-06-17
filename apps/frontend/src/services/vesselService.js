import { createVessel } from "../models/vesselModel";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

const fallbackVessels = [
  createVessel({
    id: 1,
    name: "Sea Explorer",
    type: "Lancha",
    status: "Ativa",
  }),
];

export async function getVessels() {
  try {
    const response = await fetch(`${apiUrl}/vessels`);

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar as embarcacoes.");
    }

    const data = await response.json();

    return {
      vessels: data,      
      source: "api",      
      error: false,
    };
  } catch (error){
    return {
      vessels: fallbackVessels,
      source: "fallback",     
      error: true,
    };
  }
}
