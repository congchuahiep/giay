import type { BlockType } from "@/features/editor/types";
import { Editor } from "slate";

export default function getCurrentBlockType(
  editor: Editor
): BlockType | undefined {
  const block = editor.getCurrentBlock();

  return block ? block.type : undefined;
}
