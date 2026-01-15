const express = require("express");

const listRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const {
  createList,
  getLists,
  deleteList,
} = require("../controllers/listController");

listRouter.post("/", ensureAuthenticated, createList);
listRouter.get("/", ensureAuthenticated, getLists);
listRouter.delete("/:id", ensureAuthenticated, deleteList);

module.exports = listRouter;
