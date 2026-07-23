import { Router } from "express";
import { createChecklistTemplate, listChecklistTemplates} from "../controllers/checklistTemplateController.js";

const router = Router();

router.get("/", listChecklistTemplates);
router.post("/", createChecklistTemplate);

export default router;