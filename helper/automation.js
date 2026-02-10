const AutomationRule = require("../App/models/automation.model");
const listModel = require("../App/models/list.model");
const Note = require("../App/models/notes.model");

const applyAutomation = async (trigger, note, io) => {
  try {
    const rules = await AutomationRule.find({ trigger });
    for (const rule of rules) {
      const requiredTag = rule.conditions.get("tag");
      if (requiredTag && note.tags.includes(requiredTag)) {
        const destinationList = await listModel.findOne({
          title: rule.destination,
        });
        if (destinationList) {
          const currentList = await listModel.findById(note.listId);
          if (
            currentList.boardId.toString() !==
            destinationList.boardId.toString()
          ) {
            console.warn("Automation attempted to move note across boards");
            continue;
          }
          const oldListId = note.listId;
          const notesInDestination = await Note.countDocuments({
            listId: destinationList._id,
          });

          note.listId = destinationList._id;
          note.position = notesInDestination;
          await note.save();

          io.to(destinationList.boardId.toString()).emit("note-moved", {
            ...note.toObject(),
            oldListId: oldListId.toString(),
            listId: note.listId.toString(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Automation error:", error);
  }
};

module.exports = applyAutomation;
