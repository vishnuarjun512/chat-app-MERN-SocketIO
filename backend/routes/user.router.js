import express from "express";
import {
  loginUser,
  registerUser,
  signout,
  profile,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", verifyUser, profile);
router.get("/getUsers", getUsers);
router.post("/:userId", verifyUser, getUser);
router.get("/signout", signout);

export default router;
