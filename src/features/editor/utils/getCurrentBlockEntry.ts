import type { ElementBlock } from "@/features/editor/types/block";
import { Editor, Element, type NodeEntry } from "slate";

export default function getCurrentBlockEntry(
  editor: Editor
): NodeEntry<ElementBlock> | null {
  // Tìm node tổ tiên gần nhất của con trỏ mà là block element
  const blockEntry = Editor.above(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  return blockEntry ? (blockEntry as NodeEntry<ElementBlock>) : null;
}
