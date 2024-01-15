const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { login, register } = require("../services/User.Service");

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  if (
    [username, fullname, email, password].some((item) => item.trim() === "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }
  const { user, accessToken, refreshToken } = await register(
    username,
    fullname,
    email,
    password
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(201)
    .cookies("user", user, cookieOptions)
    .cookies("accessToken", accessToken, cookieOptions)
    .cookies("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "User successfully registered."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((item) => item.trim() === "")) {
    throw new ApiError(400, "All the fields are required.");
  }

  const { user, accessToken, refreshToken } = await login(username, password);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookies("user", user, cookieOptions)
    .cookies("accessToken", accessToken, cookieOptions)
    .cookies("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "User successfully loggedIn."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.cookies.user || req.body.user;
  const user_id = user._id;
  await logout(user_id);
  const cookieOption = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("user", cookieOption)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(new ApiResponse(200, {}, "user logged out successfully."));
});

module.exports = { loginUser, registerUser, logoutUser };
