import { Router } from "express";
import {
  getMaintenancesController,
  createMaintenanceController,
} from "../controllers/maintenanceController.js";

const router = Router();

router.get("/", getMaintenancesController);
router.post("/", createMaintenanceController);

export default router;