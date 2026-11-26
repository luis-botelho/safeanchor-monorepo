import { Router } from "express";

import {
  cancelNewInspection,
  createNewInspection,
  finishInspection,
  getInspection,
  listInspections,
  listInspectionsByVessel,
  updateInspectionChecklist,
} from "../controllers/inspectionController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();
const canWrite = authorizeRoles("USER", "MANAGER", "ADMIN");

router.get("/", listInspections);
router.get("/vessel/:vesselId", listInspectionsByVessel);
router.get("/:id", getInspection);
router.post("/", canWrite, createNewInspection);
router.patch("/:id/checklist/:itemIndex", canWrite, updateInspectionChecklist);
router.post("/:id/complete", canWrite, finishInspection);
router.post("/:id/cancel", canWrite, cancelNewInspection);

export default router;
