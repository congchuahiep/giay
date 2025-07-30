import slashMenuManager from "@/features/editor/slash-command/SlashCommandManager";
import { Editor } from "slate";

export default function handleOpenSlashCommand(editor: Editor): boolean {
  const { selection } = editor;

  if (!selection) return false;

  // Đi tìm ký tự đằng trước đó
  let beforeChar;
  const beforeText = Editor.before(editor, selection.anchor, {
    unit: "character",
  });
  beforeChar = beforeText
    ? Editor.string(editor, {
        anchor: beforeText,
        focus: selection.anchor,
      })
    : "";

  // Chỉ cho phép mở menu khi đang ở đầu block hoặc sau space
  if (beforeChar !== "" && beforeChar !== " ") return false;

  // Lưu vị trí anchor (offset sau ký tự "/")
  const anchorOffset = selection.anchor.offset;

  // Tính toán vị trí menu dựa trên cursor position
  const domSelection = window.getSelection();
  if (domSelection && domSelection.rangeCount > 0) {
    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.bottom + 4, // Offset một chút để không che cursor
    };

    slashMenuManager.open(position, anchorOffset);
  } else {
    slashMenuManager.open(undefined, anchorOffset);
  }
  return true;
}
