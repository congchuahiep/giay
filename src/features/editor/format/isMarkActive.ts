import type { MarkType } from "@/features/editor/types";
import { Editor } from "slate";

export default function isMarkActive(editor: Editor, format: MarkType) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}
