import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../Models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Assignment } from "../Models/Assignment.models.js";

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
    role: "admin",
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Admin Registered Succesfully"));
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
        { user: loggedInUser },
        "Admin logged In Successfully"
      )
    );
});

const assignmentAccepted = asyncHandler(async (req, res) => {
  //take id from the URL
  //check if the user sent an assignment with that id
  //change the status to accepted
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) throw new ApiError(404, "Assignment not found");

    assignment.status = "Accepted";
    await assignment.save();

    res
      .status(201)
      .json(new ApiResponse(201, assignment, "Accepted Successfully"));
  } catch (error) {
    throw new ApiError(500, `${error}`);
  }
});

const assignmentRejected = asyncHandler(async (req, res) => {
  //take id from the URL
  //check if the user sent an assignment with that id
  //change the status to rejected

  try {
    const assignment = Assignment.findById(req.params.id);
    if (!assignment) throw new ApiError(404, "Assignment not found");
    assignment.status = "Rejected";
    await assignment.save();
    return res.status(
      201,
      new ApiResponse(201, assignment, "Assignment rejected Successfully")
    );
  } catch (error) {
    throw new ApiError(500, `${error}`);
  }
});
export { registerUser, loginUser, assignmentAccepted, assignmentRejected };
