import express from "express";
import { submitResearch } from "../controllers/researchController.js";

const router = express.Router();

router.post("/", submitResearch);

export default router;
