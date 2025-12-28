let express = require("express");
let noteRouter = express.Router();

const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/notesController");

noteRouter.get("/", (req, res) => {
  res.send("Notes API root");
});
noteRouter.post("/insert", noteInsert);
noteRouter.get("/getNotes", getNotes);
noteRouter.delete("/deleteNote/:id", deleteNote);
noteRouter.put("/updateNote/:id", updateNote);

module.exports = noteRouter;
