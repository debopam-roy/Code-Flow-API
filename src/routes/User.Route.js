const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
} = require("../controllers/User.Controller");
const verifyJWT = require("../middlewares/auth.middleware");

userRouter.post("/login", loginUser);

userRouter.post("/register", registerUser);

userRouter.route("/logout").get(verifyJWT, logoutUser);

module.exports = userRouter;
