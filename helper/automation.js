const AutomationRule = require("../App/models/automation.model");
const listModel = require("../App/models/list.model");
const Note = require("../App/models/notes.model");

const applyAutomation = async (trigger, note, io) => {
  try {
    const rules = await AutomationRule.find({ trigger });
    const originalListId = note.listId.toString();

    for (const rule of rules) {
      const requiredTag = rule.conditions.get("tag");
      if (!requiredTag || !note.tags.includes(requiredTag)) continue;
      if (rule.action === "move") {
        const destinationList = await listModel.findOne({
          title: rule.destination,
        });

        if (!destinationList) continue;
        const currentList = await listModel.findById(originalListId);
        if (!currentList) continue;
        if (
          currentList.boardId.toString() !== destinationList.boardId.toString()
        ) {
          console.warn("Automation attempted to move note across boards");
          continue;
        }

        if (originalListId === destinationList._id.toString()) continue;
        const notesInDestination = await Note.countDocuments({
          listId: destinationList._id,
        });

        const oldListId = originalListId;
        note.listId = destinationList._id;
        note.position = notesInDestination;
        await note.save();

        io.to(destinationList.boardId.toString()).emit("note-moved", {
          ...note.toObject(),
          oldListId: oldListId,
          listId: note.listId.toString(),
        });
      }

      if (rule.action === "sortBy") {
        const currentList = await listModel.findById(originalListId);
        if (!currentList) continue;
        const notesInList = await Note.find({ listId: originalListId });

        let sortedNotes;
        switch (rule.by) {
          case "createdAt":
            sortedNotes = [...notesInList].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            break;
          case "name":
            sortedNotes = [...notesInList].sort((a, b) =>
              a.title.localeCompare(b.title),
            );
            break;
          case "position":
            sortedNotes = [...notesInList].sort(
              (a, b) => a.position - b.position,
            );
            break;
          default:
            sortedNotes = [...notesInList];
        }

        const bulkOps = sortedNotes.map((n, index) => ({
          updateOne: {
            filter: { _id: n._id },
            update: { position: index },
          },
        }));

        await Note.bulkWrite(bulkOps);

        io.to(currentList.boardId.toString()).emit("notes-sorted", {
          listId: originalListId,
          sortedNote: sortedNotes.map((n, index) => ({
            _id: n._id.toString(),
            position: index,
          })),
          sortBy: rule.by,
        });
      }
    }
  } catch (error) {
    console.error("Automation error:", error);
  }
};

module.exports = applyAutomation;
