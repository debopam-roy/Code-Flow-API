const User = require("../models/User.Model");
const ApiError = require("../utils/ApiError");

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = User.findById(user_id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong during generating tokens.");
  }
};

const register = async (username, fullname, email, password) => {
  const isUserPresent = await User.findOne({ $or: [{ username }, { email }] });
  if (isUserPresent) {
    throw new ApiError(
      409,
      "User already present with same email or username."
    );
  }
  const user = await User.create({
    username,
    fullname,
    email,
    password,
  }).select("-password");
  if (!user) {
    throw new ApiError(500, "Internal server error during registration.");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  return { user: loggedInUser, accessToken, refreshToken };
};

const login = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "user not found.");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Internal server error occured during login.");
  }
  return { user: loggedInUser, accessToken, refreshToken };
};

const logout = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User doesn't exist.");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  return {};
};

module.exports = { register, login, logout };
