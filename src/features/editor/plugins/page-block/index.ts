import type { Editor } from "slate";
import handleDeletePage from "./handleDeletePage";
import handleEnterPage from "./handleEnterPage";
import type { PageBlockEditor } from "./interface";

export { default as PageBlockShortcutExtension } from "./PageBlockShortcutExtension";

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
export const withPageBlock = (editor: Editor & PageBlockEditor) => {
	const { deleteBackward, deleteForward } = editor;

	editor.handleEnterPage = (editor, workspaceId, navigateFn) =>
		handleEnterPage(editor, workspaceId, navigateFn);

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
};

export type { PageBlockEditor };
