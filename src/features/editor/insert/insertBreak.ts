import { Editor } from "slate";

export default function insertBreak(editor: Editor) {
  const currentBlockType = editor.getCurrentBlockType();

  switch (currentBlockType) {
    case "bulletList":
    case "checkList":
      editor.insertBlockAndBreak(currentBlockType);
      break;
    case "code":
      editor.insertText("\n");
      break;
    default:
      editor.insertBlockAndBreak();
  }
}
