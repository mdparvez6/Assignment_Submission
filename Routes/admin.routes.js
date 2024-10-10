import express from "express";
import {
  registerUser,
  loginUser,
  assignmentAccepted,
  assignmentRejected,
} from "../Controllers/admin.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/assignments/:id/accept", verifyJWT("admin"), assignmentAccepted);

router.get("/assignment/:id/reject", verifyJWT("admin"), assignmentRejected);

export default router;
