import type { Editor } from "slate";
import handleDeleteBackward from "./handleDeleteBackward";
import handleDeleteFragment from "./handleDeleteFragment";
import { handleDeleteFirstBlock } from "@/features/editor/delete/handleDeleteFirstBlock";
import type DeleteEditor from "@/features/editor/delete/interface";

export type { DeleteEditor };

/**
 * Plugin này điều chỉnh lại hành vi mặc định của editor khi người dùng thực
 * thi chức năng xoá:
 * - Xoá một  ký tự bằng `backspace` hoặc `delete`
 * - Xoá nhiều ký tự (bằng bất kỳ phím)
 */
export function withDeleteHandler(editor: Editor): Editor & DeleteEditor {
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
