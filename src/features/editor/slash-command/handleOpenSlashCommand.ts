import slashMenuManager from "@/features/editor/slash-command/SlashCommandManager";
import { Editor } from "slate";

export default function handleOpenSlashCommand(editor: Editor): boolean {
  const { selection } = editor;
  let beforeChar;
  if (selection) {
    const beforeText = Editor.before(editor, selection.anchor, {
      unit: "character",
    });
    beforeChar = beforeText
      ? Editor.string(editor, {
          anchor: beforeText,
          focus: selection.anchor,
        })
      : "";
  }

  if (beforeChar !== "" && beforeChar !== " ") return false;

  // Tính toán vị trí menu dựa trên cursor position
  const domSelection = window.getSelection();
  if (domSelection && domSelection.rangeCount > 0) {
    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.bottom + 4, // Offset một chút để không che cursor
    };

    slashMenuManager.open(position);
  } else {
    slashMenuManager.open();
  }
  return true;
}
