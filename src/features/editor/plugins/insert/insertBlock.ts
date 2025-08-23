import type { InsertBlockConfigProps } from "@/features/editor/plugins/insert/inteface";
import type { ElementBlock } from "@/features/editor/types/block.ts";

import { Editor, Path, Transforms } from "slate";

/**
 * Chèn một block mới vào editor tại vị trí xác định. Hàm này chỉ thực
 * thi công việc chèn block, chứ không thực hiện việc tách block
 *
 * @param editor - Đối tượng editor hiện tại.
 * @param additionalProps - Các thuộc tính bổ sung cho block mới.
 * @param configs - Cấu hình cho việc chèn block
 * @returns Trả về `true` nếu chèn thành công, ngược lại trả về `false`.
 */
export default function insertBlock(
  editor: Editor,
  additionalProps: Partial<ElementBlock> = {},
  configs: InsertBlockConfigProps = { reverse: false }
): boolean {
  // Lấy path của block hiện tại
  const currentBlockPath = editor.getCurrentBlockPath();
  if (!currentBlockPath) return false;

  // Xác định vị trí cần đặt block mới
  let targetBlockPath = configs?.reverse
    ? currentBlockPath
    : Path.next(currentBlockPath);

  // Tạo block mới dựa trên type
  const block = editor.buildBlock(additionalProps);

  // Chèn block vào editor
  Transforms.insertNodes(editor, block, { at: targetBlockPath });

  if (!configs?.reverse)
    Transforms.select(editor, Editor.start(editor, targetBlockPath));

  return true;
}
