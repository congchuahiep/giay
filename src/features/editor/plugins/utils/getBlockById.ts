import type { ElementBlock } from "@/features/editor/types/block.ts";
import { Editor } from "slate";

export default function getBlockByid(
  editor: Editor,
  id: string
): ElementBlock | undefined {
  const blockEntry = editor.getBlockEntryById(id);

  return blockEntry ? blockEntry[0] : undefined;
}
