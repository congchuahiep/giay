import type { BlockType } from "@/features/editor/types";
import type { ElementBlock } from "@/features/editor/types/block";
import type { Element, NodeEntry, Path } from "slate";

export default interface UtilsEditor {
  /**
   * Tạo block mới dựa trên type, lưu ý này chỉ là khởi tạo block
   * chưa có gắn block lên editor
   */
  buildBlock: (
    blockType?: BlockType,
    additionalProps?: Record<string, any>
  ) => Element;

  /**
   * Tạo `id` theo chuẩn uuidv4
   */
  generateId: () => string;

  /**
   * Đảm bảo block có UUID (thêm nếu chưa có)
   */
  ensureBlockId: (block: any) => Element;

  /**
   * Lấy block hiện tại ở vị trí con trỏ đang ở trong editor.
   *
   * @returns {ElementBlock | undefined} Block hiện tại dưới dạng Element,
   * hoặc null nếu không xác định được.
   *
   * @example
   * const currentBlock = editor.getCurrentBlock();
   * if (currentBlock) {
   *   // Xử lý với block hiện tại
   * }
   */
  getCurrentBlock: () => ElementBlock | undefined;

  /**
   * Lấy block entry hiện tại ở vị trí con trỏ đang ở trong editor.
   *
   * @returns {NodeEntry<ElementBlock> | undefined} Là một mảng chứa hai giá trị:
   * - Block hiện tại dưới dạng Element, hoặc null nếu không xác định được.
   * - Vị trí Path hiện tại của Block.
   *
   * @example
   * const currentBlockEntry = editor.getCurrentBlockEntry();
   * if (currentBlockEntry) {
   *   // Xử lý với block hiện tại
   * }
   */
  getCurrentBlockEntry: () => NodeEntry<ElementBlock> | undefined;

  /**
   * Lấy vị trí Path tại ví trị con trỏ đang ở trong editor.
   *
   * @returns {Path | undefined} Vị trí Path hoặc null
   */
  getCurrentBlockPath: () => Path | undefined;

  /**
   * Lấy loại block hiện tại mà cursor đang ở
   * @returns {string | undefined} Loại block hiện tại hoặc null nếu không xác định được
   * @example
   * const blockType = editor.getCurrentBlockType();
   * console.log(blockType); // "paragraph", "heading-one", etc.
   */
  getCurrentBlockType: () => BlockType | undefined;

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
