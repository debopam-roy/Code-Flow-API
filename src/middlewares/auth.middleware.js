const jwt = require("jsonwebtoken");
const User = require("../models/User.Model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access.");
    }
    const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid web token.", e);
  }
});

module.exports = verifyJWT;
