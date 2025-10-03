import type { ElementBlock } from "@/features/editor/types/block.ts";
import { Editor } from "slate";

export default function getCurrentBlock(
  editor: Editor
): ElementBlock | undefined {
  const blockEntry = editor.getCurrentBlockEntry();

  return blockEntry ? blockEntry[0] : undefined;
}
