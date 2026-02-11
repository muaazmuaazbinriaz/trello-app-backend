const Note = require("../models/notes.model");
const List = require("../models/list.model");
const Board = require("../models/board.model");
const applyAutomation = require("../../helper/automation");

const noteInsert = async (req, res) => {
  try {
    const { title, listId, tags } = req.body;
    if (!listId) {
      return res
        .status(400)
        .json({ success: false, message: "listId is required" });
    }
    const list = await List.findById(listId);
    if (!list)
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    const board = await Board.findById(list.boardId);
    if (!board)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to add notes" });
    }
    const count = await Note.countDocuments({ listId });
    const note = new Note({
      title,
      listId: listId.toString(),
      position: count,
      picture: req.file ? req.file.path : "",
      tags: tags || [],
    });
    const savedNote = await note.save();
    req.app.io.to(board._id.toString()).emit("note-created", {
      ...savedNote.toObject(),
      listId: list._id.toString(),
    });
    res
      .status(201)
      .json({ success: true, message: "Note added", data: savedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const { listId } = req.query;
    if (!listId) return res.status(400).json({ message: "listId is required" });
    const list = await List.findById(listId);
    if (!list)
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    const board = await Board.findById(list.boardId);
    if (!board)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view notes" });
    }
    const notes = await Note.find({ listId }).sort({ position: 1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    const list = await List.findById(note.listId);
    const board = await Board.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view note" });
    }
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    const list = await List.findById(note.listId);
    const board = await Board.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete note" });
    }
    await note.deleteOne();
    req.app.io.to(board._id.toString()).emit("note-deleted", {
      _id: note._id.toString(),
      listId: note.listId.toString(),
    });
    res.json({ success: true, message: "Note deleted", data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, picture, tags } = req.body;
    const note = await Note.findById(id);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    const list = await List.findById(note.listId);
    const board = await Board.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update note" });
    }
    const tagsChanged =
      tags !== undefined && JSON.stringify(note.tags) !== JSON.stringify(tags);
    if (title !== undefined) note.title = title;
    if (body !== undefined) note.body = body;
    if (picture !== undefined) note.picture = picture;
    if (tags !== undefined) note.tags = tags;
    note.updatedAt = Date.now();
    const updatedNote = await note.save();
    req.app.io.to(board._id.toString()).emit("note-updated", {
      ...updatedNote.toObject(),
      listId: list._id.toString(),
    });
    if (tagsChanged) {
      await applyAutomation("tag-verified", updatedNote, req.app.io);
    }
    res.json({ success: true, message: "Note updated", data: updatedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    const list = await List.findById(note.listId);
    const board = await Board.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to upload image" });
    }
    note.picture = req.file.path;
    note.updatedAt = Date.now();
    const updatedNote = await note.save();
    req.app.io.to(board._id.toString()).emit("note-updated", {
      ...updatedNote.toObject(),
      listId: list._id.toString(),
    });
    res.json({ success: true, message: "Image uploaded", data: updatedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const moveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;
    if (!listId || position === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "listId and position are required" });
    }
    const note = await Note.findById(id);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    const list = await List.findById(note.listId);
    const board = await Board.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to move note" });
    }
    await Note.updateMany(
      { listId, position: { $gte: position } },
      { $inc: { position: 1 } },
    );
    note.listId = listId;
    note.position = position;
    note.updatedAt = Date.now();
    await note.save();
    req.app.io.to(board._id.toString()).emit("note-moved", {
      ...note.toObject(),
      oldListId: list._id.toString(),
      listId: note.listId.toString(),
    });
    res.json({ success: true, message: "Note moved", data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  noteInsert,
  getNotes,
  getNoteById,
  deleteNote,
  updateNote,
  moveNote,
  uploadImage,
};
