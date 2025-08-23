import { Editor } from "slate";

export default function getBlockContentById(
  editor: Editor,
  id: string
): string | undefined {
  const path = editor.getBlockPathById(id);

  return path ? editor.string(path) : undefined;
}
