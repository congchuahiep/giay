// import insertNumberedList from "@/features/editor/insert/insertNumberedList";
import insertBlock from "@/features/editor/insert/insertBlock";
import insertBreak from "@/features/editor/insert/insertBreak";
import type InsertEditor from "@/features/editor/insert/inteface";
import { Editor } from "slate";

export type { InsertEditor };

export function withInsertEditor(editor: Editor): Editor & InsertEditor {
  // editor.insertNumberedList = () => insertNumberedList(editor);

  editor.insertBlock = (blockType, configs, additionalProps) =>
    insertBlock(editor, blockType, configs, additionalProps);

  /**
   * Ghi đè lại hành vi mặc định khi "ngắt dòng", tức xử lý việc tách block
   * khi người dùng nhấn phím "enter"
   */
  editor.insertBreak = () => {
    const currentBlockType = editor.getCurrentBlockType();

    switch (currentBlockType) {
      case "bulletList":
      case "checkList":
        insertBreak(editor, currentBlockType);
        break;
      case "code":
        editor.insertText("\n");
        break;
      default:
        insertBreak(editor);
    }
  };

  /**
   * Ghi đè lại hành vi mặc định khi người dùng nhấn phím "shift-enter", mặc
   * định là tạo "\n" tức ký tự xuống dòng trong block, nhưng với một số trường
   * hợp đặc biệt khác sẽ có cách xử lý riêng
   */
  editor.insertSoftBreak = () => {
    const currentBlockType = editor.getCurrentBlockType();

    switch (currentBlockType) {
      case "code":
        insertBreak(editor);
        break;
      default:
        editor.insertText("\n");
    }
  };

  return editor;
}
