import { Router } from "express";
import {
  createChecklistExecution,
  listChecklistExecutions,
} from "../controllers/checklistExecutionController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.get("/", listChecklistExecutions);
router.post(
  "/",
  authorizeRoles("USER", "MANAGER", "ADMIN"),
  createChecklistExecution,
);

export default router;
