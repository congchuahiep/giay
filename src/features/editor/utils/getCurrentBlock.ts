import type { ElementBlock } from "@/features/editor/types/block";
import { Editor } from "slate";

export default function getCurrentBlock(editor: Editor): ElementBlock | null {
  const blockEntry = editor.getCurrentBlockEntry();

  return blockEntry ? blockEntry[0] : null;
}
