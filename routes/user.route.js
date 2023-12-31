import express from "express";
import {
  countUsers,
  deleteUser,
  getUser,
  getUserStats,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

import {
  verifyAccessTokenAndAdmin,
  verifyAccessTokenAndAuthorization,
} from "../middlewares/verifyAccessToken.js";

const router = express.Router();

router.get("/all", verifyAccessTokenAndAdmin, getUsers);
router.get("/:id", verifyAccessTokenAndAdmin, getUser);
router.put("/:id", verifyAccessTokenAndAuthorization, updateUser);
router.delete("/:id", verifyAccessTokenAndAuthorization, deleteUser);
router.get("/", countUsers);
router.get("/stat",verifyAccessTokenAndAdmin,getUserStats)
export default router;
