import type { Editor } from "slate";

/**
 * Xử lý việc xoá trang, đơn giản đánh dấu trường `isDeleted` là `true`, còn
 * phần xử lý logic sẽ được xử lý trong chính `PageBlock` component
 *
 * @param editor
 * @returns
 */
export default function handleDeletePage(editor: Editor): boolean {
	const currentBlock = editor.getCurrentBlock();
	const currentBlockPath = editor.getCurrentBlockPath();

	if (currentBlock?.type === "page") {
		editor.setNodes({ isDeleted: true }, { at: currentBlockPath });
		return true;
	}
	return false;
}
