import express from "express";
import {
  changeStatus,
  countRequest,
  createWasteRequest,
  deleteWasteRequest,
  getAllWasteRequest,
  getWasteRequestStats,
  latestRequest,
  updateWasteRequest,
} from "../controllers/wasteRequest.controller.js";

import {
  verifyAccessToken,
  verifyAccessTokenAndAdmin,
} from "../middlewares/verifyAccessToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken, createWasteRequest);
router.get("/all", verifyAccessToken, getAllWasteRequest);
router.put("/update/:id", verifyAccessToken, updateWasteRequest);
router.delete("/delete/:id", verifyAccessTokenAndAdmin, deleteWasteRequest);
router.put("/verify/:id", changeStatus);
router.get("/", verifyAccessTokenAndAdmin, countRequest);
router.get("/stat", verifyAccessTokenAndAdmin, getWasteRequestStats);
router.get("/latest", verifyAccessToken, latestRequest);
export default router;
