import { Editor } from "slate";

export default function getCurrentBlockContent(
  editor: Editor
): string | undefined {
  const path = editor.getCurrentBlockPath();

  return path ? editor.string(path) : undefined;
}
