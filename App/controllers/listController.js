const List = require("../models/list.model");
const Note = require("../models/notes.model");
const boardModel = require("../models/board.model");

const createList = async (req, res) => {
  try {
    const { position, title, boardId } = req.body;
    if (!title || !boardId) {
      return res
        .status(400)
        .json({ success: false, message: "Title and boardId are required" });
    }
    const board = await boardModel.findById(boardId);
    if (!board) {
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    }
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to add lists" });
    }
    const list = new List({
      title,
      position,
      boardId,
    });
    const savedList = await list.save();
    res.status(201).json({ success: true, data: savedList });
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLists = async (req, res) => {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: "boardId is required" });
    }
    const board = await boardModel.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to view lists" });
    }
    const lists = await List.find({ boardId }).sort({ position: 1 });
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }
    const board = await boardModel.findById(list.boardId);
    const isAuthorized =
      board.ownerId.toString() === req.user._id.toString() ||
      board.members.includes(req.user._id);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete list" });
    }
    await Note.deleteMany({ listId: id });
    await List.deleteOne({ _id: id });
    res.json({ success: true, message: "List and its notes deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const reorderList = async (req, res) => {
  try {
    const { lists } = req.body;
    if (!Array.isArray(lists)) {
      return res
        .status(400)
        .json({ success: false, message: "Lists must be an array" });
    }
    if (lists.length > 0) {
      const firstList = await List.findById(lists[0].id);
      if (firstList) {
        const board = await boardModel.findById(firstList.boardId);
        const isAuthorized =
          board.ownerId.toString() === req.user._id.toString() ||
          board.members.includes(req.user._id);
        if (!isAuthorized) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to reorder lists",
          });
        }
      }
    }
    await Promise.all(
      lists.map(({ id, position }) =>
        List.updateOne({ _id: id }, { $set: { position } }),
      ),
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Reorder error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createList, getLists, deleteList, reorderList };
