import type { BlockType } from "@/features/editor/types";
import { Editor, Transforms } from "slate";

/**
 * Ngắt dòng và chèn một khối mới vào vị trí hiện tại của con trỏ trong editor.
 * Hàm này dùng để ghi đè lại hành vi khi người dùng nhấn phím "Enter" trong slate,
 * cho phép ngắt và tạo dòng mới.
 *
 * Hàm này kiểm tra vị trí của con trỏ trong khối hiện tại:
 * - Nếu con trỏ ở cuối khối, sẽ chèn một khối mới sau khối hiện tại.
 * - Nếu con trỏ ở đầu khối, sẽ chèn một khối mới trước khối hiện tại.
 * - Nếu con trỏ ở giữa khối, sẽ tách khối tại vị trí con trỏ và chuyển đổi phần sau
 * thành loại khối mới.
 *
 * @param editor Editor hiện tại.
 * @param blockType Loại khối cần chèn (mặc định là "paragraph").
 * @param additionalProps - Các thuộc tính bổ sung cho block mới.
 * @returns {boolean} Trả về false nếu không thể chèn, ngược lại không trả về gì.
 */
export function insertBlockAndBreak(
  editor: Editor,
  blockType: BlockType = "paragraph",
  additionalProps: Record<string, any> = {}
): boolean {
  const { selection } = editor;
  const path = editor.getCurrentBlockPath();

  if (!path || !selection) return false;

  const isEnd = Editor.isEnd(editor, selection.anchor, path);
  const isStart = Editor.isStart(editor, selection.anchor, path);

  if (isEnd) {
    editor.insertBlock({ ...additionalProps, type: blockType });
  } else if (isStart) {
    editor.insertBlock({ ...additionalProps, type: blockType }, { reverse: true });
  } else {
    Transforms.splitNodes(editor);
    Transforms.setNodes(editor, {
      id: editor.generateId(),
      type: blockType,
      ...additionalProps
    });
  }

  return true;
}
