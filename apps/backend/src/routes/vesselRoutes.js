import express from "express";
import { getVessels } from "../controllers/vesselController.js";

const router = express.Router();

router.get("/", getVessels);

export default router;