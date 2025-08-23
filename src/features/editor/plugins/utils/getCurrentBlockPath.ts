import { Editor, Path } from "slate";

export default function getCurrentBlockPath(editor: Editor): Path | undefined {
  const blockEntry = editor.getCurrentBlockEntry();

  return blockEntry ? blockEntry[1] : undefined;
}
