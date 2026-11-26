import { Router } from "express";

import {
  createNewDocument,
  listDocuments,
  listDocumentsByVessel,
} from "../controllers/documentController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

router.get("/", listDocuments);
router.get("/vessel/:vesselId", listDocumentsByVessel);
router.post("/", authorizeRoles("USER", "MANAGER", "ADMIN"), createNewDocument);

export default router;
