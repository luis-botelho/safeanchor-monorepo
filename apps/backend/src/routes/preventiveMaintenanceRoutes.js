import { Router } from "express";
import {
  createPreventiveMaintenanceController,
  getPreventiveMaintenancesController,
} from "../controllers/preventiveMaintenanceController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.get("/", getPreventiveMaintenancesController);
router.post(
  "/",
  authorizeRoles("USER", "MANAGER", "ADMIN"),
  createPreventiveMaintenanceController,
);

export default router;