const express = require("express");
const editorInitialize = require("../controllers/Editor.Controller");
const socketIO = require("socket.io");

const editorRouter = express.Router();

editorRouter.get("/", (req, res) => {
  editorInitialize(req, res, req.app.get("server"));
});

module.exports = editorRouter;
