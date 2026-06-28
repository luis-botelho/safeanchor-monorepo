const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

//Get vessels 
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

//Get vessel by id
export async function getVesselById(id) {
  try {
    const response = await fetch(`${apiUrl}/vessels/${id}`);
    
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a embarcação.");
    }
    
    const data = await response.json();
    
    return {
      vessel: data,      
      source: "api",      
      error: false,
    };
  } catch (error){
    const vessel = vessels.find(
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
//Delete 