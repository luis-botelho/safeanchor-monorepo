import { Maintenance } from "../models/maintenanceModel.js";
const maintenances = [
  {
    id: 1,
    vesselId: 1,
    title: "arrumando",
    description: "o barco ta concertando mano",
    date: "10/06/26",
    status: "fudido",
  },
  {
    id: 2,
    vesselId: 2,
    title: "concertado",
    description: "o barco ta pronto mano",
    date: "30/09/26",
    status: "novinho",
  },
];

export const getMaintenances = () => maintenances;
