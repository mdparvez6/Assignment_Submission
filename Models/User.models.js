import mongoose, { schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: { type: String, enum: ["user", "admin"], required: true },
});

export const user = mongoose.model("User", userSchema);
