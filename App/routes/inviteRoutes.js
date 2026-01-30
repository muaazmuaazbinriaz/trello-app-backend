const express = require("express");
const ensureAuthenticated = require("../middlewares/auth");
const { createInvite } = require("../controllers/inviteController");
const inviteRouter = express.Router;

inviteRouter.post("/createInvite", ensureAuthenticated, createInvite);

module.exports = inviteRouter;
