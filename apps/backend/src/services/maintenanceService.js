import { Maintenance } from "../models/maintenanceModel.js";

const maintenances = [
  {
    id: 1,
    vesselId: 1,
    title: "arrumando",
    description: "o barco ta concertando mano",
    type: "critical",
    date: "10/06/26",
    status: "fudido",
  },
  {
    id: 2,
    vesselId: 2,
    title: "concertado",
    description: "o barco ta pronto mano",
    type: "doned",
    date: "30/09/26",
    status: "novinho",
  },
];

export const createMaintenance = (maintenanceData) => {
  const newMaintenance = new Maintenance(
    maintenances.length + 1,
    maintenanceData.vesselId,
    maintenanceData.title,
    maintenanceData.description,
    maintenanceData.type,
    maintenanceData.date,
    maintenanceData.status
  );
  
  maintenances.push(newMaintenance);
  
  return newMaintenance;
};

export const getMaintenances = () => maintenances;

export const getMaintenanceById = (id) => {
  const maintenances = getMaintenances();

  return maintenances.find((maintenance) => maintenance.id === Number(id));
};

export const getMaintenancesByVesselId = (vesselId) => {
  return maintenances.filter(
    (maintenance) => maintenance.vesselId === Number(vesselId)
  );
};
