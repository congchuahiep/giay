import { Editor, Path } from "slate";

export default function getLastBlockPath(editor: Editor): Path | undefined {
  const blockEntry = editor.getLastBlockEntry();
  return blockEntry ? blockEntry[1] : undefined;
}
