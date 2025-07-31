import type { BlockType } from "@/features/editor/types";

import { Editor, Path, Transforms } from "slate";

export default function insertBlock(
  editor: Editor,
  blockType: BlockType,
  additionalProps: Record<string, any> = {}
): boolean {
  // Lấy path của block hiện tại
  const currentBlockPath = editor.getCurrentBlockPath();
  if (!currentBlockPath) return false;

  // Xác định vị trí cần đặt block mới
  const nextBlockPath = Path.next(currentBlockPath);

  // Tạo block mới dựa trên type
  const block = editor.buildBlock(blockType, additionalProps);

  // Chèn block vào editor
  Transforms.insertNodes(editor, block, { at: nextBlockPath });
  Transforms.select(editor, Editor.start(editor, nextBlockPath));

  return true;
}
