const Note = require("../models/notes.model");

let noteInsert = async (req, res) => {
  try {
    const { title, body, createdAt, updatedAt } = req.body;
    const note = new Note({ title, body, createdAt, updatedAt });
    const savedNote = await note.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

let getNotes = async (req, res) => {
  try {
    const allNotes = await Note.find();
    res.json(allNotes);
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

let deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ status: 0, message: "Note not found" });
    }

    res.json({ status: 1, message: "Note deleted successfully", deletedNote });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ status: 0, message: "Note not found" });
    }

    res.json({ status: 1, message: "Note updated", updatedNote });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

module.exports = { noteInsert, getNotes, deleteNote, updateNote };
