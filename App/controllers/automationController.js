const AutomationRule = require("../models/automation.model");

const createRule = async (req, res) => {
  try {
    const rule = await AutomationRule.create(req.body);
    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createRule };
