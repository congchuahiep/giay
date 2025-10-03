import type { ElementBlock } from "@/features/editor/types/block";
import { Editor, type NodeEntry } from "slate";

export default function getLastBlockEntry(
  editor: Editor
): NodeEntry<ElementBlock> | undefined {
  const blockPoint = Editor.end(editor, []);
  return Editor.above(editor, { at: blockPoint });
}
