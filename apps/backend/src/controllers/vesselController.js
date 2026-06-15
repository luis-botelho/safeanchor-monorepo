import { getAllVessels } from "../services/vesselService.js";

export const getVessels = (request, response) => {
  const vessels = getAllVessels();

  response.json(vessels);
};