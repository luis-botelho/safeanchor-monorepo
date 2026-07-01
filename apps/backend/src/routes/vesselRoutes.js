import express from "express";
import {
  getVessels,
  getVessel,
  createNewVessel,
  updateVesselController,
} from "../controllers/vesselController.js";

const router = express.Router();

router.get("/", getVessels);
router.post("/", createNewVessel);
router.get("/:id", getVessel);
router.put("/:id", updateVesselController)

export default router;