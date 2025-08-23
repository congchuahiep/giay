import type { ElementBlock } from "@/features/editor/types/block.ts";
import { Editor, Element, type NodeEntry } from "slate";

export default function getCurrentBlockEntry(
  editor: Editor
): NodeEntry<ElementBlock> | undefined {
  // Tìm node tổ tiên gần nhất của con trỏ mà là block element
  const blockEntry = Editor.above(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  return blockEntry ? (blockEntry as NodeEntry<ElementBlock>) : undefined;
}
