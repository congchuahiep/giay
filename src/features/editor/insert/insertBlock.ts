import type { InsertBlockConfigProps } from "@/features/editor/insert/inteface";
import type { BlockType } from "@/features/editor/types";

import { Editor, Path, Transforms } from "slate";

/**
 * Chèn một block mới vào editor tại vị trí xác định. Hàm này chỉ thực
 * thi công việc chèn block, chứ không thực hiện việc tách block
 *
 * @param editor - Đối tượng editor hiện tại.
 * @param blockType - Loại block cần chèn.
 * @param configs - Cấu hình cho việc chèn block
 * @param additionalProps - Các thuộc tính bổ sung cho block mới.
 * @returns Trả về `true` nếu chèn thành công, ngược lại trả về `false`.
 */
export default function insertBlock(
  editor: Editor,
  blockType: BlockType,
  configs: InsertBlockConfigProps = { reverse: false },
  additionalProps: Record<string, any> = {}
): boolean {
  // Lấy path của block hiện tại
  const currentBlockPath = editor.getCurrentBlockPath();
  if (!currentBlockPath) return false;

  // Xác định vị trí cần đặt block mới
  let targetBlockPath = configs?.reverse
    ? currentBlockPath
    : Path.next(currentBlockPath);

  // Tạo block mới dựa trên type
  const block = editor.buildBlock(blockType, additionalProps);

  // Chèn block vào editor
  Transforms.insertNodes(editor, block, { at: targetBlockPath });

  if (!configs?.reverse)
    Transforms.select(editor, Editor.start(editor, targetBlockPath));

  return true;
}
