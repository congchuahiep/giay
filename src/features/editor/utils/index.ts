import type UtilsEditor from "@/features/editor/utils/interface";
import type { Editor } from "slate";
import getCurrentBlockType from "./getCurrentBlockType";
import isCurrentBlockEmpty from "./isCurrentBlockEmpty";

export type { UtilsEditor };

/**
 * Plugin này chung cấp các phương thức tiện ích cho editor, mục đích của
 * các phương thức này là cho phép các phương thức của các plugin khác được
 * sử dụng chung
 *
 * Sử dụng: `editor.<tên tiện ích>`
 */
export function withUtilsEditor(editor: Editor): Editor & UtilsEditor {
  editor.getCurrentBlockType = () => getCurrentBlockType(editor);
  editor.isCurrentBlockEmpty = () => isCurrentBlockEmpty(editor);

  return editor;
}
