import { Router } from "express";
import {
  getMaintenancesController,
  createMaintenanceController,
  getMaintenanceDashboardController,
} from "../controllers/maintenanceController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.get("/", getMaintenancesController);
router.post("/", authorizeRoles("MANAGER", "ADMIN"), createMaintenanceController);
router.get("/dashboard", getMaintenanceDashboardController);


export default router;