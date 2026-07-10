import { Router } from "express";
import { getMaintenancesController } from "../controllers/maintenanceController.js";
const router = Router();
router.get("/", getMaintenancesController);
export default router;