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
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get("/", getVessels);
router.post("/", authorizeRoles("MANAGER", "ADMIN"), createNewVessel);
router.get("/:id", getVessel);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateVesselController)
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteVesselController)
router.get("/:id/maintenances", getMaintenancesByVesselIdController);
router.get("/:id/inspections", getChecklistExecutionsByVesselIdController);

export default router;