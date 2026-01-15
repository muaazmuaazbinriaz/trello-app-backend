const List = require("../models/list.model");
const Note = require("../models/notes.model");

const createList = async (req, res) => {
  try {
    const { title } = req.body;
    const list = new List({ title, userId: req.user._id });
    const savedList = await list.save();
    res.status(201).json({ success: true, data: savedList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user._id }).sort({
      createdAt: 1,
    });
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findOne({ _id: id, userId: req.user._id });
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }
    await Note.deleteMany({ listId: id, userId: req.user._id });
    await List.deleteOne({ _id: id });
    res.json({ success: true, message: "List and its notes deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createList, getLists, deleteList };
