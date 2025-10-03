import type { Editor } from "slate";
import { handleDeletePage, handleEnterPage } from "./actions";
import type { PageBlockEditor } from "./types";

/**
 * /**
 * Plugin dùng để mở rộng Editor với các chức năng đặc biệt cho Block Page,
 * bao gồm xử lý phím tắt, xoá và thêm trang mới.
 *
 * Sử dụng để tích hợp các hành vi tuỳ chỉnh cho Block Page trong Slate Editor.
 *
 * @param editor Editor cần mở rộng
 * @returns Editor đã được mở rộng với các chức năng cho Block Page
 */
export default function withPageBlock(editor: Editor & PageBlockEditor) {
	const { deleteBackward, deleteForward } = editor;

	editor.handleEnterPage = (workspaceId, navigateFn) =>
		handleEnterPage(editor, workspaceId, navigateFn);

	editor.handleDeletePage = () => handleDeletePage(editor);

	// Xử lý việc xoá trang
	editor.deleteBackward = (options) => {
		const handle = handleDeletePage(editor);
		if (!handle) deleteBackward(options);
	};

	editor.deleteForward = (options) => {
		const handle = handleDeletePage(editor);
		if (!handle) deleteForward(options);
	};

	return editor;
}
