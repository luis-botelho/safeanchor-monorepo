import {
  getAllVessels,
  getVesselById,
  createVessel
} from "../services/vesselService.js";


export const getVessels = (request, response) => {
  const vessels = getAllVessels();

  response.json(vessels);
};

export const getVessel = (request, response) => {
  const { id } = request.params;

  const vessel = getVesselById(id);

  if (!vessel) {
    return response.status(404).json({
      message: "Vessel not found"
    });
  }

  response.json(vessel);
};

export const createNewVessel = (request, response) => {
  const vesselData = request.body;

  const vessel = createVessel(vesselData);

  response.status(201).json(vessel);
};