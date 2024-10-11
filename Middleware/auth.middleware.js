import { User } from "../Models/User.models";
import { ApiError } from "../src/Controllers/utils/ApiError";
import { asyncHandler } from "../src/Controllers/utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = (role) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.header("Authorization");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
      if (user.role !== role) {
        throw new ApiError(403, "Unauthorized role");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });
