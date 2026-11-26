import { Router } from "express";
import { createChecklistTemplate, listChecklistTemplates} from "../controllers/checklistTemplateController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.get("/", listChecklistTemplates);
router.post("/", authorizeRoles("USER", "MANAGER", "ADMIN"), createChecklistTemplate);

export default router;