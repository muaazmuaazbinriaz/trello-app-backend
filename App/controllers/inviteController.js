import { v4 as uuidv4 } from "uuid";
import Invite from "../models/invite.model.js";
exports.createInvite = async (req, res) => {
  try {
    const { boardId, email } = req.body;
    const inviteId = uuidv4();
    const invite = new Invite({
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
