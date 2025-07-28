import type { BlockType } from "@/features/editor/types";

export default interface UtilsEditor {
  /**
   * Lấy loại block hiện tại mà cursor đang ở
   * @returns {string | null} Loại block hiện tại hoặc null nếu không xác định được
   * @example
   * const blockType = editor.getCurrentBlockType();
   * console.log(blockType); // "paragraph", "heading-one", etc.
   */
  getCurrentBlockType: () => BlockType | null;

  /**
   * Kiểm tra xem block hiện tại có rỗng (không có text) không
   * @returns {boolean} True nếu block hiện tại rỗng
   * @example
   * if (editor.isCurrentBlockEmpty()) {
   *   // Thực hiện action khi block rỗng
   * }
   */
  isCurrentBlockEmpty: () => boolean;
}
