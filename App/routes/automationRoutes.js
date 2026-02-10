const express = require("express");
const ensureAuthenticated = require("../middlewares/auth");
const { createRule } = require("../controllers/automationController");
const automationRouter = express.Router();

automationRouter.post("/", ensureAuthenticated, createRule);

module.exports = automationRouter;
