import { Editor, Path } from "slate";

export default function getCurrentBlockPath(editor: Editor): Path | null {
  const blockEntry = editor.getCurrentBlockEntry();

  return blockEntry ? blockEntry[1] : null;
}
