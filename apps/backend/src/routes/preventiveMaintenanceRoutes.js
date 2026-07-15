import { Router } from "express";
import { createPreventiveMaintenanceController } from "../controllers/preventiveMaintenanceController.js";

const router = Router();

router.post("/", createPreventiveMaintenanceController);

export default router;