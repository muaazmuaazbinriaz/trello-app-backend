const AutomationRule = require("../models/automation.model");
const createRule = async (req, res) => {
  try {
    const { trigger, action, conditions, destination, by } = req.body;
    const { boardId } = req.body;

    if (!boardId) {
      return res
        .status(400)
        .json({ success: false, message: "boardId is required" });
    }

    const rule = await AutomationRule.create({
      trigger,
      action,
      conditions,
      destination,
      by,
      boardId,
    });

    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
module.exports = { createRule };
