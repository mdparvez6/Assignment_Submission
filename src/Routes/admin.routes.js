import express from "express";
import {
  registerUser,
  loginUser,
  assignmentAccepted,
  assignmentRejected,
  viewAssignments,
} from "../Controllers/admin.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/assignments", verifyJWT("admin"), viewAssignments);

router.post("/assignments/:id/accept", verifyJWT("admin"), assignmentAccepted);

router.post("/assignments/:id/reject", verifyJWT("admin"), assignmentRejected);

export default router;
