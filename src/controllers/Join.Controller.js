const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getUserName = (req, res) => {
  const user = req.cookies?.user;

  if (!user) {
    throw new ApiError(400, "Error occurred during initializing the editor.");
  }

  res.status(200).json(new ApiResponse(200, { fullName: user?.full_name }));
};

module.exports = getUserName;
