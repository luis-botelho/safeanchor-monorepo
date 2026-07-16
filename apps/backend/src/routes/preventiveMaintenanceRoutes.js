import { Router } from "express";
import {
  createPreventiveMaintenanceController,
  getPreventiveMaintenancesController,
} from "../controllers/preventiveMaintenanceController.js";

const router = Router();

router.get("/", getPreventiveMaintenancesController);
router.post("/", createPreventiveMaintenanceController);

export default router;