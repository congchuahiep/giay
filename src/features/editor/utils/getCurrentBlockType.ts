import type { BlockType } from "@/features/editor/types";
import { Editor, Element } from "slate";

export default function getCurrentBlockType(editor: Editor): BlockType | null {
  const { selection } = editor;
  if (!selection) return null;

  // Tìm node tổ tiên gần nhất của con trỏ mà là block element
  const [block] =
    Editor.above(editor, {
      match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    }) ?? [];

  if (block && Element.isElement(block)) {
    return block.type;
  }

  return null;
}
