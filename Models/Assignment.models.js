import mongoose from "mongoose";
import { User } from "./User.models";

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  admninId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submissionTime: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
