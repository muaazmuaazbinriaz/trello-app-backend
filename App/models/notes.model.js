let mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lists",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let notes = mongoose.model("notes", noteSchema);
module.exports = notes;
