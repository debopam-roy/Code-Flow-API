const express = require("express");
const editorInitialize = require("../controllers/Editor.Controller");
const editorRouter = express.Router();

editorRouter.get("/", editorInitialize);

module.exports = editorRouter;
