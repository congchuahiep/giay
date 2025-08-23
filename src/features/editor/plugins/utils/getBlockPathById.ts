import { Editor, Path } from "slate";

export default function getBlockPathById(
  editor: Editor,
  id: string
): Path | undefined {
  const blockEntry = editor.getBlockEntryById(id);

  return blockEntry ? blockEntry[1] : undefined;
}
