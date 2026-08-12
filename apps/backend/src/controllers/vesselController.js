import {
  getAllVessels,
  getVesselById,
  createVessel,
  updateVessel,
  deleteVessel,
} from "../services/vesselService.js";

export const getVessels = async (request, response) => {
  const vessels = await getAllVessels();

  response.json(vessels);
};

export const getVessel = async (request, response) => {
  const { id } = request.params;

  const vessel = await getVesselById(id);

  if (!vessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.json(vessel);
};

export const createNewVessel = async (request, response) => {
  const vesselData = request.body;

  const vessel = await createVessel(vesselData);

  return response.status(201).json(vessel);
};

export const updateVesselController = async (request, response) => {
  const { id } = request.params;
  const vesselData = request.body;

  const vessel = await updateVessel(id, vesselData);

  if (!vessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.status(200).json(vessel);
};

export const deleteVesselController = async (request, response) => {
  const { id } = request.params;

  const deletedVessel = await deleteVessel(id);

  if (!deletedVessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.sendStatus(204);
};