const express = require("express");
const ensureAuthenticated = require("../middlewares/auth");
const {
  createBoard,
  getBoards,
  inviteBoardMember,
  getBoardById,
} = require("../controllers/boardsController");
const boardRouter = express.Router();

boardRouter.post("/create", ensureAuthenticated, createBoard);
boardRouter.get("/getBoards", ensureAuthenticated, getBoards);
boardRouter.post("/:id/invite", ensureAuthenticated, inviteBoardMember);
boardRouter.get("/:id", ensureAuthenticated, getBoardById);

module.exports = boardRouter;
