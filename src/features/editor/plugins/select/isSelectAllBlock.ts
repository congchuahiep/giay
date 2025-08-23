import { Editor, Range } from "slate";

export default function isSelectAllBlock(editor: Editor) {
  const { selection } = editor;
  if (!selection) return false;

  const start = Editor.start(editor, []);
  const end = Editor.end(editor, []);

  return Range.equals({ anchor: start, focus: end }, selection);
}
