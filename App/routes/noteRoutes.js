const express = require("express");
const noteRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");

const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
  getNoteById,
  moveNote,
  uploadImage,
} = require("../controllers/notesController");
const upload = require("../middlewares/upload");

noteRouter.post("/insert", ensureAuthenticated, noteInsert);
noteRouter.get("/getNotes", ensureAuthenticated, getNotes);
noteRouter.get("/getNoteById/:id", ensureAuthenticated, getNoteById);
noteRouter.delete("/deleteNote/:id", ensureAuthenticated, deleteNote);
noteRouter.put("/updateNote/:id", ensureAuthenticated, updateNote);
noteRouter.put("/move/:id", ensureAuthenticated, moveNote);
noteRouter.post(
  "/uploadImage/:id",
  ensureAuthenticated,
  upload.single("picture"),
  uploadImage,
);
module.exports = noteRouter;
