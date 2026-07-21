import { Router } from "express";
import {
  createChecklistExecution,
  listChecklistExecutions,
} from "../controllers/checklistExecutionController.js";

const router = Router();

router.get("/", listChecklistExecutions);
router.post("/", createChecklistExecution);

export default router;
