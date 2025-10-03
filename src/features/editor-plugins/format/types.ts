import type { BlockType, MarkType } from "@/features/editor/types";

/**
 * Giao diện FormatEditor cung cấp các phương thức để định dạng nội dung trong trình soạn thảo.
 *
 */
export interface FormatEditor {
	/**
	 * Chuyển đổi kiểu block hiện tại sang kiểu block được chỉ định.
	 * @param {BlockType} format - Kiểu block cần chuyển đổi (ví dụ: "paragraph", "heading", v.v.)
	 * @example
	 * editor.toggleBlock("heading");
	 */
	toggleBlock: (format: BlockType) => void;

	/**
	 * Chuyển đổi trạng thái của một mark (định dạng văn bản) cho selection hiện tại.
	 * @param {MarkType} format - Loại mark cần chuyển đổi (ví dụ: "bold", "italic", "underline", v.v.)
	 * @example
	 * editor.toggleMark("bold");
	 */
	toggleMark: (format: MarkType) => void;

	/**
	 * Kiểm tra xem block hiện tại có phải là loại được chỉ định không
	 * @param {string} type - Loại block cần kiểm tra
	 * @returns {boolean} True nếu block hiện tại khớp với loại được chỉ định
	 * @example
	 * const isParagraph = editor.isBlockType("paragraph");
	 */
	isBlockType: (type: BlockType) => boolean;

	/**
	 * Kiểm tra xem một mark (định dạng text) có đang active không
	 * @param {string} format - Loại mark cần kiểm tra (bold, italic, underline, etc.)
	 * @returns {boolean} True nếu mark đang được áp dụng cho selection hiện tại
	 * @example
	 * const isBold = editor.isMarkActive("bold");
	 * const isItalic = editor.isMarkActive("italic");
	 */
	isMarkActive: (format: MarkType) => boolean;
}
