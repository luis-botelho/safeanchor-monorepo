import { Vessel } from "../models/vesselModel.js";

export const getAllVessels = () => {
  return [
    new Vessel(
      1,
      "Sea Explorer",
      "Lancha",
      "Ativa"
    ),
    new Vessel(
      2,
      "Ocean Dream",
      "Iate",
      "Manutenção"
    )
  ];
};