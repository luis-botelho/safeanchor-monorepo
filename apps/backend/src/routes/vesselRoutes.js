import express from "express";
import {
  getVessels,
  getVessel,
  createNewVessel,
  updateVesselController,
  deleteVesselController,
} from "../controllers/vesselController.js";
import {
  getMaintenancesByVesselIdController,
} from "../controllers/maintenanceController.js";
import {
  getChecklistExecutionsByVesselIdController,
} from "../controllers/checklistExecutionController.js";

const router = express.Router();

router.get("/", getVessels);
router.post("/", createNewVessel);
router.get("/:id", getVessel);
router.put("/:id", updateVesselController)
router.delete("/:id", deleteVesselController)
router.get("/:id/maintenances", getMaintenancesByVesselIdController);
router.get("/:id/inspections", getChecklistExecutionsByVesselIdController);

export default router;