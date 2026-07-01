import { Vessel } from "../models/vesselModel.js";

const vessels = [
  {
    id: 1,
    name: "Sea Explorer",
    type: "Lancha",
    status: "Ativa",
  },
  {
    id: 2,
    name: "Ocean Dream",
    type: "Iate",
    status: "Manutenção",
  },
];

export const getAllVessels = () => vessels;

export const createVessel = (vesselData) => {
  const newVessel = {
    id: vessels.length + 1,  // Forma de gerar um ID único simples, mas muito básica. Em um cenário real, seria melhor usar um UUID ou um sistema de banco de dados para garantir unicidade.
    ...vesselData,
  };

  vessels.push(newVessel);

  return newVessel;
};

export const getVesselById = (id) => {
  const vessels = getAllVessels();

  return vessels.find(
    (vessel) => vessel.id === Number(id)
  );
};

export const updateVessel = (id, VesselData) =>{
  const vessel = getVesselById(id);
  if (!vessel){
    return null
  }
  vessel.name = vesselData.name
  vessel.status = vesselData.status
  vessel.type = vesselData.type

  return vessel
}