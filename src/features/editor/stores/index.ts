import type { Descendant, Editor } from "slate";
import { saveContentToLocal } from "./localStorage";
import useDragStore from "@/features/editor/stores/dragStore";

const saveEditorContent = (editor: Editor) => {
  return (value: Descendant[]) => {
    // Chỉ được phép lưu khi hoạt động của người dùng khác "set_selection" - "chọn"
    const isAstChange = editor.operations.some(
      (op) => op.type !== "set_selection"
    );
    if (isAstChange) {
      // Save the value to Local Storage.
      saveContentToLocal(value);
    }
  };
};

export default saveEditorContent;

export { useDragStore };
