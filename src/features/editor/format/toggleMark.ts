import { Editor } from "slate";
import type { MarkType } from "@/features/editor/types/leaf";

export default function toggleMark(editor: Editor, format: MarkType) {
  const isActive = editor.isMarkActive(format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
