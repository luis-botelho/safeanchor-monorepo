import express from "express";
import {
  getVessels,
  getVessel,
  createNewVessel
} from "../controllers/vesselController.js";

const router = express.Router();

router.get("/", getVessels);
router.post("/", createNewVessel);
router.get("/:id", getVessel);

export default router;