const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    inviteId: {
      type: String,
      required: true,
      unique: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    email: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invite", inviteSchema);
