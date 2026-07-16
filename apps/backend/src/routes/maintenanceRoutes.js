import { Router } from "express";
import {
  getMaintenancesController,
  createMaintenanceController,
  getMaintenanceDashboardController,
} from "../controllers/maintenanceController.js";

const router = Router();

router.get("/", getMaintenancesController);
router.post("/", createMaintenanceController);
router.get("/dashboard", getMaintenanceDashboardController);


export default router;