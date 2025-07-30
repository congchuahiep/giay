import type { KeyboardEvent } from "react";
import { Editor, Element, Range, Transforms } from "slate";

export default function handleDividerShortcut(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;

  if (
    !selection ||
    !Range.isCollapsed(selection) ||
    selection.anchor.offset >= 3
  ) {
    return false;
  }

  const [blockEntry] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  if (!blockEntry) return false;

  const [, path] = blockEntry;
  const text = Editor.string(editor, path);

  if (text === "--") {
    event.preventDefault();

    // Xóa text "---"
    const start = Editor.start(editor, path);
    const fullRange = {
      anchor: start,
      focus: { ...selection.anchor, offset: selection.anchor.offset + 1 },
    };

    Transforms.select(editor, fullRange);
    Transforms.delete(editor);

    // Tạo divider
    Transforms.setNodes(editor, { type: "divider" });

    // Di chuyển cursor
    const nextPath = [path[0] + 1];
    if (Editor.hasPath(editor, nextPath)) {
      Transforms.select(editor, Editor.start(editor, nextPath));
    } else {
      Transforms.insertNodes(
        editor,
        { type: "paragraph", children: [{ text: "" }] },
        { at: nextPath }
      );
      Transforms.select(editor, Editor.start(editor, nextPath));
    }

    return true;
  }

  return false;
}
