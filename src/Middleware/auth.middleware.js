import { User } from "../Models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = (role) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      console.log(token);

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      console.log(user);
      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
      if (user.role !== role) {
        throw new ApiError(403, "Unauthorized role");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message);
    }
  });
