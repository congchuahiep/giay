import type { Editor } from "slate";
import {
	insertBlock,
	insertBlockAndBreak,
	insertBreak,
	insertNodes,
	insertSoftBreak,
} from "./actions";
import type { InsertEditor } from "./types";

export default function withInsertEditor(
	editor: Editor,
): Editor & InsertEditor {
	// editor.insertNumberedList = () => insertNumberedList(editor);

	const { insertNodes: oldInsertNodes } = editor;

	/**
	 * Thêm một/nhiều node vào trong editor, đã đảm bảo rằng nếu node là element
	 * thì sẽ thêm trường `id` vào
	 *
	 * @param nodes
	 * @param options
	 */
	editor.insertNodes = (nodes, options) => {
		const nodesWithId = insertNodes(editor, nodes);

		oldInsertNodes(nodesWithId, options);
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
