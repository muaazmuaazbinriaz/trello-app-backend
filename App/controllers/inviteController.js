const { v4: uuidv4 } = require("uuid");
const boardModel = require("../models/board.model");
const inviteModel = require("../models/invite.model");
const createInvite = async (req, res) => {
  try {
    const { boardId, email } = req.body;
    const inviteId = uuidv4();
    const invite = new inviteModel({
      inviteId,
      boardId,
      email,
    });
    await invite.save();
    const frontendUrl = process.env.FRONTEND_URL;
    const link = `${frontendUrl}/signup?inviteId=${inviteId}`;
    res.json({ success: true, link });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.body;
    const userId = req.user._id;

    const invite = await inviteModel.findOne({
      inviteId,
      used: false,
    });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invite",
      });
    }

    if (invite.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "This invite is not for your account",
      });
    }

    const board = await boardModel.findById(invite.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const alreadyMember =
      board.ownerId.toString() === userId.toString() ||
      board.members.some((m) => m.toString() === userId.toString());

    if (!alreadyMember) {
      board.members.push(userId);
      await board.save();
    }

    invite.used = true;
    await invite.save();

    res.json({
      success: true,
      message: "Board joined successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInvite, acceptInvite };
