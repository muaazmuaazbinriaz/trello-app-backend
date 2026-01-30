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

// const { v4: uuidv4 } = require("uuid");
// const boardModel = require("../models/board.model");
// const inviteModel = require("../models/invite.model");

// const createInvite = async (req, res) => {
//   try {
//     const { boardId, email } = req.body;

//     // Validate inputs
//     if (!boardId || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Board ID and email are required",
//       });
//     }

//     // Check if board exists and user has access
//     const board = await boardModel.findById(boardId);
//     if (!board) {
//       return res.status(404).json({
//         success: false,
//         message: "Board not found",
//       });
//     }

//     const isOwner = board.ownerId.toString() === req.user._id.toString();
//     const isMember = board.members.some(
//       (memberId) => memberId.toString() === req.user._id.toString(),
//     );

//     if (!isOwner && !isMember) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to invite members to this board",
//       });
//     }

//     const inviteId = uuidv4();
//     const invite = new inviteModel({
//       inviteId,
//       boardId,
//       email: email.trim(),
//     });
//     await invite.save();

//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
//     const link = `${frontendUrl}/signup?inviteId=${inviteId}`;

//     res.json({ success: true, link, inviteId });
//   } catch (err) {
//     console.error("Create invite error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const acceptInvite = async (req, res) => {
//   try {
//     const { inviteId } = req.body;
//     const userId = req.user._id;

//     if (!inviteId) {
//       return res.status(400).json({
//         success: false,
//         message: "Invite ID is required",
//       });
//     }

//     // Find unused invite
//     const invite = await inviteModel.findOne({
//       inviteId,
//       used: false,
//     });

//     if (!invite) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired invite",
//       });
//     }

//     // Verify email matches
//     if (invite.email !== req.user.email) {
//       return res.status(403).json({
//         success: false,
//         message: "This invite is not for your account",
//       });
//     }

//     // Find board
//     const board = await boardModel.findById(invite.boardId);
//     if (!board) {
//       return res.status(404).json({
//         success: false,
//         message: "Board not found",
//       });
//     }

//     // Check if already a member
//     const alreadyMember =
//       board.ownerId.toString() === userId.toString() ||
//       board.members.some((m) => m.toString() === userId.toString());

//     if (alreadyMember) {
//       // Mark invite as used even if already a member
//       invite.used = true;
//       await invite.save();

//       return res.json({
//         success: true,
//         message: "You are already a member of this board",
//         boardId: board._id,
//       });
//     }

//     // Add user to board
//     board.members.push(userId);
//     await board.save();

//     // Mark invite as used
//     invite.used = true;
//     await invite.save();

//     res.json({
//       success: true,
//       message: "Board joined successfully",
//       boardId: board._id,
//     });
//   } catch (err) {
//     console.error("Accept invite error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// module.exports = { createInvite, acceptInvite };
