import { Maintenance } from "../models/maintenanceModel.js";
const maintenances = [
  {
    id: 1,
    vesselId: 1,
    title: "arrumando",
    description: "o barco ta concertando mano",
    type:"critical",
    date: "10/06/26",
    status: "fudido",
  },
  {
    id: 2,
    vesselId: 2,
    title: "concertado",
    description: "o barco ta pronto mano",
    type:"doned",
    date: "30/09/26",
    status: "novinho",
  },
];

export const getMaintenances = () => maintenances;
export const getMaintenanceById = (id) => {
  const maintenances = getMaintenances();
  const maintenance = maintenances.find((vessel) => maintenance.id === Number(id));
  return maintenance
};
export const createMaintenance = (maintenanceData) => {
  const newMaintenance = {
    id: maintenance.length + 1,
    ...maintenanceData,
  }
  maintenance.push(newVessel);
  return newVessel
}
