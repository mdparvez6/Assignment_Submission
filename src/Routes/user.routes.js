import express from "express";
import {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
} from "../Controllers/user.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/upload", verifyJWT("user"), uploadAssignment);

router.get("/admins", getAllAdmins);

export default router;
