import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import {verifyAccessToken, verifyAccessTokenAndAdmin, verifyAccessTokenAndAuthorization} from "../middlewares/verifyAccessToken.js"


const router = express.Router();

router.get("/all",verifyAccessTokenAndAdmin, getUsers);
router.get("/:id",verifyAccessTokenAndAdmin, getUser);
router.put("/:id",verifyAccessTokenAndAuthorization, updateUser);
router.delete("/:id",verifyAccessTokenAndAuthorization,deleteUser);

export default router;
