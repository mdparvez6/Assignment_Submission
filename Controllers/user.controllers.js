import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../Models/User.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Assignment } from "../../Models/Assignment.models.js";

const registerUser = asyncHandler(async (req, res) => {
  // get username, password, role
  // validation - not empty
  // check if user is already registered
  // create user in db
  // check for user creation
  // return res

  const { username, password, role } = req.body;

  if ([username, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne(username);

  if (existedUser) throw new ApiError(409, "User with Username already exists");

  const user = await User.create({
    username,
    password,
    role: "user",
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered Succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //take req.body -> data
  //check if the user is present
  //password check
  const { username, password } = req.body;
  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne(username);

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const loggedInUser = await User.findById(user._id).select("-password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, token },
        "User logged In Successfully"
      )
    );
});

const uploadAssignment = asyncHandler(async (req, res) => {
  // get data from req.body
  // user exist or not
  // take task
  // check if admin is present or not with admin Id
  // create assignment object and save
  const { task, adminId } = req.body;
  try {
    const admin = User.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin does not exist");
    if (!admin.role !== "admin") throw new ApiError(404, "Incorrect Admin Id");
    const assignment = new Assignment({
      userId: req.user._id,
      task,
      adminId: admin._id,
    });
    await assignment.save();
    res
      .status(201)
      .json(
        new ApiResponse(201, assignment, "Successfully Uploaded Assignment")
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const getAllAdmins = asyncHandler(async (req, res) => {
  try {
    const admins = User.find({ role: "admin" }).select("-password");
    res.status(201).json(new ApiResponse(201, admins, "All Admins"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});
export { registerUser, loginUser, uploadAssignment, getAllAdmins };
