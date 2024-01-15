const express = require("express");
const getUserName = require("../controllers/Join.Controller");
const verifyJWT = require("../middlewares/auth.middleware");
const joinRouter = express.Router();

joinRouter.route("/").get(verifyJWT, getUserName);
module.exports = joinRouter;
