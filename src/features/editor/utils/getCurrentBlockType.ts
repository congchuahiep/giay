import type { BlockType } from "@/features/editor/types";
import { Editor } from "slate";

export default function getCurrentBlockType(editor: Editor): BlockType | null {
  const block = editor.getCurrentBlock();

  return block ? block.type : null;
}
