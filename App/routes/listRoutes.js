const express = require("express");

const listRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const { createList, getLists } = require("../controllers/listController");

listRouter.post("/", ensureAuthenticated, createList);

listRouter.get("/", ensureAuthenticated, getLists);

module.exports = listRouter;
