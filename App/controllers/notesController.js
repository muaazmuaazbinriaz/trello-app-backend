const Note = require("../models/notes.model");

const noteInsert = async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = new Note({ title, body, userId: req.user._id });
    const savedNote = await note.save();
    res
      .status(201)
      .json({ success: true, message: "Note added", data: savedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deletedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted", data: deletedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note updated", data: updatedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { noteInsert, getNotes, deleteNote, updateNote };
