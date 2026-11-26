import express from "express";

import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  actions,
  insights,
  patchResponse,
  patchUser,
  responses,
  users,
} from "../controllers/directorController.js";

const router = express.Router();

// Area restrita a diretoria; ADMIN tambem pode auditar.
router.use(authorizeRoles("DIRECTOR", "ADMIN"));

router.get("/responses", responses);
router.get("/insights", insights);
router.get("/users", users);
router.get("/actions", actions);
router.patch("/users/:id", patchUser);
router.patch("/responses/:id", patchResponse);

export default router;
