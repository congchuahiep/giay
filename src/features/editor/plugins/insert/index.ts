// import insertNumberedList from "@/features/editor/insert/insertNumberedList";
import insertBlock from "@/features/editor/plugins/insert/insertBlock";
import { insertBlockAndBreak } from "@/features/editor/plugins/insert/insertBlockAndBreak";
import insertBreak from "@/features/editor/plugins/insert/insertBreak";
import insertSoftBreak from "@/features/editor/plugins/insert/insertSoftBreak";
import type InsertEditor from "@/features/editor/plugins/insert/inteface";
import { Editor } from "slate";

export type { InsertEditor };

export function withInsertEditor(editor: Editor): Editor & InsertEditor {
  // editor.insertNumberedList = () => insertNumberedList(editor);

  const { insertNodes } = editor;

  /**
   * Thêm một/nhiều node vào trong editor, đã đảm bảo rằng nếu node là element
   * thì sẽ thêm trường `id` vào
   *
   * @param nodes
   * @param options
   */
  editor.insertNodes = (nodes, options) => {
    nodes = Array.isArray(nodes) ? nodes : [nodes];
    const nodesWithId = nodes.map((node) => {
      if ("type" in node && typeof node === "object" && !node.id) {
        return editor.ensureBlockId(node);
      }
      return node;
    });

    insertNodes(nodesWithId, options);
  };

  editor.insertBlock = (additionalProps, configs) =>
    insertBlock(editor, additionalProps, configs);

  editor.insertBlockAndBreak = (blockType, additionalProps) =>
    insertBlockAndBreak(editor, blockType, additionalProps);

  /**
   * Ghi đè lại hành vi mặc định khi "ngắt dòng", tức xử lý việc tách block
   * khi người dùng nhấn phím "enter"
   */
  editor.insertBreak = () => insertBreak(editor);

  /**
   * Ghi đè lại hành vi mặc định khi người dùng nhấn phím "shift-enter", mặc
   * định là tạo "\n" tức ký tự xuống dòng trong block, nhưng với một số trường
   * hợp đặc biệt khác sẽ có cách xử lý riêng
   */
  editor.insertSoftBreak = () => insertSoftBreak(editor);

  return editor;
}
