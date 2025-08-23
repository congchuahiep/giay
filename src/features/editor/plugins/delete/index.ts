import type { Editor } from "slate";
import handleDeleteBackward from "./handleDeleteBackward.ts";
import handleDeleteFragment from "./handleDeleteFragment.ts";
import { handleDeleteFirstBlock } from "@/features/editor/plugins/delete/handleDeleteFirstBlock.ts";
import type DeleteEditor from "@/features/editor/plugins/delete/interface.ts";

export type { DeleteEditor };

/**
 * Plugin này điều chỉnh lại hành vi mặc định của editor khi người dùng thực
 * thi chức năng xoá:
 * - Xoá một  ký tự bằng `backspace` hoặc `delete`
 * - Xoá nhiều ký tự (bằng bất kỳ phím)
 */
export function withDeleteEditor(editor: Editor): Editor & DeleteEditor {
  const { deleteBackward, deleteFragment, deleteForward } = editor;

  editor.deleteBackward = (...args) => {
    const handled = handleDeleteBackward(editor);
    if (!handled) {
      deleteBackward(...args);
    }
  };

  // Chưa xử lý vì chưa biết nó có hành vi nào khùng đin khum
  editor.deleteForward = (...args) => {
    deleteForward(...args);
  };

  editor.deleteFragment = (...args) => {
    const handled = handleDeleteFragment(editor);
    if (!handled) {
      deleteFragment(...args);
    }
  };

  editor.handleDeleteFirstBlock = (event) =>
    handleDeleteFirstBlock(editor, event);

  return editor;
}
