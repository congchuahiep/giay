import type { SafeMenuPlacement } from "@/types";
import { calculateSafeMenuPlacement } from "@/utils";
import { Editor } from "slate";

export default function handleOpenSlashMenu(
  editor: Editor,
  openSlashCommand: (position: SafeMenuPlacement | undefined, anchorOffset: number) => void,
  slashRef: React.RefObject<HTMLDivElement | null>,
  slashContainerRef: React.RefObject<HTMLDivElement | null>
): boolean {
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
  if (
    domSelection &&
    domSelection.rangeCount > 0 &&
    slashRef.current &&
    slashContainerRef.current
  ) {
    const range = domSelection.getRangeAt(0);
    const cursorRect = range.getBoundingClientRect();

    const currentElement = slashRef.current;
    const scrollContainer = slashContainerRef.current;
    const scrollContainerRect = scrollContainer.getBoundingClientRect();

    const safePosition = calculateSafeMenuPlacement(
      cursorRect,
      scrollContainerRect
    );

    currentElement.style.left = `${safePosition.position.x}px`;
    currentElement.style.top = `${safePosition.position.y}px`;
    scrollContainer.style.maxHeight = `${safePosition.dimensions.height}px`;

    openSlashCommand(safePosition, anchorOffset);
  } else {
    openSlashCommand(undefined, anchorOffset);
  }
  return true;
}
