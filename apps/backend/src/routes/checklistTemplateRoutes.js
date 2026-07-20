import { Router } from "express";
import { createChecklistTemplate } from "../controllers/checklistTemplateController.js";

const router = Router();

router.post("/", createChecklistTemplate);

export default router;