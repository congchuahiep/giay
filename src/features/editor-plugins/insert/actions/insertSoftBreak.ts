import type { Editor } from "slate";

export default function insertSoftBreak(editor: Editor) {
  const currentBlockType = editor.getCurrentBlockType();

  switch (currentBlockType) {
    case "code":
      editor.insertBlockAndBreak();
      break;
    default:
      editor.insertText("\n");
  }
}
