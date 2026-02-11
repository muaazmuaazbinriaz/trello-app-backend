const mongoose = require("mongoose");

const automationSchema = new mongoose.Schema(
  {
    trigger: {
      type: String,
      enum: ["new-entry", "tag-verified"],
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    action: {
      type: String,
      enum: ["sortBy", "move"],
      required: true,
    },
    by: {
      type: String,
      enum: ["createdAt", "name", "position", "createdAtDesc", "nameDesc"],
      default: "createdAt",
    },
    conditions: {
      type: Map,
      of: String,
    },
    destination: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const AutomationRule = mongoose.model("automation", automationSchema);
module.exports = AutomationRule;
