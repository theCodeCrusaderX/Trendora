//register

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //we use validateBeforeSave = false because when we save this new entry in db the mongoose shema will through an error and says required fields must be require before saving new entry on user object therefore we set it to false

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res.json(new ApiResponse(400, "All fields are required")); //i can also have apiError here as we did in our prv project but since we have to return data so we are returning apiResponse
  }

  const exsistedUser = await User.findOne({ email });

  if (exsistedUser) return res.json(new ApiResponse(400, "user already exist"));

  const createUser = await User.create({
    name,
    email,
    password,
  });

  if (!createUser) {
    throw new ApiError(400, "error while creating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.json(new ApiResponse(400, "all fields are required!"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json(new ApiResponse(400, "user not found!"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.json(new ApiResponse(400, "incorrect password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    secure: true,           // Must be true for HTTPS
    sameSite: 'None',       // Required for cross-site cookies
    path: '/',
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {

  console.log("hello");
  

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
        accessToken: undefined
      },
    },
    {
      new: true,
    }
  );
  

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const checkAuth = asyncHandler(async (req,res) => {
  return res.status(200).json(new ApiResponse(200,req.user))
})


const guestLogin = asyncHandler(async (req, res) => {
  // Create a temporary guest user
  const guestUser = new User({
    name: `user_${Date.now()}`,
    email: `guest_${Date.now()}@example.com`, // Unique email
    password: "guest", // Not used, but required for schema validation
    role: "guest", // Optional: You can define limited access based on role
  });

  // Save the guest user to the database
  await guestUser.save();

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    guestUser._id
  );

  // Remove sensitive info
  const loggedInGuest = await User.findById(guestUser._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days expiry
    sameSite: "None",
    // domain : "trendora-backend-uonr.onrender.com"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInGuest,
          accessToken,
          refreshToken,
        },
        "Guest logged in successfully"
      )
    );
});


export { registerUser, loginUser, logOut,checkAuth,guestLogin };
