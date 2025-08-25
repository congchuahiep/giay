import type { ElementBlock } from "@/features/editor/types/block";
import { Editor } from "slate";

export default function getLastBlock(editor: Editor): ElementBlock | undefined {
  const blockEntry = editor.getLastBlockEntry();
  return blockEntry ? blockEntry[0] : undefined;
}
