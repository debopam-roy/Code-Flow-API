const express = require("express");
const userRouter = require("./routes/User.Route");
const joinRouter = require("./routes/Join.Route");
const editorRouter = require("./routes/Editor.Route");
const http = require("http");

const privateRouter = express.Router();

privateRouter.use("/user", userRouter);
privateRouter.use("/join", joinRouter);
privateRouter.use("/editor", editorRouter);

module.exports = privateRouter;
