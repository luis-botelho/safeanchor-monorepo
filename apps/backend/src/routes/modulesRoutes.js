import { Router } from "express";
import { listModules } from "../controllers/modulesController.js";

export const modulesRouter = Router();

modulesRouter.get("/", listModules);
