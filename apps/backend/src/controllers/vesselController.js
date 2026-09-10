import { getAccessScope } from "../services/accessScopeService.js";
import {
  getAllVessels,
  getVesselById,
  createVessel,
  updateVessel,
  deleteVessel,
} from "../services/vesselService.js";

export const getVessels = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const vessels = await getAllVessels(scope);

  response.json(vessels);
};

export const getVessel = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const { id } = request.params;

  const vessel = await getVesselById(scope, id);

  if (!vessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.json(vessel);
};

export const createNewVessel = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const vessel = await createVessel(scope, request.body);

  if (!vessel) {
    return response.status(403).json({
      message: "Insufficient permissions",
    });
  }

  return response.status(201).json(vessel);
};

export const updateVesselController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const { id } = request.params;

  const vessel = await updateVessel(scope, id, request.body);

  if (!vessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.status(200).json(vessel);
};

export const deleteVesselController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const { id } = request.params;

  const deletedVessel = await deleteVessel(scope, id);

  if (!deletedVessel) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.sendStatus(204);
};