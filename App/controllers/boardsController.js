const boardModel = require("../models/board.model");
const inviteModel = require("../models/invite.model");
const UserModel = require("../models/user.model");
const { sendBoardInvite } = require("../services/emailService");
const { v4: uuidv4 } = require("uuid");

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    const ownerId = req.user._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const board = new boardModel({
      title: title.trim(),
      ownerId,
    });
    const saveBoard = await board.save();
    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: saveBoard,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const boards = await boardModel
      .find({
        $or: [{ ownerId: req.user._id }, { members: req.user._id }],
      })
      .sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: boards,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await boardModel
      .findById(req.params.id)
      .populate("ownerId", "name email")
      .populate("members", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const hasAccess =
      board.ownerId._id.toString() === req.user._id.toString() ||
      board.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json({ success: true, data: board });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const inviteBoardMember = async (req, res) => {
  try {
    const { email } = req.body;
    const boardId = req.params.id;
    const board = await boardModel.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const isOwner = board.ownerId.toString() === req.user._id.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    const isAuthorized = isOwner || isMember;
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const inviteId = uuidv4();
    const invite = new inviteModel({ inviteId, boardId, email });
    await invite.save();
    await sendBoardInvite(email, board.title, inviteId);
    const invitedUser = await UserModel.findOne({ email: email.trim() });
    if (invitedUser) {
      const isAlreadyMember =
        board.ownerId.toString() === invitedUser._id.toString() ||
        board.members.some((m) => m.toString() === invitedUser._id.toString());
      if (!isAlreadyMember) {
        board.members.push(invitedUser._id);
        await board.save();
      }
    }
    res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ message: "Failed to send invite" });
  }
};

module.exports = { createBoard, getBoards, inviteBoardMember, getBoardById };
